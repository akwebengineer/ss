/**
 * A Filters Grid Form Config to render the Logging Devices
 *
 * @module LogReportsDefinition
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "logging_devices",
                    "title": context.getMessage("logging_devices"),
                    "form_name": "logging_devices",
                    "title-help": {
                    "content": context.getMessage("logging_devices_title_help"),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("LOG_MGMT_DEVICE_MAIN_FIELD")
                    },
                    "sections": [
                    {
                        "elements": [
                        {
                            "element_text": true,
                            "id": "logging_devices_list",
                            "class": "logging_devices_list",
                            "name": "logging_devices_list",
                            "placeholder": context.getMessage('Loading ...')
                        },
                        {
                            "element_text": true,
                            "id": "assigned_devices_list",
                            "class": "assigned_devices_list",
                            "name": "assigned_devices_list",
                            "placeholder": context.getMessage('Loading ...')
                        }

                        ]
                    }]

                };

            };

        };

        return Configuration;
    }
);
