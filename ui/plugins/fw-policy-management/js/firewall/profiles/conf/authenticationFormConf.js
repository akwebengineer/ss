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
                                        "element_description": true,
                                        "id": "auth-type",
                                        "name": "auth-type",
                                        "label": context.getMessage("policy_profiles_form_field_label_authentication"),
                                        "field-help": {
                                             "content": context.getMessage('policy_profiles_form_field_tooltip_authentication')
                                        }
                                },
                                {
                                    "element_multiple_error": true,
                                    "id": "client-name",
                                    "name": "client-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_clientName"),
                                    "error": true,
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_client')
                                    },
                                    "value": "{{client-name}}",
                                    "class": "hide clientname",
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
                                            "error": context.getMessage("policy_profiles_form_field_error_required")
                                        }
                                    ]
                                },
                                 {
                                    "element_multiple_error": true,
                                    "id": "web-client-name",
                                    "name": "web-client-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_clientName"),
                                    "error": true,
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_client_web')
                                    },
                                    "value": "{{client-name}}",
                                    "class": "hide webclientname",
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"1",
                                            "max_length":"63",
                                            "error": "Must be less than 64 characters."
                                        },
                                        {
                                            "pattern": "validtext",
                                            "error": context.getMessage("policy_profiles_form_field_error_required")
                                        }
                                    ]
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
                                    "class": "hide webredirect",
                                    "error": context.getMessage("policy_profiles_form_field_error_selection"),
                                    "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_web_redirect')
                                    }
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
                                    "class": "hide webredirecthttps",
                                    "error": context.getMessage("policy_profiles_form_field_error_required")
                                   
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "domain-name",
                                    "name": "domain-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_domain"),
                                    "class": "hide domainname",
                                    "enableSearch": true,
                                    "multipleSelection": {
                                        maximumSelectionLength: 1,
                                        createTags: true,
                                        allowClearSelection: true
                                    },
                                    "remoteData": {
                                        headers: {
                                            "accept" : "application/vnd.sd.active-directory-management.active-directory-domains-collection+json;version=2;q=0.02"
                                        },
                                        "url": "/api/juniper/sd/active-directory-management/active-directory-domains",
                                        "numberOfRows": 50,
                                        "jsonRoot": "active-directory-domains-collection.active-directory-domains",
                                        "jsonRecords": function(data) {
                                            return data['active-directory-domains-collection']['total']
                                        },
                                        "success": function(data){console.log("call succeeded")},
                                        "error": function(){console.log("error while fetching data")}
                                    },
                                    "templateResult": function (data) {
                                        return data.name;
                                    },
                                    "templateSelection": function (data) {
                                        return data.name;
                                    },
                                    "showCheckboxes": false,
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_domain')
                                    }
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "access-profile-name",
                                    "name": "access-profile-name",
                                    "label": context.getMessage("policy_profiles_form_field_label_access-profile"),
                                    "class": "hide accessprofilename",
                                    "enableSearch": true,
                                    "multipleSelection": {
                                        maximumSelectionLength: 1,
                                        createTags: true,
                                        allowClearSelection: true
                                    },
                                    "remoteData": {
                                        headers: {
                                            "accept" : "application/vnd.sd.access-profile-management.access-profile-names+json;version=1;q=0.01"
                                        },
                                        "url": "/api/juniper/sd/access-profile-management/access-profile-names",
                                        "numberOfRows": 50,
                                        "jsonRoot": "access-profiles.access-profile",
                                        "jsonRecords": function(data) {
                                            return data['access-profiles']['total']
                                        },
                                        "success": function(data){console.log("call succeeded")},
                                        "error": function(){console.log("error while fetching data")}
                                    },
                                    "templateResult": function (data) {
                                        return data.name;
                                    },
                                    "templateSelection": function (data) {
                                        return data.name;
                                    },
                                    "showCheckboxes": false,
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_accessprofile')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "id": "redirect-url",
                                    "name": "redirect-url",
                                    "label": "Redirect URL",
                                    "pattern":/^(http(s?)\:[\/][\/])(www\.)?(\S)+$/,
                                    "placeholder": "E.g., http://www.juniper.net",
                                    "error": context.getMessage("policy_profiles_form_field_error_valid_url"),
                                    "value": "{{redirect-url}}",
                                    "class": "hide redirecturl",
                                    "field-help": {
                                      "content": context.getMessage('policy_profiles_form_field_tooltip_redirecturl')
                                    }
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
                                    ],
                                     "field-help": {
                                         "content": context.getMessage('policy_profiles_form_field_tooltip_redirectoptions')
                                    }
                                }
                            ]
                        }
                    ]
                };

            };
        };
            
        return AuthenticationFormConf;
 });