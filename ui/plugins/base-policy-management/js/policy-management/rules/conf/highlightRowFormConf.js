/**
 * Firewall rule group form configuration
 *
 * @module FirewallRuleGroupFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var highlightFormConfiguration = function (context) {

        this.highlightRule = function() {

            return {

                "title": "Highlight Rule",
                "form_id": "highlight_rule_form",
                "form_name": "highlight_rule_form",
                "on_overlay": true,

                "sections": [
                    {
                        "section_id": "section_highlight_rule",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "ruleId",
                                "name": "ruleId",
                                "label": "Rule Id",
                                "onfocus": "true",
                                "required": true
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

    return highlightFormConfiguration;

});
