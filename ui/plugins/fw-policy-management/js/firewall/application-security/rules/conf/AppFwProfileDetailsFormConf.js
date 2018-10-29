define([
], function () {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1;

    var Configuration = function (context) {

        this.getValues = function () {

            return {
                "form_id": "appfw-profile-form",
                "form_name": "appfw-profile-form",
                "on_overlay": false,
                "add_remote_name_validation": 'appfw-profile-name',
                "sections": [
                    {
                        "heading": context.getMessage('app_secure_grid_column_default_action'),
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": 'appfw-default-rule-type',
                                "name": 'appfw-default-rule-type',
                                "label": context.getMessage('app_secure_default_action_label_text'),
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_default_action_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_permit'),
                                        "value": "permit"
                                    },
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_deny'),
                                        "value": "deny"
                                    },
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_reject'),
                                        "value": "reject"
                                    }

                                ]
                            },
                            {
                                "element_radio": true,
                                "id": "block_message",
                                "label": context.getMessage('app_secure_block_message_help_text'),
                                "values": [
                                    {
                                        "id": "radio_yes",
                                        "name": "radio_button",
                                        "label": context.getMessage('yes'),
                                        "value": "YES"
                                    },
                                    {
                                        "id": "radio_no",
                                        "name": "radio_button",
                                        "label": context.getMessage('no'),
                                        "checked": true,
                                        "value": "NO"
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        "heading": context.getMessage('app_secure_block_message'),
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": 'appfw_policy_default_block_action',
                                "name": 'appfw_policy_default_block_action',
                                "label": 'Block Message type',
                                 "field-help": {
                                    "content": context.getMessage('appfw_policy_create_block_message_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "checkbox_block_message_type_none",
                                        "name": "checkbox_block_message_type",
                                        "label": context.getMessage('app_secure_block_message_type_grid_NONE_LABEL'),
                                        "value": "NONE",
                                        selected: true
                                    },

                                    {
                                        "id": "checkbox_block_message_type_text",
                                        "name": "checkbox_block_message_type",
                                        "label": context.getMessage('app_secure_block_message_type_TEXT'),
                                        "value": "TEXT"
                                    },
                                    {
                                        "id": "checkbox_block_message_type_url",
                                        "name": "checkbox_block_message_type",
                                        "label": context.getMessage('app_secure_block_message_type_REDIRECT_URL'),
                                        "value": "REDIRECT_URL"
                                    }

                                ]
                            },


                            {
                                "element_textarea": true,
                                "id": "app_secure_block_message_type_text_value",
                                "name": "app_secure_block_message_type_text_value",
                                "max_length": 1024,
                                "post_validation": "validateBlockMessage",
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_custom_message_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                label: context.getMessage('app_secure_block_message_type_grid_TEXT_LABEL'),
                                error: context.getMessage('app_secure_block_message_type_text_value_error'),
                                required: true,
                                "notshowvalid": true
                            },
                            {
                                "element_url": true,
                                "id": "app_secure_block_message_type_url_value",
                                "name": "app_secure_block_message_type_url_value",
                                "placeholder": context.getMessage('appfw_placeholder_url_text'),
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_redirect_url_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                label: context.getMessage('app_secure_block_message_type_grid_REDIRECT_URL'),
                                error: context.getMessage('app_secure_block_message_type_redirect_url_value_error'),
                                required: true,
                                "post_validation": "validateBlockMessage",
                                "notshowvalid": true

                            }
                        ]
                    }

                ]
            }


        };
    };

    return Configuration;
})
;
