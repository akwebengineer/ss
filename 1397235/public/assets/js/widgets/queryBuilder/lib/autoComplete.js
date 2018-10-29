/**
 * A module that implements autoComplete functionality for queryBuilder widget
 *
 * @module AutoComplete
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'jqAutoComplete',
    'widgets/queryBuilder/lib/jqAutoCompleteModifier',
    'widgets/queryBuilder/util/suggestionFinder',
    'widgets/queryBuilder/util/cursorPosition'
], /** @lends AutoComplete */
function (jqAutoComplete, AutoCompleteModifier, SuggestionFinder, CursorPosition) {

    /**
     * AutoComplete constructor
     *
     * @constructor
     * @class AutoComplete - implements autoComplete functionality for queryBuilder widget
     *
     * @param {Object} options - configuration options for autoComplete module
     *
     * Autocomplete configuration parameters:
     *
     * delimiter: String or RegExp, Used for discarding some input values and to only consider a part of the query to show suggestions.
     * Example:
     * (A OR C) AND (De
     * Above query will show suggestions only for 'De' when space and parentheses are discarded by delimiter.
     *
     * autoSelectFirst: Boolean, the first item of the suggestion box will be auto selected and on enter key press the selected item will be injected in filterBar.
     * 
     * lookup: Function, a callback function which will be invoked on each keyup. The function will have two parameters. 
     * First parameter represents the query written in filterBar. Second parameter is a callback. The lookup function should call this callback function by passing the suggestions as parameter.
     * 
     * onSelect: Function, a callback function which will be invoked whenever a suggestion is selected. The function provides one parameter which is set to the selected suggestion.
     * preserveInput: Boolean, Indicates whether the query will stay the same while navigating over the suggestions or not. 
     * beforeShow: Function, a callback function which will be invoked before the suggestion container is appended to DOM. The function will have suggestion container's jQuery object as a parameter.
     * showNoSuggestionNotice: Boolean, If true shows a message when suggestion is not available.
     * noShowSuggestionNotice: String, This message will be displayed when no suggestion is available. 'showNoSuggestionNotice' should be set to true in order to show this message.
     *
     * @returns {Object} Current AutoComplete's object: this
     *
     */

    var AutoComplete = function (options) {

        var widgetConfig = options.conf;
        var $queryBuilderContainer = options.container;
        var vent = options.vent;
        var conf = widgetConfig.autoComplete;
        var suggestionFinder;
        var autoCompleteModifier;
        var self = this;

        var getAutoCompleteConfiguration = function () {
            var config = {
                maxHeight: _.isNumber(conf.maxHeight) ? conf.maxHeight : undefined,
                width: _.isNumber(conf.width) ? conf.width : 280,
                delimiter: /[() ]/g,  // Used to append the selected suggestions to query expression and for discarding the parantheses while showing suggestions.
                onSearchStart: _.isFunction(conf.onSearchStart) ? conf.onSearchStart : undefined,
                autoSelectFirst: true,
                lookup: lookupCallback,
                preserveInput: true,
                beforeShow: beforeShow,
                showNoSuggestionNotice: false, // Keeping following as false - Needs an interaction update from UX
                noSuggestionNotice: 'No suggestions available'
            };
            return config;
        };

        /**
         * @param {String}: current query word which is being edited/added
         * @param {Function}: callback function. This function needs to be called by passing the suggestions as parameter.
         * @param {Object}: current state of the term. The object will have two parameters: 
         *                  'type': type of the state for query term (example: 'fieldName', 'singleTerm', 'logicalOperator', etc)
         *                  'value': value of the query. This parameter is only useful in case of incomplete field expression. 
         *                  Example:
         *
         *                  >    IP AND OSVersion=
         *                      
         *                  For above query, the second parameter will be an object:
         *
         *                  {
         *                      fieldName: 'OSVersion',
         *                      relationalOperator: '=',
         *                      fieldValue: ''
         *                  }
         *                  This object can be used to decide next set of suggestions.
         *
         */
        var lookupCallback = function(currentToken, showSuggestion, state) {
            var lookup =  conf.lookup;
            
            // This callback function will be invoked once the suggestions will return from suggestionFinder or app-defined lookup function.
            var setSuggestions = function(data) {
                if(suggestionFinder.suggestWithoutMatch(currentToken, state)){
                    showSuggestion(data, true);
                } else {
                    showSuggestion(data);
                }
            };

            // Use app-defined callback to make an ajax call in the following case. 
            var remoteValueCallback = suggestionFinder.getLookupCallback(currentToken, state); 
            if(_.isFunction(remoteValueCallback)) {
                // Provide columnName of the fieldEpxression which is being edited as a paramter to callback function..
                remoteValueCallback(state.lastTermObjectValue.fieldName, setSuggestions);
            }
            else {
                var suggestionData = suggestionFinder.findSuggestions(currentToken, state);
                var suggestions = {
                    suggestions: suggestionData
                };
                setSuggestions(suggestions);
            }
        };

        var showAutoComplete = function () {
            $queryBuilderContainer.devbridgeAutocomplete(getAutoCompleteConfiguration());
        };

        // Callback function which will be invoked before suggestion container is appended to DOM
        var beforeShow = function(container) {
            var coordinates = self.cursorPosition.getCursorCoordinates();
            // If cursor is at beginneing, then let library calculate the correct left position based on the position of filterbar container.
            if(!_.isUndefined(coordinates) && coordinates.left != 0){
                container.css('left', coordinates.left);
            }
        };

        /**
         *  Initialize AutoComplete
         */
        initialize = function () {
            
            autoCompleteModifier = new AutoCompleteModifier({
                vent: vent
            });
            suggestionFinder = new SuggestionFinder({
                appConfig: widgetConfig.appConfig
            });

            self.cursorPosition = new CursorPosition(options.container);
            showAutoComplete();
        };

        /**
         *  Destroy AutoComplete
         */
        this.destroy = function () {
            $queryBuilderContainer.devbridgeAutocomplete('dispose');
        };

        initialize();
    };

    return AutoComplete;
});