/**
 * A view that uses the overlay widget to render a local grid widget
 *
 * @module GridOverlayLocalView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleLocalData',
    'widgets/overlay/overlayWidget',
    'widgets/grid/tests/dataSample/firewallPoliciesData'
], function(Backbone, GridWidget, gridConfiguration, OverlayWidget, DataSample){
    var GridOverlayLocalView = Backbone.View.extend({
        initialize: function (options){
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteFirewallPolicies",
                toggleSelectedRow:"toggleSelectedRow"
            };
            this.bindGridEvents();
            this.overlay = new OverlayWidget({
                view: this,
                type: "large",
                title: "Overlay Title: Local Grid on Overlay",
                okButton: true
            });
            this.overlay.build();
        },

        render: function () {
            var simpleGridConfigurationCopy = $.extend(true, {}, gridConfiguration.localGrid);
            var overlayGridConfiguration = _.extend(simpleGridConfigurationCopy, {
                "title": "",
                "contextMenu": {
                    "create": "Create",
                    "edit": "Edit Row",
                    "delete": "Delete Row"
                },
                "showWidthAsPercentage": false,
                "actionButtons": {},
                "filter": {}
            });

            switch (this.options.type) {
                case "small":
                    overlayGridConfiguration.data = DataSample.localSearchData;
                    break;
                case "empty":
                    overlayGridConfiguration.data = [];
                    break;
                default:
                    break;
            }

            this.grid = new GridWidget({
                container: this.el,
                elements: overlayGridConfiguration, //used to test an empty, few rows or many rows table
                actionEvents:this.actionEvents
            });
            this.grid.build();
            return this;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent, function(e, addGridRow){
                    console.log(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function(e, deletedGridRows){
                    console.log(deletedGridRows);
                })
                .bind(this.actionEvents.toggleSelectedRow, function(e, selectedRows){
                    console.log(self.actionEvents.toggleSelectedRow + ": ");
                    console.log(selectedRows);
                    self.grid.toggleRowSelection(selectedRows.selectedRowIds);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    console.log(self.grid.getSelectedRows());
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
                });
        }
    });

    return GridOverlayLocalView;
});