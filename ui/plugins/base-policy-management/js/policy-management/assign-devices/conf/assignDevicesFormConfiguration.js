/**
 * Form configuration for assign devices
 *
 * @module Assign Devices
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var assignDevicesFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("assign_devices"),
                "form_id": "assign_device_form",
                "form_name": "assign_device_form",
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("assign_devices"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage("assign_device_title_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_DEVICE_ASSIGNING")
                },
                
                "sections": [
                    {
                        "section_id": "assign_devices_basic_form",
                        "elements": [
                                {
                                "element_description": true,
                                "id": "name",
                                "name": "name",
                                "value": "{{name}}",
                                "required": false,
                                "label": context.getMessage('name')
                            },
                            {
                                "element_checkbox": true,
                                "id": "showDevicesWithoutPolicy",
                                "class": "assignDevicesGroupForm",
                                "label": "",
                                "values": [
                                    {
                                        "id": "showDevicesWithoutPolicy",
                                        "name": "showDevicesWithoutPolicy",
                                        "label": context.getMessage("assign_devices_show_only_devices"),
                                        "value": "enable",
                                        "checked" : false
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        "section_id" : "assign_devices_group_form",
                        "elements" : [
                            {
                                "element_text": true,
                                "id": "assignDeviceListBuilder",
                                "class": "list-builder listBuilderPlaceHolder",
                                "placeholder": context.getMessage('loading'),
                                "name": "assignDeviceListBuilder",
                                "label": context.getMessage('assign_devices_device_selection')
                            }
                        ]
                    },
                    {
                        "section_id" : "assign_devices_device_form",
                        "elements" : [
                            {
                                "element_description": true,
                                "id": "assignDeviceDropDown",
                                "name": "assignDeviceDropDown",
                                "class": "assignDevicesDeviceForm",
                                "label": context.getMessage("device"),
                                "required": false,
                                "values": [
                                    {
                                        "label": context.getMessage("select_option"),
                                        "value": ""
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnPolicyOk",
                        "name": "btnPolicyOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkPolicyCancel",
                    "value": context.getMessage("cancel")
                }
            };
        };
    };

    return assignDevicesFormConfiguration;

});
