/**
 * Module that implements the selected devices route export route settings view.
 *
 * @module RouteSettingsExportView
 * @author Stanley Quan<squanjuniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/routeSettingsExportFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       RouteSettingsFormConfiguration,
       DeviceInterfacesCollection
) {

    var RouteSettingsExportView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
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

            // Start with lists hidden
            this.$el.find('.export-rip-checkboxes').hide();
            this.$el.find('.export-ospf-checkboxes').hide();

            // Only show the list that matches the selected protocol

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

            return this;
        },

        // Legacy: Exported Routes: Static, RIP  or Exported Routes: Static, OSPF
        getSelectedRouteSettings: function() {
            var listValues = [];
            var data = this.formWidget.getValues();
            var exportString = "Export: ";

            // Create the cell string
            if (data.length == 0) {
                listValues.push('Export: None');
            } else {
                var i = data.length;
                data.forEach(function(obj) {
                  if (obj.value === "STATIC_ROUTES")
                      exportString = exportString + "Static";
                  if (obj.value === "OSPF_ROUTES")
                      exportString = exportString + "OSPF";
                  if (obj.value === "RIP_ROUTES")
                      exportString = exportString + "RIP";
                  i = i - 1;
                  if (i > 0)
                      exportString = exportString + ",";
                });
                listValues.push(exportString);
            };

            return listValues;
        },

        getSelectedRouteSettingsApiData: function() {
            var data = this.formWidget.getValues();
            return data;
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

    return RouteSettingsExportView;
});
