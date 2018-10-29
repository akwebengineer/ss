/**
 * Module that implements the selected devices ike local address settings view.
 *
 * @module IkeAddressView
 * @author Stanley Quan <squan@juniper.net>
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
            'click #btnOk': "saveIkeAddressSettings",
            'click #linkCancel': "closeIkeAddressSettings"
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

            return this;
        },

        getIkeAddressInstance: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
        },

        saveIkeAddressSettings: function(e){
            var data = this.getIkeAddressInstance();
            if(!data) {
                this.formWidget.showFormError(this.context.getMessage('extranet_device_form_field_error_ip-address'));
                return false;
            }
            else {
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

            this.options.save(this.options.columnName,newData);
            this.closeIkeAddressSettings(e);
        },

        closeIkeAddressSettings: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName,e);
        }
    });

    return IkeAddressSettingsView;
});
