/**
 * A form configuration object with the parameters required to build different editors for rules in Firewall Policies
 *
 * @module firewllRuleWizardAddressFormConfiguration
 * @author Orpheus developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FirewallRuleWizDestinationConfiguration = function (context) {

        this.getElements = function () {
            return {
                "form_id": "wizard-destn-form",
                "form_name": "wizard-destn-form",
                "sections": [
                {
                    "heading": context.getMessage("destination"),
                    "elements": [
                        {
                            "element_text": true,
                            "id": "wizard-destn-zone",
                            "name": "wizard-destn-zone",
                            "label": context.getMessage("zone"),
                            "field-help": {
                                "content": context.getMessage('rule_wizard_dest_zone_tooltip')
                            }  
                        },
                        {
                            "element_description": true,
                            "label": context.getMessage("addresses"),
                            "id": "wizard-destn-address",
                            "name": "wizard-destn-address",
                            "inlineLinks":[{
                                "id": "destn_address_overlay",
                                "class": "src_address_overlay",
                                "value": context.getMessage("select")
                            }],
                            "field-help": {
                                "content": context.getMessage('rule_wizard_dest_address_tooltip')
                            }  
                        }
                    ]
                },
                {
                    "heading": context.getMessage("service_protocols"),
                    "elements": [
                        {
                            "element_description": true,
                            "label": context.getMessage("services"),
                            "id": "wizard-service",
                            "name": "wizard-service",
                            "inlineLinks":[{
                                "id": "service_overlay",
                                "class": "service_overlay",
                                "value": context.getMessage("select")
                            }],
                            "field-help": {
                                "content": context.getMessage('rule_wizard_dest_service_tooltip')
                            }  
                        }
                    ]
                 }
                 ]
            }
        };
    };
    return FirewallRuleWizDestinationConfiguration;
});
