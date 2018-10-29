/*
 * jQuery UI Tag-it!
 *
 * @version v2.0 (06/2011)
 *
 * Copyright 2011, Levy Carneiro Jr.
 * Released under the MIT license.
 * http://aehlke.github.com/tag-it/LICENSE
 *
 * Homepage:
 *   http://aehlke.github.com/tag-it/
 *
 * Authors:
 *   Levy Carneiro Jr.
 *   Martin Rehfeld
 *   Tobias Schmidt
 *   Skylar Challand
 *   Alex Ehlke
 *
 * Maintainer:
 *   Alex Ehlke - Twitter: @aehlke
 *
 * Dependencies:
 *   jQuery v1.4+
 *   jQuery UI v1.8+
 */
/* Updated by Miriam Hadfield */
/* Updated by Vidushi Gupta */
/* Updated by Andrew Chasin */

/* Design Key points: -
 There is a state engine that understands the current user input & expected user input in order to carry data validations.
 Different states are defined in _createTokenHandler method.
 For understanding - All the li elements are the tags as per the tag_it library legacy code
 Few tags constitute valid token containing singletoken | key value token
 All the li elements of the key value token consist a token ID in the element class to group the tags & present as one token
 For precedence:-
 Stack data structure is used to maintain the open brackets states.
 The respective open & close brackets are named with a common name in the DOM element.
 */

(function ($) {
    $.widget('ui.tagit', {
        options: {
            // allowDuplicates: false,    // This config is from library & as per current implementation no more required
            caseSensitive: true,
            fieldName: 'tags',
            placeholderText: null,   // Sets `placeholder` attr on input field.
            readOnly: false,  // Disables editing.
            // removeConfirmation: false,  // Require confirmation to remove tags. // This config is from library & as per current implementation no more required
            tagLimit: null,   // Max number of tags allowed (null for unlimited).

            source: [], //contains defined filterMenu
            originalSource: [], //contains copy of original defined filterMenu
            logicalOperator: [], //contains Logical operators menu
            defaultOperators: [], //contains default set of operators used between key/value pair

            // Used for autocomplete, unless you override `autocomplete.source`.
            availableTags: [],

            // Use to override or add any options to the autocomplete widget.
            //
            // By default, autocomplete.source will map to availableTags,
            // unless overridden.
            autocomplete: {},

            // Defines whether or not tokens are created when the user hits the Enter key.
            tokenizeOnEnter: true,

            // Shows autocomplete before the user even types anything.
            showAutocompleteOnFocus: false,

            // When enabled, quotes are unneccesary for inputting multi-word tags.
            allowSpaces: false,

            // The below options are for using a single field instead of several
            // for our form values.
            //
            // When enabled, will use a single hidden field for the form,
            // rather than one per tag. It will delimit tags in the field
            // with singleFieldDelimiter.
            //
            // The easiest way to use singleField is to just instantiate tag-it
            // on an INPUT element, in which case singleField is automatically
            // set to true, and singleFieldNode is set to that element. This
            // way, you don't need to fiddle with these options.
            singleField: false,

            // This is just used when preloading data from the field, and for
            // populating the field with delimited tags as the user adds them.
            singleFieldDelimiter: ',',

            // Set this to an input DOM node to use an existing form field.
            // Any text in it will be erased on init. But it will be
            // populated with the text of tags as they are created,
            // delimited by singleFieldDelimiter.
            //
            // If this is not set, we create an input node for it,
            // with the name given in settings.fieldName.
            singleFieldNode: null,

            // Whether to animate tag removals or not.
            animate: true,

            // Optionally set a tabindex attribute on the input that gets
            // created for tag-it.
            tabIndex: null,

            // Define a filter as a key-value set. Possible values:
            // BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, SPACE: 32, PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36,
            // LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, NUMPAD_ENTER: 108, COMMA: 188, COLON: 187

            // Event callbacks.
            beforeTagAdded: null,
            afterTagAdded: null,

            beforeTagRemoved: null,
            afterTagRemoved: null,

            onTagClicked: null,
            onTagLimitExceeded: null,

            afterPartialTokenUpdated: null,

            // Defines if token completion events will be generated as a user types tokens, even if the token has not been completed.
            allowPartialTokens: false,

            // DEPRECATED:
            //
            // /!\ These event callbacks are deprecated and WILL BE REMOVED at some
            // point in the future. They're here for backwards-compatibility.
            // Use the above before/after event callbacks instead.
            onTagAdded: null,
            onTagRemoved: null,
            // `autocomplete.source` is the replacement for tagSource.
            //tagSource: null // This code is from library & as per current implementation no more required
            // Do not use the above deprecated options.

            implicitLogicOperator: false,
            keyTokens: {
                // maxNumber: 1, // define the maximum number of keys allowed in search expression | default is noLimit
                position: "any" // defines the position where the keys cann be a valid input | default is "any"
            }
        },

        _create: function () {
            // for handling static scoping inside callbacks
            var that = this;
            this.initialize();

            // There are 2 kinds of DOM nodes this widget can be instantiated on:
            //     1. UL, OL, or some element containing either of these.
            //     2. INPUT, in which case 'singleField' is overridden to true,
            //        a UL is created and the INPUT is hidden.
            if (this.element.is('input')) {
                this.tagList = $('<ul></ul>').insertAfter(this.element);
                this.options.singleField = true;
                this.options.singleFieldNode = this.element;
                this.element.addClass('tagit-hidden-field');
            } else {
                this.tagList = this.element.find('ul, ol').andSelf().last();

                // Create the logical operator menu
                var selectTag = $('<ul id="logicOperatorMenu"></ul>')
                    .addClass('hideMenu ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all tagit-autocomplete')
                    .mousedown(function (e) {
                        that._updateLogicTag(e); // update the logical operator with selected value from drop down
                    });
                var dropDownValues = "";
                for (var j = 0; j < this.options.logicalOperator.length; j++) {
                    dropDownValues += '<li class="ui-menu-item" role="presentation"> <a class="ui-corner-all" tabindex="-1">' + that.options.logicalOperator[j] + '</a></li>';
                }
                this.element.closest('.search-widget').append($(selectTag).append(dropDownValues));
            }

            this.tagInput = $("<input type='text'/>").addClass('ui-widget-content');

            if (this.options.allowPartialTokens) {
                this.tagInput.focusin(function () {
                    $(this).closest("span.advanceSearchWrapper").addClass("active");
                }).focusout(function (event) {
                    $(this).closest("span.advanceSearchWrapper").removeClass("active");
                });

                this.tagInput.on("partialToken.change", function (event) {
                    // Partial tokens are allowed so trigger partialTokenUpdated events
                    // on each change of the input field.
                    that._afterPartialTokenUpdatedEvent(true);
                });
            }

            this.tagInputAutoComplete = this.options.autocomplete.inline && $(this.HTMLElements.autocompleteInputField);

            if (this.options.autocomplete.inline) {
                this.tagInput.focusin(function () {
                    $(this).closest("div.inlineToken").addClass("active");
                }).focusout(function (event) {
                    $(this).closest("div.inlineToken").removeClass("active");
                });
                this.tagInputWrapper = $(this.HTMLElements.inputfieldWrapper);
                this.tagInputWrapper.append(this.tagInput, this.tagInputAutoComplete);

                // Listen for input field changes and generate autocomplete results for keys
                this.tagInput.on("partialToken.showAutocomplete", function (event) {
                    that._showAutocomplete();
                });
            }

            if (this.options.readOnly) this.tagInput.attr('disabled', 'disabled');

            if (this.options.tabIndex) {
                this.tagInput.attr('tabindex', this.options.tabIndex);
            }

            if (this.options.placeholderText) {
                this.tagInput.attr('placeholder', this.options.placeholderText);
            }

            if (!this.options.autocomplete.source) {
                this.options.autocomplete.source = function (search, showChoices) {

                    var filterOnSearchTerm = true;
                    var adjustWidth;
                    var filter = search.term.toLowerCase();

                    var sourceArray = this.options.availableTags;
                    if (sourceArray.length == 0) {
                        this._createOriginalSourceCopy();
                        if (this.options.source instanceof Array) {
                            sourceArray = this.options.source;
                            if (_.isObject(sourceArray[0])) {
                                // indicates suggestion box with , | ⏎
                                filterOnSearchTerm = false;
                            }
                        } else {
                            // First time the suggestion dropdown is filled with config labels as keys
                            sourceArray = this.helperObj.keysArray;
                        }

                    }

                    if (filterOnSearchTerm) {
                        var choices = $.grep(sourceArray, function (element) {
                            // Only match autocomplete options that begin with the search term.
                            // (Case insensitive.)
                            return (element && element.toLowerCase().indexOf(filter) === 0);
                        });
                        // This code is from library & as per current implementation no more required
                        // if (!this.options.allowDuplicates) {
                        //    choices = this._subtractArray(choices, this.assignedTags());
                        // }
                        showChoices(choices);
                        adjustWidth = this.helperObj.suggestionCardDefaultWidth; // keep a track of width provided by autocomplete
                    } else {
                        // indicates suggestion box with , | ⏎
                        showChoices(sourceArray);
                    }

                    if (!this.options.autocomplete.inline) {
                        if (!this.helperObj.suggestionCardDefaultWidth) {
                            this._getAutocompleteDefaultWidth();
                        } else {
                            this._adjustAutocompleteAlignment(adjustWidth);
                        }
                    }
                };
            }

            // function to perform styling changes before autocomplete box is opened.
            this.options.autocomplete.open = function (event, ui) {
                var $suggestionContainer = $(this);
                that.onAutoCompleteOpen(event, ui, $suggestionContainer);
            };

            if (this.options.showAutocompleteOnFocus) {
                this.tagInput.focus(function (event, ui) {
                    if (that.options.autocomplete.inline && !that._validateMultipleKeyToken(that.tagInput.val())) {
                        // if inline option & autocomplete is not meant to be shown
                        return;
                    }
                    that._showAutocomplete();
                });

                if (typeof this.options.autocomplete.minLength === 'undefined') {
                    this.options.autocomplete.minLength = 0;
                }
            }

            // Bind autocomplete.source callback functions to this context.
            if ($.isFunction(this.options.autocomplete.source)) {
                this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
            }

            // DEPRECATED.
            // This code is from library & as per current implementation no more required
            // if ($.isFunction(this.options.tagSource)) {
            //     this.options.tagSource = $.proxy(this.options.tagSource, this);
            // }

            this.tagList
                .addClass('tagit')
                .addClass('ui-widget ui-widget-content ui-corner-all')
                // Create the input field.
                .append($('<li class="tagit-new"></li>').append(this.tagInputWrapper || this.tagInput))
                .click(function (e) {
                    var $target = $(e.target);

                    if ($target.hasClass('tagit-label')) {
                        var tag = $target.closest('.tagit-choice');
                        if (!tag.hasClass('removed')) {
                            that._trigger('onTagClicked', e, {tag: tag, tagLabel: that.tagLabel(tag)});
                        }
                    } else {
                        // Sets the focus() to the input field, if the user
                        // clicks anywhere inside the UL. This is needed
                        // because the input field needs to be of a small size.
                        if (this.tablist) {
                            var tag = this.tablist;
                            $(tag).children(0).text($(tag).text() + " = ");
                        }
                        that.tagInput.focus();
                    }
                });

            // Single field support.
            var addedExistingFromSingleFieldNode = false;
            if (this.options.singleField) {
                if (this.options.singleFieldNode) {
                    // Add existing tags from the input field.
                    var node = $(this.options.singleFieldNode);
                    var tags = node.val().split(this.options.singleFieldDelimiter);
                    node.val('');
                    $.each(tags, function (index, tag) {
                        that.createTag(tag, null, true);
                        addedExistingFromSingleFieldNode = true;
                    });
                } else {
                    // Create our single field input after our list.
                    this.options.singleFieldNode = $('<input id=filtervalue" type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                    this.tagList.after(this.options.singleFieldNode);
                }
            }

            // Add existing tags from the list, if any.
            if (!addedExistingFromSingleFieldNode) {
                this.tagList.children('li').each(function () {
                    if (!$(this).hasClass('tagit-new')) {
                        that.createTag($(this).text(), $(this).attr('class'), true);
                        $(this).remove();
                    }
                });
            }

            this._keyboardHandling(); // Keyboard Events

            if (!(this.options.autocomplete && this.options.autocomplete.inline)) {
                this._mouseHandling(); // Mouse Events        
            }
        },

        onAutoCompleteOpen: function (event, ui, $suggestionContainer) {

            var that = this;
            var $autoCompleteContainer = $suggestionContainer.autocomplete("widget");

            // Get all the list elemets of autocomplete box and check if it belongs to keyHelperMenu or not.
            $autoCompleteContainer.find('li').each(function (index) {
                var $list = $(this);
                var labelText = $list.text();
                var labelHtml = $list.html();
                var helperMessage;

                var menu = that.keyHelperMenu;
                for (var item in menu) {
                    //if the list item belongs to keyHelperMenu, add the span for styling
                    if (menu[item].value == labelText.charAt(0) && labelText.indexOf('  ') != -1) {
                        //split on the keyHelperMenu object's value and build the message
                        var message = labelText.split(menu[item].value);
                        helperMessage = menu[item].value + '<span class="keyHelper-color">' + message[1] + '</span>';
                    }
                }

                // If the helperMessage is available, append the new message.
                if (helperMessage) {
                    var newHtml = labelHtml.replace(labelText, helperMessage);
                    $list.html(newHtml);
                }
            });

            // Increase the width of autocomplete box
            // calulation: get the precalculated suggestion card width by the library and add extra width.

            $autoCompleteContainer.css({
                "width": ($autoCompleteContainer.width() + this.extraWidth + "px")
            });
            return true;
        },

        _keyboardHandling: function () {

            var that = this;

            this.helperObj.prevInputValue = "";

            if (this.options.allowPartialTokens || this.options.autocomplete.inline) {
                this.tagInput.keyup(function (event) {
                    var inputField = $(this);
                    if (event.which != $.ui.keyCode.ENTER && event.which != $.ui.keyCode.TAB) {
                        if (that.helperObj.prevInputValue != inputField.val()) {
                            if (that._validateMultipleKeyToken(inputField.val())) {
                                inputField.trigger("partialToken.showAutocomplete");
                            }
                            inputField.trigger("partialToken.change");
                            that.helperObj.prevInputValue = inputField.val();
                        }
                    }
                });
            }

            this.tagInput
                .keydown(function (event) {
                    var inputValue = that._cleanedInput();

                    // Backspace is not detected within a keypress, so it must use keydown.
                    if (event.which == $.ui.keyCode.BACKSPACE) {
                        if (that.tagInput.val() === '') {
                            //When backspace is pressed, the last token is deleted.
                            if (that._lastTag().length) {
                                if (that.options.implicitLogicOperator) {
                                    // remove implicit logic operator
                                    that._setOption("source", that.helperObj.keysArray);
                                }
                                else {
                                    that._setOption("source", that.options.logicalOperator); // set the next list of autosuggestion
                                }
                                // execute only if there is a tag meant to be deleted
                                that._updateCurrentTokenState("keyValueTokenComplete"); // previous token state is complete, hence the the right current state on removal
                                that._removeEntireToken(that._getTokenIDFromTag(that._lastTag()));
                                that.tagInput.focus();
                            }
                        } else {
                            // find the deleted character to set/remove the error states
                            var lastChar = inputValue.slice(-1); // get the last char
                            switch (lastChar) {
                                case "=":
                                case "<":
                                case ">":
                                case ")":
                                    var secondLastChar = inputValue.slice(-2, -1); // get the second last char
                                    if (secondLastChar == "<" || secondLastChar == ">" || secondLastChar == "=") {
                                        // test if the value present is a valid key -> accordingly set|remove the error state
                                        // If there are associated operators with the text value, then verify that it's a valid key.
                                        if (that.helperObj.keysOperatorsHash[textVal.toLowerCase()]) {
                                            that._isValidKey(inputValue.slice(0, -2));
                                        }
                                    } else {
                                        // reset the state to be treated as new cycle for the token
                                        that._resetNewTokenState();
                                    }
                            }
                        }
                    }

                    if (event.which == $.ui.keyCode.TAB) { // Finish the auto-completed token
                        if (that.options.autocomplete.inline && that.tagInputAutoComplete.val() != "") {
                            var currentInputVal = that.tagInputAutoComplete.val();
                            if (that._isValidValue(currentInputVal)) {
                                var associatedInputObject = that._getObjectFromHash(currentInputVal, that.helperObj.keysHash);
                                that.tagInput.val((associatedInputObject && associatedInputObject['original']) || currentInputVal);
                                that.tagInputAutoComplete.val("");
                                that._createTokenHandler(that.tagInput.val(), "singleToken");
                                event.preventDefault();
                            }
                        }
                    }
                    // Comma/Space/Enter are all valid delimiters for new tags,
                    // except when there is an open quote or if setting allowSpaces = true.
                    // Tab will also create a tag, unleross the tag input is empty,
                    // in which case it isn't caught.
                    // Condition used to capture comma & make sure < operator is captured
                    if (
                        (event.which === $.ui.keyCode.COMMA && event.shiftKey === false) ||
                        (that.options.tokenizeOnEnter && event.which === $.ui.keyCode.ENTER) ||
                        (
                            event.which == $.ui.keyCode.TAB &&
                            that.tagInput.val() !== ''
                        ) ||
                        (
                            event.which == $.ui.keyCode.SPACE &&
                            that.options.allowSpaces !== true &&
                            (
                                $.trim(that.tagInput.val()).replace(/^s*/, '').charAt(0) != '"' ||
                                (
                                    $.trim(that.tagInput.val()).charAt(0) == '"' &&
                                    $.trim(that.tagInput.val()).charAt($.trim(that.tagInput.val()).length - 1) == '"' &&
                                    $.trim(that.tagInput.val()).length - 1 !== 0
                                )
                            )
                        )
                    ) {
                        // Enter submits the form if there's no text in the input.
                        // Allows comma key to be shown on UI
                        if (!(event.which === $.ui.keyCode.ENTER && that.tagInput.val() === '')) {
                            event.preventDefault();
                        }

                        switch (event.which) {
                            case $.ui.keyCode.ENTER:
                                var inputValue = that._cleanedInput();

                                if (that.options.autocomplete.inline) {
                                    if (inputValue != "" && that._isValidValue(inputValue)) {
                                        var associatedInputObject = that._getObjectFromHash(inputValue, that.helperObj.keysHash);
                                        that._createTokenHandler((associatedInputObject && associatedInputObject['original']) || inputValue, "singleToken");
                                    }
                                }
                                else {
                                    switch (inputValue) {
                                        case "":
                                            //scenario: when input filed is empty & user clicks enter -> do nothing
                                            if (that._getCurrentTokenState() == "value") {
                                                //scenario: when input field have some value & user clicks enter
                                                // if 'value state true' -> indicates user is trying to tokenize
                                                // Need to complete the token
                                                that._createTokenHandler('⏎');
                                                that.tagInput.val(""); // clean the temporary input field
                                            }
                                            break;
                                        default:
                                            var currentTokenState = that._getCurrentTokenState();
                                            if (currentTokenState == "singleToken" || currentTokenState == "keyValueTokenComplete" || currentTokenState == "closeRoundBracket") {
                                                var exactMatch = that._validateLogicalOperatorExactMatch();
                                                if (exactMatch) {
                                                    var associatedInputObject = that._getObjectFromHash(inputValue, that.helperObj.logicalOperatorHash);
                                                    that._createTokenHandler((associatedInputObject && associatedInputObject['original']) || inputValue);
                                                    that.tagInput.val("");
                                                }
                                            } else {
                                                // if some input value entered on UI & enter is hit -> find out if key/value token OR tag is to be created
                                                var operator = that._getOperatorIfKeyValueToken(inputValue);
                                                if (_.isUndefined(operator) || operator == inputValue) {
                                                    // if the input has close round bracket, but is not allowed then do nothing, no creating the tokens
                                                    if (that._isCloseRoundBracketInString(inputValue) && !that._isCloseRoundBracketAllowed()) {
                                                        break;
                                                    }
                                                    // create a 'tag | singleToken' of whatever input value is entered on UI
                                                    // positive scenario: user is free flow typing and hits enter, example 'key<operator>[val][,val]⏎'
                                                    var associatedInputObject = that._getObjectFromHash(inputValue, that.helperObj.keysHash);
                                                    that._createTokenHandler((associatedInputObject && associatedInputObject['original']) || inputValue);
                                                    that.tagInput.val("");// clean the temporary input field only when invalid key is not in the field
                                                } else if (currentTokenState != "keyError") {
                                                    // If inputValue is of format 'key<operator> eg: "key="
                                                    // If inputValue is of format 'key<operator><val1>[,val2]' eg: "key = val1, val2 ..." -> then
                                                    if (!that._isOperator(inputValue.slice(-1))) { // test if the last character is not valid operator
                                                        // only create the token if input is NOT as "key<operator>"
                                                        that._simulateKeyValueTokenCreation(inputValue, operator);
                                                    }
                                                }
                                            }
                                    }
                                }
                                break;
                            case $.ui.keyCode.COMMA:
                                var currentTokenState = that._getCurrentTokenState();

                                if (_.isUndefined(currentTokenState) || currentTokenState == "keyError") {
                                    // scenario: when user is free flow typing example 'key<operator><val><,>[val,]'
                                    // scenario: when user is free flow typing in error state 'key<Invalid operator><val><,>[val,]'
                                    that.tagInput.val(that.tagInput.val() + ',');
                                }

                                if (that._getPartialTokenState() == "value") {
                                    // scenario - when ',' is input via keyboard OR "value," is input
                                    if (!_.isEmpty(inputValue)) {
                                        // scenario: when "value," is input from the keyboard
                                        that._createTokenHandler(inputValue);
                                    }
                                    that._createTokenHandler(',');
                                    that.tagInput.val("");// clean the temporary input field only when invalid key is not in the field
                                }
                                break;
                        }

                        // Autocomplete will create its own tag from a selection and close automatically.
                        if (!(that.options.autocomplete.autoFocus && that.tagInput.data('autocomplete-open')) && that._validateMultipleKeyToken(that.tagInput.val())) {
                            // that.tagInput.autocomplete('close');
                            that._showAutocomplete();
                        }
                    } // End if

                    if (that._getCurrentTokenState() !== "key") {
                        // Check the error state only when the user is free flow typing & entered the format "key<operator>"
                        that._handleStateValueErrors(event); // Handle the error when the user types incorrect key
                    }
                });

            this.tagInput
                .keyup(function (event) {

                    switch (event.which) {
                        case 57:
                            if (event.shiftKey) { // indicates '(' entered
                                // if user input is 'open parentheses' then create the tag & auto advance to next expected state
                                switch (that._getCurrentTokenState()) {
                                    case undefined:
                                    case "openRoundBracket":
                                    case "logicalOperator":
                                        that._createTokenHandler("(");
                                        that.tagInput.focus();
                                }
                            }
                            break;
                        case 48:
                            if (event.shiftKey) { // indicates ')' entered
                                // if user input is 'close parentheses' then create the tag & auto advance to next expected state
                                switch (that._getCurrentTokenState()) {
                                    case "closeRoundBracket":
                                    case "singleToken":
                                    case "keyValueTokenComplete":
                                        that._removeErrorState();
                                        that._createTokenHandler(")");
                                        that.tagInput.focus();
                                }
                            }
                            break;
                    }
                });
        },

        _mouseHandling: function () {
            var that = this;

            // Autocomplete to show the suggestion dropdown
            if (this.options.source || this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {

                var autocompleteOptions = {
                    select: function (event, ui) {
                        // make sure that keyboard enter or any other operation is not interfering
                        if (event.which != $.ui.keyCode.ENTER) {
                            that._createTokenHandler(ui.item.value);
                        }
                        return false;
                    },
                    focus: function (event, ui) {
                        // highlight the option in suggestion box when mouse hovers
                        $(event.originalEvent.currentTarget).children().filter(function () {
                            var $this = $(this);
                            if ($this.text() == ui.item.label || ($this.text().charAt(0) == ui.item.value)) {
                                $this.find("a").addClass("highlight");
                            } else {
                                $this.find("a").removeClass("highlight");
                            }
                        });
                    },
                    appendTo: this.tagInput.closest('.search-widget')
                };

                $.extend(autocompleteOptions, this.options.autocomplete);

                // tagSource is deprecated, but takes precedence here since autocomplete.source is set by default,
                // while tagSource is left null by default.
                // autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source; // This code is from library & as per current implementation no more required

                this.tagInput.autocomplete(autocompleteOptions)
                    .bind('autocompletefocus.tagit', function (event, ui) {
                        // When keyboard is used to select option, set a flag, it will be used to close the dangling box
                        that.helperObj.valueSelectedWithKeyboard = true;
                    })
                    .bind('autocompleteselect.tagit', function (event, ui) {
                        // When mouse is used to select option, set a flag, it will be used to close the dangling box
                        that.helperObj.valueSelectedWithMouse = true;
                        that.helperObj.closeCounter = 0;
                    })
                    .bind('autocompleteclose.tagit', function (event, ui) {
                        // if value selected using mouse, need to keep a track of this close event & false the flag accordingly
                        // esc OR click outside has to close the dangling suggestion card
                        if (that.helperObj.valueSelectedWithMouse) {
                            that.helperObj.closeCounter++;
                            if (that.helperObj.closeCounter == 2) {
                                that.helperObj.valueSelectedWithMouse = false;
                            }

                            // open the suggestion card with next set of values. Added setTimeout as a firefox workaround: https://bugzilla.mozilla.org/show_bug.cgi?id=53579
                            // Using setTimeout to focus that.tagInput in a new event loop. Refer above firefox bug for more information.
                            setTimeout(function () {
                                that.tagInput.focus();
                            }, 0);
                        }

                        // if value selected using keyboard, need to keep a track of this close event & false the flag accordingly
                        if (that.helperObj.valueSelectedWithKeyboard) {
                            that.tagInput.focus(); // open the suggestion card with next set of values
                            that.helperObj.valueSelectedWithKeyboard = false;
                        }
                    });

                this.tagInput.autocomplete('widget').addClass('tagit-autocomplete search-widget');
            }
        },

        // method used to determine the state of token based on user interaction & set the next expected token state
        _getPartialTokenState: function (tagValue) {
            function getTokenType() {
                // determine if key-value | single token type | open round bracket

                switch (tagValue) {
                    case '(':
                        return "openRoundBracket";
                    default:
                        if (this.helperObj.keysConfigkeyHash[tagValue && tagValue.toLowerCase()] || this.helperObj.configkeyKeysHash[tagValue]) {
                            return "key"; //keyValue token type
                        } else {
                            return "singleToken";
                        }
                }
            }

            switch (this.helperObj.currentTokenState) {
                case undefined:
                    // initial state for token life cycle
                    this.helperObj.partialTokenState = getTokenType.call(this);
                    break;
                case "key":
                    this.helperObj.partialTokenState = "operator";
                    break;
                case "operator":
                    this.helperObj.partialTokenState = "value";
                    break;
                case "value":
                    if (tagValue === '⏎') {
                        this.helperObj.partialTokenState = "keyValueTokenComplete";
                    }
                    break;
                case "keyValueTokenComplete":
                case "singleToken":
                case "closeRoundBracket":
                    // There can be two expected states - either 'Close bracket' OR 'Logical Operator' as next input
                    if (tagValue === ')') {
                        this.helperObj.partialTokenState = "closeRoundBracket";
                    } else {
                        this.helperObj.partialTokenState = "logicalOperator";
                    }
                    break;
                case "logicalOperator":
                    this.helperObj.partialTokenState = getTokenType.call(this);
                    break;
                case "keyError":
                    this.helperObj.partialTokenState = "keyError";
                    break;
                case "openRoundBracket":
                    this.helperObj.partialTokenState = getTokenType.call(this);
                    break;
            }

            return this.helperObj.partialTokenState;
        },

        /* return the current state of token
         ** possible return values : singleToken | key | operator | value | keyValueTokenComplete | logicalOperator | keyError */
        _getCurrentTokenState: function () {
            return this.helperObj.currentTokenState;
        },

        // method to update the current token state
        _updateCurrentTokenState: function (tokenState) {
            this.helperObj.currentTokenState = tokenState;
        },

        /*Imp function, any changes here will require thorough testing for Keyboard interaction| mouse Interaction | Programatic token creation For Advance Search & Read only Search
         ** This is used to track the workflow of user activity on the UI, which includes keeps a track of the values that the user selected & action done by user, till a token is completed.
         ** Accordingly create & maintain the complete / InComplete state of token
         ** update the master list object with the right set of values
         ** Update the suggestion box with the required set of values after each interaction
         ** Trigger the events based on token state.
         ** @param {string} tagValue - value that is used to create the intrim Tag for the token OR used to indicate the completion of the token.
         ** @param {String} tagValueType - the param is used in case of Read Only Mode to indicate the key value pair.
         ** @param boolean tokenHidden - Boolean indicating whether or not the created token should be hidden from display.
         **/

        _createTokenHandler: function (tagValue, tagValueType, tokenHidden) {
            var that = this;
            var currentTagDetails = {};
            var filterSource = [];
            var whichTagType;
            tagValue = tagValue.trim();

            function addLogicalOperatorTag(operator, hidden) {
                var tagDetails = {
                    type: "logicalOperator",
                    logicalOperator: operator
                };

                this._incrementTokenIDCounter();
                // Add additional 'logicalOperator' class to add the styling for logicalOperator.
                this.createTag(operator, this._getTokenIDCounter() + " logicalOperator", false, hidden);

                return tagDetails;
            }

            if (tagValueType == "key" || tagValueType == "singleToken") {
                // In case of read only type the 'filterMenu' config is not provided, hence use tagValueType to determine the token type
                whichTagType = tagValueType; // in case of readOnly
            } else {
                whichTagType = this._getPartialTokenState(tagValue)
            }

            // insert the implicit logic operator if there is one defined
            if (this.options.implicitLogicOperator) {
                if (this._lastTag().length) {
                    var tokenId = this._getTokenIDFromTag(this._lastTag());
                    var token = this._getTokenObject(tokenId);

                    if (token.type != "singleToken") {
                        throw new Error("Implicit logical operators are only valid for expressions containing simple tokens");
                    }

                    var tag = addLogicalOperatorTag.call(this, this.options.logicalOperator[0], true);

                    this._setTokenObject(tag, this._getTokenIDCounter());
                    filterSource = that.helperObj.keysArray;
                }
            }

            this._updateCurrentTokenState(whichTagType);

            switch (whichTagType) {
                case "openRoundBracket":
                    filterSource = this.helperObj.keysArray;

                    currentTagDetails = {
                        type: "openRoundBracket"
                    };

                    this._incrementTokenIDCounter();
                    var tokenIDCounter = this._getTokenIDCounter();
                    this.bracketObject.roundBracketStack.push(tokenIDCounter);
                    this._trackOpenBracketForColorChange();

                    this.createTag(tagValue, tokenIDCounter);
                    break;
                case "closeRoundBracket":
                    filterSource = this.options.logicalOperator;

                    currentTagDetails = {
                        type: "closeRoundBracket"
                    };

                    this._incrementTokenIDCounter();
                    var tokenIDCounter = this._getTokenIDCounter();
                    this.createTag(tagValue, tokenIDCounter);
                    this._updateRoundBracketsAssociation(tokenIDCounter);
                    this._adjustBracketStyling();  // For programmatic flow this check is required here as well
                    break;
                case "singleToken":
                    // Flow : when Single token selected
                    if (this.options.implicitLogicOperator) {
                        filterSource = that.helperObj.keysArray;
                    }
                    else {
                        filterSource = this.options.logicalOperator;
                    }

                    currentTagDetails = {
                        type: "singleToken",
                        key: tagValue
                    };

                    if (this.options.readOnly) {
                        if (_.isUndefined(this._getTokenObjectFromKey(tagValue))) {
                            // single token does not exist, create
                            this._incrementTokenIDCounter();
                            this.createTag(tagValue, this._getTokenIDCounter(), false, tokenHidden); // pass class name to uniquely identify token in UI
                        } else {
                            // single token already exists, do not create again
                            return;
                        }
                    } else {
                        this._incrementTokenIDCounter();
                        this.createTag(tagValue, this._getTokenIDCounter(), false, tokenHidden); // pass class name to uniquely identify token in UI
                        this._adjustBracketStyling();
                    }
                    break;
                case "key":

                    // Flow : when key selected
                    this.helperObj.whichKeyEntered = tagValue;

                    // if the configKey is sent as part of addTokens method, swap it with respective label used as internal keys.
                    var tagValueInConfigkeyHash = this.helperObj.configkeyKeysHash[tagValue];
                    if (tagValueInConfigkeyHash) {
                        tagValue = this.helperObj.whichKeyEntered = tagValueInConfigkeyHash;
                    }

                    // update the suggestion box with next expected dropdown values
                    if (!this.options.readOnly) {
                        filterSource = this.helperObj.keysOperatorsHash[tagValue.toLowerCase()] || that.options.defaultOperators;
                    }

                    currentTagDetails = {
                        type: "keyValueToken",
                        key: tagValue,
                        configKey: this.helperObj.keysConfigkeyHash[tagValue.toLowerCase()] || tagValue // in case of read only, there is no filterMenu hence keeping same key as label
                    };

                    this._incrementTokenIDCounter();
                    // Add additional 'key' class to style the key's text as bold
                    this.createTag(tagValue, this._getTokenIDCounter() + " key", false, tokenHidden);
                    break;
                case "operator":
                    // Flow: when operator selected
                    // update the suggestion box with next expected dropdown values

                    if (!this.options.readOnly) {
                        filterSource = that._getFilteredValueList(that.helperObj.whichKeyEntered);
                    }

                    currentTagDetails.operator = tagValue;
                    this.createTag(tagValue, this._getTokenIDCounter());
                    break;
                case "value":
                    // Flow: when value | , | ⏎ selected OR entered fromm the keyboard keys
                    // Do Not complete Token unless Enter is pressed two times
                    // update the suggestion box with next expected dropdown values


                    if (tagValue == ',') {
                        // user either typed the 'comma' key OR chose from suggestion box (keyHelperMenu)
                        if (!this.options.readOnly) {
                            filterSource = that._getFilteredValueList(that.helperObj.whichKeyEntered);
                        }

                        // indicates chosen from suggestion box
                        var $innerTag = this._lastTag().find('.tagit-label:first');
                        $innerTag.text($innerTag.text().trim() + ','); //just append the text value
                    } else {
                        var tokenIDCounter = this._getTokenIDCounter();
                        // Value may or may not containing comma at the end, based on user input through keyboard
                        filterSource = this.keyHelperMenu; // show the helper menu
                        // update the tokensObject if valid tag is created on UI

                        var tokenObj = this._getTokenObject(tokenIDCounter);

                        var refinedTagValue = tagValue.replace(/,$/, "");  // remove extra comma from end if exists
                        if (_.isEmpty(tokenObj.value)) {
                            currentTagDetails.value = [refinedTagValue];
                        } else {
                            var existingValues = tokenObj.value;
                            existingValues.push(refinedTagValue);
                            currentTagDetails.value = existingValues;
                        }
                        this.createTag(tagValue, tokenIDCounter, false, tokenHidden);
                    }
                    break;
                case "keyValueTokenComplete":
                    // Flow: when value as ⏎ selected OR entered fromm the keyboard keys
                    // indicates chosen from suggestion box
                    filterSource = this.options.logicalOperator;
                    this.insertRemoveIcon(this._lastTag());
                    // update the immediate previous tag this should be logical operator to associate with the current token
                    // This only needs to be done in Advance Token case, as there are no logical operators in Read only mode
                    if (!this.options.readOnly) {
                        this._adjustTokenStyling(this._getTokenIDCounter());
                        this._adjustBracketStyling();
                    }
                    break;
                case "logicalOperator":
                    // Flow: when Logical Operator selected
                    filterSource = that.helperObj.keysArray;
                    currentTagDetails = addLogicalOperatorTag.call(this, tagValue, tokenHidden);
                    break;
                case "keyError":
                    // Do not create a token
                    return;
            }

            this._setTokenObject(currentTagDetails, this._getTokenIDCounter()); // create or update the object based on selected key

            this._setOption("source", filterSource);     // update the suggestion box

            that.helperObj.prevInputValue = "";

            this._triggerTokenAddedEvent(); // trigger the event only if token creation is complete
        },

        _setOption: function (key, value) {
            this._super(key, value);
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);

            this.element.unbind('.tagit');
            this.tagList.unbind('.tagit');

            this.tagInput.removeData('autocomplete-open');

            this.tagList.removeClass([
                'tagit',
                'ui-widget',
                'ui-widget-content',
                'ui-corner-all',
                'tagit-hidden-field'
            ].join(' '));

            this.element.remove();  // remove the filter widget container 
            return this;
        },

        _cleanedInput: function () {
            // Returns the contents of the tag input, cleaned and ready to be passed to createTag
            return $.trim(this.tagInput.val().replace(/^"(.*)"$/, '$1'));
        },

        // Validate the given value based on the configurations
        _isValidValue: function (currentValue) {

            if (this._isKey(currentValue)) {
                if (_.isEmpty(this.helperObj.tokensObject)) {
                    // check for the keyTokens position configuration
                    return this._validateKeyTokensPosition(currentValue);
                } else {
                    // check if multiple keys are allowed
                    return this._validateMultipleKeyToken(currentValue);
                }
            }
            return true;
        },

        // Validate to check the input value based on the allowed maxNumber KeyTokens configuration
        _validateMultipleKeyToken: function (currentValue) {

            var maxNumberOfAllowedKeys;

            if (this.options.keyTokens && ((maxNumberOfAllowedKeys = this.options.keyTokens.maxNumber) > 0)) {
                var existingKeys = this._getNumberOfExistingKeyType();
                if (!(existingKeys < maxNumberOfAllowedKeys)) {
                    return false;
                }
            }
            return true;
        },

        // Validate to check the input value is based on keyTokens position type configuration
        _validateKeyTokensPosition: function (currentValue) {

            if (this.options.keyTokens && this.options.keyTokens.position == "start") {
                if (_.isEmpty(this.helperObj.tokensObject)) {
                    if (!this._isKey(currentValue)) {
                        return false;
                    }
                }
            }
            return true;
        },

        // Method to check if the given input value is a key
        _isKey: function (currentValue) {

            if (~this.helperObj.keysArray.indexOf(currentValue.toUpperCase())) {
                return true;
            }
            return false;
        },

        // Method to check if any value has been input that is a Key type
        _getNumberOfExistingKeyType: function () {
            var existingNumberKeys = 0;

            for (var tokenId in this.helperObj.tokensObject) {
                var tokenDetails = this.helperObj.tokensObject[tokenId];
                if (tokenDetails.key && this._isKey(tokenDetails.key)) {
                    // key present
                    ++existingNumberKeys;
                }
            }
            return existingNumberKeys;
        },

        /**
         * Set the focus to the widget's primary input field.
         */
        focusInput: function () {
            this.tagInput.focus();
        },

        _lastTag: function () {
            return this.tagList.find('.tagit-choice:last:not(.removed)');
        },

        _tags: function () {
            return this.tagList.find('.tagit-choice:not(.removed)');
        },

        assignedTags: function () {
            // Returns an array of tag string values
            var that = this;
            var tags = [];
            if (this.options.singleField) {
                tags = $(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter);
                if (tags[0] === '') {
                    tags = [];
                }
            } else {
                this._tags().each(function () {
                    tags.push(that.tagLabel(this));
                });
            }
            return tags;
        },

        // create the string containing all the values from the keyValue token object
        _buildKeyValueToken: function (tokenDetails) {
            return tokenDetails.configKey + " " + tokenDetails.operator + " " + (tokenDetails.value && tokenDetails.value.join());
        },

        // creates array of tokens containing (key,operator,label) | (Logical Operator) | (single key token) | (openRoundBracket) | (closeRoundBracket)
        getAllTokens: function () {
            var allTokens = [];
            var lastTokenId;

            for (var tokenId in this.helperObj.tokensObject) {
                lastTokenId = tokenId;

                var tokenDetails = this.helperObj.tokensObject[tokenId];
                switch (tokenDetails.type) {
                    case "keyValueToken":
                        allTokens.push(this._buildKeyValueToken(tokenDetails));
                        break;
                    case "singleToken":
                        allTokens.push(tokenDetails.key);
                        break;
                    case "logicalOperator":
                        allTokens.push(tokenDetails.logicalOperator);
                        break;
                    case "openRoundBracket":
                        allTokens.push("(");
                        break;
                    case "closeRoundBracket":
                        allTokens.push(")");
                }
            }

            var partialTokenValue = "";

            if (this.options.allowPartialTokens) {
                partialTokenValue = this.tagInput.val();
            }

            if (partialTokenValue != "") { // active partial token
                if (this.options.implicitLogicOperator && lastTokenId) {
                    allTokens.push(this.options.logicalOperator[0]);
                }
                allTokens.push(partialTokenValue);
            }

            return allTokens;
        },

        // creates a string containing complete search expression entered in the search filter
        getTokensExpression: function () {
            if (this.options.readOnly) {
                var logicalOperator = !_.isUndefined(this.options.logicalOperator[0]) ? " " + this.options.logicalOperator[0] + " " : ' AND ';
                return this.getAllTokens().join(logicalOperator); // Read Only filter
            } else {
                return this.getAllTokens().join(" "); // Advance search filter
            }
        },

        _updateSingleTagsField: function (tags) {
            // Takes a list of tag string values, updates this.options.singleFieldNode.val to the tags delimited by this.options.singleFieldDelimiter
            $(this.options.singleFieldNode).val(tags.join(this.options.singleFieldDelimiter)).trigger('change');
        },

        _subtractArray: function (a1, a2) {
            var result = [];
            for (var i = 0; i < a1.length; i++) {
                if ($.inArray(a1[i], a2) == -1) {
                    result.push(a1[i]);
                }
            }
            return result;
        },

        tagLabel: function (tag) {
            // Returns the tag's string label.
            if (this.options.singleField) {
                return $(tag).find('.tagit-label:first').text();
            } else {
                return $(tag).find('input:first').val();
            }
        },

        _showAutocomplete: function () {
            if (this.options.autocomplete.inline) {
                var that = this;

                this.options.autocomplete.source({
                    'term': this.tagInput.val()
                }, function (choices) {
                    if (choices.length > 0 && that.tagInput.val() != "") {
                        that.tagInputAutoComplete.val(choices[0]);
                        // match the case of the last input character and the corresponding one from the suggestion
                        var inputLength = that._cleanedInput().length;
                        var newSuggestionValue = that.tagInput.val().substr(0, inputLength) + that.tagInputAutoComplete.val().substr(inputLength);
                        that.tagInputAutoComplete.val(newSuggestionValue);
                    }
                    else {
                        that.tagInputAutoComplete.val("");
                    }
                });
            }
            else {
                this.tagInput.autocomplete('search', ''); // used to open the autocomplete with all input values
            }
        },

        _effectExists: function (name) {
            return Boolean($.effects && ($.effects[name] || ($.effects.effect && $.effects.effect[name])));
        },

        showAutocomplete: function () {
            this._showAutocomplete();
        },

        createTag: function (value, additionalClass, duringInitialization, tagHidden) {
            var that = this;
            value = $.trim(value);

            if (value === '') {
                return false;
            }

            if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) {
                this._trigger('onTagLimitExceeded', null, {duringInitialization: duringInitialization});
                return false;
            }

            var currentTokenState = this._getCurrentTokenState();
            var label = currentTokenState == "logicalOperator" ? $(this.HTMLElements.logicalOperatorLabel).attr("value", value) : $(this.HTMLElements.allLabels).text(value);

            // Create tag.
            var tag = $('<li></li>')
                .addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all')
                .addClass(additionalClass)
                .append(label);

            if (tagHidden) {
                tag.hide();
            }

            switch (currentTokenState) {
                case "singleToken":
                    // This will be true in case of single tokens only
                    if (this.options.autocomplete.inline && this._isKey(value)) {
                        tag.find(".tagit-label").addClass("autocompleteKey");
                    }
                    this.insertRemoveIcon(tag);

                    if (!this.options.readOnly) {
                        tag.addClass("token-color"); // updates the color of single token in advanced token mode
                    }
                    break;
                case "logicalOperator":
                    var $logicalOperatorMenu = this.element.find("#logicOperatorMenu");

                    // Attach the events to the input element for blur & keyboard interaction
                    label.bind('blur', function (e) {
                        $logicalOperatorMenu.addClass("hideMenu"); // When logical menu is opened & user clicks outside the menu
                    }).bind('keydown', function (e) {
                        switch (event.keyCode) {
                            case $.ui.keyCode.ESCAPE:
                                $logicalOperatorMenu.addClass("hideMenu"); // When logical menu is already opened & user presses esc
                                break;
                            default:
                                return false;
                        }
                    });

                    // attach the click event for drop down menu for logical operator
                    tag.bind('click', function (e) {
                        var $parentPos = $(this).position();
                        var leftPosition = $parentPos.left;
                        var topPosition = $parentPos.top + 25;
                        $logicalOperatorMenu.css("left", leftPosition);
                        $logicalOperatorMenu.css("top", topPosition);
                        if (that.helperObj.suggestionCardDefaultWidth) {
                            // set the same width as calculated by autocomplete for UI consistency
                            $logicalOperatorMenu.css("width", that.helperObj.suggestionCardDefaultWidth);
                        }
                        $logicalOperatorMenu.removeClass("hideMenu");

                        that.helperObj.clickedLogicalTag = $(this);
                    });
                    break;
            }

            // Unless options.singleField is set, each tag has a hidden input field inline.
            if (!this.options.singleField) {
                var escapedValue = label.html();
                tag.append('<input id="filtervalue" type="hidden" value="' + escapedValue + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />');
            }

            if (this._trigger('beforeTagAdded', null, {
                    tag: tag,
                    tagLabel: this.tagLabel(tag),
                    duringInitialization: duringInitialization
                }) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                tags.push(value);
                this._updateSingleTagsField(tags);
            }

            // DEPRECATED.
            this._trigger('onTagAdded', null, tag);

            this.tagInput.val('');

            // Insert tag.
            this.tagInput.closest(".tagit-new").before(tag);

            if (this.options.showAutocompleteOnFocus && !duringInitialization) {
                setTimeout(function () {
                }, 0);
            }

            return tag;
        },

        //This inserts the X mark delete icon next to tokens for deletion of tokens
        insertRemoveIcon: function (tag) {
            var that = this;
            // Button for removing the tag.
            var $removeTag = $('<svg class="tagit-close"><use href="#icon_exit_filters"/></svg>') // \xd7 is an X
                .click(function (e) {
                    // Removes a tag when the little 'x' is clicked.
                    that._removeEntireToken(that._getTokenIDFromTag(tag));
                })
                .hover(function (e) {
                    // on mouseenter
                    that._hoverEntireToken(that._getTokenIDFromTag(tag), true);
                }, function (e) {
                    // on mouseleave
                    that._hoverEntireToken(that._getTokenIDFromTag(tag), false);
                });
            var $removeIcon = $('<span></span>')
                .addClass('tag-it-close-span')
                .append($removeTag);
            if (tag)
                tag.append($removeIcon);

        },

        removeTag: function (tag, animate) {
            animate = typeof animate === 'undefined' ? this.options.animate : animate;

            tag = $(tag);

            // DEPRECATED.
            this._trigger('onTagRemoved', null, tag);

            if (this._trigger('beforeTagRemoved', null, {tag: tag, tagLabel: this.tagLabel(tag)}) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                var removedTagLabel = this.tagLabel(tag);
                tags = $.grep(tags, function (el) {
                    return el != removedTagLabel;
                });
                this._updateSingleTagsField(tags);
            }

            if (animate) {
                tag.addClass('removed'); // Excludes this tag from _tags.
                var hide_args = this._effectExists('blind') ? ['blind', {direction: 'horizontal'}, 'fast'] : ['fast'];

                var thisTag = this;
                hide_args.push(function () {
                    tag.remove();
                });

                tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
            } else {
                tag.remove();
            }
        },

        /**
         * @param {string} key - The key of token that needs to be deleted for replacing
         * @param {Array} token - Array of tokens that need to be added
         */
        replaceToken: function (key, token) {
            // delete the token from UI 
            this.removeToken(key, undefined, true); // do not trigger the remove token event
            this.addTokens(token); // theis will trigger the addtoken event
        },

        /**
         * @param {string} token - if only provided, then entire token will be removed. If the token is with values, the specific values will be removed. If the token do not have any more values, then entire token will be removed.
         * @param {boolean} appendValue - if true, then the `specified value will be added in token & token will be added back to the UI.
         * @returns {Array} Deleted token
         */
        removeToken: function (token, appendValue, avoidTriggerEvent) {
            // triggers when the action is invoked programmatically
            // appendValue - indicates the token with value needs to be appended in original token or as a new token after deletion
            //if 'token:- only key' => remove entire token | single Token OR keyValue Token
            //if 'token:- key operator value' => remove entire token if value exists
            //if 'token:-  key operator value1,value2' => remove entire token if NO more than value1,value2 exist
            //if 'token:-  key operator value1,value2' => remove entire token if more values exist than value1,value2 | Add the remaining values token at the end in UI

            var that = this;
            var deletedToken;
            token = _.isArray(token) ? token[0].trim() : token.trim();
            var operator = that._getOperatorIfKeyValueToken(token);
            switch (operator) {
                case undefined:
                    // indicates either single token OR only key of key-value token
                    var tokenObj = this._getTokenObjectFromKey(token);
                    // indicates key is provided
                    // if single token OR key-value => needs to be entirely deleted along with all values
                    deletedToken = tokenObj && that._removeEntireToken(tokenObj.tokenId, avoidTriggerEvent); //delete token in UI
                    if (appendValue) {
                        if (tokenObj) {
                            that.addTokens([tokenObj.tokenDetails.key]);
                        } else {
                            that.addTokens(_.isArray(token) ? token : [token]);
                        }
                    }
                    break;
                default:
                    // if operator found, indicates 'key operator values' & needs to be parsed for deletion
                    $.each(that.options.allOperators, function (index, operator) {
                        var tokenElements = $.map(token.split(operator), $.trim);
                        if (tokenElements[0] !== token) {
                            // indicates Key/value token
                            var splitValues = $.map(tokenElements[1].split(","), $.trim);
                            var keyValueTokenObj = that._getKeyValueTokenObject(tokenElements, appendValue);
                            var remainingValues = (keyValueTokenObj && _.difference(keyValueTokenObj.tokenDetails.value, splitValues)) || [];
                            deletedToken = keyValueTokenObj && that._removeEntireToken(keyValueTokenObj.tokenId, true); //delete token in UI & do not trigger the remove event yet
                            if (appendValue) {
                                remainingValues.push(splitValues); // push the value that needs to be appended
                                that.addTokens([tokenElements[0] + " " + operator + " " + remainingValues.join()]);
                            } else {
                                if (!_.isEmpty(remainingValues)) {
                                    // add tokens in UI with remaining values
                                    that.addTokens([tokenElements[0] + " " + operator + " " + remainingValues.join()]);
                                } else {
                                    //when the entire token along with partial values is deleted
                                    deletedToken = "";
                                }
                            }
                            return false;
                        }
                    });
            }
            if (!avoidTriggerEvent) {
                // Avoid event trigger
                that._afterTokenRemovedEvent(deletedToken);
            }
            return deletedToken;
        },

        // tokenId - tokenID that needs to be removed
        // avoidRemoveTriggerEvent - boolean, used to control if the remove trigger event needs to be triggered
        _removeEntireToken: function (tokenId, avoidRemoveTriggerEvent) {
            var tokenIDPositionArray = this._getTokenPositionArray();
            var tokenIDPosition = tokenIDPositionArray.indexOf(tokenId);
            var deletedToken;
            if (~tokenIDPosition) {
                // found the tokenId in master object
                if (this.options.readOnly) {
                    // indicates keyValueToken OR single token -> delete the token
                    deletedToken = this._removeTokenFromUI(tokenId, avoidRemoveTriggerEvent);
                } else {
                    //If implicitLogicOperator is set to false, thene there is no logical operator in between the tokens
                    var tokenHasLogicOperator = !(this.options.allowPartialTokens && !this.options.implicitLogicOperator);

                    switch (tokenIDPosition % 2) {
                        case 0:
                            // indicates keyValueToken OR single token
                            if (tokenIDPosition === 0) {
                                if (tokenHasLogicOperator) {
                                    // Indicates the first position for the token in the list
                                    if (!_.isUndefined(tokenIDPositionArray[1])) {
                                        //indicates the logical operator is present next & needed to be deleted
                                        deletedToken = this._removeTokenFromUI(tokenIDPositionArray[1], true); // remove the token itself
                                    }
                                }
                            } else {
                                if (tokenHasLogicOperator) {
                                    // Any even number position - remove the previous logical operator
                                    deletedToken = this._removeTokenFromUI(tokenIDPositionArray[tokenIDPosition - 1], true); // remove the token itself
                                }
                            }
                            deletedToken = this._removeTokenFromUI(tokenId, avoidRemoveTriggerEvent); // remove the token itself
                            break;
                        case 1:
                            if (this.options.allowPartialTokens && !this.options.implicitLogicOperator) {
                                // indicates that there is token which is not logical operator
                                deletedToken = this._removeTokenFromUI(tokenId, avoidRemoveTriggerEvent); // remove the token itself
                            } else {
                                // indicates Logical Operator
                                deletedToken = this._removeTokenFromUI(tokenId, true); // remove the token itself
                            }
                            break;
                    }
                }
            }
            return deletedToken;
        },

        // tokenId - tokenId which is hovered
        // onMouseEnter - boolean to indicate if it is mouseEnter event or mouseLeave
        _hoverEntireToken: function (tokenId, onMouseEnter) {

            var tokenIDPositionArray = this._getTokenPositionArray();
            var tokenIDPosition = tokenIDPositionArray.indexOf(tokenId);

            if (~tokenIDPosition) {
                // For advance filter, if it is a key-value token then highlight the corresponding logical operator token
                if (!this.options.allowPartialTokens && !this.options.readOnly && tokenIDPosition % 2 == 0) {
                    // If token is present at the first position, highlight the next token
                    if (tokenIDPosition === 0 && !_.isUndefined(tokenIDPositionArray[1])) {
                        this._hoverToken(tokenIDPositionArray[1], onMouseEnter);

                    } else {
                        // Highlight the previous token if the key-value token is not at first position.
                        this._hoverToken(tokenIDPositionArray[tokenIDPosition - 1], onMouseEnter);
                    }
                }
                // highlight the current token.
                this._hoverToken(tokenId, onMouseEnter);
            }
        },

        // get the tokens position in the master object, this is used to delete the tokens & respective logical operators
        _getTokenPositionArray: function () {
            return Object.keys(this.helperObj.tokensObject);
        },

        // tokenId - tokenId that needs to be removed
        // avoidRemoveTriggerEvent - boolean, used to control if the remove trigger event needs to be triggered
        _removeTokenFromUI: function (tokenId, avoidRemoveTriggerEvent) {
            // triggers when the remove action is done on UI
            // remove all the tags associated to the tokenID including token with multiple values

            var allTagsToBeRemoved = this._getTagsByTokenID(tokenId);
            allTagsToBeRemoved.each(function () {
                $(this).remove();
            });
            var deletedTokenObj = this._removeFromUiTokensList(tokenId); // remove the token from master list

            if (_.isEmpty(this.helperObj.tokensObject)) {
                // reset the UI state if all the tokens are deleted
                this._resetNewTokenState();
                this._setOption("source", this.helperObj.keysArray);
            }

            var deletedToken;
            if (!_.isEmpty(deletedTokenObj)) {
                deletedToken = [deletedTokenObj.type == "keyValueToken" ? this._buildKeyValueToken(deletedTokenObj) : deletedTokenObj.key];
            }

            if (!avoidRemoveTriggerEvent) {
                // in case where the auto creation of token will happen after the removal of token, event is not needed to be triggered
                this._afterTokenRemovedEvent(deletedToken);
            }
            return deletedToken;
        },

        _hoverToken: function (tokenId, onMouseEnter) {

            var allTagsToBeHighlighted = this._getTagsByTokenID(tokenId);
            allTagsToBeHighlighted.each(function () {
                var $this = $(this);
                if (onMouseEnter) {
                    // For key-value token, remove token-color class and add tag-hover class for all tokens.
                    if (!$this.hasClass('logicalOperator')) {
                        $this.removeClass('token-color');
                    }
                    $this.addClass('tag-hover');
                }
                else {
                    // Remove the class on mouse leave
                    if (!$this.hasClass('logicalOperator')) {
                        $this.addClass('token-color');
                    }
                    $this.removeClass('tag-hover');
                }
            });
        },
        // trigger the event once the token is deleted
        _afterTokenRemovedEvent: function (deletedToken) {
            this._trigger('afterTokenRemoved', null, {tokenLabel: deletedToken && deletedToken[0]});
            this._triggerOnChange();
        },

        // trigger the event once all the tokens are deleted
        _afterAllTokenRemovedEvent: function (deletedToken) {
            this._trigger('afterAllTokenRemoved', null, {});
            this._triggerOnChange();
        },

        // method to trigger onChange event if any CRUD operation is done on the tokens
        _triggerOnChange: function () {
            // trigger an onChange event in case of read only config
            if (this.options.readOnly) {
                $(this.element).trigger('slipstreamSearch:onChange', [{"tokens": this.getAllTokens()}]);
            }
        },
        // removes all the tokens  fom the container
        // if avoidTriggerEvent is true, the associated event will not be triggered.
        removeAllTokens: function (avoidTriggerEvent) {
            // Removes all tokens.
            for (var tokenId in this.helperObj.tokensObject) {
                this._removeEntireToken(tokenId, true);
            }
            this._resetNewTokenState(); // reset the UI state if all the tokens are deleted
            this._createOriginalSourceCopy();
            this._setOption("source", this.helperObj.keysArray);

            this.tagInput.val("");

            if (this.tagInputAutoComplete) {
                this.tagInputAutoComplete.val("");
            }

            if (!avoidTriggerEvent) {
                // Avoid event trigger
                this._afterAllTokenRemovedEvent();
            }
        },

        // test if the provided string is key value token based on valid operator & return the operator respectively
        _getOperatorIfKeyValueToken: function (token) {
            var operatorFound;
            $.each(this.options.allOperators, function (index, operator) {
                var tokenElements = token.split(operator);
                if (tokenElements[0] !== token) {
                    // indicates Key/value token
                    operatorFound = operator;
                    return false;
                }
            });
            return operatorFound;
        },

        // simulate the key value creation as if it is being eneterd from UI.. to keep the consistency of the code for programattic token creation
        _simulateKeyValueTokenCreation: function (token, operator) {
            var that = this;

            var tokenElements = token.split(operator);
            if (this.options.readOnly) {
                this._createTokenHandler(tokenElements[0], "key"); // In read only mode, need to send define the tagType
            } else {
                this._createTokenHandler(tokenElements[0]); // create a tag with key
            }
            this._createTokenHandler(operator); // create a tag with operator
            var splitValues = tokenElements[1].split(',');
            if (splitValues.length > 1) {
                // indicates multiple values
                $.each(splitValues, function (index, value) {
                    that._createTokenHandler(value); // create a tag with all the values
                    if (index < splitValues.length - 1) {
                        // do not execute after last value
                        that._createTokenHandler(","); // execute the method to simulate the UI effect
                    }
                })
            } else {
                // only one value to key
                this._createTokenHandler(tokenElements[1]); // create a tag with value
            }
            this._createTokenHandler("⏎"); // This will execute to reset the token states & complete the token

        },

        // simulate the token creation including all types of tokens
        _simulateTokenCreation: function (token) {
            var operator = this._getOperatorIfKeyValueToken(token);
            switch (operator) {
                case undefined:
                    // indicates either singleToken OR logical Operator
                    if (this.options.readOnly || this.options.autocomplete.inline) {
                        this._createTokenHandler(token, "singleToken"); // create a tag id Operator OR create token if single token
                    } else {
                        this._createTokenHandler(token); // create a tag id Operator OR create token if single token
                    }
                    break;
                default:
                    // indicates some valid operator is found | Key/value token
                    this._simulateKeyValueTokenCreation(token, operator);
            }
        },

        // programmatic adding the tokens
        // tokens - array of tokens that is expected to be added in the search input container
        // avoidAddTokensTriggerEvent - boolean, used to control if the addTokens trigger event needs to be triggered
        addTokens: function (tokens, avoidAddTokensTriggerEvent) {
            // used only programtically, not called when interaction on UI
            // identifies the type of token from the set of values
            // accordingly creates the single token OR Key value Token OR logical operator
            // Same method in case of advance token OR read only token creation
            var that = this;

            if (!_.isEmpty(tokens) && _.isArray(tokens)) {

                this._createOriginalSourceCopy(); // keep a copy of original source

                this.helperObj.avoidAddTokensTriggerEvent = avoidAddTokensTriggerEvent; // use the flag to control the associated event trigger

                tokens.forEach(function (token) {
                    that._simulateTokenCreation(token.trim());
                });

                delete this.helperObj.avoidAddTokensTriggerEvent; // delete the property from this.helperObj after all the tokens been added
                this._triggerOnChange();
            }
        },

        // update the logical operator tag based on selection on UI logicalOperator menu
        _updateLogicTag: function (e) {
            var $logicalOperatorMenu = this.element.find("#logicOperatorMenu");
            var $target = e.target && $(e.target);
            var valueSelectedFromMenu = $target && $target.text();
            if ($target && valueSelectedFromMenu != "") {
                // replace selected menu item in ui
                var $clickedLogicalTag = this.helperObj.clickedLogicalTag;
                $clickedLogicalTag.children("input:first").val(valueSelectedFromMenu); // replace the value in UI as per selected value
                // modify the value in the master object array for the updated logical operator
                var currentTagDetails = {};
                currentTagDetails.logicalOperator = valueSelectedFromMenu;
                this._setTokenObject(currentTagDetails, this._getTokenIDFromTag($clickedLogicalTag)); // update master object
                this._afterTokenAddedEvent(true); // trigger the event since change of value on UI
            }

            $logicalOperatorMenu.addClass("hideMenu");  // Hide logical menu
        },

        _createHelperMenuHash: function () {

            var helperMenuHash = {
                keysConfigkeyHash: {},
                configkeyKeysHash: {},
                keysOperatorsHash: {},
                keysValuesHash: {},
                keysHash: {},
                keysArray: [],
                logicalOperatorHash: {}
            };

            // create different hash to be used in class
            for (var configKey in this.options.source) {
                var config = this.options.source[configKey];
                var configLabel = config.label;
                helperMenuHash.configkeyKeysHash[configKey] = configLabel;
                helperMenuHash.keysHash[configLabel.toUpperCase()] = {"original": configLabel};
                helperMenuHash.keysArray.push(config.label);
                var lowerCaseConfigLabel = config.label.toLowerCase();
                helperMenuHash.keysConfigkeyHash[lowerCaseConfigLabel] = configKey;
                helperMenuHash.keysOperatorsHash[lowerCaseConfigLabel] = config.operators;
                helperMenuHash.keysValuesHash[lowerCaseConfigLabel] = config.value;
            }
            // create a lower case hash for logical operators. needed in validations
            for (var index in this.options.logicalOperator) {
                var originalOperator = this.options.logicalOperator[index];
                helperMenuHash.logicalOperatorHash[originalOperator.toUpperCase()] = {"original": originalOperator};
            }
            $.extend(this.helperObj, helperMenuHash);
        },

        // used to set back the width of suggestion box as originally calculated by autocomplete
        _getAutocompleteDefaultWidth: function () {
            this.helperObj.suggestionCardDefaultWidth = this.tagInput.autocomplete('widget').css("width");
        },

        // is used to fix the white space alignment in the dropdown values for keyHelper Menu
        _adjustAutocompleteAlignment: function (width) {
            if (width) {
                this.tagInput.autocomplete('widget').removeClass('keyHelper-width');
            } else {
                this.tagInput.autocomplete('widget').addClass('keyHelper-width');
            }
            this.tagInput.autocomplete('widget').find("li").wrapInner("<pre></pre>");
        },

        // create / update list of object containing the key, operator, value & logical operators - that are selected/entered on the UI input field
        _setTokenObject: function (currentTag, tokenId) {

            if (_.isUndefined(this.helperObj.tokensObject[tokenId])) {
                this.helperObj.tokensObject[tokenId] = {};
            }
            $.extend(this.helperObj.tokensObject[tokenId], currentTag);

            // console.log(this.helperObj.tokensObject);
            // console.log(this.bracketObject.roundBracketStack);
        },

        // get the individual object structure based on the tokenID
        _getTokenObject: function (tokenID) {
            return this.helperObj.tokensObject[tokenID];
        },

        // remove the token from the allTokens object based on tokenID
        _removeFromUiTokensList: function (tokenId) {
            var tokenObj = this.helperObj.tokensObject[tokenId];
            delete(this.helperObj.tokensObject[tokenId]);
            return tokenObj; // return the deleted token object
        },

        // used to create unique token id to be provided to each token
        _incrementTokenIDCounter: function () {
            ++this.helperObj.tokenIdCounter;
        },

        // round brackets counter to create a unique number used associate the bracket pairs
        _incrementRoundBracketsPairCounter: function () {
            ++this.bracketObject.roundBracketsPairCounter;
        },

        // create the name string for token id to be used when user is creating token in UI
        _getTokenIDCounter: function () {
            return "token" + this.helperObj.tokenIdCounter;
        },

        // create the name string for token id to be used when user is creating token in UI
        _getRoundBracketsPairCounter: function () {
            return "pair" + this.bracketObject.roundBracketsPairCounter;
        },

        // used to keep a count of the open brackets that can have color change due to next input value
        _trackOpenBracketForColorChange: function () {
            ++this.bracketObject.openRoundBracketForColorChange;
        },

        //remove the values from suggestion box that are already chosen on UI
        _getFilteredValueList: function (whichKey) {
            whichKey = whichKey.toLowerCase();
            var values = this.helperObj.keysValuesHash[whichKey];
            for (var token in this.helperObj.tokensObject) {
                if (values) {
                    var tokenDetails = this.helperObj.tokensObject[token];
                    if (tokenDetails.key && (tokenDetails.key.toLowerCase() == whichKey)) {
                        var alreadyChosenValues = tokenDetails.value;
                        values = _.difference(values, alreadyChosenValues)
                    }
                }
            }
            return values || []; // if No config values are defined do not show any suggestion card
        },

        // All the tags are associated with a unique tokenID as a class name that relates all the partial values related to single token.
        // this method is used to find the token id from given UI tag
        _getTokenIDFromTag: function (tag) {
            // get the associate token id fromm the ui tag
            var $tag = $(tag);
            var allClassNames = $tag.attr('class').split(' ');
            for (var i in allClassNames) {
                if (~allClassNames[i].indexOf('token')) {
                    return allClassNames[i];
                }
            }
        },

        // find all the tags from UI based on token ID => indicates a token
        _getTagsByTokenID: function (tokenID) {
            // get all the elements based on the tokenID
            return this.element.find("." + tokenID);
        },

        // this function is used to find the token with exact match of key & value.
        // if appendValue is true, then token with key is returned, so that value can be appended
        _getKeyValueTokenObject: function (tokenElements, appendValue) {
            var whichKey = tokenElements[0];
            var values = tokenElements[1];
            // if a key is provided get the associated token object from the master list
            for (var tokenId in this.helperObj.tokensObject) {
                var tokenDetails = this.helperObj.tokensObject[tokenId];
                if (tokenDetails.key == whichKey) {
                    if (appendValue) {
                        // if appendValue is true, then return the tokenId details so that later the token can be updated
                        return {"tokenId": tokenId, "tokenDetails": tokenDetails};
                    } else {
                        // if appendValue is not true, check all the possible values for the token existence
                        var splitValues = $.map(values.split(","), $.trim);
                        for (var eachValue in splitValues) {
                            // scenario when there are multiple (key value pairs) with same key & different values
                            if (~tokenDetails.value.indexOf(splitValues[eachValue])) {
                                // find the token that contains the particular mentioned values needed to be removed
                                return {"tokenId": tokenId, "tokenDetails": tokenDetails};
                            }
                        }
                    }
                }
            }
        },

        // Check if the token exists for a particular key
        _getTokenObjectFromKey: function (whichKey) {
            // if a key is provided get the associated token object from the master list
            for (var tokenId in this.helperObj.tokensObject) {
                var tokenDetails = this.helperObj.tokensObject[tokenId];
                if (tokenDetails.key == whichKey) {
                    return {"tokenId": tokenId, "tokenDetails": tokenDetails};
                }
            }
        },

        // color style the token on completion
        _adjustTokenStyling: function (tokenID) {
            // add the color styling to all the associated tags once token is complete
            this.element.find("." + tokenID).addClass("token-color");
        },

        _createOriginalSourceCopy: function () {
            // keep a copy of original source
            if (this.options.originalSource.length == 0)
                this.options.originalSource = this.options.source;
        },

        // trigger the event once the token is created or modified
        _afterTokenAddedEvent: function (triggerEvent) {
            // trigger the event on:-
            // successful token creation for Key/value & single token
            // when the logical Operator is modified on UI
            if (triggerEvent & !this.helperObj.avoidAddTokensTriggerEvent) {
                this._trigger('afterTokenAdded', null, {});
            }
        },

        // trigger token added event based on right states
        _triggerTokenAddedEvent: function () {
            switch (this.helperObj.currentTokenState) {
                case "keyValueTokenComplete":
                case "singleToken":
                case "closeRoundBracket":
                    if (this.bracketObject.roundBracketStack.length == 0) { // if there is no open bracket in stack -> indicates search expression is complete -> trigger the add token event
                        this._afterTokenAddedEvent(true); // trigger the event only if token creation is complete
                    }
            }
        },

        // trigger the event for each update of a partial token
        _afterPartialTokenUpdatedEvent: function (triggerEvent) {
            // trigger the event on:-
            // update of a partial token
            if (triggerEvent) {
                this._trigger('afterPartialTokenUpdated', null, {});
            }
        },

        // Use to handle error state on UI while creating the key value token
        _handleStateValueErrors: function (keyboardEvent) {
            var textValue = this._cleanedInput();
            switch (this._getCurrentTokenState()) {
                case undefined:
                case "logicalOperator":
                    switch (keyboardEvent.key) {
                        case "=":
                            var lastChar = textValue.slice(-1); // get the last char
                            if (lastChar == '!' || lastChar == '<' || lastChar == '>') {
                                textValue = textValue.slice(0, -1); // remove the these character before checking the key
                            }
                        case "<":
                        case ">":
                            this._isValidKey(textValue);
                            break;
                        case ")":
                            if (!this._isCloseRoundBracketAllowed()) { // verify if the close round bracket is allowed in the string
                                this._showTokenErrorState();
                            } else {
                                // change the color of top open bracket respective to entered close bracket
                                this._getElementFromClass(this._getTopOpenBracketElementID()).removeClass("openRoundBracketError");
                            }
                            break;
                        default:
                            if ((textValue.slice(-1) == '!' && textValue !== '=') || this._isCloseRoundBracketInString(textValue.slice(0, -1))) { // only '!=' is valid operator
                                this._showTokenErrorState();
                            }
                    }
                    break;
                case "closeRoundBracket":
                case "keyValueTokenComplete":
                case "singleToken":
                    if (this.options.autocomplete.inline != true) {
                        switch (keyboardEvent.which) {
                            case $.ui.keyCode.DOWN:
                            case $.ui.keyCode.UP:
                                this._removeErrorState();
                                break;
                            case $.ui.keyCode.BACKSPACE:
                                this._isValidLogicalOperator(textValue.slice(0, -1));
                                break;
                            case $.ui.keyCode.ENTER:
                                if (textValue != "") {
                                    this._isValidLogicalOperator(textValue + keyboardEvent.key);
                                } else {
                                    this._removeErrorState();
                                }
                                break;
                            case $.ui.keyCode.TAB:
                            case 16: //only shift pressed
                                if (textValue == "") {
                                    this._removeErrorState();
                                }
                                break;
                            default:
                                this._isValidLogicalOperator(textValue + keyboardEvent.key);
                        }
                    }
                    break;
                case "key":
                    break;
            }
        },

        // check if the entered key is valid key from the provided config
        _isValidKey: function (textValue) {
            // test if the valid token key is entered
            if (this.helperObj.keysConfigkeyHash[textValue.toLowerCase()] === undefined) {
                // indicates the invalid key is entered -> show error state
                this._showTokenErrorState();
            } else {
                // reset error state
                this._resetNewTokenState();
            }
        },

        // validate f the user input string is a valid substring from all the possible values of logical operators
        _isValidLogicalOperator: function (inputValue) {
            for (var operator in this.helperObj.logicalOperatorHash) {
                if (operator.substring(0, inputValue.length) === inputValue.toUpperCase()) {
                    this._removeErrorState();
                    return true;
                }
            }
            this._showErrorState();
            return false;
        },

        // validate if the input is exact match to logical operators
        _validateLogicalOperatorExactMatch: function () {
            var inputValue = this._cleanedInput();
            var associatedInputObject = this._getObjectFromHash(inputValue, this.helperObj.logicalOperatorHash);
            if (associatedInputObject) {
                return true;
            }
            return false;
        },

        // get the object associated to the original key value provided in the config to display on UI
        _getObjectFromHash: function (inputVal, hash) {
            var checkInputVal = inputVal.toUpperCase();
            for (var key in hash) {
                if (key == checkInputVal) {
                    return hash[key];
                }
            }
        },

        // check if the provided character is a valid operator
        _isOperator: function (character) {
            return this.options.allOperators.indexOf(character) != -1;
        },

        // show error state for the token.
        _showTokenErrorState: function () {
            this.tagInput.addClass("keyError");
            this._updateCurrentTokenState("keyError");
        },

        // reset token state for new token cycle.
        _resetNewTokenState: function () {
            this.tagInput.removeClass("keyError");
            this._updateCurrentTokenState(); // reset the token state for new token cycle
        },

        // Color change for open Round brackets according to the state
        _adjustBracketStyling: function () {
            switch (this.helperObj.currentTokenState) {
                case "keyValueTokenComplete":
                case "singleToken":
                    if (this.bracketObject.openRoundBracketForColorChange) {
                        for (var i = 0; i < this.bracketObject.openRoundBracketForColorChange; i++) {
                            var openBracketElementID = this.bracketObject.roundBracketStack[this.bracketObject.roundBracketStack.length - (i + 1)];
                            this._getElementFromClass(openBracketElementID).addClass("openRoundBracketError");
                        }
                        this.bracketObject.openRoundBracketForColorChange = 0; // reset the value for tracking the next set of open brackets
                    }
                    break;
                case "closeRoundBracket":
                    if (!_.isEmpty(this.bracketObject.roundBracketStack)) {
                        var openBracketElementID = this.bracketObject.roundBracketStack.pop();
                        this._getElementFromClass(openBracketElementID).removeClass("openRoundBracketError"); // For programmatic flow this check is required here as well
                    } else {
                        this._lastTag().addClass("closeRoundBracketError");
                    }
            }
        },

        // check if the input string has close round bracket as any character
        _isCloseRoundBracketInString: function (inputString) {
            return inputString.indexOf(')') > -1;
        },

        // check if the close bracket is allowed in the current state
        _isCloseRoundBracketAllowed: function () {
            switch (this.helperObj.currentTokenState) {
                case "keyValueTokenComplete":
                case "singleToken":
                case "closeRoundBracket":
                    if (this.bracketObject.roundBracketStack.length != 0) { // if there open bracket in stack then only close bracket is allowed
                        return true;
                    }
                default:
                    return false;
            }
        },

        // Update the open bracket With data attribute containing close bracket id & vice-versa to maintain the association between the bracket pairs
        _updateRoundBracketsAssociation: function (tokenID) {
            if (!_.isUndefined(this._getTopOpenBracketElementID())) {
                this._incrementRoundBracketsPairCounter();
                var bracketsPairCounter = this._getRoundBracketsPairCounter();
                this._getElementFromClass(this._getTopOpenBracketElementID()).attr("data-roundbracket-pair", bracketsPairCounter);
                this._getElementFromClass(tokenID).attr("data-roundbracket-pair", bracketsPairCounter);
            }
        },

        // Provides the top most element ID from the stack which relates to recent most open bracket
        _getTopOpenBracketElementID: function () {
            return this.bracketObject.roundBracketStack[this.bracketObject.roundBracketStack.length - 1];
        },

        _getElementFromClass: function (elementClass) {
            return this.element.closest('.search-widget').find('.' + elementClass);
        },

        // show error state for any tag.
        _showErrorState: function () {
            this.tagInput.addClass("keyError");
        },

        // remove error state for any tag.
        _removeErrorState: function () {
            this.tagInput.removeClass("keyError");
        },

        // initialize the set of values with default
        initialize: function () {
            // initialize variables
            this.extraWidth = 25;

            // helper object
            if (!this.helperObj) {
                this.helperObj = {
                    whichKeyEntered: "",   // Keep a track of the 'Key' part of the token

                    logicalTagToAssociate: "", // used to identify the logical operator, that needs to be associtaed to the key for removal
                    tokenIdCounter: -1,  // token counter to create a unique key for tokens

                    clickedLogicalTag: "", // used to keep a track of the logical operator that is selected on UI to be updated with any other value from selection box
                    suggestionCardDefaultWidth: "", // used to keep a track of default width of suggestion card for later adjustments

                    partialTokenState: undefined, // used to keep a track of the intermediate state of the token when tag selected on UI
                    currentTokenState: undefined, // used to indicate the current token state, which token state is already entered

                    tokensObject: {
                        // example object structure for key value tokens
                        // {
                        //     tokenID: {
                        //         configkey: 'configkey',
                        //         key: 'label',
                        //         operator: 'operator',
                        //         value: ['val1', 'val2'],
                        //         type:'token'
                        //     }
                        // }
                    },

                    keysConfigkeyHash: {}, // used to create a hash between suggestion keys & backend config keys respectively
                    configkeyKeysHash: {}, // used to create a hash between backend config keys & suggestion keys respectively
                    keysHash: {}, // Object to keep association of keys & uppercase keys that are used for validations
                    keysArray: [], // used to create a array of keys displayed on UI
                    logicalOperatorHash: {}, // used to create a hash with logical operators in upper case and actual provided config operator for comparison/validations
                    keysOperatorsHash: {}, // used to create a hash to maintain on keys & respective operators
                    keysValuesHash: {} // used to create a hash to maintain on keys & respective values
                }
            }

            // help menu with label on UI
            if (!this.keyHelperMenu) {
                this.keyHelperMenu = [

                    {
                        value: ",",
                        label: ",       Comma to add another value to this key"
                    },
                    {
                        value: "⏎",
                        label: "⏎    Enter/Return to search/add a different key"
                    }
                ];
            }

            // HTML elements used in DOM
            if (!this.HTMLElements) {
                this.HTMLElements = {
                    logicalOperatorLabel: ('<input type="text" class="tagit-label logicalOperator-label"/>'),
                    allLabels: ('<span class="tagit-label"></span>'),
                    inputfieldWrapper: "<div class='inputWrapper'></div>",
                    autocompleteInputField: "<input class='inlineAutocomplete' readonly type='text'/>"
                }
            }

            // bracket object containing elements used to implement precedence
            if (!this.bracketObject) {
                this.bracketObject = {
                    roundBracketStack: [], // stack used to keep the track of open round brackets
                    openRoundBracketForColorChange: 0, // track the number of open brackets that need color change for error condition
                    roundBracketsPairCounter: -1  // counter to create a unique number used to associate the bracket pairs in UI
                };
            }

            this._createHelperMenuHash();  //used to create the hash for filter menu config with associated keys
        }
    });

})(jQuery);

