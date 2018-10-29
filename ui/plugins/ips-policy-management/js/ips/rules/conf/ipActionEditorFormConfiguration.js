/**
 * A form configuration object with the parameters required to build
 * IP Action editor for rules in IPS Policies
 *
 * @module ipActionEditorFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var ipActionEditorFormConfiguration = function (context) {
        this.getElements = function () {
            return {
                "title": context.getMessage('ips_rulegrid_column_ipaction'),
                "form_id": "ips_rulegrid_column_ipaction_form",
                "form_name": "ips_rulegrid_column_ipaction_form",
                "title-help": {
                    "content": context.getMessage("ips_rulegrid_column_ip_action_title_info_tip"),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")                    
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("ips_rulegrid_column_ipaction"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "ips_rulegrid_ipaction_editor_form",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "ip-action",
                                "name": "ip-action",
                                "label": context.getMessage('ips_rule_ipAction_editor_ipAction'),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_info_tip')
                                },                                
                                "values": [
                                        {
                                            "label":"None",
                                            "value":""
                                        },                                        
                                        {
                                            "label": "IP Notify",
                                            "value": "ip-notify"
                                        },
                                        {
                                            "label":"IP Close",
                                            "value":"ip-close"
                                        },                                        
                                        {
                                            "label": "IP Block",
                                            "value": "ip-block"
                                        }
                                    ]
                            },
                            {
                                "element_dropdown": true,
                                "id": "target",
                                "name": "target",
                                "label": context.getMessage('ips_rule_ipAction_editor_ipTarget'),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_target_info_tip')
                                },                                
                                "values": [
                                        {
                                            "label":"None",
                                            "value":""
                                        },                                        
                                        {
                                            "label": "Destination Address",
                                            "value": "destination-address"
                                        },
                                        {
                                            "label":"Service",
                                            "value":"service"
                                        },                                        
                                        {
                                            "label": "Source Address",
                                            "value": "source-address"
                                        },
                                        {
                                            "label": "Source Zone",
                                            "value": "source-zone"
                                        },
                                        {
                                            "label":"Source Zone Address",
                                            "value":"source-zone-address"
                                        },                                        
                                        {
                                            "label": "Zone Service",
                                            "value": "zone-service"
                                        }
                                    ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "refresh-timeout",
                                "label": context.getMessage("ips_rule_ipAction_editor_refreshTimeout"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_refresh_timeout_info_tip')
                                },                                
                                 "values": [
                                     {
                                        "id": "refresh-timeout",
                                        "name": "refresh-timeout",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            },
                            {
                                "element_number": true,
                                "id": "timeout",
                                "name": "timeout",
                                "label":  context.getMessage("ips_rule_ipAction_editor_timeoutValue"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_timeout_value_info_tip')
                                },                                
                                "min_value":"0",
                                "max_value":"64800",
                                "placeholder": "",
                                "error": "Please enter a number between 0 and 64800"
                            },
                            {
                                "element_checkbox": true,
                                "id": "alert",
                                "label": context.getMessage("ips_rule_ipAction_editor_logTaken"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_log_taken_info_tip')
                                },                                
                                 "values": [
                                     {
                                        "id": "log",
                                        "name": "log",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "packet-log",
                                "label": context.getMessage("ips_rule_ipAction_editor_logCreation"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_ip_action_log_creation_info_tip')
                                },                                
                                 "values": [
                                     {
                                        "id": "log-create",
                                        "name": "log-create",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return ipActionEditorFormConfiguration;
});