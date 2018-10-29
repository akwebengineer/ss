/**
 * Module that renders the query-builder view
 *
 * @module QueryBuilder View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['backbone',
    'lib/template_renderer/template_renderer',
    'text!widgets/queryBuilder/templates/query.html',
    'widgets/queryBuilder/util/editableUtil',
    'widgets/queryBuilder/util/containerUtil',
    'widgets/queryBuilder/util/queryBuilderUtil',
    'widgets/queryBuilder/util/cursorPosition',
    'widgets/queryBuilder/util/constants',
    'widgets/queryBuilder/lib/tooltipBuilder'
], function (Backbone, render_template, queryTemplate, EditableUtil, ContainerUtil, QueryBuilderUtil, CursorPosition, CONSTANTS, TooltipBuilder) {

    var containerUtil, queryBuilderUtil;
    var serializedQueryTemplate;
    var keyCode;

    var FilterView = Backbone.View.extend({

        events: {
            "keyup": "handleKeyUp",
            "paste": "handlePaste",
            "keydown": "handleKeyDown",
            "contextmenu": "handleRightClick"
        },

        initialize: function (options) {
            this.options = options;
            this.cursorPosition = new CursorPosition(this.$el);
            containerUtil = new ContainerUtil();
            queryBuilderUtil = new QueryBuilderUtil();
            keyCode = $.ui.keyCode;

            var editableUtil = new EditableUtil({
                $container: this.$el
            });
            editableUtil.replaceValueFunction();

            this.registerAllEvents(); // Register events associated to API's & query update on UI

            // serialize template to remove new line character
            serializedQueryTemplate = containerUtil.serializeQueryTemplate(queryTemplate);

            var tooltipBuilder = new TooltipBuilder({$container: this.$el, vent: this.options.vent});

            this.render();
        },

        //Any styling changes will go here
        render: function () {

        },

        // handler for keyDown event
        handleKeyDown: function (e) {
            // Default behavior of browser for Tab key needs to be prevented on keyDown event listener.
            if (e.keyCode == keyCode.TAB) {
                e.preventDefault();
            }
        },

        //handler for keyboard character input
        handleKeyUp: function (e) {
            if (e.keyCode == keyCode.UP || e.keyCode == keyCode.RIGHT || e.keyCode == keyCode.DOWN || e.keyCode == keyCode.LEFT || e.keyCode == keyCode.ESCAPE) {
                return;
            }

            this.cursorPosition.updateCursorPosition();
            if (this.cursorPosition.isCursorAtEnd()) { // cursor Position is At End
                // use case- input addition at end | remove at end
                var queryExpression = containerUtil.geTextFromDom(this.$el);  // read the full expression from UI container
                this.model.verify(queryExpression); //validate latest query

                // update the views & trigger events based on query validity
                if (!_.isEmpty(this.model.get('query'))) {
                    //valid query
                    this.updateViewAsValid({
                        "expression": queryExpression,
                        "keyCode": e.keyCode,
                        "action": "keyUp",
                        "cursorAtEnd": true,
                        "newCursorPosition": this._calculateNewCursorPosition()
                    });
                } else {
                    //invalid query
                    this.updateViewAsInvalid({
                        "expression": queryExpression,
                        "action": "keyUp"
                    });
                }
                this.options.reqres.request("triggerStateForAutocomplete", this.options.reqres.request("stateResolver")); // trigger for autocomplete

            } else {
                // use case- input addition in middle | remove in middle
                this._styleForEditableMode(); // Style the dom element on UI which is under editing

                // get substring | get state for autocomplete | do not update model
                var currentCursorPosition = this.cursorPosition.getCursorPosition();
                var querySubstring = this.cursorPosition.getStringBeforeCursor();
                this.model.parseQuery(querySubstring);
                var newCursorPosition = this._calculateNewCursorPosition({
                    "currentCursorPosition": currentCursorPosition
                });
                this.options.reqres.request("triggerStateForAutocomplete", this.options.reqres.request("stateResolver")); // only resolve for substring, as user caret is in middle of input field

                // get full string | validate | accordingly update model
                var queryExpression = containerUtil.geTextFromDom(this.$el);
                this.model.verify(queryExpression);

                // update the views based on query validity
                if (!_.isEmpty(this.model.get('query'))) {
                    //valid query
                    this.updateViewAsValid({
                        "expression": queryExpression,
                        "keyCode": e.keyCode,
                        "action": "keyUp",
                        "cursorAtEnd": false,
                        "newCursorPosition": newCursorPosition
                    });
                } else {
                    //invalid query
                    this.updateViewAsInvalid({
                        "expression": queryExpression,
                        "action": "keyUp"
                    });
                }
            }
        },
        // Handler for paste events in the filter bar
        handlePaste: function (e) {
            e.stopPropagation();
            e.preventDefault();

            // Workaround for MacOS Chrome and Safari behavior that automatically selects the text next to the positon of
            // right click thus not pasting in the intended cursorIndex
            if (this.rightClickAtCursor >= 0) {
                this.cursorPosition.setCursorPosition(this.rightClickAtCursor);
                this.rightClickAtCursor = null;
            }

            var clipboardText = (e.originalEvent || e).clipboardData.getData('text/plain'),
                cursorIndex = this.cursorPosition.getCursorPosition(),
                existingBeforeCursor = this.cursorPosition.getStringBeforeCursor(),
                existingAfterCursor = this.cursorPosition.getStringAfterCursor(),
                formattedClipboardText;

            // Since whitespaces at the beginning of the string needs to be formatted, clean the clipboard text if needed
            if (existingBeforeCursor == "") {
                formattedClipboardText = clipboardText.replace(/^\s+/, ""); // left trim
            } else {
                formattedClipboardText = clipboardText; // use as is clipboard text
            }

            var queryExpression = existingBeforeCursor + formattedClipboardText + " " + existingAfterCursor;
            // window.document.execCommand('insertText', false, text);
            containerUtil.setTextInDOM(this.$el, queryExpression);
            this.cursorPosition.setCursorPosition(cursorIndex + formattedClipboardText.length);
            var _evt = $.Event("keyup", {which: keyCode.ENTER, keycode: keyCode.ENTER});
            this.$el.trigger(_evt); // Trigger ENTER KEY PRESS and handover the flow
        },

        // Handler for right click
        handleRightClick: function (e) {
            // Remember the position of right click - Needed for MacOS Chrome and Safari behavior that automatically selects the
            // text next to the cursor on right click
            this.rightClickAtCursor = this.cursorPosition.getCursorPosition();
        },

        // update the entire view based on latest model when valid string
        // trigger the exposed events associated with the query validity
        updateViewAsValid: function (queryObject) {
            var queryState = CONSTANTS.validity.valid;

            var styleUpdateObj = {
                "state": queryState,
                "newCursorPosition": queryObject.newCursorPosition
            };

            // trigger all the individual elements that needs to be updated with valid query
            this.options.reqres.request("triggerQueryValidity", this.model.getQueryDetails());
            this.options.reqres.request("triggerMessage", {"type": queryState});
            this.options.reqres.request("triggerIconState", {"state": queryState});

            if (queryObject.action == "keyUp") {
                // indicates Key pressed on UI
                if (queryObject.keyCode == keyCode.ENTER) {
                    // query format will happen on Enter pressed & also will happen on space pressed when not edit case & space is pressed
                    this.options.reqres.request("triggerStyleUpdate", styleUpdateObj); // trigger event for UI Style update
                    this.options.reqres.request("triggerExecuteQuery", this.model.getQueryDetails()); // trigger event indicating search can be executed
                } else if (queryObject.expression.slice(-1) == " ") { // When space is pressed - style update
                    this.options.reqres.request("triggerStyleUpdate", styleUpdateObj); // trigger event for UI Style update
                }
            } else if (queryObject.action == "API") {
                // indicates API is executed with which UI style need to be updated / formatted
                this.options.reqres.request("triggerStyleUpdate", styleUpdateObj); // trigger event for UI Style update
                this.options.reqres.request("triggerExecuteQuery", this.model.getQueryDetails()); // trigger event indicating search can be executed
            }
        },

        // update the entire view based on latest model when invalid string
        // trigger the exposed events associated with the query invalidity
        updateViewAsInvalid: function (queryObject) {
            this.options.reqres.request("triggerQueryValidity", this.model.getQueryDetails());

            switch (queryObject.expression.trim()) {
                case "":
                    this.options.reqres.request("triggerMessage", {"type": CONSTANTS.validity.info}); // no value in filter bar - reset the tooltip message
                    this.options.reqres.request("triggerIconState", {"state": CONSTANTS.validity.info}); // no value in filter bar - reset the icon to info icon

                    // When space in the empty filter bar is pressed , reformat to update style to have no space in the beginning of the search
                    this.options.reqres.request("triggerStyleUpdate", {
                        "state": CONSTANTS.validity.info,
                        "text": "",
                        "newCursorPosition": 0
                    });

                    // When all the search criteria is made empty due to mentioned scenario, trigger the event for app to listen to
                    // delete pressed | text mouse selected and deleted | Clear API call used
                    this.options.reqres.request("triggerEmptyQuery"); // Trigger to indicate filter bar is turned empty

                    break;
                default:
                    this.options.reqres.request("triggerMessage", {"type": CONSTANTS.validity.invalid}); // Update the message in tooltip
                    this.options.reqres.request("triggerIconState", {"state": CONSTANTS.validity.invalid}); // reset the icon to invalid icon
            }

            if (queryObject.action == "API") {
                // With UI, the entered characters are already in UI container
                // UI Container has to be updated for when Invalid query as a result of API action
                containerUtil.setTextInDOM(this.$el, this.model.getInvalidQuery());
            }
        },

        // registed all event handlers for API's and Updates on UI
        registerAllEvents: function () {
            var self = this;
            // listen to various events and refresh the view with latest data model
            $(this.model).on('dataStore.add dataStore.update', function (e, obj) {
                self.updateViewAsValid({"action": "API"});
            });
            $(this.model).on('dataStore.clear dataStore.invalid', function (e, obj) {
                self.updateViewAsInvalid({"expression": obj && obj.expression, "action": "API"});
            });
            this.options.vent.on('query.icon.valid', function (obj) {
                self.updateIcon(CONSTANTS.validity.valid);
            });
            this.options.vent.on('query.icon.invalid', function (obj) {
                self.updateIcon(CONSTANTS.validity.invalid);
            });
            this.options.vent.on('query.icon.info', function (obj) {
                self.updateIcon(CONSTANTS.validity.info);
            });
            this.options.vent.on('query.styleUpdate.valid', function (obj) {
                self.updateStyleAsValid(obj);
            });
            this.options.vent.on('query.styleUpdate.invalid query.styleUpdate.info', function (obj) {
                self.updateStyleAsInvalid(obj);
            });
        },

        // update the validation icons on the UI for info | valid | invalid
        updateIcon: function (type) {
            var $svgIcon = this.$el.parent().find("svg.icon");
            $svgIcon.removeClass("valid invalid info").addClass(type);
            $svgIcon.find("use").attr("href", "#icon_" + type);
        },

        // update the style to reformat query on UI
        updateStyleAsValid: function (styleObj) {
            var serializedData = containerUtil.serializeModelDataForTemplate(this.model.get('AST')); // get serialized data for template rendering
            var queryHtml = render_template(serializedQueryTemplate, serializedData); // rendered html

            this.$el.html(queryHtml); // update the UI with latest HTML
            this.cursorPosition.setCursorPosition(styleObj.newCursorPosition); // Set cursor position based on the latest formatted input
        },

        updateStyleAsInvalid: function (styleObj) {
            !_.isUndefined(styleObj.text) && containerUtil.setTextInDOM(this.$el, styleObj.text);
            !_.isUndefined(styleObj.newCursorPosition) && this.cursorPosition.setCursorPosition(styleObj.newCursorPosition);
        },

        // style the dom element on UI which is under editting
        _styleForEditableMode: function () {
            var currentTarget = this.cursorPosition.getCursorTarget();
            if (currentTarget && currentTarget.hasClass("logicalOperator")) {
                currentTarget.addClass("editable");
            }
        },

        // calculate the position of the cursor based on the query being verified
        _calculateNewCursorPosition: function (cursorObj) {
            var newCursorPosition;
            var parserObject = this.options.reqres.request("parser.parsedObj").parsedObj; // Get the latest parsed object to get the model
            var formattedQuery = queryBuilderUtil.constructQuery(parserObject.model); // this will return formatted query along with all the space serialization
            if (_.isEmpty(formattedQuery)) {
                // Indicates the last position where editing stopped was invalid from beginning to cursor position
                newCursorPosition = cursorObj.currentCursorPosition;
            } else {
                // Indicates the query was valid from beginning to cursor position
                // get the length of the formatted query - indicates the location where cursor should be pointing
                newCursorPosition = formattedQuery.length;
            }
            return newCursorPosition;
        }
    });

    return FilterView;
});
