/**
 * Form configuration required to render modify VPN Tunnel/Route/ Settings form using the FormWidget.
 *
 * @module ModifyVpnTunnelRouteSettingsFormConf
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function(
) {
    var ModifyVpnTunnelRouteSettingsFormConf = {
    };

    ModifyVpnTunnelRouteSettingsFormConf.getConfiguration = function(context) {

        return {

            "title": context.getMessage("vpn_modify_tunnel_route_settings_title"),
            "form_id": "modify-vpn-tr-settings",
            "form_name": "modify-vpn-tr-settings",
            "on_overlay": true,
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
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_vpn"),
                    "elements": [
                        {
                            "element_description": true,
                            "id": "name",
                            "label": context.getMessage("name"),
                            "value": "{{name}}"
                        },
                        {
                            "element_description": true,
                            "id": "text_type",
                            "label": context.getMessage("ipsec_vpns_grid_column_name_type"),
                            "value": "{{vpnType}}"
                        }
                    ]
                },
                {
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_tunnel-settings"),
                    "elements": [
                        {
                            "element_radio": true,
                            "id": "tunnel-interface-type",
                            "name": "tunnel-interface-type",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_interface-type"),
                            "values": [
                                {
                                    "name": "tunnel-interface-type",
                                    "id": "tunnel-interface-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_unnumbered"),
                                    "value": "UNNUMBERED",
                                    "checked": true
                                },
                                {
                                    "name": "tunnel-interface-type",
                                    "id": "tunnel-interface-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_numbered"),
                                    "value": "NUMBERED"
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "max-transmission-unit",
                            "id": "max-transmission-unit",
                            "name": "max-transmission-unit",
                            "label": context.getMessage("vpn_trg_settings_form_label_max-transmission-unit"),
                            "value": "{{max-transmission-unit}}",
                            "min_value": "0",
                            "max_value": "4294967295",
                            "help": context.getMessage("vpn_trg_settings_form_help_max-transmission-unit"),
                            "error": context.getMessage("vpn_trg_settings_form_error_max-transmission-unit")
                        },
                        {
                            "element_ipCidrWidget": true,
                            "class": "numbered",
                            "id": "network-ip-widget",
                            "label": context.getMessage("vpn_trg_settings_form_label_network-ip"),
                            "ip_id": "network-ip-address",
                            "ip_name": "network-ip-address",
                            "ip_placeholder": "192.168.1.0",
                            "ip_required": "false",
                            "ip_error": context.getMessage("vpn_trg_settings_form_error_network-ip"),
                            "ip_tooltip": "IPv4 example: 192.168.1.0",
                            "ip_value": "{{tunnel-ip-range.network-ip}}",
                            "cidr_id": "network-ip-cidr",
                            "cidr_name": "network-ip-cidr",
                            "cidr_placeholder": "24",
                            "cidr_value": "{{tunnel-ip-range.mask}}",
                            "cidr_error": context.getMessage("vpn_trg_settings_form_error_network-ip-subnet"),
                            "subnet_id": "network-ip-subnet-mask",
                            "subnet_name": "network-ip-subnet-mask",
                            "subnet_required": "false"
                        },
                        {
                            "element_radio": true,
                            "class": "numbered no-of-spokes",
                            "id": "no-of-spokes",
                            "name": "no-of-spokes",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_number-of-spokes"),
                            "values": [
                                {
                                    "id": "no-of-spokes",
                                    "name": "no-of-spokes",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_all"),
                                    "value": "ALL",
                                    "checked": true
                                },
                                {
                                    "id": "no-of-spokes",
                                    "name": "no-of-spokes",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_specify-values"),
                                    "value": "SPECIFY_VALUE"
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "numbered no-of-spokes-value",
                            "id": "tunnel-multi-point-size",
                            "name": "tunnel-multi-point-size",
                            "label": context.getMessage("vpn_trg_settings_form_label_no-of-spokes-value"),
                            "value": "{{tunnel-multi-point-size}}",
                            "min_value":"1",
                            "max_value":"256",
                            "help": context.getMessage("vpn_trg_settings_form_help_no-of-spokes-value"),
                            "error": context.getMessage("vpn_trg_settings_form_error_no-of-spokes-value")
                        }
                    ]
                },
                {
                    "heading": context.getMessage("vpn_trg_settings_form_section_heading_route-settings"),
                    "elements": [
                        {
                            "element_radio": true,
                            "class": "routing-options",
                            "id": "routing-type",
                            "name": "routing-type",
                            "label": context.getMessage("vpn_trg_settings_form_radio_group_label_routing-options"),
                            "values": [
                                {
                                    "id": "routing-type",
                                    "name": "routing-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_static"),
                                    "value": "STATIC",
                                    "checked": true
                                },
                                {
                                    "id": "routing-type",
                                    "name": "routing-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_ospf"),
                                    "value": "OSPF"
                                },
                                {
                                    "id": "routing-type",
                                    "name": "routing-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_rip"),
                                    "value": "RIP"
                                },
                                {
                                    "id": "routing-type",
                                    "name": "routing-type",
                                    "label": context.getMessage("vpn_trg_settings_form_radio_label_none"),
                                    "value": "NO_ROUTING"
                                }
                            ]
                        },
                        {
                            "element_number": true,
                            "class": "area-id",
                            "id": "area-id",
                            "name": "area-id",
                            "label": context.getMessage("vpn_trg_settings_form_label_area-id"),
                            "value": "{{ospf-area-id}}",
                            "min_value":"0",
                            "max_value":"4294967295",
                            "help": context.getMessage("vpn_trg_settings_form_help_area-id"),
                            "error": context.getMessage("vpn_trg_settings_form_error_area-id")
                        },
                        {
                            "element_number": true,
                            "class": "max-retrans-time",
                            "id": "max-retrans-time",
                            "name": "max-retrans-time",
                            "label": context.getMessage("vpn_trg_settings_form_label_max-retransmission-time"),
                            "min_value":"5",
                            "max_value":"180",
                            "value": "{{max-retrans-time}}",
                            "help": context.getMessage("vpn_trg_settings_form_help_max-retransmission-time"),
                            "error": context.getMessage("vpn_trg_settings_form_error_max-retransmission-time")
                        },
                        {
                            "element_checkbox": true,
                            "class": "allow-spoke-to-spoke-communication",
                            "label": context.getMessage("vpn_trg_settings_form_label_spoke-to-spoke-communication"),
                            "values": [
                                {
                                    "id": "allow-spoke-to-spoke-communication",
                                    "name": "allow-spoke-to-spoke-communication",
                                    "label": context.getMessage("vpn_trg_settings_form_checkbox_label_allow"),
                                    "value": "ALLOW",
                                    "checked": false
                                }
                            ]
                        },
                    ]
                }
            ],
            "buttonsAlignedRight": true,
            "buttons": [
                {
                    "id": "linkClose",
                    "name": "linkClose",
                    "value": context.getMessage('cancel'),
                    "isInactive": "true" // Does not actually make it inactive, just gives it the secondary class
                },
                {
                    "id": "btnOk",
                    "name": "ok",
                    "value": context.getMessage('ok')
                }
            ]
        };
    }

    return ModifyVpnTunnelRouteSettingsFormConf;
});

