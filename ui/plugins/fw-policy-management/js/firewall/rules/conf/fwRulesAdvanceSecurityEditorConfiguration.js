/**
 * A form configuration object with the parameters required to build different editors for rules in Firewall Policies
 *
 * @module formConfiguration
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        '../conf/baseAdvanceSecurityConfiguration.js'
], function (BaseAdvSecurityFormConfiguration) {

    var AdvSecurityFormConfiguration = function (context) {

        this.advancedSecurity = function() {
            return {
                
                "title": context.getMessage("edit_advanced_security"),
                "form_id": "adv_security_overlay",
                "form_name": "adv_security_overlay",
                "title-help": {
                    "content": context.getMessage("edit_advanced_security"),
                    "ua-help-identifier": "alias_for_title_edit_advanced_security_binding"
                },
                "err_div_id": "adv_security_form_overlay_err",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("edit_advanced_security"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "advsecurity_editor",
                        "section_class": "section_class",
                        "elements": new BaseAdvSecurityFormConfiguration(context).advancedSecurityElements()
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

    return AdvSecurityFormConfiguration;

});
