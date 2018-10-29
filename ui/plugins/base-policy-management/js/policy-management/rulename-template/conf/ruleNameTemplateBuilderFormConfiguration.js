define([], 
    function () {

    var templateBuilderFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("create_template_builder"),
                "form_id": "template_builder_form",
                "form_name": "template_builder_form",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,    
                "title-help": {
                    "content": context.getMessage("rulename_template_title_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_RULE_NAME_TEMPLATE_CREATING")
                },           
                "sections": [
                    {
                        "section_id": "section_id",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "enableRuleNameTemplateChekBox",
                                "label": context.getMessage("rule_name_template"),
                                "required": false,
                                "values": [
                                    {
                                        "id": "enableRuleNameTemplateCheckBox",
                                        "name": "enableRuleNameTemplateCheckBox",
                                        "label": context.getMessage("enable_rule_name_Template"),
                                        "value": "enable",
                                        "checked": false
                                    }
                                ],
                                "error": context.getMessage("error_make_selection")
                            },
                            {
                                "element_radio": true,
                                "id": "typeRadio",
                                "label": context.getMessage("compliance"),
                                "values": [
                                    {
                                        "id": "strict-mode-type",
                                        "name": "strict-mode-type",
                                        "label": context.getMessage("strict_mode"),
                                        "value": "STRICT"      
                                    },
                                    {
                                        "id": "weak-mode-type",
                                        "name": "weak-mode-type",
                                        "label": context.getMessage("weak_mode"),
                                        "value": "WEAK",
                                        "checked": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "section_id": "templateBuilder_id",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "tempBuild",
                                "name": "tempBuild",
                                "label": context.getMessage('template_preview'),
                                "value": "" 
                            },
                            {
                                "element_description": true,
                                "id": "sd-template-builder",
                                "name": "template_builder_dis",
                                "label": context.getMessage('template_rule_name'),
                                "placeholder": context.getMessage('loading'),
                                "class": "sd-template-builder gridWidgetSmallPlaceHolder"
                            }

                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnTemplateOk",
                        "name": "btnTemplateOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkPolicyCancel",
                    "value": context.getMessage("cancel")
                }
            }
        }
    };
    return templateBuilderFormConfiguration;
});