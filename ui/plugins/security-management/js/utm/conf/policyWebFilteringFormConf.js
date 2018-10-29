/**
 * Form configuration required to render the UTM policy web-filtering form using the FormWidget.
 *
 * @module UTM policy web-filtering Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-policy-web-filtering-form",
                   "form_name": "utm-policy-web-filtering-form",
                    "sections": [
                       {
                            //"heading_text": context.getMessage('utm_policy_web_filtering_text'),
                            "elements": [ {
                                "element_dropdown": true,
                                "id": "dropdown_web_filtering",
                                "name": "dropdown_web_filtering",
                                "label": context.getMessage('utm_policy_http'),
                                "class": "dropdown-webfiltering",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [
                                    {
                                        "label": context.getMessage('utm_policy_create_new_profile'),
                                        "value": "create_new_profile"
                                    }
                                ]
                            },
                            {
                                "element_description": true,
                                "id": "policy_web_filtering_profile_create",
                                "name": "policy_web_filtering_profile_create",
                                "label": ""
                            }]
                       }
                   ]
                };
            };
        };

        return Configuration;
});