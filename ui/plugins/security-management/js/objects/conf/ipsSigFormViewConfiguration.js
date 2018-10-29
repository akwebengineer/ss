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
                    "title": context.getMessage('ips_sig_create_title'),
                    "title-help": {
                        "content": context.getMessage("ips_sig_form_title_help"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_SIGNATURE_CREATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create IPS Signature help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "add_remote_name_validation": 'ips-sig-name',
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_multiple_error": true,
                                    "name": "name",
                                    "label": context.getMessage("ips_sig_form_name"),
                                    "id": "ips-sig-name",
                                    "required": true,
                                    "value": "{{name}}",
                                    "pattern-error": [
                                        {
                                            "pattern": "length",
                                            "min_length":"1",
                                            "max_length":"255",
                                            "error": context.getMessage("ips_sig_name_length_error")
                                        },
                                        {
                                            "pattern": "hasnotspace",
                                            "error": context.getMessage("name_no_space_validate")
                                        }
                                    ],
                                    "error": context.getMessage('ips_sig_name_length_error'),
                                    "help": context.getMessage('ips_sig_create_name_help'),
                                    "inlineLinks":[{
                                        "id": "ips_detectors",
                                        "class": "show_overlay",
                                        "value": context.getMessage('ips_sig_detector_button_title')
                                     }],
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_name_tooltip')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "name": "description",
                                    "id": "ips-sig-description",
                                    "value": "{{description}}",
                                    "label": context.getMessage("ips_sig_form_description"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_description_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "name": "name",
                                    "label": context.getMessage("ips_sig_form_category"),
                                    "id": "ips-sig-category",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                    "required": true,
                                    "value": "{{name}}",
                                    "error": context.getMessage('ips_sig_create_name_length_error'),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_category_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-action",
                                    "name": "action",
                                    "label": context.getMessage("ips_action"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_action_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "name": "Keywords",
                                    "label": context.getMessage("ips_sig_form_keywords"),
                                    "id": "ips-sig-keywords",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                    "value": "{{name}}",
                                    "error": context.getMessage('ips_sig_create_name_length_error'),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_keywords_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-severity",
                                    "name": "Severity",
                                    "label": context.getMessage("ips_severity"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_severity_tooltip')
                                    }
                                }                                
                            ]
                        },
                        {
                            "section_id": "signature_details",                       
                            "heading": "Signature Details",
                            "elements":[
                                {
                                    "element_description": true,
                                    "id": "ips_sig_binding_type",
                                    "name": "ips_sig_binding_type",
                                    "label": context.getMessage("ips_binding"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_binding_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "label": context.getMessage("ips_sig_form_service"),                                    
                                    "name": "ips-sig-protocol_service",
                                    "id": "ips-sig-protocol_service",
                                    "class": "hide service",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_protocol_service_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage("ips_sig_form_protocol"),
                                    "name": "ips-sig-protocol_details",
                                    "id": "ips-sig-protocol_details",
                                    "class": "protocol",
                                    "post_validation": "validateNumber",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_protocol_details_tooltip')
                                    }
                                    //"pattern": "^([2,3,4,5,7,8,9]|1[1-6,8,9]|[2-9][0-9]|1[1-3][1-9])$",
                                    //"error": context.getMessage('ips_protocol_error')
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage("ips_sig_form_header"),
                                    "name": "ips-sig-next_header",
                                    "id": "ips-sig-next_header",
                                    "post_validation": "validateNumber",
                                    "class": "hide nextheader",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_next_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage("ips_sig_form_portrange"),
                                    "name": "ips-sig-port_ranges",
                                    "id": "ips-sig-port_ranges",
                                    "post_validation": "validatePortRange",
                                    "class": "hide portranges",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_port_range_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage("ips_sig_form_programno"),
                                    "name": "ips-sig-program_number",
                                    "id": "ips-sig-program_number",
                                    "post_validation": "validateNumber",
                                    "class": "hide programno",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_program_tooltip')
                                    }
                                },
                                {
                                    "element_number": true,
                                    "id": "ips-sig-count",
                                    "name": "ips-sig-count",
                                    "class": "sigcount",
                                    "label": context.getMessage("ips_sig_timecount"),
                                    "min_value":"0",
                                    "max_value":"4294967295",
                                    "value": "{{ips-sig-count}}",
                                    "error": context.getMessage("ips_sig_form_field_error_range"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_count_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-time-scope",
                                    "name": "ips_time_scope",
                                    "class": "timescope",
                                    "label": context.getMessage("ips_time_scope"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_time_scope_tooltip')
                                    }
                                },                                
                                {
                                    "element_description": true,
                                    "id": "ips-sig-match",
                                    "name": "ips_match_assurance",
                                    "label": context.getMessage("ips_match_assurance"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_match_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-performance",
                                    "name": "ips_performance_impact",
                                    "label": context.getMessage("ips_performance_impact"),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_performance_tooltip')
                                    }
                                },
                                {
                                    "element_text": true,
                                    "label": context.getMessage("ips_sig_form_expression"),
                                    "name": "ips-sig-expression",
                                    "id": "ips-sig-expression",
                                    "class": "hide expression",
                                    "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,62}$",
                                    "error": context.getMessage('ips_sig_create_name_length_error'),
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_expression_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-scope",
                                    "name": "ips-sig-scope",
                                    "label": context.getMessage("ips_sig_form_scope"),
                                    "class":"hide sigscope",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_scope_tooltip')
                                    }
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "ips-sig-reset",
                                    "label": context.getMessage("ips_sig_form_reset"),
                                    "class":"hide sigreset",
                                    "values": [{
                                        "id": "ips-sig-reset-enable",
                                        "name": "ips-sig-reset-enable",
                                        "label":"",
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_reset_tooltip')
                                    }
                                },
                                {
                                    "element_checkbox": true,
                                    "id": "ips-sig-ordered",
                                    "label": context.getMessage("ips_sig_form_ordered"),
                                    "class":"hide sigordered",
                                    "values": [{
                                        "id": "ips-sig-ordered-enable",
                                        "name": "ips-sig-ordered-enable",
                                        "label":"",
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection",
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_ordered_tooltip')
                                    }
                                },                                
                                {
                                    "element_description": true,
                                    "id": "ips-sig-context-grid",
                                    "class": "grid-widget",
                                    "name": "ips-sig-context-grid",
                                    "label": context.getMessage("ips_sig_form_section_signature"),
                                    "required": true,
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_add_sig_tooltip')
                                    }
                                },
                                {
                                    "element_description": true,
                                    "id": "ips-sig-anomaly-grid",
                                    "class": "hide anomalygrid",
                                    "name": "ips-sig-anomaly-grid",
                                    "label": context.getMessage("ips_sig_form_section_anomaly"),
                                    "required": true,
                                    "field-help": {
                                    "content": context.getMessage('ips_sig_create_add_anomaly_tooltip')
                                    }
                                }                 
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "sd-ipssig-cancel",
                        "value": context.getMessage('cancel')
                    },
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

