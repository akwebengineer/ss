/**
 * A form configuration object with the common parameters required to build profile editor for rules in Firewall Policies
 *
 * @module profileEditorConfiguration
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var firewallRuleProfileFormConfiguration = function (context) {

        this.getElements = function () {
            return {
                "title": context.getMessage('fw_rules_edit_profile'),
                "form_id": "edit_profile_form",
                "form_name": "edit_profile_form",
                "title-help": {
                    "content": context.getMessage("fw_rules_edit_profile"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("fw_rules_edit_profile"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "profile_type",
                                "label": context.getMessage('fw_rules_edit_profile_type_label'),
                                "field-help": {
                                    "content": context.getMessage('fw_rules_edit_profile_type_label_help'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "profile_type_none",
                                        "name": "profile_type",
                                        "label": context.getMessage('none'),
                                        "value": "none"
                                    },
                                    {
                                        "id": "profile_type_inherit",
                                        "name": "profile_type",
                                        "label": context.getMessage('fw_rules_edit_profile_type_inherit_from_policy'),
                                        //"checked": true,
                                        "value": "inherit"
                                    },
                                    {
                                        "id": "profile_type_user",
                                        "name": "profile_type",
                                        "label": context.getMessage('fw_rules_edit_profile_type_select_another'),
                                        "value": "user-defined"
                                    },
                                    {                                
                                        "id": "profile_type_custom",
                                        "name": "profile_type",
                                        "label": context.getMessage('fw_rules_edit_profile_type_custom'),
                                        "value": "custom"
                                    }
                                ],
                            },
                            {
                                "element_dropdown": true,
                                "id": "profile_type_select",
                                "name": "profile_type_select",
                                "label": context.getMessage("fw_rules_edit_profile_type_select_profile"),
                                "required": false,
                                "values": [
                                    {
                                        "label": context.getMessage("none"),
                                        "value": "",
                                        "selected": "true"
                                    }
                                ],
                                "error": context.getMessage("error_make_selection"),
                                "field-help": {
                                    "content": context.getMessage("fw_rules_edit_profile_type_select_label_help"), 
                                    "ua-help-identifier": "alias_for_profile_editor"
                                },
                                "inlineLinks":[{
                                    "id": "show_select_profile_overlay",
                                    "class": "show_overlay",
                                    // "href": "http://www.yahoo.com",
                                     "value": "View Details"
                                }]
                            },
                            {
                                "element_text": true,
                                "id": "profile_inherit_policy",
                                "name": "profile_inherit_policy",
                                "label": context.getMessage("fw_rules_edit_profile_inherit"),
                                // "placeholder": "www.juniper.net",
                                // "value": "http://www.yahoo.com",
                                "error": context.getMessage("error_make_selection"),
                                "field-help": {
                                    "content": context.getMessage("fw_rules_edit_profile_type_inherit_label_help"), 
                                    "ua-help-identifier": "alias_for_inherit_profile_editor"
                                },
                                "inlineLinks":[{
                                    "id": "show_inherit_profile_overlay",
                                    "class": "show_overlay",
                                    // "href": "http://www.yahoo.com",
                                     "value": "View Details"
                                }]
                            },
                            // {
                            //     "element_dropdown": true,
                            //     "id": "profile_templates",
                            //     "name": "profile_templates",
                            //     "label": "Templates",  // context.getMessage("fw_rules_edit_profile_type_select_profile"),
                            //     "required": false,
                            //     "values": [
                            //         {
                            //             "label": context.getMessage("none"),
                            //             "value": "",
                            //             "selected": "true"
                            //         }
                            //     ],
                            //     "error": context.getMessage("error_make_selection"),
                            //     "field-help": {
                            //         "content": context.getMessage("fw_rules_edit_profile_type_select_label_help"), 
                            //         "ua-help-identifier": "alias_for_templates_profile_editor"
                            //     }
                            // },
                            {
                                    "element_description": true,
                                    "name": "Template",
                                    "id" : "device_template",
                                    "label": "Template" 
                                },
                            {
                                "element_text": true,
                                "id": "policy-profile-tabs",
                                "class": "tab-widget",
                                "name": "policy-profile-tabs",
                                "placeholder": "Loading ..."
                            },

                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnProfileOk",
                        "name": "btnProfileOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkProfileCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return firewallRuleProfileFormConfiguration;

});
