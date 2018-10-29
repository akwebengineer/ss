/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
], function () {
    var NAME_MAX_LENGTH = 29,
        NAME_MIN_LENGTH = 1,
        ACCOUNT_MAX_LENGTH = 255,
        SERVER_MAX_LENGTH = 255,
        PORT_MIN_VALUE = 1024,
        PORT_MAX_VALUE = 65535,
        SOCKETS_MIN_VALUE = 1,
        SOCKETS_MAX_VALUE = 8,
        TIMEOUT_MIN_VALUE = 1,
        TIMEOUT_MAX_VALUE = 1800,
        CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH = 512,
        DEFAULT_TIMEOUT = 15,
        DEFAULT_PORT = 15868,
        DEFAULT_SOCKETS = 8,
        DESCRIPTION_MAX_LENGTH = 255;

    // Engine Type
    var ENGINE_TYPE_JUNIPER_ENHANCED = "JUNIPER_ENHANCED",
        ENGINE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        ENGINE_TYPE_WEBSENSE_REDIRECT = "WEBSENSE";

    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "utm-webfiltering-general-form",
                "form_name": "utm-webfiltering-general-form",
                "add_remote_name_validation": 'utm-webfiltering-name',
                "sections": [
                    {
                        "section_id": "general-form",
                        "heading": context.getMessage('utm_web_filtering_title_general_information'),
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "utm-webfiltering-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "required": true,
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
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_name_tooltip')
                                },
                                "error": true,
                                "post_validation": "blankNameValidator",
                                "notshowvalid": true
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-webfiltering-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_description_tooltip')
                                },
                                "post_validation": "lengthValidator",
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "required": false
                            },
                            {
                                "element_dropdown": true,
                                "id": "engine-type",
                                "name": "profile-type",
                                "label": context.getMessage('utm_web_filtering_engine_type'),
                                "values": [
                                    {
                                        "label": context.getMessage('utm_web_filtering_engine_type_juniper_enhanced'),
                                        "value": ENGINE_TYPE_JUNIPER_ENHANCED
                                    },
                                    {
                                        "label": context.getMessage('utm_web_filtering_engine_type_surf_control'),
                                        "value": ENGINE_TYPE_SURF_CONTROL
                                    },
                                    {
                                         "label": context.getMessage('utm_web_filtering_engine_type_websense_redirect'),
                                         "value": ENGINE_TYPE_WEBSENSE_REDIRECT
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_engine_type_tooltip')
                                },
                                "required": true
                            },
                            {
                                "element_checkbox": true,
                                "id": "enable-safe-search",
                                "label": context.getMessage('utm_web_filtering_safe_search'),
                                "values": [
                                    {
                                        "id": "safe-search",
                                        "name": "safe-search",
                                        "label": context.getMessage('enabled')
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_safe_search_tooltip')
                                },
                                "class": "juniper-enhanced-settings"
                            },
                            {
                                "element_text": true,
                                "id": "account",
                                "name": "account",
                                "value": "{{account}}",
                                "label": context.getMessage('utm_web_filtering_account'),
                                "pattern": "^[\\s\\S]{0,255}$",
                                "error": context.getMessage('maximum_length_error', [ACCOUNT_MAX_LENGTH]),
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_account_tooltip')
                                },
                                "required": false,
                                "class": "websense-redirect-settings"
                            },
                            {
                                "element_text": true,
                                "id": "server",
                                "name": "server",
                                "value": "{{server}}",
                                "pattern": "^[\\s\\S]{0,255}$",
                                "error": context.getMessage('maximum_length_error', [SERVER_MAX_LENGTH]),
                                "label": context.getMessage('utm_web_filtering_server'),
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_server_tooltip')
                                },
                                "required": false,
                                "class": "websense-redirect-settings"
                            },
                            {
                                "element_integer": true,
                                "id": "port",
                                "name": "port",
                                "value": "{{port}}",
                                "label": context.getMessage('utm_web_filtering_port'),
                                "post_validation": "rangeValidator",
                                "minValue": PORT_MIN_VALUE,
                                "maxValue": PORT_MAX_VALUE,
                                "error": context.getMessage('integer_error'),
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_port_tooltip', [DEFAULT_PORT])
                                },
                                "required": false,
                                "placeholder": DEFAULT_PORT,
                                "class": "websense-redirect-settings"
                            },
                            {
                                "element_integer": true,
                                "id": "sockets",
                                "name": "sockets",
                                "value": "{{sockets}}",
                                "label": context.getMessage('utm_web_filtering_sockets'),
                                "post_validation": "rangeValidator",
                                "minValue": SOCKETS_MIN_VALUE,
                                "maxValue": SOCKETS_MAX_VALUE,
                                "error": context.getMessage('integer_error'),
                                //"help": context.getMessage('utm_web_filtering_sockets_help'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_socket_tooltip', [DEFAULT_SOCKETS])
                                },
                                "placeholder": DEFAULT_SOCKETS,
                                "class": "websense-redirect-settings"
                            },
                            {
                                "element_textarea": true,
                                "id": "custom-block-message",
                                "name": "custom-block-message",
                                "max_length": CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_block_message_tooltip')
                                },
                                "value": "{{custom-block-message}}",
                                "label": context.getMessage('utm_web_filtering_custom_block_message')
                            },
                            {
                                "element_textarea": true,
                                "id": "quarantine-custom-message",
                                "name": "quarantine-custom-message",
                                "max_length": CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "value": "{{quarantine-custom-message}}",
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_create_quarantine_message_tooltip')
                                },
                                "label": context.getMessage('utm_web_filtering_custom_quarantine_message'),
                                "class": "juniper-enhanced-settings"
                            }
                        ]
                    }
                ]
            };
        };
    };
    return Configuration;
});