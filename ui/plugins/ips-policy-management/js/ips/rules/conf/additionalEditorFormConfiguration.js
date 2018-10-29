/**
 * A form configuration object with the parameters required to build
 * Additional editor for rules in IPS Policies
 *
 * @module additionalEditorFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var additionalEditorFormConfiguration = function (context) {
        this.getElements = function () {
            return {
                "title": context.getMessage('ips_rulegrid_column_additional'),
                "form_id": "ips_rulegrid_column_additional_form",
                "form_name": "ips_rulegrid_column_additional_form",
                "title-help": {
                    "content": context.getMessage("ips_rulegrid_column_additional_title_info_tip"),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("ips_rulegrid_column_additional"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "ips_rulegrid_additional_editor_form",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "severity",
                                "name": "severity",
                                "label": context.getMessage('ips_rule_additional_editor_severity'),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_additional_severity_info_tip')
                                }, 
                                "values": [
                                        {
                                            "label":"None",
                                            "value":""
                                        },                                        
                                        {
                                            "label": "Critical",
                                            "value": "critical"
                                        },
                                        {
                                            "label":"Info",
                                            "value":"info"
                                        },                                        
                                        {
                                            "label": "Major",
                                            "value": "major"
                                        },
                                        {
                                            "label": "Minor",
                                            "value": "minor"
                                        },
                                        {
                                            "label":"Warning",
                                            "value":"warning"
                                        }
                                    ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "terminal",
                                "label": context.getMessage("ips_rule_additional_editor_terminal"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_terminal_info_tip')
                                }, 
                                 "values": [
                                     {
                                        "id": "terminal",
                                        "name": "terminal",
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

    return additionalEditorFormConfiguration;
});