/**
 * A form configuration object with the parameters required to build different editors for rules in Firewall Policies
 *
 * @module firewllRuleWizardAddressFormConfiguration
 * @author Orpheus developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FirewallRuleWizSourceConfiguration = function (context) {

        this.getElements = function () {
            return {
                "form_id": "wizard-source-form",
                "form_name": "wizard-source-form",
                "sections": [
                 {
                    "heading": context.getMessage("source"),
                    "elements": [
                        {
                            "element_text": true,
                            "id": "wizard-src-zone",
                            "name": "wizard-src-zone",
                            "label": context.getMessage("zone"),
                            "width": "295px",
                            "value": "Loading.....",
                            "field-help": {
                                "content": context.getMessage('rule_wizard_src_zone_tooltip'),
                                "ua-help-identifier": "rule_wizard_src_zone_help"
                            }
                        },
                        {
                            "element_description": true,
                            "label": context.getMessage("addresses"),
                            "id": "wizard-src-address",
                            "name": "wizard-src-address",
                            "inlineLinks":[{
                                "id": "src_address_overlay",
                                "class": "src_address_overlay",
                                "value": context.getMessage("select")
                            }],
                            "field-help": {
                                "content": context.getMessage('rule_wizard_src_address_tooltip')
                            }                  
                        },
                        {
                            "element_description": true,
                            "label": context.getMessage("source_identity"),
                            "id": "wizard-src-identity",
                            "name": "wizard-src-identity",
                            "inlineLinks":[{
                                "id": "source_identity_overlay",
                                "class": "source_identity_overlay",
                                "value": context.getMessage("select")
                            }],
                            "field-help": {
                                "content": context.getMessage('rule_wizard_src_id_tooltip')
                            }  
                        }

                    ]
                 }]
            }
        };
    };
    return FirewallRuleWizSourceConfiguration;
});
