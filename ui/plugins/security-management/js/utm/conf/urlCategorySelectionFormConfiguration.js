/**
 * A configuration object with the parameters required to build 
 * a form for selecting URL category
 *
 * @module urlCategorySelectionFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('utm_url_category_selection_form_title'),
                "form_id": "utm-url-category-selection-form",
                "form_name": "utm-url-category-selection-form",
                "on_overlay": true,
                "sections": [
                    {
                        "heading": "",
                        "section_id": "utm-url-category",
                        "state_expanded": true,
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "utm-url-category-selection-filter",
                                "label": context.getMessage('utm_url_category_selection_filter'),
                                "values": [
                                    {
                                        "id": "utm-url-category-selection-all",
                                        "name": "utm-url-category-selection-filter",
                                        "label": context.getMessage('utm_url_category_selection_all'),
                                        "value": "all",
                                        "checked": true
                                    },
                                    {
                                        "id": "utm-url-category-selection-custom",
                                        "name": "utm-url-category-selection-filter",
                                        "label": context.getMessage('utm_url_category_selection_custom'),
                                        "value": "custom"
                                    },
                                    {
                                        "id": "utm-url-category-selection-websense",
                                        "name": "utm-url-category-selection-filter",
                                        "label": context.getMessage('utm_url_category_selection_websense'),
                                        "value": "websense"
                                    }
                                ]
                            },
                            {
                                "element_text": true,
                                "id": "utm-url-category-selection",
                                "name": "utm-url-category-selection",
                                "label": context.getMessage('utm_url_category_selection_list_label'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolder"
                            },
                            {
                                "element_description": true,
                                "id": "utm-url-category-create-button-place",
                                "name": "utm-url-category-create-button-place"
                            },
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-url-category-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-url-category-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});