/**
 * Module that implements the selected devices external interface view.
 *
 * @module ExternalInterfaceView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/externalInterfaceFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       ExternalInterfaceFormConfiguration,
       DeviceInterfacesCollection
) {

    var ExternalInterfaceView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
	    this.uuid = options.uuid;
        },

        events: {
            'click #select-externalInterface-existing-id': "selectExternalInterface",
            'click #select-externalInterface-create-id': "createExternalInterface",
            'click #btnOk': "saveExternalInterface",
            'click #linkCancel': "closeExternalInterface"
        },

        selectExternalInterface: function(event) {
            this.$el.find('.select-externalInterfaceDropDown').show();
            this.$el.find('.create-externalInterface').hide();
        },
        createExternalInterface: function(event) {
            this.$el.find('.select-externalInterfaceDropDown').hide();
            this.$el.find('.create-externalInterface').show();
        },

        render: function(){
            var self = this;
            var formConfiguration = new ExternalInterfaceFormConfiguration(this.context);
            var formElements = formConfiguration.getValues();
            var selectedDevicesIdList;

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            // Create list of selected device ids from either Global Settings Page or Selected Endpoint Page
            if (this.options.fromGlobalSettingsPage) {
                // The device id list is from the Global Settings Page
                if (this.passedRowData.originalRowData["type"] === "Hub") {
		    selectedDevicesIdList = "Hub";
                } else {
		    selectedDevicesIdList = "EndPoint";
                }
            } else if(this.options.fromModify) {
               var id = (this.passedRowData.originalRowData["device-moid"].split(":"))[1];
               // var selectedIdObj = [{extraData:id}];
               // selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
               selectedDevicesIdList = id;
            } else {
                // A single device id is from the Endpoint Settings page view
                //var selectedIdObj = [{extraData:this.passedRowData.originalRowData.id}];
                //selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
                selectedDevicesIdList = this.passedRowData.originalRowData.id;
            }

            this.getExternalInterfaceData(selectedDevicesIdList);

            if(self.passedRowData["cellData"][0] != '' && self.passedRowData["cellData"][0] != 'Click to configure') {
                var gridVal = self.passedRowData["cellData"][0];
                if(gridVal.indexOf('(') != -1) {
                    gridVal = gridVal.substr(0, gridVal.indexOf('(') -1);
                }
                self.$el.find('#externalInterface-id').val(gridVal);
            }

            return this;
        },

        // Returns selected Device(s) id list in json format
        // @param {String} deviceList

        getDeviceIdList: function(deviceList) {
            // base json request body
            var requestBody = {"device-info-request":{
                                  "device-id-list":{
                                      "ids":{}
                                  },
                                  "exclude-tunnel-intf":{}
                                }
                              };
            var jsonRequest;

            // Get the selected devices
            var idList = [];
            deviceList.forEach(function(object) {
               idList.push(object.extraData);
            });

            // Convert from array to JSON request
            // Exclude tunnel interfaces from device list
            requestBody['device-info-request']['device-id-list']['ids'] = idList;
            requestBody['device-info-request']['exclude-tunnel-intf'] = true;
            jsonRequest = JSON.stringify(requestBody);

            return jsonRequest;
        },

        // POSTs a REST request with selected devices in request body to get device interface information
        // idList is the selected device id(s) in json formatted 
        // post is used because request body could potentially be very large
        // @param {Object} idList
	getExternalInterfaceData: function(type) {
	    var self = this, url;
	    if (type == "Hub" || type == "EndPoint"){
	    	url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-interfaces?endpoint-type='+type+'&ui-session-id='+this.uuid;
            }else{
		url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-interfaces?device-id='+type+'&ui-session-id='+this.uuid;
            }
            $.ajax({
                url: url,
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.device-interfaces-response+json;version=1;q=0.01'
                },
                success: function(data, status,response) {
		    data["device-interfaces"]['interface'].forEach(function(object) {
                       self.$el.find('#externalInterface-id').append( new Option(object.name,object.name));
                    });
                },
                error: function() {
                    console.log('device external interface not fetched');
                },
                async: false
            });
         },
/*
        getExternalInterfaceData: function(idList) {
            var self = this;

            $.ajax({
                url: '/api/juniper/sd/device-management/device-interfaces',
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.device-management.id-list+json;version=2;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.device-management.interfaces+json;version="1";q="0.02"'
                },
                data: idList,
                success: function(data, status) {
                    data['interfaces']['interface'].forEach(function(object) {
                       self.$el.find('#externalInterface-id').append( new Option(object.name,object.name));
                    });
                },
                error: function() {
                    console.log('device external interface not fetched');
                },
                async: false
            });
        },
*/
        getSelectedExternalInterface: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        // Lets the user selected grid row information be used in the view
        // @param {Object} rowData selected grid row data

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;

            // pass the selected row of data to view
            this.passedRowData = rowData;
        }, 

        saveExternalInterface: function(e){
            var data = this.getSelectedExternalInterface();
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "EXTERNALINTERFACE"
            };

            newData.cellData = data;
            newData.apiData = data;
            
            this.options.save(this.options.columnName,newData);
            this.closeExternalInterface(e);
        },

        closeExternalInterface: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName,e);

        }
    });

    return ExternalInterfaceView;
});
