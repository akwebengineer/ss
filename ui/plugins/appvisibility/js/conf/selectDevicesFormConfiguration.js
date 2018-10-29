/**
 * Form configuration for select devices
 *
 * @module Select Devices
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var SelectDevicesFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("select_devices_title"),
                "form_id": "app_vis_select_device_form",
                "form_name": "app_vis_select_device_form",
                "title-help": {
                    "content": context.getMessage("select_devices_content_help"),
                    "ua-help-identifier": "alias_for_title_select_devices_binding"
                },
                //"err_div_id": "errorDiv",
                //"err_div_message": context.getMessage("form_error"),
                //"err_div_link_text": context.getMessage("assign_devices"),
                //"err_timeout": "1000",
                //"valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "select_devices_basic_form",
                        "elements": [{
                                "element_radio": true,
                                "label": context.getMessage('select_devices_all_selective'),
                                "field-help": {
                                    "content": context.getMessage('select_devices_field_help'),
                                    "ua-help-identifier": "alias_for_select_devices_field_binding"
                                },
                                "values": [
                                        {
                                            "id": "app_vis_device_selection_all",
                                            "name": "app_vis_device_selection_radio",
                                            "label": "All",
                                            "value": "ALL-DEVICE",
                                            "checked": true
                                        },
                                        {
                                            "id": "app_vis_device_selection_selective",
                                            "name": "app_vis_device_selection_radio",
                                            "label": "Selective",
                                            "value": "SELECTIVE-DEVICES"
                                        }
                                    ]
                            }, {
                                "element_text": true,
                                "id": "app_vis_deviceListBuilder",
                                "class": "list-builder",
                                "placeholder": context.getMessage('select_devices_loading'),
                                "label": ""
                            }]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnSelectDevicesOk",
                        "name": "btnSelectDevicesOk",
                        "value": context.getMessage('app_vis_ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkSelectDevicesCancel",
                    "value": context.getMessage("app_vis_cancel")
                }
            }
        }
    };
    return SelectDevicesFormConfiguration;
});