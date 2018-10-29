/**
 *  A configuration object for Publish Policy form
 *
 *  @module publish policy form
 *  @author wasima<wasima@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "ips_sig_group",
                    "form_name": "ips_sig_group",
                    "title": context.getMessage('ips_sig_static_group_form_title'),
                    "title-help": {
                        "content": context.getMessage('ips_sig_static_group_add_title_tooltip'),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")

                    },
                    "on_overlay": true,
                    "sections": [
                        {
                            "elements": [

                                {
                                    "element_text": true,
                                    "id": "ips-sig-group",
                                    "class": "ipssiggroup",
                                    "name": "ips-sig-group",
                                    "placeholder": context.getMessage('loading')

                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-ipssig-group-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "sd-ipssig-group-save",
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
