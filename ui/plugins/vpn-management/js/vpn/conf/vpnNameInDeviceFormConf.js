/**
 * A form configuration object with the common parameters required to build VPN Name editor for
 * modify vpn tunnel endpoints.
 *
 * @module vpnNameInDeviceFormConf
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var vpnNameInDeviceFormConfig = function (context) {

        this.getValues = function () {
            return {
            //    "title": context.getMessage("ipsec_vpns_endpoint_ike_address_settings"),
                "title": "VPN Name in Device ",
                "form_id": "edit_vpnDeviceName_form",
                "form_name": "edit_vpnDeviceName_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_endpoint_vpnName_inDevice_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_vpn_name"
                },
                "err_div_id": "errorDiv",
                "err_div_message": "form_error",
                "err_div_link_text": "none",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "vpn-name-in-device",
                                "name": "vpn-name-in-device",
                                "label": context.getMessage("ipsec_vpns_tunnels_column_vpn_name_in_device"),
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_\/]{0,62}$",
                                "error": context.getMessage("ipsec_vpns_tunnels_form_vpn_name_empty_error"),
                                "value": "{{vpn-name-in-device}}",
                                "field-help": {
                                  "content" : context.getMessage("ipsec_vpns_endpoint_vpnName_inDevice_field_help")
                                }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage("ok")
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return vpnNameInDeviceFormConfig;

});
