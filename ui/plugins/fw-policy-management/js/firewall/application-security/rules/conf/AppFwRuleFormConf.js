define([
], function () {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255;

    var Configuration = function (context, title) {

        this.getValues = function () {

            return {
                "form_id": "appfw_policy_rule_form",
                "form_name": "appfw_policy_rule_form",
                "on_overlay": true,
                "add_remote_name_validation": 'appfw_policy_rule_form',
                title: context.getMessage(title),
                "title-help": {
                    "content": context.getMessage('appfw_policy_create_rule_title_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "sections": [
                    {
                        "elements": [
                            {
                                "element_text": true,
                                "id": "appfw-policy-rule-name",
                                "name": "name",
                                "label": context.getMessage('appfw_grid_column_name'),
                                "required": true,
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-._#$%&()@:*\-]{0,62}$",
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_rule_name_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "error": context.getMessage('app_fw_rule_name_error'),
                                "notshowvalid": true,
                                "help": context.getMessage("maximum_length_help", [NAME_MAX_LENGTH])
                            },
                            {
                                "element_textarea": true,
                                "id": "appfw-policy-rule-description",
                                "name": "description",
                                "label": context.getMessage('appfw_rule_description'),
                                "required": false,
                                "error": context.getMessage('app_fw_rule_name_error'),
                                "field-help": {
                                    "content": context.getMessage('applicationSecurity_grid_description_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "help": context.getMessage("maximum_length_help", [DESCRIPTION_MAX_LENGTH]),
                                "post_validation" : "validTextarea"
                            },
                            {
                                "element_description": true,
                                "id": "appfw-sig-grid",
                                "label": 'Application Signatures',
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_rule_add_appsigs_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "class": "appfw-sig-grid",
                                "name": "appfw-sig-grid"
                            },

                            {
                                "element_dropdown": true,
                                "id": 'appfw_policy_rule_encryption',
                                "name": 'appfw_policy_rule_encryption',
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_rule_encryption_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },   
                                "label": context.getMessage('appfw_policyRulesGrid_column_encryption'),
                                "values": [
                                    {
                                        "id": "radio_encrypt_any",
                                        "name": "radio_encrypt",
                                        "label": context.getMessage('editor_anyCheckbox_text'),
                                        "value": "ANY"
                                    },

                                    {
                                        "id": "radio_encrypt_yes",
                                        "name": "radio_encrypt",
                                        "label": context.getMessage('yes'),
                                        "value": "YES"
                                    },
                                    {
                                        "id": "radio_encrypt_no",
                                        "name": "radio_encrypt",
                                        "label": context.getMessage('no'),
                                        "selected": true,
                                        "value": "NO"
                                    }

                                ]
                            },

                            {
                                "element_dropdown": true,
                                "id": 'appfw-policy-rule-default-rule-type',
                                "name": 'appfw-policy-rule-default-rule-type',
                                "label": context.getMessage('appfw_policyRulesGrid_column_action'),
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_rule_action_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_permit'),
                                        "value": "PERMIT"
                                    },
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_deny'),
                                        "value": "DENY",
                                        class: 'preview-legend-red',
                                        selected: true
                                    },
                                    {
                                        "label": context.getMessage('app_secure_grid_column_default_action_reject'),
                                        "value": "REJECT"
                                    }

                                ]
                            },
                            {
                                "element_radio": true,
                                "id": "block_message_option",
                                "label": context.getMessage('app_secure_block_message_help_text'),
                                "field-help": {
                                    "content": context.getMessage('appfw_policy_create_rule_notify_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
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
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "appfw_policy_rule_cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "appfw_policy_rule_save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };


        };
    };

    return Configuration;
})
;