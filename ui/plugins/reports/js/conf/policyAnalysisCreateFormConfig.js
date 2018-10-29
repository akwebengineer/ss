/**
 * A Filters Grid Form Config to render the Filters Grid
 *
 * @module LogReportsDefinition
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {
            this.getValues = function() {
                return {
                     "heading": context.getMessage("report_def_form_section_content"),
                     "section_id": "appended_section_id_1",
                        "elements": [
                        {
                        "element_checkbox": true,
                        "id": "checkbox_field",
                        "label": context.getMessage("report_def_form_field_anomalies"),
                        "required": true,
                        "error": context.getMessage("report_def_form_name_error_required"),
                        "values": [
                            {
                                "id": "anomalies1",
                                "name": "anomalies",
                                "value": context.getMessage("report_def_form_field_anomalies_option_shadowed_val"),
                                "label": context.getMessage("report_def_form_field_anomalies_option_shadowed"),
                            },
                            {
                                "id": "anomalies2",
                                "name": "anomalies",
                                "value": context.getMessage("report_def_form_field_anomalies_option_redundant_val"),
                                "label": context.getMessage("report_def_form_field_anomalies_option_redundant")
                            },
                            {
                                "id": "anomalies3",
                                "name": "anomalies",
                                "value": context.getMessage("report_def_form_field_anomalies_option_unused_rules_val"),
                                "label": context.getMessage("report_def_form_field_anomalies_option_unused_rules")
                            },
                            {
                                "id": "anomalies4",
                                "name": "anomalies",
                                "value": context.getMessage("report_def_form_field_anomalies_option_expired_scheduler_val"),
                                "label": context.getMessage("report_def_form_field_anomalies_option_expired_scheduler"),
                            },
                            {
                                "id": "anomalies5",
                                "name": "anomalies",
                                "value": context.getMessage("report_def_form_field_anomalies_option_logging_disabled_val"),
                                "label": context.getMessage("report_def_form_field_anomalies_option_logging_disabled"),
                            }
                        ],
                        "field-help": {
                            "content": context.getMessage('report_def_form_field_anomalies_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        },
                        {
                            "element_description": true,
                            "id": "firewall-policy-grid-report",
                            "label": context.getMessage("report_def_form_firewall_policy"),
                            "name": "firewall-policy-grid-report",
                            "required": true,
                            "field-help": {
                                "content": context.getMessage('report_def_form_firewall_policy_field_help'),
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            }
                          }
                        ]
                };

            };

        };

        return Configuration;
    }
);
