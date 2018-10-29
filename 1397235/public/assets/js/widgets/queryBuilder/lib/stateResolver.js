/**
 * A module that contains handlers for events for the different data that Peg provides
 * Contains the resolvers for the data that the peg provides
 *
 * @module StateResolver
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    '../util/queryBuilderUtil',
    '../util/constants'
], /** @lends StateResolver */
function (QueryBuilderUtil, CONSTANTS) {

    /**
     * StateResolver constructor
     *
     * @constructor
     * @class StateResolver - module that listen to all the events that PEG.js parser triggers
     *
     * @param {Object} conf - The configuration object
     *
     * @returns {Object} Current StateResolver' object
     */

    var StateResolver = function (conf) {

        var self = this;

        var vent = conf.vent;
        var reqres = conf.reqres;
        var queryBuilderUtil = new QueryBuilderUtil();


        var setResolveHandlers = function () {
            reqres.setHandlers({
                "validityResolver": validityResolver,   //Used to get the valid/invalid state of expression
                "stateResolver": stateResolver,     // Used to get the current state of the expression
                "messageResolver": messageResolver  // use to get the appropriate message based on state of expression
            });
        };

        var setStateTriggers = function () {
            reqres.setHandlers({
                "triggerQueryValidity": triggerQueryValidity,   // Use to trigger the event containing expression validity details
                "triggerStateForAutocomplete": triggerStateForAutocomplete, // Used to trigger the state of expression, that autocomplete listens to
                "triggerMessage": triggerMessage,    // Used to trigger the message based on state, that is shown to the user
                "triggerIconState": triggerIconState,   // use to trigger the icon based on the validity as valid / invalid icons
                "triggerStyleUpdate": triggerStyleUpdate,   // trigger to style update for query in container
                "triggerExecuteQuery": triggerExecuteQuery,   // event trigger to indicate the backend for executing the search
                "triggerEmptyQuery": triggerEmptyQuery   // event trigger to indicate filter bar is turned empty based on user action
            });
        };

        var initialize = function () {
            setResolveHandlers();
            setStateTriggers();
        };

        /**
         * Inner method
         * Used to resolve whether the provided expression string is valid / invalid in respect to to the grammar rules.
         * Depends on the object that parser creates after rule validation.
         * @param {array} list of rules executed by parser.
         */
        var validityResolver = function () {
            var parserObject = reqres.request("parser.parsedObj").parsedObj;
            var resolvedObject = {};
            if (_.isUndefined(parserObject.error)) {
                resolvedObject = {
                    'state': state = "valid",
                    'model': parserObject.model
                }
            } else {
                resolvedObject = {
                    'state': state = "invalid",
                    'model': parserObject.model
                }
            }
            return $.extend(true, {}, resolvedObject);
        };

        /**
         * Inner method
         * Used to resolve the current state based on the rules list that is provided by parser.
         * The resolved value is state of entered input value on UI.
         * Event is triggered with resolved state, that autocomplete listens to.
         * @param {array} list of rules executed by parser.
         */
        var stateResolver = function () {
            var parserObject = reqres.request("parser.parsedObj").parsedObj;
            var lastTermObjectValue;
            var expectedState;

            /**
             * Inner method
             * Used to resolve the state when expression is valid
             * Depends on the model object that parser creates after rule validation.
             * @param {obj} object containing AST model
             */
            var getStateWhenValid = function (model) {
                var state;
                // In valid - if space exists in model - then logical operator will be next
                if (model.space) {
                    state = CONSTANTS.state.anyLogicalOperator;
                } else if (!_.isUndefined(lastTermObjectValue)) {
                    state = CONSTANTS.state.matchingFieldValue;
                } else {
                    state = CONSTANTS.state.nodeSpace;
                }
                return state;
            };

            /**
             * Inner method
             * Used to resolve the state when expression is invalid
             * Depends on the array object that parser creates after rule validation.
             * @param {array} array containing all the states that the parser provides
             */
            var getStateOnError = function (allExpectedStates) {
                var state;
                ~(allExpectedStates.indexOf(CONSTANTS.state.relationalOperator)) && (state = CONSTANTS.state.relationalOperator);
                ~(allExpectedStates.indexOf(CONSTANTS.state.fieldTermValue)) && (state = CONSTANTS.state.fieldTermValue);
                ~(allExpectedStates.indexOf(CONSTANTS.state.fieldDelimiterSpace)) && (state = CONSTANTS.state.fieldDelimiterSpace);
                ~(allExpectedStates.indexOf(CONSTANTS.state.logicalOperatorSpace)) && (state = CONSTANTS.state.logicalOperatorSpace);
                (~(allExpectedStates.indexOf(CONSTANTS.state.singleTerm)) || ~(allExpectedStates.indexOf(CONSTANTS.state.fieldName)) || ~(allExpectedStates.indexOf(CONSTANTS.state.term))) && (state = CONSTANTS.state.term);
                ~(allExpectedStates.indexOf(CONSTANTS.state.termSpace)) && (state = CONSTANTS.state.termSpace);
                ~(allExpectedStates.indexOf(CONSTANTS.state.closeParen)) && (state = CONSTANTS.state.closeParen);
                ~(allExpectedStates.indexOf(CONSTANTS.state.openParenSpace)) && (state = CONSTANTS.state.openParenSpace);
                ~(allExpectedStates.indexOf(CONSTANTS.state.logicalOperator)) && (state = CONSTANTS.state.logicalOperator);

                return state;
            };

            /**
             * Inner method
             * Used to get the last object that is present in the UI
             * In case of invalid key expression the paser provides the object details
             * For valid, the last object is extracted from model
             * @param {obj} object containing AST model
             * @return {Object} containing details of last object present in UI
             */
            var getLastObject = function (model) {
                var lastObject;
                if (_.isUndefined(parserObject.error) && !model.space) {
                    lastObject = queryBuilderUtil.getModelLastObject(model);
                } else {
                    lastObject = reqres.request("parser.lastFieldTermObj"); // provides the last incomplete/invalid field expression
                }
                return lastObject;
            };

            lastTermObjectValue = getLastObject(parserObject.model);

            if (_.isUndefined(parserObject.error)) {
                // Valid expression
                expectedState = getStateWhenValid(parserObject.model);
            } else {
                // Invalid expression
                // create a unique list from the parser expected list
                var uniqueExpectedList = _.uniq(parserObject.error.expected, function (obj, key) {
                    return obj.description
                });
                //from the unique list, get only the description
                var allExpectedStates = uniqueExpectedList.map(function (obj) {
                    return obj.description;
                });

                expectedState = getStateOnError(allExpectedStates);
            }

            var resolvedState = {
                expectedState: expectedState,
                lastTermObjectValue: lastTermObjectValue
            };

            return resolvedState;
        };

        /**
         * Inner method
         * Used to resolve the message intended for user in case of invalid expression
         * depends on validityResolver & stateResolver methods to identify the states & resolve to appropriate messages for the user
         */
        var messageResolver = function () {
            var message;
            switch (stateResolver().expectedState) {
                case CONSTANTS.state.nodeSpace:
                case CONSTANTS.state.anyLogicalOperator:
                case CONSTANTS.state.matchingFieldValue:
                    message = CONSTANTS.messages.nodeSpace;
                    break;
                case CONSTANTS.state.logicalOperator:
                    message = CONSTANTS.messages.logicalOperator;
                    break;
                case CONSTANTS.state.termSpace:
                    message = CONSTANTS.messages.termSpace;
                    break;
                case CONSTANTS.state.closeParen:
                    message = CONSTANTS.messages.closeParen;
                    break;
                case CONSTANTS.state.logicalOperatorSpace:
                    message = CONSTANTS.messages.logicalOperatorSpace;
                    break;
                case CONSTANTS.state.term:
                    message = CONSTANTS.messages.term;
                    break;
                case CONSTANTS.state.relationalOperator:
                    message = CONSTANTS.messages.relationalOperator;
                    break;
                case CONSTANTS.state.fieldTermValue:
                    message = CONSTANTS.messages.fieldTermValue;
                    break;
                case CONSTANTS.state.fieldDelimiterSpace:
                    message = CONSTANTS.messages.fieldDelimiterSpace;
                    break;
                case CONSTANTS.state.openParenSpace:
                    message = CONSTANTS.messages.openParenSpace;
                    break;
            }
            return message;
        };

        var triggerQueryValidity = function (queryObj) {
            vent.trigger("query.validity", queryObj);
        };

        var triggerStateForAutocomplete = function (state) {
            vent.trigger("query.autocomplete.state", state);
        };

        var triggerMessage = function (messageObj) {
            var message;
            switch (messageObj.type) {
                case CONSTANTS.validity.valid:
                case CONSTANTS.validity.invalid:
                    message = messageResolver();
                    break;
                default:
                    message = CONSTANTS.validity.info;
            }
            vent.trigger("query.message", message);
        };

        var triggerIconState = function (iconObj) {
            // trigger icon event based on "valid" / "invalid" / "info" states
            vent.trigger("query.icon." + iconObj.state, iconObj);
        };

        var triggerStyleUpdate = function (styleObj) {
            // trigger styleUpdate event based on "valid" / "invalid" states
            vent.trigger("query.styleUpdate." + styleObj.state, styleObj);
        };

        var triggerExecuteQuery = function (queryObj) {
            // triggers when the user press enters to execute the query
            vent.trigger("query.executeQuery", queryObj);
        };

        var triggerEmptyQuery = function (queryObj) {
            // trigger based when the filter bar is empty
            vent.trigger("query.emptyQuery", queryObj);
        };

        initialize();
    };

    return StateResolver;
});
