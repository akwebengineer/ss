/**
 * Move rule group form configuration object 
 *
 * @module moveToRuleGroupFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var moveToRuleGroupFormConfiguration = function (context) {

        this.moveToRuleGroup = function() {
            return {
                
                "title": context.getMessage("moveToRuleGroup"),
                "form_id": "move_to_rule_group_form",
                "form_name": "move_to_rule_group_form",
                "title-help": {
                    "content": context.getMessage("moveToRuleGroup"),
                    "ua-help-identifier": "alias_for_title_move_to_rule_group_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("moveToRuleGroup"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "section_move_to_rule_group",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "ruleGroup",
                                "name": "ruleGroup",
                                "label": context.getMessage("selectRuleGroup"),
                                "required": true,
                                "error": context.getMessage("error_make_selection"),
                                "class": "gridRuleGrp",
                                "field-help": {
                                    "content": "Move to Rule Group", 
                                    "ua-help-identifier": "alias_for_move_to_rule_group_binding"
                                }
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

    return moveToRuleGroupFormConfiguration;

});
