/**
 * Service Editor form configuration
 * @module serviceEditorConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var serviceEditorConfiguration = function (context) {

        this.getConfig = function () {
            return {
                "title": context.getMessage('editor_title'),
                "heading_text": context.getMessage('editor_description'),
                "form_id": "cellEditorForm",
                "form_name": "cellEditorForm",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "radio_field",
                                "label": context.getMessage('service_selection'),
                                "values": [
                                    {
                                        "id": "radio_include_any",
                                        "name": "radio_button",
                                        "label": context.getMessage('fw_rules_editor_service_filter_include_any'),
                                        "checked": true,
                                        "value": "include-any"
                                    },
                                    {
                                        "id": "radio_include",
                                        "name": "radio_button",
                                        "label": context.getMessage('fw_rules_editor_service_filter_include'),
                                        "value": "include"
                                    }
                                ]
                            },
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "name": "list-builder-element",
                                "label": context.getMessage('editor_list_label'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolderHigh",
                                "field-help": {
                                     "content": context.getMessage("rule_select_service_help")
                                },
                                "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-secondary-button",
                                    "name": "add-new_button",
                                    "value": context.getMessage('editor_addNewButton')
                                }]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "cancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return serviceEditorConfiguration;

});
