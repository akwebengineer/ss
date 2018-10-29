/**
 * Form configuration required to render the URL category form using the FormWidget.
 *
 * @module URL Category Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
], function () {

    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "utm-webfiltering-url-category-form",
                "form_name": "utm-webfiltering-url-category-form",
                "sections": [
                    {
                        "section_id": "inapplicable-information-form",
                        "heading": context.getMessage('utm_web_filtering_title_url_category_inapplicable_information'),
                        "elements": [
                        {
                            "element_description": true,
                            "id": "inapplicable-information",
                            "name": "inapplicable-information",
                            "label": ""
                        }
                        ]
                    },
                    {
                        "section_id": "action-list-form",
                        "heading": context.getMessage('utm_web_filtering_title_url_category_information'),
                        "elements": [
                             {
                                 "element_textarea": true,
                                 "id": "utm-webfiltering-deny-action-list",
                                 "name": "deny-action-list",
                                 "value": "{{deny-action-list}}",
                                 "label": context.getMessage('utm_web_filtering_deny_action_list'),
                                 "required": false,
                                 "field-help": {
                                     "content": context.getMessage('utm_web_filtering_deny_action_list_tooltip')
                                 },
                                 "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                 "inlineButtons":[{
                                     "id": "utm-webfiltering-url-category-deny",
                                     "class": "input_button",
                                     "name": "utm-webfiltering-url-category-deny",
                                     "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                 }]
                             },
                             {
                                 "element_textarea": true,
                                 "id": "utm-webfiltering-log-and-permit-action-list",
                                 "name": "log-and-permit-action-list",
                                 "value": "{{log-and-permit-action-list}}",
                                 "label": context.getMessage('utm_web_filtering_log_and_permit_action_list'),
                                 "required": false,
                                 "field-help": {
                                     "content": context.getMessage('utm_web_filtering_log_action_list_tooltip')
                                 },
                                 "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                 "inlineButtons":[{
                                     "id": "utm-webfiltering-url-category-log-and-permit",
                                     "class": "input_button",
                                     "name": "utm-webfiltering-url-category-log-and-permit",
                                     "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                 }]
                             },
                             {
                                 "element_textarea": true,
                                 "id": "utm-webfiltering-permit-action-list",
                                 "name": "permit-action-list",
                                 "value": "{{permit-action-list}}",
                                 "label": context.getMessage('utm_web_filtering_permit_action_list'),
                                 "required": false,
                                 "field-help": {
                                     "content": context.getMessage('utm_web_filtering_permit_action_list_tooltip')
                                 },
                                 "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                 "inlineButtons":[{
                                     "id": "utm-webfiltering-url-category-permit",
                                     "class": "input_button",
                                     "name": "utm-webfiltering-url-category-permit",
                                     "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                 }]
                             },
                             {
                                 "element_textarea": true,
                                 "id": "utm-webfiltering-quarantine-action-list",
                                 "name": "quarantine-action-list",
                                 "value": "{{quarantine-action-list}}",
                                 "label": context.getMessage('utm_web_filtering_quarantine_action_list'),
                                 "field-help": {
                                     "content": context.getMessage('utm_web_filtering_quarantine_action_list_tooltip')
                                 },
                                 "required": false,
                                 "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                 "inlineButtons":[{
                                     "id": "utm-webfiltering-url-category-quarantine",
                                     "class": "input_button",
                                     "name": "utm-webfiltering-url-category-quarantine",
                                     "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                 }],
                                 "class": "quarantine-action-list-settings"
                             },
                        ]
                     }
                ]
            };
        };
    };
    return Configuration;
});