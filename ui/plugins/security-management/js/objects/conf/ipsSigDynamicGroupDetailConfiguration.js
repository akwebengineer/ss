/**
 * Created by wasima on 10/7/15.
 */


define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "ips_sig_dynamic_detail_form",
                    "form_name": "ips_sig_dynamic_detail_form",                    
                    "on_overlay": true,
                    "title" : "IPS Signature Dynamic Details View",
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
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
                                    "value": "{{name}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-severity",
                                    "name": "severity",
                                    "label": context.getMessage("ips_severity"),
                                     "value": "{{severity}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "service",
                                    "label": context.getMessage("ips_sig_form_service"), 
                                    "id": "ips-sig-service",
                                    "value": "{{services}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "category",
                                    "label": context.getMessage("ips_sig_form_category"),
                                    "id": "ips-sig-category",
                                    "value": "{{category}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "recommended",
                                    "id": "recommended",
                                    "label":  context.getMessage('ips_sig_dynamic_form_tab_basic_field_label_recommended'),
                                    "value": "{{detailsRecommended}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-direction",
                                    "name": "direction",
                                    "label": "Direction",
                                    "value": "{{detailsDirection}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-performance-impact",
                                    "name": "performance-impact",
                                    "label": context.getMessage("ips_performance_impact"),
                                     "value": "{{dynPerformanceImpact}}"
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-match-assurance",
                                    "name": "ips-sig-match-assurance",
                                    "label": "False Positive",
                                     "value": "{{dynMatchAssurance}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "object-type",
                                    "id": "object-type",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_object_type"),  
                                    "value": "{{detailsObjectType}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "vendor",
                                    "id": "vendor",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor"),  
                                    "value": "{{dynVendor}}"
                                }
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "buttons": [
                        {
                            "id": "ips-sig-dynamic-group-save",
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

