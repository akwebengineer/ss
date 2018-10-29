/**
 * Form configuration required to render an VPN Tunnel/Route/Global Settings form using the FormWidget.
 *
 * @module VpnTunnelRouteGlobalSettingsFormConf
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function(
) {
    var VpnTunnelRouteGlobalSettingsFormConf = {
    };

    VpnTunnelRouteGlobalSettingsFormConf.getConfiguration = function(context) {
        return {
            //"title": context.getMessage("vpn_trg_settings_form_title"),
            "form_id": "vpn-trg-settings-settings",
            "form_name": "vpn-trg-settings-settings",
            "title-help": {
                "content": context.getMessage("vpn_trg_settings_form_title_help"),
                "ua-help-identifier": "alias_for_title_ua_event_binding"
            },
            "err_div_id": "errorDiv",
            "err_div_message": context.getMessage("form_error"),
            "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
            "err_div_link_text": "VPN Settings help",
            "err_timeout": "1000",
            "valid_timeout": "5000",
            "sections": [
                {
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_tunnel-settings"),
                    "section_id": "tunnel-settings",
                    "elements": [
                        {
                            "element_radio": true,
                            "id": "radio-group-interface-type",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_interface-type"),
                            "field-help": {
                                    "content": context.getMessage("ipsec_vpns_interface_type_inline_tooltip")
                                },
                            "values": [
                                {
                                    "name": "interface-type",
                                    "id": "interface-type-unnumbered-id",
                                //    "id": "interface-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_unnumbered"),
                                    "value": "UNNUMBERED",
                                    "checked": true
                                },
                                {
                                    "name": "interface-type",
                                    "id": "interface-type-numbered-id",
                                 //   "id": "interface-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_numbered"),
                                    "value": "NUMBERED",
                                    "checked": false
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "max-transmission-unit",
                            "id": "max-transmission-unit",
                            "name": "max-transmission-unit",
                            "label": "Max Transmission Unit",
                            "field-help": {
                                  "content":  context.getMessage("ipsec_vpns_subnet_mtu_tooltip")
                             },
                            "value": "{{max-transmission-unit}}",
                            "min_value": "0",
                            "max_value": "4294967295",
                            "help": context.getMessage("vpn_trg_settings_form_help_max-transmission-unit"),
                            "error": context.getMessage("vpn_trg_settings_form_error_max-transmission-unit")
                        },
                        // {
                        //         "element_multiple_error": true,
                        //         "class": "numbered",
                        //         "id": "ip-subnet",
                        //         "name": "ip-subnet",
                        //         "label": context.getMessage("vpn_trg_settings_form_label_ip-subnet"),
                        //         "field-help": {
                        //             "content": "Subnet example: 255.255.255.0"
                        //         },
                        //         "error": true,
                        //         "pattern-error": [
                        //             {
                        //                 "pattern": "ipv4",
                        //                 "error": context.getMessage("extranet_device_form_input_error_ip-subnet")
                        //             }
                        //         ],
                        //         "notshowvalid": true
                        // },
                        {
                            "element_ipCidrWidget": true,
                            "class": "numbered",
                            "id": "network-ip-widget",
                            "label": context.getMessage("vpn_trg_settings_form_label_network-ip"),
                            "ip_field-help": {
                                    "content":  context.getMessage("ipsec_vpns_network_ip_inline_tooltip")
                            },
                            "ip_id": "network-ip-address",
                            "ip_name": "network-ip-address",
                            "ip_placeholder": "192.168.1.0",
                            "ip_required": "true",
                            "ip_tooltip": "IPv4 example: 192.168.1.0",
                            "ip_error": context.getMessage("vpn_trg_settings_form_error_network-ip"),
                            "cidr_id": "network-ip-cidr",
                            "cidr_name": "network-ip-cidr",
                            "cidr_placeholder": context.getMessage("vpn_trg_settings_form_label_network-mask"),
                            "cidr_error" : context.getMessage("vpn_trg_settings_invalid_mask"),
                            "subnet_label": context.getMessage("address_network_subnet"),
                            "subnet_field-help": {
                                    "content":  context.getMessage("ipsec_vpns_subnet_mask_inline_tooltip")
                            },
                            "subnet_id": "network-ip-subnet-mask",
                            "subnet_name": "network-ip-subnet-mask",
                            "subnet_placeholder": "E.g.,255.255.255.0",
                            "subnet_required": "true",
                            "subnet_error": context.getMessage("vpn_trg_settings_form_error_network-ip-subnet")
                        },
                        {
                            "element_radio": true,
                            "class": "numbered no-of-spokes-radio",
                            "id": "radio-group-no-of-spokes",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_number-of-spokes"),
                             "field-help": {
                                        "content": context.getMessage("ipsec_vpns_routing_spoke_devices_inline_tooltip")
                                    },
                            "values": [
                                {
                                    "id": "no-of-spokes-all-id",
                                    "name": "no-of-spokes",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_all"),
                                    "value": "ALL",
                                    "checked": true
                                },
                                {
                                    "id": "no-of-spokes-id",
                                    "name": "no-of-spokes",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_specify-values"),
                                    "value": "SPECIFY_VALUE",
                                    "checked": false
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "numbered no-of-spokes-value",
                            "id": "no-of-spokes-value",
                            "name": "no-of-spokes-value",
                            "label": context.getMessage("vpn_trg_settings_form_label_no-of-spokes-value"),
                            "value": "",
                            "min_value":"1",
                            "max_value":"1000000",
                            "help": context.getMessage("vpn_trg_settings_form_help_no-of-spokes-value"),
                            "error": context.getMessage("vpn_trg_settings_form_error_no-of-spokes-value")
                        }
                    ]
                },
                {
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_route-settings"),
                    "section_id": "route-settings",
                    "elements": [
                        {
                            "element_radio": true,
                            "class": "routing-options",
                            "id": "radio-group-routing-options",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_routing-options"),
                             "field-help": {
                                    "content": context.getMessage("ipsec_vpns_routing_options_inline_tooltip")
                                },
                            "values": [
                                {
                                    "id": "routing-options-static-id",
                                    "name": "routing-options",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_static"),
                                    "value": "STATIC",
                                    "checked": true
                                },
                                {
                                    "id": "routing-options-ospf-id",
                                    "name": "routing-options",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_ospf"),
                                    "value": "OSPF",
                                    "checked": false
                                },
                                {
                                    "id": "routing-options-rip-id",
                                    "name": "routing-options",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_rip"),
                                    "value": "RIP",
                                    "checked": false
                                },
                                {
                                    "id": "routing-options-none-id",
                                    "name": "routing-options",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_none"),
                                    "value": "NO_ROUTING",
                                    "checked": false
                                }
                            ]
                        },
                        {
                            "element_checkbox": true,
                            "id": "export-routes",
                            "class": "export-routes-checkboxes",
                            "label": context.getMessage("vpn_trg_settings_form_checkbox_group_label_export-routes"),
                            "values": [
                                {
                                    "id": "static-routes",
                                    "name": "export-routes",
                                    "label": context.getMessage("vpn_trg_settings_form_checkbox_label_static-routes"),
                                    "value": "STATIC_ROUTES"
                                },
                                {
                                    "id": "ospf-routes",
                                    "name": "export-routes",
                                    "label": context.getMessage("vpn_trg_settings_form_checkbox_label_ospf-routes"),
                                    "value": "OSPF_ROUTES"
                                },
                                {
                                    "id": "rip-routes",
                                    "name": "export-routes",
                                    "label": context.getMessage("vpn_trg_settings_form_checkbox_label_rip-routes"),
                                    "value": "RIP_ROUTES"
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "area-id",
                            "id": "area-id",
                            "name": "area-id",
                            "label": context.getMessage("vpn_trg_settings_form_label_area-id"),
                            "value": "",
                            "min_value":"0",
                            "max_value":"4294967295",
                            "help": context.getMessage("vpn_trg_settings_form_help_area-id"),
                            "error": context.getMessage("vpn_trg_settings_form_error_area-id")
                        },
                        {
                            "element_number": true,
                            "class": "max-retransmission-time",
                            "id": "max-retransmission-time",
                            "name": "max-retransmission-time",
                            "label": context.getMessage("vpn_trg_settings_form_label_max-retransmission-time"),
                            "min_value":"5",
                            "max_value":"180",
                            "value": "50",
                            "help": context.getMessage("vpn_trg_settings_form_help_max-retransmission-time"),
                            "error": context.getMessage("vpn_trg_settings_form_error_max-retransmission-time")
                        },
                        {
                            "element_checkbox": true,
                            "class": "allow-spoke-to-spoke-communication",
                            "label": context.getMessage("vpn_trg_settings_form_label_spoke-to-spoke-communication"),
                            "field-help": {
                                       "content": context.getMessage("vpn_wizard_spoke_to_spoke_communication")
                                 },
                            "values": [
                                {
                                    "id": "spoke-to-spoke-communication",
                                    "name": "spoke-to-spoke-communication",
                                    "label": context.getMessage("vpn_trg_settings_form_checkbox_label_allow"),
                                    "value": "ALLOW"
                                }
                            ]
                        },
                    ]
                },
                {
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_global-settings"),
                    "elements": [
                        {
                            "element_text": true,
                            "id": "global-settings-grid",
                            "name": "global-settings-grid",
                            "class": "globalsettingsgrid",
                            "placeholder": "Loading ..."
                        }
                    ]
                }
            ]
        };
    }

    return VpnTunnelRouteGlobalSettingsFormConf;
});

