/**
 * A form configuration object with the common parameters required to build tunnel interface editor for
 * modify vpn tunnel enpoints.
 *
 * @module tunnelInterfaceFormConfiguration
 * @author Srinivasan Sriramulu <ssriram@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {
    var tunnelInterfaceSettingsFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_tunnel_address"),
                "form_id": "edit-tunnelAddressID_form",
                "form_name": "edit-tunnelAddressID_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnels_tunnel_address_title_help"),
                    "ua-help-identifier": "ipsec_vpns_tunnels_column_tunnel_address"
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
                                "element_ip": true,
                                "id": "tunnel-address-id",
                                "name": "tunnel-address-id",
                                "label": context.getMessage("ipsec_vpns_tunnels_column_tunnel_address"),
                                "placeholder": "",
                                "value": context.allData.tunnels.tunnel[0]["tunnel-address"],// for display value in overlay
                                "error": "Please enter a valid IP address version 4",
                                "pattern": "^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$",
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_tunnels_tunnel_address_field_help")
                                },
                                   "inlineButtons":[{
                                    "id": "get_next_ip",
                                    "class": "input_button",
                                    "name": "get_next_ip",
                                    "value": context.getMessage("ipsec_vpns_tunnels_btn_next_available_ip"),
                                }]
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

    return tunnelInterfaceSettingsFormConfiguration;

});
