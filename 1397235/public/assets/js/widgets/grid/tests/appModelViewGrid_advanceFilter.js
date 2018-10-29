/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/sourceAddressView',
    'widgets/grid/tests/view/descriptionView',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/deletePolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function (Backbone, GridWidget, configurationSample, SourceAddressView, DescriptionView, ZonePoliciesAddView, ZonePoliciesDeleteView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, mockjax) {
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.policyCollection = {
                page1:  new ZonePoliciesModel.policy.collection(),
                page2:  new ZonePoliciesModel.policy.collection1()
            };
            this.filteredPolicyCollection = {
                page1:  new ZonePoliciesModel.filteredPolicy.collection(),
                page2:  new ZonePoliciesModel.filteredPolicy.collection1()
            };
            this.sortedPolicyCollection = new ZonePoliciesModel.sortedPolicy.collection();
            this.addressCollection = new ZonePoliciesModel.address.collection();

            this.actionEvents = {
                createEvent: "AddRow",
                updateEvent: "UpdateRow",
                deleteEvent: "DeleteRow",
                copyEvent: "CopyRow",
                pasteEvent: "PasteRow",
                statusEvent: "UpdateStatusRow",
                reloadData: "ReloadData",
                updateActionStatusOff: "updateActionStatusOff",
                updateActionStatusOn: "updateActionStatusOn",
                addEditProgrammatically: "EditProgrammatically",
                removeEditProgrammatically: "RemoveEditProgrammatically",
                testPublishHover: "testPublishHover",
                // testPreference: "testPreference",
                testCloneHover: {
                    capabilities: ['ModifyPolicy'],
                    name: "testCloneHover"
                },
                editOnRowHover: "editOnRowHover",
                testPublishHover: "testPublishHover",
                deleteOnRowHover: {
                    capabilities: ['ExportPolicy'],
                    name: "deleteOnRowHover"
                },
                testInfoHover: "testInfoHover",
                toggleRowSelection: "ToggleRowSelection"
            };
            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
            this.render();
        },

        render: function () {
            var self = this;
            _.extend(configurationSample.modelViewGrid_queryBuilder.filter, {
                searchResult: function (tokens, renderGridData) {
                    var searchCollection = _.isEmpty(tokens) ? self.policyCollection : self.filteredPolicyCollection;
                    searchCollection.page1.fetch({
                        success: function (collection) {
                            var policies = collection.models[0].get("policy");
                            renderGridData(policies, {
                                numberOfPage: 1,
                                totalPages: 2
                            });
                        },
                        failure: function () {
                            console.log("The grid data couldn't be loaded.");
                        }
                    });
                }
            });

            _.extend(configurationSample.modelViewGrid_queryBuilder, {
                "deleteRow": self.deleteRow,
                "customSortCallback": function (columnIndex, columnName, sortOrder, tokens) {
                    console.log('Sorting grid in ' + sortOrder + ' order on ' + columnName);
                    var policies;
                    if (sortOrder === 'asc') {
                        self.sortedPolicyCollection.fetch({
                            success: function (collection) {
                                policies = collection.models[0].get("policy");
                                self.addSortedGridData(policies);
                            },
                            failure: function () {
                                console.log("The grid data couldn't be loaded.");
                            }
                        });
                    }
                    else {
                        self.policyCollection.page1.fetch({
                            success: function (collection) {
                                var policies = collection.models[0].get("policy");
                                self.addSortedGridData(policies);
                            },
                            failure: function () {
                                console.log("The grid data couldn't be loaded.");
                            }
                        });
                    }
                },
                "footer": {
                    getTotalRows: function () {
                        var tokens = self.gridWidget.getSearchTokens();
                        var collection = _.isEmpty(tokens) ? self.policyCollection.page1 : self.filteredPolicyCollection.page1;
                        if (collection.models.length > 0) {
                            var policies = collection.models[0].get("policy"),
                                totalRecords = policies && policies[0] && policies[0]['junos:total'] || policies.length;
                            return totalRecords;
                        }
                        return 0;
                    }
                }
            });

            this.search = "DestinationAddress >= 3 AND product OR name = test";

            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.modelViewGrid_queryBuilder,
                // search: this.search,
                actionEvents: this.actionEvents,
                cellOverlayViews: this.cellOverlayViews,
            });
            this.gridWidget.build();

            //retrieves the tokens set in the grid configuration or retrieved by user preferences
            this.getTokens();

            return this;
        },

        getTokens: function () {
            var configurationTokens = this.gridWidget.getSearchTokens();
            this.gridWidget.search(configurationTokens); // explicit call to grid to start the search with the defined tokens
            console.log("***Search triggered with*** " + configurationTokens);
        },

        createViews: function () { //should implement setCellValues
            var self = this;
            var sourceAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.saveOverlay, self),
                'close': _.bind(self.close, self),
                'columnName': 'source-address'
            });
            var destinationAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.saveOverlay, self),
                'close': _.bind(self.close, self),
                'columnName': 'destination-address'
            });
            var descriptionView = new DescriptionView({
                'save': _.bind(self.saveOverlay, self),
                'close': _.bind(self.close, self),
                'columnName': 'description'
            });
            var cellViews = {
                'source-address': sourceAddressView,
                'destination-address': destinationAddressView,
                'description': descriptionView
            };
            return cellViews;
        },

        addGridData: function (pageRequest) {
            var self = this,
                tokens = this.gridWidget.getSearchTokens();
            var pageCollection = tokens && tokens.length ? self.filteredPolicyCollection : self.policyCollection;
            pageCollection["page" + pageRequest].fetch({
                success: function (collection) {
                    var policies = collection.models[0].get("policy"),
                        totalRecords = policies && policies[0] && policies[0]['junos:total'] || policies.length;
                    self.gridWidget.addPageRows(policies, {
                        numberOfPage: pageRequest,
                        totalPages: 2,
                        totalRecords: totalRecords
                    });
                },
                failure: function () {
                    console.log("The grid data couldn't be loaded.");
                }
            });
        },

        addSortedGridData: function (data) {
            var self = this;
            self.gridWidget.reloadGridData(data, '', true);
        },

        deleteRow: function (selectedRows, deleteRow, reloadGrid) {
            new ZonePoliciesDeleteView({
                "selectedRows": selectedRows,
                "deleteRow": deleteRow,
                "reloadGrid": reloadGrid
            });
            console.log(selectedRows);
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function (e, addGridRow) {
                    console.log(addGridRow);
//                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
//                    self.updateRow(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function (e, deletedGridRows) {
                    console.log(deletedGridRows);
                })
                .bind(this.actionEvents.copyEvent, function (e, copiedGridRows) {
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent, function (e, pastedGridRow) {
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.addEditProgrammatically, function (e, selectedRow) {
                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
                    self.gridWidget.addEditModeOnRow(rows[0]);
                })
                .bind(this.actionEvents.removeEditProgrammatically, function (e, selectedRow) {
                    console.log(selectedRow);
//                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
                    var removeEditOutput = self.gridWidget.removeEditModeOnRow(); //no id is required
                    console.log(removeEditOutput);
                })
                .bind(this.actionEvents.updateActionStatusOff, function (e, selectedRows) {
                    self.gridWidget.updateActionStatus({
                        "create": false,
                        "testCloseGrid": true
                    });
                })
                .bind(this.actionEvents.updateActionStatusOn, function (e, selectedRows) {
                    self.gridWidget.updateActionStatus({
                        "create": true,
                        "testCloseGrid": false
                    });
                })
                .bind(this.actionEvents.reloadData, function (e, selectedRows) {
                    console.log(self.actionEvents.reloadData + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGridData(self.policyCollection.page1.models[0].get("policy"), {
                        numberOfPage: 1,
                        totalPages: 2
                    });
                })
                .bind(this.actionEvents.toggleRowSelection, function (e, selectedRows) {
                    var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
                    console.log(self.actionEvents.toggleRowSelection + "for: " + rows);
                    console.log(self.gridWidget.getSelectedRows());
                    self.gridWidget.toggleRowSelection(rows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind("gridRowOnEditMode", function (e, editModeRow) {
                    console.log(editModeRow);
                })
                .bind("gridOnPageRequest", function (e, pageRequest) {
                    console.log(pageRequest);
                    self.addGridData(pageRequest.pageRequest);
                    return false;
                })
                .bind(this.actionEvents.editOnRowHover, function (e, selectedRows) {
                    console.log("editOnRowHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.deleteOnRowHover.name, function (e, selectedRows) {
                    console.log("deleteOnRowHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.testPublishHover, function (e, selectedRows) {
                    console.log("testPublishHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.testCloneHover.name, function (e, selectedRows) {
                    console.log("Test Clone on Row Hover in the Grid");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getGridHeaderLayout());
                })
                // .bind(this.actionEvents.testPreference, function (e, selectedRows) {
                //     console.log("Test Preference for the queryBuilder with collections type of grid");
                //     new GridOverlayView({search:self.updatedConfiguration.search});
                // })
                .bind("gridLoaded", function (e, status) {
                    self.addGridData(1);
                });
        },

        addRow: function (addGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        updateRow: function (updateGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(updateGridRow.originalRow),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.update, self)
            });
            self.originalRow = updateGridRow.originalRow;
        },

        save: function (data) {
            this.gridWidget.addRow(data);
//            this.gridWidget.reloadGrid();
            console.log("Row added. Number of rows now: " + this.gridWidget.getNumberOfRows());
        },

        update: function (updatedRow) {
            this.gridWidget.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        },

        saveOverlay: function (columnName, data) {
            this.$el.trigger('updateCellOverlayView', {
                'columnName': columnName,
                'cellData': data
            });
        },

        close: function (columnName, e) {
            this.$el.trigger('closeCellOverlayView', columnName);
            e.preventDefault();
        }

    });

    return GridView;
});