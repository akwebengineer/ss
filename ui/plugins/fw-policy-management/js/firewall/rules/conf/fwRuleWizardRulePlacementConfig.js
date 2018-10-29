/**
 * A form configuration object for rule wizard's rule placement
 *
 * @module FirewallRuleWizRulePlacementConfiguration
 * @author Orpheus developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FirewallRuleWizRulePlacementConfiguration = function (context) {

        this.getElements = function () {
            return {
                "form_id": "wizard-rule-analysis-form",
                "form_name": "wizard-rule-analysis-form",
                
                "sections": [
                    {
                        "heading": context.getMessage('analysis'),
                        "section_id": "section_after_analysis",
                        "section_class": "section_class_after_analysis label-top-align",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "analysis_result",
                                "name": "analysis_result",
                                "label": context.getMessage("results")
                            },
                            {
                                "element_description": true,
                                "id": "view_analysis_report",
                                "name": "view_analysis_report",
                                "label": " ",
                                "value": "",
                                
                                "inlineLinks":[{
                                    "id": "view_report_link",
                                    "class": "view_report_link align-left-no-margin",
                                    "value": context.getMessage("download_analysis_report")
                                }]
                            }

                        ]
                    },
                    {
                        "heading": context.getMessage('rule_placing'),
                        "section_id": "section_after_analysis",
                        "section_class": "section_class_after_analysis label-top-align",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "rule_type",
                                "name": "rule_type",
                                "label": context.getMessage("rule_type")
                            },
                            {
                                "element_description": true,
                                "id": "rule_group",
                                "name": "rule_group",
                                "label": context.getMessage("ruleGroup"),
                                "class": "ruleGroupClass"
                            },
                            {
                                "element_description": true,
                                "id": "location_sequence",
                                "name": "location_sequence",
                                "label": context.getMessage("location_sequence")
                            },
                            {
                                "element_description": true,
                                "id": "view_placement",
                                "name": "view_placement",
                                "label": " ",
                                "value": "",
                                
                                "inlineLinks":[{
                                    "id": "view_placement_link",
                                    "class": "view_placement_link align-left-no-margin",
                                    "value": context.getMessage("view_placement_inside_policy")
                                }]
                            }
                        ]
                    }
                ]
            }
        };
    };
    return FirewallRuleWizRulePlacementConfiguration;
});
