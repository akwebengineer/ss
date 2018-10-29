/**
 * Module that implements the selected devices route settings view.
 *
 * @module RouteSettingsView
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/routeSettingsFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       RouteSettingsFormConfiguration,
       DeviceInterfacesCollection
) {

    var RouteSettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.UUID = this.options.UUID;
            if(options.fromModify === false){ // only on create time
                     this.context.vpnTypeCon = this.context.vpnType;
                     this.context.routingOptions = this.model.attributes.globalsettingsproperties["routing-options"];
            }
        },

        events: {
            'click #btnOk': "saveRouteSettings",
            'click #linkCancel': "closeRouteSettings"
        },

        render: function(){
            var self = this;
            var formConfiguration = new RouteSettingsFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.context.vpnTypeCon == "HUB_N_SPOKE" && this.passedRowData['originalRowData']['is-hub']){
                 this.$el.find('#export-routes-default').parent().show();
                 this.$el.find(".metric").show();
            }else {
                 this.$el.find('#export-routes-default').parent().hide();
                 this.$el.find(".metric").hide();
            }

            if(this.context.routingOptions == "OSPF"){
                 this.$el.find('#export-routes-ospf').parent().hide();
            }else if(this.context.routingOptions == "RIP"){
                 this.$el.find('#export-routes-rip').parent().hide();
            }else if(this.context.routingOptions == "STATIC"){
                 this.$el.find('.export-routes-checkboxes').hide();
            }

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                var exportVal = this.passedRowData["cellData"][0];

                if(exportVal.indexOf("Static") != -1) {
                    this.$el.find('#export-routes-static').prop('checked', true);
                }
                if (exportVal.indexOf("OSPF") != -1) {
                    this.$el.find('#export-routes-ospf').prop('checked', true);
                }
                if (exportVal.indexOf("RIP") != -1) {
                    this.$el.find('#export-routes-rip').prop('checked', true);
                }
                if (exportVal.indexOf("Default") != -1) {
                    this.$el.find('#export-routes-default').prop('checked', true);
                }
            }
            if(this.passedRowData['originalRowData']['is-hub']){
                self.disableCheckboxForHub();
                this.$el.find('input[type="checkbox"]').change(function() {
                    self.disableCheckboxForHub();
                });
            }
            if(this.passedRowData["cellData"][1] != undefined && this.passedRowData["cellData"][1] != "") {
                    var metric = this.passedRowData["cellData"][1];
                    var metricVal = ((metric != undefined && metric.indexOf("-") == -1) ? metric.substr(metric.indexOf('Metric:')+8, metric.length) : "");
                    this.$el.find('#metric').val(metricVal);
            }
            if(this.options.fromModify === false){  // only on create time
                    if (this.model.attributes.globalsettingsproperties["routing-options"] === "OSPF") {
                            this.$el.find('#export-protocol-static').prop('checked', this.model.attributes.vpnmo['export-static-routes']);
                            this.$el.find('#export-protocol-rip').prop('checked', this.model.attributes.vpnmo['export-rip-routes']);
                            this.$el.find('.export-ospf-checkboxes').show();
                    };
                    if (this.model.attributes.globalsettingsproperties["routing-options"] === "RIP") {
                            this.$el.find('#export-protocol-static1').prop('checked', this.model.attributes.vpnmo['export-static-routes']);
                            this.$el.find('#export-protocol-ospf').prop('checked', this.model.attributes.vpnmo['export-ospf-routes']);
                            this.$el.find('.export-rip-checkboxes').show();
                    }
            }

            return this;
        },
        disableCheckboxForHub: function(){
            if(this.$el.find("input:checked").length > 0){
                if(this.$el.find('input#export-routes-default').is(':checked')){
                        this.$el.find('input[type=checkbox]:not("#export-routes-default")').attr('disabled', true);
                }else{
                        this.$el.find('input#export-routes-default').attr('disabled', true);
                }
            }else{
                    this.$el.find('input[type=checkbox]').attr('disabled', false);
            }
        },
        getExportRouteType: function(exportVal) {
            if(exportVal.indexOf("STATIC_ROUTES") == 0) {
                return "Static";
            }
            else if (exportVal.indexOf("OSPF_ROUTES") == 0) {
                return "OSPF";
            }
            else if (exportVal.indexOf("RIP_ROUTES") == 0) {
                return "RIP";
            }
            else if (exportVal.indexOf("DEFAULT_ROUTES") == 0) {
                return "Default";
            }
            return "None";

        },

        getSelectedRouteSettings: function() {
            var listValues = [];
            var data = this.formWidget.getValues();
            var vpnType = this.context.vpnTypeCon;
            if (data[0].name == 'metric' && vpnType == "HUB_N_SPOKE" && this.passedRowData.originalRowData["is-hub"]) {
                listValues.push('Export: None');
                listValues.push('Metric: '+((data[0].value < 0) ? "" : data[0].value));
            } else if (data.length > 2) {
                var exportData = this.getExportRouteType(data[0].value);
                for (i = 1; i < data.length -1; i++) {
                    exportData += ", " + this.getExportRouteType(data[i].value);
                }
                listValues.push('Export: '+exportData);
                if(vpnType == "HUB_N_SPOKE" && this.passedRowData.originalRowData["is-hub"]){
                    listValues.push('Metric: '+ ((data[data.length -1].value < 0) ? "" : data[data.length-1].value));
                }
            }
            else {
                listValues.push('Export: '+this.getExportRouteType(data[0].value));
                if(vpnType == "HUB_N_SPOKE" && this.passedRowData.originalRowData["is-hub"]){
                    listValues.push('Metric: '+((data[1].value < 0) ? "" : data[1].value));
                }
            }
            return listValues;
        },
        getSelectedRouteSettingsApiData: function() {
                            var data = this.formWidget.getValues();
                            return data;
        },
        setCellViewValues: function(rowData) {
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveRouteSettings: function(e){
            var data = this.getSelectedRouteSettings();
            var apiData = this.getSelectedRouteSettingsApiData();
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "ROUTESETTINGS"
            };
            newData.cellData = data;
            newData.apiData = apiData;

            this.options.save(this.options.columnName, newData);
            this.closeRouteSettings(e);
        },

        closeRouteSettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return RouteSettingsView;
});
