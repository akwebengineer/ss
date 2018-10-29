/**
 * A form configuration object with the parameters required to build
 * notification editor for rules in IPS Policies
 *
 * @module notificationEditorFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var notificationEditorFormConfiguration = function (context) {
        this.getElements = function () {
            return {
                "title": context.getMessage('ips_rulegrid_column_notification'),
                "form_id": "ips_rulegrid_column_notification_form",
                "form_name": "ips_rulegrid_column_notification_form",
                "title-help": {
                    "content": context.getMessage("ips_rulegrid_column_notification_title_info_tip"),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("ips_rulegrid_column_notification"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "ips_rulegrid_notification_editor_form",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "log-attacks",
                                "label": context.getMessage("ips_rule_notification_editor_attackLogging"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_attack_logging_info_tip')
                                },
                                 "values": [
                                     {
                                        "id": "log-attacks",
                                        "name": "log-attacks",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "alert",
                                "label": context.getMessage("ips_rule_notification_editor_alertFlag"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_alert_flag_info_tip')
                                },

                                 "values": [
                                     {
                                        "id": "alert",
                                        "name": "alert",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "packt-log",
                                "label": context.getMessage("ips_rule_notification_editor_logPackets"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_log_packets_info_tip')
                                },

                                 "values": [
                                     {
                                        "id": "packet-log",
                                        "name": "packet-log",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked" : false
                                     }
                                 ]
                            },
                            {
                                "element_number": true,
                                "id": "pre-attack",
                                "name": "pre-attack",
                                "label":  context.getMessage("ips_rule_notification_editor_packetsBefore"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_packets_before_info_tip')
                                },
                                "min_value":"1",
                                "max_value":"255",
                                "placeholder": "",
                                "error": "Please enter a number between 1 and 255"
                            },
                            {
                                "element_number": true,
                                "id": "post-attack",
                                "name": "post-attack",
                                "label": context.getMessage("ips_rule_notification_editor_packetsAfter"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_packets_after_info_tip')
                                },

                                "min_value":"1",
                                "max_value":"255",
                                "placeholder": "",
                                "error": "Please enter a number between 1 and 255"
                            },
                            {
                                "element_number": true,
                                "id": "post-attack-timeout",
                                "name": "post-attack-timeout",
                                "label": context.getMessage("ips_rule_notification_editor_postWindowTimeout"),
                                "field-help": {
                                    "content": context.getMessage('ips_rulegrid_column_notification_post_window_timeout_info_tip')
                                },
                                "min_value":"1",
                                "max_value":"1800",
                                "placeholder": "",
                                "error": "Please enter a number between 1 and 1800"
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

    return notificationEditorFormConfiguration;
});