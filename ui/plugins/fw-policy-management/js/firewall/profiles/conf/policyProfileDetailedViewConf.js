/**
 * A configuration object with the parameters required to build a form for creating Policy Profile.
 *
 * @module policyProfileFormConf
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 define ([
    ],function(){
        var PolicyProfileFormConf = function(context){

            this.getValues = function (){

                return {
                    "title": context.getMessage("policy_profiles_details"),
                    "form_id" : "policy-profile-configuration",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("policy_profiles_details_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW")
                    },
                    "sections":[
                        {
                            "elements":[
                                {
                                    "element_description": true,
                                    "name": "name",
                                    "label": context.getMessage('name'),
                                    "id": "policy-profile-name",
                                    "value": "{{name}}"
                                },
                                {
                                    "element_textarea": true,
                                    "id": "description",
                                    "name": "description",
                                    "value": "{{description}}",
                                    "label": context.getMessage("description")
                                },
                                {
                                    "element_description": true,
                                    "name": "Template",
                                    "id" : "device_template",
                                    "label": "Template",
                                    "value": "{{sd-template.name}}"
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
                    "buttons": [
                        {
                            "id": "cancel",
                            "name": "cancel",
                            "value": context.getMessage('cancel'),
                        }
                    ]  
                };

            };
        };  
        return PolicyProfileFormConf;
 });