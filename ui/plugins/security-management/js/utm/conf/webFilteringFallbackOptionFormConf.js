/**
 * Form configuration required to render the fallback option form using the FormWidget.
 *
 * @module Fallback Option Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
], function () {
    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";

    var Configuration = function(context) {
        var actions = [ {
                "label": context.getMessage('utm_web_filtering_default_action_log_and_permit'),
                "value": ACTION_LOG_AND_PERMIT
            }, {
                "label": context.getMessage('utm_web_filtering_default_action_block'),
                "value": ACTION_BLOCK
            }, {
                 "label": context.getMessage('utm_web_filtering_default_action_permit'),
                 "value": ACTION_PERMIT
            }, {
                "label": context.getMessage('utm_web_filtering_default_action_quarantine'),
                "value": ACTION_QUARANTINE
            }];

        this.getValues = function() {
            return {
                "form_id": "utm-webfiltering-fallback-option-form",
                "form_name": "utm-webfiltering-fallback-option-form",
                "sections": [
                    {
                        "section_id": "global-reputation-action-form",
                        "heading": context.getMessage('utm_web_filtering_fallback_option_section_title'),
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "uncategorized-url-action",
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
                                "class": "juniper-enhanced-settings surf-control-settings"
                            },
                            {
                                "element_dropdown": true,
                                "id": "utm-webfiltering-fallback-default-action",
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
                            }
                        ]
                    }
                ]
            };
        };
    };
    return Configuration;
});