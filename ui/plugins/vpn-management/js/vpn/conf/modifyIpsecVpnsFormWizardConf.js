/**
 * Form configuration required to render an VPN Profile create form using the FormWidget.
 *
 * @module ModifyIpsecVpnsFormConf
 * @copyright Juniper Networks, Inc. 2014
 */

 define ([
    ],function(){
        var ModifyIpsecVpnsFormConf = function(context){

            this.getValues = function (){
                return {
                "tableId":"modify_ipsec",
             //   "on_overlay": true,
                    "sections":[
                        {
                            "elements":[
                                {
                                    "index": "id",
                                    "name": "id",
                                    "value": "{{id}}",
                                    "hidden": true
                                    },
                                {
                                    "element_multiple_error": true,
                                    "id": "name",
                                    "name": "name",
                                    "label": context.getMessage("name"),
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
                                    "id": "description",
                                    "name": "description",
                                    "label": context.getMessage("description"),
                                    "field-help": {
                                               "content": context.getMessage("vpn_create_wizard_description_tooltip")
                                     },
                                    "value": "{{description}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "text_vpn_tunnel",
                                    "label": context.getMessage("vpn_wizard_tunnel_mode_label"),
                                    "field-help": {
                                            "content": context.getMessage('vpn_wizard_tunnel_mode_field_help')
                                },
                                    "value": "{{vpn-tunnel-mode-types}}"
                                },
                                {
                                     "element_checkbox": true,
                                     "id": "multi-proxy-id",
                                     "name": "multi-proxy-id",
                                     "class": "multi-proxy-id",
                                     "label": context.getMessage('vpn_wizard_multi_proxyid'),
                                     "field-help": {
                                         "content": context.getMessage('vpn_wizard_multi_proxyid_1_modify_tooltip')
                                     },
                                     "values": [
                                         {
                                             "id": "multi-proxy-id",
                                             "name": "multi-proxy-id",
                                             "label": context.getMessage('vpn_wizard_multi_proxyid_enable_checkbox'),
                                             "value": "enable"
                                         }
                                     ]
                                 },
                                 {
                                      "element_description": true,
                                      "id": "text_type",
                                      "label": context.getMessage("ipsec_vpns_grid_column_name_type"),
                                      "field-help": {
                                              "content":  context.getMessage('vpn_wizard_type_field_help')
                                                                       },
                                      "value": "{{type}}"
                                  },
                                  {
                                       "element_checkbox": true,
                                       "id" : "auto-vpn-id",
                                       "name" : "auto-vpn-id",
                                       "label" : context.getMessage('vpn_wizard_auto_vpn'),
                                       "field-help": {
                                           "content": context.getMessage('vpn_wizard_auto_vpn_1_tooltip') + '<br>' +
                                                      context.getMessage('vpn_wizard_auto_vpn_2_tooltip')
                                       },
                                       "class": "hide hub-and-spoke", // Taken care the showing of the auto-vpn and advpn contents for the perticular cases.
                                       "values": [
                                           {
                                               "id": "auto-vpn-id",
                                               "name": "auto-vpn-id",
                                               "label": context.getMessage('vpn_wizard_auto_vpn_enable_checkbox'),
                                               "value": "enable"
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
                                        "label": context.getMessage('vpn_wizard_advpn_idle_time'),
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
                                       "id": "modify-vpn-profile-id",
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
                                        "id" : "preshared-key-type",
                                        "name": "preshared-key-type",
                                        "label" : context.getMessage('vpn_wizard_preshared_key_label'),
                                        "field-help": {
                                                "content": context.getMessage("vpn_wizard_preshared_key_tooltip")
                                         },
                                        "required": true,
                                        "class": "presharedkeyid",
                                        "values": [
                                            {
                                                "id": "preshared-key-type",
                                                "name": "preshared-key-type",
                                                "label": context.getMessage('vpn_wizard_auto_generate_button'),
                                                "value": "AUTO_GENERATE",
                                                "checked": true
                                            },
                                            {
                                                "id": "preshared-key-type",
                                                "name": "preshared-key-type",
                                                "label": context.getMessage('vpn_wizard_manual_button'),
                                                "value": "MANUAL"
                                            }
                                        ]
                                    },
                                    {
                                        "element_checkbox": true,
                                        "id" : "generate-unique-key-id",
                                        "name" : "generate-unique-key",
                                        "label" : "",
                                        "class": "hide auto-generate",
                                        "values": [
                                            {
                                                "id": "generate-unique-key-id",
                                                "name": "generate-unique-key",
                                                "label": context.getMessage('vpn_wizard_generate_unique_key'),
                                                "value": "generate-unique-key",
                                                "checked": true
                                            }
                                        ]
                                    },
                                    {
                                        "element_password": true,
                                        "id": "manual-key-id",
                                        "name": "manual",
                                        "label": context.getMessage('vpn_wizard_manual_key'),
                                        "required": false,
                                        "class": "hide manual",
                                        "value" :"{{preshared-key}}"
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
                                                "checked": false
                                            }
                                        ]
                                    }
                            ]//end elements
                        }
                    ]/*,//end sections
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
                    ]*/
                };

            };
        };

        return ModifyIpsecVpnsFormConf;
 });
