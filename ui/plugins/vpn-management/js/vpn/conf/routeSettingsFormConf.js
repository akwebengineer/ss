/**
 * A form configuration object with the common parameters required to build route settings editor for
 * modify vpn enpoint settings.
 *
 * @module routeSettingsFormConfiguration
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var routeSettingsFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_route_settings"),
                "form_id": "edit_routesettings_form",
                "form_name": "edit_routesettings_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_route_settings_title_help"),
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
                                "id": "export-routes",
                                "class": "export-routes-checkboxes",
                                "label": context.getMessage("vpn_trg_settings_form_checkbox_group_label_export-routes"),
                                "values": [
                                    {
                                        "id": "export-routes-static",
                                        "name": "static-routes",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_static-routes"),
                                        "value": "STATIC_ROUTES"
                                    },
                                    {
                                        "id": "export-routes-ospf",
                                        "name": "ospf-routes",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_ospf-routes"),
                                        "value": "OSPF_ROUTES"
                                    },
                                    {
                                        "id": "export-routes-rip",
                                        "name": "rip-routes",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_rip-routes"),
                                        "value": "RIP_ROUTES"
                                    },
                                    {
                                        "id": "export-routes-default",
                                        "name": "default-routes",
                                        "label": context.getMessage("vpn_trg_settings_form_checkbox_label_default-routes"),
                                        "value": "DEFAULT_ROUTES"
                                    }
                                ],
                                 "field-help": {
                                     "content": context.getMessage("ipsec_vpns_route_settings_field_help")
                                  }
                            },
                            {
                                "element_number": true,
                                "id": "metric",
                                "name": "metric",
                                "class": "metric",
                                "label": context.getMessage("ipsec_vpns_endpoints_column_route_settings_metric"),
                                "error": context.getMessage("policy_profiles_form_field_error_range"),
                                "value": "{{metric}}",
                                "min_value":"0",
                                "max_value":"4294967295"
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

    return routeSettingsFormConfiguration;

});
