/**
 * A view that uses a configuration object to render a grid widget for the tree view with pagination and using collection
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/models/zonePoliciesTreeModel'
], function (Backbone, GridWidget, configurationSample, TreePoliciesModel) {
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.initializeModel();
            this.actionEvents = {
                updateEvent: "UpdateRow",
                deleteEvent: "DeleteRow",
                createEvent: "AddFirewallPolicies",
                selectRowEvent: "selectRowEvent",
                getAllRowsEvent: "GetAllRows",
                getSelectedRowsEvent: "GetSelectedRows",
                quickViewEvent: "QuickViewRow",
                clearAllEvent: "ClearAll"
            };
            this.bindGridEvents();
            this.render();
        },

        initializeModel: function () {
            var self = this;
            this.policyCollection = {};
            [1, 2, 3].forEach(function (value) {
                var id = "page" + value;
                self.policyCollection[id] = new TreePoliciesModel[id]()
            });
            [1, 2, 4, 11, 15, 25, 55].forEach(function (value) {
                var id = "node" + value;
                self.policyCollection[id] = new TreePoliciesModel[id]()
            });
        },

        render: function () {
            var self = this;
            configurationSample.treeGridMV.tree.getChildren = function (node, addChildren) {
                var data = 'expanded=' + node.expanded + '&nodeid=' + node.nodeId + '&parentid=' + node.parentId + '&n_level=' + node.n_level;
                var nodeCollectionId = "node" + node.nodeId;
                self.policyCollection[nodeCollectionId].fetch({
                    success: function (collection) {
                        var data = collection.models[0].attributes;
                        addChildren(node.nodeId, data.ruleCollection.rules);
                    },
                    failure: function () {
                        console.log("The row data couldn't be loaded.");
                    }
                });
            };

            // updateConfiguration();

            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.treeGridMV,
                actionEvents: this.actionEvents
            });
            this.gridWidget.build();
            return this;
        },

        updateConfiguration: function(){
            // getPageData callback can be used to replace gridLoaded.
            configurationSample.treeGridMV.getPageData = function(renderGridPage, page, searchTokens, pageSize){
                self.policyCollection.page1.fetch({
                    success: function (collection) {
                        var policies = collection.models[0].get("ruleCollection");
                        if (policies) {
                            var rules = policies.rules,
                                totalRecords = policies.total || policies.length;
                            self.gridWidget.addPageRows(rules, {
                                numberOfPage: 1,
                                totalPages: 1,
                                totalRecords: totalRecords
                            });
                        }
                    },
                    failure: function () {
                        console.log("The grid data couldn't be loaded.");
                    }
                });
            };
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function (e, addGridRow) {
                    console.log(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function (e, deletedGridRows) {
                    console.log(deletedGridRows);
                })
                .bind("gridOnRowSelection", function (e, selectedRows) {
//                    console.log("gridOnRowSelection: ");
//                    console.log(selectedRows);
                })
                .bind("gridLoaded", function (e, status) {
                    //without pagination and backward compatible
                    //Alternative: use getPageData callback to replace binding with gridLoaded event. Uncomment ln62 to see the usage.
                    self.policyCollection.page1.fetch({
                        success: function (collection) {
                            var policies = collection.models[0].get("ruleCollection");
                            if (policies) {
                                var rules = policies.rules,
                                    totalRecords = policies.total || policies.length;
                                self.gridWidget.addPageRows(rules, {
                                    numberOfPage: 1,
                                    totalPages: 1,
                                    totalRecords: totalRecords
                                });
                            }
                        },
                        failure: function () {
                            console.log("The grid data couldn't be loaded.");
                        }
                    });
                })
                .bind(this.actionEvents.getAllRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.clearAllEvent, function (e, previousSelectedRows) {
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.selectRowEvent, function (e, selectedRows) {
                    console.log(selectedRows);
                    self.gridWidget.toggleRowSelection("25");
//                    self.gridWidget.toggleRowSelection("25", "selected");
//                    self.gridWidget.toggleRowSelection("25", "unselected");
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.reloadGridEvent, function (e) {
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                });
        }

    });

    return GridView;
});