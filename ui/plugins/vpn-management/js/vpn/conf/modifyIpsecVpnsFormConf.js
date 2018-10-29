/**
 * Form configuration required to render an VPN Profile create form using the FormWidget.
 *
 * @module ModifyIpsecVpnsFormConf
 * @author ponraja <ponraja@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

 define ([
    ],function(){
        var ModifyIpsecVpnsFormConf = function(context){

            this.getValues = function (){
                return {
                "title": context.getMessage("ipsec_vpns_modify_general_title"),
                "tableId":"modify_ipsec",
                "on_overlay": true,
                "valid_timeout": "0",
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
                                    "required": true,
                                    "error": true,
                                    "value": "{{name}}",
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"1",
                                            "max_length":"255",
                                            "error": "Must be less than 255 characters."
                                        },
                                        {
                                            "pattern": "hasalphanumericdashunderscore",
                                            "error":"Name must not have spaces, special characters"
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
                                    "value": "{{description}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "text_vpn_tunnel",
                                    "label": context.getMessage("vpn_wizard_tunnel_mode_label"),
                                    "value": "{{vpn-tunnel-mode-types}}"
                                },
                                {
                                     "element_checkbox": true,
                                     "id": "multi-proxy-id",
                                     "name": "multi-proxy-id",
                                     "label": context.getMessage('vpn_wizard_multi_proxyid'),
                                     "field-help": {
                                         "content": context.getMessage('vpn_wizard_multi_proxyid_1_tooltip') + '<br>' +
                                                    context.getMessage('vpn_wizard_multi_proxyid_2_tooltip')
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
                                       "class": "hide auto-vpn",
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
                    ],//end sections
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

            };
        };

        return ModifyIpsecVpnsFormConf;
 });