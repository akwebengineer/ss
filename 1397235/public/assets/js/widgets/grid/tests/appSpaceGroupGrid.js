/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'mockjax'
], function (Backbone, GridWidget, configurationSample, mockjax) {
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.actionEvents = {
                createEvent: "AddRow",
                updateEvent: "UpdateRow",
                deleteEvent: "DeleteRow",
                copyEvent: "CopyRow",
                pasteEvent: "PasteRow",
                statusEvent: "UpdateStatusRow",
                getAllRowsEvent: "GetAllRows",
                getSelectedRowsEvent: "GetSelectedRows",
                deleteRows: "deleteRows",
                deleteRowsWithoutReset: "deleteRowsWithoutReset",
                reloadGridEvent: "ReloadGrid",
                idStatusGrouping: "idStatusGrouping",
                idGrouping: "idGrouping",
                percentGrouping: "percentGrouping",
                noneGrouping: "noneGrouping",
                expandAll: "expandAll",
                collapseAll: "collapseAll"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.groupGrid,
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
                .bind(this.actionEvents.expandAll, function(e, previousSelectedRows){
                    console.log("expandAll");
                    self.gridWidget.expandAllParentRows();
                })
                .bind(this.actionEvents.collapseAll, function(e, previousSelectedRows){
                    console.log("collapseAll");
                    self.gridWidget.collapseAllParentRows();
                })
                .bind(this.actionEvents.getAllRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    self.gridWidget.getSelectedRows();
                })
                .bind("deleteRows", function (e) {
                    var rowIds = ['196608', '196609'];
                    self.gridWidget.deleteRow(rowIds);
                    console.log("Delete rows and reset selections");
                })
                .bind("deleteRowsWithoutReset", function (e) {
                    var rowIds = '196608';
                    self.gridWidget.deleteRow(rowIds, false);
                    console.log("Delete rows but keep selections");
                })
                .bind(this.actionEvents.reloadGridEvent, function (e) {
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.idStatusGrouping, function (e, selectedRows) {
                    console.log(self.actionEvents.idStatusGrouping + " updateGridConfiguration:");
                    console.log(selectedRows);
                    self.gridWidget.updateGridConfiguration({
                        "grouping": {
                            "columns": [
                                {
                                    "column": "id",
                                    "order": "desc", //asc,desc
                                    "show": true,
                                    "text": "Id: <b>{0}</b>"
                                },
                                {
                                    "column": "job-status",
                                    "order": "desc",
                                    "show": false,
                                    "text": "Status: <b>{0}</b>"
                                }
                            ],
                            "collapse": false
                        }
                    });
                })
                .bind(this.actionEvents.idGrouping, function (e, selectedRows) {
                    console.log(self.actionEvents.idGrouping + " updateGridConfiguration:");
                    console.log(selectedRows);
                    self.gridWidget.updateGridConfiguration({
                        "grouping": {
                            "columns": [
                                {
                                    "column": "id",
                                    "order": "desc", //asc,desc
                                    "show": true,
                                    "text": "Id: <b>{0}</b>"
                                }
                            ],
                            "collapse": true
                        }
                    });
                })
                .bind(this.actionEvents.percentGrouping, function (e, selectedRows) {
                    console.log(self.actionEvents.percentGrouping + " updateGridConfiguration:");
                    console.log(selectedRows);
                    self.gridWidget.updateGridConfiguration({
                        "grouping": {
                            "columns": [
                                {
                                    "column": "percent-complete",
                                    "order": "asc",
                                    "show": false,
                                    "text": "Percent Complete: <b>{0}</b>"
                                }
                            ],
                            "collapse": false
                        }
                    });
                });
        }

    });

    return GridView;
});