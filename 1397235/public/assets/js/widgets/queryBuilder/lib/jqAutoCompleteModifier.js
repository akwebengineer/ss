/**
 * Module that overrides jQuery Autocomplete functionality
 *
 * @module AutocompleteModifier
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'lib/template_renderer/template_renderer',
    'jqAutoComplete',
    'widgets/queryBuilder/util/queryFinder',
    '../util/constants',
    'text!widgets/queryBuilder/templates/relationalOperator.html'
], /** @lends AutocompleteModifier */
function(render_template, jqAutoComplete, QueryFinder, CONSTANTS, relOpTemplate) {

    var AutocompleteModifier = function(options) {
        var vent = options.vent,
        keyCode = $.ui.keyCode;
        /*
         * Modifies JqAutoComplete library's functions.
         */
        var  modifyJqAutocomplete = function() {

            var Autocomplete = $.Autocomplete;
            var currentIndex= 0;

            // Method to set / adjust the width of the suggestion popup
            var setContainerWidth = function (popupObj) {
                // Only set width if it was provided:
                if (popupObj.width !== 'auto') {
                    popupObj.container.css('width', popupObj.width);
                }else{
                    popupObj.container.css('width', 'auto');
                }

                // Override the static width for logical operators
                if(popupObj.state && popupObj.state.expectedState == CONSTANTS.state.anyLogicalOperator){
                    popupObj.container.css('width', 100);
                }

            };

            /**
             * This function gets suggestions based on current state.
             * Grep will only match the suggestions starting with the entered character.
             */
            Autocomplete.prototype.getSuggestions = function() {

                var options = this.options;
                var that = this;
                var queryLowerCase = that.query.toLowerCase();

                /**
                 * @param(Array of objects): data to show the suggestions.
                 * @param(Boolean): indicates whether to show the matching suggestions or not. Default is false.
                 */
                options.lookup(that.query, function (data, withoutMatch) {
                    var currentSuggestion = data.suggestions;
                    // In case last character of the query is close paren, then in these mentioned states - do not show any popups
                    if ((that.currentValue.trim().slice(-1) == ")") && (that.state.expectedState == CONSTANTS.state.nodeSpace || that.state.expectedState == CONSTANTS.state.closeParen)) {
                        that.suggestions = [];
                    } else {
                        if (!withoutMatch) {
                            var formattedData = {
                                suggestions: $.grep(currentSuggestion, function (suggestion) {
                                    return suggestion.value.toLowerCase().indexOf(queryLowerCase) === 0;
                                })
                            };
                            that.suggestions = formattedData.suggestions;
                        } else {
                            that.suggestions = currentSuggestion;
                        }
                    }
                    vent.trigger("query.autocomplete.onSuggestionLoad", that.suggestions);
                    that.suggest();
                    options.onSearchComplete.call(that.element, that.query, that.suggestions);
                }, that.state);

            };

            /**
             * Get the query based on the cursor position and delimiter.
             */
            Autocomplete.prototype.getQuery = function() {
                var query = this.queryFinder.findQuery(this.state, this.options.delimiter);
                return query;
            };

            /**
             * Creates an entire query which will be appended to the filterbar which includes the newly selected suggestion.
             */
            Autocomplete.prototype.getValue = function(selectedValue) {
                this.selectedSuggestion = selectedValue;
                var actString = this.queryFinder.setValue(this.query, this.state, selectedValue, this.options.delimiter);
                return actString;
            };

            /**
             * This function initiates the lookup process when the state of query changes.
             */
            Autocomplete.prototype.onValueChange = function () {
                var options = this.options,
                    value = this.el.val(),
                    query = this.getQuery(this.state);

                this.query = query;
                this.currentValue = value;
                this.selectedIndex = -1;

               // Check existing suggestion for the match before proceeding:
                if (options.triggerSelectOnValidInput && this.isExactMatch(query)) {
                    this.hide();
                }

                this.getSuggestions();
            };

            /**
             * Function to format and show the suggestion.
             */
            Autocomplete.prototype.suggest = function () {
                var suggestionArr = [];

                if (!this.suggestions.length) {
                    if (this.options.showNoSuggestionNotice) {
                        this.noSuggestions();
                    } else {
                        this.hide();
                    }
                    return;
                }

                var that = this,
                    options = that.options,
                    formatResult = options.formatResult,
                    value = that.query, // required to highlight the query in suggestions --- IMP
                    className = that.classes.suggestion,
                    classSelected = that.classes.selected,
                    container = $(that.suggestionsContainer),
                    noSuggestionsContainer = $(that.noSuggestionsContainer),
                    beforeRender = options.beforeRender,
                    beforeShow = options.beforeShow,
                    html = '';

                if (options.triggerSelectOnValidInput && that.isExactMatch(value)) {
                    that.hide();
                    return;
                };

                // Build suggestions inner HTML:
                $.each(that.suggestions, function (i, suggestion) {
                    //check the state, so as to adjust the styling of the particular suggestion box respectively
                    suggestionArr.push({
                        "index": i,
                        "rOperator": formatResult(suggestion, value, i),
                        "label": suggestion.label,
                        "autocompleteClass": className,
                        "relOperatorClass": that.state.expectedState == CONSTANTS.state.relationalOperator ? "relOperatorClass" : undefined
                        });
                });

                html = render_template(relOpTemplate, {"suggestion": suggestionArr});

                this.adjustContainerWidth(); // This method is defined in autocomplete library

                noSuggestionsContainer.detach();
                container.html(html);

                if ($.isFunction(beforeRender)) {
                    beforeRender.call(that.element, container, that.suggestions);
                }

                that.fixPosition();
                if ($.isFunction(beforeShow)) {
                    beforeShow.call(that.element, container);
                }

                setContainerWidth({"container": container, "width": options.width, "state": that.state});

                container.show();

                // Select first value by default:
                if (options.autoSelectFirst) {
                    that.selectedIndex = 0;
                    container.scrollTop(0);
                    container.children('.' + className).first().addClass(classSelected);
                }

                that.visible = true;
            };

            /**
             * Initialize method of jqAutoComplete to listen for state change events from parser.
             */
            Autocomplete.prototype.initialize = function() {
                var that = this,
                    suggestionSelector = '.' + that.classes.suggestion,
                    selected = that.classes.selected,
                    options = that.options,
                    container;

                // Remove autocomplete attribute to prevent native suggestions:
                that.element.setAttribute('autocomplete', 'off');

                that.noSuggestionsContainer = $('<div class="autocomplete-no-suggestion"></div>')
                                              .html(this.options.noSuggestionNotice).get(0);

                that.suggestionsContainer = Autocomplete.utils.createNode(options.containerClass);

                container = $(that.suggestionsContainer);

                container.appendTo(options.appendTo || 'body');

                setContainerWidth({"container": container, "width": options.width});

                // Listen to click events on body and show / hide suggestions depending on what was clicked
                $('body').on('click.body.querybuilder', function (e) {
                    if (!that.visible) {
                        if (e.target == that.el[0]) {
                            var _evt = $.Event("keyup", { which: keyCode.SHIFT, keycode: keyCode.SHIFT });
                            that.el.trigger(_evt);
                        }
                    }
                    else {
                        if (e.target != that.el[0] && !($(that.suggestionsContainer).has($(e.target)).length))  {
                            that.hide();
                        }
                    }
                });

                // Listen for mouse over event on suggestions list:
                container.on('mouseover.autocomplete', suggestionSelector, function () {
                    that.activate($(this).find("span:first").data('index'));
                });

                // Deselect active element when mouse leaves suggestions container:
                container.on('mouseout.autocomplete', function () {
                    that.selectedIndex = -1;
                    container.children('.' + selected).removeClass(selected);
                });

                // Listen for click event on suggestions list:
                container.on('click.autocomplete', suggestionSelector, function (e) {
                    that.select($(this).find("span:first").data('index'));
                    clearTimeout(that.blurTimeoutId);
                    e.stopPropagation();
                });

                that.fixPositionCapture = function () {
                    if (that.visible) {
                        that.fixPosition();
                    }
                };

                $(window).on('resize.autocomplete', that.fixPositionCapture);

                that.queryFinder = new QueryFinder($(this.element));

                that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
                // Listen for state change event here.
                vent.on('query.autocomplete.state', function (obj) { that.onStateChange(obj); });
            };

            /**
             * This method will append the selected suggestion to the container and triggers keyup event to verify the new query from grammar.
             * Overriding this method of jqAutoComplete to remove unnecessary code and to trigger the keyup event on select.
             *
             * @param {Number}: index of the selected suggestion element
             */
            Autocomplete.prototype.onSelect = function (index) {
                var that = this,
                    suggestion = that.suggestions[index];
                that.currentValue = that.getValue(suggestion.value);
                that.el.trigger('keyup');
                that.selection = suggestion;

            };

            /**
             * Overriding the implementation of this method from autoComplete library to change the behavior of tab key.
             * As per UX specs, Tab key should behave exactly same as Enter key. Only difference is that Enter key press should format the query and execute the search if the query is valid.
             * Escape key press should hide the autocomplete container.
             *
             * @param {Object} - keyPress event object
             */
            Autocomplete.prototype.onKeyPress = function (e) {
                var that = this;
                var keys = $.ui.keyCode;

                // If suggestions are hidden and user presses arrow down, display suggestions:
                if (!that.disabled && !that.visible && e.which === keys.DOWN && that.currentValue) {
                    that.suggest();
                    return;
                }

                if (that.disabled || !that.visible) {
                    return;
                }

                switch (e.which) {
                    case keys.ESCAPE:
                        that.hide();
                        break;
                    case keys.RIGHT:
                        if (that.hint && that.options.onHint && that.isCursorAtEnd()) {
                            that.selectHint();
                            break;
                        }
                        return;
                    case keys.TAB:
                    case keys.ENTER:
                        if (that.selectedIndex === -1) {
                            that.hide();
                            return;
                        }
                        that.select(that.selectedIndex);
                        break;
                    case keys.UP:
                        that.moveUp();
                        break;
                    case keys.DOWN:
                        that.moveDown();
                        break;
                    default:
                        return;
                }

                // Cancel event if function did not return:
                e.stopImmediatePropagation();
                e.preventDefault();
            }

            /**
             * Sets the new state and trigger onValueChange method. This method will initiate the process to show suggestions.
             * @param {Object} - current state of query
             */
            Autocomplete.prototype.onStateChange = function (state) {
                var that = this;
                that.state = state;
                that.onValueChange();
            };

        };

        var init = function() {
            modifyJqAutocomplete();
        };

        init();
    };

    return AutocompleteModifier;
});
