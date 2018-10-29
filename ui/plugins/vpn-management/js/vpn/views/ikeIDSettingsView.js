/**
 * Module that implements the selected devices ike ID settings view.
 *
 * @module IkeIDSettingsView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/ikeIDSettingsFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       IkeIDSettingsFormConfiguration
) {

    var IkeIDSettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.certBasedProfile = options.isCertBasedProfile;
            this.aggressiveProfile = options.isAggressiveProfile;
        },

        events: {
            'click #btnOk': "saveIkeIDSettings",
            'click #linkCancel': "closeIkeIDSettings",
             'change #ike-type' : 'ikeIdSelect'
        },

            ikeIdSelect : function(event) {
                  var selectedVal = $("#ike-type").children('option:selected').val();
                  if(selectedVal == "None"){
                       this.$el.find('#ike-id').val("");
                       this.$el.find('#ike-id').prop("disabled",true);
                  } else {
                       this.$el.find('#ike-id').prop("disabled", false);
                  }
            },

        render: function(){
            var self = this;
            var formConfiguration = new IkeIDSettingsFormConfiguration(this.context, this.certBasedProfile, this.aggressiveProfile);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"].length == 2) {
                 if(this.passedRowData["cellData"][0].indexOf("IKE Id:") != -1)
                        this.$el.find('#ike-id').val(this.passedRowData["cellData"][0].substr(7, this.passedRowData["cellData"][0].length));

                 if(this.passedRowData["cellData"][1].indexOf("IKE Id Type:") != -1) {
                        var ike_type = this.passedRowData["cellData"][1].substr(12, this.passedRowData["cellData"][1].length);
                        if(ike_type != "" && ike_type != "Inherited From Vpn")
                                this.$el.find('#ike-type').val(ike_type);

                 }

            } else if(this.passedRowData["cellData"].length == 1 && this.passedRowData["cellData"][0].indexOf("None") != -1) {
                this.$el.find('#ike-id').val("");
                this.$el.find('#ike-id').prop("disabled",true);
                this.$el.find('#ike-type').val(this.passedRowData["cellData"][0].substr(12, this.passedRowData["cellData"][0].length));
            }

            return this;
        },

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this.passedRowData = rowData;
        },

        getIkeIDInstance: function() {
            var listValues = [];
            var data = this.formWidget.getValues();
            if(data[0].value == "None"){
                    listValues.push('IKE Id Type:'+data[0].value); // Checking for NONE case
            }else{
                    listValues.push('IKE Id:'+data[0].value);
                    listValues.push('IKE Id Type:'+(data[1].value != "" ? data[1].value : "Inherited From Vpn"));
            }
            return listValues;
        },

        saveIkeIDSettings: function(e){
            var data = this.getIkeIDInstance();
            var formData = this.formWidget.getValues();
            var ike_type = this.$el.find('#ike-type').val();
            if (ike_type != "None") {
                /*if(data[0] == "") {
                    this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_invalid_entry_IKE_ID_error"));
                    return false;
                }*/

                var ipv4Expr = new RegExp("^(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])$");

                if(formData[0].value != "" && formData[1].value == "User@hostname" && formData[0].value.indexOf('@') == -1) {
                     this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_invalid_entry_IKE_ID_user_error"));
                     return false;
                } else if(formData[0].value != "" && formData[1].value == "IPAddress" && !ipv4Expr.test(formData[0].value)){
                     this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_invalid_entry_ip_address_error"));
                     return false;
                }
            }

            this.options.save(this.options.columnName,data);
            this.closeIkeIDSettings(e);
        },

        closeIkeIDSettings: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName,e);
        }
    });

    return IkeIDSettingsView;
});
