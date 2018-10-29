/**
 * A configuration object with the parameters required to build 
 * a form for Creating PortSet
 *
 * @module portSetCreateFormConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "portset-create-form",
                "form_name": "portset-create-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage("portsets_create_title_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("NAT_POLICY_PORT_SET_CREATING")
                },
                "add_remote_name_validation": 'portset-name',
                "sections": [
                    {
                        "section_id": "portset-basic-form",                       
                         "elements": [  {
                                "element_text": true,
                                "id": "portset-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                "error": context.getMessage('name_error'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('portsets_name_tooltip')
                                 }
                            },
                            {
                                "element_textarea": true,
                                "id": "portset-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "max_length": 255,
                                "post_validation": "descriptionValidator",
                                "field-help": {
                                    "content": context.getMessage('portsets_description_tooltip')
                                 }
                            },
                            {
                                "element_textarea": true,
                                "id": "portset-ports",
                                "name": "ports",
                                "value": "{{ports}}",
                                "pattern": "^[0-9\-,\n]+$",
                                "placeholder": context.getMessage('portset_create_ports_ports-or-portranges_placeholder'),
                                "label": context.getMessage('portset_create_ports'),
                                "error": context.getMessage('portset_create_ports_error'),
                                "post_validation": "validatePortRange",
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('portsets_port_tooltip')
                                 }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "portset-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "portset-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});
