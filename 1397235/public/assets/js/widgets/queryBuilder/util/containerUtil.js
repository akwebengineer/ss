/**
 * Module that is used to have utility methods related to dom container
 *
 * @module ContainerUtil
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['widgets/queryBuilder/util/constants'], function (CONSTANTS) {

    /**
     * ContainerUtil constructor
     *
     * @constructor
     * @class ContainerUtil - Module that is used to have utility methods related to dom
     * @returns {Object} Current ContainerUtil's object
     */
    var ContainerUtil = function () {

        /**
         * Serialize the model data such that query template can be rendered with the formatted values
         * @param {object} model - model AST
         * @returns {array} - dataArray containing all the text elements extracted from model
         *                  e:g for a query like 'a or b', the data array object will look like
         *                  dataArray = [
         *                      {type: "Literal", literal: "true", value: "a"},
         *                      {type: "BinaryExpression", logicalOperator: "true", value: " OR "},
         *                      {type: "Literal", literal: "true", value: "b "}
         *                  ]
         * Several combinations of query & associated data array are covered in unit tests.
         */
        this.serializeModelDataForTemplate = function (model) {

            var dataArray = [];
            var openParen = "(";
            var closeParen = ")";

            /**
             * @inner - Get only the required data elements from each parameter of entire model for the template usage
             * @param {string} model - model AST
             * @return {Object} - containing the details regading the model that is filtered for the template usage
             */
            var getFilteredModel = function (model) {
                var data = {};
                var modelValue = model.value;

                // based on each type of model construct the data object - This will be used in template
                // any text element that can follow space from UI at end as a valid query would need unicode of '&nbsp;' - needed to set caret position correctly
                // e:g: a / name=w / ) etc.
                // all the intermediate text would need extra space as part of value, since model value do not have spaces
                switch (model.type) {
                    // append one space - since the value in model is text without space | this space is needed in template to show query correctly
                    case CONSTANTS.nodeType.literal:
                        data["type"] = CONSTANTS.nodeType.literal;
                        data["literal"] = "true";
                        data.value = modelValue;
                        break;
                    case CONSTANTS.nodeType.binaryExpression:
                        data["type"] = CONSTANTS.nodeType.binaryExpression;
                        data["logicalOperator"] = "true";
                        data.value = " " + modelValue.toUpperCase() + " ";
                        break;
                    case CONSTANTS.nodeType.unaryExpression:
                        data["type"] = CONSTANTS.nodeType.unaryExpression;
                        data["logicalOperator"] = "true";
                        data.value = " " + modelValue.toUpperCase() + " ";
                        break;
                    case CONSTANTS.nodeType.openParen:
                        data["type"] = CONSTANTS.nodeType.openParen;
                        data["parenExpression"] = "true";
                        data.value = "(";
                        break;
                    case CONSTANTS.nodeType.closeParen:
                        data["type"] = CONSTANTS.nodeType.closeParen;
                        data["parenExpression"] = "true";
                        data.value = ")";
                        break;
                    case CONSTANTS.nodeType.fieldExpressionGroup:

                        // create an array containing the parts of key/value pair including delimeter as part of array
                        // this is needed so that the query can be formatted for all the needed partial pieces of key value induvidually
                        var fieldExpressionArr = [];
                        fieldExpressionArr.push({"fieldName": true, "value": modelValue[0].fieldName});
                        fieldExpressionArr.push({
                            "fieldOperator": true,
                            "value": modelValue[0].fieldOperator
                        });
                        // Iterate over all the comma separated values of the key, append the delimiter object accordingly
                        for (var index in modelValue) {
                            if (modelValue.length == 1) {
                                // single value element
                                fieldExpressionArr.push({"fieldValue": true, "value": modelValue[index].fieldValue});
                            } else if (index < modelValue.length - 1) {
                                // multiple value elements
                                fieldExpressionArr.push({
                                    "fieldValue": true,
                                    "value": modelValue[index].fieldValue
                                });
                                fieldExpressionArr.push({"fieldValueDelimiter": true, "value": ","});
                            } else if (index == modelValue.length - 1) {
                                // last value element, do not push delimiter
                                fieldExpressionArr.push({
                                    "fieldValue": true,
                                    "value": modelValue[index].fieldValue
                                });
                            }
                        }
                        data["type"] = CONSTANTS.nodeType.fieldExpressionGroup;
                        data["fieldExpressionGroup"] = "true";
                        data.fieldExpression = fieldExpressionArr;
                        break;
                }

                return data;
            };

            /**
             * @inner - recursive method to construct the dataArray containing objects in sequence for the template to consume.
             * @param {object} model - model AST
             */
            var serializeData = function (model) {
                switch (model.type) {
                    case CONSTANTS.nodeType.literal:
                        dataArray.push(getFilteredModel(model));
                        break;
                    case CONSTANTS.nodeType.binaryExpression:
                        // Recurse for left and right objects of binary expression and concatenate the final expression and operator.
                        if (model.nodes[1].type == CONSTANTS.nodeType.unaryExpression || (model.nodes[1].nodes[0] && model.nodes[1].nodes[0].type == CONSTANTS.nodeType.unaryExpression)) {
                            // do not add logical operator 'AND' value between two operands.
                            // eg: when 'Not' operator - The query should construct as -> 'A not B' instead of 'A and not b'
                            serializeData(model.nodes[0]);
                            serializeData(model.nodes[1]);
                        } else {
                            serializeData(model.nodes[0]);
                            dataArray.push(getFilteredModel(model));
                            serializeData(model.nodes[1]);
                        }
                        break;
                    case CONSTANTS.nodeType.unaryExpression:
                        // Recurse for left and right objects of binary expression and concatenate the final expression and operator.
                        dataArray.push(getFilteredModel(model));
                        serializeData(model.nodes[0]);
                        break;
                    case CONSTANTS.nodeType.parenExpression:
                        // Recurse for expression object inside parentheses and wrap the final expression with parentheses.
                        model.type = CONSTANTS.nodeType.openParen;
                        dataArray.push(getFilteredModel(model));
                        serializeData(model.nodes[0]);
                        model.type = CONSTANTS.nodeType.closeParen;
                        dataArray.push(getFilteredModel(model));
                        break;
                    case CONSTANTS.nodeType.fieldExpression:
                        dataArray.push(getFilteredModel(model));
                        break;
                    case CONSTANTS.nodeType.fieldExpressionGroup:  //like "version=1,2"
                        //create list consisting objects for comma separated values
                        var node = model.nodes[0];
                        var fieldExpressionGroupArr = [];

                        // recursive method to get all the value details for the comma separated data values for field expression
                        var constructCommaValues = function (node) {
                            switch (node.type) {
                                case CONSTANTS.nodeType.fieldExpression:
                                    fieldExpressionGroupArr.push(node);
                                    break;
                                case CONSTANTS.nodeType.binaryExpression:
                                    constructCommaValues(node.nodes[0]);
                                    constructCommaValues(node.nodes[1]);
                                    break;
                            }
                        };

                        constructCommaValues(node); // extract objects related to comma seperated values as an array
                        model.value = fieldExpressionGroupArr;
                        dataArray.push(getFilteredModel(model));
                        break;
                }
            };

            /**
             * @inner - method to add the unicode of nbsp; for the caret positioning.
             * @param {array} dataArray - array consisting data elements for each ui term/logicalOperator etc.
             * @return {array} - dataArray containing formatted last element with added unicode.
             */
            var addNBSPUnicode = function (dataArray) {
                // add the unicode character in the end data element, caretPosition API needs it for setting the caret properly in container
                var lastDataArrayElement = dataArray[dataArray.length - 1];
                switch (lastDataArrayElement.type) {
                    case CONSTANTS.nodeType.literal:
                    case CONSTANTS.nodeType.closeParen:
                        var formattedValue = lastDataArrayElement.value.trim() + "\u00a0";
                        lastDataArrayElement.value = formattedValue;
                        break;
                    case CONSTANTS.nodeType.fieldExpressionGroup:
                        var fieldExpressionArr = lastDataArrayElement.fieldExpression;
                        var formattedValue = fieldExpressionArr[fieldExpressionArr.length - 1].value.trim() + "\u00a0";
                        fieldExpressionArr[fieldExpressionArr.length - 1].value = formattedValue;
                        break;
                }
                return dataArray;
            };

            serializeData(model); // method call to serialize the model data as per the need of template
            dataArray = !_.isEmpty(dataArray) && addNBSPUnicode(dataArray); // add the unicode character in the end term

            return {"queryData": dataArray};
        };

        /**
         * Clean the new line characters from the template that Hogan do not take care.
         * @param {string} template - model AST
         * @returns {string} - new line deleted from template
         */
        this.serializeQueryTemplate = function (template) {
            return template.replace(/\n/g, ''); // remove the newline characters from the template
        };

        /**
         * Get text from in between the dom elements to get the entire string
         * @returns {object} jquery dom element
         */
        this.geTextFromDom = function ($domNode) {
            var fullText = "";

            // recursive method to iterate over the nested dom element until text is found & read to get the value
            function getText(node) {
                // Loop through all child nodes
                for (var i = 0; i < node.childNodes.length; i++) {
                    var childNode = node.childNodes[i];
                    if (childNode.nodeType == 3) { // check for text node
                        fullText = fullText + childNode.nodeValue.replace(/\u00a0/g, " "); // replace &nbsp; with regular space
                    }
                    else {
                        getText(childNode);
                    }
                }
            }

            // iterate over all the element nodes to get text individually from term / logicalOperator etc.
            for (var index = 0; index < $domNode.length; index++) {
                getText($domNode.get(index));
            }

            return fullText;
        };

        /**
         * Set the value as text value
         * @param {object} jquery node to set the value in
         * @param {value} String value as text
         * @returns {object} jquery dom element
         */
        this.setTextInDOM = function ($domNode, value) {
            $domNode.text(value);
        }
    };

    return ContainerUtil;

});
