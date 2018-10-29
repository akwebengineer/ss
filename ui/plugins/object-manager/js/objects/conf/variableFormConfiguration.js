/**
 * A configuration object with the parameters required to build 
 * a form for variables
 *
 * @module variableFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 255;

        this.getValues = function() {
            return {
                "form_id": "variable-create-form",
                "form_name": "variable-create-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('variable_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_VARIABLE_DEFINITION_CREATING")
                },
                "add_remote_name_validation": 'variable-name',
                "sections": [{
                    "section_id": "basic-form",
                    "elements": [{
                        "element_multiple_error": true,
                        "id": "variable-name",
                        "name": "name",
                        "label": context.getMessage('name'),
                        "value": "{{name}}",
                        "field-help": {
                            "content": context.getMessage('variable_create_name_tooltip')
                        },
                        "required": true,
                        "error": true,
                        "pattern-error": [{
                            "pattern": "validtext",
                            "error": context.getMessage('name_require_error')
                        }, {
                            "regexId": "regex1",
                            "pattern": "^[a-zA-Z0-9_\\-]{0,255}$",
                            "error": context.getMessage('variable_name_error')
                        }]
                    }, {
                        "element_textarea": true,
                        "id": "variable-description",
                        "name": "description",
                        "label": context.getMessage('description'),
                        "value": "{{description}}",
                        "field-help": {
                            "content": context.getMessage('variable_create_description_tooltip')
                        },
                        "max_length": DESCRIPTION_MAX_LENGTH,
                        "post_validation": "lengthValidator"
                    }, {
                        "element_radio": true,
                        "id": "variable-type",
                        "field-help": {
                            "content": context.getMessage('variable_create_type_tooltip')
                        },
                        "label": context.getMessage('type'),
                        "values": [{
                            "id": "variable-type-address",
                            "name": "variable-object-type",
                            "label": context.getMessage('variable_object_type_address'),
                            "value": "address",
                            "checked": true
                        }, {
                            "id": "variable-type-zone",
                            "name": "variable-object-type",
                            "label": context.getMessage('variable_object_type_zone'),
                            "value": "zone"
                        }]
                    }]
                }, {
                    "section_id": "variable-address-form",
                    "elements": [{
                        "element_dropdown": true,
                        "id": "variable-default-address",
                        "name": "variable-default-address",
                        "label": context.getMessage('variable_default_address'),
                        "required": true,
                        "field-help": {
                            "content": context.getMessage('variable_create_default_address_tooltip')
                        },
                        "error": context.getMessage('require_error'),
                        "inlineButtons":[{
                            "id": "variable-add-address",
                            "class": "input_button",
                            "name": "input_button",
                            "value": context.getMessage("variable_add_address_button") 
                        }]
                    }, {
                        "element_text": true,
                        "id": "variable-address-grid",
                        "name": "variable-address-grid",
                        "label": context.getMessage('variable_address_grid_label'),
                        "placeholder": context.getMessage('loading'),
                        "required": true
                    }]
                }, {
                    "section_id": "variable-zone-form",
                    "elements": [{
                        "element_text": true,
                        "id": "variable-default-zone",
                        "name": "variable-default-zone",
                        "label": context.getMessage('variable_default_zone'),
                        "pattern": "^[a-zA-Z0-9_\\-]{0,32}$",
                        "field-help": {
                            "content": context.getMessage('variable_create_default_zone_tooltip')
                        },
                        "required": true,
                        "value": "trust",
                        "error": context.getMessage('variable_default_zone_error')
                    }, {
                        "element_text": true,
                        "id": "variable-zone-grid",
                        "name": "variable-zone-grid",
                        "label": context.getMessage('variable_zone_grid_label'),
                        "placeholder": context.getMessage('loading'),
                        "required": true
                    }]
                }],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "variable-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [{
                    "id": "variable-save",
                    "name": "save",
                    "value": context.getMessage('ok')
                }]
            };
        };
    };
    return Configuration;
});