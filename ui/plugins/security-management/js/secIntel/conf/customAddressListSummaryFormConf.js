/**
 * A configuration object with the parameters required to build
 * a form for custom address list
 *
 * @module CustomAddressListFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "secintel-custom-address-list-form",
                "form_name": "secintel-custom-address-list-form",
                "on_overlay": true,
                "sections": [
                    {
                         "elements": [
                            {
                                "element_description": true,
                                "id": "secintel-custom-address-list-name",
                                "name": "name",
                                "label": context.getMessage('name'),
                                "value": "{{name}}"
                            },
                            {
                                "element_description": true,
                                "id": "secintel-custom-address-list-description",
                                "name": "description",
                                "label": context.getMessage('description'),
                                "value": "{{description}}"
                            },
                            {
                                "element_description": true,
                                "id": "secintel-custom-address-list-category",
                                "name": "category",
                                "label": context.getMessage('secintel_profile_grid_column_category'),
                                "value": "{{category}}"
                            },
                            {
                                "element_description": true,
                                "id": "secintel-custom-address-list-action",
                                "name": "action",
                                "label": context.getMessage('secintel_policy_actions'),
                                "value": "{{action}}"
                            },
                            {
                                "element_text": true,
                                "id": "secintel-custom-address-lists",
                                "name": "secintel-custom-address-lists",
                                "label": context.getMessage('secintel_policy_global_white_list'),
                                "placeholder": context.getMessage('loading'),
                                "class": "grid-widget"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "secintel-custom-address-list-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});