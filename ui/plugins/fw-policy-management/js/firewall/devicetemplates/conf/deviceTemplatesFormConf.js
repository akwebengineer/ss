/**
 * A configuration object with the parameters required to build 
 * a form for Creating Device Templates
 *
 * @module Device TemplateFormConfiguration
 * @author Vivek Kumar<vkumar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "devicetemplate-create-form",
                "form_name": "devicetemplate-create-form",
                 "title-help": {
                    "content": context.getMessage("fw_device_templates_create_title_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SD_DEVICE_TEMPLATE_CREATING")
                },
                "on_overlay": true,
                "add_remote_name_validation": 'devicetemplate-name',
                "sections": [
                    {
                        "section_id": "devicetemplate-basic-form",                       
                         "elements": [  {
                                "element_text": true,
                                "id": "devicetemplate-name",
                                "name": "name",
                                "onfocus": "true",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                "help": context.getMessage('name_help'),
                                "error": context.getMessage('name_error'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('fw_device_templates_create_field_name')
                                }
                            },
                             {
                                "element_textarea": true,
                                "id": "devicetemplate-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "help": context.getMessage('description_help'),
                                "error": context.getMessage('description_error'),
                                "pattern": "^.{1,1024}$",
                                "field-help": {
                                    "content": context.getMessage('fw_device_templates_create_field_description')
                                }
                            },
                            {
                                "element_description": true,
                                "id": "devicetemplate-device-family",
                                "name": "device-family",
                                "label": context.getMessage("device_templates_label_devicefamily"),
                                "value": "J/SRX/LN",
                                "field-help": {
                                    "content": context.getMessage('fw_device_templates_create_field_device_family')
                                }  
                             },
                             {
                                "element_description": true,
                                "id": "devicetemplate-os-version",
                                "name": "os-version",
                                "required": true,
                                "error": context.getMessage('device_template_version_error_msg'),
                                "label": context.getMessage('device_templates_label_deviceversion'),
                                "field-help": {
                                    "content": context.getMessage('fw_device_templates_create_field_versions')
                                }
                             },

                              {
                                "element_textarea": true,
                                "id": "devicetemplate-editor",
                                "name": "template-cli",
                                "label": context.getMessage('device_templates_label_templateeditor'),
                                "required": true,
                                "class": "devicetemplate-example",
                                "error": context.getMessage('device_template_editor_error_msg'),
                                "value": "set security policies from-zone $(from-zone-name) to-zone $(to-zone-name) policy $(fw-rule-name) then permit",
                                "inlineButtons":[{
                                    "id": "devicetemplate-validate",
                                    "class": "input_button",
                                    "name": "input_button",
                                    "isInactive": true, 
                                    "value": context.getMessage("devicetemplate_validate_button")
                                }],
                                "field-help": {
                                    "content": context.getMessage('fw_device_templates_create_field_template')
                                }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "devicetemplate-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "devicetemplate-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});
