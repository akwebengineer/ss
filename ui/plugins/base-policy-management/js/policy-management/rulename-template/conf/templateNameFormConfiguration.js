/**
 * Created by avyaw
 */

define([],
    function() {
        var Configuration = function(context,constantLength) {
            this.getValues = function() {
                return {
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage('template_builder_column'),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Add Template name help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_description": true,
                                    "name": "templateName",
                                    "label": context.getMessage('template_builder_column'),    
                                    "id": "template-name",
                                    "required": true,
                                    "field-help": {
                                       "content": context.getMessage('template_builder_column')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage('rule_name_template_constant'),                                    
                                    "name": "template-name-constant",
                                    "id": "template-name-constant",
                                    "class" : "templateNameConstant",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\_]{0,"+constantLength+"}$",
                                    "required": true,
                                    "value": "",
                                    "error": context.getMessage('rule_name_template_length_error_'+constantLength),
                                    "field-help": {
                                       "content": context.getMessage('rule_name_template_constant_info')
                                    }
                                }                                
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "template-name-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "template-name-save",
                            "name": "create",
                            "value": context.getMessage('ok')
                        }
                    ]
                };
            }
        };

        return Configuration;
    }
);
