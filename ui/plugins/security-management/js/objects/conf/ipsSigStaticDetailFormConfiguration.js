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
                    "title": "IPS Static group Details",
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create IPS Signature Static Group help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                     "title-help": {
                        "content": context.getMessage("ips_signature_detailed_view_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW")
                    },                    
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_description": true,
                                    "name": "name",
                                    "label": context.getMessage('ips_sig_static_group_name'),
                                    "id": "ips-sig-name",
                                    "required": true,
                                    "value": "{{name}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-static-grid",
                                    "class": "ips-sig-static-grid",
                                    "name": "ips-sig-static-grid",
                                    "label": context.getMessage('ips_sig_static_group_members')
                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
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
