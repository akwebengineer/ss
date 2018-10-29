/**
 * A form configuration object for rule wizard's rule analysis
 *
 * @module FirewallRuleWizRuleAnalysisConfiguration
 * @author Orpheus developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FirewallRuleWizRuleAnalysisConfiguration = function (context) {

        this.getElements = function () {
            return {
                "form_id": "wizard-rule-analysis-form",
                "form_name": "wizard-rule-analysis-form",
                
                "sections": [
                    {
                        "section_id": "section_before_analysis",
                        "section_class": "section_class_before_analysis",
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "perform_rule_analysis",
                                "label": context.getMessage('rule_analysis'),
                                "values": [
                                    {
                                        "id": "perform_analysis",
                                        "name": "perform_analysis",
                                        "label": context.getMessage('rule_analysis_desc')
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage("rule_wizard_analysis_tooltip")
                                }
                            }
                        ]
                    }
                ]
            }
        };
    };
    return FirewallRuleWizRuleAnalysisConfiguration;
});
