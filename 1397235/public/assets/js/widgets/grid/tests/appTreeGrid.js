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
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/sourceAddressView',
    'widgets/grid/tests/view/destinationAddressTreeView',
    'widgets/grid/tests/view/advancedSecurityView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesTreeData',
    'widgets/grid/tests/view/quickView',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, SourceAddressView, DestinationAddressView, AdvancedSecurityView, ZonePoliciesModel, firewallPoliciesData, QuickView, mockjax){
    var GridView = Backbone.View.extend({
       initialize: function () {
            this.addressCollection = new ZonePoliciesModel.address.collection();
            this.mockApiResponse();
            this.actionEvents = {
                updateEvent:"UpdateRow",
                deleteEvent:"DeleteRow",
                createEvent:"AddFirewallPolicies",
                selectRowEvent:"selectRowEvent",
                getAllRowsEvent:"GetAllRows",
                getSelectedRowsEvent:"GetSelectedRows",
                quickViewEvent:"QuickViewRow",
                deleteRows: "deleteRows",
                deleteRowsWithoutReset: "deleteRowsWithoutReset",
                clearAllEvent: "ClearAll"
            };
            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
            this.render();
        },

        render: function () {
            var updateTree = function () {
                console.log("onConfigUpdate callback for tree grid");
            };
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.treeGrid,
                actionEvents:this.actionEvents,
                cellOverlayViews:this.cellOverlayViews,
                cellTooltip:this.cellTooltip,
                onConfigUpdate: updateTree
            });
            this.gridWidget.build();
            return this;
        },

        createViews : function () { //should implement setCellValues
            var self = this;
            var sourceAddressView = new SourceAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.saveSource, self),
                'close': _.bind(self.close, self),
                'columnName': 'sourceAddress.addresses'
            });
            var destinationAddressView = new DestinationAddressView({
                'model': self.addressCollection,
                'save': _.bind(self.saveDestination, self),
                'close': _.bind(self.close, self),
                'columnName': 'destinationAddress.addresses'
            });
            var advancedSecurityView = new AdvancedSecurityView({
                'model': self.addressCollection,
                'save': _.bind(self.saveApplication, self),
                'close': _.bind(self.close, self),
                'columnName': 'application-services'
            });
            var cellViews = {
                'sourceAddress.addresses' : sourceAddressView,
                'destinationAddress.addresses' : destinationAddressView,
                'application-services' : advancedSecurityView
            };
            return cellViews;
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
                .bind("gridRowOnEditMode", function(e, editModeRow){
                    console.log(editModeRow);
                    var fields = editModeRow.currentRowFields;
                    if (!$(fields['name']).val())
                        $(fields['name']).val("testEdition");
                    if (!_.isUndefined(fields['sourceAddress.addresses']) && !$(fields['sourceAddress.addresses']).val().trim())
                        $(fields['sourceAddress.addresses']).attr('rows',3).val("1.2.3.4 \n11.12.13.14 \n111.112.113.114");
                    if (!_.isUndefined(fields['application-services']) && !$(fields['application-services']).val().trim())
                        $(fields['application-services']).attr('rows',2).val("idp: true \nutm-policy: junosv");
                    $(fields.action).attr('disabled', 'true');
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
//                    console.log("gridOnRowSelection: ");
//                    console.log(selectedRows);
                })
                .bind("deleteRows", function(e){
                    var rowIds = ['24a', '25'];
                    self.gridWidget.deleteRow(rowIds);
                    console.log("Delete rows and reset selections");
                })
                .bind("deleteRowsWithoutReset", function(e){
                    var rowIds = ['24a', '25'];
                    self.gridWidget.deleteRow(rowIds, false);
                    console.log("Delete rows but keep selections");
                })
                .bind(this.actionEvents.getAllRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getAllRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getAllVisibleRows());
                })
                .bind(this.actionEvents.quickViewEvent, function(e, quickViewRow){
                    console.log(self.actionEvents.quickViewEvent + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0]
                    }).render();
                })

                .bind(this.actionEvents.clearAllEvent, function(e, previousSelectedRows){
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.selectRowEvent, function(e, selectedRows){
                    console.log(selectedRows);
                    self.gridWidget.toggleRowSelection("25");
//                    self.gridWidget.toggleRowSelection("25", "selected");
//                    self.gridWidget.toggleRowSelection("25", "unselected");
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function(e, selectedRows){
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.reloadGridEvent, function(e){
                    console.log(self.actionEvents.reloadGridEvent);
                    self.gridWidget.reloadGrid();
                })
                .bind('gridLoaded', function(e){
                    console.log(self.gridWidget.getSelectedRows(true));
                 /*   self.gridWidget.toggleRowSelection("24a");
                    console.log(self.gridWidget.getSelectedRows(true));*/
                });
        },

        saveSource:  function(columnName, data) {
            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data
            });
        },

        saveDestination:  function(columnName, data) {
            var formatTextArea = function (textArea, data){
                if (data['radio_button'] === 'unselect'){
                    $(textArea).addClass('lineThrough');
                }
            };
            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data['destination-address'],
                'allData': data,
                'formatter':formatTextArea
            });
        },

        saveApplication:  function(columnName, data) {
            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data,
                'allData': data
            });
        },

        cellTooltip: function (cellData, renderTooltip){
//            console.log(cellData);
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
                success: function(data) {
                    renderTooltip(cellData.cellId + "<br/>"
                        + cellData.columnName + "<br/>"
                        + data.address[0].name);
                }
            });
        },

        close:  function(columnName,e) {
            this.$el.trigger('closeCellOverlayView', columnName);
            e.preventDefault();
        },

        /* mocks REST API response for tree data for the parent and first children */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-tree',
                response: function(settings) {
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
                        switch(urlHash.nodeid){
                            case "11":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel11;
                                break;
                            case "15":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel15;
                                break;
                            case "25":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel25;
                                break;
                            case "4":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel4;
                                break;
                            case "2":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel2;
                                break;
                            case "1":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel1;
                                break;
                            case "55":
                                this.responseText = firewallPoliciesData.firewallPoliciesLevel55;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    
                },
                responseTime: 10
            });
        }
    });

    return GridView;
});