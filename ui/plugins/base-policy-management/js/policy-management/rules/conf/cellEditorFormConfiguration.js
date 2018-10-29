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

    return cellEditorConfiguration;

});
