/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSampleDragNDrop',
    'widgets/grid/tests/view/sourceAddressView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'text!widgets/grid/tests/dataSample/zoneSet.json',
    'widgets/grid/tests/dataSample/rbac',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, SourceAddressView, ZonePoliciesModel, firewallPoliciesData, zoneSetData, rbacData, mockjax){
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.mockApiResponse();
            this.actionEvents = {
                selectedEvent:"selectedEvent"
            };
            this.bindGridEvents();
            this.addressCollection = new ZonePoliciesModel.address.collection();
            this.cellOverlayViews = this.createViews();
            this.$el = $(this.el);
            this.$el.append("<div id='firewall_grid_container'></div><div><div id='address_grid_container'></div><div id='zone_grid_container'></div></div>");
            this.render();
        },

        render: function () {

            this.grid = new GridWidget({
                container: this.$el.find("#firewall_grid_container"),
                elements: configurationSample.dragNDropGrid1,
                cellOverlayViews:this.cellOverlayViews,
                actionEvents: this.actionEvents,
                rbacData: rbacData
            });

            this.grid.build();
            
            this.grid2 = new GridWidget({
                container: this.$el.find("#address_grid_container"),
                elements: configurationSample.dragNDropGrid2,
                rbacData: rbacData
            });
            this.grid2.build();

            this.grid3 = new GridWidget({
                container: this.$el.find("#zone_grid_container"),
                elements: configurationSample.dragNDropGrid3,
                rbacData: rbacData
            });
            this.grid3.build();

            return this;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.selectedEvent, function(e, selectedRows){
                    console.log(self.actionEvents.selectedEvent + " : ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
                    console.log(updatedGridRow);
//                    self.updateRow(updatedGridRow);
                })
                .bind("gridRowOnEditMode", function(e, selectedRows){
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
                });
        },

        update:  function(updatedRow) {
            this.grid.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        },

        createViews : function () { //should implement setCellValues
            var self = this;
            var sourceAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'source-address'
            });
            var destinationAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'destination-address'
            });
            var cellViews = {
                'source-address' : sourceAddressView,
                'destination-address' : destinationAddressView
            };
            return cellViews;
        },

        save:  function(columnName, data) {
            this.$el.find("#firewall_grid_container").trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data
            });
        },

        close:  function(columnName,e) {
            this.$el.find("#firewall_grid_container").trigger('closeCellOverlayView', columnName);
            e.preventDefault();
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    var urlHash = {},
                        seg = settings.data.split('&');
                    for (var i=0;i<seg.length;i++) {
                        if (!seg[i]) { continue; }
                        var s = seg[i].split('=');
                        urlHash[s[0]] = s[1];
                    }
                    if(urlHash.page == 2){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage2;
                    }else if(urlHash.page == 3){
                        this.responseText = firewallPoliciesData.firewallPoliciesPage3;
                    }else {
                        this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                },
                responseTime: 10
            });
            $.mockjax({
                url: '/api/get-data-zone',
                dataType: 'json',
                response: function(settings) {
                    this.responseText = zoneSetData;
                },
                responseTime: 10
            });
        }
    });

    return GridView;
});