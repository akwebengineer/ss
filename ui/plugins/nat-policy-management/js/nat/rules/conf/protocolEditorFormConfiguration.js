/**
 * A form configuration object with the parameters required to build Protocol editor for rules in NAT Policies
 *
 * @module protocolEditorConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var protocolEditorConfiguration = function (context) {

        this.getConfig = function () {
            return {
                "title": context.getMessage('editor_title'),
                "heading_text": context.getMessage('editor_description'),
                "form_id": "protocolEditorForm",
                "form_name": "protocolEditorForm",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "name": "list-builder-element",
                                "label": context.getMessage('fw_rules_editor_protocol_list_label'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolder",
                                "field-help": {
                                    "content": context.getMessage('fw_rules_editor_protocol_list_label'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                }
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

    return protocolEditorConfiguration;

});
