/**
 * A configuration object with the parameters required to build a Advanced Settings detailed form.
 *
 * @module AdvancedSettingsFormConf
 * @author Damodhar M <mdamodhar@juniper.net>
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
                                    ]
                                },
                                {
                                    "element_description": true,
                                    "id": "address-translation",
                                    "name": "address-translation",
                                    "label": context.getMessage("policy_profiles_form_field_label_dest-addr-translation"),
                                    "value":"{{destination-address-translation}}"
                                },
                                 {
                                    "element_description": true,
                                    "id": "redirect",
                                    "name": "redirect",
                                    "label": context.getMessage("policy_profiles_form_field_label_redirect"),
                                    "value":"{{redirect}}"  
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
                                    ]
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
                                    ]
                                }
                            ]
                        }
                    ]
                };

            };
        };
            
        return AdvancedSettingsFormConf;
 });