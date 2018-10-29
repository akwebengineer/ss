/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleSpace',
    'widgets/grid/tests/models/spaceModel'
], function (Backbone, GridWidget, configurationSample, SpaceModel) {
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.servicesCollection = new SpaceModel.services.collection();

            this.actionEvents = {
                createEvent: "AddRow",
                updateEvent: "UpdateRow",
                deleteEvent: "DeleteRow",
                copyEvent: "CopyRow",
                pasteEvent: "PasteRow",
                statusEvent: "UpdateStatusRow",
                getAllRowsEvent: "GetAllRows",
                getSelectedRowsEvent: "GetSelectedRows",
                toggleAllSelectedRowsEvent: "GetAllRows",
                toggleRowsEvent: "ToggleRows",
                reloadGridEvent: "ReloadGrid",
                reloadGridEvent20: "ReloadGrid20",
                clearAllEvent: "ClearAll",
                resetReloadGrid: "resetReloadGrid"
            };
            this.bindGridEvents();
            this.getAllRowIds();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.collectionSimpleGrid,
                actionEvents: this.actionEvents
            });
            this.gridWidget.build();

            return this;
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
                .bind(this.actionEvents.copyEvent, function (e, copiedGridRows) {
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent, function (e, pastedGridRow) {
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.getAllRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    self.selectedRowIds = self.gridWidget.getSelectedRows(true).allRowIds;
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.toggleAllSelectedRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    self.gridWidget.toggleRowSelection(self.selectedRowIds);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.toggleRowsEvent, function (e, selectedRows) {
                    console.log(selectedRows);
                    var toggleRowIds = ["163847", "163877", "163879", "327955", "327960", "557410"];
                    console.log(self.actionEvents.toggleRowsEvent + ": " + toggleRowIds);
//                    self.gridWidget.toggleRowSelection(toggleRowIds, 'selected');
                    self.gridWidget.toggleRowSelection(toggleRowIds);
//                    self.gridWidget.toggleRowSelection(self.allRowIds);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.reloadGridEvent, function (e) {
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.reloadGridEvent20, function (e) {
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid({
                        "numberOfRows": 20
                    });
                })
                .bind(this.actionEvents.clearAllEvent, function (e, previousSelectedRows) {
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.resetReloadGrid, function (e, selectedRows) {
                    console.log(self.actionEvents.resetReloadGrid + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        resetSelection: true
                    });
                    console.log("rows selected after reset selection:")
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind("gridLoaded", function (e, selectedRows) {
                    self.addPages([1]); //load first page
                })
                .bind("gridOnPageRequest", function (e, pageRequest) {
                    self.addPages(pageRequest.pages); //load the rest of the pages on demand
                });
        },

        addPages: function (pages) {
            var self = this,
                numberOfRows = configurationSample.collectionSimpleGrid.numberOfRows,
            spliceCollection = function (records, numberOfRows) {
                var collectionArray = [];
                for (var i=0; i<records.length/numberOfRows; i++) {
                    collectionArray.push(records.splice(i*numberOfRows, (i+1)*numberOfRows))
                }
                if (records.length) {
                    collectionArray.push(records);
                }
                return collectionArray;
            };
            this.servicesCollection.fetch({
                pages: pages,
                pageSize: numberOfRows,
                success: function (collection) {
                    var services = collection.models[0].get("services");
                    if (services) {
                        var records = services.service,
                            totalRecords = services.total,
                            totalPages = Math.ceil(totalRecords / numberOfRows),
                            pageRecords = spliceCollection(records, numberOfRows);
                        for (var i = 0; i < pageRecords.length; i++) {
                            var pageRecord = pageRecords[i];
                            self.gridWidget.addPageRows(pageRecord, {
                                numberOfPage: pages[i],
                                totalPages: totalPages,
                                totalRecords: totalRecords
                            });
                        }
                    }
                },
                failure: function () {
                    console.log("The grid data couldn't be loaded.");
                }
            });
        },

        getAllRowIds: function () {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/allSDServicesIds.json',
                success: function (data) {
                    self.allRowIds = data;
                },
                error: function () {
                    console.log("Getting all row ids in the grid FAILED.");
                }
            });
        }

    });

    return GridView;
});