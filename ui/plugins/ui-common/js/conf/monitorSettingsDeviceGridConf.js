/**
 * A configuration object with the parameters required to build
 * a grid for device list
 *
 * @module monitorSettingsDeviceGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../common/restApiConstants.js',
'../common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {
    var Configuration = function(context) {

        /**
         *  format/ append image before display of the Configuration Status
         *  @params cellValue, options, rowObject
         *  returns html [image + string]
         */
        var formatEnableStatusColumn = function(cellValue, options, rowObject) {
            var value;
            if (cellValue) {
                value = context.getMessage('monitor_settings_enabled');
            } else {
                value = context.getMessage('monitor_settings_disabled');
            }
            return '<img id="device_monitoring_status_' + cellValue + '" class="device_monitoring_status_image" src="' 
                        + context.ctx_root + '/images/transparent.png"/> <span>' + value + '</span>';
        };

        var tooltipFormatter = function(cellvalue, options, rowObject) {
            return '<span data-tooltip="'+cellvalue+'">' + cellvalue + '</span>';
        };

        this.getValues = function() {

            return {
                "tableId": "monitor_settings_device_grid",
                "height": "300px",
                "showWidthAsPercentage": true,
                "scroll":true,
                "jsonId": "sd-device-id",
                "url": "/api/juniper/seci/collection-management/devices",
                "jsonRoot": "devices.device",
                "jsonRecords": function(data) {
                    return data['devices'][RestApiConstants.TOTAL_PROPERTY];
                },
                "title-help": {
                    "content": context.getMessage('signature_database_device_grid_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": "monitor_settings_device_grid_help_identifier"
                },
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "multiselect": "true",
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "actionButtons":{
                    "defaultButtons": { // overwrite default CRUD grid buttons
                    },
                   "customButtons":[
                        {
                          "button_type": true,
                          "label": context.getMessage( "monitor_settings_enable" ),
                          "key": "enableDevice",
                          "secondary": true
                        },
                        {
                          "button_type": true,
                          "label": context.getMessage( "monitor_settings_disable" ),
                          "key": "disableDevice",
                          "secondary": true
                        }
                    ]
                },

                "contextMenu": {
                    "custom":[{
                            "label":context.getMessage('monitor_settings_enable'),
                            "key":"enableDevice"
                        },{
                            "label":context.getMessage('monitor_settings_disable'),
                            "key":"disableDevice"
                        }]
                },

                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('signature_database_device_grid_device_name'),
                        "width": 100
                    },
                    {
                        "index": "device-ip",
                        "name": "device-ip",
                        "label": "IP Address",
                        "width": 100
                    },
                    {
                        "index": "platform",
                        "name": "platform",
                        "label": context.getMessage('signature_database_detectors_grid_platform'),
                        "width": 120
                    },
                    {
                        "index": "software-release",
                        "name": "software-release",
                        "hidden": true
                    },
                    {
                        "index": "enable",
                        "name": "enable",
                        "label": "Status",
                        "formatter": formatEnableStatusColumn,
                        "width": 120
                    }
                ]
            };
        };
    };

    return Configuration;
});
