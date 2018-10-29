/**
 * A form configuration for Firewall Rule Options Editor
 *
 * @module FWRuleOptionsEditorConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './baseRuleOptionsConfig.js'
], function (BaseRuleOptionsConfig) {

    var FWRuleOptionsEditorConfiguration = function (context) {

        this.getElements = function () {
            return {
                "title": "Rule Options",
                "form_id": "rule-options-editor-form",
                "form_name": "rule-options-editor-form",
                "title-help": {
                    "content": context.getMessage("fw_rules_edit_profile"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("fw_rules_edit_profile"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,               
                "sections": new BaseRuleOptionsConfig(context).getElements(),

                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "ok",
                        "name": "ok",
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
    return FWRuleOptionsEditorConfiguration;
});
