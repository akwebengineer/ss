/**
 * A configuration object with the parameters required to build 
 * a form for variable object
 *
 * @module variableObjectFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function(variableType) {
            var formTitleTips = context.getMessage('variable_object_form_address_tooltip'),
                deviceSelectionTips = context.getMessage('variable_object_device_selection_address_tooltip');
            if (variableType === "zone") {
                formTitleTips = context.getMessage('variable_object_form_zoneset_tooltip');
                deviceSelectionTips = context.getMessage('variable_object_device_selection_zoneset_tooltip');
            }
            return {
                "form_id": "variable-object-form",
                "form_name": "variable-object-form",
                "on_overlay": true,
                "title-help": {
                    "content": formTitleTips,
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": "variable_object_form_help_identifier"
                },
                "sections": [{
                    "section_id": "variable-context-value",
                    "elements": [{
                        "element_text": true,
                        "id": "device-selection",
                        "name": "device-selection",
                        "label": context.getMessage('variable_context_value'),
                        "placeholder": context.getMessage('loading'),
                        "field-help": {
                            "content": deviceSelectionTips
                        },
                        "required": true,
                        "class": "list-builder listBuilderPlaceHolder"
                    }]
                }, {
                    "section_id": "variable-address-selection",
                    "elements": [{
                        "element_text": true,
                        "id": "address-selection-variable",
                        "name": "address-selection-variable",
                        "label": context.getMessage('variable_address'),
                        "required": true,
                        "field-help": {
                            "content": context.getMessage('variable_object_address_selection_tooltip')
                        },
                        "value": "{{variable-address.name}}",
                        "error": context.getMessage('require_error')
                    }]
                }, {
                    "section_id": "variable-zone-selection",
                    "elements": [{
                        "element_dropdown": true,
                        "id": "zone-selection",
                        "name": "zone-selection",
                        "field-help": {
                            "content": context.getMessage('variable_object_zoneset_selection_tooltip')
                        },
                        "label": context.getMessage('variable_zone'),
                        "required": true,
                        "error": context.getMessage('require_error')
                    }]
                }],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "variable-object-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [{
                        "id": "variable-object-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});