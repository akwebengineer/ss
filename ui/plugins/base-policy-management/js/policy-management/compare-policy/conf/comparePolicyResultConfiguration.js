/**
 *  A configuration object for Compare Policy
 *
 *  @module 
 *  @author wasima<wasima@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "compare_policy_result",
                    "form_name": "compare_policy_result",
                    "on_overlay": true,
                    "title": context.getMessage("compare_policy"),
                    "sections": [
                    {
                        "elements": [{
                            "element_description": true,
                            "id": "buttons_toolbar"
                        }
                        ]
                    }],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "buttons": [{
                        "id": "compare-result-save",
                        "name": "create",
                        "value": "OK"
                    }]
                };

            };
        };

        return Configuration;
    }
);