/**
 * A configuration object with the parameters required to build
 * a form for configure rule sets view
 *
 * @module configurerulesetsFormConfiguration
 * @author  Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "configurerulesets-form",
                "form_name": "configurerulesets-form",
                "title": "Configure Rule Sets",
                "title-help": {
                    "content": context.getMessage( 'nat_rule_set_tooltip' ),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("NAT_POLICY_RULE_SET_CONFIGURING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "configurerulesets-list",
                        "elements": [
                            {
                              "element_description": true,
                              "id": "nat_policy_configure_ruleset",
                              "name": "nat_policy_configure_ruleset",
                              "class": "grid-widget"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnRuleSetOk",
                        "name": "btnRuleSetOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkRuleSetCancel",
                    "value": context.getMessage("cancel")
                }
            };
        };
    };

    return Configuration;
});
