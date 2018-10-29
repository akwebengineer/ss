/**
 * A form configuration object with the common parameters required to build proxyid editor for
 * modify vpn tunnel enpoints.
 *
 * @module localProxyFormConfiguration
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

     var ipPattern = "^("
                      + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])"
                      + "|"
                      + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))"
                      + ")$";

    var proxySettingsFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_proxy_id"),
                "form_id": "edit_proxyID_form",
                "form_name": "edit_proxyID_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_endpoint_proxyID_settings_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_local_proxy"
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
                                "id": "local-proxyid",
                                "name": "local-proxyid",
                                "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_local_proxy"),
                                "placeholder": "",
                                "value": "{{local-proxyid}}",
                                "error": context.getMessage("ipsec_vpns_tunnels_invalid_entry_ip_address_error"),
                                "pattern": ipPattern,
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_endpoint_proxyID_settings_local_field_help")
                                }
                             },
                             {
                                "element_text": true,
                                "id": "remote-proxyid",
                                "name": "remote-proxyid",
                                "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_remote_proxy"),
                                "placeholder": "",
                                "value": "{{remote-proxyid}}",
                                "error": context.getMessage("ipsec_vpns_tunnels_invalid_entry_ip_address_error"),
                                "pattern": ipPattern,
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_endpoint_proxyID_settings_remote_field_help")
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

    return proxySettingsFormConfiguration;

});
