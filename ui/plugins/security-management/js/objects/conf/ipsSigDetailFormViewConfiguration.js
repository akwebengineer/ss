/**
 * Created by wasima on 5/14/15.
 */


define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "ips_sig_form",
                    "form_name": "ips_sig_form",                    
                    "on_overlay": true,
                    "title" : "IPS Signature Details View",
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create IPS Signature help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "title-help": {
                        "content": context.getMessage("ips_signature_detailed_view_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW")
                    },
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_description": true,
                                    "name": "name",
                                    "label": "Name",
                                    "id": "ips-sig-name",
                                    "value": "{{name}}",
                                    "inlineLinks":[{
                                        "id": "ips_detectors",
                                        "class": "show_overlay",
                                        "value": context.getMessage('ips_sig_detector_button_title')
                                     }]
                                },

                                {
                                    "element_description": true,
                                    "name": "description",
                                    "id": "ips-sig-description",
                                    "value": "{{description}}",
                                    "label": context.getMessage("ips_sig_form_description")
                                },
                                                                {
                                    "element_description": true,
                                    "name": "url",
                                    "id": "ips-sig-url",
                                    "label": "URL(s)"
                                },
                                {
                                    "element_description": true,
                                    "name": "name",
                                    "label": context.getMessage("ips_sig_form_category"),
                                    "id": "ips-sig-category",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                    "value": "{{category}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-recommended",
                                    "name": "action",
                                    "label": "Recommended",
                                    "value": "{{details-recommended}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-action",
                                    "name": "action",
                                    "label": context.getMessage("ips_action"),
                                    "value": "{{details-recommended-action}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-keywords",
                                    "name": "keywords",
                                    "label": context.getMessage("ips_sig_form_keywords"),
                                     "value": "{{keywords}}"
                                },
                                {
                                    "element_description": true,

                                    "id": "ips-sig-severity",
                                    "name": "Severity",
                                    "label": context.getMessage("ips_severity"),
                                     "value": "{{severity}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-bugs",
                                    "name": "bugs",
                                    "label": "BUGS"
                                } ,
                                {
                                    "element_description": true,
                                    "id": "ips-sig-certs",
                                    "name": "certs",
                                    "label": "CERT"
                                }  ,
                                {
                                    "element_description": true,
                                    "id": "ips-sig-cves",
                                    "name": "cves",
                                    "label": "CVE"
                                }                                
                            ]
                        },
                        {
                            "section_id": "signature_details",                       
                            "heading": "Signature Details",
                            "elements":[

                                {
                                    "element_description": true,
                                    "id": "ips-sig-binding",
                                    "name": "binding",
                                    "label": context.getMessage("ips_binding"),
                                     "value": "{{details-binding-type}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-bindingdynamicField",
                                    "name": "bindingdynamicField",
                                    "label": "{{details-dynamicField-label}}",
                                     "value": "{{details-dynamicField-value}}",
                                     "class": "dynamicFieldClass"
                                     
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-timecount",
                                    "name": "timecount",
                                    "label": context.getMessage("ips_sig_timecount"),
                                     "value": "{{time-binding-count}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-timescope",
                                    "name": "timescope",
                                    "label": context.getMessage("ips_time_scope"),
                                    "class" :"ips-timescope", 
                                     "value": "{{details-time-binding-scope}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-matchassurance",
                                    "name": "matchassurance",
                                    "label": context.getMessage("ips_match_assurance"),
                                     "value": "{{details-match}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-performanceimpact",
                                    "name": "performanceimpact",
                                    "label": context.getMessage("ips_performance_impact"),
                                     "value": "{{details-performance}}"
                                },  
                                {
                                    "element_description": true,
                                    "id": "ips-sig-expression",
                                    "name": "expression",
                                    "label": context.getMessage("ips_sig_form_expression"),
                                    "class": "ips-expression",
                                     "value": "{{expression}}"
                                }, 
                                {
                                    "element_description": true,
                                    "id": "ips-sig-scope",
                                    "name": "scope",
                                    "label": context.getMessage("ips_sig_form_scope"),
                                    "class": "ips-sigscope",
                                    "value": "{{details-scope}}"
                                }, 
                                                                {
                                    "element_description": true,
                                    "id": "ips-sig-reset",
                                    "name": "reset",
                                    "label": context.getMessage("ips_sig_form_reset"),
                                    "class": "ips-sigreset",
                                    "value": "{{details-reset}}"
                                }, 
                                                                {
                                    "element_description": true,
                                    "id": "ips-sig-ordered",
                                    "name": "ordered",
                                    "label": context.getMessage("ips_sig_form_ordered"),
                                    "class": "ips-sigordered",
                                    "value": "{{details-ordered}}"
                                },   
                                {
                                    "element_description": true,
                                    "id": "ips-sig-context-grid",
                                    "class": "ips-context-grid",
                                    "name": "ips-sig-context-grid",
                                    "label": context.getMessage("ips_sig_details_form_section_signature")
                                  
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-anomaly-grid",
                                    "class": "ips-anomaly-grid",
                                    "name": "ips-sig-anomaly-grid",
                                    "label": context.getMessage("ips_sig_details_form_section_anomaly")
                                  
                                }                 
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "buttons": [
                        {
                            "id": "sd-ipssig-save",
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

