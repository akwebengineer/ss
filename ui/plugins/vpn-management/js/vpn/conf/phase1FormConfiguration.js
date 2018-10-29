define ([
    ],function(){
        var Phase1FormConf = function(context){

            this.getValues = function (){

                return {
                    "form_id" : "phase1-configuration",
                    "form_name" : "phase1-configuration",
                     "title-help": {
                        "content": context.getMessage("phase1_form_title_help"),
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
                                        "element_dropdown": true,
                                        "id": "auth-method",
                                        "name": "auth-method",
                                        "label": context.getMessage("vpn_profiles_form_field_label_authentication"),
                                         "field-help": {
                                                "content": context.getMessage("vpn_profiles_authentication_type_inline_help")
                                            },
                                        "values": [                                             
                                            {
                                                "label": "Preshared Key",
                                                "value": "PRESHARED_KEY"
                                            },
                                            {
                                                "label": "RSA-Signature",
                                                "value": "RSA_SIGNATURE"
                                            },
                                            {
                                                "label": "DSA-Signature",
                                                "value": "DSA_SIGNATURE"
                                            },
                                            {
                                                "label": "EC-DSA-Signature (256)",
                                                "value": "EC_DSA_SIGNATURE_256"
                                            },
                                            {
                                                "label": "EC-DSA-Signature (384)",
                                                "value": "EC_DSA_SIGNATURE_384"
                                            }
                                        ]
                                },
                                {
                                    "element_radio": true,
                                    "id": "mode",
                                    "name": "mode",
                                    "label": context.getMessage("vpn_profiles_form_field_label_mode"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_mode_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "mode",
                                            "name": "mode",
                                            "label": context.getMessage("vpn_profiles_form_field_label_modeMain"),
                                            "value": "MAIN",
					    "checked": true
                                        },
                                        {
                                            "id": "mode",
                                            "name": "mode",
                                            "label": context.getMessage("vpn_profiles_form_field_label_modeAggressive"),
                                            "value": "AGGRESSIVE"
                                        },
					{
                                            "id": "mode",
                                            "name": "mode",
                                            "label": context.getMessage("vpn_profiles_form_field_label_modeDefault"),
                                            "value": "DEFAULT"
                                        }

                                    ]
                                }, 
                                {
                                    "element_checkbox": true,
                                    "id": "general-ikeid-label",
                                    "class": "general-ikeid",
                                    "label": "General-IKE-ID",
                                    "field-help": {
                                        "content": context.getMessage("vpn_profiles_generalike_inline_help")
                                    },
                                    "values": [
                                        {
                                            "id": "general-ikeid",
                                            "name": "general-ikeid",
                                            "label": context.getMessage("enable"),
                                            "value": "enable",
                                            "checked": false
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {

                                        "element_dropdown": true,                                        
                                        "class": "ikeproperties",
                                        "id": "ike-id",
                                        "name": "ike-id",
                                        "label": context.getMessage("vpn_profiles_form_field_label_ike-id"),
                                        "field-help": {
                                                "content": context.getMessage("vpn_profiles_ike_id_inline_help")
                                            },
                                        "values": [                                             
                                            {
                                                "label": "Hostname",
                                                "value": "HOSTNAME"
                                            },
                                            {
                                                "label": "User@hostname",
                                                "value": "UFQDN"
                                            },
                                            {
                                                "label": "IPAddress",
                                                "value": "IPADDRESS"
                                            },
                                            {
                                            "label": "None",
                                             "value": "NONE"
                                            }
                                        ]
                                },
                                {
                                    "element_text": true,
                                    "id": "username",
                                    "name": "username",
                                    "class": "hide user",
                                    "value": "{{username}}",
                                    "label": context.getMessage("vpn_profiles_form_field_label_user"),
                                    // TODO: find the right pattern for user and hostname/ipaddress
                                    "pattern": "^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)([a-z\.]{2,6})$",//"length',
                                    "error": "Please Enter User@hostname", // "error": true,
                                    /*"pattern-error": [
                                        {
                                            "pattern": "^[A-Z0-9._%+-]+@\.[A-Z]",//"length",
                                            "min_length":"1",
                                            "max_length":"32",
                                            "error": "Must be less than 32 characters."
                                        }
                                    ]*/
                                },
                                {

                                        "element_dropdown": true,
                                        "id": "ike-version",
                                        "name": "ike-version",
                                        "label": context.getMessage("vpn_profiles_form_field_label_ike-version"),
                                         "field-help": {
                                                "content": context.getMessage("vpn_profiles_ike_version_inline_help")
                                            },
                                        "values": [                                             
                                            {
                                                "label": "default",
                                                "value": "DEFAULT"
                                            },
                                            {
                                                "label": "V1",
                                                "value": "V1"
                                            },
                                            {
                                                "label": "V2",
                                                "value": "V2"
                                            }
                                        ]
                                },
                                {
                                    "element_radio": true,
                                    "id": "phase1-proposal-type",
                                    "name": "phase1-proposal-type",
                                    "label": context.getMessage("vpn_profiles_form_field_label_proposals"),
                                     "field-help": {
                                            "content": context.getMessage("vpn_profiles_proposals_inline_help")
                                        },
                                    "required": true,
                                     "class": "phase1proposaltype",
                                    "values": [
                                        {
                                            "id": "phase1-proposal-type",
                                            "name": "phase1-proposal-type",
                                            "label": context.getMessage("vpn_profiles_form_field_label_proposalsPredefined"),
                                            "value": "PREDEFINED",
                                            "checked": true
                                        },
                                        {
                                            "id": "phase1-proposal-type",
                                            "name": "phase1-proposal-type",
                                            "label": context.getMessage("vpn_profiles_form_field_label_proposalsCustom"),
                                            "value": "CUSTOM"
                                        }
                                    ]
                                },
                                {
                                    "element_description": true,
                                    "id": "phase1-proposal-type_label",
                                    "name": "phase1-proposal-type_label",
                                    "label": context.getMessage("vpn_profiles_form_field_label_proposals"),
                                    "required": true,
                                     "value": "CUSTOM",
                                     "class": "hide phase1proposaltypelabel"
                                },
                                {

                                        "element_dropdown": true,
                                        "id": "phase1-predefined-proposal-set",
                                        "name": "phase1-predefined-proposal-set",
                                        "label": context.getMessage("vpn_profiles_form_field_label_predefined-proposal-set"),
                                        "field-help": {
                                                "content": context.getMessage("vpn_profiles_predefined-proposal-set_inline_help")
                                            },
                                        "class": "phase1proposalSet",
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
                                            }
                                        ]
                                },
                                {
                                    "element_text": true,
                                    "id": "custom-grid",
                                    "class": "hide customgrid",
                                    "name": "custom-grid",
                                    "placeholder": "Loading ..."
                                }
                            ]
                        },
                        {
                            "heading_text": context.getMessage("form_section_advanced-settings"),
                            "elements":[                                    
                                {
                                    "element_checkbox": true,
                                    "id": "enable-nat-traversal",
                                    "label": context.getMessage("vpn_profiles_form_field_label_enable-nat-traversal"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_enable-nat-traversal_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "enable-nat-traversal",
                                            "name": "enable-nat-traversal",
                                            "label": context.getMessage("enable"),
                                            "value": "enable",
                                            "checked": true
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {
                                    "element_number": true,
                                    "id": "nat-traversal-keep-alive",
                                    "name": "nat-traversal-keep-alive",
                                    "class": "natproperties",
                                    "label": context.getMessage("vpn_profiles_form_field_label_nat-traversal-keep-alive"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_nat-traversal-keep-alive_inline_help")
                                        },
                                    "help": context.getMessage("vpn_profile_form_field_interval_help_name"),
                                    "placeholder": "",
                                    "value": "{{nat-traversal-keep-alive}}",
                                    "min_value":"1",
                                    "max_value":"300",
                                    "error": context.getMessage("vpn_profile_form_field_range_error", ["1", "300"])
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "enable-dpd",
                                    "label": context.getMessage("vpn_profiles_form_field_label_enable-dpd"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_enable-dpd_inline_help")
                                        },
                                    "values": [
                                        {
                                            "id": "enable-dpd",
                                            "name": "enable-dpd",
                                            "label": context.getMessage("enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "always-send-dpd",
                                    "label": context.getMessage("vpn_profiles_form_field_label_always-send-dpd"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_always-send-dpd_inline_help")
                                        },
                                    "class": "dpdproperties",
                                    "values": [
                                        {
                                            "id": "always-send-dpd",
                                            "name": "always-send-dpd",
                                            "label": context.getMessage("enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": "Please make a selection"
                                },
                                {
                                    "element_number": true,
                                    "id": "dpd-interval",
                                    "name": "dpd-interval",
                                    "class": "dpdproperties",
                                    "label": context.getMessage("vpn_profiles_form_field_label_dpd-interval"),
                                    "field-help": {
                                            "content": context.getMessage("vpn_profiles_dpd-interval_inline_help")
                                        },
                                    "placeholder": "",
                                    "value": "{{dpd-interval}}",
                                    "min_value":"10",
                                    "max_value":"60",
                                    "error": context.getMessage("vpn_profile_form_field_range_error", ["10", "60"])
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "dpd-threshold",
                                    "name": "dpd-threshold",
                                    "class": "dpdproperties",
                                    "label": context.getMessage("vpn_profiles_form_field_label_dpd-threshold"),
                                     "field-help": {
                                             "content": context.getMessage("vpn_profiles_dpd-threshold_inline_help")
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
                                        }
                                    ]
                                }
                            ]
                        }//end phase 1 advanced settings
                    ]
                };

            };
        };
            
        return Phase1FormConf;

 });
