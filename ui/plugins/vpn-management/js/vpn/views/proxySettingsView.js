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
    '../conf/proxySettingsFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       ProxySettingsFormConfiguration,
       DeviceInterfacesCollection
) {

    var ProxySettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveProxySettings",
            'click #linkCancel': "closeProxySettings"
        },

        render: function(){
            var self = this;
            var formConfiguration = new ProxySettingsFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {"proxy-id" : self.proxyId}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                 this.$el.find('#proxy-id').val(this.passedRowData["cellData"][0]);
            }

            return this;
        },

        getSelectedProxy: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.proxyId = rowData.originalRowData["proxy-id"];

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveProxySettings: function(e) {
            var data = this.getSelectedProxy();

            if(data != "") {
                 var ipv4Expr = new RegExp("^("
                                    + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])"
                                    + "|"
                                    + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))"
                                    + ")$");

                 if(!ipv4Expr.test(data)) {
                     this.formWidget.showFormError("Invalid entry. Enter a valid IPv4 address.");
                     return false;
                 }
            }

            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "PROXYID"
            };
            newData.cellData = data;
            newData.apiData = data;

            this.options.save(this.options.columnName,newData);
            this.closeProxySettings(e);
        },

        closeProxySettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return ProxySettingsView;
});
