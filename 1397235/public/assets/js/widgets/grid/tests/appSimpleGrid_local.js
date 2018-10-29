/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleLocalData',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayLocalView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/view/quickView'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, QuickView){
    var GridView = Backbone.View.extend({

        events: {
            "click .cellLink": "openLink"
        },

        initialize: function () {
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                copyEvent:"CopyRow",
                pasteEvent:"PasteRow",
                statusEvent:"UpdateStatusRow",
                quickViewEvent:"QuickViewRow",
                resetHitEvent:"ResetHitCount",
                disableHitEvent:"DisableHitCount",
                reloadGrid:"ReloadGrid",
                deleteRows: "deleteRows",
                deleteRowsWithoutReset: "deleteRowsWithoutReset",
                subMenu1:"SubMenu1",
                subMenu2:"SubMenu2",
                subMenu3:"SubMenu3",
                createMenu1:"createMenu1",
                resetReloadGrid: "resetReloadGrid",
                testPublishGrid:"testPublishGrid",
                selectedEvent:"selectedEvent",
                clearAllEvent: "ClearAll",
                searchEvent: "searchEvent",
                clearSearchEvent: "clearSearchEvent"
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            var self = this;

            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.localGrid,
                actionEvents:this.actionEvents
            });
            this.grid.build();
            // this.grid.toggleGridHeader(true);
            // this.grid.search('psp');
            return this;
        },
        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function(e, addGridRow){
                    console.log(addGridRow);
                    // self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                    // self.updateRow(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function(e, deletedGridRows){
                    console.log(deletedGridRows);
                })
                .bind(this.actionEvents.copyEvent, function(e, copiedGridRows){
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent, function(e, pastedGridRow){
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.quickViewEvent, function(e, quickViewRow){

                    console.log(self.actionEvents.quickViewEvent + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0]
                    }).render();
                })
                .bind(this.actionEvents.resetReloadGrid, function(e, selectedRows) {
                    console.log(self.actionEvents.resetReloadGrid + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid({
                        resetSelection: true
                    });
                    console.log("rows selected after reset selection:")
                    console.log(self.grid.getSelectedRows(true));
                })
                .bind(this.actionEvents.resetHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.resetHitEvent + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid();
                })
                .bind(this.actionEvents.disableHitEvent, function(e, selectedRows){
                    console.log(self.actionEvents.disableHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.reloadGrid, function(e, selectedRows){
                    console.log(self.actionEvents.reloadGrid + ": ");
                    console.log(selectedRows);
                    self.grid.reloadGrid();
                })
                .bind(this.actionEvents.subMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.subMenu2, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView({
                        type: "small"
                    });
                })
                .bind(this.actionEvents.subMenu3, function(e, selectedRows){
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView({
                        type: "empty"
                    });
                })
                .bind(this.actionEvents.clearAllEvent, function(e, previousSelectedRows){
                    console.log(previousSelectedRows);
                    console.log(self.grid.getSelectedRows(true));
                })
                .bind(this.actionEvents.createMenu1, function(e, selectedRows){
                    console.log(self.actionEvents.createMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.testPublishGrid, function(e, selectedRows){
                    console.log(self.actionEvents.testPublishGrid + " Reload grid: ");
                    console.log(self.grid.getSelectedRows());
                    self.grid.reloadGrid();
                    console.log(selectedRows);
                })
                .bind("deleteRows", function(e){
                    var rowIds = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante', '190002-INS_to_Sircon_drop_em'];
                    self.grid.deleteRow(rowIds);
                    console.log("Delete rows and reset selections");
                })
                .bind("deleteRowsWithoutReset", function(e){
                    var rowIds = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante', '190002-INS_to_Sircon_drop_em'];
                    self.grid.deleteRow(rowIds, false);
                    console.log("Delete rows but keep selections");
                })
                .bind(this.actionEvents.selectedEvent, function(e, selectedRows){
                    // console.log(self.actionEvents.selectedEvent + " : ");
                    // console.log(selectedRows);
                })
                .bind("gridRowOnEditMode", function(e, selectedRows){
                    // console.log("gridRowOnEditMode: ");
                    // console.log(selectedRows);
                })
                .bind("clearSearchEvent", function(e, previousSelectedRows){
                    self.grid.clearSearch();
                })
                .bind("searchEvent", function(e, selectedRows){
                    self.grid.search(['1195002', 'psp']);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    // console.log(self.grid.getSelectedRows());
                    // console.log("gridOnRowSelection: ");
                    // console.log(selectedRows);
                }).bind('postValidation', function(e, isValid){
                    console.log("post validation when doing inline edit");
                });
        },

        addRow: function(addGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        updateRow: function(updateGridRow) {
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

        save:  function(data) {
            this.grid.addRow(data);
//            this.grid.reloadGrid();
            console.log("Row added. Number of rows now: " + this.grid.getNumberOfRows());
        },

        update:  function(updatedRow) {
            this.gridWidget.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        }
    });

    return GridView;
});