/**
 *  A configuration object for Ips Signature Static Group form
 *
 *  @module ips static group form
 *  @author wasima<wasima@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "ips_sig_static_group",
                    "form_name": "ips_sig_static_group",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("ips_sig_static_form_title_help"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_SIGNATURE_STATIC_GROUP_CREATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create IPS Signature Static Group help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "add_remote_name_validation": 'ips-sig-name',               
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_text": true,
                                    "name": "name",
                                    "field-help": {
                                        "content": context.getMessage('ips_static_name_tooltip')
                                    },
                                    "label": context.getMessage('ips_sig_static_group_name'),
                                    "id": "ips-sig-name",
                                    "pattern": "^.{0,254}$",
                                    "required": true,
                                    "value": "{{name}}",
                                    "error": context.getMessage('ips_sig_name_length_error'),
                                    "help": context.getMessage('ips_sig_create_name_help')
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-static-grid",
                                    "class": "ips-sig-static-grid",
                                    "field-help": {
                                        "content": context.getMessage('ips_static_grid_tooltip')
                                    },
                                    "name": "ips-sig-static-grid",
                                    "label": context.getMessage('ips_sig_static_group_members'),
                                    "placeholder": context.getMessage('loading')
                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "ips-sig-static-group-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "ips-sig-static-group-save",
                            "name": "create",
                            "value": "OK"
                        }
                    ]
                };

            };

        };

        return Configuration;
    }
);
