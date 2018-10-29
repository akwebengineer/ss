/**
 * A form configuration for Firewall Rule Options wizard
 *
 * @module FWRuleWizardOptionsConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './baseRuleOptionsConfig.js'
], function (BaseRuleOptionsConfig) {

    var FWRuleWizardOptionsConfiguration = function (context) {

        this.getElements = function () {
            return {
                "form_id": "rule-options-form",
                "form_name": "rule-options-form",
                "sections": new BaseRuleOptionsConfig(context).getElements()
            }
        };
    };
    return FWRuleWizardOptionsConfiguration;
});
