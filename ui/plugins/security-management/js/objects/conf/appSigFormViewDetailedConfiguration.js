/**
 * Created by ramesha on 8/31/15.
 */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_appsig_form",
                    "form_name": "sd_appsig_form",
                    "title": context.getMessage('app_sig_create_title'),
                    "on_overlay": true,
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create Application Signature help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                              {
                            "heading_text": context.getMessage('app_sig_create_intro'),
                            "elements": [
                                {
                                    "element_description": true,
                                    "name": "name",
                                    "label": "Name",
                                    "id": "app-sig-name",
                                    "value": "{{name}}"
                                },
                                 {
                                    "element_description": true,
                                    "name": "description",
                                    "id": "app-sig-description",
                                    "value": "{{description}}",
                                    "label": "Description"
                                }
                            ]
                        },
                        {
                            "heading": "Signature Details",
                            "title-help": {
                                "content": context.getMessage("app_sig_form_title_help"),
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            },

                            "section_id": "sd_appsig_SigDetailsSectionBasic1",
                            "elements": [{
                                "label": context.getMessage("app_sig_create_type"),
                                "element_description": true,
                                "id": "app-sig-type",
                                "name": "app-sig-type",
                                "value" : "{{app-sig-type}}"
                            },{
                                  "element_description": true,
                                  "name": "risk",
                                  "label": "Risk",
                                  "value" : "{{risk}}"
                           },{
                              "element_description": true,
                              "name": "characteristic",
                              "label": "Characteristic",
                              "value" : "{{characteristic}}"
                           }]
                        },
                        {
                            "heading": "Tags",
                            "section_id": "sd_appsig_tags_form_category",
                            "elements": [{
                                "element_description": true,
                                "name": "category",
                                "label": "Category",
                                "value": "{{category}}"
                            },
                            {
                                "element_description": true,
                                "name": "sub-category",
                                "label": "Sub Category",
                                "value" : "{{sub-category}}"
                            }]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "buttons": [{
                        "id": "sd-appsig-cancel",
                        "name": "create",
                        "value": context.getMessage('ok')
                    }]
                };
            }
        };
        return Configuration;
    }
);