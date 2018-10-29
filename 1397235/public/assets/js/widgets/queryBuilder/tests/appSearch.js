/**
 * A view that uses the QueryBuilder Widget to generate a Search field view.
 * configuration object includes the terms to validate the keys against
 *
 * @module  QueryBuilder View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/queryBuilder/queryBuilderWidget',
    'widgets/queryBuilder/conf/configurationSample',
    'text!widgets/queryBuilder/tests/templates/searchExample.html',
    'lib/template_renderer/template_renderer',
    'widgets/queryBuilder/tests/model/remoteData',
    'widgets/queryBuilder/tests/appDragDrop'
], function (Backbone, QueryBuilderWidget, configurationSample, example, render_template, sampleData, DragDrop) {

    var ExpressionView = Backbone.View.extend({

        events: {
            'click #clearQuery': 'clearQuery',
            'click #getQuery': 'getQuery',
            'click #getAST': 'getAST',
            'click #getTerm': 'getTerm',
            'click #addQuery': 'addQuery',
            'click #updateTerm': 'updateTerm',
            'click #validateQuery': 'validateQuery'
        },

        initialize: function () {
            this.addContent(this.$el, example);
            this.getElements(this.$el.find("#queryBuilder-widget-test"));
            !this.options.pluginView && this.render();
        },

        render: function () {

            this.queryBuilderProgrammatic(); // example to showcase all the interface methods

            this.queryBuilderWithSimpleAutoComplete(); // example for autoComplete with local data

            this.queryBuilderWithAjaxAutoComplete(); // example for autoComplete with lookup callback and uses ajax to load data.

            this.queryBuilderDragDrop(); // example to showcase dragdrop in the filterBar

        },

        // example to showcase all the interface methods
        queryBuilderProgrammatic: function () {
            var $queryContainer = this.$queryTestPage.find("#queryContainer");

            var conf = {
                "container": $queryContainer,
                "dragNDrop": {
                    "drop": this.dropOnFilter,
                    "over": this.dragOverFilter
                }
                // , autoComplete: true // Keeping commented so as to show just the query formatting example
            };
            $.extend(conf, configurationSample.searchConf);
            this.queryBuilderWidget = new QueryBuilderWidget(conf);
            this.queryBuilderWidget.build();

            this.$filterBar = $queryContainer.find("#filterBar");

            this.registerEvents();
        },

        // example for autoComplete with local data
        queryBuilderWithSimpleAutoComplete: function () {
            var $queryContainer = this.$el.find('#queryBuilderContainer_autoComplete_local');
            var conf = {
                container: $queryContainer,
                autoComplete: true,
                events: {
                    "query.executeQuery": {
                        "handler": [function (e, queryObj) {
                            console.log("--- Query Executed ---");
                            //console.log(JSON.stringify(queryObj.model, null, 2));
                        }]
                    },
                    "query.valid": {
                        "handler": [function (e, queryObj) {
                            //console.log(JSON.stringify(queryObj.model, null, 2));
                        }]
                    },
                    "query.emptyQuery": {
                        "handler": [function (e) {
                            console.log("--- Empty Query ---");
                        }]
                    }
                }
            };
            $.extend(conf, configurationSample.searchConfForAutoComplete);
            var queryBuilderWidget = new QueryBuilderWidget(conf);
            queryBuilderWidget.build();
        },

        // example for autoComplete with lookup callback and uses ajax to load data.
        queryBuilderWithAjaxAutoComplete: function () {
            // Start listenning for '/api/queryBuilder/getRemoteData'
            sampleData.remoteCall();

            var $queryContainer = this.$el.find('#queryBuilderContainer_autoComplete_ajax');
            var conf = {
                container: $queryContainer,
                autoComplete: {"width": 400} // showing customizable width example
            };

            $.extend(conf, configurationSample.searchConfForAutoCompleteAjax);
            var queryBuilderWidget = new QueryBuilderWidget(conf);
            queryBuilderWidget.build();
        },

        // example to showcase dragdrop in the filterBar.
        queryBuilderDragDrop: function () {
            new DragDrop({
                el: this.$queryTestPage.find("#example_dragDrop")
            });

        },

        clearQuery: function () {
            this.queryBuilderWidget.clear();
        },

        getQuery: function () {
            var query = this.queryBuilderWidget.getQuery();
            this.$getQueryResult.text(query);
        },

        getAST: function () {
            this.$getASTResult.text("");
            try {
                var node = this.queryBuilderWidget.getAST(this.$getASTField.val());
                this.$getASTResult.text(JSON.stringify(node));
            } catch (e) {
                this.$getASTResult.text("Not Found");
            }
        },

        getTerm: function () {
            this.$getTermResult.text("");
            try {
                var node = this.queryBuilderWidget.getTerm(this.$getTermField.val());
                this.$getTermResult.text(node.length + "-- " + JSON.stringify(node));
            } catch (e) {
                this.$getTermResult.text("Not Found");
            }
        },

        addQuery: function () {
            this.$addQueryResult.text("");

            var addObject = {
                "logicalOperator": this.$addQueryLogicalOperator.val(),  //by default "AND" is the logical operator
                "query": this.$addQueryField.val()  // eg: - "anyValidQuery and query1 or query2 or osversion=srx"
            };

            try {
                this.queryBuilderWidget.add(addObject);
                this.$addQueryResult.text("Query Added");
            } catch (e) {
                this.$addQueryResult.text(e.message);
            }
        },

        updateTerm: function () {
            // var updateObject = {  //field term example
            //     // "fieldGroupID":"groupID",
            //     "term": {
            //         "id" : "someID",
            //         // "key": "name",
            //         // "operator": "=",
            //         "value": "test"
            //     }
            // };
            this.$updateTermResult.text("");
            var updateObject = {
                term: JSON.parse(this.$updateTermField.val())
            };

            try {
                this.queryBuilderWidget.update(updateObject);
            } catch (e) {
                this.$updateTermResult.text("Incomplete update details");
            }
        },

        validateQuery: function () {
            var self = this;
            this.$getValidateResult.text(" ");
            var searchString = this.$filterBar.text().trim();
            var resultObj = this.queryBuilderWidget.validate();
            this.$getValidateResult.text(resultObj.state);
        },

        getElements: function () {
            this.$queryTestPage = this.$el.find("#queryBuilder-widget-test");

            var $testButtonsContainer = this.$queryTestPage.find("#test_buttons");
            this.$getQueryResult = $testButtonsContainer.find("#getQueryResult");
            this.$getValidateResult = $testButtonsContainer.find("#getValidateResult");

            this.$getASTField = $testButtonsContainer.find("#getASTField");
            this.$getASTResult = $testButtonsContainer.find("#getASTResult");

            this.$getTermField = $testButtonsContainer.find("#getTermField");
            this.$getTermResult = $testButtonsContainer.find("#getTermResult");

            this.$addQueryLogicalOperator = $testButtonsContainer.find("#addQueryLogicalOperator");
            this.$addQueryField = $testButtonsContainer.find("#addQueryField");
            this.$addQueryResult = $testButtonsContainer.find("#addQueryResult");

            this.$updateTermField = $testButtonsContainer.find("#updateTermField");
            this.$updateTermResult = $testButtonsContainer.find("#updateTermResult");

            this.$removeTermField = $testButtonsContainer.find("#removeTermField");
            this.$removeTermResult = $testButtonsContainer.find("#removeTermResult");
        },

        registerEvents: function () {
            var self = this;

            this.queryBuilderWidget.bindEvents({
                "query.executeQuery": {
                    "handler": [function (e, queryObj) {
                        console.log("--- Query Executed ---");
                        self.showModel(queryObj);
                    }]
                },
                "query.valid": {
                    "handler": [function (e, queryObj) {
                        self.showModel(queryObj);
                    }]
                },
                "query.invalid": {
                    "handler": [function (e, queryObj) {
                        self.showModel(queryObj);
                    }]
                },
                "query.emptyQuery": {
                    "handler": [function (e, queryObj) {
                        console.log("--- Empty Query ---");
                    }]
                }
                /* "query.message": {
                 "handler": [function (e, message) {
                 console.log("--- Inside message ---" + message);
                 }]
                 }*/
            });
        },

        showModel: function (queryObj) {
            if (queryObj.state == "valid") {
                 // console.log("valid query:: "+JSON.stringify(queryObj.model, null, 2));
            } else {
                 // console.log("invalid query:: "+ JSON.stringify(queryObj.model, null, 2));
            }
        },

        addContent: function ($container, template) {
            $container.append((render_template(template)));
        }

    });

    return ExpressionView;
});
