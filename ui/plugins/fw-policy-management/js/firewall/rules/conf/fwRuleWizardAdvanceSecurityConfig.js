/**
 * A form configuration object with the parameters required to build different editors for rules in Firewall Policies
 *
 * @module formConfiguration
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        './baseAdvanceSecurityConfiguration.js',
        './baseVPNTunnelsConfig.js'
], function (BaseAdvSecurityFormConfiguration, BaseRuleVPNTunnelsConfig) {

    var AdvSecurityFormConfiguration = function (context) {

        this.advancedSecurity = function() {
            return {
                "form_id": "wiz_adv_security",
                "form_name": "wiz_adv_security",
                "title-help": {
                    "content": context.getMessage("edit_advanced_security"),
                    "ua-help-identifier": "alias_for_title_edit_advanced_security_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("edit_advanced_security"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "field-help": {
                                  "content": "EEEE"
                },
                "sections": [
               
                    {
                        "section_id": "wizard_action_section",
                        "section_class": "section_class",
                        "heading": context.getMessage("rule_action"),
                        "elements": [
                            {
                                "element_text": true,
                                "id": "wizard_action",
                                "name": "wizard_action",
                                "label": context.getMessage("rulesGrid_column_action"),
                                "error": context.getMessage("error_make_selection"),
                                "field-help": {
                                    "content": context.getMessage("rule_wizard_action_tooltip"),
                                    "ua-help-identifier": "alias_for_action_binding"
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "wizard_vpn_section",
                        "section_class": "section_class",
                        "elements": new BaseRuleVPNTunnelsConfig(context).getElements()
                    },
                    {
                        "section_id": "wizard_advsecurity",
                        "section_class": "section_class",
                        "heading": context.getMessage("advanced_security"),
                        "heading_text": context.getMessage("select_advanced_msg"),
                        "elements": new BaseAdvSecurityFormConfiguration(context).advancedSecurityElements()

                    }
                ]
            }
       };

    };

    return AdvSecurityFormConfiguration;

});
