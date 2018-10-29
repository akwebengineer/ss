define ([
    ],function(){
        var Phase2FormConf = function(context){

            this.getValues = function (){

                return {
                    "form_id" : "phase2-configuration",
                    "form_name" : "phase2-configuration",
                     "title-help": {
                        "content": context.getMessage("phase2_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },

                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text":"Create VPN Profile help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    // "on_overlay": true,
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_radio": true,
                                    "id": "phase2-proposal-type",
                                    "name": "phase2-proposal-type",
                                    "label": context.getMessage("vpn_profiles_form_field_label_proposals"),
                                     "field-help": {
                                                "content": context.getMessage("vpn_profiles_proposals_inline_help")
                                            },
                                    "required": true,
                                    "values": [
                                        {
                                            "id": "phase2-proposal-type",
                                            "name": "phase2-proposal-type",
                                            "label": context.getMessage("vpn_profiles_form_field_label_proposalsPredefined"),
                                            "value": "PREDEFINED",
                                            "checked": true
                                        },
                                        {
                                            "id": "phase2-proposal-type",
                                            "name": "phase2-proposal-type",
                                            "label": context.getMessage("vpn_profiles_form_field_label_proposalsCustom"),
                                            "value": "CUSTOM"
                                        }
                                    ]
                                },
                                {

                                        "element_dropdown": true,
                                        "id": "phase2-predefined-proposal-set",
                                        "name": "phase2-predefined-proposal-set",
                                        "class": "phase2proposalSet",
                                        "label": context.getMessage("vpn_profiles_form_field_label_predefined-proposal-set"),
                                         "field-help": {
                                                "content": context.getMessage("vpn_profiles_phase2_proposalsPredefined_inline_help")
                                            },
                                        "values": [                                             
                                            {
                                                "label": "Basic",
                                                "value": "Basic"
                                            },
                                            {
                                                "label": "Standard",
                                                "value": "Standard"
                                            },
                                            {
                                                "label": "Compatible",
                                                "value": "Compatible"
                                            },
                                            {
                                                "label": "SuiteB-GCM-128",
                                                "value": "suiteb_gcm_128"
                                            },
                                            {
                                                "label": "SuiteB-GCM-256",
                                                "value": "suiteb_gcm_256"
                                            }
                                        ]
                                },
                                {
                                    "element_text": true,
                                    "id": "phase2_custom-grid",
                                    "class": "hide phase2customgrid",
                                    "name": "phase2_custom-grid",
                                    "placeholder": "Loading ..."
                                },
                                {

                                        "element_dropdown": true,
                                        "id": "pfs",
                                        "name": "pfs",
                                        "label": context.getMessage("vpn_profiles_form_field_label_pfs"),
                                         "field-help": {
                                                "content": context.getMessage("vpn_profiles_pfs_inline_help")
                                            },
                                        "values": [
                                            {
                                                "label": "None",
                                                "value": "none"
                                            },
                                            {
                                                "label": "Group1",
                                                "value": "group1"
                                            },
                                            {
                                                "label": "Group2",
                                                "value": "group2"
                                            },
                                            {
                                                "label": "Group5",
                                                "value": "group5"
                                            },
                                            {
                                                "label": "Group14",
                                                "value": "group14"
                                            },
                                            {
                                                "label": "Group19",
                                                "value": "group19"
                                            },
                                            {
                                                "label": "Group20",
                                                "value": "group20"
                                            },
                                            {
                                                "label": "Group24",
                                                "value": "group24"
                                            }
                                        ]
                                }
                            ]
                        },//end phase2
                        {
                            "heading_text": context.getMessage("form_section_advanced-settings"),
                            "elements":[
                                {
                                    "element_checkbox": true,
                                    "id": "establish-tunnel-immediately",
                                    "label": context.getMessage("vpn_profiles_form_field_label_establish-tunnel-immediately"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_establish-tunnel-immediately_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "establish-tunnel-immediately",
                                            "name": "establish-tunnel-immediately",
                                            "label": context.getMessage("enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-vpn-monitor",
                                    "label": context.getMessage("vpn_profiles_form_field_label_enable-vpn-monitor"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_enable-vpn-monitor_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "enable-vpn-monitor",
                                            "name": "enable-vpn-monitor",
                                            "label": context.getMessage("enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-vpn-optimized",
                                    "label": context.getMessage("vpn_profiles_form_field_label_enable-vpn-optimized"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_enable-vpn-optimized_inline_help")
                                        },
                                    "class": "vpnmonitor",
                                    "values": [
                                        {
                                            "id": "enable-vpn-optimized",
                                            "name": "enable-vpn-optimized",
                                            "label": context.getMessage("enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {

                                        "element_dropdown": true,
                                        "id": "dfbit",
                                        "name": "dfbit",
                                        "label": context.getMessage("vpn_profiles_form_field_label_dfbit"),
                                        "field-help": {
                                                "content": context.getMessage("vpn_profiles_dfbit_inline_help")
                                            },
                                        "values": [                                             
                                            {
                                                "label": "None",
                                                "value": "NONE"
                                            },
                                            {
                                                "label": "Clear",
                                                "value": "CLEAR"
                                            },
                                            {
                                                "label": "Set",
                                                "value": "SET"
                                            },
                                            {
                                                "label": "Copy",
                                                "value": "COPY"
                                            }
                                        ]
                                },
                                {
                                    "element_number": true,
                                    "id": "idle-time",
                                    "name": "idle-time",
                                    "value": "{{idle-time}}",
                                    "label": context.getMessage("vpn_profiles_form_field_label_idle-time"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_idle-time_inline_help")
                                        },
                                    "help": context.getMessage("vpn_profile_form_field_idle_time_help_name"),
                                    "min_value":"60",
                                    "max_value":"999999",
                                    "placeholder": "",
                                    "error": context.getMessage("vpn_profile_form_field_range_error", ["60", "999999"])
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "install-time",
                                    "name": "install-time",
                                    "label": context.getMessage("vpn_profiles_form_field_label_install-time"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_install-time_inline_help")
                                        },
                                    "values": [ 
                                        {
                                            "label": "Select an option",
                                            "value": ""
                                        },                                          
                                        {
                                            "label": "1",
                                            "value": "1"
                                        },
                                        {
                                            "label": "2",
                                            "value": "2"
                                        },
                                        {
                                            "label": "3",
                                            "value": "3"
                                        },
                                        {
                                            "label": "4",
                                            "value": "4"
                                        },
                                        {
                                            "label": "5",
                                            "value": "5"
                                        },
                                        {
                                            "label": "6",
                                            "value": "6"
                                        },
                                        {
                                            "label": "7",
                                            "value": "7"
                                        },
                                        {
                                            "label": "8",
                                            "value": "8"
                                        },
                                        {
                                            "label": "9",
                                            "value": "9"
                                        },
                                        {
                                            "label": "10",
                                            "value": "10"
                                        }
                                    ]
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-anti-replay",
                                    "label": context.getMessage("vpn_profiles_form_field_label_enable-anti-replay"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_enable-anti-replay_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "enable-anti-replay",
                                            "name": "enable-anti-replay",
                                            "label": context.getMessage("enable"),
                                            "value": "enable",
                                            "checked": true
                                        }
                                    ],
                                    "error": "Please make a selection"
                                }
                            ]
                        }//end phase2 advanced settings
                    ]
                };

            };
        };
            
        return Phase2FormConf;

 });