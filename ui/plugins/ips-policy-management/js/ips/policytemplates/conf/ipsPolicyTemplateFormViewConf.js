/**
 *
 * @author avyaw <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {               
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                      "title": context.getMessage("ips_policy_template_create"),
                      "form_id": "ips_policy_template_form",
                      "form_name": "ips_policy_template_form",
                      "err_div_id": "errorDiv",
                      "err_div_message": context.getMessage("form_error"),
                      "err_div_link_text": context.getMessage("ips_policy_template_create"),
                      "err_timeout": "1000",
                      "valid_timeout": "5000",
                      "on_overlay": true,
                      "title-help": {
                        "content": context.getMessage("ips_policy_templates_create_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_TEMPLATE_CREATING")
                       },
                    "add_remote_name_validation": 'ips-policy-template-name',
                    "sections": [
                        {
                            "section_id": "ips-policy-template-basic-form",  
                            "elements": [{
                                "element_text": true,
                                "id": "ips-policy-template-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "onfocus": "true",
                                "required": true,
                                "pattern": "^[a-zA-Z0-9\-_@#$%&*():. ]{0,255}$",
                                "error": context.getMessage("policy_name_error"),
                                "field-help": {
                                    "content": context.getMessage('policy_name_tooltip')
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "ips-policy-template-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "error": context.getMessage('policy_description_error'),
                                "pattern": "^.{1,255}$",
                                "field-help": {
                                    "content": context.getMessage('ips_policy_template_description_tooltip')
                                }
                            }
                            ]
                        },
                        
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "ips-policy-template-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "ips-policy-template-save",
                            "name": "create",
                            "value": "OK"
                        }
                    ]
                };
            }
        };
        return Configuration;
    }
);

