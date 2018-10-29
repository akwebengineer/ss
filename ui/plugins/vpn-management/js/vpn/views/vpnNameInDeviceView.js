/**
 * Module that implements the selected devices proxy settings view.
 *
 * @module vpnNameInDeviceView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/vpnNameInDeviceFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       vpnNameInDeviceFormConfig
) {

    var vpnNameInDeviceView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveDeviceName",
            'click #linkCancel': "closeDeviceName"
        },

        render: function(){
            var self = this;
            var formConfiguration = new vpnNameInDeviceFormConfig(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "")
                this.$el.find('#vpn-name-in-device').val(this.passedRowData["cellData"][0]);

            return this;
        },

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this.passedRowData = rowData;
        },

        getSelectedVpnName: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        saveDeviceName: function(e){
            var data = this.getSelectedVpnName();

            if(data == undefined || data == "") {
                this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_vpn_name_empty_error"));
                return false;
            }

            var vpnNameRegex = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9-_\/]{0,62}$");

            if(!vpnNameRegex.test(data)) {
                 return false;
            }

            this.options.save(this.options.columnName,data);
            this.closeDeviceName(e);
        },

        closeDeviceName: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return vpnNameInDeviceView;
});
