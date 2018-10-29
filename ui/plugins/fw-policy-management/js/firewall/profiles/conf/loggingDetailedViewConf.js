/**
 * A configuration object with the parameters required to build a Logging form.
 *
 * @module LoggingDetailedViewConf
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define ([
    ],function(){
        var LoggingFormConf = function(context){

            this.getValues = function (){

                return {
                    "form_id" : "logging-configuration",
                    "form_name" : "logging-configuration",
                     "title-help": {
                        "content": context.getMessage("logging_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_checkbox": true,
                                    "id": "enable-log-session-init",
                                    "label": context.getMessage("policy_profiles_form_field_label_log-session-init"),
                                    "values": [
                                        {
                                            "id": "enable-log-session-init",
                                            "name": "enable-log-session-init",
                                            "label": "Log",
                                            "value": "enable"
                                        }
                                    ]
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-log-session-close",
                                    "label": context.getMessage("policy_profiles_form_field_label_log-session-close"),
                                    "values": [
                                        {
                                            "id": "enable-log-session-close",
                                            "name": "enable-log-session-close",
                                            "label": "Log",
                                            "value": "enable"
                                        }
                                    ]
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-count",
                                    "label": context.getMessage("policy_profiles_form_field_label_count"),
                                    "values": [
                                        {
                                            "id": "enable-count",
                                            "name": "enable-count",
                                            "label": context.getMessage("enable"),
                                            "value": "enable",
                                            "checked" : false
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            "heading": context.getMessage("policy_profiles_form_field_heading_alarm-threshold"),
                            "section_id": "firewall_policy_alarm_threshold_section",
                            "elements":[
                                {
                                    "element_description": true,
                                    "id": "alarm-threshold-bytes-second",
                                    "name": "alarm-threshold-bytes-second",
                                    "label": context.getMessage("policy_profiles_form_field_label_alarm-threshold"),
                                    "value": "{{per-second-alarm-threshold}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "alarm-threshold-kilo-minute",
                                    "name": "alarm-threshold-kilo-minute",
                                    "label": context.getMessage("policy_profiles_form_field_label_alarm-threshold_kilobytes"),
                                    "value": "{{per-minute-alarm-threshold}}"
                                }
                            ]
                        }
                    ]
                };
            };
        };
            
        return LoggingFormConf;
 });