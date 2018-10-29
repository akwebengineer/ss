/**
 * Module that has utility methods for Editable Div.
 *
 * @module EditableUtil
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/queryBuilder/util/cursorPosition',
    'widgets/queryBuilder/util/containerUtil',
    'editable'
], /** @lends EditableUtil */
function(CursorPosition, ContainerUtil) {

    var EditableUtil = function(conf) {

        var editable;
        var containerUtil;
        var cursorPosition;
        var $container = conf.$container;
        var selectionWatcher;

        // Initialize EditableUtil
        var initialize = function(){
            editable = new Editable();
            selectionWatcher = editable.dispatcher.selectionWatcher;
            editable.add($container);
            cursorPosition = new CursorPosition($container);
            containerUtil = new ContainerUtil();
            registerEvents();
        };

        /**
         * get Editable instance
         */
        this.getEditable = function() {
            return editable;
        };

        /**
         * Register events for editable div.
         */
        var registerEvents = function() {

            // Use cursorPosition utility to update the cursor position and its coordinates.
            var updateCursor = function(elem, coordiantes) {
                if($container.is($(elem))) {
                    cursorPosition.updateCursorPosition(coordiantes);
                }
            };

            // Get the coordinates of the cursor in order to position the suggestion box container.
            var getCursorCoordinates = function() {
                // Use selectionWatcher to get current range from filterBar container.
                var range = selectionWatcher.getFreshRange();
                var cursor;
                var coordiantes;
                if (range.isCursor) {
                    cursor = range.getCursor();
                    if(!_.isUndefined(cursor)){
                        coordiantes = cursor.getCoordinates();
                    }
                }
                return coordiantes;
            };

            // Listen for the enter key press and return false to avoid new line.
            editable.on('insert', function(elem) {
                return false;
            });

            // Listen for enter key press when focus is within query string, return false to avoid new line.
            editable.on('split', function(elem) {
                return false;
            });

            /**
             * This event will be triggered for 'cut', 'copy' and 'paste' activity.
             * @param {Object}: DOM object for the element
             * @param {String}: name of the event: cut, copy, paste
             * @param {Object}: Selection Object. The object has these properties:
             *                  1. host: jquery element object for container.
             *                  2. range: Rangy's object for selection. Important properties are startOffset and endOffset. Which indicates where the selection starts and ends.
             *                  3. isSelection: A boolean property which indicates if any part of query is selected or not.
             */
            editable.clipboard(function(elem, eventName, selectionObj){
                // Invoke/call function to handle copy/paste/cut events here.
            });

            // Track cursor position for editable-div. This event will be triggered whenever the cursor position changes.
            editable.on('cursor', function(elem, cursor){

                updateCursor(elem, getCursorCoordinates());
            });

            // Update cursor position for 'change' event. This event will be triggered in case of any filterbar changes. It is mainly used to track the cursor position in case of 'backspace' key press and copy/paste.
            editable.on('change', function(elem){

                updateCursor(elem, getCursorCoordinates());
            });
        };

        /**
         * Replace jquery's value function for editable div. If the val function has parameter then jquery's text method will be used. Else, formatted result of jquery's text method will be returned.
         */
        this.replaceValueFunction = function () {
            var original = $.fn.val;
            var regexSpace = new RegExp("&nbsp;", 'g'),
                regexOpenBrackets = new RegExp("&lt;", 'g'),
                regexCloseBrackets = new RegExp("&gt;", 'g');

            var formatQuery = function (str) { //todo: delete the method if no clean up is required for the "<"/">" characters in data
                return str.replace(regexSpace, " ")
                          .replace(regexOpenBrackets, "<")
                          .replace(regexCloseBrackets, ">");
            };

            $.fn.val = function () {
                if (this.is('*[contenteditable=true]')) {
                    if (arguments.length == 0 && !_.isUndefined(editable)) {
                        var content = containerUtil.geTextFromDom(this);
                        return formatQuery(content);
                    }
                    else {
                        return $.fn.text.apply(this, arguments);
                    }
                }
                return original.apply(this, arguments);
            };
        };

        initialize();
    };

    return EditableUtil;
});