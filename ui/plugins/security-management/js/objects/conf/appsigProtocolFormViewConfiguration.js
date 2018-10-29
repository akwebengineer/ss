/**
 * Created by vinutht on 5/28/15.
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_appsig_protocol_form",
                    "form_name": "sd_appsig_protocol_form",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("app_sig_protocol_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Add Protocol help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                        {
                            "heading_text": context.getMessage('app_sig_create_intro'),
                            "elements": [
                                {
                                    "element_dropdown": true,
                                    "name": "context",
                                    "label": "Context",
                                    "id": "app-sig-protocol-context",
                                    "required":true,
                                    "error":"Please make a selection"
                                },
                                {
                                    "element_dropdown": true,
                                    "name": "direction",
                                    "label": "Direction",
                                    "id": "app-sig-protocol-direction",
                                    "values": [
                                        {
                                            "label": "Any",
                                            "value": "any"
                                        }, {
                                            "label": "Client to Server",
                                            "value": "cts"
                                        }, {
                                            "label": "Server to Client",
                                            "value": "stc"
                                        }
                                    ]
                                },
                                {
                                    "element_textarea": true,
                                    "name": "pattern",
                                    "id": "app-sig-protocol-pattern",
                                    "label": "Pattern",                                                                        
                                    "help": context.getMessage('app_sig_create_pattern_help'),                                                                    
                                    "value": "{{pattern}}",
                                    "required":true,
                                    "error":"Please enter valid pattern"
                                }
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-appsig-protocol-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "sd-appsig-protocol-save",
                            "name": "create",
                            "value": "OK"
                        }
                    ]
                };
            }
        };

        return Configuration;
    }
);
