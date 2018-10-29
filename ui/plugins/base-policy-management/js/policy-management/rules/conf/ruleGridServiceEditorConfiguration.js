/**
 * Rule Grid Service editor configuration object
 *
 * @module RuleGridServiceEditorConfiguration
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    ], function () {

    var RuleGridServiceEditorConfiguration = function (context) {

        this.getConfig = function() {
            return {
                "title": "",
                "form_id": "form_id",
                "form_name": "form_name",
                "title-help": {
                    "content": context.getMessage("rules_editor_serv_edit_title_info_tip"),
                    "ua-help-text": context.getMessage("more_link"),
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("ruleGrid_add_service"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,

                "sections": [
                    {
                        "section_id": "section_service",
                        "section_class": "section_class",
                        "elements": [
                        {
                            "element_checkbox": true,
                            "id": "default_service_checkbox",
                            "label": "Default",
                            "field-help": {
                                "content": context.getMessage('rules_editor_serv_edit_default_info_tip'),
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            },
                            "values": [
                                {
                                    "id": "default_service",
                                    "name": "default_service",
                                    "value": "enable",
                                    "checked": false
                                }
                            ]
                        },
                        {
                            "element_text": true,
                            "id": "service_editor",
                            "name": "service_editor",
                            "class" : "service-dropdown",
                            "label": context.getMessage("service"),
                            "width": 100,
                            "required": true,
                            "error": context.getMessage("error_make_selection"),
                            "field-help": {
                                "content": context.getMessage('rules_editor_serv_edit_service_info_tip'),
                                "ua-help-identifier": "alias_for_service_binding"
                            },
                            "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "add-new-button",
                                    "value": "Add New Service",
                                    
                            }]
                        }
                      ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnServiceOk",
                        "name": "btnServiceOk",
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

    return RuleGridServiceEditorConfiguration;

});
