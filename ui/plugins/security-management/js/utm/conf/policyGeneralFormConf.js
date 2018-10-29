/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration for UTM policy
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var NAME_MAX_LENGTH = 29,
            NAME_MIN_LENGTH = 1,
            DESCRIPTION_MAX_LENGTH = 255,
            CONNECTION_LIMIT_MIN = 0,
            CONNECTION_LIMIT_MAX = 2000;

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-policy-general-form",
                   "form_name": "utm-policy-general-form",
                   "add_remote_name_validation": 'utm_policy_name',
                   "sections": [
                       {
                            "elements": [
                                {
                                    "element_multiple_error": true,
                                    "id": "utm_policy_name",
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
                                    "error": true,
                                    "notshowvalid": true,
                                    "post_validation": "blankNameValidator",
                                    "field-help": {
                                        "content": context.getMessage('utm_policy_name_tooltip')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "id": "utm_policy_description",
                                    "name": "description",
                                    "value": "{{description}}",
                                    "label": context.getMessage('description'),
                                    "max_length": DESCRIPTION_MAX_LENGTH,
                                    "post_validation": "lengthValidator",
                                    "field-help": {
                                        "content": context.getMessage('utm_policy_description_tooltip')
                                    }
                                }
                            ]
                       },
                       {
                            "heading": context.getMessage('utm_policy_title_traffic_options'),
                            "elements": [
                                 {
                                        "element_integer": true,
                                        "id": "utm_policy_connection_limit",
                                        "name": "utm_policy_connection_limit",
                                        "value": "{{sessions-per-client}}",
                                        "post_validation": "rangeValidator",
                                        "minValue": CONNECTION_LIMIT_MIN,
                                        "maxValue": CONNECTION_LIMIT_MAX,
                                        "label": context.getMessage('utm_policy_connection_limit'),
                                        "help": context.getMessage("utm_policy_connection_limit_help"),
                                        "placeholder": context.getMessage("utm_policy_connection_limit_placeholder"),
                                        "error": context.getMessage('integer_error'),
                                        "field-help": {
                                            "content": context.getMessage('utm_policy_connection_tooltip')
                                        }
                                },
                                {
                                    "element_radio": true,
                                    "id": "radio_action",
                                    "name": "radio_action",
                                    "label": context.getMessage('utm_policy_action_label'),
                                    "values": [
                                        {
                                            "id": "action_none",
                                            "name": "radio_action",
                                            "label": context.getMessage('utm_policy_action_none'),
                                            "value": "NONE"
                                        },
                                        {
                                            "id": "action_log_and_permit",
                                            "name": "radio_action",
                                            "label": context.getMessage('utm_policy_action_log_and_permit'),
                                            "value": "LOG_AND_PERMIT"
                                        },
                                        {
                                            "id": "action_block",
                                            "name": "radio_action",
                                            "label": context.getMessage('utm_policy_action_block'),
                                            "value": "BLOCK"
                                        }
                                    ],
                                    "error": context.getMessage('error_make_selection')
                                }
                            ]
                        }
                    ]
                };
            };
        };

        return Configuration;
});