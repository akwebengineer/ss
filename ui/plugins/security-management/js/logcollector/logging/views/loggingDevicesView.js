/**
 * A view to manage Logging Devices
 *
 * @module Log Collector Devices
 * @author Aslam A <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/views/gridView.js',
    './../conf/loggingDevicesGridConfig.js',
    './../conf/loggingAssignedDevicesGridConfig.js',
    'widgets/grid/gridWidget',
    '../../../../../ui-common/js/gridActivity.js',
    './../conf/loggingDevicesFormConfig.js',
    'widgets/form/formWidget',
], function (GridView, 
             LoggingDevicesGridConfig,
             LoggingAssignedDevicesGridConfig,
             GridWidget,
             GridActivity,
             LoggingDevicesFormConfig,
             FormWidget) {

    var LogDeviceView = GridView.extend({
       

       events:{ 
                
                "click #assigndevices" : "assignDevices"

       },

       assignDevices : function(event){

        // have to implement

       },

       initialize: function(options) {

                this.context = options.context;

                return this;
       },

       render:function(){

                var formConfig = new LoggingDevicesFormConfig(this.context),
                formElements = formConfig.getValues();
                gridConfig1 = new LoggingDevicesGridConfig(this.context),
                gridElements1 = gridConfig1.generalConfig();

                gridConfig2 = new LoggingAssignedDevicesGridConfig(this.context),
                gridElements2 = gridConfig2.generalConfig();
 

                this.formWidget = new FormWidget({
                "elements": formElements,
                "container": this.el
                 });

                this.formWidget.build();

                 var gridContainer1 = this.$el.find('.logging_devices_list').empty();

                 this.gridWidget1 = new GridWidget({
                 container: gridContainer1,
                 elements: gridElements1
                 });
                 this.gridWidget1.build();
                 
                 var gridContainer2 = this.$el.find('.assigned_devices_list').empty();

                 this.gridWidget2 = new GridWidget({
                 container: gridContainer2,
                 actionEvents: {},
                 elements: gridElements2
                 });
                
                 this.gridWidget2.build();
               //  this.$el.find('.slipstream-content-title').css({"margin-bottom" :"0px"});
                 this.$el.find('.action-filter-container').css({"height" :"26px"});


        return this;

       },

    });

    return LogDeviceView;
});
