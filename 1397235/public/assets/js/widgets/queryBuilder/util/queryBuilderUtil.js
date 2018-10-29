/**
 * Module that is used to have utility methods
 *
 * @module QueryBuilderUtil
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['widgets/queryBuilder/util/constants'], function (CONSTANTS) {

    /**
     * QueryBuilderUtil constructor
     *
     * @constructor
     * @class QueryBuilderUtil - Module that is used to have utility methods
     *
     * @param {Object} conf - The configuration object
     *
     * @returns {Object} Current QueryBuilderUtil's object
     */
    var QueryBuilderUtil = function (conf) {

        var self = this;

        // method to reformat the app provided configuration so that the widget can consume as per need
        this.formatConfig = function (conf) {
            var formattedConf = {};

            //Reformat the advance search filterMenu, making 'label' as the key to object
            var formatFilterMenu = function () {
                // Normalize the key used in Grammar template, so that syntactically grammar do not break
                var normalizeLabelAsGrammarKey = function (label) {
                    var key = label.toUpperCase();
                    // remove the "hyphen | space" for the formatted key
                    key = key.replace(/[-\s]+/g, '');
                    return key;
                };

                var filterMenu = conf.filterMenu;
                var formattedFilterMenu = {};
                for (var configKey in filterMenu) {
                    var configObj = filterMenu[configKey];
                    formattedFilterMenu[normalizeLabelAsGrammarKey(configObj.label)] =
                        {
                            label: configObj.label,
                            key: configKey,
                            value: configObj.value,
                            operators: getRelationalOperators(configObj.operators),
                            remoteValue: configObj.remoteValue
                        }
                }
                return formattedFilterMenu;
            };

            /* Method to pick th correct value of Relational Operators
             * Rearrange the sequence of operators - since the Grammar does the character validation, sequence needs to be ('!'[=<>] | [<>]'=' | [<>])
             * Add the details for the relational operator to show in popup - like 'labels'
             */
            var getRelationalOperators = function (operators) {
                var defaultOperators = CONSTANTS.relationalOperators;

                var detailedArrangedOperators = {};
                var arrangedOperators = [],
                    opList1 = [],
                    opList2 = [],
                    opList3 = [],
                    opList4 = [];

                operators = _.isUndefined(operators) ? Object.keys(defaultOperators) : operators;

                // Following rearranges the order of operators
                for (var i = 0; i < operators.length; i++) {
                    if (operators[i].match(/^(=)$/)) { // Per UX, '=' operator always needs to be first as suggestion
                        opList1.push(operators[i]);
                    }
                    if (operators[i].match(/^(!=|!<|!>)$/)) {
                        opList2.push(operators[i]);
                    }
                    if (operators[i].match(/^(<=|>=)$/)) {
                        opList3.push(operators[i]);
                    }
                    if (operators[i].match(/^(<|>)$/)) {
                        opList4.push(operators[i]);
                    }
                }

                arrangedOperators = arrangedOperators.concat(opList1, opList2, opList3, opList4);

                // associate the details from the list of default operators, to each conf operator
                for (var i = 0; i < arrangedOperators.length; i++) {
                    for (var key in defaultOperators)
                        if (arrangedOperators[i] == key) {
                            detailedArrangedOperators[arrangedOperators[i]] = defaultOperators[key];
                            break;
                        }
                }

                return detailedArrangedOperators;
            };

            // method to pick th correct value of implicitLogicOperator
            var getImplicitLogicOperator = function () {
                // check if the provided value is correct & is from the defined logic menu
                // if incorrect default is 'AND'
                var defaultOperator = 'AND';
                var operator = conf.logicMenu ? ~conf.logicMenu.indexOf(conf.implicitLogicOperator) ? conf.implicitLogicOperator : CONSTANTS.defaultLogicalOperator : CONSTANTS.defaultLogicalOperator;
                return {implicitLogicOperator: operator};
            };

            conf.logicMenu && (formattedConf.logicMenu = conf.logicMenu);
            conf.filterMenu && (formattedConf.filterMenu = formatFilterMenu());
            conf.implicitLogicOperator && (formattedConf.implicitLogicOperator = getImplicitLogicOperator());

            return formattedConf;
        };

        // method to create the data for the Grammar template based on config provided by app
        this.dataForGrammarTemplate = function (appConfig) {
            var dataForGrammarTemplate = {};

            // creates the data for the template of logic menu
            function createLogicMenuData(confElement) {
                var templateData = [];

                // check whether logical operator is provided in the app config
                var findMatch = function (opertaor) {
                    var operatorRegex = new RegExp(opertaor, 'ig');
                    for (var index in confElement) {
                        if (confElement[index].match(operatorRegex)) {
                            return true;
                        }
                    }
                    return false;
                };

                var orExist = findMatch("OR");
                var andExist = findMatch("AND");
                var notExist = findMatch("NOT");


                var stringName = "";
                if (orExist) {
                    stringName = stringName + "_or";
                }
                if (andExist) {
                    stringName = stringName + "_and";
                }
                if (notExist) {
                    stringName = stringName + "_not";
                }

                stringName = stringName != "" ? 'logical' + stringName : "";

                var obj = {};
                if (stringName != "") {
                    obj[stringName] = true;
                    orExist ? obj['OR'] = true : "";
                    andExist ? obj['AND'] = true : "";
                    notExist ? obj['NOT'] = true : "";
                }

                templateData.push(obj);

                return templateData;
            }

            // creates the data for the template for filter menu
            function createFieldMenuData(confElement) {
                var templateData = [];

                for (var index in confElement) {
                    var operatorsObj = [];
                    var relOperators = confElement[index].operators;

                    // create array of object for relational operators - needed for grammar template
                    for (var key in relOperators) {
                        operatorsObj.push({'operator': key});
                    }
                    operatorsObj[operatorsObj.length - 1].lastOp = true; // add an extra property for last operator element

                    // create object containing the filter menu details
                    templateData.push({
                        'index': index,
                        'fieldName': confElement[index].label,
                        'operators': operatorsObj
                    });
                }
                templateData[templateData.length - 1].last = true; // add an extra property in last element

                return templateData;
            }

            appConfig.logicMenu && (dataForGrammarTemplate.logicMenu = createLogicMenuData(appConfig.logicMenu));
            appConfig.filterMenu && (dataForGrammarTemplate.filterMenu = createFieldMenuData(appConfig.filterMenu));
            appConfig.implicitLogicOperator && (dataForGrammarTemplate.implicitLogicOperator = appConfig.implicitLogicOperator);

            return dataForGrammarTemplate;
        };

        /**
         * Set of actions to perform when the queryBuilder container is empty.
         */
        this.emptyFilterBar = function (conf) {
            // This fix is required to remove additional font/styling tags being added by browser in contenEditableDiv
            // Note: remove this fix once 'contentEditable div' issue is resolved by Chrome (https://bugs.chromium.org/p/chromium/issues/detail?id=226941)
            conf.$filterBar.one("DOMNodeInserted", $.proxy(function (e) {
                if (e.target.tagName == "FONT") {
                    var helper = $("<b></b>");
                    $(e.target).before(helper);
                    helper.after($(e.target).contents());
                    helper.remove();
                    $(e.target).remove();
                }
            }, this));
        };

        //Method to create a unique ID
        this.uniqueID = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).substr(2, 9);
        };

        //Returns comma separated list for fieldExpressionGroup
        var getValuesFromFieldExpressionGroup = function (nodeObject) {
            var valuesList = [];
            var constructCommaValues = function (node) {
                switch (node.type) {
                    case CONSTANTS.nodeType.fieldExpression:
                        valuesList.push(node.fieldValue);
                        break;
                    case CONSTANTS.nodeType.binaryExpression:
                        constructCommaValues(node.nodes[0]);
                        constructCommaValues(node.nodes[1]);
                        break;
                }
            };
            constructCommaValues(nodeObject);
            return valuesList;
        };

        /**
         * Method to provide the query based on AST model
         * @param {object} model - model AST
         * @returns {String} - query based on model AST
         */
        this.constructQuery = function (model) {

            /**
             * @inner - recursive method to construct the query from the model AST
             * @param {object} model - model AST
             * @return {String} - query based on model AST
             */
            var constructQuery = function (model) {
                var listExp = [];
                var openParen = "(";
                var closeParen = ")";

                switch (model.type) {
                    case CONSTANTS.nodeType.literal:
                        listExp.push(model.value);
                        break;
                    case CONSTANTS.nodeType.binaryExpression:
                        // Recurse for left and right objects of binary expression and concatenate the final expression and operator.
                        var binaryExp;
                        if (model.nodes[1].type == CONSTANTS.nodeType.unaryExpression || (model.nodes[1].nodes && model.nodes[1].nodes[0] && model.nodes[1].nodes[0].type == CONSTANTS.nodeType.unaryExpression)) {
                            // do not add logical operator 'AND' value between two operands.
                            // eg: when 'Not' operator - The query should construct as -> 'A not B' instead of 'A and not b'
                            binaryExp = constructQuery(model.nodes[0]) + " " + constructQuery(model.nodes[1]);
                        } else {
                            binaryExp = constructQuery(model.nodes[0]) + " " + model.value + " " + constructQuery(model.nodes[1]);
                        }
                        listExp.push(binaryExp);
                        break;
                    case CONSTANTS.nodeType.unaryExpression:
                        // Recurse for left and right objects of binary expression and concatenate the final expression and operator.
                        var unaryExp = model.value + " " + constructQuery(model.nodes[0]);
                        listExp.push(unaryExp);
                        break;
                    case CONSTANTS.nodeType.parenExpression:
                        // Recurse for expression object inside parentheses and wrap the final expression with parentheses.
                        var parenExp = openParen + constructQuery(model.nodes[0]) + closeParen;
                        listExp.push(parenExp);
                        break;
                    case CONSTANTS.nodeType.fieldExpression:
                        var fieldExp = model.value;
                        listExp.push(fieldExp);
                        break;
                    case CONSTANTS.nodeType.fieldExpressionGroup:  //format like "version=1,2"
                        //create comma separated list
                        var node = model.nodes[0];
                        var valuesList = getValuesFromFieldExpressionGroup(node);
                        var fieldName = node.fieldName ? node.fieldName : node.nodes[0].fieldName;
                        var fieldOperator = node.fieldOperator ? node.fieldOperator : node.nodes[0].fieldOperator;

                        listExp.push(fieldName + fieldOperator + valuesList.join(","));
                        break;
                }

                return listExp.join("");
            };

            var constructedQuery = model.space ? constructQuery(model) + " " : constructQuery(model);

            return constructedQuery;
        };

        /**
         * Update the latest model by matching the previous model and assign the Id's.
         * @param {object} model - model AST
         * @param {object} previousModelTree - previous valid model AST
         * @returns {object} JSON Object- formatted moel including Id's
         */
        this.formatModelAST = function (model, previousModelTree) {
            var self = this;


            //Inner function-
            // used to flag the subtree, terms when multiple expression with same value exists.
            // Once visited, they do not get picked again for ID lookup
            function findExpression(expression) {
                var appropriateNode;
                var matchingNodes = previousModelTree.where({expression: expression});
                for (var i = 0; i < matchingNodes.length; i++) {
                    if (!matchingNodes[i].attributes.visited) { //if already not visited, then use the node to pick ID
                        appropriateNode = matchingNodes[i];
                        matchingNodes[i].attributes.visited = true;
                        break;
                    }
                }
                return appropriateNode && appropriateNode.toJSON();
            }

            //Inner method - recursive method to iterate the latest model
            // It adds the unique ID for each term
            // if the ID exists for term in previous model, then existing ID is assigned else a new ID is assigned.
            function formatModel(model) {
                switch (model.type) {
                    case CONSTANTS.nodeType.literal:
                    case CONSTANTS.nodeType.fieldExpression:
                        var nodeFound = findExpression(model.expression);
                        model.id = _.isUndefined(nodeFound) ? self.uniqueID() : nodeFound.id; //Id is verified and assigned accordingly
                        break;
                    case CONSTANTS.nodeType.binaryExpression:
                        // Recurse for left and right nodes of binary expression
                        var nodeFound = findExpression(model.expression);
                        model.id = _.isUndefined(nodeFound) ? self.uniqueID() : nodeFound.id; //Id is verified and assigned accordingly

                        formatModel(model.nodes[0]);
                        formatModel(model.nodes[1]);
                        break;
                    case CONSTANTS.nodeType.parenExpression:
                    case CONSTANTS.nodeType.unaryExpression:
                    case CONSTANTS.nodeType.fieldExpressionGroup:
                        // Recurse for the field term children nodes
                        var nodeFound = findExpression(model.expression);
                        model.id = _.isUndefined(nodeFound) ? self.uniqueID() : nodeFound.id; //Id is verified and assigned accordingly

                        formatModel(model.nodes[0]);
                        break;
                }
            }

            formatModel(model);  //method call to format the model for assigning the ID's

            return model;
        };

        /**
         * Get last fieldExpression object from model AST
         * @param {object} model - model AST
         * @returns {object} - last fieldExpression object
         */
        this.getModelLastObject = function (model) {
            if (model.type === CONSTANTS.nodeType.binaryExpression) {
                return self.getModelLastObject(model.nodes[model.nodes.length - 1]);
            }
            else if (model.type === CONSTANTS.nodeType.fieldExpressionGroup) {
                var node = model.nodes[0];

                var fieldName = node.fieldName ? node.fieldName : node.nodes[0].fieldName;
                var fieldOperator = node.fieldOperator ? node.fieldOperator : node.nodes[0].fieldOperator;

                var fExpObject = {
                    fieldName: fieldName,
                    fieldOperator: fieldOperator,
                    fieldValues: getValuesFromFieldExpressionGroup(node)
                };
                return fExpObject;
            }
        };

        /**
         * remove the special characters in the strings so that the keys comparisons can be made
         * @param {string} specialCharString - String containing special characters
         * @return {string} outputs string without mentioned special characters
         */
        this.serializeSpecialCharacters = function (specialCharString) {
            // remove the special characters, so that the key matches for opening the popup
            return specialCharString.replace(/\s|-/gi, '');
        };

        /**
         * Serialize data for the query builder widget accepted interface
         * @param {Object} containg the data details that needs to be added to the filter bar
         * @return {Object} Containing the query formulated wiht the provided data
         */
        this.serializeAddData = function (addObj) {
            var query,
                space = " ";

            /**
             * create the query iterating over the array of data and formulating the query string,
             * so that it can be passed to append in the filter bar
             * @inner
             */
            var formulateAddQuery = function (dropData) {
                var searchStr = "";
                dropData.forEach(function (dataDetail, index) {
                    var queryStr = "",
                        valueStr = "",
                        relationalOp = "",
                        logicalOp = "",
                        label;

                    // If label exists, indicates key value pair
                    label = dataDetail.label ? dataDetail.label : "";

                    // All the elements in the values array are comma separated for the key value pair
                    // If the label not present indicated single value.
                    if (!_.isEmpty(dataDetail.values)) {
                        valueStr = dataDetail.values.join(",")
                    }

                    relationalOp = dataDetail.relationalOperator || "=";
                    logicalOp = dataDetail.logicalOperator || "AND";

                    queryStr = label == "" ? valueStr : label + relationalOp + valueStr; // Based on if the key value pair or not create the query string

                    searchStr = index == 0 ? queryStr : searchStr + space + logicalOp + space + queryStr;
                });

                return {"query": searchStr};
            };

            query = formulateAddQuery(addObj.data); // Containing the object with full formulated query and connecting logical operator

            return query;
        };

    };

    return QueryBuilderUtil;

});
