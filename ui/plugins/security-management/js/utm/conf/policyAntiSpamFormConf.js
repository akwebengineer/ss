/**
 * Form configuration required to render UTM policy Anti-Spam form using the FormWidget.
 *
 * @module UTM policy Anti-Spam Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-policy-anti-spam-form",
                   "form_name": "utm-policy-anti-spam-form",
                   "sections": [
                       {
                            "heading_text": context.getMessage('utm_policy_anti_spam_text'),
                            "elements": [{
                                "element_dropdown": true,
                                "id": "dropdown_anti_spam",
                                "name": "dropdown_anti_spam",
                                "label": context.getMessage('utm_policy_smtp'),
                                "class": "dropdown-antispam",
                                "allowClearSelection": true,
                                "placeholder": context.getMessage('utm_dropdown_placeholder_common'),
                                "values": [{
                                    "label": context.getMessage('utm_policy_create_new_profile'),
                                    "value": "create_new_profile"
                                }]
                            }, {
                                "element_description": true,
                                "id": "policy_anti_spam_profile_create",
                                "name": "policy_anti_spam_profile_create",
                                "label": ""
                            }]
                       }
                    ]
                };
            };
        };

        return Configuration;
});