/**
 * A form configuration object with the common parameters required to build source/destination address editors for rules in Firewall Policies
 *
 * @module addressEditorConfiguration
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var addressEditorConfiguration = function (context) {

        this.getConfig = function(addressSelectionHelp) {
            return {
                "title": context.getMessage('editor_title'),
                "title-help": {
                    "content": context.getMessage('rules_editor_source_address_overlay_title_info_tips'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_CREATING")
                },
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
                                "label": context.getMessage('fw_rules_editor_address_filter_label'),
                                "field-help": {
                                    "content": context.getMessage('rules_editor_address_selection_label_info_tip'),
                                },
                                "values": [
                                    {
                                        "id": "radio_include_any",
                                        "name": "radio_button",
                                        "label": context.getMessage('fw_rules_editor_address_filter_include_any'),
                                        "checked": true,
                                        "value": "include-any"
                                    },
                                    {
                                        "id": "radio_include",
                                        "name": "radio_button",
                                        "label": context.getMessage('fw_rules_editor_address_filter_include'),
                                        "value": "include"
                                    },
                                    {
                                        "id": "radio_exclude",
                                        "name": "radio_button",
                                        "label": context.getMessage('fw_rules_editor_address_filter_exclude'),
                                        "value": "exclude"
                                    }
                                ]
                            },
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "label": context.getMessage('fw_rules_editor_address_list_label'),
                                "field-help": {
                                    "content": context.getMessage('rules_editor_address_label_info_tip'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "name": "list-builder-element",
                                "field-help": {
                                    "content": context.getMessage(addressSelectionHelp)
                                },
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolderHigh",
                                "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "add-new_button",
                                    "value": context.getMessage("editor_addNewButton")
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

    return addressEditorConfiguration;

});
