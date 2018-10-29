/**
 * A configuration object with the parameters required to build
 * a form for url category
 *
 * @module urlCategoryFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var NAME_MAX_LENGTH = 59,
        NAME_MIN_LENGTH = 1;

    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 255;

        this.getValues = function() {

            return {
                "form_id": "utm-urlcategory-form",
                "form_name": "utm-urlcategory-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('utm_url_category_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_CUSTOM_URL_CATEGORY_LIST_CREATING")
                },
                "add_remote_name_validation": 'utm-urlcategory-name',
                "sections": [
                    {
                        //"heading_text": context.getMessage('utm_url_category_title_general_information'),
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "utm-urlcategory-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "notshowvalid": true,
                                "field-help": {
                                    "content": context.getMessage("utm_url_category_name_tooltip")
                                },
                                "required": true,
                                "error": true,
                                "pattern-error": [
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage('name_require_error')
                                    },
                                    {
                                        "regexId": "regex1",
                                        "pattern": "^[a-zA-Z_][a-zA-Z0-9-_]{0,58}$",
                                        "error": context.getMessage('utm_url_name_error', [NAME_MAX_LENGTH])
                                    }
                                ]
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-urlcategory-description",
                                "name": "description",
                                "value": "{{description}}",
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "field-help": {
                                    "content": context.getMessage("utm_url_category_description_tooltip")
                                },
                                "label": context.getMessage('description'),
                                "required": false
                            },
                            {
                                
                                "element_text": true,
                                "id": "utm-urlcategory-patterns",
                                "name": "utm-urlcategory-patterns",
                                "label": context.getMessage('utm_url_category_grid_column_url_patterns'),
                                "placeholder": context.getMessage('loading'),
                                "field-help": {
                                    "content": context.getMessage("utm_url_category_patterns_tooltip")
                                },
                                "class": "list-builder listBuilderPlaceHolder",
                                "required": true
                            },
                            {
                                
                                "element_description": true,
                                "id": "utm-urlcategory-pattern",
                                "name": "utm-urlcategory-pattern",
                                "label": ""
                            }
                        ]
                   }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-urlcategory-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-urlcategory-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
