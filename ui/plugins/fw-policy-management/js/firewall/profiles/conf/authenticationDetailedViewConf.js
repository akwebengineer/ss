/**
 * A configuration object with the parameters required to build a Authentication form.
 *
 * @module AuthenticationFormConf
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define ([
    ],function(){
        var AuthenticationFormConf = function(context){

            this.getValues = function (){

                return {
                    "form_id" : "authentication-configuration",
                    "form_name" : "authentication-configuration",
                     "title-help": {
                        "content": context.getMessage("logging_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "sections":[
                        {
                            "elements":[
                                {
                                        "element_description": true,
                                        "id": "auth-type",
                                        "name": "auth-type",
                                        "label": context.getMessage("policy_profiles_form_field_label_authentication"),
                                        "value":"{{authentication-type}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "client-name",
                                    "name": "client-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_clientName"),
                                    "value": "{{pass-thru-auth-client-name}}",
                                    "class": "hide clientname"
                                },
                                 {
                                    "element_description": true,
                                    "id": "web-client-name",
                                    "name": "web-client-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_clientName"),
                                    "value": "{{web-auth-client-name}}",
                                    "class": "hide webclientname",
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "web-redirect",
                                    "label": context.getMessage("policy_profiles_form_field_label_web-redirect"),
                                    "values": [
                                        {
                                            "id": "web-redirect",
                                            "name": "web-redirect",
                                            "label": context.getMessage("policy_profiles_form_field_label_redirect_to_web"),
                                            "value": "enable"
                                        }
                                    ],
                                    "class": "hide webredirect"
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "web-redirect-https",
                                    "label": "",
                                    "values": [
                                        {
                                            "id": "web-redirect-https",
                                            "name": "web-redirect-https",
                                            "label": context.getMessage("policy_profiles_form_field_label_redirect_to_http"),
                                            "value": "enable"
                                        }
                                    ],
                                    "class": "hide webredirecthttps"
                                },
                                {
                                    "element_description": true,
                                    "id": "domain-name",
                                    "name": "domain-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_domain"),
                                    "value": "{{domain}}",
                                    "class": "hide domainname"
                                },
                                {
                                    "element_description": true,
                                    "id": "access-profile-name",
                                    "name": "access-profile-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_access-profile"),
                                    "value": "{{access-profile}}",
                                    "class": "hide accessprofilename"
                                },
                                {
                                    "element_description": true,
                                    "id": "redirect-url",
                                    "name": "redirect-url",
                                    "label": "Redirect URL",
                                    "value": "{{redirect-url}}",
                                    "class": "hide redirecturl"
                                },
                                {
                                    "element_radio": true,
                                    "id": "infranet-redirect",
                                    "name": "infranet-redirect",
                                    "label": context.getMessage("policy_profiles_form_field_label_redirect"),
                                    "class": "hide redirect",
                                    "values": [
                                        {
                                            "id": "infranet-redirect",
                                            "name": "infranet-redirect",
                                            "label": context.getMessage("policy_profiles_form_field_label_redirectNone"),
                                            "value": "NONE",
                                            "checked": true
                                        },
                                        {
                                            "id": "infranet-redirect",
                                            "name": "infranet-redirect",
                                            "label": context.getMessage("policy_profiles_form_field_label_redirectAllTraffic"),
                                            "value": "REDIRECT_ALL"
                                        },
                                        {
                                            "id": "infranet-redirect",
                                            "name": "infranet-redirect",
                                            "label": context.getMessage("policy_profiles_form_field_label_redirectUnauthTraffic"),
                                            "value": "REDIRECT_UNAUTHENTICATED"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };

            };
        };
            
        return AuthenticationFormConf;
 });