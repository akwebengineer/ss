/**
 * A form configuration object with the common parameters required to build certificate editor for
 * endpoint settings grid
 *
 * @module certSettingsFormConfiguration
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var certSettingsFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_endpoint_certificate_settings"),
                "form_id": "edit_routinginstance_form",
                "form_name": "edit_routinginstance_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_endpoint_certificate_settings_title_help"),
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
                                "element_dropdown": true,
                                "id": "certificate-id",
                                "name": "certificate",
                                "label": context.getMessage("ipsec_vpns_endpoint_certificate_label"),
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_endpoint_certificate_settings_field_help")
                                },
                                "required": false,
                                "values": [
                                ],
                                "error": "Please make a selection"
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

    return certSettingsFormConfiguration;

});
