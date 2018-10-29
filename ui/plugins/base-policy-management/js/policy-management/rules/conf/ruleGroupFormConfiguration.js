/**
 * Firewall rule group form configuration
 *
 * @module FirewallRuleGroupFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var ruleGroupFormConfiguration = function (type, context) {

        this.ruleGroup = function() {
            var msg = context.getMessage(type).concat(" ").concat(context.getMessage("ruleGroup"));

            return {
                
                "title": msg,
                "form_id": "rule_group_form",
                "form_name": "rule_group_form",
                "title-help": {
                    "content": msg,
                    "ua-help-identifier": "alias_for_rule_group"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": msg,
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "section_rule_group",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "name",
                                "name": "name",
                                "label": context.getMessage("name"),
                                "onfocus": "true",
                                "required": true,
                                "value": "{{name}}",
                                "pattern-error": [
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage("require_error")
                                    },
                                    {
                                        "regexId": "regex1",
                                        "pattern": "^[a-zA-Z0-9\-_@#$%&*():.][a-zA-Z0-9\-_@#$%&*():.\/\\s]{0,255}$",
                                        "error": context.getMessage('fw_rule_group_name_error')
                                    }

                                ],
                                "error": true
                            },
                            {
                                "element_textarea": true,
                                "id": "description",
                                "name": "description",
                                "label": context.getMessage("description"),
                                "placeholder": "",
                                "value": "{{description}}"
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

    return ruleGroupFormConfiguration;

});
