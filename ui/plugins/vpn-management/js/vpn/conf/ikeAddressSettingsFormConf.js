/**
 * A form configuration object with the common parameters required to build ikeaddress editor for
 * modify vpn enpoint settings.
 *
 * @module ikeAddressFormConfiguration
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var ikeAddressFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_endpoint_ike_address_settings"),
                "form_id": "edit_routesettings_form",
                "form_name": "edit_routesettings_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_Ike_address_tooltip"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
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
                            /*{
                                "element_number": true,
                                "id": "proxy-id",
                                "name": "proxy-id",
                                "label": context.getMessage("ipsec_vpns_endpoint_proxyId_label"),
                                "value": ""
                            },*/
                            {
                                "element_ip": true,
                                "ip_version": "4",
                                "id": "ike-address",
                                "name": "ike-address",
                                "label": context.getMessage("ipsec_vpns_endpoint_ike_address_label"),
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_endpoint_ike_address_label_help"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "placeholder": "",
                                "error": "Please enter a valid IP address version 4"
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

    return ikeAddressFormConfiguration;

});
