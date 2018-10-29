/**
 * A configuration object with the parameters required to build a Advanced Settings form.
 *
 * @module AdvancedSettingsFormConf
 * @author Wasim Afsar A <wasima@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define ([
    ],function(){
        var AdvancedSettingsFormConf = function(context){

            this.getValues = function (){

                return {
                    "form_id" : "advancedsettings-configuration",
                    "form_name" : "advancedsettings-configuration",
                     "title-help": {
                        "content": context.getMessage("advancedSettings_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text":"Create Policy Profile help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_checkbox": true,
                                    "id": "services-offload",
                                    "label": context.getMessage("policy_profiles_form_field_label_dc-srx-acc"),
                                    "values": [
                                        {
                                            "id": "services-offload",
                                            "name": "services-offload",
                                            "label": context.getMessage("policy_profiles_form_field_label_services-offload"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": context.getMessage("policy_profiles_form_field_error_selection"),
                                    "field-help": {
                                         "content": context.getMessage("policy_profiles_form_field_tooltip_datacenter")
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "address-translation",
                                    "name": "address-translation",
                                    "label": context.getMessage("policy_profiles_form_field_label_dest-addr-translation"),
                                    "field-help": {
                                         "content": context.getMessage("policy_profiles_form_field_tooltip_destination")
                                    }
                                },
                                 {
                                    "element_description": true,
                                    "id": "redirect",
                                    "name": "redirect",
                                    "label": context.getMessage("policy_profiles_form_field_label_redirect"),
                                    "field-help": {
                                         "content": context.getMessage("policy_profiles_form_field_tooltip_redirect_advance")
                                    }
                                }  
                            ]
                        },
                        {
                            "heading": context.getMessage("policy_profiles_form_field_label_tcp-session-option"),
                            "elements":[
                                {
                                    "element_checkbox": true,
                                    "id": "tcp-syn-check",
                                    "label": context.getMessage("policy_profiles_form_field_label_tcp-syn"),
                                    "values": [
                                        {
                                            "id": "tcp-syn-check",
                                            "name": "tcp-syn-check",
                                            "label": context.getMessage("policy_profiles_form_field_label_enable"),
                                            "value": "enable"
                                        }
                                    ],
                                    "error": context.getMessage("policy_profiles_form_field_error_selection"),
                                     "field-help": {
                                         "content": context.getMessage("policy_profiles_form_field_tooltip_tcpsyn")
                                    }
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "tcp-seq-check",
                                    "label": context.getMessage("policy_profiles_form_field_label_tcp-sequence"),
                                    "values": [
                                        {
                                            "id": "tcp-seq-check",
                                            "name": "tcp-seq-check",
                                            "label": "Enable",
                                            "value": "enable"
                                        }
                                    ],
                                    "error": context.getMessage("policy_profiles_form_field_error_selection"),
                                     "field-help": {
                                         "content": context.getMessage("policy_profiles_form_field_tooltip_tcpsequence")
                                    }
                                }
                            ]
                        }
                    ]
                };

            };
        };
            
        return AdvancedSettingsFormConf;
 });