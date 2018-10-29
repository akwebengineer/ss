/**
 * A form configuration object with description field
 *
 * @module descriptionEditorFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var descriptionEditorFormConfiguration = function (context) {
        this.getElements = function () {
            return {
                "title": context.getMessage('rulesgrid_column_description'),
                "form_id": "rulesgrid_editor_description_form",
                "form_name": "rulesgrid_editor_description_form",
                "title-help": {
                    "content": context.getMessage('rulegrid_column_description_title_info_tip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": "alias_for_title_ips_rule_description_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("rulesgrid_editor_description_form"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "rulesgrid_editor_description_form_sec",
                        "section_class": "section_class",
                        "elements": [
                             {
                                "element_textarea": true,
                                "id": "description",
                                "name": "description",
                                "label": context.getMessage("rulesgrid_column_description"),
                                "field-help": {
                                    "content": context.getMessage('rulegrid_column_description_info_tip')
                                },
                                "max_length": 4096,
                                "pattern" : '{{description_regex}}',
                                "rows": 7,
                                "post_validation": "descriptionValidator",
                                "placeholder": ""
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

    return descriptionEditorFormConfiguration;

});