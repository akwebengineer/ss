/**
 * A form configuration object with the common parameters required to build export route settings
 * based on protocol
 *
 * @module routeSettingsExportFormConfiguration
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var routeSettingsExportFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_route_settings"),
                "form_id": "edit_routesettings_form",
                "form_name": "edit_routesettings_form",
                "title-help": {
                    "content": "route-settings",
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
                                "element_checkbox": true,
                                "id": "protocol-ospf",
                                "class": "export-ospf-checkboxes",
                                "label": context.getMessage("vpn_trg_settings_form_checkbox_group_label_export-routes"),
                                "values": [
                                    {
                                        "id": "export-protocol-static",
                                        "name": "protocol-ospf",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_static-routes"),
                                        "value": "STATIC_ROUTES"
                                    },
                                    {
                                        "id": "export-protocol-rip",
                                        "name": "protocol-ospf",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_rip-routes"),
                                        "value": "RIP_ROUTES"
                                    }
                                ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "protocol-rip",
                                "class": "export-rip-checkboxes",
                                "label": context.getMessage("vpn_trg_settings_form_checkbox_group_label_export-routes"),
                                "values": [
                                    {
                                        "id": "export-protocol-static1",
                                        "name": "protocol-rip",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_static-routes"),
                                        "value": "STATIC_ROUTES"
                                    },
                                    {
                                        "id": "export-protocol-ospf",
                                        "name": "protocol-rip",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_ospf-routes"),
                                        "value": "OSPF_ROUTES"
                                    }
                                ]
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

    return routeSettingsExportFormConfiguration;

});
