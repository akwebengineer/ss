/**
 * Module that implements the selected devices tunnel zone view.
 *
 * @module TunnelZoneView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/tunnelZoneFormConf.js'
], function (Backbone, Syphon, FormWidget, TunnelZoneFormConfiguration) {

    var TunnelZoneView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
	    this.uuid = options.uuid;
        },

        events: {
            'click #select-tunnelZone-existing-id': "selectTunnelZone",
            'click #select-tunnelZone-create-id': "createTunnelZone",
            'click #btnOk': "saveTunnelZone",
            'click #linkCancel': "closeTunnelZone"
        },

        selectTunnelZone: function(event) {
            console.log("select tunnelZone");
            this.$el.find('.select-tunnelZoneDropDown').show();
            this.$el.find('.create-tunnelZone').hide();
        },

        createTunnelZone: function(event) {
            console.log("create tunnelZone");
            this.$el.find('.select-tunnelZoneDropDown').hide();
            this.$el.find('.create-tunnelZone').show();
        },

        render: function(){
            var self = this;

            var formConfiguration = new TunnelZoneFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();
            var selectedDevicesIdList;


            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            // Get the selected devices from Global Settings Page or from Endpoint Settings Page.
            if (this.options.fromGlobalSettingsPage) {
                // A list of selected devices comes from the Global Settings page view
                if (this.passedRowData.originalRowData["type"] === "Hub") {
                    selectedDevicesIdList = "Hub";
                } else {
                    selectedDevicesIdList = "EndPoint";
                }

            } else if(this.options.fromModify) {
                var id = (this.passedRowData.originalRowData["device-moid"].split(":"))[1];
                //var selectedIdObj = [{extraData:id}];
                //selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
                selectedDevicesIdList = id;
            } else {
                // only a single id comes from the Endpoint Settings page view
                //var selectedIdObj = [{extraData:this.passedRowData.originalRowData.id}];
                //selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
                selectedDevicesIdList = this.passedRowData.originalRowData.id;
            };

            this.getTunnelZoneData(selectedDevicesIdList);

            if (this.$el.find('#select-tunnelZone-existing-id').prop("checked")) {
               this.$el.find('#select-tunnelZone-existing-id').trigger("click");
            };

            if (this.$el.find('#select-tunnelZone-create-id').prop("checked")) {
               this.$el.find('#select-tunnelZone-create-id').trigger("click");
            };

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "" && this.passedRowData["cellData"][0] != "Click to configure") {
                var availableZones = this.$el.find('#drop-tunnelZone-id')[0].options;

                for (p = 0; p< availableZones.length; p++){
                    if(availableZones[p].label == this.passedRowData["cellData"][0]) {
                        this.$el.find('#drop-tunnelZone-id').val(this.passedRowData["cellData"][0]);
                        break;
                    }
                }
                if(this.$el.find('#drop-tunnelZone-id').val() != this.passedRowData["cellData"][0]) {
                    this.$el.find('#create-tunnelZone-id').val(this.passedRowData["cellData"][0]);
                    this.$el.find('input:radio[name=select-tunnelZone]:nth(1)').attr('checked',true).trigger("click");
                }
            }

            return this;
               
        },

        // get Returns selected Device(s) id list in json format
        // @param {String} deviceList 

        getDeviceIdList: function(deviceList) {
            // base json request body
            var requestBody = {"device-info-request":{"device-id-list":{"ids":{}}}};
            var jsonRequest;

            // Get the selected devices id from the device list object
            // The extraData field will contain the list of id(s)
            var idList = [];
            deviceList.forEach(function(object) {
               idList.push(object.extraData);
            });

            // Convert from array to JSON request
            requestBody['device-info-request']['device-id-list']['ids'] = idList;
            jsonRequest = JSON.stringify(requestBody);
         
            return jsonRequest;
        },


	// GET REST request to get device zone for Hub And Spokes
	// type is Hub or EndPoint or device id
	// If type is device id , then the published api for zones is used
	
	getTunnelZoneData: function(type) {
            var self = this, url;
            if (type == "Hub" || type == "EndPoint"){
                      url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-zones?endpoint-type='+type+'&ui-session-id='+this.uuid;
            }else{
                      url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-zones?device-id='+type+'&ui-session-id='+this.uuid;
            }
            $.ajax({
                url: url,
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.device-zones-response+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    data['device-zones']['zone'].forEach(function(object) {
                       self.$el.find('#drop-tunnelZone-id').append( new Option(object.name,object.name));
                    });
                },
                async: false,
                error: function() {
                    console.log('Unable to get Tunnel Zone Data');
                }
            });
        },


        getSelectedTunnelZone: function() {
            var data = this.$el.find('#drop-tunnelZone-id').val();
            return data;
        },

        // Makes the grid selected rowData availble to this view
        // @param {Object} rowData from selected grid row

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveTunnelZone: function(e){
            var data;
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "TUNNELZONE"
            };
            var error;

            if (this.$el.find('#select-tunnelZone-create-id').prop("checked")) {
                var create = this.$el.find('#create-tunnelZone-id');
                if (create.attr("data-invalid") === undefined) {
                    data = create.val();
                } else {
                    error = this.context.getMessage('ipsec_vpns_tunnel_create_zone_eror_message');
                    this.showErrorMessage('create-tunnelZone-id', error);
                    return false;
                }
            } else {
                data = this.getSelectedTunnelZone();
            };

            newData.cellData = data;
            newData.apiData = data;

            this.options.save(this.options.columnName,newData);
            this.closeTunnelZone(e);
        },

        closeTunnelZone: function (e){
            e && e.preventDefault();
//            e.stopPropagation();
//            e.stopImmediatePropagation();

            this.options.close(this.options.columnName,e);

        },

        showErrorMessage: function(id, message) {
            this.$el.find('#'+id).attr("data-invalid", "").parent().addClass('error');
            this.$el.find('label[for='+id+']').parent().addClass('error');
            this.$el.find('#'+id).parent().find("small[class*='error']").html(message);
        }


    });

    return TunnelZoneView;
});
