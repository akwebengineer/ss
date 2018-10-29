/**
 * A configuration object with the parameters required to build
 * a form for device profile
 *
 * @module deviceProfileFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var NAME_MAX_LENGTH = 255,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255;

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "utm-device-form",
                "form_name": "utm-device-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('utm_device_profile_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":  context.getHelpKey("UTM_DEVICE_PROFILE_CREATING")
                },
                "add_remote_name_validation": 'utm-device-name',
                "sections": [
                    {
                        "heading": context.getMessage('utm_device_title_general_information'),
                        "elements": [
                            {
                                 "element_multiple_error": true,
                                 "id": "utm-device-name",
                                 "name": "name",
                                 "value": "{{name}}",
                                 "label": context.getMessage('name'),
                                 "required": true,
                                 "field-help": {
                                     "content": context.getMessage('utm_device_profile_name_tooltip')
                                 },
                                 "pattern-error": [
                                     {
                                         "pattern": "validtext",
                                         "error": context.getMessage('name_require_error')
                                     },
                                     {
                                         "pattern": "length",
                                         "max_length": NAME_MAX_LENGTH,
                                         "min_length": NAME_MIN_LENGTH,
                                         "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                                     }
                                 ],
                                 "error": true,
                                 "post_validation": "blankNameValidator",
                                 "notshowvalid": true
                             },
                             {
                                 "element_textarea": true,
                                 "id": "utm-device-description",
                                 "name": "description",
                                 "value": "{{description}}",
                                 "field-help": {
                                     "content": context.getMessage('utm_device_profile_description_tooltip')
                                 },
                                 "label": context.getMessage('description'),
                                 "max_length": DESCRIPTION_MAX_LENGTH,
                                 "post_validation": "lengthValidator",
                                 "required": false
                             },
                            {
                                "element_text": true,
                                "id": "utm-device-devices",
                                "name": "devices",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_devices_tooltip')
                                },
                                "label": context.getMessage('utm_device_devices'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolder"
                            },
                        ]
                    },
                    {
                        "heading": context.getMessage('utm_device_title_anti_spam'),
                        "state_expanded": true,
                        "elements": [
                            {
                                "element_description": true,
                                "id": "as-address-white-list",
                                "name": "as-address-white-list",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_as_white_list_tooltip')
                                },
                                "label": context.getMessage('utm_device_as_address_white_list'),
                                "class": "urlPatterns",
                               "inlineButtons":[{
                                   "id": "as-address-white-list-create",
                                   "class": "pattern_create",
                                   "name": "as-address-white-list-create",
                                   "value": context.getMessage("utm_url_new_pattern_button")
                               }]
                            },
                            {
                                "element_description": true,
                                "id": "as-address-black-list",
                                "name": "as-address-black-list",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_as_black_list_tooltip')
                                },
                                "label": context.getMessage('utm_device_as_address_black_list'),
                                "class": "urlPatterns",
                                "inlineButtons":[{
                                   "id": "as-address-black-list-create",
                                   "class": "pattern_create",
                                   "name": "as-address-black-list-create",
                                   "value": context.getMessage("utm_url_new_pattern_button")
                               }]
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage('utm_device_title_anti_virus'),
                        "state_collapsed": true,
                        "elements": [
                            {
                                "element_textarea": true,
                                "id": "av-mime-white-list",
                                "name": "av-mime-white-list",
                                "label": context.getMessage('utm_device_av_mime_white_list'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_av_mime_white_list_tooltip')
                                },
                                "post_validation": "mimeListValidator",
                                "class": "mime-list",
                                "placeholder": context.getMessage('utm_content_filtering_mime_types_placeholder')
                            },
                            {
                                "element_textarea": true,
                                "id": "av-mime-exception-white-list",
                                "name": "av-mime-exception-white-list",
                                "label": context.getMessage('utm_device_av_mime_exception_white_list'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_av_exception_white_list_tooltip')
                                },
                                "post_validation": "mimeListValidator",
                                "class": "mime-list",
                                "placeholder": context.getMessage('utm_content_filtering_mime_types_placeholder')
                            },
                            {
                                "element_description": true,
                                "id": "av-url-category-white-list",
                                "name": "av-url-category-white-list",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_av_urlcategory_white_list_tooltip')
                                },
                                "label": context.getMessage('utm_device_av_url_white_list'),
                                "class": "urlCategories",
                               "inlineButtons":[{
                                   "id": "av-address-black-list-create",
                                   "class": "input_button",
                                   "name": "av-address-black-list-create",
                                   "value": context.getMessage("utm_url_new_category_button")
                               }]
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage('utm_device_title_web_filtering'),
                        "state_collapsed": true,
                        "elements": [
                            {
                                "element_description": true,
                                "id": "wf-url-category-white-list",
                                "name": "wf-url-category-white-list",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_wf_urlcategory_white_list_tooltip')
                                },
                                "label": context.getMessage('utm_device_wf_url_white_list'),
                                "class": "urlCategories",
                                "inlineButtons":[{
                                   "id": "wf-address-white-list-create",
                                   "class": "input_button",
                                   "name": "wf-address-white-list-create",
                                   "value": context.getMessage("utm_url_new_category_button")
                               }]
                            },
                            {
                                "element_description": true,
                                "id": "wf-url-category-black-list",
                                "name": "wf-url-category-black-list",
                                "field-help": {
                                    "content": context.getMessage('utm_device_profile_wf_urlcategory_black_list_tooltip')
                                },
                                "label": context.getMessage('utm_device_wf_url_black_list'),
                                "class": "urlCategories",
                                "inlineButtons":[{
                                   "id": "wf-address-black-list-create",
                                   "class": "input_button",
                                   "name": "wf-address-black-list-create",
                                   "value": context.getMessage("utm_url_new_category_button")
                               }]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-device-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-device-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});