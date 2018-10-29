/**
 * Created by vidushi on 6/30/17.
 */

define([
    'widgets/queryBuilder/queryBuilderWidget',
    'widgets/queryBuilder/conf/configurationSample',
    'widgets/queryBuilder/conf/dataExample',
    'widgets/queryBuilder/util/cursorPosition',
    'mockjax'
], function (queryBuilderWidget, configurationSample, testData, CursorPosition, mockjax) {

    var cursorPosition;

    function createContainer() {
        var container = $("<div id = 'queryContainer' style='width: 1300px;'></div>");
        $('#test_widget').append(container);
        return container;
    }

    function triggerKeyup($filterBarContainer, str, _keyCode) {
        var e = $.Event("keyup");
        e.which = e.keyCode = _keyCode;
        $filterBarContainer.val(str);
        cursorPosition.setCursorPosition(str.length);
        $filterBarContainer.trigger(e);
    }

    // compare the generated model obj to expected model
    function compareModelTree(actualTree, expectedTree) {

        var removeIdFromTree = function (node) {
            // Remove the Id's from the generated Tree
            // Since the Id's are run time generation, thus they can not be provided statically in the expected example data
            delete(node.id);
            // node.id && delete(node.id);
            node.nodes[0] && removeIdFromTree(node.nodes[0]);
            node.nodes[1] && removeIdFromTree(node.nodes[1]);
            return;
        };
        removeIdFromTree(actualTree);
        return _.isEqual(actualTree, expectedTree);
    };

    function isSuggestionInArray (suggestionArray, suggestionToFind) {
        for (var index in suggestionArray) {
            if (suggestionArray[index].value.toUpperCase() == suggestionToFind.toUpperCase()) {
                return true;
            }
        }
        return false;
    }

    function isLabelInSuggestionArray (suggestionArray, labelToFind) {
        for (var index in suggestionArray) {
            if (suggestionArray[index].label.toUpperCase() == labelToFind.toUpperCase()) {
                return true;
            }
        }
        return false;
    }

    // Check if there are suggestions for the query
    function isEmptySuggestionArray (suggestionArray) {
        if(_.isEmpty(suggestionArray)){
            return true;
        }
        return false;
    }

    function errorMessage(expectedState, testString) {
        return ("suggestions should be of type \'" + expectedState + "\' for \'" + testString + "\'");
    }

    var self = this;

    var treeModel = testData.treeModel;
    var searchConfExample = testData.searchConfExample;
    var keycode = $.ui.keyCode;

    (function () {

        var suggestions = [
            {"value": "1.1"},
            {"value": "1.2"},
            {"value": "1.3"},
            {"value": "1.4"}
        ];

        $.mockjax({
            url: '/api/queryBuilder/getTestRemoteData',
            dataType: 'json',
            responseTime: 700,
            response: function (req) {
                this.responseText = {
                    suggestions: suggestions
                }
            }
        });

    })();

    describe('queryBuilderWidget - Unit tests:', function () {
        var $queryContainer = createContainer();
        describe('Exposed methods exists', function () {

            var queryBuilderObj = new queryBuilderWidget({
                "container": $queryContainer
            });

            it('should exist', function () {
                queryBuilderObj.should.exist;
            });

            it('build() should exist', function () {
                assert.isFunction(queryBuilderObj.build, 'The Query builder widget must have a function named build.');
            });

            it('destroy() should exist', function () {
                assert.isFunction(queryBuilderObj.destroy, 'The Query builder widget must have a function named destroy.');
            });

            it('_getWreqr() should exist', function () {
                assert.isFunction(queryBuilderObj._getWreqr, 'The Query builder widget must have a private function named _getWreqr.');
            });

            it('validate() should exist', function () {
                assert.isFunction(queryBuilderObj.validate, 'The Query builder widget must have a function named validate.');
            });

            it('getQuery() should exist', function () {
                assert.isFunction(queryBuilderObj.getQuery, 'The Query builder widget must have a function named getQuery.');
            });

            it('getAST() should exist', function () {
                assert.isFunction(queryBuilderObj.getAST, 'The Query builder widget must have a function named getAST.');
            });

            it('getTerm() should exist', function () {
                assert.isFunction(queryBuilderObj.getTerm, 'The Query builder widget must have a function named getTerm.');
            });

            it('getTermsType() should exist', function () {
                assert.isFunction(queryBuilderObj.getTermsType, 'The Query builder widget must have a function named getTermsType.');
            });

            it('add() should exist', function () {
                assert.isFunction(queryBuilderObj.add, 'The Query builder widget must have a function named add.');
            });

            it('update() should exist', function () {
                assert.isFunction(queryBuilderObj.update, 'The Query builder widget must have a function named update.');
            });

            // it('remove() should exist', function () {
            //     assert.isFunction(queryBuilderObj.remove, 'The Query builder widget must have a function named remove.');
            // });

        });

        describe('API - Interface - Unit tests:', function () {
            var queryBuilderObj;
            var $filterBar;
            var defaultLogicalOperator = "AND";

            describe('clear - API', function () {

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                it('container & model should be cleared', function () {
                    var queryObjAfterClear;
                    var existingFilterBarQuery = "a or b";
                    $filterBar.text(existingFilterBarQuery);
                    assert.equal(existingFilterBarQuery, $filterBar.text());
                    queryBuilderObj.validate(existingFilterBarQuery);
                    assert.equal(existingFilterBarQuery, queryBuilderObj.getQuery());

                    queryBuilderObj.bindEvents({
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterClear = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.clear();

                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal("", $filterBar.text());
                    assert.equal(queryObjAfterClear.state, "invalid");
                });
            });

            describe('validate - API', function () {

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                it('Valid - \'term\' should return valid query', function () {
                    var query = "term";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var validateObj = queryBuilderObj.validate(query);
                    assert.equal("valid", validateObj.state, "State should be valid.");
                    assert.equal(query, validateObj.query, "Same query as filter bar should exist.");
                });

                it('Invalid - \'term or\' should return invalid query', function () {
                    var query = "term or";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var validateObj = queryBuilderObj.validate(query);
                    assert.equal("invalid", validateObj.state, "State should be invalid.");
                    assert.equal("", validateObj.query, "Query should be empty.");
                });

                it('Valid - \'term or newTerm\' should return valid query', function () {
                    var query = "term or newTerm";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var validateObj = queryBuilderObj.validate(query);
                    assert.equal("valid", validateObj.state, "State should be valid.");
                    assert.equal(query, validateObj.query, "Same query as filter bar should exist.");
                });
            });

            describe('getQuery - API', function () {

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                it('Valid - \'term\' should return valid query', function () {
                    var query = "term";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    assert.equal(query, queryBuilderObj.getQuery(), "Same query as filter bar should exist.");
                });

                it('Invalid - \'term or\' should return empty query', function () {
                    var query = "term or";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    assert.equal("", queryBuilderObj.getQuery(), "Returned query should be empty in case of invalid vaidataion");

                });

                it('Valid - \'term or newTerm\' should return valid query', function () {
                    var query = "term or newTerm";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var validateObj = queryBuilderObj.validate(query);
                    assert.equal(query, queryBuilderObj.getQuery(), "Same query as filter bar should exist.");
                });
            });

            describe('getAST - API', function () {

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                it('No Id as parameter -- should return entire AST model for -- Valid - \'t\' query', function () {
                    var query = "t";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    assert.isTrue(compareModelTree(queryBuilderObj.getAST(), treeModel.t), "valid model should be generated.");
                });

                it('Valid Id as parameter -- should return respective AST model for --  Valid - \'t\' query', function () {
                    var query = "t";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var result = queryBuilderObj.validate(query);
                    var modelId = result.model.id;
                    assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
                    assert.isTrue(compareModelTree(queryBuilderObj.getAST(modelId), treeModel.t), "Model should return based on the related model ID");
                });

                it('Empty model should be returned for -- Invalid - \'t or\' query', function () {
                    var query = "t or";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    assert.equal(JSON.stringify(queryBuilderObj.getAST()), JSON.stringify({}), "model should be empty.");
                });

                it('Top most Id as parameter -- should return entire AST model for -- valid - \'term1 or term2\' query', function () {
                    var query = "term1 or term2";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var result = queryBuilderObj.validate(query);
                    var modelId = result.model.id;
                    assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
                    assert.isTrue(compareModelTree(queryBuilderObj.getAST(modelId), treeModel.term1_or_term2), "valid model should be returned for entire tree.");
                });

                it('Id for one of the term as parameter -- should return respective AST model for -- valid- \'test1 or test2\' query', function () {
                    var query = "test1 or test2";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    var result = queryBuilderObj.validate(query);
                    var modelId = result.model.nodes[1].id;
                    assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
                    assert.notEqual(JSON.stringify(queryBuilderObj.getAST(modelId)), JSON.stringify({}), "model should be not be empty.");
                });

                it('No Id as parameter -- should return entire AST model for -- Valid - \'term1 or term2\' query', function () {
                    var query = "term1 or term2";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    assert.isTrue(compareModelTree(queryBuilderObj.getAST(), treeModel.term1_or_term2), "valid model should be generated.");
                });

                it('Incorrect Id as parameter -- should throw exception for -- valid - \'test\' query', function () {
                    var query = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var errorThrown = 0;
                    try {
                        queryBuilderObj.getAST("inCorrectID")
                    } catch (e) {
                        errorThrown++;
                    }
                    assert.equal(errorThrown, 1, "Error must be thrown.")
                });

            });

            describe('getTerm - API', function () {

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                it('undefined term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
                    var query = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var errorThrown = 0;
                    try {
                        queryBuilderObj.getTerm()
                    } catch (e) {
                        errorThrown++;
                    }
                    assert.equal(errorThrown, 1, "Error must be thrown.")
                });

                it('empty term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
                    var query = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var errorThrown = 0;
                    try {
                        queryBuilderObj.getTerm("")
                    } catch (e) {
                        errorThrown++;
                    }
                    assert.equal(errorThrown, 1, "Error must be thrown.")
                });

                it('Multiple space term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
                    var query = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var errorThrown = 0;
                    try {
                        queryBuilderObj.getTerm("   ")
                    } catch (e) {
                        errorThrown++;
                    }
                    assert.equal(errorThrown, 1, "Error must be thrown.")
                });

                it('Incorrect/non-existing term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
                    var query = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var errorThrown = 0;
                    try {
                        queryBuilderObj.getTerm("inCorrectTerm")
                    } catch (e) {
                        errorThrown++;
                    }
                    assert.equal(errorThrown, 1, "Error must be thrown.")
                });

                it('Correct existing term provided as parameter -- should return model for -- valid - \'test\' query', function () {
                    var query = "test";
                    var term = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var termsArray = queryBuilderObj.getTerm(term);
                    assert.isArray(termsArray, "Array of found terms should be returned.");
                    assert.equal(termsArray.length, 1, "only one matched term exists.");
                    assert.isTrue(compareModelTree(termsArray[0], treeModel.test), "valid model data for respective single term should be returned.");
                });

                it('Correct term with multiple existence provided as parameter -- should return model for -- valid - \'test or new or test\' query', function () {
                    var query = "test or new or test";
                    var term = "test";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var termsArray = queryBuilderObj.getTerm(term);
                    assert.isArray(termsArray, "Array of found terms should be returned.");
                    assert.equal(termsArray.length, 2, "only one matched term exists.");
                    assert.isTrue(compareModelTree(termsArray[0], treeModel.test), "valid model data for respective single term should be returned.");
                    assert.isTrue(compareModelTree(termsArray[1], treeModel.test), "valid model data for respective single term should be returned.");
                });

                it('Correct existing term provided as parameter -- should return model for -- valid - \'osversion=1\' query', function () {
                    var query = "osversion=1";
                    var term = "OSVersion=1";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var termsArray = queryBuilderObj.getTerm(term);
                    assert.isArray(termsArray, "Array of found terms should be returned.");
                    assert.equal(termsArray.length, 1, "only one matched term exists.");
                    assert.isTrue(compareModelTree(termsArray[0], treeModel.osversionEq1.nodes[0]), "valid model data for respective field term should be returned.");
                });

                it('Correct term with multiple existence provided as parameter -- should return model for -- valid - \'osversion=1 or osversion=someTest or osversion=1\' query', function () {
                    var query = "osversion=1 or osversion=someTest or osversion=1";
                    var term = "OSVersion=1";
                    $filterBar.text(query);
                    assert.equal(query, $filterBar.text());
                    queryBuilderObj.validate(query);
                    var termsArray = queryBuilderObj.getTerm(term);
                    assert.isArray(termsArray, "Array of found terms should be returned.");
                    assert.equal(termsArray.length, 2, "only one matched term exists.");
                    assert.isTrue(compareModelTree(termsArray[0], treeModel.osversionEq1.nodes[0]), "valid model data for respective field term should be returned.");
                    assert.isTrue(compareModelTree(termsArray[1], treeModel.osversionEq1.nodes[0]), "valid model data for respective field term should be returned.");
                });
            });

            describe('getTermsType - API', function () {
                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                afterEach(function () {
                    queryBuilderObj.clear();
                });

                it('Should return correct type in empty query \'\' query', function () {
                    var query = "";
                    $filterBar.text(query);
                    queryBuilderObj.validate(query);
                    var termsTypeObj = queryBuilderObj.getTermsType();
                    assert.isFalse(termsTypeObj.literal, "Literal should be false for the returned object.");
                    assert.isFalse(termsTypeObj.fieldExpression, "fieldExpression should be false for the returned object.");
                });

                it('Should return correct type in query -- valid - \'test1 or test2 or test3\' query', function () {
                    var query = "test1 or test2 or test3";
                    $filterBar.text(query);
                    queryBuilderObj.validate(query);
                    var termsTypeObj = queryBuilderObj.getTermsType();
                    assert.isTrue(termsTypeObj.literal, "Literal should be true for the returned object.");
                    assert.isFalse(termsTypeObj.fieldExpression, "fieldExpression should be false for the returned object.");
                });

                it('Should return correct type in query -- valid - \'osversion=1 or osversion=2 or osversion=3\' query', function () {
                    var query = "osversion=1 or osversion=2 or osversion=3";
                    $filterBar.text(query);
                    queryBuilderObj.validate(query);
                    var termsTypeObj = queryBuilderObj.getTermsType();
                    assert.isFalse(termsTypeObj.literal, "Literal should be false for the returned object.");
                    assert.isTrue(termsTypeObj.fieldExpression, "fieldExpression should be true for the returned object.");
                });

                it('Should return correct type in query -- valid - \'osversion=1 or test2 or osversion=3\' query', function () {
                    var query = "osversion=1 or test2 or osversion=3";
                    $filterBar.text(query);
                    queryBuilderObj.validate(query);
                    var termsTypeObj = queryBuilderObj.getTermsType();
                    assert.isTrue(termsTypeObj.literal, "Literal should be true for the returned object.");
                    assert.isTrue(termsTypeObj.fieldExpression, "fieldExpression should be true for the returned object.");
                });
            });

            describe('add - API', function () {

                var makeQueryInputFormat = function (query, logicalOperator) {
                    var addInputFormat = {
                        query: query
                    };

                    if (logicalOperator) {
                        addInputFormat.logicalOperator = logicalOperator;
                    }

                    return addInputFormat;
                };

                var capitalizeLogicalOp = function (query) {
                    var updatedQuery = query.replace(/or/g, "OR");
                    updatedQuery = updatedQuery.replace(/and/g, "AND");
                    updatedQuery = updatedQuery.replace(/not/g, "NOT");
                    return updatedQuery;
                };

                var replaceNBSP = function (containerQuery) {
                    return containerQuery.replace(/\u00a0/g, " "); // Unicode for &nbsp; - These are present in container after styling of query
                };

                var removeSpaceForOperator = function (query) {
                    return query.replace(/ = /g, "="); // remove space
                };

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBar = $queryContainer.find("#filterBar");
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                afterEach(function () {
                    queryBuilderObj.clear();
                });

                it('valid empty filter bar | correct query added via API - \'term1\'', function () {
                    var existingFilterBarQuery = "";
                    $filterBar.val(existingFilterBarQuery);

                    var newQuery = "term1";
                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal(newQuery, queryBuilderObj.getQuery());
                    assert.equal(newQuery, $filterBar.text().trim());
                });

                it('valid existing value in filter bar - \'a or b\' | correct single query added via API - \'term1\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "term1";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, queryBuilderObj.getQuery());
                    assert.equal(capitalizeLogicalOp(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery), replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "valid");
                });

                it('valid existing value in filter bar - \'a or b\' | correct key/value query added via API - \'osversion = 1\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "OSVersion = 1";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + removeSpaceForOperator(newQuery), queryBuilderObj.getQuery());
                    assert.equal(capitalizeLogicalOp(existingFilterBarQuery + " " + defaultLogicalOperator + " " + removeSpaceForOperator(newQuery)), replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "valid");
                });

                it('valid existing value in filter bar - \'a or b\' | correct long query added via API - \'term1 or osversion =   1 and name = srx\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "term1 or OSVersion = 1 and Name = srx";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + removeSpaceForOperator(newQuery), queryBuilderObj.getQuery());
                    assert.equal(capitalizeLogicalOp(existingFilterBarQuery + " " + defaultLogicalOperator + " " + removeSpaceForOperator(newQuery)), replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "valid");
                });

                it('valid existing value in filter bar - \'a or b\' | Incorrect query added via API - \'name\' ', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    var newQuery = "name";
                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "invalid");
                });

                it('valid existing value in filter bar - \'a or b\' | Multiple times Incorrect query added via API - \'name\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    var newQuery = "name";
                    queryBuilderObj.add(makeQueryInputFormat(newQuery));
                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, $filterBar.text().trim());
                    assert.equal(queryObjAfterAdd.state, "invalid");

                    var newQuery = "osversion";
                    queryBuilderObj.add(makeQueryInputFormat(newQuery));
                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal("a or b AND name" + " " + defaultLogicalOperator + " " + newQuery, $filterBar.text().trim());
                    assert.equal(queryObjAfterAdd.state, "invalid");
                });
                it('valid existing value in filter bar - \'a or b\' | correct single query added via API - \'term1\' | internally default logical operator added', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "term1";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, queryBuilderObj.getQuery());
                    assert.equal(capitalizeLogicalOp(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery), replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "valid");
                });

                it('valid existing value in filter bar - \'a or b\' | correct single query added via API  - \'term1\' | Provided logical operator added', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "term1";
                    var logicalOperator = "OR";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery, logicalOperator));

                    assert.equal(existingFilterBarQuery + " " + logicalOperator + " " + newQuery, queryBuilderObj.getQuery());
                    assert.equal(capitalizeLogicalOp(existingFilterBarQuery + " " + logicalOperator + " " + newQuery), replaceNBSP($filterBar.text().trim()));
                    assert.equal(queryObjAfterAdd.state, "valid");
                });

                it('valid existing value in filter bar - \'a or b\' | correct single query added via API  - \'term1\' | Invalid logical operator added', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "term1";
                    var logicalOperator = "InvalidOp";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery, logicalOperator));

                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal(existingFilterBarQuery + " " + logicalOperator + " " + newQuery, $filterBar.text());
                    assert.equal(queryObjAfterAdd.state, "invalid");
                });

                it('Invalid existing value in filter bar - \'name\' | correct key/value query added via API - \'osversion = 1\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "name";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "osversion = 1";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, $filterBar.text());
                    assert.equal(queryObjAfterAdd.state, "invalid");
                });

                it('Invalid existing value in filter bar - \'name\' | Incorrect key/value query added via API - \'osversion\'', function () {
                    var queryObjAfterAdd;
                    var existingFilterBarQuery = "name";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    var newQuery = "osversion";
                    queryBuilderObj.bindEvents({
                        "query.valid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        },
                        "query.invalid": {
                            "handler": [function (e, queryObj) {
                                queryObjAfterAdd = queryObj;
                            }]
                        }
                    });

                    queryBuilderObj.add(makeQueryInputFormat(newQuery));

                    assert.equal("", queryBuilderObj.getQuery());
                    assert.equal(existingFilterBarQuery + " " + defaultLogicalOperator + " " + newQuery, $filterBar.text());
                    assert.equal(queryObjAfterAdd.state, "invalid");
                });

                it('valid existing value in filter bar - \'a or b\' | Invalid add query format - missing \'query\' property | Exception thrown', function () {
                    var exceptionThrown;

                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    try {
                        queryBuilderObj.add({});
                    } catch (e) {
                        exceptionThrown = true;
                    }

                    assert.equal(existingFilterBarQuery, queryBuilderObj.getQuery());
                    assert.isTrue(exceptionThrown);
                });
            });

            /* Note : Following method do not have a real use case associated.
             * There is high complexity involved in removing a node and balancing the tree in case of parantheses tree.
             * it's been discussed to not support the method the method until there is a real application use case.
             * Keeping the method commented for the time being
             */
            // describe('remove - API', function () {
            //     before(function () {
            //         var conf = {
            //             container: $queryContainer
            //         };
            //         $.extend(conf, configurationSample.searchConf);
            //         queryBuilderObj = new queryBuilderWidget(conf);
            //         queryBuilderObj.build();
            //         $filterBar = $queryContainer.find("#filterBar");
            //     });
            //
            //     after(function () {
            //         queryBuilderObj.destroy();
            //     });
            //
            //     afterEach(function () {
            //         queryBuilderObj.clear();
            //     });
            //
            //     it('undefined term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
            //         var query = "test";
            //         $filterBar.text(query);
            //         queryBuilderObj.validate(query);
            //         var errorThrown = 0;
            //         try {
            //             queryBuilderObj.remove()
            //         } catch (e) {
            //             errorThrown++;
            //         }
            //         assert.equal(errorThrown, 1, "Error must be thrown.")
            //     });
            //
            //     it('empty term provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
            //         var query = "test";
            //         $filterBar.text(query);
            //         queryBuilderObj.validate(query);
            //         var errorThrown = 0;
            //         try {
            //             queryBuilderObj.remove("")
            //         } catch (e) {
            //             errorThrown++;
            //         }
            //         assert.equal(errorThrown, 1, "Error must be thrown.")
            //     });
            //
            //     it('Multiple space provided as parameter -- should throw exception for -- valid - \'test\' query', function () {
            //         var query = "test";
            //         $filterBar.text(query);
            //         queryBuilderObj.validate(query);
            //         var errorThrown = 0;
            //         try {
            //             queryBuilderObj.remove("   ")
            //         } catch (e) {
            //             errorThrown++;
            //         }
            //         assert.equal(errorThrown, 1, "Error must be thrown.")
            //     });
            //
            //     it('Incorrect Id as parameter -- should throw exception for -- valid - \'test\' query', function () {
            //         var query = "test";
            //         $filterBar.text(query);
            //         queryBuilderObj.validate(query);
            //         var errorThrown = 0;
            //         try {
            //             queryBuilderObj.remove("inCorrectID")
            //         } catch (e) {
            //             errorThrown++;
            //         }
            //         assert.equal(errorThrown, 1, "Error must be thrown.")
            //     });
            //
            //     it('Id for first as parameter -- should remove the first term and restyle for empty filterbar -- valid- \'test1\' query', function () {
            //         var query = "test1";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "", "model should be empty.");
            //     });
            //
            //     it('Id for first as parameter -- should remove the first term and restyle  -- valid- \'test1 or test2\' query', function () {
            //         var query = "test1 or test2";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "test2", "first term should be removed");
            //     });
            //
            //     it('Id for last as parameter -- should remove the last term and restyle  -- valid- \'test1 or test2\' query', function () {
            //         var query = "test1 or test2";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[1].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "test1", "Last term should be removed");
            //     });
            //
            //     it('Id for First term as parameter -- should remove the first term and restyle  -- valid- \'test1 or test2 or test3\' query', function () {
            //         var query = "test1 or test2 or test3";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "test2 or test3", "First term should be removed");
            //     });
            //
            //     it('Id for Second term as parameter -- should remove the second term and restyle  -- valid- \'test1 or test2 or test3\' query', function () {
            //         var query = "test1 or test2 or test3";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[1].nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "test1 or test3", "Second term should be removed");
            //     });
            //
            //     it('Id for Third term as parameter -- should remove the third term and restyle  -- valid- \'test1 or test2 or test3\' query', function () {
            //         var query = "test1 or test2 or test3";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[1].nodes[1].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "test1 or test2", "Second term should be removed");
            //     });
            //     it('Id of parantheses -- should remove the full parantheses term -- valid- \'(test1)\' query', function () {
            //         var query = "(test1)";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "", "model should be empty.");
            //     });
            //
            //     it('Id of first term in parantheses -- should remove the full parantheses term for -- valid- \'(test1)\' query', function () {
            //         var query = "(test1)";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "", "model should be empty.");
            //     });
            //
            //     it('Id of first term in parantheses -- should remove the first term and restyle for empty filterbar -- valid- \'(test1 or test2)\' query', function () {
            //         var query = "(test1 or test2)";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "(test2)", "first term should be removed.");
            //     });
            //
            //     it('Id of second term in parantheses -- should remove the second term and restyle for empty filterbar -- valid- \'(test1 or test2)\' query', function () {
            //         var query = "(test1 or test2)";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].nodes[1].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "(test1)", "second term should be removed.");
            //     });
            //
            //     it('Id of middle term in parantheses -- should remove the second term and restyle for empty filterbar -- valid- \'(test1 or test2 or test3)\' query', function () {
            //         var query = "(test1 or test2 or test3)";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].nodes[1].nodes[0].id;
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "(test1 or test3)", "second term should be removed.");
            //     });
            //
            //     it('Id for first key/value term as parameter -- should remove the first term and restyle for empty filterbar -- valid- \'osversion=1\' query', function () {
            //         var query = "osversion=1";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].id; //osversion=1
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "", "model should be empty.");
            //     });
            //
            //     it('Id for first key/value term as parameter -- should remove the first term and restyle for empty filterbar -- valid- \'osversion=1 and name=test\' query', function () {
            //         var query = "osversion=1 and name=test";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[0].id; //osversion=1
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "Name=test", "remaining of the search terms should exist");
            //     });
            //
            //     it('Id for second key/value term as parameter -- should remove the first term and restyle for empty filterbar -- valid- \'osversion=1 and name=test\' query', function () {
            //         var query = "osversion=1 and name=test";
            //         $filterBar.text(query);
            //         var result = queryBuilderObj.validate(query);
            //         var modelId = result.model.nodes[1].id; //name=test
            //         assert.isDefined(modelId, "Id should not be undefined & should be assigned in AST");
            //         queryBuilderObj.remove(modelId);
            //         assert.equal(queryBuilderObj.getQuery(), "OSVersion=1", "remaining of the search terms should exist");
            //     });
            // });
        });

        describe('Grammar validation', function () {
            var queryBuilderObj;
            var $filterBar;
            var reqres;

            var messages = {
                validMessage: "Press Enter to get matching results.",
                invalidMessage: "Invalid expression.",
                logicalOperator: "Enter a valid logical operator.",
                relationalOperator: "Enter a relational operator.",
                term: "Enter a value after the logical operator.",
                logicalOperatorSpace: "Enter a value after the logical operator.",
                fieldTermValue: "Enter a value after the relational operator.",
                fieldDelimiterSpace: "Enter a value after the comma.",
                termSpace: "Enter a valid logical operator.",
                openParenSpace: "Enter a value after the parentheses.",
                closeParen: "Enter a valid logical operator or close parentheses."
            };

            var validExpressionMessage = function (testString) {
                return ('\'' + testString + "\' is valid expression");
            };

            var validRelationalOpMessage = function (operator, message) {
                return ('\'' + operator + "\' " + message);
            };

            var validQueryExpressionMessage = function () {
                return "Constructed query should match tested query";
            };

            var emptyQueryExpressionMessage = function () {
                return "Query expression should be empty in case of invalid expression";
            };

            var invalidExpressionMessage = function (testString, message) {
                var message = _.isUndefined(message) ? "" : " " + message;
                return ('\'' + testString + "\' is invalid expression:" + message);
            };

            var validModelGenerated = function (message) {
                return message || "Generated model should match expected model";
            };

            var invalidModelGenerated = function (message) {
                return message || "Model Object should be empty";
            };

            var squeezeSpaceToOne = function (str) {
                // squeezes the spaces in the string to one space
                return (str.replace(/  +/g, ' '))
            };

            var removeAllSpacefromString = function (str) {
                return (str.replace(/  +/g, '')) // remove any space
            };

            before(function () {
                var conf = {
                    container: $queryContainer
                };
                $.extend(conf, configurationSample.searchConf);
                queryBuilderObj = new queryBuilderWidget(conf);
                queryBuilderObj.build();
                $filterBar = $queryContainer.find("#filterBar");
                reqres = queryBuilderObj._getWreqr().reqres;
            });

            describe('Single Term values', function () {
                it('invalid - \'\'', function () {
                    var testString = '';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "No value is invalid expression"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \' \'', function () {
                    var testString = ' ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "Only empty string is invalid expression"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('valid - \'t\'', function () {
                    var testString = 't';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.t), validModelGenerated());
                });
                it('valid - \'t \' - single space at the end of string', function () {
                    var testString = 't ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.t_), validModelGenerated());
                });
                it('valid - \'t    \' - multiple spaces at the end of string', function () {
                    var testString = 't    ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(squeezeSpaceToOne(queryBuilderObj.getQuery()), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.t____), validModelGenerated());
                });
                it('valid   - \'test\'', function () {
                    var testString = 'test';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.test), validModelGenerated());
                });
                it('valid - \'test \' - space at the end of the query', function () {
                    var testString = 'test ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.test_), validModelGenerated());
                });
                it('invalid - \'test z\'', function () {
                    var testString = 'test z';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'test    z\' - Multiple spaces between terms', function () {
                    var testString = 'test    z';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                });
                it('invalid - \'test=\'', function () {
                    var testString = 'test=';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "relational operator not alloweed"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'test   =\' - Multiple spaces between terms', function () {
                    var testString = 'test   =';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "relational operator not alloweed"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'test o\'', function () {
                    var testString = 'test o';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('invalid - \'test or1\'', function () {
                    var testString = 'test or1';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('invalid - \'test 1or\'', function () {
                    var testString = 'test 1or';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('invalid - \'test or\'', function () {
                    var testString = 'test or';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'test or \'', function () {
                    var testString = 'test or ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('valid - \'term1 or term2\'', function () {
                    var testString = 'term1 or term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2), validModelGenerated());
                });
                it('valid - \'term1    or term2\' - Multiple spaces between terms', function () {
                    var testString = 'term1    or term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2), validModelGenerated());
                });
                it('valid - \'term1   or   term2\' - multiple spaces between terms', function () {
                    var testString = 'term1   or   term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2), validModelGenerated());
                });
                it('invalid - \'term1 or1 term2\'', function () {
                    var testString = 'term1 or1 term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'term1 or term2 z\'', function () {
                    var testString = 'term1 or term2 z';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator at end"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'term1 or term2 o\'', function () {
                    var testString = 'term1 or term2 o';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator at end"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'term1 or term2 or\'', function () {
                    var testString = 'term1 or term2 or';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete query"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'term1 or term2 or1\'', function () {
                    var testString = 'term1 or term2 or1';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator at end"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('invalid - \'term1 or term2 or \'', function () {
                    var testString = 'term1 or term2 or ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator at end"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });

                it('valid - \'term1 or term2 or term3\'', function () {
                    var testString = 'term1 or term2 or term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2_or_term3), validModelGenerated());
                });

                it('valid - \'term1 or term2 or term3    \' - multiple spaces at the end', function () {
                    var testString = 'term1 or term2 or term3    ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(testString), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2_or_term3____), validModelGenerated());
                });

                it('invalid - \'term1 nonDefinedLogicalOperator term2\'', function () {
                    var testString = 'term1 nonDefinedLogicalOperator term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "Logical operator is not defined in config."));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
            });

            describe('Field term values', function () {
                describe('General Combinations', function () {
                    it('valid - \'osversio\' - substring of field key is valid & is considered as singleTerm', function () {
                        var testString = 'osversio';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversio), validModelGenerated());
                    });
                    it('valid - \'osversion1\' - field key as substring of input value is valid & considered as singleTerm', function () {
                        var testString = 'osversion1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversion1), validModelGenerated());
                    });
                    it('invalid - \'osversion\'', function () {
                        var testString = 'osversion';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.relationalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion \'', function () {
                        var testString = 'osversion ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.relationalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=\'', function () {
                        var testString = 'osversion=';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.fieldTermValue, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion        =\' - Multiple spaces in-between', function () {
                        var testString = 'osversion        =';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.fieldTermValue, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'osversion=1\'', function () {
                        var testString = 'OSVersion=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1), validModelGenerated());
                    });
                    it('valid - \'osversion   =   1\' - Multiple spaces between operator & value', function () {
                        var testString = 'OSVersion   =   1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), removeAllSpacefromString(testString), validQueryExpressionMessage()); //- fix for model
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1), validModelGenerated());
                    });
                    it('invalid - \'osversion=1 name\'', function () { //todo : fix message resolver asserts with the new state resolver code
                        var testString = 'osversion=1 name';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=1 o\'', function () {
                        var testString = 'osversion=1 o';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=1 or\'', function () {
                        var testString = 'osversion=1 or';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete query"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperatorSpace, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=1 or \'', function () {
                        var testString = 'osversion=1 or ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete query"));
                        assert.equal(reqres.request("messageResolver"), messages.term, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=1 or1\'', function () {
                        var testString = 'osversion=1 or1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'osversion=1 1or\'', function () {
                        var testString = 'osversion=1 1or';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'osversion=1 or name=2\'', function () {
                        var testString = 'osversion=1 or name=2';
                        var expectedQuery = 'OSVersion=1 or Name=2';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1_or_nameEq2), validModelGenerated());
                    });
                    it('valid - \'osversion=1 or name=2 \' - space at the end', function () {
                        var testString = 'osversion=1 or name=2 ';
                        var expectedQuery = 'OSVersion=1 or Name=2 ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1_or_nameEq2_), validModelGenerated());
                    });
                    it('valid - \'osversion=1     or name=2 \' - Multiple spaces in-between', function () {
                        var testString = 'osversion=1     or name=2 ';
                        var expectedQuery = 'OSVersion=1 or Name=2 ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1_or_nameEq2_), validModelGenerated());
                    });
                    it('invalid - \'osversion=1 or1 name=2\'', function () {
                        var testString = 'osversion=1 or1 name=2';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'osversion=1 or name=2 or devicefamily=3\'', function () {
                        var testString = 'osversion=1 or name=2 or devicefamily=3';
                        var expectedQuery = 'OSVersion=1 or Name=2 or DeviceFamily=3';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1_or_nameEq2_or_devicefamilyEq3), validModelGenerated());
                    });
                    it('invalid - \'osversion=1,\'', function () {
                        var testString = 'osversion=1,';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.fieldDelimiterSpace, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'osversion=1,2\'', function () {
                        var testString = 'osversion=1,2';
                        var expectedQuery = 'OSVersion=1,2';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1Comma2), validModelGenerated());
                    });
                    it('valid - \'osversion=1,2,3\'', function () {
                        var testString = 'osversion=1,2,3';
                        var expectedQuery = 'OSVersion=1,2,3';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1Comma2Comma3), validModelGenerated());
                    });
                    it('invalid - \'nonDefinedKey=1\'', function () {
                        var testString = 'nonDefinedKey=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "field name is not defined in config"));
                        // assert.equal(reqres.request("messageResolver"), messages.invalidMessage, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(\'', function () {
                        var testString = '(';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.openParenSpace, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a\'', function () {
                        var testString = '(a';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.closeParen, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a \'', function () {
                        var testString = '(a ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a o\'', function () {
                        var testString = '(a o';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or\'', function () {
                        var testString = '(a or';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperatorSpace, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or \'', function () {
                        var testString = '(a or ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.term, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or b\'', function () {
                        var testString = '(a or b';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.closeParen, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or b \'', function () {
                        var testString = '(a or b ';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.logicalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or (\'', function () {
                        var testString = '(a or (';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.openParenSpace, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or (b\'', function () {
                        var testString = '(a or (b';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.closeParen, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'(a or (b)\'', function () {
                        var testString = '(a or (b)';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incorrect logical operator"));
                        assert.equal(reqres.request("messageResolver"), messages.closeParen, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'(a or (b))\'', function () {
                        var testString = '(a or (b))';
                        var expectedQuery = '(a or (b))';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    });
                    it('invalid - \'Managed Status\' - Space as part of key', function () {
                        var testString = 'Managed Status';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.relationalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'Managed Status=\'', function () {
                        var testString = 'Managed Status=';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.fieldTermValue, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'Managed Status=1\'', function () {
                        var testString = 'Managed Status=1';
                        var expectedQuery = 'Managed Status=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.Managed_StatusEq1), validModelGenerated());
                    });
                    it('invalid - \'application-services\' - Hyphen as part of key', function () {
                        var testString = 'Application-Services';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.relationalOperator, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'application-services=\'', function () {
                        var testString = 'application-services=';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "incomplete field term"));
                        assert.equal(reqres.request("messageResolver"), messages.fieldTermValue, invalidExpressionMessage(testString, "should not be Valid"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('valid - \'application-services=1\'', function () {
                        var testString = 'Application-Services=1';
                        var expectedQuery = 'application-services=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                        assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                        assert.isTrue(compareModelTree(result.model, treeModel.ApplicationHyphenServicesEq1), validModelGenerated());
                    });
                });

                describe('Associated Relational Operators', function () {
                    it('valid - \'name=1\'', function () {
                        var testString = 'name=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validRelationalOpMessage("=", "defined in app config for key values"));
                    });

                    it('valid - \'name!=1\'', function () {
                        var testString = 'name!=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validRelationalOpMessage("!=", "defined in app config for key values"));
                    });

                    it('valid - \'name    !=    1\' - Multiple spaces', function () {
                        var testString = 'name   !=   1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validRelationalOpMessage("!=", "defined in app config for key values"));
                    });

                    it('invalid - \'name<=1\'', function () {
                        var testString = 'name<=1';
                        var result = queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "relational operator Not defined in app config"));
                    });

                    describe('Default Relational Operators', function () {
                        it('valid - \'DeviceFamily=1\'', function () {
                            var testString = 'DeviceFamily=1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage("=", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('valid - \'DeviceFamily!=1\'', function () {
                            var testString = 'DeviceFamily!=1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage("!=", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('valid - \'DeviceFamily<=1\'', function () {
                            var testString = 'DeviceFamily<=1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage("<=", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('valid - \'DeviceFamily>=1\'', function () {
                            var testString = 'DeviceFamily>=1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage(">=", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('valid - \'DeviceFamily>1\'', function () {
                            var testString = 'DeviceFamily>1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage(">", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('valid - \'DeviceFamily<1\'', function () {
                            var testString = 'DeviceFamily<1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "valid", validRelationalOpMessage("<", "operators not defined by app config, hence default set is used including given operator"));
                        });

                        it('invalid - \'DeviceFamily==1\'', function () {
                            var testString = 'DeviceFamily==1';
                            var result = queryBuilderObj.validate(testString);
                            assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "operators not defined by app config, Also default set does not include given operator"));
                        });
                    });
                });
            });

            describe('SingleTerm & Field term combinations', function () {
                it('valid - \'osversion=1 or test\'', function () {
                    var testString = 'osversion=1 or test';
                    var expectedQuery = 'OSVersion=1 or test';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.osversionEq1_or_test), validModelGenerated());
                });

                it('valid - \'test or osversion=1\'', function () {
                    var testString = 'test or osversion=1';
                    var expectedQuery = 'test or OSVersion=1';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.test_or_osversionEq1), validModelGenerated());
                });
            });

            describe('SingleTerm with parantheses', function () {
                it('valid - \'(term1)\'', function () {
                    var testString = '(term1)';
                    var expectedQuery = '(term1)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1Close), validModelGenerated());
                });
                it('valid - \'(   term1)\' - Multiple spaces after open braces', function () {
                    var testString = '(   term1)';
                    var expectedQuery = '(term1)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1Close), validModelGenerated());
                });
                it('valid - \'(term1   )\' - Multiple spaces before close braces', function () {
                    var testString = '(term1   )';
                    var expectedQuery = '(term1)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1Close), validModelGenerated());
                });
                it('valid - \'(term1)   \' - Multiple spaces after close braces', function () {
                    var testString = '(term1)  ';
                    var expectedQuery = '(term1)   ';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(expectedQuery), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1Close_), validModelGenerated());
                });
                it('valid - \'(term1 or term2)\'', function () {
                    var testString = '(term1 or term2)';
                    var expectedQuery = '(term1 or term2)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1_or_Term2Close), validModelGenerated());
                });
                it('valid - \'((term1 and term2))\'', function () {
                    var testString = '((term1 and term2))';
                    var expectedQuery = '((term1 and term2))';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenOpenTerm1_or_Term2CloseClose), validModelGenerated());
                });
                it('valid - \'(term1 or term2) and term3\'', function () {
                    var testString = '(term1 or term2) and term3';
                    var expectedQuery = '(term1 or term2) and term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1_or_Term2Close_and_Term3), validModelGenerated());
                });
                it('valid - \'(term1 or term2 and (term3 or term4))\'', function () {
                    var testString = '(term1 or term2 and (term3 or term4))';
                    var expectedQuery = '(term1 or term2 and (term3 or term4))';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenTerm1_or_Term2_and_OpenTerm3_or_Term4CloseClose), validModelGenerated());
                });
                it('invalid - \'( term1 or term2 ) )\'', function () {
                    var testString = '(term1 or term2 ) )';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
            });

            describe('term with quotes', function () {
                it('valid - \'"term1 has value1" or term3\'', function () {
                    var testString = '"term1 has value1" or term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenqtTerm1_has_value1Closeqt_or_term3), validModelGenerated());
                });
                it('valid - \'("term1 has value1" or term3)\'', function () {
                    var testString = '("term1 has value1" or term3)';
                    var expectedQuery = '("term1 has value1" or term3)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenOpenqtTerm1_has_value1Closeqt_or_term3Close), validModelGenerated());
                });
                it('valid - \'(   "term1 has value1" or term3)\' - spaces after open braces', function () {
                    var testString = '(  "term1 has value1" or term3)';
                    var expectedQuery = '("term1 has value1" or term3)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), squeezeSpaceToOne(expectedQuery), validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenOpenqtTerm1_has_value1Closeqt_or_term3Close), validModelGenerated());
                });
                it('invalid - \'(term1 has value1" or term3)\'', function () {
                    var testString = '(term1 has value1" or term3)';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('valid - \'osversion="term1 with value1"\'', function () {
                    var testString = 'osversion="term1 with value1"';
                    var expectedQuery = 'OSVersion="term1 with value1"';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), expectedQuery, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.osversionEqOpenqtTerm1_with_value1Closeqt), validModelGenerated());
                });
                it('valid - \'"StringWithNoSpace"\'', function () {
                    var testString = '"StringWithNoSpace"';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenqtStringWithNoSpaceCloseqt), validModelGenerated());
                });
                it('valid - \'"String With Space"\'', function () {
                    var testString = '"String With Space"';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                });
                it('valid - \'"Managed Status"\' - Space as part of valid key', function () {
                    var testString = '"Managed Status"';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenqtManaged_StatusCloseqt), validModelGenerated());
                });
                it('invalid - \'"Managed Status"=\'', function () {
                    var testString = '"Managed Status"=';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "term with in double quotes will be treated a single term"));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'"Managed Status"=1\'', function () {
                    var testString = '"Managed Status"=1';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "term with in double quotes will be treated a single term"));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('valid - \'"Application-Services"\' - Hyphen as part of valid key', function () {
                    var testString = '"Application-Services"';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(reqres.request("messageResolver"), messages.validMessage, validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.OpenqtApplicationHyphenServicesCloseqt), validModelGenerated());
                });
                it('invalid - \'"Application-Services"=\'', function () {
                    var testString = '"Application-Services"=';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "term with in double quotes will be treated a single term"));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
                it('invalid - \'"Application-Services"=1\'', function () {
                    var testString = '"Application-Services"=1';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "term with in double quotes will be treated a single term"));
                    assert.notEqual(reqres.request("messageResolver"), messages.validMessage, invalidExpressionMessage(testString, "should not be Valid"));
                    assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                    assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                });
            });

            describe('Logical Operators - validation based on provided logical operators values', function () {
                var tc;
                var TestContext = function (testConf) {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, testConf);

                    this.queryBuilderObj = new queryBuilderWidget(conf);
                    this.queryBuilderObj.build();

                    this.destroy = function () {
                        this.queryBuilderObj.destroy();
                    }
                };

                describe('Logical Operators - And | Or | Not as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 And term2 or term3 Not term4\'', function () {
                        tc = new TestContext(searchConfExample.logical_or_and_not);
                        var testString = 'term1 And term2 or term3 Not term4';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                });

                describe('Logical Operators - And | Or as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 And term2 or term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_or_and);
                        var testString = 'term1 And term2 or term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 NOT term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_or_and);
                        var testString = 'term1 Not term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "NOT is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });

                describe('Logical Operators - NOT | Or as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 NOT term2 or term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_or_not);
                        var testString = 'term1 NOT term2 or term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 AND term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_or_not);
                        var testString = 'term1 AND term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "AND is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });
                describe('Logical Operators - NOT | And as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 NOT term2 and term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_and_not);
                        var testString = 'term1 NOT term2 and term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 or term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_and_not);
                        var testString = 'term1 or term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "OR is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });

                describe('Logical Operators - OR as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 OR term2 or term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_or);
                        var testString = 'term1 or term2 or term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 And term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_or);
                        var testString = 'term1 and term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "AND is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'term1 Not term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_or);
                        var testString = 'term1 not term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "NOT is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });

                describe('Logical Operators - And as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 And term2 and term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_and);
                        var testString = 'term1 And term2 and term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 or term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_and);
                        var testString = 'term1 or term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "or is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'term1 Not term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_and);
                        var testString = 'term1 not term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "NOT is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });
                describe('Logical Operators - not as app config value', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 not term2 not term3\'', function () {
                        tc = new TestContext(searchConfExample.logical_not);
                        var testString = 'term1 not term2 not term3';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                    it('invalid - \'term1 or term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_not);
                        var testString = 'term1 or term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "or is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                    it('invalid - \'term1 And term2\'', function () {
                        tc = new TestContext(searchConfExample.logical_not);
                        var testString = 'term1 And term2';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "invalid", invalidExpressionMessage(testString, "And is not defined as logical operator in app config"));
                        assert.equal(queryBuilderObj.getQuery(), "", emptyQueryExpressionMessage());
                        assert.equal(JSON.stringify(result.model), JSON.stringify({}), invalidModelGenerated());
                    });
                });

                describe('Logical Operators - no operator provided by app config - Default operators will be used', function () {
                    afterEach(function () {
                        tc.destroy();
                    });
                    it('valid - \'term1 And term2 or term3 Not term4\'', function () {
                        tc = new TestContext(searchConfExample.logical_none);
                        var testString = 'term1 And term2 or term3 Not term4';
                        var result = tc.queryBuilderObj.validate(testString);
                        assert.equal(result.state, "valid", validExpressionMessage(testString));
                        assert.equal(tc.queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    });
                });
            });

            describe('Logical Operators - with precedence', function () {
                it('valid - \'term1 OR term2\'', function () {
                    var testString = 'term1 OR term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_OR_term2), validModelGenerated());
                });
                it('valid - \'term1 or term2 OR term3\'', function () {
                    var testString = 'term1 or term2 OR term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2_OR_term3), validModelGenerated());
                });
                it('valid - \'term1 and term2\'', function () {
                    var testString = 'term1 and term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_and_term2), validModelGenerated());
                });
                it('valid - \'term1 and term2 and term3\'', function () {
                    var testString = 'term1 and term2 and term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_and_term2_term3), validModelGenerated());
                });
                it('valid - \'term1 not term2\'', function () {
                    var testString = 'term1 NOT term2';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_not_term2), validModelGenerated());
                });
                it('valid - \'term1 not term2 NOT term3\'', function () {
                    var testString = 'term1 not term2 NOT term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_not_term2_NOT_term3), validModelGenerated());
                });
                it('valid - \'term1 not term2 and term3 not term4\'', function () {
                    var testString = 'term1 not term2 and term3 not term4';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_not_term2_and_term3_NOT_term4), validModelGenerated());
                });
                it('valid - \'term1 not term2 or term3\'', function () {
                    var testString = 'term1 not term2 or term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_not_term2_or_term3), validModelGenerated());
                });
                it('valid - \'term1 or term2 not term3\'', function () {
                    var testString = 'term1 not term2 or term3';
                    var result = queryBuilderObj.validate(testString);
                    assert.equal(result.state, "valid", validExpressionMessage(testString));
                    assert.equal(queryBuilderObj.getQuery(), testString, validQueryExpressionMessage());
                    assert.isTrue(compareModelTree(result.model, treeModel.term1_or_term2_not_term3), validModelGenerated());
                });
            });
        });

        //Tooltipster library can't render svg tooltip properly in the unit test.
        // ToDo - Needs to be fixed as part of PR-1358038
        // describe('Tooltip on Valid/Invalid Icon', function () {
        //     var queryBuilderObj;
        //     var $filterBar;
        //     var $iconContainer;
        //     var query;
        //
        //     before(function () {
        //         var conf = {
        //             container: $queryContainer
        //         };
        //         $.extend(conf, configurationSample.searchConf);
        //         queryBuilderObj = new queryBuilderWidget(conf);
        //         queryBuilderObj.build();
        //         $filterBar = $queryContainer.find("#filterBar");
        //         cursorPosition = new CursorPosition($filterBar);
        //         $iconContainer = $filterBar.parent().find(".icon");
        //     });
        //
        //     after(function () {
        //         queryBuilderObj.destroy();
        //     });
        //
        //     it('tooltip should be displayed on hover', function () {
        //         query = "OSVersion=12.1";
        //         triggerKeyup($filterBar, query);
        //         $iconContainer.trigger("mouseenter");
        //         var isTooltipstered = $iconContainer.is('.tooltipstered');
        //         assert.equal(isTooltipstered, true, "Tooltip is not attached with queryBuilder");
        //     });
        // });

        describe('Filter Bar container Styling - Unit tests:', function () {
            var $filterBar;
            var $iconSvg;
            var queryBuilderObj;
            var vent;
            var searchEventTriggered;

            // Method to register "executeQuery" event so as to be tested for Enter key Press
            var registerSearchEvent = function () {
                vent.on("query.executeQuery", function () {
                    searchEventTriggered = true;
                });
            };

            // Method to test if the "executeQuery" event is triggered on Enter Press
            var testSearchEventTriggered = function (done) {
                setTimeout(function () {
                    assert.isTrue(searchEventTriggered, "executeQuery event should be triggered.");
                    done();
                })
            };

            // Method to test if the corrext class is associated with the type of search term
            var testElement = function ($element, type) {
                switch (type) {
                    case "lastLiteral":
                        assert.equal($element.text().slice(-1), "\u00a0", "last character should be unicode of nbsp; for " + type); // unicode is needed for caret position
                        assert.isTrue($element.hasClass("literal"), "class literal must exist");
                        break;
                    case "lastFieldValue":
                        assert.equal($element.text().slice(-1), "\u00a0", "last character should be unicode of nbsp; for " + type); // unicode is needed for caret position
                        assert.isTrue($element.hasClass("fieldValue"), "class fieldValue must exist");
                        break;
                    case "logicalOperator":
                    case "fieldOperator":
                        assert.isTrue($element.hasClass(type), "class fieldValue must exist");
                        break;
                    case "openParen":
                    case "closeParen":
                        assert.notEqual($element.text().slice(-1), " ", "last character should not be space for " + type);
                        assert.isTrue($element.hasClass("parenExpression"), "class parenExpression must exist");
                        break;
                    case "fieldValueDelimiter":
                        assert.equal($element.text(), ",", "delimiter should be correct for " + type);
                        assert.isTrue($element.hasClass(type), "class " + type + " must exist");
                        break;
                    case "literal":
                    case "fieldName":
                    case "fieldValue":
                        assert.notEqual($element.text().slice(-1), " ", "last character should not be space for " + type);
                        assert.isTrue($element.hasClass(type), "class " + type + " must exist");
                        break;
                }

                assert.isTrue($element.is("span"), "query must be formatted with span element for " + type);
            };

            describe('Empty filter bar scenarios', function () {
                beforeEach(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;
                });

                afterEach(function () {
                    queryBuilderObj.destroy();
                });

                it('Space keypress on empty filter - cursor remains at beginning', function (done) {
                    vent.on("query.styleUpdate.info", function () {
                        assert.equal(cursorPosition.getCursorPosition(), 0, "Cursor position should be reset at position 0");
                        assert.equal($filterBar.text(), "", "There should not be not any character in filter bar as text");
                        done();
                    });
                    triggerKeyup($filterBar, " ");
                });

                it('Empty filter bar - should trigger emptyQuery event', function (done) {
                    var emptyEventTriggered;
                    vent.on("query.emptyQuery", function () {
                        emptyEventTriggered = true;
                    });

                    setTimeout(function () {
                        assert.isTrue(emptyEventTriggered, "emptyQuery event should be triggered.");
                        done();
                    });

                    triggerKeyup($filterBar, "");
                });
            });

            describe('Space keypress after valid query - Query style formatted', function () {
                beforeEach(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;
                });

                afterEach(function () {
                    queryBuilderObj.destroy();
                });

                it('Format: query as \'term1 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 1, "query must be formatted");
                        testElement($filterBar.children().eq(0), "lastLiteral");
                        done();
                    });
                    triggerKeyup($filterBar, "term1 ");
                });

                it('Format: query as \'term1 or term2 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted with 3 different span elements");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "lastLiteral");
                        done();
                    });
                    triggerKeyup($filterBar, "term1 or term2 ");
                });

                it('Format: query as \'term1 or term2 or term3 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted with 3 different span elements");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "logicalOperator");
                        testElement($filterBar.children().eq(4), "lastLiteral");
                        done();
                    });
                    triggerKeyup($filterBar, "term1 or term2 or term3 ");
                });

                it('Format: query as \'name=value1 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "lastFieldValue");
                        done();
                    });
                    triggerKeyup($filterBar, "name=value1 ");
                });

                it('Format: query as \'name=value1,value2 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "fieldValue");
                        testElement($filterBar.children().eq(3), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(4), "lastFieldValue");
                        done();
                    });
                    triggerKeyup($filterBar, "name=value1,value2 ");
                });

                it('Format: query as \'name=value1,value2,value3 \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 7, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "fieldValue");
                        testElement($filterBar.children().eq(3), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(4), "fieldValue");
                        testElement($filterBar.children().eq(5), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(6), "lastFieldValue");
                        done();
                    });
                    triggerKeyup($filterBar, "name=value1,value2,value3 ");
                });

                it('Format: query as \'(term1) \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "literal");
                        testElement($filterBar.children().eq(2), "closeParen");
                        done();
                    });
                    triggerKeyup($filterBar, "(term1) ");
                });

                it('Format: query as \'(term1 or term2   ) \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "literal");
                        testElement($filterBar.children().eq(2), "logicalOperator");
                        testElement($filterBar.children().eq(3), "literal");
                        testElement($filterBar.children().eq(4), "closeParen");
                        done();
                    });
                    triggerKeyup($filterBar, "(term1 or term2   ) ");
                });

                it('Format: query as \'((term1)) \'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "openParen");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "closeParen");
                        testElement($filterBar.children().eq(4), "closeParen");
                        done();
                    });
                    triggerKeyup($filterBar, "((term1)) ");
                });

            });

            describe('Enter keypress after valid query - Query style formatted & Search executed', function () {

                beforeEach(function () {
                    searchEventTriggered = false;
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;

                    // register search event for each test case so as to test that enter does trigger the "executeQuery" event
                    registerSearchEvent();
                });

                afterEach(function () {
                    queryBuilderObj.destroy();
                });

                it('Format: query as \'term1\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 1, "query must be formatted");
                        testElement($filterBar.children().eq(0), "lastLiteral");
                    });
                    triggerKeyup($filterBar, "term1", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'term1 or term2\'', function (done) {
                    console.log(searchEventTriggered);
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted with 3 different span elements");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "lastLiteral");
                    });
                    triggerKeyup($filterBar, "term1 or term2", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'term1 or term2 or term3\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted with 3 different span elements");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "logicalOperator");
                        testElement($filterBar.children().eq(4), "lastLiteral");
                    });
                    triggerKeyup($filterBar, "term1 or term2 or term3", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'name=value1\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "lastFieldValue");
                    });
                    triggerKeyup($filterBar, "name=value1", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'name=value1,value2\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "fieldValue");
                        testElement($filterBar.children().eq(3), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(4), "lastFieldValue");
                    });
                    triggerKeyup($filterBar, "name=value1,value2", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'name=value1,value2,value3\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 7, "query must be formatted");
                        testElement($filterBar.children().eq(0), "fieldName");
                        testElement($filterBar.children().eq(1), "fieldOperator");
                        testElement($filterBar.children().eq(2), "fieldValue");
                        testElement($filterBar.children().eq(3), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(4), "fieldValue");
                        testElement($filterBar.children().eq(5), "fieldValueDelimiter");
                        testElement($filterBar.children().eq(6), "lastFieldValue");
                    });
                    triggerKeyup($filterBar, "name=value1,value2,value3", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'(term1)\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 3, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "literal");
                        testElement($filterBar.children().eq(2), "closeParen");
                    });
                    triggerKeyup($filterBar, "(term1)", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'(term1 or term2   )\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "literal");
                        testElement($filterBar.children().eq(2), "logicalOperator");
                        testElement($filterBar.children().eq(3), "literal");
                        testElement($filterBar.children().eq(4), "closeParen");
                    });
                    triggerKeyup($filterBar, "(term1 or term2   )", "13");
                    testSearchEventTriggered(done);
                });

                it('Format: query as \'((term1))\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "openParen");
                        testElement($filterBar.children().eq(1), "openParen");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "closeParen");
                        testElement($filterBar.children().eq(4), "closeParen");
                    });
                    triggerKeyup($filterBar, "((term1))", "13");
                    testSearchEventTriggered(done);
                });

            });

            describe('Correct icons are shown on valid / invalid states ', function () {
                var numberOfEvents = 0;

                beforeEach(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    $iconSvg = $filterBar.parent().find(".icon");

                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;
                });

                afterEach(function () {
                    assert.equal(numberOfEvents, 1, "Only one event should be triggered.");
                    numberOfEvents = 0; //reset the counter
                    queryBuilderObj.destroy();
                });

                it('Info Icon is shown for empty query \'\'', function (done) {

                    vent.on("query.icon.info", function () {
                        assert.isTrue($iconSvg.is('.icon'), "Info icon should be displayed");
                        assert.isFalse($iconSvg.is('.valid'), "valid icon class should not exist");
                        assert.isFalse($iconSvg.is('.valid'), "invalid icon class should not exist");
                        ++numberOfEvents;
                        done();
                    });

                    vent.on("query.icon.valid query.icon.invalid", function () {
                        // this test case is to make sure that incorrect events should not be executed
                        // If the execution comes in this block, the value can be either 2 or 3, which will fail the assertion
                        numberOfEvents = numberOfEvents + 2;
                        done();
                    });

                    triggerKeyup($filterBar, "");
                });

                // SVG polyfill is not working with unit tests - hence commented
                // ToDo - Needs to be fixed as part of PR-1358038
                // it('Valid Icon is shown for valid query \'t\'', function (done) {
                //
                //     vent.on("query.icon.valid", function () {
                //         assert.isTrue($iconSvg.is('.valid'), "Valid icon should be displayed");
                //         assert.isFalse($iconSvg.is('.invalid'), "invalid icon class should not exist");
                //         assert.isFalse($iconSvg.is('.info'), "invalid icon class should not exist");
                //         ++numberOfEvents;
                //         done();
                //     });
                //
                //     vent.on("query.icon.invalid query.icon.info", function () {
                //         // this test case is to make sure that incorrect events should not be executed
                //         // If the execution comes in this block, the value can be either 2 or 3, which will fail the assertion
                //         numberOfEvents = numberOfEvents + 2;
                //         done();
                //     });
                //
                //     triggerKeyup($filterBar, "t");
                // });

                // it('InValid Icon is shown for invalid query \'osversion\'', function (done) {
                //
                //     vent.on("query.icon.invalid", function () {
                //         assert.isTrue($iconSvg.is('.invalid'), "Valid icon should be displayed");
                //         assert.isFalse($iconSvg.is('.valid'), "valid icon class should not exist");
                //         assert.isFalse($iconSvg.is('.info'), "invalid icon class should not exist");
                //         ++numberOfEvents;
                //         done();
                //     });
                //
                //     vent.on("query.icon.valid query.icon.info", function () {
                //         // this test case is to make sure that incorrect events should not be executed
                //         // If the execution comes in this block, the value can be either 2 or 3, which will fail the assertion
                //         numberOfEvents = numberOfEvents + 2;
                //         done();
                //     });
                //
                //     triggerKeyup($filterBar, "osversion");
                // });
            });

            describe('Appended query with ** add ** API - valid queries style formatted & Search executed', function () {

                var makeQueryInputFormat = function (query, logicalOperator) {
                    var addInputFormat = {
                        query: query
                    };

                    if (logicalOperator) {
                        addInputFormat.logicalOperator = logicalOperator;
                    }

                    return addInputFormat;
                };

                beforeEach(function () {
                    searchEventTriggered = false;
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;

                    // register search event for each test case so as to test that enter does trigger the "executeQuery" event
                    registerSearchEvent();
                });

                afterEach(function () {
                    queryBuilderObj.destroy();
                });

                it('valid empty filter bar | correct query added via API - \'term1\'', function (done) {
                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 1, "query must be formatted");
                        testElement($filterBar.children().eq(0), "lastLiteral");
                    });
                    queryBuilderObj.add(makeQueryInputFormat("term1"));
                    testSearchEventTriggered(done);
                });

                it('valid existing value in filter bar - \'a or b\' | correct single query added via API - \'term1\'', function (done) {
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 5, "query must be formatted");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "logicalOperator");
                        testElement($filterBar.children().eq(4), "lastLiteral");
                    });

                    queryBuilderObj.add(makeQueryInputFormat("term1"));
                    testSearchEventTriggered(done);
                });

                it('valid existing value in filter bar - \'a or b\' | correct long query added via API - \'term1 or osversion = 1\'', function (done) {
                    var existingFilterBarQuery = "a or b";
                    queryBuilderObj.validate(existingFilterBarQuery);

                    vent.on("query.styleUpdate.valid", function () {
                        assert.equal($filterBar.children().length, 9, "query must be formatted");
                        testElement($filterBar.children().eq(0), "literal");
                        testElement($filterBar.children().eq(1), "logicalOperator");
                        testElement($filterBar.children().eq(2), "literal");
                        testElement($filterBar.children().eq(3), "logicalOperator");
                        testElement($filterBar.children().eq(4), "literal");
                        testElement($filterBar.children().eq(5), "logicalOperator");
                        testElement($filterBar.children().eq(6), "fieldName");
                        testElement($filterBar.children().eq(7), "fieldOperator");
                        testElement($filterBar.children().eq(8), "lastFieldValue");
                    });

                    queryBuilderObj.add(makeQueryInputFormat("term1 or osversion = 1"));
                    testSearchEventTriggered(done);
                });

            });

            describe('Cleared query with ** clear ** API - filter bar should be styled', function () {
                var numberOfEvents = 0;

                beforeEach(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    $filterBar = $queryContainer.find('#filterBar');
                    $iconSvg = $filterBar.parent().find(".icon");

                    cursorPosition = new CursorPosition($filterBar);

                    vent = queryBuilderObj._getWreqr().vent;
                });

                afterEach(function () {
                    assert.equal(numberOfEvents, 1, "Only one event should be triggered.");
                    numberOfEvents = 0; //reset the counter
                    queryBuilderObj.destroy();
                });

                it('Info Icon is shown for empty query \'\'', function (done) {

                    var existingFilterBarQuery = "a or b";
                    $filterBar.text(existingFilterBarQuery);

                    vent.on("query.icon.info", function () {
                        assert.isTrue($iconSvg.is(".info"), "Info icon should be displayed");
                        assert.isFalse($iconSvg.is(".valid"), "valid icon class should not exist");
                        assert.isFalse($iconSvg.is(".invalid"), "invalid icon class should not exist");
                        ++numberOfEvents;
                        done();
                    });

                    vent.on("query.icon.valid query.icon.invalid", function () {
                        // this test case is to make sure that incorrect events should not be executed
                        // If the execution comes in this block, the value can be either 2 or 3, which will fail the assertion
                        numberOfEvents = numberOfEvents + 2;
                        done();
                    });

                    queryBuilderObj.clear();
                    assert.equal("", $filterBar.text());
                });

            });
        });

        describe('AutoComplete - Unit tests:', function () {

            describe('State verification for autocomplete', function () {
                var queryBuilderObj;
                var reqres;

                var errorMessageState = function (testString, expectedState) {
                    return ("Should be \'" + expectedState + "\' for \'" + testString + "\'");
                };
                var errorMessageLastTermObject = function (testString, expectedLastTermObject) {
                    return ("Should be \'" + expectedLastTermObject + "\' for \'" + testString + "\'");
                };

                var testState = function (testString, expectedState) {
                    queryBuilderObj.validate(testString); // triggers event internally on vent object
                    var resolvedState = reqres.request("stateResolver").expectedState;
                    assert.equal(resolvedState, expectedState, errorMessageState(testString, expectedState));
                };

                var testLastTermObject = function (testString, treeModelSpaceString) {
                    var resolvedLastTermObject = JSON.stringify(reqres.request("stateResolver").lastTermObjectValue);
                    var testStr = treeModelSpaceString == undefined ? testString : treeModelSpaceString;
                    var expectedLastTermObject = JSON.stringify(treeModel.lastTermObject[testStr]);
                    assert.equal(resolvedLastTermObject, expectedLastTermObject, errorMessageLastTermObject(testString, expectedLastTermObject));
                };

                before(function () {
                    var conf = {
                        container: $queryContainer
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();

                    reqres = queryBuilderObj._getWreqr().reqres;
                });

                it('State: NodeSpace for \'t\'', function () {
                    var testString = 't';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                    //testLastTermObject(testString); //todo: needs to uncommented once lst object from model is available
                });
                it('State: AnyLogicalOperator for \'t \'', function () {
                    var testString = 't ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                    //testLastTermObject(testString, "t_");
                });
                it('State: AnyLogicalOperator for \'t    \' - Multiple spaces', function () {
                    var testString = 't    ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'term1\'', function () {
                    var testString = 'term1';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'term1 \'', function () {
                    var testString = 'term1 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'term1 o\'', function () {
                    var testString = 'term1 o';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'term1 or\'', function () {
                    var testString = 'term1 or';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'term1 or \'', function () {
                    var testString = 'term1 or ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: RelationalOperator for \'osversion\'', function () {
                    var testString = 'osversion';
                    var expectedState = "RelationalOperator";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOnly");
                });

                it('State: RelationalOperator for \'osversion \'', function () {
                    var testString = 'osversion ';
                    var expectedState = "RelationalOperator";

                    testState(testString, expectedState);
                });

                it('State: FieldTermValue for \'osversion=\'', function () {
                    var testString = 'osversion=';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperator");
                });

                it('State: FieldTermValue for \'osversion= \'', function () {
                    var testString = 'osversion= ';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                });

                it('State: MatchingFieldValue for \'osversion=1\'', function () {
                    var testString = 'osversion=1';
                    var expectedState = "MatchingFieldValue";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'osversion=1 \'', function () {
                    var testString = 'osversion=1 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: FieldDelimiterSpace for \'osversion=1,\'', function () {
                    var testString = 'osversion=1,';
                    var expectedState = "FieldDelimiterSpace";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperatorValueComma");
                });

                it('State: FieldDelimiterSpace for \'osversion=1,2,\'', function () {
                    var testString = 'osversion=1,2,';
                    var expectedState = "FieldDelimiterSpace";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperatorValueComma");
                });

                it('State: MatchingFieldValue for \'osversion=1,2\'', function () {
                    var testString = 'osversion=1,2';
                    var expectedState = "MatchingFieldValue";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'osversion=1,2 \'', function () {
                    var testString = 'osversion=1,2 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'"Managed status"\'', function () {
                    var testString = '"Managed status"';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'"Managed status" \'', function () {
                    var testString = '"Managed status" ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: RelationalOperator for \'Managed status\'', function () {
                    var testString = 'Managed status';
                    var expectedState = "RelationalOperator";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOnly_ManagedStatus");
                });

                it('State: RelationalOperator for \'Managed status \'', function () {
                    var testString = 'Managed status ';
                    var expectedState = "RelationalOperator";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOnly_ManagedStatus");
                });

                it('State: FieldTermValue for \'Managed status =\'', function () {
                    var testString = 'Managed status =';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperator_ManagedStatus");
                });

                it('State: FieldTermValue for \'Managed status=\'', function () {
                    var testString = 'Managed status=';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperator_ManagedStatus");
                });

                it('State: FieldTermValue for \'Managed status= \'', function () {
                    var testString = 'Managed status= ';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperator_ManagedStatus");
                });

                it('State: MatchingFieldValue for \'Managed status=1\'', function () {
                    var testString = 'Managed status=1';
                    var expectedState = "MatchingFieldValue";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'Managed status=1 \'', function () {
                    var testString = 'Managed status=1 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: FieldDelimiterSpace for \'Managed status=1,\'', function () {
                    var testString = 'Managed status=1,';
                    var expectedState = "FieldDelimiterSpace";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperatorValueComma__ManagedStatus");
                });

                it('State: FieldDelimiterSpace for \'Managed status=1,2,\'', function () {
                    var testString = 'Managed status=1,2,';
                    var expectedState = "FieldDelimiterSpace";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperatorValueComma__ManagedStatus");
                });

                it('State: MatchingFieldValue for \'Managed status=1,2\'', function () {
                    var testString = 'Managed status=1,2';
                    var expectedState = "MatchingFieldValue";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'Managed status=1,2 \'', function () {
                    var testString = 'Managed status=1,2 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(a)\'', function () {
                    var testString = '(a)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'(a) \'', function () {
                    var testString = '(a) ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'((a))\'', function () {
                    var testString = '((a))';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'((a)) \'', function () {
                    var testString = '((a)) ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(a) or\'', function () {
                    var testString = '(a) or';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(a) or \'', function () {
                    var testString = '(a) or ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'(a \'', function () {
                    var testString = '(a ';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(a or\'', function () {
                    var testString = '(a or';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(a or)\'', function () {
                    var testString = '(a or)';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(a or )\'', function () {
                    var testString = '(a or )';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(a or \'', function () {
                    var testString = '(a or ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(a or b)\'', function () {
                    var testString = '(a or b)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'(a or b) \'', function () {
                    var testString = '(a or b) ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(a or b) and\'', function () {
                    var testString = '(a or b) and';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(a or b) and \'', function () {
                    var testString = '(a or b) and ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(a or b) and c\'', function () {
                    var testString = '(a or b) and c';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'(a or b) and c \'', function () {
                    var testString = '(a or b) and c ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(a or) and c\'', function () {
                    var testString = '(a or) or c';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(a or ) and c\'', function () {
                    var testString = '(a or ) or c';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: CloseParen for \'((a)\'', function () {
                    var testString = '((a)';
                    var expectedState = "CloseParen";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'((a) \'', function () {
                    var testString = '((a) ';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'((a) or\'', function () {
                    var testString = '((a) or';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'((a) or \'', function () {
                    var testString = '((a) or ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: CloseParen for \'((a) or test\'', function () {
                    var testString = '((a) or test';
                    var expectedState = "CloseParen";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'((a) or test \'', function () {
                    var testString = '((a) or test ';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'((a) or test)\'', function () {
                    var testString = '((a) or test)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'((a) or test )\'', function () {
                    var testString = '((a) or test )';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'((a) or test ) and\'', function () {
                    var testString = '((a) or test ) and';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'((a) or test ) and (n)\'', function () {
                    var testString = '((a) or test ) and (n)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: RelationalOperator for \'(name\'', function () {
                    var testString = '(name';
                    var expectedState = "RelationalOperator";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOnly_name");
                });

                it('State: FieldTermValue for \'(name=\'', function () {
                    var testString = '(name=';
                    var expectedState = "FieldTermValue";

                    testState(testString, expectedState);
                    testLastTermObject(testString, "keyOperator_name");
                });

                it('State: CloseParen for \'(name=1\'', function () {
                    var testString = '(name=1';
                    var expectedState = "CloseParen";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'(name=1 \'', function () {
                    var testString = '(name=1 ';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(name=1)\'', function () {
                    var testString = '(name=1)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(name=1 )\'', function () {
                    var testString = '(name=1 )';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'(name=1) \'', function () {
                    var testString = '(name=1) ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperator for \'(name=1 \'', function () {
                    var testString = '(name=1 ';
                    var expectedState = "LogicalOperator";

                    testState(testString, expectedState);
                });

                it('State: LogicalOperatorSpace for \'(name=1 or\'', function () {
                    var testString = '(name=1 or';
                    var expectedState = "LogicalOperatorSpace";

                    testState(testString, expectedState);
                });

                it('State: Term for \'(name=1 or \'', function () {
                    var testString = '(name=1 or ';
                    var expectedState = "Term";

                    testState(testString, expectedState);
                });

                it('State: NodeSpace for \'(name=1 or b)\'', function () {
                    var testString = '(name=1 or b)';
                    var expectedState = "NodeSpace";

                    testState(testString, expectedState);
                });

                it('State: MatchingFieldValue for \'(a or b) and name=1\'', function () {
                    var testString = '(a or b) and name=1';
                    var expectedState = "MatchingFieldValue";

                    testState(testString, expectedState);
                });

                it('State: AnyLogicalOperator for \'(a or b) and name=1 \'', function () {
                    var testString = '(a or b) and name=1 ';
                    var expectedState = "AnyLogicalOperator";

                    testState(testString, expectedState);
                });
            });

            describe('Add case: State based suggestions for autocomplete', function () {
                var queryBuilderObj;
                var vent;
                var $filterBarContainer;

                afterEach(function () {
                    vent.off("query.autocomplete.onSuggestionLoad");
                    $filterBarContainer.empty();
                });

                before(function () {
                    var conf = {
                        container: $queryContainer,
                        autoComplete: true
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBarContainer = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBarContainer);
                    vent = queryBuilderObj._getWreqr().vent;
                });

                it('FieldName suggestions for undefined state, query: "OS"', function (done) {
                    var testString = "OS";
                    var expectedSuggestion = "OSVersion";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });

                });

                it('FieldName suggestions for undefined state with incomplete parantheses, query: "(OS"', function (done) {
                    var testString = "(OS";
                    var expectedSuggestion = "OSVersion";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('FieldValue suggestions for relationalOperator state, query: "OSVersion="', function (done) {
                    var testString = "OSVersion=";
                    var expectedSuggestion = "12.1";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('FieldValue suggestions for query: "OSVersion=12"', function (done) {
                    var testString = "OSVersion=12";
                    var expectedSuggestion = "12.1";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('FieldValue suggestions after comma, query: "OSVersion=12.2,"', function (done) {
                    var testString = "OSVersion=12.2,";
                    var expectedSuggestion = "12.1";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('Relational Operator suggestions for fieldName state, query: "OSVersion"', function (done) {
                    var testString = "OSVersion";
                    var expectedSuggestion = "=";
                    var expectedLabel = "Equal to";
                    var isSuggestionLoaded = false;
                    var isLabelLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                        isLabelLoaded = isLabelInSuggestionArray(suggestions, expectedLabel);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        assert.isTrue(isLabelLoaded, "Label must be associated to the operator");
                        done();
                    });
                });

                it('Logical Operator suggestions for query: "OSVersion=12.1 "', function (done) {
                    var testString = "OSVersion=12.1 ";
                    var expectedSuggestion = "AND";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString, keycode.SPACE);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('Logical Operator suggestions for query: "term1 "', function (done) {
                    var testString = "term1 ";
                    var expectedSuggestion = "AND";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString, keycode.SPACE);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('Logical Operator suggestions for parenTerm state, query: "(Term1) "', function (done) {
                    var testString = "(Term1) ";
                    var expectedSuggestion = "AND";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString, keycode.SPACE);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('Logical Operator suggestions for query: "OSVersion=12.1 AN"', function (done) {
                    var testString = "OSVersion=12.1 AN";
                    var expectedSuggestion = "AND";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('Logical Operator suggestions should not be displayed when state is logicalOperator and last character is space, query: "OSVersion=12.1 AND "', function (done) {
                    var testString = "OSVersion=12.1 AND ";
                    var expectedSuggestion = "AND";
                    var isLogicalOperatorSuggestion = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isLogicalOperatorSuggestion = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString, keycode.SPACE);

                    setTimeout(function () {
                        assert.isTrue(!isLogicalOperatorSuggestion, "logical operators should not be suggested for 'OSVersion=12.1 AND '");
                        done();
                    });
                });

                it('No suggestion popup immediately after close paren', function (done) {
                    var testString = "(a or b)";
                    var isSuggestionEmpty;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionEmpty = isEmptySuggestionArray(suggestions);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionEmpty, "There should be no suggestion after closing paren");
                        done();
                    });
                });

                it('No suggestion popup immediately after close paren in nested query', function (done) {
                    var testString = "((a or b)";
                    var isSuggestionEmpty;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionEmpty = isEmptySuggestionArray(suggestions);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionEmpty, "There should be no suggestion after closing paren in nested query");
                        done();
                    });
                });

                it('Logical Operator suggestions for parenTerm state, query: "((Term1) "', function (done) {
                    var testString = "((Term1) ";
                    var expectedSuggestion = "AND";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString, keycode.SPACE);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });
            });

            describe('Edit/Remove case: State based suggestions for autocomplete', function () {
                var queryBuilderObj;
                var vent;
                var $filterBarContainer;
                var typeAtCursor = function (position) {
                    var e = $.Event("keyup");
                    cursorPosition.setCursorPosition(position);
                    $filterBarContainer.trigger(e);
                };

                afterEach(function () {
                    vent.off("query.autocomplete.onSuggestionLoad");
                    $filterBarContainer.empty();
                });

                before(function () {
                    var conf = {
                        container: $queryContainer,
                        autoComplete: true
                    };
                    $.extend(conf, configurationSample.searchConfForAutoComplete);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBarContainer = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBarContainer);
                    vent = queryBuilderObj._getWreqr().vent;
                });

                it('FieldName suggestions on typing any character after logicalOperator+space, query: "OSVersion=12.1 AND D KLM"', function (done) {
                    var query = "OSVersion=12.1 AND D KLM";
                    var testString = "D";
                    var expectedSuggestion = "DEVICEFAMILY";
                    var fieldExp = "OSVersion=12.1";
                    var logicalOperator = "AND";
                    var space = " ";
                    var cursorPosition = fieldExp.length + space.length + logicalOperator.length + space.length + testString.length;
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });
                it('Logical Operator suggestions on typing any character after fieldExpression+space, query: "OSVersion=12.1  AND KLM"', function (done) {
                    var query = "OSVersion=12.1  AND KLM";
                    var testString = " ";
                    var expectedSuggestion = "AND";
                    var fieldExp = "OSVersion=12.1";
                    var cursorPosition = fieldExp.length + testString.length;
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });
                it('fieldValue suggestions on typing comma after fieldExpression, query: "OSVersion=12.2, AND KLM"', function (done) {
                    var query = "OSVersion=12.2, AND KLM";
                    var testString = ",";
                    var expectedSuggestion = "12.1";
                    var fieldExp = "OSVersion=12.2";
                    var cursorPosition = fieldExp.length + testString.length;
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('fieldValue suggestions on editing exisitng values in fieldExpression, query: "OSVersion=14,12.1 AND KLM"', function (done) {
                    var query = "OSVersion=14,12.1 AND KLM";
                    var testString = "OSVersion=14";
                    var expectedSuggestion = "14.1";
                    var incompleteFieldExp = "OSVersion=14";
                    var cursorPosition = incompleteFieldExp.length;
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });

                it('should set the selected value from the list of autosuggested values on click of the value and close the suggestion box; query: "OSVersion=12.1 AND D KLM"', function (done) {
                    var query = "OSVersion=12.1 AND D KLM";
                    var testString = "D";
                    var expectedSuggestion = "DeviceFamily";
                    var fieldExp = "OSVersion=12.1";
                    var logicalOperator = "AND";
                    var space = " ";
                    var cursorPosition = fieldExp.length + space.length + logicalOperator.length + space.length + testString.length;
                    var isSuggestionLoaded = false;
                    var $suggestionsContainer = $($filterBarContainer.data('autocomplete').suggestionsContainer);

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        var $suggestionElement = $suggestionsContainer.find('.autocomplete-suggestion').eq(0);
                        assert.equal($suggestionElement.css('display'), "block");
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 AND D KLM"); // Value before clicking on suggestion
                        $suggestionsContainer.find('.autocomplete-suggestion').eq(0).trigger('click');
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 AND DeviceFamily KLM"); // Value after clicking on suggestion
                        assert.equal($suggestionElement.css('display'), "");
                        done();
                    });
                });

                it('should replace the -key- with value selected from autosuggested so that the case is same as the suggested value; query: "OSVersion=12.1 AND d KLM"', function (done) {
                    var query = "OSVersion=12.1 AND d KLM";
                    var testString = "d";
                    var expectedSuggestion = "DeviceFamily";
                    var fieldExp = "OSVersion=12.1";
                    var logicalOperator = "AND";
                    var space = " ";
                    var cursorPosition = fieldExp.length + space.length + logicalOperator.length + space.length + testString.length;
                    var isSuggestionLoaded = false;
                    var $suggestionsContainer = $($filterBarContainer.data('autocomplete').suggestionsContainer);

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        var $suggestionElement = $suggestionsContainer.find('.autocomplete-suggestion').eq(0);
                        assert.equal($suggestionElement.css('display'), "block");
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 AND d KLM"); // Value before clicking on suggestion
                        $suggestionsContainer.find('.autocomplete-suggestion').eq(0).trigger('click');
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 AND DeviceFamily KLM"); // Value after clicking on suggestion
                        assert.equal($suggestionElement.css('display'), "");
                        done();
                    });
                });

                it('should replace the -logical operator- with value selected from autosuggested so that the case is same as the suggested value; query: "OSVersion=12.1 a KLM"', function (done) {
                    var query = "OSVersion=12.1 a KLM";
                    var testString = "a";
                    var expectedSuggestion = "AND";
                    var fieldExp = "OSVersion=12.1";
                    var space = " ";
                    var cursorPosition = fieldExp.length + space.length + testString.length;
                    var isSuggestionLoaded = false;
                    var $suggestionsContainer = $($filterBarContainer.data('autocomplete').suggestionsContainer);

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        var $suggestionElement = $suggestionsContainer.find('.autocomplete-suggestion').eq(0);
                        assert.equal($suggestionElement.css('display'), "block");
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 a KLM"); // Value before clicking on suggestion
                        $suggestionsContainer.find('.autocomplete-suggestion').eq(0).trigger('click');
                        assert.equal($filterBarContainer.html(), "OSVersion=12.1 AND KLM"); // Value after clicking on suggestion
                        done();
                    });
                });

                it('should close the auto suggestion box on hitting escape key', function (done) {
                    var query = "OSVersion=12.1 AND D KLM";
                    var testString = "D";
                    var expectedSuggestion = "DeviceFamily";
                    var fieldExp = "OSVersion=12.1";
                    var logicalOperator = "AND";
                    var space = " ";
                    var cursorPosition = fieldExp.length + space.length + logicalOperator.length + space.length + testString.length;
                    var isSuggestionLoaded = false;
                    var $suggestionsContainer = $($filterBarContainer.data('autocomplete').suggestionsContainer);

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, query);
                    typeAtCursor(cursorPosition);
                    setTimeout(function () {
                        var _evt = $.Event("keyup", { which: keycode.ESCAPE, keycode: keycode.ESCAPE });
                        var $suggestionElement = $suggestionsContainer.find('.autocomplete-suggestion').eq(0);
                        assert.equal($suggestionElement.css('display'), "block");
                        $filterBarContainer.trigger(_evt);
                        assert.equal($suggestionElement.css('display'), "");
                        done();
                    });
                });
            });

            describe('autoComplete - With Ajax to show suggestions for fieldValue', function () {
                var queryBuilderObj;
                var vent;
                var $filterBarContainer;
                var getRemoteValue = function (query, showSuggestion) {
                    $.ajax({
                        url: '/api/queryBuilder/getTestRemoteData',
                        type: "GET",
                        data: {query: query},
                        success: function (response) {
                            showSuggestion(response);
                        }
                    });
                };

                afterEach(function () {
                    vent.off("query.autocomplete.onSuggestionLoad");
                    $filterBarContainer.empty();
                });

                before(function () {
                    var conf = {
                        container: $queryContainer,
                        autoComplete: true
                    };
                    var searchConf = configurationSample.searchConfForAutoComplete;
                    var fieldKey = {
                        'DeviceType': {
                            'label': 'DeviceType',
                            'operators': ['=', '!=', '<', '>', '<=', '>='],
                            'remoteValue': getRemoteValue
                        }
                    };
                    $.extend(searchConf.filterMenu, fieldKey);
                    $.extend(conf, searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBarContainer = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBarContainer);
                    vent = queryBuilderObj._getWreqr().vent;
                });

                it('FieldValue suggestions should be loaded from remoteValue callback if defined', function (done) {
                    var testString = "DeviceType=";
                    var expectedSuggestion = "1.2";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    }, 2000);
                });
            });

            describe('autoCompleteomplete - With callback to show suggestions for fieldValue', function () {
                var queryBuilderObj;
                var vent;
                var $filterBarContainer;
                var callbackTriggered = 0;
                var getRemoteValue = function (query, showSuggestion) {
                    callbackTriggered++;
                    var suggestions = [
                        {"value": "1.1"},
                        {"value": "1.2"},
                        {"value": "1.3"},
                        {"value": "1.4"},
                        {"value": "1.5"}
                    ];

                    var result = {
                        suggestions: suggestions
                    };

                    showSuggestion(result);
                };

                afterEach(function () {
                    vent.off("query.autocomplete.onSuggestionLoad");
                    $filterBarContainer.empty();
                });

                after(function () {
                    queryBuilderObj.destroy();
                });

                before(function () {
                    var conf = {
                        container: $queryContainer,
                        autoComplete: true
                    };
                    var searchConf = configurationSample.searchConfForAutoComplete;
                    var fieldKey = {
                        'ABC': {
                            'label': 'ABC',
                            'operators': ['=', '!=', '<', '>', '<=', '>='],
                            'remoteValue': getRemoteValue
                        }
                    };
                    $.extend(searchConf.filterMenu, fieldKey);
                    $.extend(conf, searchConf);
                    queryBuilderObj = new queryBuilderWidget(conf);
                    queryBuilderObj.build();
                    $filterBarContainer = $queryContainer.find('#filterBar');
                    cursorPosition = new CursorPosition($filterBarContainer);
                    vent = queryBuilderObj._getWreqr().vent;
                });

                it('remoteValue callback is triggered', function () {
                    var testString = "ABC=";
                    triggerKeyup($filterBarContainer, testString);
                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        assert.isTrue(callbackTriggered == 1, 'remoteValue callback should be triggered');
                    });
                });

                it('FieldValue suggestions should be loaded from remoteValue callback if defined', function (done) {
                    var testString = "ABC=";
                    var expectedSuggestion = "1.2";
                    var isSuggestionLoaded = false;

                    vent.on("query.autocomplete.onSuggestionLoad", function (suggestions) {
                        isSuggestionLoaded = isSuggestionInArray(suggestions, expectedSuggestion);
                    });

                    triggerKeyup($filterBarContainer, testString);

                    setTimeout(function () {
                        assert.isTrue(isSuggestionLoaded, errorMessage(expectedSuggestion, testString));
                        done();
                    });
                });
            });
        });

        describe('Drag Drop - Unit tests:', function () {
            var queryBuilderObj,
                $filterBar;

            var dropOnFilter = function(){
                console.log("drop on filter");
            };

            var dragOverFilter = function(){
                console.log("drag on filter");
            };

            before(function () {
                var conf = {
                    container: $queryContainer,
                    "dragNDrop": {
                        "drop": dropOnFilter,
                        "over": dragOverFilter
                    }
                };
                $.extend(conf, configurationSample.searchConf);
                queryBuilderObj = new queryBuilderWidget(conf);
                queryBuilderObj.build();
                $filterBar = $queryContainer.find("#filterBar");
            });

            after(function () {
                queryBuilderObj.destroy();
            });

            it('Filter container should be droppable', function () {
                assert.isTrue($filterBar.hasClass("ui-droppable"), "Filter bar should have jquery class");
            });
        });

        //TODO: Complete the test cases for copy+paste. There seems to be an issue in using document.execCommand() and Clipboard
        // from within Phantom.

        // describe('Copy and Paste - Unit tests:', function () {
        //     function addToClipboardAndPaste(queryToPaste, cursorPosition) {

        //         // TODO: Figure out the approach to trigger ClipboardEvent with clipboardData not null

        //         // // Create the textarea input to hold  queryToPaste
        //         // var _element = document.createElement('textarea');
        //         // _element.value = queryToPaste;
        //         // // Add it to the document so that it can be focused.
        //         // document.body.appendChild(_element);
        //         // // Focus on the element so that it can be copied.
        //         // _element.focus();
        //         // _element.setSelectionRange(0, _element.value.length);
        //         // // Execute the copy command.
        //         // document.execCommand('copy');
        //         // // Remove the element to keep the document clear.
        //         // document.body.removeChild(_element);

        //         // typeAtCursor(cursorPosition);

        //         // var pasteEvent = new ClipboardEvent('paste');
        //         // // document.execCommand('paste');
        //     }

        //     var typeAtCursor = function (position) {
        //         var e = $.Event("keyup");
        //         cursorPosition.setCursorPosition(position);
        //         $filterBarContainer.trigger(e);
        //     };

        //     before(function () {
        //         var conf = {
        //             container: $queryContainer,
        //             autoComplete: true
        //         };
        //         $.extend(conf, configurationSample.searchConfForAutoComplete);
        //         queryBuilderObj = new queryBuilderWidget(conf);
        //         queryBuilderObj.build();
        //         $filterBarContainer = $queryContainer.find('#filterBar');
        //         cursorPosition = new CursorPosition($filterBarContainer);
        //         vent = queryBuilderObj._getWreqr().vent;


        //         $filterBarContainer[ 0 ].addEventListener('paste', function (e) {
        //             console.log(e);
        //         });
        //     });
        //     afterEach(function () {
        //         $filterBarContainer.empty();
        //     });
        //     it('should copy query from the filterbar as plaintext', function () {
        //         var testString = 'osversion=1 or1 name=2';
        //         triggerKeyup($filterBarContainer, testString);

        //         // var evt = $.Event("keyup");
        //         // evt.which = evt.keyCode = 67;
        //         // evt.ctrlKey = evt.metaKey = true;
        //         // $filterBarContainer.trigger(evt);

        //         var selection = window.getSelection();
        //         selection.removeAllRanges();
        //         var range = document.createRange();
        //         range.selectNodeContents($filterBarContainer[ 0 ]);
        //         selection.addRange(range);

        //         // $filterBarContainer[0].select();
        //         document.execCommand('copy');

        //         // var clip = new window.ClipboardEvent('copy',null ,$filterBarContainer.eq(0));
        //         // $filterBarContainer[0].dispatchEvent(clip);
        //         // // var clipboardText = clip.clipboardData.getData('text/plain');


        //         // TODO: Write assertions once Copy and Paste in Mocha are working

        //     });
        //     it('should paste query from clipboard when the filterbar is empty', function () {
        //         var queryToPaste = "OSVersion=12.1 AND DeviceFamily=SRX",
        //             query = "",
        //             cursorPosition = query.length;

        //         triggerKeyup($filterBarContainer, query);
        //         addToClipboardAndPaste(queryToPaste, cursorPosition);

        //         // TODO: Write assertions once Copy and Paste in Mocha are working

        //     });

        //     it('should paste query from clipboard in the beginning of an existing query in the filter bar', function (done) {
        //         var queryToPaste = "AND ConnectionStatus=Up",
        //             queryPart1 = "OSVersion=12.1",
        //             queryPart2 = "DeviceFamily=SRX",
        //             space = " ",
        //             query = queryPart1 + space + queryPart2,
        //             cursorPosition = 0;

        //         triggerKeyup($filterBarContainer, query);
        //         addToClipboardAndPaste(queryToPaste, cursorPosition);

        //         // TODO: Write assertions once Copy and Paste in Mocha are working

        //     });

        //     it('should paste query from clipboard in the end of an existing query in the filter bar', function (done) {
        //         var queryToPaste = "AND ConnectionStatus=Up",
        //             queryPart1 = "OSVersion=12.1",
        //             queryPart2 = "DeviceFamily=SRX",
        //             space = " ",
        //             query = queryPart1 + space + queryPart2,
        //             cursorPosition = query.length;

        //         triggerKeyup($filterBarContainer, query);
        //         addToClipboardAndPaste(queryToPaste, cursorPosition);

        //         // TODO: Write assertions once Copy and Paste in Mocha are working

        //     });

        //     it('should paste query from clipboard in the given cursor position of within an existing query in the filter bar', function (done) {
        //         var queryToPaste = "AND ConnectionStatus=Up",
        //             queryPart1 = "OSVersion=12.1",
        //             queryPart2 = "DeviceFamily=SRX",
        //             space = " ",
        //             query = queryPart1 + space + queryPart2,
        //             cursorPosition = queryPart1.length;

        //         triggerKeyup($filterBarContainer, query);
        //         addToClipboardAndPaste(queryToPaste, cursorPosition);

        //         // TODO: Write assertions once Copy and Paste in Mocha are working

        //     });
        // });
    });
});
