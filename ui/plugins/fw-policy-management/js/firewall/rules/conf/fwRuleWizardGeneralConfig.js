/**
 * Form configuration required to render the rule wizard general form
 * @module fwRuleWizardGeneralConfig
 * @author Omega developer <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var NAME_MAX_LENGTH = "63", 
        NAME_MIN_LENGTH = "1",
        DESC_MAX_LENGTH = 1024;
        
    var RuleWizardGeneralConfiguration = function(context) {
        this.getElements = function() {
            return {
                "form_id": "rule-wizard-general-form",
                "form_name": "rule-wizard-general-form",
                
                "sections": [
                    {
                        "section_id": "rule-wizard-general-section",
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "rule-name",
                                "name": "rule-name",
                                "label": context.getMessage('rule_name'),
                                "required": true,
                                "pattern-error": [
                                     {
                                        "pattern": "hasAlphanumericDashUnderscore",
                                        "error": context.getMessage('fw_rule_source_id_name_error')
                                     },
                                     {
                                         "pattern": "length",
                                         "max_length": NAME_MAX_LENGTH,
                                         "min_length": NAME_MIN_LENGTH,
                                         "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                                     },
                                     {
                                         "pattern": "hasnotspace",
                                         "error": context.getMessage("fw_rule_name_space_validate")
                                     },
                                     {
                                         "pattern": "validtext",
                                         "error": context.getMessage('name_require_error')
                                     }
                                ],
                                "error": true,
                                "notshowvalid": true,
                                "help": context.getMessage("maximum_length_help", [NAME_MAX_LENGTH]),
                                "field-help": {
                                    "content": context.getMessage('rule_wizard_name_tooltip'),
                                    "ua-help-identifier": "rule_wizard_name_help"
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "rule-description",
                                "name": "rule-description",
                                "label": context.getMessage('description'),
                                "max_length": DESC_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "field-help": {
                                    "content": context.getMessage('rule_description_purpose')
                                }
                            }
                        ]
                    }
                ]
            };
        };
    };
    return RuleWizardGeneralConfiguration;
});
