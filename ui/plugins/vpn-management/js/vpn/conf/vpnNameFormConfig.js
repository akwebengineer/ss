/**
 * Vpn Name Page form configuration
 *
 * @module vpnNameFormConfig
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var Configuration = function(context) {
        this.getValues = function() {

            return {

                "form_id": "vpn_wizard_name_form",
                "form_name": "vpn_wizard_name_form",
                "err_div_id": "errorDiv",
                "err_div_message": "{{help_form_error}}",
                "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_timeout": "1000",
                "valid_timeout": "0",
                "sections": [
                    {
                         "heading_text": context.getMessage('vpn_wizard_name_page_desc'),
                         "elements": [
                             {
                                 "element_multiple_error": true,
                                 "id": "vpn-name-id",
                                 "name": "name",
                                 "label": context.getMessage('vpn_wizard_name_label'),
                                  "field-help": {
                                         "content": context.getMessage("alert_def_form_name_hint")
                                  },
                                 "required": true,
                                 "error": true,
                                 "value": "{{name}}",
                                 "pattern-error": [
                                     {
                                         "pattern": "length",
                                         "min_length":"1",
                                         "max_length":"255",
                                         "error": context.getMessage("vpn_wizard_name_character_length_error")
                                     },
                                     {
                                         "pattern": "hasalphanumericdashunderscore",
                                         "error": context.getMessage("vpn_wizard_name_error_message")
                                     },
                                     {
                                         "pattern": "validtext",
                                         "error": context.getMessage("vpn_profiles_form_field_error_required")
                                     }
                                 ]
                             },
                             {
                                 "element_textarea": true,
                                 "id" : "vpn-description-id",
                                 "name" : "description",
                                 "value": "{{description}}",
                                 "label" : context.getMessage('vpn_wizard_description_label'),
                                 "field-help": {
                                      "content": context.getMessage("vpn_create_wizard_description_tooltip")
                                  },
                                 "required": false
                             },
                             {
                                 "element_radio": true,
                                 "id" : "tunnel-mode-id",
//                                 "name" : "tunnel-mode",
                                 "label" : context.getMessage('vpn_wizard_tunnel_mode_label'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_tunnel_mode_field_help')
                                 },
                                 "required": false,
                                 "values": [
                                     {
                                         "id": "route-based-id",
                                         "name": "tunnel-mode",
                                         "label": context.getMessage('vpn_wizard_route_based_button'),
                                         "value": "ROUTE_BASED",
                                         "checked": true
                                     },
                                     {
                                         "id": "policy-based-id",
                                         "name": "tunnel-mode",
                                         "label": context.getMessage('vpn_wizard_policy_based_button'),
                                         "value": "POLICY_BASED",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                 "element_checkbox": true,
                                 "id": "multi-proxyid-id",
                                 "name": "multi-proxyid-enable",
                                 "label": context.getMessage('vpn_wizard_multi_proxyid'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_multi_proxyid_field_help')
                                 },
                                 "class": "hide route-based",
                                 "values": [
                                     {
                                         "id": "multi-proxyid-enable-id",
                                         "name": "multi-proxyid-enable",
                                         "label": context.getMessage('vpn_wizard_multi_proxyid_enable_checkbox'),
                                         "value": "",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                 "element_radio": true,
                                 "id" : "vpn-type-id",
                                 "label" : context.getMessage('vpn_wizard_type_label'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_type_field_help')
                                 },
                                 "class": "hide route-based",
                                 "values": [
                                     {
                                         "id": "site-to-site-id",
                                         "name": "vpn-type-button",
                                         "label": context.getMessage('vpn_wizard_site_to_site_1_tooltip'),
                                         "value": "SITE_TO_SITE",
                                         "checked": true
                                     },
                                     {
                                         "id": "full-mesh-id",
                                         "name": "vpn-type-button",
                                         "label": context.getMessage('vpn_wizard_full_mesh_button'),
                                         "value": "FULL_MESH",
                                         "checked": false,
                                     },
                                     {
                                         "id": "hub-and-spoke-id",
                                         "name": "vpn-type-button",
                                         "label": context.getMessage('vpn_wizard_hub_and_spoke_1_tooltip'),
                                         "value": "HUB_N_SPOKE",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                 "element_radio": true,
                                 "id" : "vpn-type-site-only-id",
                                 "label" : context.getMessage('vpn_wizard_type_label'),
                                 "field-help": {
                                     "content": '<b>' + context.getMessage('vpn_wizard_site_to_site_1_tooltip') + '</b>' +
                                                        context.getMessage('vpn_wizard_site_to_site_2_tooltip') + '<br>' +
                                                '<b>' + context.getMessage('vpn_wizard_full_mesh_1_tooltip') + '</b>' +
                                                        context.getMessage('vpn_wizard_full_mesh_2_tooltip') + '<br>' +
                                                '<b>' + context.getMessage('vpn_wizard_hub_and_spoke_1_tooltip') + '</b>' +
                                                        context.getMessage('vpn_wizard_hub_and_spoke_2_tooltip')
                                 },
                                 "class": "hide policy-based",
                                 "values": [
                                     {
                                         "id": "site-to-site-policy-id",
                                         "name": "vpn-type-button1",
                                         "label": context.getMessage('vpn_wizard_site_to_site_button'),
                                         "value": "option1",
                                         "checked": true
                                     }
                                 ]
                             },
                             {
                                 "element_checkbox": true,
                                 "name" : "auto-vpn",
                                 "label" : context.getMessage('vpn_wizard_auto_vpn'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_auto_vpn_1_tooltip') + '<br>' +
                                                context.getMessage('vpn_wizard_auto_vpn_2_tooltip')
                                 },
                                 "class": "hide hub-and-spoke",
                                 "values": [
                                     {
                                         "id": "auto-vpn-id",
                                         "name": "auto-vpn",
                                         "label": context.getMessage('vpn_wizard_auto_vpn_enable_checkbox'),
                                         "value": "",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                 "element_checkbox": true,
                                 "id" : "advpn-id",
                                 "name" : "advpn",
                                 "label" : context.getMessage('vpn_wizard_advpn'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_advpn_1_tooltip')
                                 },
//                                 "class": "hide hub-and-spoke",
                                 "class": "hide auto-vpn",
                                 "values": [
                                     {
                                         "id": "advpn-id",
                                         "name": "advpn",
                                         "label": context.getMessage('vpn_wizard_advpn_enable_checkbox'),
                                         "value": "",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                    "element_number": true,
                                    "id": "shortcut-conn-limit",
                                    "name": "shortcut-conn-limit",
                                    "class": "hide shortcut-conn-limit",
                                    "label": context.getMessage('vpn_wizard_advpn_Shortcut_connection_limit'),
                                    "placeholder": "",
                                    "value": "{{shortcut-conn-limit}}",
                                    "min_value":"0",
                                    "max_value":"4294967295",
                                    "error": context.getMessage("shortcut-conn-limit_error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_shortcut_field_help")
                                    }

                             },
                             {
                                    "element_number": true,
                                    "id": "idle-threshold",
                                    "name": "idle-threshold",
                                    "class": "hide idle-threshold",
                                    "label": context.getMessage('vpn_wizard_advpn_idle_Threshold'),
                                    "placeholder": "",
                                    "value": "{{idle-threshold}}",
                                    "min_value":"3",
                                    "max_value":"5000",
                                    "error": context.getMessage("shortcut-conn-idle-threshold-error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_idle_threshold_field_help")
                                    }

                             },
                             {
                                    "element_number": true,
                                    "id": "idle-time",
                                    "name": "idle-time",
                                    "class": "hide idle-time",
                                    "label":  context.getMessage('vpn_wizard_advpn_idle_time'),
                                    "placeholder": "",
                                    "value": "{{idle-time}}",
                                    "min_value":"60",
                                    "max_value":"86400",
                                    "error": context.getMessage("idle-time_error"),
                                    "field-help": {
                                       "content" : context.getMessage("ipsec_vpns_tunnels_advpn_idle_time_field_help")
                                    }
                             },
                             {
                                 "element_dropdown": true,
                                 "id": "vpn-profile-id",
                                 "name": "vpn-profile",
                                 "label": context.getMessage('vpn_wizard_vpn_profile_label'),
                                 "field-help": {
                                     "content": context.getMessage('vpn_wizard_vpn_profile_1_tooltip')
                                 },
                                 "required": false,
                                 "values": [
                                 ],
                                 "error": "Please make a selection"

                             },
                             {
                                 "element_radio": true,
                                 "id" : "preshared-key-id",
                                 "label" : context.getMessage('vpn_wizard_preshared_key_label'),
                                 "class" : "presharedkey",
                                 "field-help": {
                                          "content": context.getMessage("vpn_wizard_preshared_key_tooltip")
                                      },
                                 "values": [
                                     {
                                         "id": "auto-generate-id",
                                         "name": "preshared-key-button",
                                         "label": context.getMessage('vpn_wizard_auto_generate_button'),
                                         "value": "AUTO_GENERATE",
                                         "checked": true
                                     },
                                     {
                                         "id": "manual-id",
                                         "name": "preshared-key-button",
                                         "label": context.getMessage('vpn_wizard_manual_button'),
                                         "value": "MANUAL",
                                         "checked": false
                                     }
                                 ]
                             },
                             {
                                 "element_checkbox": true,
                                 "id" : "generate-unique-key-id",
                                 "name" : "generate-unique-key",
                                 "label" : "",
                                 "class": "auto-generate",
                                 "values": [
                                     {
                                         "id": "generate-unique-key-id",
                                         "name": "generate-unique-key",
                                         "label": context.getMessage('vpn_wizard_generate_unique_key'),
                                         "value": "",
                                         "checked": true
                                     }
                                 ]
                             },
                             {
                                 "element_password": true,
                                 "id": "manual-key-id",
                                 "name": "manual",
                                 "value": "{{manual}}",
                                 "label": context.getMessage('vpn_wizard_manual_key'),
                                 "required": false,
                                 "class": "hide manual",
                                 "post_validation" : "onValidation",
                                 "error": context.getMessage('vpn_wizard_name_input_error'),
                             },
                             {
                                 "element_checkbox": true,
                                 "id" : "unmask-id",
                                 "name" : "unmask",
                                 "label" : "",
                                 "class": "hide manual",
                                 "values": [
                                     {
                                         "id": "unmask-id",
                                         "name": "unmask",
                                         "label": context.getMessage('vpn_wizard_unmask'),
                                         "value": "",
                                         "checked": false
                                     }
                                 ]
                             }
                         ]
                    }
                ]
            };
        };
    };
    return Configuration;       
});
