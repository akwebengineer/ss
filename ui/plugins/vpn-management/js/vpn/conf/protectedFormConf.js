/**
 * A form configuration object with the common parameters required to build protected zone or interface editor for
 * global settings vpn wizard.
 *
 * @module protectedFormConfiguration
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var protectedFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_protected_zone_interface"),
                "form_id": "edit_protected_form",
                "form_name": "edit_protected_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_protected_zone_interface_title_help"),
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
                                "element_radio": true,
                                "id": "protected-id",
                                "name": "protected",
                                "label": context.getMessage("ipsec_vpns_protected"),
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_protected_field_help"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "protected-zone-id",
                                        "name": "protected",
                                        "label": context.getMessage("ipsec_vpns_protected_zone"),
                                        "checked": true,
                                        "value": "ZONES"
                                    },
                                    {
                                        "id": "protected-interface-id",
                                        "name": "protected",
                                        "label": context.getMessage("ipsec_vpns_protected_interface"),
                                        "checked": false,
                                        "value": "INTERFACES"
                                    }
 
                                ]
                            },
                            {
                                "element_text": true,
                                "id": "protected-zone-list-id",
                                "class": "list-builder",
                                "name": "create protected",
                                "placeholder": "Loading ..."
                            },
                            {
                                "element_text": true,
                                "id": "protected-interface-list-id",
                                "class": "list-builder",
                                "name": "create protected",
                                "placeholder": "Loading ..."
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": "OK"
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": "Cancel"
                }
            }
        };
    };

    return protectedFormConfiguration;

});
