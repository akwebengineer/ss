/**
 * A form configuration object with the common parameters required to build VPN for modify vpn tunnel endpoints.
 *
 * @module preSharedKeyFormConf
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var preSharedKeyFormConfig = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_preshared_key_settings"),
                "form_id": "edit_Key_form",
                "form_name": "edit_Key_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnels_preshared_key_settings_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_preshared_key"
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
                               "id": "pre-shared-key",
                               "name": "pre-shared-key",
                               "label": context.getMessage("ipsec_vpns_tunnels_column_preshared_key"),
                               "value": "{{preshared-key}}",
                               "pattern": "^[a-zA-Z0-9!@#$%^&*()][a-zA-Z0-9~`!@#$%^&*()_./+-\\-\\s\/]{0,256}$",
                               "error": context.getMessage("ipsec_vpns_tunnels_form_preshared_key_empty_error"),
                               "field-help": {
                                  "content" : context.getMessage("ipsec_vpns_tunnels_preshared_key_settings_field_help")
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
                    "id": "KeyCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return preSharedKeyFormConfig;

});
