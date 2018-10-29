/**
 * ADVPN Settoings View for the Tunnels.
 * modify ADVPN Settings View for Tunnels
 * @module advpnView
 * @author Shashidhara NR <shashinrp@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/


define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/adVpnSettingsFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       ADVPNFormConfiguration
) {

    var adVpnView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveAdVpnSettings",
            'click #linkCancel': "closeAdVpnSettings"
        },

        render: function(){
            var self = this;
            var formConfiguration = new ADVPNFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "" &&
               this.passedRowData["cellData"][0].indexOf("Inherited") == -1) {
                    var advpnSettings = this.passedRowData.cellData;
                    for(var y=0; y < advpnSettings.length; y++) {
                        if(advpnSettings[y].indexOf("Shortcut Limit:") == 0)
                            this.$el.find('#shortcut-conn-limit').val(advpnSettings[y].split(":")[1]);

                        if(advpnSettings[y].indexOf("Idle Threshold:") == 0)
                            this.$el.find('#idle-threshold').val(advpnSettings[y].split(":")[1]);

                        if(advpnSettings[y].indexOf("Idle Time:") == 0)
                            this.$el.find('#idle-time').val(advpnSettings[y].split(":")[1]);

                    }
            }

            return this;
        },

        getSelectedAdvpnInstance: function() {
            var listValues = [];
            var data = this.formWidget.getValues();

                 listValues.push('Shortcut Limit:'+data[0].value);
                 listValues.push('Idle Threshold:'+data[1].value);
                 listValues.push('Idle Time:'+data[2].value);

            return listValues;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.passedRowData = rowData;
        },

        saveAdVpnSettings: function(e,context){
            var data = this.getSelectedAdvpnInstance();
            var formValues = this.formWidget.getValues();

            var shortcutLimit = data[0].replace("Shortcut Limit:","");
            if(shortcutLimit != "") {
                shortcutLimit = parseInt(shortcutLimit);
                if(!(shortcutLimit >= 0 && shortcutLimit <= 4294967295)) {
                    this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_shortcut_con_limit_showFormError"));
                    return false;
                }
            }
            var idle_threshold = data[1].replace("Idle Threshold:","");
            if(idle_threshold != "") {
                idle_threshold = parseInt(idle_threshold);
                if(!(idle_threshold >=3 && idle_threshold <= 5000)) {
                    this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_idle_threshold_showFormError"));
                    return false;
                }
            }
            var idle_time = data[2].replace("Idle Time:","");
            if(idle_time != "") {
                idle_time = parseInt(idle_time);
                if(!(idle_time >= 60 && idle_time <= 86400)) {
                    this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_idle_time_showFormError"));
                    return false;
                }
            }

            this.options.save(this.options.columnName,data);
            this.closeAdVpnSettings(e);
        },

        closeAdVpnSettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return adVpnView;
});
