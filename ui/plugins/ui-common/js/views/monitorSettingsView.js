/**
 * The monitor settings landing page
 * 
 * @module MonitorSettings
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/grid/gridWidget',
    '../conf/monitorSettingsDeviceGridConf.js',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'text!../../../ui-common/js/templates/monitorSettingsTemplate.html',
    '../common/intentActions.js'
], function (Backbone,
       GridWidget,
       GridConf,
       ConfirmationDialog,
       Template,
       IntentActions) {

    var MonitorSettings = Backbone.View.extend({

        /*
        * Event triggers to corresponding functions based on the id's specified in the template
        */
        events: {
            'click #device_monitoring_enable': "toggleDeviceMonitoring",
            'change #resource_allocation_polling_schedule_input': "validatePollingValue",
            'change #traffic_polling_schedule_input': "validatePollingValue",
            'change #session_polling_schedule_input': "validatePollingValue",
            'click #resource_allocation_polling_enable': "toggleResourceAllocationPolling",
            'click #traffic_polling_enable': "toggleTrafficPolling",
            'click #session_polling_enable': "toggleSessionPolling"
        },

        initialize: function() {
            this.activity = this.options.activity;
            this.context = this.activity.context;
            this.actionEvents = {
                enableDevice: "enableDevice",
                disableDevice: "disableDevice"
            };
            this.bindGridEvents();

            this.confirmationDialogConf = 
                {
                    title: this.context.getMessage('monitor_settings_dialog_title'),
                    question: this.context.getMessage('monitor_settings_dialog_question'),
                    yesButtonLabel: this.context.getMessage('monitor_settings_dialog_yes'),
                    noButtonLabel: this.context.getMessage('monitor_settings_dialog_no'),
                    yesButtonTrigger: 'yesEventTriggered',
                    noButtonTrigger: 'noEventTriggered'
                };

        },

        /*
        * render the template and the grid and update the settings with data retrieved from the server
        */
        render: function() {
            var gridConf = new GridConf(this.context);
            // load template required strings from message bundle
            var page_data = {
                    title: this.context.getMessage('monitor_settings'),
                    monitorSettingsTitleDescription: this.context.getMessage('monitor_settings_title_description'),
                    deviceMonitoringLabel: this.context.getMessage('device_monitoring_label'),
                    enableLabelShort: this.context.getMessage('enable_label_short'),
                    enableLabel: this.context.getMessage('enable_label'),
                    minutesLabel: this.context.getMessage('minutes_label'),
                    trafficPollingLabel: this.context.getMessage('traffic_polling_label'),
                    resourceAllocationPollingLabel: this.context.getMessage('resource_allocation_polling_label'),
                    sessionPollingLabel: this.context.getMessage('session_polling_label'),
                    minutesLabelErrorMsg: this.context.getMessage('minutes_label_error_msg'),
                    "title-help":{
                             "content" : this.context.getMessage("monitor_settings_title_help"),
                             "ua-help-text":this.context.getMessage("more_link")
                             // FIXME:  the corresponding help page is not available yet, add to the help alias xml when available
                             //"ua-help-identifier":this.context.getHelpKey("MONITOR_SETTINGS_OVERVIEW")
                        }
                };


            this.$el.append(Slipstream.SDK.Renderer.render(Template, page_data));
            
            this.fetchDeviceMonitoring();
            this.fetchSettignsForCollector("TrafficStatsCollector");
            this.fetchSettignsForCollector("ResourceUtilizationCollector");
            this.fetchSettignsForCollector("SessionCountCollector");

            var gridContainer = this.$('#monitor_settings_device_status_list');
            this.monitorSettingsDeviceListGrid = this.addGridWidget('monitor_settings_device_status_list', gridConf, this.actionEvents);
            // Hide more link
            this.$el.find('.more').hide();
            
            return this;
        },

        /*
        * Function to get the settings from server for the overall device monitoring enable/disable state
        */
        fetchDeviceMonitoring: function (){
            var self = this, collectorEnabled = false;          
             
            $.ajax( {
                   url: "/api/juniper/seci/collection-management",
                   type: "GET",
                    success: function(data) {
                        collectorEnabled = data["settings"]["enabled"];
                        self.toggleDeviceMonitoring(collectorEnabled);                        
                     },
                    error: function() {
                         console.log("Error fetching device monitoring status");
                     }
            } );
        },

        /*
        * Function to post the request to server for the overall device monitoring enable/disable state
        */
        postDeviceMonitoring: function (enabled){
            var self = this, collectorEnabled = false;          
            var jsonData  = 
                {
                    "settings" : {
                        "enabled" : enabled
                    }
                };            
            $.ajax( {
                   url: "/api/juniper/seci/collection-management",
                   type: "POST",
                    dataType:"json",
                    data: JSON.stringify(jsonData),
                    headers:{
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    success: function(data) {
                        collectorEnabled = data["settings"]["enabled"];
                        self.toggleDeviceMonitoring(collectorEnabled);
                        if (collectorEnabled) {
                            self.fetchSettignsForCollector("TrafficStatsCollector");
                            self.fetchSettignsForCollector("ResourceUtilizationCollector");
                            self.fetchSettignsForCollector("SessionCountCollector");    
                        }
                     },
                    error: function() {
                         console.log("Error posting device monitoring status");
                     }
            } );
        },

        /**
         * Fetch the settings for TrafficStats monitoring data collector
         * After fetching the data update the checkbox and input value
         */
        fetchSettignsForCollector: function(collectorName){
            var self = this, collectorEnabled = false, pollInterval = 2;          
             
            $.ajax( {
                   url: "/api/juniper/seci/collection-management/collectors/"+collectorName,
                   type: "GET",
                    success: function(data) {
                        collectorEnabled = data["settings"]["enabled"];
                        // set the polling interval data in mins
                        var pollIntervalMS = data["settings"]["poll-interval"];
                        pollInterval = (pollIntervalMS/1000/60) << 0;
                        console.log(" the settings for TrafficStatsCollector are "+collectorEnabled+
                                        " with interval value of "+pollInterval+" minutes");
                        // enable/disable of checkbox based on collector enabled/disabled
                        switch(collectorName) {
                            case "TrafficStatsCollector":
                                self.toggleTrafficPolling(collectorEnabled, pollInterval);
                                break;
                            case "ResourceUtilizationCollector":
                                self.toggleResourceAllocationPolling(collectorEnabled, pollInterval);
                                break;
                            case "SessionCountCollector":
                                self.toggleSessionPolling(collectorEnabled, pollInterval);
                                break;
                            default:
                                break;
                        }
                        
                     },
                    error: function() {
                         console.log("Error retriving polling settings for "+collectoName);
                     }
            } );
        },

        /**
         * Fetch the settings for TrafficStats monitoring data collector
         * After fetching the data update the checkbox and input value
         */
        postUpdatedSettingsForCollector: function(collectorName, enabled, pollIntervalMins){
            var self = this;          
            
            var jsonData  = 
                {
                    "settings" : {
                        "enabled" : enabled,
                        "poll-interval" : (pollIntervalMins*1000*60) >> 0
                    }
                };
            $.ajax( {
                   url: "/api/juniper/seci/collection-management/collectors/"+collectorName,
                    type: 'POST',
                    dataType:"json",
                    data: JSON.stringify(jsonData),
                    headers:{
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    success: function(data) {
                        var collectorEnabled = data["settings"]["enabled"];
                        // set the polling interval data in mins
                        var pollIntervalMS = data["settings"]["poll-interval"];
                        var pollInterval = (pollIntervalMS/1000/60) << 0;
                        console.log(" the settings for TrafficStatsCollector are "+collectorEnabled+
                                        " with interval value of "+pollInterval+" minutes");
                        // enable/disable of checkbox based on collector enabled/disabled
                        switch(collectorName) {
                            case "TrafficStatsCollector":
                                self.toggleTrafficPolling(collectorEnabled, pollInterval);
                                break;
                            case "ResourceUtilizationCollector":
                                self.toggleResourceAllocationPolling(collectorEnabled, pollInterval);
                                break;
                            case "SessionCountCollector":
                                self.toggleSessionPolling(collectorEnabled, pollInterval);
                                break;
                            default:
                                break;
                        }
                        
                     },
                    error: function() {
                         console.log("Error retriving polling settings for "+collectorName);
                     }
            } );
        },

        /**
         * Function to be called when the checkbox is selected/deselected for the 
         * Device Monitoring settings
         */
        toggleDeviceMonitoring: function(enabled) {
            console.log("toggle device monitoring status");
            var self = this;
            var enableCheckbox = this.$('#device_monitoring_enable');

            if (enabled !== undefined && typeof enabled === "boolean"){
                console.log("retrieved the setting from server");
                enableCheckbox[0].checked = enabled;
            }

            console.log("checkbox status: "+enableCheckbox.is(":checked"));
            if (enableCheckbox.is(":checked")){
                this.$('#monitor_settings_polling_settings').show();   
                this.$('#monitor_settings_device_status_list').show();
                if (typeof enabled !== "boolean") self.postDeviceMonitoring(true); 
            } else if (typeof enabled === "boolean" && !enabled){
                self.postDeviceMonitoringDisable();
            } else {
                var confirmationDialog = new ConfirmationDialog(self.confirmationDialogConf);
                confirmationDialog.vent.on('yesEventTriggered', function(evt) {
                    confirmationDialog.destroy();
                    self.postDeviceMonitoringDisable();
                    self.postDeviceMonitoring(false);
                });
                confirmationDialog.vent.on('noEventTriggered', function(evt) {
                    enableCheckbox[0].checked = true;
                    confirmationDialog.destroy();
                });                    
                confirmationDialog.build();
            }

        },

        /**
         * Function to be called when the checkbox is selected/deselected for the 
         * traffic polling settings
         */
        toggleTrafficPolling: function(enabled, value) {
            console.log("toggle traffic checkbox");
            var enableCheckbox = this.$('#traffic_polling_enable');
            var inputValue = this.$('#traffic_polling_schedule_input');
            
            if (enabled !== undefined && value !== undefined) {
                this.updateCollectorUISettings(enableCheckbox, inputValue, enabled, value);
            } else {
                this.postUpdatedSettingsForCollector("TrafficStatsCollector", 
                                                enableCheckbox[0].checked,
                                                inputValue[0].value);
            }
        },

        /**
         * Function to be called when the checkbox is selected/deselected for the 
         * Resource Allocation polling settings
         */
        toggleResourceAllocationPolling: function(enabled, value) {
            console.log("toggle resource allocation checkbox");
            var enableCheckbox = this.$('#resource_allocation_polling_enable');
            var inputValue = this.$('#resource_allocation_polling_schedule_input');
            
            if (enabled !== undefined && value !== undefined) {
                this.updateCollectorUISettings(enableCheckbox, inputValue, enabled, value);
            } else {
                this.postUpdatedSettingsForCollector("ResourceUtilizationCollector", 
                                                enableCheckbox[0].checked,
                                                inputValue[0].value);
            }
        },


        /**
         * Function to be called when the checkbox is selected/deselected for the 
         * Session polling settings
         */
        toggleSessionPolling: function(enabled, value) {
            console.log("toggle session checkbox");
            var enableCheckbox = this.$('#session_polling_enable');
            var inputValue = this.$('#session_polling_schedule_input');

            if (enabled !== undefined && value !== undefined) {
                this.updateCollectorUISettings(enableCheckbox, inputValue, enabled, value);
            } else {
                this.postUpdatedSettingsForCollector("SessionCountCollector", 
                                                enableCheckbox[0].checked,
                                                inputValue[0].value);
            }

        },

        /*
        * Function to update the UI form setting to the checkbox status and input value.
        */
        updateCollectorUISettings: function(enableCheckbox, inputValue, enabled, value) {
            enableCheckbox[0].checked = enabled;
            inputValue[0].value = value;
            enableCheckbox.is(":checked") ? inputValue[0].disabled = false : inputValue[0].disabled = true;
        },


        /**
         * Function to validate the polling interval value based on the target id of the event
         */

        validatePollingValue: function(evt){
            var targetId = evt.target.id;
            var val = this.$('#'+targetId);
            console.log (" the value of the event target id is: "+val);

            this.isValidMinute(val[0].value) ? this.postUpdatedPolling(val) : val.parent().addClass("error").siblings().addClass("error");
        },

        /*
        * Function to hide the device monitoring sections of the template if the overall device 
        * monitoring is disabled.
        */
        postDeviceMonitoringDisable: function(){
            this.$('#monitor_settings_polling_settings').hide();   
            this.$('#monitor_settings_device_status_list').hide();
        },

        /*
        * Function to update the collector settings on the server 
        */
        postUpdatedPolling: function(val){
          val.parent().removeClass("error").siblings().removeClass("error");
          
          console.log("post updates to server with new value for "+val[0].id); 
            // update the settings on the server
            switch(val[0].id) {
                case "traffic_polling_schedule_input":
                    this.postUpdatedSettingsForCollector("TrafficStatsCollector", true, val[0].value);
                    break;
                case "resource_allocation_polling_schedule_input":
                    this.postUpdatedSettingsForCollector("ResourceUtilizationCollector", true, val[0].value);
                    break;
                case "session_polling_schedule_input":
                    this.postUpdatedSettingsForCollector("SessionCountCollector", true, val[0].value);
                    break;
                default:
                    break;
            }
        },

        isValidMinute: function(val){
            return (val>0 && val<61);
        },

        /*
        * Function to update the individual devices to have enable/disable of monitoring 
        * based on the grid action.
        */
        updateDeviceEnablement: function(selectedDevices, enable) {
            var self = this;
            console.log("set the devices to update: "+selectedDevices);
            var jsonData  = 
                {
                    "devices" : {
                        "device" : selectedDevices
                    }
                }; 
            // update the jsonData with the selected action of enable/disable by setting the value to true/false
            jsonData.devices.device.forEach (function (deviceObject ) { 
                deviceObject.enable = enable;
                console.log ("deviceobj : "+deviceObject);
                
            });
            console.log ("updated jsonData for POST: "+jsonData);
            $.ajax( {
                   url: "/api/juniper/seci/collection-management/devices",
                    type: 'POST',
                    dataType:"json",
                    data: JSON.stringify(jsonData),
                    headers:{
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    success: function(data) {
                        self.monitorSettingsDeviceListGrid.reloadGrid({resetSelection: true });
                     },
                    error: function() {
                         console.log("Error posting device settings ");
                     }
            } );

        },

        /**
         * Bind the grid menu actions to enable/disable device monitoring 
         * for the selected devices
         *
         */
        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.enableDevice, function(e, selectedRows){
                    console.log('enable device for monitoring');
                    self.updateDeviceEnablement(selectedRows.selectedRows, true);
                })
                .bind(this.actionEvents.disableDevice, function(e, selectedRows){
                    console.log('disableD device for monitoring');
                    self.updateDeviceEnablement(selectedRows.selectedRows, false);
                });
        },

        /*
        * Add device monitoring status grid widget to the monitoring settings view.
        */
        addGridWidget: function(id, gridConf, actionEvents) {
            var self = this;
            var gridContainer = this.$('#' + id);
            var gridElements = gridConf.getValues();
            var gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements,
                actionEvents: actionEvents
            });
            gridWidget.build();
            return gridWidget;
        }

    });

    return MonitorSettings;

});
