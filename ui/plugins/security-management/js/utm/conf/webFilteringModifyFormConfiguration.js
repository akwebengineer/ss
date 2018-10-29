/**
 * A configuration object with the parameters required to build
 * a form for web filtering profile modify form configuration
 *
 * @module webFilteringModifyFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var NAME_MAX_LENGTH = 29,
        NAME_MIN_LENGTH = 1,
        ACCOUNT_MAX_LENGTH = 255,
        SERVER_MAX_LENGTH = 255,
        DESCRIPTION_MAX_LENGTH = 255,
        PORT_MIN_VALUE = 1024,
        PORT_MAX_VALUE = 65535,
        SOCKETS_MIN_VALUE = 1,
        SOCKETS_MAX_VALUE = 8,
        TIMEOUT_MIN_VALUE = 1,
        TIMEOUT_MAX_VALUE = 1800,
        CUSTOM_NOTIFICATION_MESSAGE_MAX_LENGTH = 512,
        DEFAULT_TIMEOUT = 15,
        DEFAULT_PORT = 15868,
        DEFAULT_SOCKETS = 8;

    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";

    var Configuration = function(context) {
        var actions = [
            {
                "label": context.getMessage('utm_web_filtering_default_action_log_and_permit'),
                "value": ACTION_LOG_AND_PERMIT
            },
            {
                "label": context.getMessage('utm_web_filtering_default_action_block'),
                "value": ACTION_BLOCK
            },
            {
                "label": context.getMessage('utm_web_filtering_default_action_permit'),
                "value": ACTION_PERMIT
            },
            {
                "label": context.getMessage('utm_web_filtering_default_action_quarantine'),
                "value": ACTION_QUARANTINE
            }];

        this.getValues = function() {

            return {
               "form_id": "utm-webfiltering-form",
               "form_name": "utm-webfiltering-form",
               "on_overlay": true,
               "add_remote_name_validation": 'utm-webfiltering-name',
               "sections": [
                   {
                       "heading": context.getMessage('utm_web_filtering_title_general_information'),
                       "section_id": "general-form",
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
                                 "element_text": true,
                                 "id": "engine-type",
                                 "name": "profile-type",
                                 "label": context.getMessage('utm_web_filtering_engine_type'),
                                 "value": "{{profile-type}}",
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
                                 "help": context.getMessage('utm_web_filtering_sockets_help'),
                                 "required": false,
                                 "field-help": {
                                     "content": context.getMessage('utm_web_filtering_create_socket_tooltip', [DEFAULT_SOCKETS])
                                 },
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
                   },
                   {
                       "heading": context.getMessage('utm_web_filtering_title_url_category_information'),
                       "section_id": "action-list-form",
                       "state_collapsed": true,
                       "elements": [
                            {
                                "element_textarea": true,
                                "id": "utm-webfiltering-deny-action-list",
                                "name": "deny-action-list",
                                "value": "{{deny-action-list}}",
                                "label": context.getMessage('utm_web_filtering_deny_action_list'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_deny_action_list_tooltip')
                                },
                                "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                "inlineButtons":[{
                                    "id": "utm-webfiltering-url-category-deny",
                                    "class": "input_button",
                                    "name": "utm-webfiltering-url-category-deny",
                                    "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                }]
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-webfiltering-log-and-permit-action-list",
                                "name": "log-and-permit-action-list",
                                "value": "{{log-and-permit-action-list}}",
                                "label": context.getMessage('utm_web_filtering_log_and_permit_action_list'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_log_action_list_tooltip')
                                },
                                "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                "inlineButtons":[{
                                    "id": "utm-webfiltering-url-category-log-and-permit",
                                    "class": "input_button",
                                    "name": "utm-webfiltering-url-category-log-and-permit",
                                    "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                }]
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-webfiltering-permit-action-list",
                                "name": "permit-action-list",
                                "value": "{{permit-action-list}}",
                                "label": context.getMessage('utm_web_filtering_permit_action_list'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_permit_action_list_tooltip')
                                },
                                "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                "inlineButtons":[{
                                    "id": "utm-webfiltering-url-category-permit",
                                    "class": "input_button",
                                    "name": "utm-webfiltering-url-category-permit",
                                    "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                }]
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-webfiltering-quarantine-action-list",
                                "name": "quarantine-action-list",
                                "value": "{{quarantine-action-list}}",
                                "label": context.getMessage('utm_web_filtering_quarantine_action_list'),
                                "field-help": {
                                    "content": context.getMessage('utm_web_filtering_quarantine_action_list_tooltip')
                                },
                                "required": false,
                                "placeholder": context.getMessage('utm_web_filtering_no_url_category_selected'),
                                "inlineButtons":[{
                                    "id": "utm-webfiltering-url-category-quarantine",
                                    "class": "input_button",
                                    "name": "utm-webfiltering-url-category-quarantine",
                                    "value": context.getMessage("utm_web_filtering_url_category_button_create")
                                }],
                                "class": "quarantine-action-list-settings"
                            },
                       ]
                    },
                     {
                         "heading": context.getMessage('utm_web_filtering_fallback_option_section_title'),
                         "section_id": "global-reputation-action-form",
                         "state_collapsed": true,
                         "elements": [
                                {
                                    "element_checkbox": true,
                                    "id": "global-reputation-action",
                                    "name": "enable-global-reputation",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_section_title'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_url_action_tooltip')
                                    },
                                    "values": [
                                        {
                                            "id": "enable-global-reputation",
                                            "name": "enable-global-reputation",
                                            "label": context.getMessage('utm_web_filtering_global_reputation_action_enable')
                                        }
                                    ]
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "very-safe",
                                    "name": "very-safe",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_very_safe'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_verify_safe_tooltip')
                                    },
                                    "required": false,
                                    "values": actions,
                                    "class": "global-reputation-settings"
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "moderately-safe",
                                    "name": "moderately-safe",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_moderately_safe'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_moderately_safe_tooltip')
                                    },
                                    "required": false,
                                    "values": actions,
                                    "class": "global-reputation-settings"
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "fairly-safe",
                                    "name": "fairly-safe",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_fairly_safe'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_fairly_safe_tooltip')
                                    },
                                    "required": false,
                                    "values": actions,
                                    "class": "global-reputation-settings"
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "suspicious",
                                    "name": "suspicious",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_suspicious'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_suspicious_tooltip')
                                    },
                                    "required": false,
                                    "values": actions,
                                    "class": "global-reputation-settings"
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "harmful",
                                    "name": "harmful",
                                    "label": context.getMessage('utm_web_filtering_global_reputation_action_harmful'),
                                    "field-help": {
                                        "content": context.getMessage('utm_web_filtering_fallback_harmful_tooltip')
                                    },
                                    "required": false,
                                    "values": actions,
                                    "class": "global-reputation-settings"
                                }
                         ]
                     },
                     {
                         "section_id": "fallback-option-form",
                         "state_collapsed": true,
                         "elements": [
                              {
                                  "element_dropdown": true,
                                  "id": "default-action",
                                  "name": "default-action",
                                  "label": context.getMessage('utm_web_filtering_default_action'),
                                  "values": [
                                      {
                                          "label": context.getMessage('utm_web_filtering_default_action_log_and_permit'),
                                          "value": ACTION_LOG_AND_PERMIT
                                      },
                                      {
                                          "label": context.getMessage('utm_web_filtering_default_action_block'),
                                          "value": ACTION_BLOCK
                                      },
                                      {
                                           "label": context.getMessage('utm_web_filtering_default_action_permit'),
                                           "value": ACTION_PERMIT
                                      },
                                      {
                                          "label": context.getMessage('utm_web_filtering_default_action_quarantine'),
                                          "value": ACTION_QUARANTINE
                                      }
                                  ],
                                  "field-help": {
                                      "content": context.getMessage('utm_web_filtering_create_default_action_tooltip')
                                  },
                                  "class": "juniper-enhanced-settings surf-control-settings local-settings"
                              },
                              {
                                  "element_dropdown": true,
                                  "id": "fallback-default-action",
                                  "name": "fallback-default-action",
                                  "label": context.getMessage('utm_web_filtering_fallback_default_action'),
                                  "required": false,
                                  "field-help": {
                                      "content": context.getMessage('utm_web_filtering_fallback_default_action_tooltip')
                                  },
                                  "values": [
                                      {
                                          label: context.getMessage('utm_web_filtering_default_action_log_and_permit'),
                                          value: ACTION_LOG_AND_PERMIT
                                      },
                                      {
                                          label: context.getMessage('utm_web_filtering_default_action_block'),
                                          value: ACTION_BLOCK
                                      }
                                  ]
                              },
                              {
                                  "element_integer": true,
                                  "id": "timeout",
                                  "name": "timeout",
                                  "value": "{{timeout}}",
                                  "label": context.getMessage('utm_web_filtering_timeout'),
                                  "post_validation": "rangeValidator",
                                  "minValue": TIMEOUT_MIN_VALUE,
                                  "maxValue": TIMEOUT_MAX_VALUE,
                                  "error": context.getMessage('integer_error'),
                                  "help": context.getMessage('utm_web_filtering_timeout_help'),
                                  "field-help": {
                                      "content": context.getMessage('utm_web_filtering_create_timeout_tooltip', [TIMEOUT_MAX_VALUE, DEFAULT_TIMEOUT])
                                  },
                                  "required": false
                              }
                          ]
                      }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-webfiltering-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-webfiltering-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});