/**
 * A form configuration object source identity device editor for rules in Firewall Policies
 *
 * @module DeviceEditorConfiguration
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var deviceEditorConfiguration = function (context) {

        this.getConfig = function () {
            return {
                "title": "Device",  //context.getMessage('fw_rules_editor_sourceIdentity_device_title'),
                "heading_text": "Retrieve the available roles from a single SRX Series device or from multiple SRX Series Devices", //context.getMessage('fw_rules_editor_sourceIdentity_device_description'),
                "form_id": "deviceEditorForm",
                "form_name": "deviceEditorForm",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "deviceEditor",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "device-list-builder-element",
                                "name": "device-list-builder-element",
                                "label": "Devices", // context.getMessage('fw_rules_editor_sourceIdentity_device_label'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder",
                                "field-help": {
                                    //todo: make it configurable in cellEditor
                                    "content": "When the option ‘Any Service’ is checked, any option inside the ‘Services’ list builder will be disabled.",
                                    //"content": context.getMessage('fw_rules_editor_address_list_help'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                }
                                // "inlineButtons": [{
                                //     "id": "add-new-button",
                                //     "class": "slipstream-primary-button slipstream-secondary-button",
                                //     "name": "add-new-button",
                                //     "value": "Add Device"
                                // }]
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

    return deviceEditorConfiguration;

});
