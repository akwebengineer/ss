/**
 * Module that implements the vpn endpoint certificate view.
 *
 * @module CertificateSettingsView
 * @author balasaritha<balasaritha@juniper.net>
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

    var CertificateSettingsView = Backbone.View.extend({
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

            this.getVpnProfileData();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                 this.$el.find('#certificate-id').val(this.passedRowData["cellData"][0]);
            }

            return this;
        },

        getVpnProfileData: function() {
            var self = this;
            var profileId = self.options.vpnData["profile"].id;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                    self.getCertificateData(authMethod);
                },
                error: function() {
                    console.log('certificates not fetched');
                },
                async: false
            });
        },

        getCertificateData: function(authMethod) {
            var self = this;
            var requestBody = {"device-certificates-request": {
                    "device-id-list": {
                        "ids":[]
                    },
                    "auth-method": authMethod
                }
            };

            // Get the selected devices
            var idList = [];
            idList.push(self.deviceId);

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
            this.rowId = rowData.originalRowData["id"];
            this.deviceId = (rowData.originalRowData["device-moid"].split(":"))[1];

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

            this.options.save(this.options.columnName, newData);
            this.closeCertificate(e);
        },

        closeCertificate: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return CertificateSettingsView;
});
