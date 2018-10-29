/**
 * A configuration object with the parameters required to build a Logging form.
 *
 * @module LoggingFormConf
 * @author Vinamra Jaiswal <vinamra@juniper.net>
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
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text":"Create Policy Profile help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
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
                                    ],
                                    "error": context.getMessage("policy_profiles_form_field_error_selection"),
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_session_initiate')
                                    }
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
                                    ],
                                    "error": "Please make a selection",
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_session_close')
                                    }
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-count",
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_count'), 
                                    },
                                    "label": context.getMessage("policy_profiles_form_field_label_count"),
                                    "values": [
                                        {
                                            "id": "enable-count",
                                            "name": "enable-count",
                                            "label": context.getMessage("enable"),
                                            "value": "enable",
                                            "checked" : false
                                        }
                                    ],
                                    "error": context.getMessage("policy_profiles_form_field_error_selection")
                                }

                            ]
                        },
                        {
                            "heading": context.getMessage("policy_profiles_form_field_heading_alarm-threshold"),
                            "section_id": "firewall_policy_alarm_threshold_section",
                            "elements":[
                                {
                                    "element_number": true,
                                    "id": "alarm-threshold-bytes-second",
                                    "name": "alarm-threshold-bytes-second",
                                    "class": "natproperties",
                                    "label": context.getMessage("policy_profiles_form_field_label_alarm-threshold"),
                                    "min_value":"0",
                                    "max_value":"4294967295",
                                    "value": "{{alarm-threshold-bytes-second}}",
                                    "error": context.getMessage("policy_profiles_form_field_error_range"),
                                    "help": context.getMessage('policy_profiles_form_field_label_alarm-threshold_help'),
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_alarm_bytes'), 
                                    }
                                },
                                {
                                    "element_number": true,
                                    "id": "alarm-threshold-kilo-minute",
                                    "name": "alarm-threshold-kilo-minute",
                                    "class": "natproperties",
                                    "label": context.getMessage("policy_profiles_form_field_label_alarm-threshold_kilobytes"),
                                    "min_value":"0",
                                    "max_value":"4294967295",
                                    "value": "{{alarm-threshold-kilo-minute}}",
                                    "error": context.getMessage("policy_profiles_form_field_error_range"),
                                    "help": context.getMessage('policy_profiles_form_field_label_alarm-threshold_kilobytes_help'),
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_alarm_count'), 
                                    }
                                }
                            ]
                        }
                    ]
                };
            };
        };
            
        return LoggingFormConf;
 });