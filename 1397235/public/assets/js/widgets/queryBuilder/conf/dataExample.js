/**
 * An example model structure representing different combinations for several queries.
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], /** @lends */
function () {

    var testData = {};

//***** Search config example **********//
    var searchConfExample = {};
    testData.searchConfExample = searchConfExample;

    searchConfExample.logical_or_and_not = {
        logicMenu: ['and', 'or', 'NOT'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_or_and = {
        logicMenu: ['and', 'or'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_or_not = {
        logicMenu: ['not', 'or'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_and_not = {
        logicMenu: ['and', 'not'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_or = {
        logicMenu: ['or'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_and = {
        logicMenu: ['and'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_not = {
        logicMenu: ['not'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };
    searchConfExample.logical_none = {
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            }
        }
    };

//***** Model Data example for valid expressions| Start | **********//
    var treeModel = {};
    treeModel.lastTermObject = {};

    testData.treeModel = treeModel;

    treeModel.t = { // t
        "type": "Literal",
        "value": "t",
        "nodes": [],
        "expression": "t"
        // "id": "_79bmy1kcq"
    };
    treeModel.lastTermObject.t = { // t
        "type": "Literal",
        "value": "t",
        "nodes": [],
        "expression": "t"
        // "id": "_79bmy1kcq"
    };

    treeModel.t_ = { // t - space at the end
        "type": "Literal",
        "value": "t",
        "nodes": [],
        "space": true,
        "expression": "t"
        // "id": "_79bmy1kcq"
    };
    treeModel.lastTermObject.t_ = { // t - space at the end
        "type": "Literal",
        "value": "t",
        "nodes": [],
        "space": true,
        "expression": "t"
        // "id": "_79bmy1kcq"
    };

    treeModel.t____ = { // t - multiple spaces at the end
        "type": "Literal",
        "value": "t",
        "nodes": [],
        "space": true,
        "expression": "t"
        // "id": "_79bmy1kcq"
    };
    treeModel.test = { // test
        "type": "Literal",
        "value": "test",
        "nodes": [],
        "expression": "test"
        // "id": "_xz5ej4vmi"
    };
    treeModel.test_ = { // test -  space at the end
        "type": "Literal",
        "value": "test",
        "nodes": [],
        "space": true,
        "expression": "test"
        // "id": "_79bmy1kcq"
    };
    treeModel.term1_or_term2 = { // term1 or term2
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_o9bpxva5d"
            },
            {
                "type": "Literal",
                "value": "term2",
                "nodes": [],
                "expression": "term2"
                // "id": "_em3cgjubw"
            }
        ],
        "expression": "term1 or term2"
        // "id": "_h63l1ymd3"
    };
    treeModel.term1_or_term2_or_term3 = { // term1 or term2 or term3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_jtvcjeyxt"
            },
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_jtvcjeyxt"
                    },
                    {
                        "type": "Literal",
                        "value": "term3",
                        "nodes": [],
                        "expression": "term3"
                        // "id": "_jtvcjeyxt"
                    }
                ],
                "expression": "term2 or term3"
                // "id": "_u8jsj8e40"
            }
        ],
        "expression": "term1 or term2 or term3"
        // "id": "_k3kezlt78"
    };
    treeModel.term1_or_term2_or_term3____ = { // term1 or term2 or term3 - multiple spaces at end
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_jtvcjeyxt"
            },
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_jtvcjeyxt"
                    },
                    {
                        "type": "Literal",
                        "value": "term3",
                        "nodes": [],
                        "expression": "term3"
                        // "id": "_jtvcjeyxt"
                    }
                ],
                "expression": "term2 or term3"
                // "id": "_u8jsj8e40"
            }
        ],
        "space": true,
        "expression": "term1 or term2 or term3"
        // "id": "_k3kezlt78"
    };
    treeModel.osversio = { // osversio
        "type": "Literal",
        "value": "osversio",
        "nodes": [],
        "expression": "osversio"
        // "id": "_ssmds7fs8"
    };
    treeModel.osversion1 = { // osversion1
        "type": "Literal",
        "value": "osversion1",
        "nodes": [],
        "expression": "osversion1"
        // "id": "_ye6pv8p5e"
    };
    treeModel.osversionEq1 = { // osversion=1
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "FieldExpression",
                "value": "OSVersion=1",
                "fieldName": "OSVersion",
                "fieldOperator": "=",
                "fieldValue": "1",
                "nodes": [],
                "expression": "OSVersion=1"
                // "id": "_defjei1jr"
            }
        ],
        "expression": "OSVersion=1"
        // "id": "_qd08l62s5"
    };

    treeModel.osversionEq1_or_nameEq2 = { // osversion=1 or name=2
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                    }
                ],
                "expression": "OSVersion=1"
                // "id": "_22dw6w56k"
            },
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "Name=2",
                        "fieldName": "Name",
                        "fieldOperator": "=",
                        "fieldValue": "2",
                        "nodes": [],
                        "expression": "Name=2"
                        // "id": "_64dw6w3bk"
                    }
                ],
                "expression": "Name=2"
                // "id": "_539yj5u9p"
            }
        ],
        "expression": "OSVersion=1 or Name=2"
        // "id": "_p9fsk4k3c"
    };
    treeModel.osversionEq1_or_nameEq2_ = { // osversion=1 or name=2
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                    }
                ],
                "expression": "OSVersion=1"
                // "id": "_22dw6w56k"
            },
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "Name=2",
                        "fieldName": "Name",
                        "fieldOperator": "=",
                        "fieldValue": "2",
                        "nodes": [],
                        "expression": "Name=2"
                        // "id": "_64dw6w3bk"
                    }
                ],
                "expression": "Name=2"
                // "id": "_539yj5u9p"
            }
        ],
        "space": true,
        "expression": "OSVersion=1 or Name=2"
        // "id": "_p9fsk4k3c"
    };
    treeModel.osversionEq1_or_nameEq2_or_devicefamilyEq3 = { // osversion=1 or name=2 or devicefamily=3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                        // "id": "_i12d5f439"
                    }
                ],
                "expression": "OSVersion=1"
                // "id": "_in3k5f439"
            },
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "FieldExpressionGroup",
                        "nodes": [
                            {
                                "type": "FieldExpression",
                                "value": "Name=2",
                                "fieldName": "Name",
                                "fieldOperator": "=",
                                "fieldValue": "2",
                                "nodes": [],
                                "expression": "Name=2"
                                // "id": "_i222df439"
                            }
                        ],
                        "expression": "Name=2"
                        // "id": "_i993df439"
                    },
                    {
                        "type": "FieldExpressionGroup",
                        "nodes": [
                            {
                                "type": "FieldExpression",
                                "value": "DeviceFamily=3",
                                "fieldName": "DeviceFamily",
                                "fieldOperator": "=",
                                "fieldValue": "3",
                                "nodes": [],
                                "expression": "DeviceFamily=3"
                                // "id": "_ixqx7f439"
                            }
                        ],
                        "expression": "DeviceFamily=3"
                        // "id": "_jtx915io1"
                    }
                ],
                "expression": "Name=2 or DeviceFamily=3"
                // "id": "_emz4des37"
            }
        ],
        "expression": "OSVersion=1 or Name=2 or DeviceFamily=3"
        // "id": "_h5z80hcae"
    };

    treeModel.osversionEq1Comma2 = { // osversion=1,2
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "OR",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                        // "id": "_ebdd4k4wy"
                    },
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=2",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "2",
                        "nodes": [],
                        "expression": "OSVersion=2"
                        // "id": "_njhd4k4wy"
                    }
                ],
                "expression": "OSVersion=1,2"
                // "id": "_9qnm8vo06"
            }
        ],
        "expression": "OSVersion=1,2"
        // "id": "_fgbmf0i43"
    };

    treeModel.osversionEq1Comma2Comma3 = { //osversion=1,2,3
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "OR",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                        // "id": "_u814mgboa"
                    },
                    {
                        "type": "BinaryExpression",
                        "value": "OR",
                        "nodes": [
                            {
                                "type": "FieldExpression",
                                "value": "OSVersion=2",
                                "fieldName": "OSVersion",
                                "fieldOperator": "=",
                                "fieldValue": "2",
                                "nodes": [],
                                "expression": "OSVersion=2"
                                // "id": "_0fc8aounu"
                            },
                            {
                                "type": "FieldExpression",
                                "value": "OSVersion=3",
                                "fieldName": "OSVersion",
                                "fieldOperator": "=",
                                "fieldValue": "3",
                                "nodes": [],
                                "expression": "OSVersion=3"
                                // "id": "_y45jwfzfj"
                            }
                        ],
                        "expression": "OSVersion=2,3"
                        // "id": "_qmwwwq7w5"
                    }
                ],
                "expression": "OSVersion=1,2,3"
                // "id": "_5pqqc8yfg"
            }
        ],
        "expression": "OSVersion=1,2,3"
        // "id": "_efcy4t70s"
    };
    treeModel.osversionEq1_or_test = { // osversion=1 oe test
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                        // "id": "_8jq9y922p"
                    }
                ],
                "expression": "OSVersion=1"
                // "id": "_mszw2vxnh"
            },
            {
                "type": "Literal",
                "value": "test",
                "nodes": [],
                "expression": "test"
                // "id": "_7co0nivge"
            }
        ],
        "expression": "OSVersion=1 or test"
        // "id": "_z1qtinfsc"
    };
    treeModel.test_or_osversionEq1 = { // test or osversion=1
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "test",
                "nodes": [],
                "expression": "test"
            },
            {
                "type": "FieldExpressionGroup",
                "nodes": [
                    {
                        "type": "FieldExpression",
                        "value": "OSVersion=1",
                        "fieldName": "OSVersion",
                        "fieldOperator": "=",
                        "fieldValue": "1",
                        "nodes": [],
                        "expression": "OSVersion=1"
                    }
                ],
                "expression": "OSVersion=1"
            }
        ],
        "expression": "test or OSVersion=1"
        // "id": "_ya4t61w7g"
    };

    treeModel.OpenTerm1Close = { // (term1)
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_q3vl43hj1"
            }
        ],
        "expression": "(term1)"
        // "id": "_bcd980ha6"
    };
    treeModel.OpenTerm1Close_ = { // (term1)
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_q3vl43hj1"
            }
        ],
        "space": true,
        "expression": "(term1)"
        // "id": "_bcd980ha6"
    };

    treeModel.OpenTerm1_or_Term2Close = { // (term1 or term2)
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term1",
                        "nodes": [],
                        "expression": "term1"
                        // "id": "_kcrbds2zh"
                    },
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_adedfb1js"
                    }
                ],
                "expression": "term1 or term2"
                // "id": "_2ngptmls2"
            }
        ],
        "expression": "(term1 or term2)"
        // "id": "_3ei1h6s29"
    };
    treeModel.OpenOpenTerm1_or_Term2CloseClose = {  // ((term1 and term2))
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "ParenExpression",
                "value": "()",
                "nodes": [
                    {
                        "type": "BinaryExpression",
                        "value": "and",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term1",
                                "nodes": [],
                                "expression": "term1"
                                // "id": "_oe84mtvi6"
                            },
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                                // "id": "_bq84yoir1"
                            }
                        ],
                        "expression": "term1 and term2"
                        // "id": "_7m8ub4wra"
                    }
                ],
                "expression": "(term1 and term2)"
                // "id": "_2cl5m6vta"
            }
        ],
        "expression": "((term1 and term2))"
        // "id": "_1djp2ukes"
    };
    treeModel.OpenTerm1_or_Term2Close_and_Term3 = {  // (term1 or term2) and term3
        "type": "BinaryExpression",
        "value": "and",
        "nodes": [
            {
                "type": "ParenExpression",
                "value": "()",
                "nodes": [
                    {
                        "type": "BinaryExpression",
                        "value": "or",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term1",
                                "nodes": [],
                                "expression": "term1"
                            },
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                            }
                        ],
                        "expression": "term1 or term2"
                        // "id": "_6e67h0gu6"
                    }
                ],
                "expression": "(term1 or term2)"
                // "id": "_xhv8fyqjq"
            },
            {
                "type": "Literal",
                "value": "term3",
                "nodes": [],
                "expression": "term3"
                // "id": "_eljl862sy"
            }
        ],
        "expression": "(term1 or term2) and term3"
        // "id": "_enfr29sg0"
    };

    treeModel.OpenTerm1_or_Term2_and_OpenTerm3_or_Term4CloseClose = {  // (term1 or term2 and (term3 or term4))
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term1",
                        "nodes": [],
                        "expression": "term1"
                    },
                    {
                        "type": "BinaryExpression",
                        "value": "and",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                            },
                            {
                                "type": "ParenExpression",
                                "value": "()",
                                "nodes": [
                                    {
                                        "type": "BinaryExpression",
                                        "value": "or",
                                        "nodes": [
                                            {
                                                "type": "Literal",
                                                "value": "term3",
                                                "nodes": [],
                                                "expression": "term3"
                                            },
                                            {
                                                "type": "Literal",
                                                "value": "term4",
                                                "nodes": [],
                                                "expression": "term4"
                                                // "id": "_wrcp95wxs"
                                            }
                                        ],
                                        "expression": "term3 or term4"
                                        // "id": "_ju18j049l"
                                    }
                                ],
                                "expression": "(term3 or term4)"
                                // "id": "_xxu7pib3f"
                            }
                        ],
                        "expression": "term2 and (term3 or term4)"
                        // "id": "_dd3ykjcfv"
                    }
                ],
                "expression": "term1 or term2 and (term3 or term4)"
                // "id": "_mkdrus2d8"
            }
        ],
        "expression": "(term1 or term2 and (term3 or term4))"
        // "id": "_wrdaxprkt"
    };
    treeModel.OpenqtTerm1_has_value1Closeqt_or_term3 = { // "term1 has value1" or term3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "\"term1 has value1\"",
                "nodes": [],
                "expression": "\"term1 has value1\""
                // "id": "_hbpdmaxhv"
            },
            {
                "type": "Literal",
                "value": "term3",
                "nodes": [],
                "expression": "term3"
                // "id": "_ns029gskn"
            }
        ],
        "expression": "\"term1 has value1\" or term3"
        // "id": "_ph429dxd5"
    };
    treeModel.OpenOpenqtTerm1_has_value1Closeqt_or_term3Close = { // ("term1 has value1" or term3)
        "type": "ParenExpression",
        "value": "()",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "or",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "\"term1 has value1\"",
                        "nodes": [],
                        "expression": "\"term1 has value1\""
                        // "id": "_ggajd1jo1"
                    },
                    {
                        "type": "Literal",
                        "value": "term3",
                        "nodes": [],
                        "expression": "term3"
                        // "id": "_ku6u05lp5"
                    }
                ],
                "expression": "\"term1 has value1\" or term3"
                // "id": "_sf0z6qrag"
            }
        ],
        "expression": "(\"term1 has value1\" or term3)"
        // "id": "_r8he8wibt"
    };
    treeModel.osversionEqOpenqtTerm1_with_value1Closeqt = { // osversion="term1 with value1"
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "FieldExpression",
                "value": "OSVersion=\"term1 with value1\"",
                "fieldName": "OSVersion",
                "fieldOperator": "=",
                "fieldValue": "\"term1 with value1\"",
                "nodes": [],
                "expression": "OSVersion=\"term1 with value1\""
                // "id": "_j4oz8l8jc"
            }
        ],
        "expression": "OSVersion=\"term1 with value1\""
        // "id": "_3tvs7fogk"
    };
    treeModel.OpenqtStringWithNoSpaceCloseqt = { // "StringWithNoSpace"
        "type": "Literal",
        "value": "\"StringWithNoSpace\"",
        "nodes": [],
        "expression": "\"StringWithNoSpace\""
        // "id": "_0x170kad7"
    };
    treeModel.Managed_StatusEq1 = { // Managed Status=1
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "FieldExpression",
                "value": "Managed Status=1",
                "fieldName": "Managed Status",
                "fieldOperator": "=",
                "fieldValue": "1",
                "nodes": [],
                "expression": "Managed Status=1"
                // "id": "_defjei1jr"
            }
        ],
        "expression": "Managed Status=1"
        // "id": "_qd08l62s5"
    };
    treeModel.OpenqtManaged_StatusCloseqt = { // "Managed Status"
        "type": "Literal",
        "value": "\"Managed Status\"",
        "nodes": [],
        "expression": "\"Managed Status\""
        // "id": "_la8441lzf"
    };
    treeModel.ApplicationHyphenServicesEq1 = { // Application-Services=1
        "type": "FieldExpressionGroup",
        "nodes": [
            {
                "type": "FieldExpression",
                "value": "application-services=1",
                "fieldName": "application-services",
                "fieldOperator": "=",
                "fieldValue": "1",
                "nodes": [],
                "expression": "application-services=1"
                // "id": "_defjei1jr"
            }
        ],
        "expression": "application-services=1"
        // "id": "_qd08l62s5"
    };
    treeModel.OpenqtApplicationHyphenServicesCloseqt = { // "Application-Services"
        "type": "Literal",
        "value": "\"Application-Services\"",
        "nodes": [],
        "expression": "\"Application-Services\""
        // "id": "_hs1101lwo"
    };

    // model examples to show precedence in logical operators
    treeModel.term1_OR_term2 = { //term1 OR term2
        "type": "BinaryExpression",
        "value": "OR",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_ylyvvj7gf"
            },
            {
                "type": "Literal",
                "value": "term2",
                "nodes": [],
                "expression": "term2"
                // "id": "_5jekl1b58"
            }
        ],
        "expression": "term1 OR term2"
        // "id": "_6xqf1dggh"
    };
    treeModel.term1_or_term2_OR_term3 = { // term1 or term2 OR term3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_tozsiq58k"
            },
            {
                "type": "BinaryExpression",
                "value": "OR",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_rxo13bal1"
                    },
                    {
                        "type": "Literal",
                        "value": "term3",
                        "nodes": [],
                        "expression": "term3"
                        // "id": "_rebx53tqe"
                    }
                ],
                "expression": "term2 OR term3"
                // "id": "_1jp55fl4p"
            }
        ],
        "expression": "term1 or term2 OR term3"
        // "id": "_isvuxnmsy"
    };

    treeModel.term1_and_term2 = { // term1 and term2
        "type": "BinaryExpression",
        "value": "and",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_zq15l2wcc"
            },
            {
                "type": "Literal",
                "value": "term2",
                "nodes": [],
                "expression": "term2"
                // "id": "_7aa7ahaxr"
            }
        ],
        "expression": "term1 and term2"
        // "id": "_afoxfg9c7"
    };
    treeModel.term1_and_term2_term3 = { // term1 and term2 and term3
        "type": "BinaryExpression",
        "value": "and",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_nitpaakp7"
            },
            {
                "type": "BinaryExpression",
                "value": "and",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_eu09c82pl"
                    },
                    {
                        "type": "Literal",
                        "value": "term3",
                        "nodes": [],
                        "expression": "term3"
                        // "id": "_epxljk3em"
                    }
                ],
                "expression": "term2 and term3"
                // "id": "_mjnk8m806"
            }
        ],
        "expression": "term1 and term2 and term3"
        // "id": "_4sjwhcbee"
    };

    treeModel.term1_not_term2 = { // term1 not term2
        "type": "BinaryExpression",
        "value": "AND",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_zmb5ut0cg"
            },
            {
                "type": "UnaryExpression",
                "value": "NOT",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term2",
                        "nodes": [],
                        "expression": "term2"
                        // "id": "_fnktrdarj"
                    }
                ],
                "expression": "NOT term2"
                // "id": "_qfo8s3shx"
            }
        ],
        "expression": "term1 NOT term2"
        // "id": "_swy3ypdvy"
    };

    treeModel.term1_not_term2_NOT_term3 = { // term1 not term2 NOT term3
        "type": "BinaryExpression",
        "value": "AND",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_cjvw65lj3"
            },
            {
                "type": "BinaryExpression",
                "value": "AND",
                "nodes": [
                    {
                        "type": "UnaryExpression",
                        "value": "not",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                                // "id": "_bl5yu0573"
                            }
                        ]
                        // "id": ""
                    },
                    {
                        "type": "UnaryExpression",
                        "value": "NOT",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term3",
                                "nodes": [],
                                "expression": "term3"
                                // "id": "_aik8z0e3c"
                            }
                        ],
                        "expression": "NOT term3"
                        // "id": "_ovxq5qtwk"
                    }
                ],
                "expression": "term2 NOT term3"
                // "id": "_xm607okpz"
            }
        ],
        "expression": "term1 not term2 NOT term3"
        // "id": "_jx9cln8xh"
    };

    treeModel.term1_not_term2_and_term3_NOT_term4 = { // term1 not term2 and term3 not term4
        "type": "BinaryExpression",
        "value": "AND",
        "nodes": [
            {
                "type": "Literal",
                "value": "term1",
                "nodes": [],
                "expression": "term1"
                // "id": "_dbnupr3bv"
            },
            {
                "type": "BinaryExpression",
                "value": "and",
                "nodes": [
                    {
                        "type": "UnaryExpression",
                        "value": "not",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                                // "id": "_wx70i6g2u"
                            }
                        ]
                        // "id": ""
                    },
                    {
                        "type": "BinaryExpression",
                        "value": "AND",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term3",
                                "nodes": [],
                                "expression": "term3"
                                // "id": "_tiri080ek"
                            },
                            {
                                "type": "UnaryExpression",
                                "value": "not",
                                "nodes": [
                                    {
                                        "type": "Literal",
                                        "value": "term4",
                                        "nodes": [],
                                        "expression": "term4"
                                        // "id": "_08sr8zuzx"
                                    }
                                ],
                                "expression": "not term4"
                                // "id": "_r51i7r35z"
                            }
                        ],
                        "expression": "term3 not term4"
                        // "id": "_atu16vjak"
                    }
                ],
                "expression": "term2 and term3 not term4"
                // "id": "_x5lv92rrl"
            }
        ],
        "expression": "term1 not term2 and term3 not term4"
        // "id": "_kavk7dnzs"
    };

    treeModel.term1_not_term2_or_term3 = { // term1 not term2 or term3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "AND",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term1",
                        "nodes": [],
                        "expression": "term1"
                        // "id": "_tm02zv3jj"
                    },
                    {
                        "type": "UnaryExpression",
                        "value": "not",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                                // "id": "_jq3fyqcg6"
                            }
                        ],
                        "expression": "not term2"
                        // "id": "_dsops44s7"
                    }
                ],
                "expression": "term1 not term2"
                // "id": "_df33uguol"
            },
            {
                "type": "Literal",
                "value": "term3",
                "nodes": [],
                "expression": "term3"
                // "id": "_0zuc7tq5c"
            }
        ],
        "expression": "term1 not term2 or term3"
        // "id": "_lc25xrpis"
    };

    treeModel.term1_or_term2_not_term3 = { // term1 not term2 or term3
        "type": "BinaryExpression",
        "value": "or",
        "nodes": [
            {
                "type": "BinaryExpression",
                "value": "AND",
                "nodes": [
                    {
                        "type": "Literal",
                        "value": "term1",
                        "nodes": [],
                        "expression": "term1"
                        // "id": "_knty3gaws"
                    },
                    {
                        "type": "UnaryExpression",
                        "value": "not",
                        "nodes": [
                            {
                                "type": "Literal",
                                "value": "term2",
                                "nodes": [],
                                "expression": "term2"
                                // "id": "_d20ghi23d"
                            }
                        ],
                        "expression": "not term2"
                        // "id": "_qg0yecu9g"
                    }
                ],
                "expression": "term1 not term2"
                // "id": "_oillhz3xy"
            },
            {
                "type": "Literal",
                "value": "term3",
                "nodes": [],
                "expression": "term3"
                // "id": "_fjedtr01b"
            }
        ],
        "expression": "term1 not term2 or term3"
        // "id": "_4l2pstqe0"
    };

    //***** Model Data example | valid expressions | End**********//

    //**** last model object in invlaid key/value pair | Start
    treeModel.lastTermObject.keyOnly = { // osversion
        fieldName: "OSVersion",
        fieldOperator: "",
        fieldValues: []
    };
    treeModel.lastTermObject.keyOperator = { // osversion=
        fieldName: "OSVersion",
        fieldOperator: "=",
        fieldValues: []
    };
    treeModel.lastTermObject.keyOperatorValueComma = { // osversion=1,
        fieldName: "OSVersion",
        fieldOperator: "=",
        fieldValues: []
    };

    treeModel.lastTermObject.keyOnly_name = { // name
        fieldName: "Name",
        fieldOperator: "",
        fieldValues: []
    };
    treeModel.lastTermObject.keyOperator_name = { // name=
        fieldName: "Name",
        fieldOperator: "=",
        fieldValues: []
    };

    treeModel.lastTermObject.keyOnly_ManagedStatus = { // Managed Status
        fieldName: "Managed Status",
        fieldOperator: "",
        fieldValues: []
    };
    treeModel.lastTermObject.keyOperator_ManagedStatus = { // Managed Status=
        fieldName: "Managed Status",
        fieldOperator: "=",
        fieldValues: []
    };
    treeModel.lastTermObject.keyOperatorValueComma__ManagedStatus = { // Managed Status=1,
        fieldName: "Managed Status",
        fieldOperator: "=",
        fieldValues: []
    };
    //**** last model object in invlaid key/value pair | End
    return testData;
});

