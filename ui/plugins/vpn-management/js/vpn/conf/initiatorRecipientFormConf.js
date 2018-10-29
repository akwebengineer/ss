/**
 * A form configuration object with the common parameters required to build initiator/recipient editor for
 * endpoint settings grid
 *
 * @module initiatorRecipientFormConfiguration
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var initiatorRecipientFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_endpoint_initiator-recipient_settings"),
                "form_id": "edit_initiatorrecipient_form",
                "form_name": "edit_initiatorrecipient_form",
                "title-help": {
                    "content": "edit initiator recipient",
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
                                "id": "is-hub",
                                "name": "is-hub",
                                "label": context.getMessage("ipsec_vpns_endpoint_initiator-recipient_label"),
                                "field-help": {
                                },
                                "required": false,
                                "values": [
                                    {
                                        "label": context.getMessage('ipsec_vpns_endpoint_initiator'),
                                        "value": "Initiator"
                                    },
                                    {
                                        "label": context.getMessage('ipsec_vpns_endpoint_recipient'),
                                        "value": "Recipient"
                                    }
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

    return initiatorRecipientFormConfiguration;

});
