/**
 *  A configuration object for Publish Policy form
 *
 *  @module publish policy form
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "app_sig_group",
                    "title": context.getMessage('app_sig_group_add'),
                    "title-help": {
                    "content": context.getMessage('appsigs_add_title_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                    },
                    "form_name": "app_sig_group",
                    "on_overlay": true,
                    "sections": [
                        {
                            "elements": [

                                {
                                    "element_text": true,
                                    "id": "app-sig-group",
                                    "class": "appsiggroup",
                                    "name": "app-sig-group",
                                    "placeholder": context.getMessage('loading')

                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-appsig-group-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "sd-appsig-group-save",
                            "name": "create",
                            "value": context.getMessage('ok')
                        }
                    ]
                };

            };

        };

        return Configuration;
    }
);
