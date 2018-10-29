/**
 * A utility module that finds suggestions based on query and state for queryBuilder widget
 *
 * @module SuggestionFinder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @author Vidushi <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    './queryBuilderUtil',
    './constants'
], /** @lends SuggestionFinder */
function (QueryBuilderUtil, CONSTANTS) {

    var SuggestionFinder = function (options) {

        var emptyArray = [];
        var queryBuilderUtil = new QueryBuilderUtil();
        var conf = options.appConfig;
        var formattedConfig;

        var initialize = function () {
            formatConfig(conf);
        };

        // Formats the configuration based on autoComplete's requirements and to enable quick lookup.
        var formatConfig = function (conf) {
            formattedConfig = {
                logicalOperators: [],
                fieldObj: {},
                fieldNames: []
            };

            // Converts logicMenu configuration in this format:
            // [{'value': 'AND'}, {'value': 'OR'}, {'value': 'NOT'}]
            if (_.isArray(conf.logicMenu)) {
                for (var i = 0; i < conf.logicMenu.length; i++) {
                    formattedConfig.logicalOperators[i] = {};
                    formattedConfig.logicalOperators[i].value = conf.logicMenu[i];
                }
            }

            if (_.isObject(conf.filterMenu)) {
                var count = 0;
                for (filter in conf.filterMenu) {
                    var currentObj = conf.filterMenu[filter];
                    formattedConfig.fieldObj[filter] = {
                        fieldValue: [],
                        operators: [],
                        remoteValue: ''
                    };

                    // Converts columnNames configuration to the format required by autocomplete:
                    // [{'value': 'column1'}, {'value': 'column2'}]
                    formattedConfig.fieldNames[count] = {};
                    formattedConfig.fieldNames[count++].value = conf.filterMenu[filter].label;

                    var objToModify = formattedConfig.fieldObj[filter];
                    objToModify.remoteValue = currentObj.remoteValue;
                    if (_.isArray(currentObj.value)) {
                        for (var i = 0; i < currentObj.value.length; i++) {
                            objToModify.fieldValue[i] = {};
                            objToModify.fieldValue[i].value = currentObj.value[i];
                        }
                    }
                    // Converts relational operators to the format required by autocomplete
                    if (!_.isEmpty(currentObj.operators)) {
                        $.each(currentObj.operators, function (key, value) {
                            objToModify.operators.push({"value": key, "label": value.label});
                        });
                    }
                }
            }
        };

        /**
         * Find suggestions based on next state and query
         * @param {String}: current query
         * @param {Object}: current state
         *
         * @returns {Array of objects}
         */
        this.findSuggestions = function (query, state) {

            var key = (state.lastTermObjectValue && state.lastTermObjectValue.fieldName !== "") ? state.lastTermObjectValue.fieldName : query;
            switch (state.expectedState) {
                case CONSTANTS.state.anyLogicalOperator:
                case CONSTANTS.state.logicalOperator:
                    return formattedConfig.logicalOperators;

                case CONSTANTS.state.nodeSpace:
                case CONSTANTS.state.term:
                case CONSTANTS.state.closeParen:
                case CONSTANTS.state.openParenSpace:
                case CONSTANTS.state.termSpace:
                    return formattedConfig.fieldNames;

                case CONSTANTS.state.fieldTermValue:
                case CONSTANTS.state.fieldDelimiterSpace:
                case CONSTANTS.state.matchingFieldValue:
                    return formattedConfig.fieldObj[queryBuilderUtil.serializeSpecialCharacters(key).toUpperCase()].fieldValue;

                case CONSTANTS.state.relationalOperator:
                    return formattedConfig.fieldObj[queryBuilderUtil.serializeSpecialCharacters(key).toUpperCase()].operators;
            }

            return emptyArray;
        };

        /**
         * Function to check whether to show all suggestions or only the matching ones.
         * @param {String}: current query
         * @param {Object}: next state based on which suggestions are displayed
         *
         * @returns {Boolean}
         *
         * Example,
         * DeviceManagement=MX OR OSVersion
         *
         * For above query, show all suggestions for relational operator without any match.
         *
         * DeviceManagement=MX OR OSVersion=1
         *
         * For above query, show only the suggestions starting with '1'.
         */
        this.suggestWithoutMatch = function (query, state) {
            switch (state.expectedState) {
                case CONSTANTS.state.relationalOperator:
                case CONSTANTS.state.anyLogicalOperator:
                case CONSTANTS.state.fieldTermValue:
                case CONSTANTS.state.fieldDelimiterSpace:
                    return true;
            }
            return false;
        };

        /**
         * Function to get 'remoteValue' callback for a key if provided in configuration. This will only be used to load fieldValues.
         * @param {String}: current query
         * @param {Object}: current state
         *
         * @returns {Function}: callback function to load fieldValues.
         */
        this.getLookupCallback = function (query, state) {
            if (state.expectedState == "FieldTermValue" || state.expectedState == "FieldDelimiterSpace" || state.expectedState == "MatchingFieldValue") {
                var key = state.lastTermObjectValue.fieldName;
                var lookup = formattedConfig.fieldObj[queryBuilderUtil.serializeSpecialCharacters(key).toUpperCase()].remoteValue;
                return lookup;
            }
        };

        initialize();
    };

    return SuggestionFinder;
});