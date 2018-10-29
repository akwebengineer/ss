/**
 * A form configuration object with the common parameters required to build proxyid editor for
 * modify vpn enpoint settings.
 *
 * @module proxySettingsFormConfiguration
 * @author balasaritha <balasaritha@juniper.net>
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
                "title": context.getMessage("ipsec_vpns_endpoint_proxyId_settings"),
                "form_id": "edit_routesettings_form",
                "form_name": "edit_routesettings_form",
                "title-help": {
                    "content": "edit external interface",
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
                            {
                                //"element_ip": true,
                                //"ip_version": "4",
                                "element_text": true,
                                "id": "proxy-id",
                                "name": "proxy-id",
                                "label": context.getMessage("ipsec_vpns_endpoint_proxyId_label"),
                                "value": "{{proxy-id}}",
                                "placeholder": "",
                                "error": "Please enter a valid IP address version 4",
                                "pattern": ipPattern
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
