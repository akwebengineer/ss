/**
 * A utility module that finds current query for autocomplete
 *
 * @module QueryFinder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/queryBuilder/util/cursorPosition',
    'widgets/queryBuilder/util/constants'
], /** @lends QueryFinder */
function (CursorPosition, CONSTANTS) {

    var QueryFinder = function ($container) {

        var cursorPosition;
        var initialize = function () {
            cursorPosition = new CursorPosition($container);
        };

        /**
         * Find query to show the suggestions
         * @param {Object}: current state
         * @param {Regex}: delimiter which has to be removed.
         */
        this.findQuery = function (state, delimiter) {

            // Example: DeviceFamily=MX,SR
            // In above example, the expected state will be 'MatchingFieldValue'.
            // As only the suggesstions for SR has to be loaded. So query is 'SR' in this case.
            if (state.expectedState == CONSTANTS.state.matchingFieldValue) {
                return state.lastTermObjectValue.fieldValues[state.lastTermObjectValue.fieldValues.length - 1];
            }
            // Example: DeviceFamily=
            // In above example, the expected state will be 'FieldTermValue' as fieldValues has to be loaded after relational Operator.
            // Example: DeviceFamily=MX,
            // For above query, the expected state will be 'FieldDelimiterSpace'
            else if (state.expectedState == "FieldTermValue" || state.expectedState == "FieldDelimiterSpace") {
                return state.lastTermObjectValue.fieldOperator;
            }
            else {
                return cursorPosition.getWordBeforeCursor(delimiter);
            }
        };

        /**
         * Sets the value in container after selecting the suggestion, making sure the exact suggestion along with case is replaced
         * @param {String}: query value that needs to be set from suggestion
         * @param {Object}: current state
         * @param {String}: selected suggestion value
         * @param {Regex}: delimiter which has to be removed.
         *
         * @returns {String}: modified query
         */
        this.setValue = function (query, state, selectedSuggestion, delimiter) {

            var currentValue = $container.val();
            var strBeforeCursor = cursorPosition.getStringBeforeCursor();
            var strAfterCursor = cursorPosition.getStringAfterCursor();
            var modifiedQuery, modifiedStrBeforeCursor;

            var appendSuggestion = function (modifiedStrBeforeCursor) {
                modifiedQuery = modifiedStrBeforeCursor + selectedSuggestion + strAfterCursor;
                $container.val(modifiedQuery);
                cursorPosition.setCursorPosition(modifiedStrBeforeCursor.length + selectedSuggestion.length);
            };

            if (state.expectedState == CONSTANTS.state.fieldTermValue || state.expectedState == CONSTANTS.state.relationalOperator || state.expectedState == CONSTANTS.state.fieldDelimiterSpace) {
                // Example:
                // OSVersion=| AND KLM
                // DeviceFamily|  OR KLM
                // For above two cases, the selected suggestion has to be appended directly.
                modifiedStrBeforeCursor = strBeforeCursor;
            } else {
                // Example:
                // DeviceFamily=sR| AND KLM
                // For above case, the suggestion is 'SRX'. So 'sR' has to be replaced with 'SRX', the exact suggestion (along with case)
                modifiedStrBeforeCursor = strBeforeCursor.substring(0, strBeforeCursor.length - query.length);
            }

            appendSuggestion(modifiedStrBeforeCursor);

            return modifiedQuery;
        };

        initialize();
    };

    return QueryFinder;
});