/**
 *  A configuration object for Compare Policy
 *
 *  @module 
 *  @author wasima<wasima@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context,obj) {

            this.getValues = function() {

                return {
                    "form_id": "compare_policy",
                    "form_name": "compare_policy",
                    "on_overlay": true,
                    "title": context.getMessage("compare_policy"),
                    "title-help": {
                        "content": context.getMessage("compare_policy_title_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("POLICY_COMPARING")
                    },
                    "sections": [
                        {
                            "elements": [
                            {
                                "element_description": true,
                                "label": "Policy Name",
                                "id": "policy-name",
                                "value" : "{{value}}"
                            }
                      
                            ]
                        },{                      
                            "heading": context.getMessage("compare_with"),
                             "elements":[
                            {
                                    "element_text": true,
                                    "id": "compare-policy",
                                    "class": "comparePolicy",
                                    "name": "comparePolicy",
                                    "placeholder": context.getMessage('loading')

                                }
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "compare-policy-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "compare-policy-save",
                            "name": "create",
                            "value": "Compare"
                        }
                    ]
                };

            };
        };

        return Configuration;
    }
);
