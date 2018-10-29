/**
 * A form configuration object with the common parameters required to build external interface editor for
 * global settings vpn wizard.
 *
 * @module externalInterfaceFormConfiguration
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var externalInterfaceFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_external_interface"),
                "form_id": "edit_externalinterface_form",
                "form_name": "edit_externalinterface_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_external_interface_page_title_help")
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
                                "id": "externalInterface-id",
                                "name": "externalInterface",
                                "label": context.getMessage("ipsec_vpns_external_interface"),
                                "required": false,
                                "field-help": {
                                     "content": context.getMessage('ipsec_vpns_external_interface_page_field_help')
                                },
                                "values": [
                                ],
                                "error": "Please make a selection"

                             },


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

    return externalInterfaceFormConfiguration;

});
