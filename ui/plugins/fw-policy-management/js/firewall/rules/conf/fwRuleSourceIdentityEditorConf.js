/**
 * A form configuration object with the common parameters required to build different editors for rules in Firewall Policies
 *
 * @module cellEditorConfiguration
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var cellEditorConfiguration = function (context) {

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
                                "element_text": true,
                                "id": "list-builder-element",
                                "name": "list-builder-element",
                                "label": context.getMessage('editor_list_label'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolderHigh",
                                "field-help": {
                                    //todo: make it configurable in cellEditor
                                    "content": "When the option ‘Any Service’ is checked, any option inside the ‘Services’ list builder will be disabled.",
                                    //"content": context.getMessage('fw_rules_editor_address_list_help'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "add-new-button",
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

    return cellEditorConfiguration;

});
