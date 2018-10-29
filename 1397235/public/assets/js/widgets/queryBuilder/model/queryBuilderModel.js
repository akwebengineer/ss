/**
 * A model representing a query in filter bar.  The model
 * contains the following attributes:
 *
 * {Object} AST - The abstract syntax tree based on current state of the query
 * {String} query - The query expression string
 *
 * @module QueryModel
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'marionette',
    'vendor/backbone/backbone.treemodel',
    'widgets/queryBuilder/lib/parser',
    'widgets/queryBuilder/util/queryBuilderUtil',
    'widgets/queryBuilder/util/constants'
], function (Backbone, Marionette, BackboneTreeModel, Parser, QueryBuilderUtil, CONSTANTS) {
    var queryBuilderUtil;

    var QueryModel = Backbone.Model.extend({

        defaults: {
            AST: {
                type: "",
                value: "",
                nodes: [],
                id: ""
            },
            query: "", // consists valid query string in sync to model,
            invalidQuery: "", // consists invalid query string thay will be created in UI
            state: CONSTANTS.validity.invalid // state of query - valid / invalid | defalut - invalid (When UI is rendered with empty filter bar)
        },
        parser: null,
        previousValidModel: {
            AST: {
                type: "",
                value: "",
                nodes: [],
                id: ""
            }
        },
        modelTree: new BackboneTreeModel({}),
        errorMsgs: {
            'noMatchID': 'Node could not be found for id - ',
            'noMatchTerm': 'Node could not be found for term - ',
            'fieldTermDetails': 'Field term details are missing attributes - ',
            'incorrectQuery': 'Query details are incorrect - ',
            'updateTermDetails': 'Term details are missing for update - '
        },

        initialize: function (options) {
            queryBuilderUtil = new QueryBuilderUtil();
            this.options = options;
            this.parser = new Parser({
                "appConfig": options.appConfig,
                "vent": options.vent,
                "reqres": options.reqres
            });
            this.on('change:AST', this.changeAST);
        },

        /**
         * Method used to invoke the parser's parse method which is used for validating the query
         * Update and sync the model based on parser response
         * @returns {Object} model and error details based on the current expression. If the expression is erroneous the model is empty.
         */
        verify: function (queryString) {
            var self = this;

            /**
             * @Inner format the model to assign ID's based on previous valid copy of model
             * @param {Object} modelAST - model data generated from parser
             * @param {Object} previousModelAST - previous valid model data
             * @returns {Object} JSON object - updated model with assigned ID's
             */
            var formatModelAST_includeID = function (modelAST, previousModelAST) {
                var previousModelTree = new BackboneTreeModel(previousModelAST);
                var formattedModelAST = queryBuilderUtil.formatModelAST(modelAST, previousModelTree);
                return formattedModelAST;
            };

            /**
             * Create 'backbone tree model' instance on latest model - will be used to perform the library CRUD operations on model AST
             */
            var createBackboneTreeModel = function (formattedModelAST) {
                // Keep latest instance of backbone tree model for any CRUD operations
                self.modelTree = new BackboneTreeModel(formattedModelAST);
            };

            /**
             * @Inner update the model including the Id's from previous model based on valid/invalid state of query
             * @param {Object} validityObj - validity object resolved based on grammar output
             * @returns {Object} updatedValidityObj - updated validityObj including model with assigned ID's
             */
            var updateModelObject = function () {
                var validityObj = self.options.reqres.request("validityResolver"); // get the details as valid/invalid regarding latest query

                var updatedValidityObj = $.extend(true, {}, validityObj);
                var formattedModelWithID;

                if (validityObj.state == CONSTANTS.validity.valid) {
                    //update the Id's in the latest generated model.
                    formattedModelWithID = formatModelAST_includeID(validityObj.model, self.previousValidModel.AST);
                    self.previousValidModel.AST = formattedModelWithID; // maintain a previous model state for future reference to assign Id's
                    self.set('AST', formattedModelWithID); //Update the model object
                    self.set('state', CONSTANTS.validity.valid); //Update the model state as "valid"
                    self.set('invalidQuery', ""); //reset the invalidQuery
                } else {
                    self.set('AST', {}); //Update the model object as empty in case of invlalid
                    self.set('state', CONSTANTS.validity.invalid); //Update the model state as "invalid"
                    self.set('invalidQuery', queryString); //set the invalidQuery with invalid string
                    formattedModelWithID = {};
                }

                updatedValidityObj.model = formattedModelWithID;

            };

            this.parseQuery(queryString); //parse the latest queryString to verify
            updateModelObject(); // update model with latest details of query as valid/invalid query
            createBackboneTreeModel(this.get('AST')); //sync the backbone tree with the updated model for consistency
        },

        /**
         * Handler method triggered when AST is changed in model
         */
        parseQuery: function (queryString) {
            return this.parser.parse(queryString); //parse the queryString
        },

        /**
         * Handler method triggered when AST is changed in model
         */
        changeAST: function () {
            var query = queryBuilderUtil.constructQuery(this.get('AST'));  // create a string expression from latest AST
            this.set('query', query); // update the query in model object
        }

    });

    /**
     * clear or empty the expression
     */
    QueryModel.prototype.clear = function () {
        this.verify(""); //no term to be in tree : clear & update the related models
        if (this.getQueryDetails().state != CONSTANTS.validity.valid) {
            $(this).trigger('dataStore.clear', {"expression": ""});
        }
    };

    /**
     * Get latest query from the model
     * @returns {String} Query Expression based on model.
     */
    QueryModel.prototype.getQuery = function () {
        return this.get('query');
    };

    /**
     * Get invalid query from the model
     * @returns {String} Invalid Query Expression based on API operations
     */
    QueryModel.prototype.getInvalidQuery = function () {
        return this.get('invalidQuery');
    };

    /**
     * Get query details passed back as object containing information related to query
     * Verify method updates the model for each execution
     * @returns {object} containing model with ID, state, query
     */
    QueryModel.prototype.getQueryDetails = function () {
        var queryModel = {
            model: {},
            query: "",
            state: this.get('state')
        };

        if (queryModel.state == CONSTANTS.validity.valid) {
            queryModel.model = this.get('AST');
            queryModel.query = this.get('query');
        }

        return queryModel;
    };

    /**
     * Get latest valid query from the model
     * @param {String} id - model data generated from parser
     * @returns {Object} JSON object - the node based on id | if 'id' not provided, then entire tree is returned
     */
    QueryModel.prototype.getAST = function (id) {
        if (id) {
            var node = this.modelTree.findWhere({'id': id});
            if (node) {
                // Not using this.modelTree.toJSON(), since toJSON() serializes the data by removing empty arrays
                return _.clone(node.attributes);
            } else {
                throw new Error(this.errorMsgs.noMatchID + id);
            }
        } else {
            // Not using this.modelTree.toJSON(), since toJSON() serializes the data by removing empty arrays
            return _.clone(this.modelTree.attributes);
        }
    };

    /**
     * Get the node respective to provided term.
     * @param {String} term - term that needs to be found in tree. Term can be- single Term eg: 'test' | field value term e:g 'version=1'
     * @returns {Object} JSON object - the node based on term
     */
    QueryModel.prototype.getTerm = function (term) {
        if (term) {
            var nodes = this.modelTree.where({value: term});
            if (nodes.length > 0) {
                var termNodes = [];
                for (var index = 0; index < nodes.length; index++) {
                    termNodes.push(_.clone(nodes[index].attributes));
                }
                return termNodes;
            } else {
                throw new Error(this.errorMsgs.noMatchTerm + term);
            }
        } else {
            throw new Error(this.errorMsgs.noMatchTerm + term);
        }
    };

    /**
     * Check what type of terms the query consists.
     * @returns {Object} JSON object - containing the boolean parameters for the type of terms in query
     */
    QueryModel.prototype.getTermsType = function () {
        var typesObj = {
            "literal": false,
            "fieldExpression": false
        };
        var nodes;

        nodes = this.modelTree.findWhere({type: CONSTANTS.nodeType.literal});
        if (nodes) {
            typesObj.literal = true;
        }

        nodes = this.modelTree.findWhere({type: CONSTANTS.nodeType.fieldExpression});
        if (nodes) {
            typesObj.fieldExpression = true;
        }

        return typesObj;
    };

    /**
     * Adds a term at the end of the existing tree.
     * Parses the new expression, which updates the model internally.
     * @param {Object} addObject - Object that contains term details that needed to be added
     var addObject = {
             "logicalOperator": "or", //by default "AND" is the logical operator
             "query": "singleTerm | fieldTerm" // eg: - "anyValidQuery and query1 or query2 or key=value"
             "data": [ // Array of objects containing the details of the key, values, logical operator, relational operator
                        {"label": "OSVersion", "values": ["19.1", "19.2"]},
                        {"label": "OSVersion", "values": ["19.1", "19.2"], "logicalOperator":"NOT"},
                        {"label": "OSVersion", "values": ["19.1", "19.2"], "relationalOperator":"<"},
                        {"values": ["JuniperProducts"], "logicalOperator":"AND"}
                    ]
            };
     */
    QueryModel.prototype.add = function (addObject) {

        var newQuery,
            queryString,
            existingQuery;
        var logicalOperator = addObject.logicalOperator ? addObject.logicalOperator : "AND";
        var addQuery = addObject.query;
        var addData = addObject.data;

        /**
         * method to check if there is an error in the passed addObject and throw the exception accordingly
         * @inner
         */
        var checkError = function () {
            var validObject = true;

            if ((_.isUndefined(addQuery) || addQuery == "") && _.isUndefined(addData)) {
                validObject = false;
            }
            if (!_.isUndefined(addQuery) && !_.isUndefined(addData)) {
                // either 'data' or 'query' should be allowed
                validObject = false;
            }

            if (!validObject) {
                throw new Error(this.errorMsgs.incorrectQuery + addQuery);
            }
        };


        checkError();

        if (_.isEmpty(this.get('invalidQuery'))) {
            existingQuery = this.get('query');  // none of the invalid string exist - hence get the valid query string
        } else {
            existingQuery = this.get('invalidQuery');
        }

        if (addQuery) {
            newQuery = addQuery;
        } else {
            // pick the logical operator of first defined data as connector
            logicalOperator = _.isUndefined(addData[0].logicalOperator) ? logicalOperator : addData[0].logicalOperator;
            newQuery = queryBuilderUtil.serializeAddData({'data': addData}).query; // serialize the data in an acceptable query form
        }

        // if existingQuery is present, append the new query to existing query along with logical operator
        queryString = _.isEmpty(existingQuery) ? newQuery : existingQuery + " " + logicalOperator + " " + newQuery;

        this.verify(queryString); // This will update model to latest based on full query string

        // This will update the view to latest
        if (this.getQueryDetails().state == CONSTANTS.validity.valid) {
            $(this).trigger('dataStore.add');
        } else {
            $(this).trigger('dataStore.invalid', {"expression": this.getInvalidQuery()});
        }
    };

    /**
     * Updates the provided object.
     * @param {Object} object - object with details of the term that needs to be updated
     */
    QueryModel.prototype.update = function (updateObject) {
        if (updateObject.fieldGroupID) {
            //field term is updating
            if (updateObject.term && updateObject.term.id) {
                // some field term in field group is updating
                var fieldGroupNode = this.modelTree.findWhere({'id': updateObject.fieldGroupID});
                var node = fieldGroupNode.findWhere({"id": updateObject.term.id});
                if (node) {
                    var termObj = updateObject.term;
                    if (termObj.key && termObj.operator && termObj.value) {
                        node.set({
                            "fieldValue": termObj.value,
                            "value": termObj.key + termObj.operator + termObj.value,
                            "expression": termObj.key + termObj.operator + termObj.value
                        });
                        // create a query with updated values & parse to validate & update the model
                        var queryString = queryBuilderUtil.constructQuery(this.modelTree.toJSON());
                        var validatedObj = this.verify(queryString);
                        if (_.isUndefined(validatedObj.error)) {
                            $(this).trigger('dataStore.update');
                        }
                    }
                }
            } else if (updateObject.term && !updateObject.term.id) {
                // new values put in same field group
                var fieldGroupNode = this.modelTree.findWhere({'id': updateObject.fieldGroupID});
                var currentFieldGroupExpression = fieldGroupNode.toJSON().expression;
                var newFieldGroupExpression = currentFieldGroupExpression + "," + updateObject.term.value;
                //use parser to get the correct tree model format for the updated field expression
                var validatedObj = this.parseQuery(newFieldGroupExpression);
                if (_.isUndefined(validatedObj.error)) {
                    fieldGroupNode.set(validatedObj.model);
                    var queryString = queryBuilderUtil.constructQuery(this.modelTree.toJSON());
                    var validatedObj = this.verify(queryString);
                    if (_.isUndefined(validatedObj.error)) {
                        $(this).trigger('dataStore.update');
                    }
                } else {
                    throw new Error(this.errorMsgs.updateTermDetails + object);
                }
            } else {
                throw new Error(this.errorMsgs.updateTermDetails + object);
            }
        } else if (updateObject.term && updateObject.term.id) {
            // single term is updating
            var node = this.modelTree.findWhere({'id': updateObject.term.id});
            node.set({"value": updateObject.term.value});
            // create a query with updated values & parse to validate & update the model
            var queryString = queryBuilderUtil.constructQuery(this.modelTree.toJSON());
            this.verify(queryString);
            if (this.getQueryDetails().state == CONSTANTS.validity.valid) {
                $(this).trigger('dataStore.update');
            }
        } else {
            throw new Error(this.errorMsgs.updateTermDetails + object);
        }
    };

    /**
     * Remove the node based on the ID. Also balance the tree with node removal
     * @param {String} id - id of the node
     */
    /* Note : Following method do not have a real use case associated.
     * There is high complexity involved in removing a node and balancing the tree in case of parantheses tree.
     * it's been discussed to not support the method the method until there is a real application use case.
     * Keeping the method commented for the time being
     */
    // QueryModel.prototype.remove = function (id) {
    //     var nodeToRemove;
    //
    //     /**
    //      * @Inner Recursive method to iterates over the model & remove the node based on id.
    //      * Balance the tree with the node removal;
    //      * @param {node} node - That needs to be tested for removal
    //      * @param {node} nodeToRemove - node that helps in identifying the node that needs to be deleted.
    //      */
    //     var removeNode = function (node, nodeToRemove) {
    //         switch (node.toJSON().type) {
    //             case CONSTANTS.nodeType.literal:
    //                 if (node.isRoot()) {
    //                     this.verify(""); //no term in tree any more
    //                 } else {
    //                     removeNode.call(this, node.parent(), nodeToRemove); //recursive call to balance the tree
    //                 }
    //                 break;
    //             case CONSTANTS.nodeType.fieldExpression:
    //                 removeNode.call(this, node.parent(), nodeToRemove); //recursive call to balance the tree
    //                 break;
    //             case CONSTANTS.nodeType.binaryExpression:
    //                 if (node.isRoot()) {
    //                     if (node.nodes().toJSON()[0].id == nodeToRemove.toJSON().id) { // left node is to be removed
    //                         this.verify(node.nodes().toJSON()[1].expression); // validate the right subtree - this will recreate with the updated model
    //                     } else if (node.nodes().toJSON()[1].id == nodeToRemove.toJSON().id) { // right node is to be removed
    //                         this.verify(node.nodes().toJSON()[0].expression); // validate the left subtree - this will recreate with the updated model
    //                     }
    //                 } else {
    //                     if (node.nodes().toJSON()[0].id == nodeToRemove.toJSON().id) { // left node is to be removed
    //                         node.parent().add(node.nodes().toJSON()[1]); //right subtree needs to be moved to node parent - for unambiguous, balanced tree
    //                     } else if (node.nodes().toJSON()[1].id == nodeToRemove.toJSON().id) { // right node is to be removed
    //                         node.parent().add(node.nodes().toJSON()[0]); //left subtree needs to be moved to node parent - for unambiguous, balanced tree
    //                     }
    //                     node.remove(); // remove the node itself
    //
    //                     var queryString = queryBuilderUtil.constructQuery(this.modelTree.toJSON());
    //                     this.verify(queryString); // validate the remaining full tree - this will recreate with the updated model
    //                 }
    //                 break;
    //             case CONSTANTS.nodeType.parenExpression:
    //                 if (node.isRoot()) {
    //                     this.verify(""); //no term in tree any more
    //                 } else {
    //                     switch (node.parent().toJSON().type) {
    //                         case CONSTANTS.nodeType.binaryExpression:
    //                         case CONSTANTS.nodeType.parenExpression:
    //                             var nodeToAdjust = $.extend({}, node);
    //                             removeNode.call(this, node.parent(), nodeToAdjust); // call the parent for removal - for unambiguous, balanced tree
    //                             break;
    //                     }
    //                 }
    //                 break;
    //             case CONSTANTS.nodeType.fieldExpressionGroup:
    //                 if (node.isRoot()) {
    //                     this.verify(""); //no term in tree any more
    //                 } else {
    //                     switch (node.parent().toJSON().type) {
    //                         case CONSTANTS.nodeType.binaryExpression:
    //                         case CONSTANTS.nodeType.parenExpression:
    //                             var nodeToAdjust = $.extend({}, node);
    //                             removeNode.call(this, node.parent(), nodeToAdjust); // call the parent for removal - for unambiguous, balanced tree
    //                             break;
    //                     }
    //                 }
    //                 break;
    //         }
    //     };
    //
    //     var node = id && this.modelTree.findWhere({'id': id});
    //     if (node) {
    //         nodeToRemove = $.extend({}, node);
    //         removeNode.call(this, node, nodeToRemove); //recursive method to delete the identified node
    //
    //         // This will update the view to latest
    //         if (this.getQueryDetails().state == CONSTANTS.validity.valid) {
    //             $(this).trigger('dataStore.remove');
    //         } else {
    //             $(this).trigger('dataStore.invalid', {"expression": this.getQueryDetails().query});
    //         }
    //     } else {
    //         throw new Error(this.errorMsgs.noMatchID + id);
    //     }
    // };

    return QueryModel;
});
