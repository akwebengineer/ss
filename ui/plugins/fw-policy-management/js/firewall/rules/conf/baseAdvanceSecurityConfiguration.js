/**
 * A form configuration object with the parameters required to build different editors for rules in Firewall Policies
 *
 * @module formConfiguration
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var BaseAdvSecurityFormConfiguration = function (context) {

        this.advancedSecurityElements = function() {
            return [
                {
                    "element_text": true,
                    "id": "app_firewall",
                    "name": "app_firewall",
                    "label": context.getMessage("fw_rules_editor_adv_security_app_firewall"),
                    "required": false,
                    "hidden": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("rule_wizard_app_fw_tooltip"),
                        "ua-help-identifier": "alias_for_app_firewall_binding"
                    }
                },
                {
                    "element_text": true,
                    "id": "ssl_proxy",
                    "name": "ssl_proxy",
                    "label": context.getMessage("fw_rules_editor_adv_security_ssl_forward_proxy"),
                    "required": false,
                    "hidden": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("rule_wizard_ssl_proxy_tooltip"),
                        "ua-help-identifier": "alias_for_ssl_proxy_binding"
                    }
                },
                {
                    "element_text": true,
                    "id": "ips",
                    "name": "ips",
                    "label": context.getMessage("ips"),
                    "required": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("rule_wizard_ips_tooltip")
                    }
                },
                {
                    "element_text": true,
                    "id": "utm",
                    "name": "utm",
                    "label": context.getMessage("utm"),
                    "required": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("rule_wizard_utm_tooltip")
                    },
                    "inlineLinks":[{
                        "id": "show_utm_overlay",
                        "class": "show_overlay",
                        "value": context.getMessage("editor_addNewButton")
                    }]
                },
                // adding Threat management policy
                {
                    "element_text": true,
                    "id": "threatPolicy",
                    "name": "threatPolicy",
                    "label": context.getMessage("threat-policy"),
                    "required": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("threat_policies"),
                        "ua-help-identifier": "alias_for_threat_policy_binding"
                    }
                }

/*                ,
                {
                    "element_text": true,
                    "id": "secIntel",
                    "name": "secIntel",
                    "label": context.getMessage("sec_intel"),
                    "required": false,
                    "error": context.getMessage("error_make_selection"),
                    "field-help": {
                        "content": context.getMessage("sec_intel_policies"),
                        "ua-help-identifier": "alias_for_secintel_policy_binding"
                    },
                    "inlineLinks":[{
                        "id": "show_secintel_overlay",
                        "class": "show_overlay",
                        "value": context.getMessage("editor_addNewButton")
                    }]
                }
*/
            ]

       };

    };

    return BaseAdvSecurityFormConfiguration;

});
