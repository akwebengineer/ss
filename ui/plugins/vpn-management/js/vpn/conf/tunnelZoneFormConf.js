/**
 * A form configuration object with the common parameters required to build tunnel zone editor for vpn wizard.
 *
 * @module tunnelZoneFormConfiguration
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var tunnelZoneFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnel_overlay_title"),
                "form_id": "edit_tunnelzone_form",
                "form_name": "edit_tunnelzone_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnel_zone_page_field_help")
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
                                "id": "select-tunnelZone-id",
                                "name": "select-tunnelZone",
                                "label": context.getMessage("ipsec_vpns_tunnel_select_type"),
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_tunnel_select_type_tooltip"),
                                    "ua-help-identifier": "alias_for_select_tunnel_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "select-tunnelZone-existing-id",
                                        "name": "select-tunnelZone",
                                        "label": context.getMessage("ipsec_vpns_select_existing"),
                                        "checked": true,
                                        "value": "SELECT"
                                    },
                                    {
                                        "id": "select-tunnelZone-create-id",
                                        "name": "select-tunnelZone",
                                        "label": context.getMessage("ipsec_vpns_create_new"),
                                        "checked": false,
                                        "value": "CREATE"
                                    }
                                ]
                            },

                            {
                                "element_text": true,
                                "jsonId": "id",
                                "id": "create-tunnelZone-id",
                                "name": "createZone",
                                "value": "{{name}}",
                                "label": context.getMessage("ipsec_vpns_tunnel_create_zone"),
                                "required": true,
                                "class": "create-tunnelZone",
                                "error": context.getMessage("ipsec_vpns_tunnel_create_zone_eror_message"),
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_tunnel_create_zone_tooltip"),
                                    "ua-help-identifier": "alias_for_create_zone_event_binding"
                                },
                            },
                            {
                                "element_dropdown": true,
                                "id": "drop-tunnelZone-id",
                                "name": "tunnelZone",
                                "label": context.getMessage("ipsec_vpns_tunnel_zone"),
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_tunnel_select_existing_zone_tooltip"),
                                    "ua-help-identifier": "alias_for_select_existing_zone_event_binding"
                                },
                                "required": false,
                                "class": "select-tunnelZoneDropDown",
                                "values": [
                                          {
                                            "label": "",
                                            "value": ""
                                          }
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

    return tunnelZoneFormConfiguration;

});
