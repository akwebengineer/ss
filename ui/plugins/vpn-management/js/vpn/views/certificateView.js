/**
 * Module that implements the certificate overlay view
 * This overlay is for global settings grid and endpoint settings grid
 *
 * @module CertificateView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/certificateSettingsFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       CertificateSettingsFormConfiguration
) {

    var CertificateView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveCertificate",
            'click #linkCancel': "closeCertificate"
        },

        render: function(){
            var self = this;
            var formConfiguration = new CertificateSettingsFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

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
                    selectedDevicesIdList = self.getDeviceIdList(this.model.get("selectedHubDeviceIds"));
                } else {
                    selectedDevicesIdList = self.getDeviceIdList(this.model.get("selectedEndpointDeviceIds"));
                }
            } else if(this.options.fromModify) {
                var id = (this.passedRowData.originalRowData["device-moid"].split(":"))[1];
                var selectedIdObj = [{extraData:id}];
                selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
            } else {
                // A single device id is from the Endpoint Settings page view
                var selectedIdObj = [{extraData:this.passedRowData.originalRowData.id}];
                selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
            };

            this.getVpnProfileData(selectedDevicesIdList);

            return this;
        },

        // Returns selected Device(s) id list
        // @param {String} deviceList

        getDeviceIdList: function(deviceList) {
            var idList = [];
            deviceList.forEach(function(object) {
               idList.push(object.extraData);
            });

            return idList;
        },

        getVpnProfileData: function(idList) {
            var self = this;
            var generalSettings = this.model.get("generalsettings");
            //var profileId = self.options.vpnData["ipsec-vpn"]["profile"].id;
            var profileId = generalSettings["profile-id"];
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                    self.getCertificateData(authMethod, idList);
                },
                error: function() {
                    console.log('certificates not fetched');
                },
                async: false
            });
        },

        getCertificateData: function(authMethod, idList) {
            var self = this;

                var requestBody = {"device-certificates-request": {
                    "device-id-list": {
                        "ids":[]
                    },
                    "auth-method": authMethod
                }
            };

            // Convert from array to JSON request
            
            requestBody['device-certificates-request']['device-id-list']['ids'] = idList;
            jsonRequest = JSON.stringify(requestBody);

            $.ajax({
                url: '/api/juniper/sd/device-management/device-certificates',
                type: 'post',
                dataType: 'json',
                data: jsonRequest,
                headers: {
                   'content-type': 'application/vnd.juniper.sd.device-management.certificates-request+json;version=2;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.device-management.certificates+json;version=2;q=0.02'
                },
                success: function(data, status) {
                    data['certificates-for-devices']['certificatelite'].forEach(function(object) {
                        self.$el.find('#certificate-id').append( new Option(object['certificate-name'], object['certificate-name']));
                    });
                },
                error: function() {
                    console.log('certificates not fetched');
                },
                async: false
            });
        },

        getSelectedCertificates: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveCertificate: function(e){
            var data = this.getSelectedCertificates();
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "CERTIFICATE"
            };
            newData.cellData = data;
            newData.apiData = data;

            this.options.save(this.options.columnName,newData);
            this.closeCertificate(e);
        },

        closeCertificate: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName,e);
        }
    });

    return CertificateView;
});
