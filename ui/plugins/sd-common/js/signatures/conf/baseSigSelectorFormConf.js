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
                    "form_id": "sig_group",
                    "form_name": "sig_group",
                    "title": "",
                    "title-help": {
                        "content": "",
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")
                    },
                    "on_overlay": true,
                    "sections": [
                        {
                            "elements": [

                                {
                                    "element_text": true,
                                    "id": "sig-group",
                                    "class": "siggroupselector",
                                    "name": "sig-group",
                                    "placeholder": context.getMessage('loading')

                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-sig-group-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "sd-sig-group-save",
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
