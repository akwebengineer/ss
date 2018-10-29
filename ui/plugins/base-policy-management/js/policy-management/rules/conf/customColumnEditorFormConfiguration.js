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
                "title": '{{title}}',
                "form_id": "rulesgrid_editor_description_form",
                "form_name": "rulesgrid_editor_description_form",
                "title-help": {
                    "content": context.getMessage('sm.services.rule.custom_column.tooltip')
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
                                "element_multiple_error": true,
                                "id": "description",
                                "name": "description",
                                "label": '{{label}}',
                                "notshowvalid": true,
                                "field-help": {
                                  "content": context.getMessage('sm.services.rule.custom_column.label.info_tip')
                                },
                                "pattern-error": [
                                    {
                                      "pattern": "length",
                                      "min_length":"1",
                                      "max_length":"256",
                                      "error": context.getMessage('sm.services.rule.custom_column.length_error')
                                    },
                                    {
                                        "regexId":"regex1",
                                        "pattern": '{{description_regex}}',
                                        "error": '{{error}}'
                                    }],
                                "error": true
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