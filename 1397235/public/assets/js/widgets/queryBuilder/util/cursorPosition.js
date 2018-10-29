/**
 * Module that has utility methods for adjusting cursor positions for contentEditable div.
 *
 * @module CursorPosition
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([], /** @lends CursorPosition */
function () {

    //cursorIndex and cursorCoordinates are in global context as it has to be shared across all instances of CursorPosition per queryBuilder widget.
    var cursorIndex = 0;
    var cursorCoordinates;
    var CursorPosition = function ($container) {

        var self = this;

        /**
         * Get cursor position
         */
        this.getCursorPosition = function () {
            return cursorIndex;
        };

        /**
         * Get cursor coordinates
         */
        this.getCursorCoordinates = function () {
            return cursorCoordinates;
        };

        /**
         * This function is required to update the cursor position every time when there is a change in FilterBar.
         * Cursor position has to be tracked in cases when suggestion is selected using click.
         */
        this.updateCursorPosition = function (coordinates) {
            if (window.getSelection && window.getSelection().rangeCount != 0) {
                var range1 = window.getSelection().getRangeAt(0);
                var range2 = range1.cloneRange();
                range2.selectNodeContents($container.get(0));
                range2.setEnd(range1.endContainer, range1.endOffset);
                //if the range length is greater than container query length - do not update cursor Index
                if ($container.val().length >= range2.toString().length) {
                    cursorIndex = range2.toString().length;
                }
            }
            if (!_.isUndefined(coordinates)) {
                cursorCoordinates = coordinates;
            }
        };

        /**
         * Set cursor position
         * @param{NUMBER}: position to set cursor
         */
        this.setCursorPosition = function (position) {
            function setPosition(el, pos) {
                // Loop through all child nodes
                var node;
                for (var n in el.childNodes) {
                    node = el.childNodes[n];
                    if (node.nodeType == 3) { // check for text node
                        if (node.length >= pos) {
                            var range = document.createRange(),
                                sel = window.getSelection();
                            range.setStart(node, pos);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            return -1;
                        } else {
                            pos -= node.length;
                        }
                    } else {
                        pos = setPosition(node, pos);
                        if (pos == -1) {
                            return -1;
                        }
                    }
                }
                return pos;
            }

            setPosition($container.get(0), position);
            cursorIndex = position;
        };

        /**
         * Get word between cursor and delimiter
         * @param {Regex}: Regular expression to match the delimiter.
         * @returns {String}: word before cursor
         *
         * Example: for this delimiter: /[() ]/g
         * OSVERSION AND (ABC
         *
         * If the cursor is after ABC then this function will return the word "ABC". Delimiter in this case is parantheses and space.
         */
        this.getWordBeforeCursor = function (delimiter) {

            // Get current cursor position
            var currentIndex = self.getCursorPosition();
            var currentValue = $container.val();
            // Get whole string before cursor
            var strBeforeCursor = currentValue.substring(0, currentIndex);
            // Get all delimiters in the string before cursor
            var delimiters = strBeforeCursor.match(delimiter);
            // Get the index of last delimiter
            var delimiterIndex = (delimiters != null && delimiters.length > 0) ? strBeforeCursor.lastIndexOf(delimiters[delimiters.length - 1]) : -1;

            var wordBeforeCursor = strBeforeCursor;
            if (delimiterIndex != -1 && delimiterIndex < currentValue.length) {
                wordBeforeCursor = strBeforeCursor.substring(delimiterIndex + 1, strBeforeCursor.length);
            }
            return wordBeforeCursor;
        };

        /**
         * Set word before cursor and after last delimiter.
         * @param {Regex}: Regular expression to match the delimiter.
         * @param {String}: word to set
         *
         * @returns {Object}: The object has two properties: newCursorPosition -> Position of cursor after the new word is added, value -> entire query string after the new word has been added.
         *
         * Example: delimiter: /[() ]/g  word: DeviceVersion
         *
         * OSVersion=12.1 AND DeviceVe| AND IPAddress
         *
         * If cursor is after "DeviceVe" it will replace DeviceVe and return this string: OSVersion=12.1 AND DeviceVersion AND IPAddress
         */
        this.setWordBeforeCursor = function (delimiter, word) {

            var currentIndex = self.getCursorPosition();
            var currentValue = $container.val();

            if (currentIndex > currentValue.length) {
                currentIndex = currentValue.length;
            }
            // Get whole string before cursor
            var strBeforeCursor = currentValue.substr(0, currentIndex);

            // Get all delimiters in the string before cursor
            var delimiters = strBeforeCursor.match(delimiter);
            // Get the index of last delimiter
            var delimiterIndex = (delimiters != null && delimiters.length > 0) ? strBeforeCursor.lastIndexOf(delimiters[delimiters.length - 1]) : -1;

            var actString = currentValue.substr(0, delimiterIndex + 1) + word + currentValue.substr(currentIndex, currentValue.length - 1);
            $container.val(actString);
            var newCursorPosition = (!_.isUndefined(word)) ? delimiterIndex + word.length + 1 : -1;
            return {
                newCursorPosition: newCursorPosition,
                value: actString
            };
        };

        /**
         * Get entire string before cursor
         * @returns {String}
         */
        this.getStringBeforeCursor = function () {
            // Get current cursor position
            var currentIndex = self.getCursorPosition();
            var currentValue = $container.val();
            // Get whole string before cursor
            var strBeforeCursor = currentValue.substring(0, currentIndex);

            return strBeforeCursor;
        };

        /**
         * Check if the cursor is at the end of the query expression or not.
         * returns {Boolean}
         */
        this.isCursorAtEnd = function () {
            var currentIndex = self.getCursorPosition();
            var query = $container.val();
            if (currentIndex >= query.length) {
                return true;
            } else {
                return false;
            }
        };

        /**
         * Get entire string after cursor
         * @returns {String}
         */
        this.getStringAfterCursor = function () {
            // Get current cursor position
            var currentIndex = self.getCursorPosition();
            var currentValue = $container.val();
            // Get whole string After cursor
            var strAfterCursor = currentValue.substring(currentIndex, currentValue.length);

            return strAfterCursor;
        };

        /**
         * Get the target dom element where cursor belongs to
         * returns {object} jQueryObject of the dom
         */
        this.getCursorTarget = function () {
            var domNode = window.getSelection().anchorNode && window.getSelection().anchorNode.parentNode;
            return $(domNode);
        };

    };

    return CursorPosition;
});