/**
 * Module that implements the selected devices proxy settings view.
 *
 * @module ProxySettingsView
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/ikeAddressSettingsFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       IkeAddressSettingsFormConfiguration,
       DeviceInterfacesCollection
) {

    var IkeAddressSettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveProxySettings",
            'click #linkCancel': "closeProxySettings"
        },

        render: function(){
            var self = this;
            var formConfiguration = new IkeAddressSettingsFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                 this.$el.find('#ike-address').val(this.passedRowData["cellData"][0]);
            }

            return this;
        },

        getSelectedIkeAddress: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveProxySettings: function(e){
            var data = this.getSelectedIkeAddress();
            if(data != "") {
                 var ipv4Expr = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
                 if(!ipv4Expr.test(data)) {
                    this.formWidget.showFormError(this.context.getMessage('extranet_device_form_field_error_ip-address'));
                    return false;
                 }
            }
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "IKEADDRESS"
            };
            newData.cellData = data;
            newData.apiData = data;

            this.options.save(this.options.columnName, newData);
            this.closeProxySettings(e);
        },

        closeProxySettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return IkeAddressSettingsView;
});
