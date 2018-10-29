/**
 * This file declares the constant variables
 *
 * @module Constants
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['lib/i18n/i18n'], function (i18n) {

    var CONSTANTS = {
        "state": {
            "relationalOperator": "RelationalOperator",
            "fieldTermValue": "FieldTermValue",
            "fieldDelimiterSpace": "FieldDelimiterSpace",
            "logicalOperatorSpace": "LogicalOperatorSpace",
            "singleTerm": "SingleTerm",
            "fieldName": "FieldName",
            "term": "Term",
            "termSpace": "TermSpace",
            "closeParen": "CloseParen",
            "openParenSpace": "OpenParenSpace",
            "logicalOperator": "LogicalOperator",
            "nodeSpace": "NodeSpace",
            "matchingFieldValue": "MatchingFieldValue",
            "anyLogicalOperator": "AnyLogicalOperator"
        },
        "messages": {
            "nodeSpace": i18n.getMessage("msg_nodeSpace"),
            "logicalOperator": i18n.getMessage("msg_logicalOperator"),
            "termSpace": i18n.getMessage("msg_termSpace"),
            "closeParen": i18n.getMessage("msg_closeParen"),
            "logicalOperatorSpace": i18n.getMessage("msg_logicalOperatorSpace"),
            "term": i18n.getMessage("msg_term"),
            "relationalOperator": i18n.getMessage("msg_relationalOperator"),
            "fieldTermValue": i18n.getMessage("msg_fieldTermValue"),
            "fieldDelimiterSpace": i18n.getMessage("msg_fieldDelimiterSpace"),
            "openParenSpace": i18n.getMessage("msg_openParenSpace")
        },
        "validity": {
            "valid": "valid",
            "invalid": "invalid",
            "info": "info"
        },
        "nodeType": {
            "literal": "Literal",
            "fieldExpression": "FieldExpression",
            "binaryExpression": "BinaryExpression",
            "unaryExpression": "UnaryExpression",
            "fieldExpressionGroup": "FieldExpressionGroup",
            "parenExpression": "ParenExpression",
            "openParen": "openParen",
            "closeParen": "closeParen"
        },
        "relationalOperators": {
            "=": {
                "label": i18n.getMessage("equal")
            },
            "!=": {
                "label": i18n.getMessage("notEqual")
            },
            "<=": {
                "label": i18n.getMessage("lessThanOrEqualTo")
            },
            ">=": {
                "label": i18n.getMessage("greaterThanOrEqualTo")
            },
            "<": {
                "label": i18n.getMessage("lessThan")
            },
            ">": {
                "label": i18n.getMessage("greaterThan")
            }
        },
        "defaultLogicalOperator": i18n.getMessage("defaultLogicalOperator")
    };

    /**
     * Inner method
     * Used to iterate over all the constant keys & make them immutable.
     * @param {array} list of rules executed by parser.
     */
    var freeze = function (constants) {
        Object.keys(constants).forEach(function (key) {
            if(_.isObject(constants[key])){
                Object.freeze(constants[key]);
            }
        });
        return Object.freeze(constants);
    };

    var initialize = function () {
        freeze(CONSTANTS); // make each of the internal key as constant
    };

    initialize();

    return CONSTANTS;

});
