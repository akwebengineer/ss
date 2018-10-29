/**
 *  A configuration object for Update Device form
 *  
 *  @module update device form
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function(option) {
                
                var policy_schedule_later_time = {
                    "elements":[{
                            "element_text": true,
                            "id": "empty",
                            "class": "hide",
                            "name": "empty"
                    }]
                };
                // schedule late time will be visible only on device update
                // and hidden for update configuration in platform

                if(option.isUpdateDevice){
                    policy_schedule_later_time = 
                       {
                        "heading_text": '',
                        "elements": [
                            {
                                "element_description": true,
                                "id": "device_update_schedule",
                                "name": "device_update_schedule",
                                "class": "device_update_schedule"                            },
                            {
                                "element_description": true,
                                "id": "schedulerLabel",
                                "name": "schedulerLabel",
                                "class": "hide schedulerLabel",
                                "value": '',
                                "label": context.getMessage('policy_schedule_later_time')
                            }
                        ]
                    };
                }

                return {
                    "form_id": "device_update_form",
                    "form_name": "device_update_form",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("device_update_tooltip"),
                        "ua-help-text": context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("SECURITY_DIRECTOR_DEVICE_CHANGE_UPDATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": 'context.getMessage("fw_policy_create")',
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "title": context.getMessage("device_update"),
                    "sections": [
                        {
                            "heading_text": '',
                            "elements": [
                                {
                                    "element_checkbox": true,
                                    "id": "checkbox_enable_policy_rematch",
                                    "label": context.getMessage('device_update_policy_rematch_checkbox_label'),
                                    "field-help": {
                                        "content": context.getMessage("device_update_policy_rematch_checkbox_tooltip"),
                                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                                    },
                                    "values": [
                                        {
                                            "id": "checkbox_enable_policy_rematch",
                                            "name": "checkbox_enable_policy_rematch",
                                            "label": context.getMessage('checkbox_enable'),
                                            "value": "false",
                                            "checked": option['enable-policy-rematch-srx-only']
                                        }
                                    ]
                                },
                                {
                                    "id": "placeHolder1",
                                    "class": "placeHolder1",
                                    "name": "placeHolder1"
                                },
                                {
                                    "id": "placeHolder2",
                                    "class": "placeHolder2",
                                    "name": "placeHolder2"
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "checkbox_preserve_session_scOS",
                                    "label": context.getMessage('device_update_preserve_session_screenOS'),
                                    "class": "hide",
                                    "values": [
                                        {
                                            "id": "checkbox_preserve_session_scOS",
                                            "name": "checkbox_preserve_session_scOS",
                                            "label": context.getMessage('checkbox_enable'),
                                            "value": "false",
                                            "checked": option['preserve-session-sc-os']
                                        }
                                    ]
                                }                                
                            ]
                        },
                        {
                           "state_collapsed": false,
                           "heading": context.getMessage('device_update_select_service_types'),
                           "elements": [
                            {
                                "element_checkbox": true,
                                "id": "firewallPolicy",
                                "label": context.getMessage('device_update_firewall_policy'),
                                "field-help": {
                                    "content": context.getMessage("device_update_firewall_policy_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "firewallPolicy",
                                        "name": "firewallPolicy",
                                         "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": false
                                    }
                                ]
                            },
                            {
                               "element_checkbox": true,
                               "id": "nat",
                               "label": context.getMessage('device_update_nat'),
                               "field-help": {
                                   "content": context.getMessage("device_update_nat_tooltip"),
                                   "ua-help-identifier": "alias_for_title_ua_event_binding"
                               },
                               "values": [
                                   {
                                       "id": "nat",
                                       "name": "nat",
                                       "label": context.getMessage('checkbox_enable'),
                                       "value": "false",
                                       "checked": false
                                   }
                               ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "ipsPolicy",
                                "label": context.getMessage('device_update_ips_policy'),
                                "field-help": {
                                    "content": context.getMessage("device_update_ips_policy_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "ipsPolicy",
                                        "name": "ipsPolicy",
                                        "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "vpn",
                                "label": context.getMessage('device_update_vpn'),
                                "field-help": {
                                    "content": context.getMessage("device_update_vpn_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "vpn",
                                        "name": "vpn",
                                        "label": context.getMessage('checkbox_enable'),
                                        "value": "false",
                                        "checked": false
                                    }
                                ]
                            }]
                        },
                        policy_schedule_later_time
                        
                    ],
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "btnUpdate",
                            "name": "DeviceUpdate",
                            "value": "Update"
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
