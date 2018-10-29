/**
 * A form configuration for Firewall Rule Options
 *
 * @module BaseRuleOptionsConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var BaseRuleOptionsConfiguration = function (context) {

        this.getElements = function () {
            return [
                 {
                    "elements": [
                        {
                            "element_description": true,
                            "label": context.getMessage("profile"),
                            "id": "profile",
                            "name": "profile",
                            "inlineLinks":[{
                                "id": "profile_overlay",
                                "class": "profile_overlay",
                                "value": context.getMessage("select")
                            }],
                            "field-help": {
                                "content": context.getMessage("rule_wizard_profile_tooltip")
                            }                  
                        }
                    ]
                },
                {
                    "elements": [
                        {
                            "element_text": true,
                            "id": "scheduler",
                            "name": "scheduler",
                            "label": context.getMessage("scheduler"),
                            "inlineLinks":[{
                                "id": "scheduler_overlay",
                                "class": "scheduler_overlay",
                                "value": context.getMessage("editor_addNewButton")
                            }],
                            "field-help": {
                                "content": context.getMessage("rule_wizard_schedule_tooltip")
                            }   
                        }
                    ]
                }
            ]
        };
    };
    
    return BaseRuleOptionsConfiguration;
});
