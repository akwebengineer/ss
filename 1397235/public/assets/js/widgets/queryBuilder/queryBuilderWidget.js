/**
 * A module that builds a QueryBuilder widget and validates the search terms against the provided configuration object.
 * The configuration object includes the container which should be used to render the widget.
 *
 * @module QueryBuilderWidget
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/baseWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/queryBuilder/templates/queryBuilderContainer.html',
    './model/queryBuilderModel',
    './views/queryBuilderView',
    './util/queryBuilderUtil',
    './lib/queryEvents',
    './lib/autoComplete',
    './lib/stateResolver',
    './lib/dragNDrop'
], /** @lends QueryBuilderWidget */
function (BaseWidget, render_template, queryBuilderTemplate, QueryBuilderModel, QueryBuilderView, QueryBuilderUtil, QueryEvents, AutoComplete, StateResolver, DragNDrop) {

    /**
     * QueryBuilderWidget constructor
     *
     * @constructor
     * @class QueryBuilderWidget - Builds a QueryBuilder widget from a configuration object.
     *
     * @param {Object} conf - It requires the container parameter. The rest of the parameters are optional.
     * container: defines the container where the widget will be rendered.
     * configuration: App provided configuration detailing logical operators, field names, operators & values.
     * autoComplete: defines the configuration object for showing autoComplete suggestions.
     * @returns {Object} Current QueryBuilderWidget's object
     *
     *
     * ########################################################################################################
     * =========== Several events that the widget use as observer with in widget libraries & grammar =======
     * #### Container events #### Events that can be listened by application
     * "query.valid" -- Object contains formatted details of model
     * "query.invalid" -- Object contains details of error & model
     * "query.message" -- resolved message string based on state
     *
     * #### Parser events #### Triggered with the data created by Grammar | Internal Event
     * "parser.parsedObj" -- Object contains details of validity, error, model
     * "parser.rulesList" -- Object contains the rule sequence list for the expression
     *
     * #### Query events #### Triggered with the data to show the data on query | Internal Event
     * "query.validity" -- Object contains formatted details of validity, error, model
     * "query.autocomplete.state" -- Object contains formatted state for the autocomplete
     * "query.message" -- Object contains the resolved messages based on state
     *
     * #### reqres events #### Triggered to request differnt resolved states
     * "validityResolver" -- returns the resolved validity based on raw information provided by parser
     * "stateResolver" -- returns the resolved state based on rules list provided by parser
     * "messageResolver" -- returns the resolved validity message states of expression
     *
     * ########################################################################################################
     */

    var QueryBuilderWidget = function (conf) {

        var self = this,
            allContainers,
            queryBuilderModel,
            queryBuilderView,
            queryEvent,
            autoComplete,
            stateResolver,
            queryBuilderUtil = new QueryBuilderUtil(),
            vent = new Backbone.Wreqr.EventAggregator(),
            reqres = new Backbone.Wreqr.RequestResponse();

        // BaseWidget constructor to register events provided as part of conf by app
        BaseWidget.call(this, {
            "events": conf.events
        });

        var initialize = function () {
            allContainers = {
                '$queryBuilderContainer': $(conf.container)
            };
        };

        /**
         * Builds the QueryBuilder widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build = function () {
            allContainers.$queryBuilderContainer.append(queryBuilderTemplate);
            var modifiedConf = {
                appConfig: queryBuilderUtil.formatConfig(conf),
                $container: allContainers.$queryBuilderContainer,
                autoComplete: conf.autoComplete,
                dragNDrop: conf.dragNDrop
            };

            var $filterBar = modifiedConf.$container.find("#filterBar");

            queryEvent = new QueryEvents({
                eventCallback: this._invokeHandlers, //Callback to invoke the events from the base Widget
                vent: vent
            });

            queryBuilderModel = new QueryBuilderModel({
                appConfig: modifiedConf.appConfig,
                vent: vent,
                reqres: reqres
            });

            queryBuilderView = new QueryBuilderView({
                model: queryBuilderModel,
                el: $filterBar,
                reqres: reqres,
                vent: vent
            });

            stateResolver = new StateResolver({
                vent: vent,
                reqres: reqres
            });

            if (_.isObject(modifiedConf.autoComplete) || _.isBoolean(modifiedConf.autoComplete)) {
                autoComplete = new AutoComplete({
                    container: $filterBar,
                    conf: modifiedConf,
                    vent: vent
                });
            }

            if(modifiedConf.dragNDrop ){
                new DragNDrop({
                    container: $filterBar,
                    dragNDrop: modifiedConf.dragNDrop,
                    model: queryBuilderModel,
                    reqres: reqres
                });
            }

            return this;
        };

        /**
         * Validates the query using parser. This does not update the view.
         * Note: This will update model if the parameter is provide for validation.
         * @param {string} queryExpression - optional. If this parameter is provided, then it will be validated against the parser. If not, the parser will validate the existing string in queryBuilder container.
         * @returns {Object} parsed AST of the query expression.
         */
        this.validate = function (queryExpression) {
            if (queryExpression) {
                // This will internally update the model only. UI will not be synced to model.
                queryBuilderModel.verify(queryExpression);
                return queryBuilderModel.getQueryDetails();
            } else {
                // get the details for the existing query of the filter bar
                return queryBuilderModel.getQueryDetails();
            }
        };

        /**
         * clear or empty the expression
         */
        this.clear = function () {
            return queryBuilderModel.clear();
        };

        /**
         * Get Query Expression
         * @returns {String} Query expression based on current state. It returns an empty string if query is invalid
         */
        this.getQuery = function () {
            return queryBuilderModel.getQuery();
        };

        /**
         * Get AST associated to the id. If no ID is provided, entire tree AST will be returned
         * @param {string} id - optional. valid id from the tree model. if invalid id, then error is thrown.
         * @returns {Object} Abstract Syntax Tree object based on current state. It returns an empty object if query is invalid
         */
        this.getAST = function (id) {
            return queryBuilderModel.getAST(id);
        };

        /**
         * Get nodes based on the term. Term can be single term OR field term. If mentioned term is not found error is thrown.
         * @param {string} term - optional. valid id from the tree model. if invalid id, then error is thrown.
         * @returns {Object} Abstract Syntax Tree object based on input term. It returns an Array of objects if multiple terms exists in expression.
         */
        this.getTerm = function (term) {
            return queryBuilderModel.getTerm(term);
        };

        /**
         * Get the types of terms that constitute the whole query - types are Literal \ FieldExpression
         * @returns {Object} Containing boolean parameters indicating which types are the part of query
         */
        this.getTermsType = function () {
            return queryBuilderModel.getTermsType();
        };

        /**
         * Adds the query at the end of the existing expression.
         * The query can include any combination of terms. eg. '((test1 and version=1,2)) and test2'. This method will add the query
         * at the end of the existing expression & validate the expression & update the model accordingly.
         * @param {Object} - with following structure
         * var addObject = {
                    "logicalOperator": "not",  //This is the logical operator that will be injected | default is OR
                    "query": "anyValidQuery" // following can be any term as key value pair or single value or query with the combination
                    "data" : data: [
                        {"label": "OSVersion", "values": ["19.1", "19.2"]},
                        {"label": "OSVersion", "values": ["19.1", "19.2"], "logicalOperator":"NOT"},
                        {"label": "OSVersion", "values": ["19.1", "19.2"], "relationalOperator":"<"},
                        {"values": ["JuniperProducts"], "logicalOperator":"AND"}
                    ]
                };
         */
        this.add = function (addObject) {
            return queryBuilderModel.add(addObject);
        };

        /**
         * Update existing id with values
         * @param {Object} - with following structure
         * var updateObject = {
                    "fieldGroupID":"groupID", // id of the field expression group for which the term belongs to.
                    "term": {
                        "id" : "someID", // id of the term that needs to be updated
                        "key": "name", // field name
                        "operator": "=", // field operator
                        "value": "test" // new value
                    }
                };
         */
        this.update = function (updateObject) {
            return queryBuilderModel.update(updateObject);
        };

        /**
         * Remove existing id with values. Also the remaining expression will be validated & model will be updated.
         * @param {string} id - valid id from the tree model. if invalid id, then error is thrown.
         */
        /* Note : Following method do not have a real use case associated.
         * There is high complexity involved in removing a node and balancing the tree in case of parantheses tree.
         * it's been discussed to not support the method the method until there is a real application use case.
         * Keeping the method commented for the time being
         */
        // this.remove = function (id) {
        //     return queryBuilderModel.remove(id);
        // };

        /**
         * Destroys all elements created by the QueryBuilder widget in the specified container
         * @returns {Object} Current widget object
         */
        this.destroy = function () {
            _.isObject(autoComplete) && autoComplete.destroy();
            conf.container.empty();

            ($('.queryBuilder-widget').length <= 1) && $('body').off('click.body.querybuilder');

            return this;
        };

        /**
         * Method used to bind the events hash that application needs to register with
         * @param {Object} eventsHash containing the keys and the handlers for the keys
         */
        this.bindEvents = function (eventsHash) {
            this._bindEvents(eventsHash);
        };

        /**
         * Unbind the handlers associated to the keys
         * @param {Object} eventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property.
         */
        this.unbindEvents = function (eventsHash) {
                self._unbindEvents(eventsHash);
        };

        /**
         * Private & not intended to be directly used by application.
         * Event object used by widget libraries / unit tests.
         * @returns {Object} EventAggregator Object
         */
        this._getWreqr = function () {
            return {
                reqres: reqres,
                vent: vent
            }
        };

        initialize();
    };

    QueryBuilderWidget.prototype = Object.create(BaseWidget.prototype);
    QueryBuilderWidget.prototype.constructor = QueryBuilderWidget;

    return QueryBuilderWidget;
});
