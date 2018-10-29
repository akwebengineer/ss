/**
 *  A configuration object for Preview configuration Device form
 *
 *  @module Preview Configuration device form
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function(option) {

                return {
                    "form_id": "device_preview_conf_form",
                    "form_name": "device_preview_conf_form",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("device_preview_conf_tooltip"),
                        "ua-help-text": context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("SECURITY_DIRECTOR_DEVICE_CONFIGURATION_PREVIEWING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": context.getMessage("device_preview_conf"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "title": context.getMessage("device_preview_conf"),
                    "sections": [
                        {
                           "state_collapsed": false,
                           "heading": context.getMessage('device_update_select_service_types'),
                           "elements": [
                            {
                                "element_checkbox": true,
                                "id": "firewallPolicy",
                                "label": context.getMessage('device_update_firewall_policy'),
                                "field-help": {
                                    "content": context.getMessage("device_preview_conf_firewall_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "firewallPolicy",
                                        "name": "firewallPolicy",
                                        "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": true
                                    }
                                ]
                            },
                            {
                               "element_checkbox": true,
                               "id": "nat",
                               "label": context.getMessage('device_update_nat'),
                               "field-help": {
                                   "content": context.getMessage("device_preview_conf_nat_tooltip"),
                                   "ua-help-identifier": "alias_for_title_ua_event_binding"
                               },
                               "values": [
                                   {
                                       "id": "nat",
                                       "name": "nat",
                                       "label": context.getMessage('checkbox_enable'),
                                       "value": "false",
                                       "checked": true
                                   }
                               ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "ipsPolicy",
                                "label": context.getMessage('device_update_ips_policy'),
                                "field-help": {
                                    "content": context.getMessage("device_preview_conf_ips_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "ipsPolicy",
                                        "name": "ipsPolicy",
                                        "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": true
                                    }
                                ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "vpn",
                                "label": context.getMessage('device_update_vpn'),
                                "field-help": {
                                    "content": context.getMessage("device_preview_conf_vpn_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "vpn",
                                        "name": "vpn",
                                        "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": true
                                    }
                                ]
                            }]
                        }

                    ],
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "btnPreviewConf",
                            "name": "DevicePreviewConf",
                            "value": context.getMessage('ok')
                        }
                    ],
                    "cancel_link": {
                        "id": "linkUpdateCancel",
                        "value": context.getMessage('cancel')
                    }
                };

            };

        };

    return Configuration;
});
