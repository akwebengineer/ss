/**
 * A form configuration object with the common parameters required to build source/destination portsets editors for rules in NAT Policies
 *
 * @module portSetsEditorConfiguration
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var portSetsEditorConfiguration = function (context) {

        this.getConfig = function () {
            return {
                "title": context.getMessage('editor_title'),
                "heading_text": context.getMessage('editor_description'),
                "form_id": "portSetsEditorForm",
                "form_name": "portSetsEditorForm",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "elements": [
                            {
                                "element_textarea": true,
                                "id": "natrules-ports",
                                "name": "ports",
                               // "value": "{{ports}}",
                                "pattern": "^[0-9\-,]+$",
                                "label": context.getMessage('nat_rules_editor_ports_label'),
                                "help": context.getMessage('nat_rules_editor_ports_help'),
                                "error": context.getMessage('nat_rules_editor_ports_error'),
                                "post_validation": "validatePortRange"
                            },
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "label": context.getMessage('nat_rules_editor_port_list_label'),
                                "name": "list-builder-element",
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder",
                                "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "add-new_button",
                                    "value": "Add New"
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

    return portSetsEditorConfiguration;

});
