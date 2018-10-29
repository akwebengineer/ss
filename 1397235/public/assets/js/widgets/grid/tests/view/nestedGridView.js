/**
 * A view that uses the overlay widget to render a grid widget
 *
 * @module NestedGridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/overlay/overlayWidget'
], function(Backbone, GridWidget, gridConfiguration, OverlayWidget){
    var NestedGridView = Backbone.View.extend({

        initialize: function (options){
            this.actionEvents = {
                createEvent:"AddRow",
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteFirewallPolicies",
                toggleSelectedRow:"toggleSelectedRow"
            };
            this.bindGridEvents();
            if (this.options.onOverlay) {
                new OverlayWidget({
                    view: this,
                    type: "large",
                    title: "Overlay Title: Grid on Overlay",
                    okButton: true
                }).build();
            }
        },

        render: function () {
            //adjust grid configuration to show grid with CRUD operations
            var simpleGridConfigurationCopy = $.extend(true, {}, gridConfiguration.nestedGrid);
            delete simpleGridConfigurationCopy.title;
            delete simpleGridConfigurationCopy.filter.advancedSearch;
            delete simpleGridConfigurationCopy.actionButtons.customButtons;
            var overlayGridConfiguration = _.extend(simpleGridConfigurationCopy, {
                "height": "100%",
                "tableId": "testOverlayNested",
//                    "showWidthAsPercentage": false,
                "createRow": {
                    "showInline": true
                },
                "editRow": {
                    "showInline": true
                },
                "contextMenu": {
                    "create": "Create",
                    "edit": "Edit Row",
                    "delete": "Delete Row"
                }
            });
            if (!this.options.onOverlay) {
                overlayGridConfiguration.title = "Content Title: Nested Grid";
            }

            //builds grid
            this.grid = new GridWidget({
                container: this.el,
                elements: overlayGridConfiguration,
                actionEvents:this.actionEvents,
                cellOverlayViews:this.cellOverlayViews
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

    return NestedGridView;
});