/**
 * Created by wasima on 5/28/15.
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("ips_sig_sig_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Add Signature help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                        {
                            "heading_text": context.getMessage('ips_sig_protocol_create_intro'),
                            "elements": [
                                {
                                    "element_description": true,
                                    "id": "ips-sig-no",
                                    "name": "number",
                                    "label": context.getMessage('ips_sig_grid_column_signo'),
                                    "value":"{{number}}",
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_number_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "name": "context",
                                    "id" : "ips-sig-context",
                                    "label": context.getMessage('ips_sig_grid_column_context'),
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_context_tooltip')
                                    }                  
                                },
                                {
                                    "element_description": true,
                                    "name": "direction",
                                    "label": context.getMessage('ips_sig_grid_column_direction'),
                                    "id": "ips-sig-direction",
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_direction_tooltip')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "name": "pattern",
                                    "id": "ips-sig-pattern",
                                    "label": context.getMessage('ips_sig_grid_column_pattern'),
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_pattern_tooltip')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "name": "regex",
                                    "id": "ips-sig-regex",
                                    "label": context.getMessage('ips_sig_grid_column_regex'),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_create_regex_tooltip')
                                    }                                                               
                                },
                                {
                                    "element_checkbox": true,
                                    "label": context.getMessage('ips_sig_grid_column_negated'),
                                    "id": "ips-negated",
                                    "values": [
                                        {
                                            "name": "ips-sig-negated-enable",
                                            "id": "ips-sig-negated-enable",                                           
                                            "label": "",
                                            "value": "enable"
                                        }
                                    ],
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_negated_tooltip')
                                    }
                                }                                
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "ips-sig-grid-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "ips-sig-context-save",
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
