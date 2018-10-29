/**
 * A view that uses the overlay widget to render a grid widget
 *
 * @module GridOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/overlay/overlayWidget'
], function(Backbone, GridWidget, gridConfiguration, OverlayWidget){
    var GridOverlayView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

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
                title: this.options.type=="large" ? "Overlay Title: Grid on Overlay" : false,
                okButton: true
            });
            this.overlay.build();
        },

        render: function () {
            //adjust data to show a simple empty grid with CRUD operations
            var simpleGridConfigurationCopy = $.extend(true, {}, gridConfiguration.simpleGrid);
            var overlayGridConfiguration = _.extend(simpleGridConfigurationCopy, {
                "title": "Content Title: Grid on Overlay",
                "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePageManyRows.json",
                "height": "100%",
                "jsonRoot": "policy",
                "jsonRecords": function(data) {
                    return data['junos:total'];
                },
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
//            delete overlayGridConfiguration.actionButtons;
//            delete overlayGridConfiguration.filter;

            switch (this.options.type) {
                case "large":
                    overlayGridConfiguration.url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePageManyRows.json";
                    delete overlayGridConfiguration.title;
                    break;
                case "small":
                    overlayGridConfiguration.url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json";
                    break;
                case "empty":
                    overlayGridConfiguration.url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesEmpty.json";
                    break;
                default:
                    break;
            }

            this.grid = new GridWidget({
                container: this.el,
                elements: overlayGridConfiguration, //used to test an empty, few rows or many rows table
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
        },

        addPolicy: function (e){
            this.closePolicy(e);
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return GridOverlayView;
});