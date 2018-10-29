/**
 * A form configuration object with name field
 *
 * @module RuleNameEditorFormConfiguration
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var ruleNameEditorFormConfiguration = function (context) {
        this.getElements = function () {
            return {
                "title": context.getMessage('grid_column_rule_name'),
                "form_id": "rulesgrid_editor_name_form",
                "form_name": "rulesgrid_editor_name_form",
                "title-help": {
                    "content": context.getMessage("grid_column_rule_name_title_info_tip"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("rulesgrid_editor_name_form"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "rulesgrid_editor_name_form_sec",
                        "section_class": "section_class",
                        "elements": [
                             {
                                "element_text": true,
                                "id": "name",
                                "name": "name",
                                "label": context.getMessage("grid_column_rule_name"),
                                "field-help": {
                                    "content": context.getMessage('grid_column_rule_name_info_tip')
                                },
                                "post_validation": "validateRuleName"
                            }   
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return ruleNameEditorFormConfiguration;

});