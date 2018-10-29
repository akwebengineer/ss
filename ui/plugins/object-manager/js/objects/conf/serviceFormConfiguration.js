/**
 * A configuration object with the parameters required to build 
 * a form for services
 *
 * @module serviceFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 1024;

        this.getValues = function() {
            return {
                "form_id": "application-create-form",
                "form_name": "application-create-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('application_form_create_infotip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_SERVICE_CREATING")
                },
                "add_remote_name_validation": 'application-name',
                "sections": [
                    {
                        "section_id": "basic-form",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "application-type",
                                "label": context.getMessage('application_protocol_form_object_type'),
                                "values": [
                                    {
                                        "id": "service-choice",
                                        "name": "is-group",
                                        "label": context.getMessage('application_protocol_form_service'),
                                        "value": "Service",
                                        "checked": true
                                    },
                                    {
                                        "id": "service-group-choice",
                                        "name": "is-group",
                                        "label": context.getMessage('application_protocol_form_service_group'),
                                        "value": "Service Group"
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_object_type_infotip')
                                }
                            },
                            {
                                "element_multiple_error": true,
                                "id": "application-name",
                                "name": "name",
                                "label": context.getMessage('name'),
                                "value": "{{name}}",
                                "field-help": {
                                    "content": context.getMessage('application_form_name_infotip')
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
                                        "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$",
                                        "error": context.getMessage('name_error')
                                    }
                                ]
                            },
                            {
                                "element_textarea": true,
                                "id": "application-description",
                                "name": "description",
                                "label": context.getMessage('description'),
                                "value": "{{description}}",
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "descriptionValidator",
                                "field-help": {
                                    "content": context.getMessage('application_form_description_infotip')
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "service-form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "application-protocols",
                                "name": "application-protocols",
                                "label": context.getMessage('application_protocols'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('application_protocols_error'),
                                "required": true,
                                "class": "grid-widget"
                            }
                        ]
                    },
                    {
                        "section_id": "service-group-form",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "application-services",
                                "name": "application-services",
                                "label": context.getMessage('application_services'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('application_services_error'),
                                "class": "list-builder listBuilderPlaceHolder",
                                "field-help": {
                                    "content": context.getMessage('application_group_services_infotip')
                                }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "application-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "application-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});
