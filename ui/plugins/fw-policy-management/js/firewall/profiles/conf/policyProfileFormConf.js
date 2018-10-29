/**
 * A configuration object with the parameters required to build a form for creating Policy Profile.
 *
 * @module policyProfileFormConf
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 define ([
    ],function(){
        var PolicyProfileFormConf = function(context){

            this.getValues = function (){

                return {
                    // "title": (action == Slipstream.SDK.Intent.action.ACTION_EDIT) ? context.getMessage("vpn_profiles_form_title_modify") : context.getMessage("vpn_profiles_form_title"),
                    "form_id" : "policy-profile-configuration",
                    "form_name" : "policy-profile-configuration",
                    "title-help": {
                        "content": context.getMessage("policy_profiles_form_title_help"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_PROFILE_CREATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text":"Create Policy Profile help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "on_overlay": true,
                     "add_remote_name_validation": 'policy-profile-name',
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_text": true,
                                    "id": "policy-profile-name",
                                    "name": "name",
                                    "value": "{{name}}",
                                    "label": context.getMessage("name"),
                                    "onfocus": "true",
                                    "required": true,
                                    "pattern": "^[a-zA-Z0-9\-_@#$%&*():. ]{0,255}$",
                                    "error": context.getMessage("policy_profiles_name_error"),
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_name')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "id": "description",
                                    "name": "description",
                                    "value": "{{description}}",
                                    "pattern": "^.{1,1024}$",
                                    "label": context.getMessage("description"),
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_description')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "name": "Template",
                                    "id" : "device_template",
                                    "label": context.getMessage("policy_profiles_form_field_label_template"),
                                    "field-help": {
                                        "content": context.getMessage('policy_profiles_form_field_tooltip_template')
                                    }
                                     
                                },
                                {
                                    "element_text": true,
                                    "id": "policy-profile-tabs",
                                    "class": "tab-widget",
                                    "name": "policy-profile-tabs",
                                    "placeholder": "Loading ..."
                                }
                            ]//end elements
                        }
                    ],//end sections
                    "buttonsAlignedRight": true,
                    "cancel_link": {
                        "id": "policy-profile-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {   
                            "id": "policy-profile-save",
                            "name": "ok",
                            "value": context.getMessage('ok')
                        }
                    ]  
                };

            };
        };  
        return PolicyProfileFormConf;
 });