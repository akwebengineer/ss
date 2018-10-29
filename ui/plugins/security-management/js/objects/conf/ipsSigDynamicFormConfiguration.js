/**
 *  A configuration object for Ips Dynamic Group form
 *
 *  @module ips static group form
 *  @author dkumara<dkumara@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {       
        var Configuration = function(context,view) {
            this.getValues = function() {
                return {
                    "form_id": "ips_sig_dynamic_group",
                    "form_name": "ips_sig_dynamic_group",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("ips_dynamic_form_title_help"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("IPS_POLICY_SIGNATURE_DYNAMIC_GROUP_CREATING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Create IPS Signature Dynamic Group help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "add_remote_name_validation": 'ips-sig-name',
                    "sections": [{
                            "elements": [{
                                    "element_text": true,
                                    "name": "name",
                                    "label": context.getMessage("ips_sig_dynamic_group_name"),
                                    "id": "ips-sig-name",
                                    "pattern": "^.{0,254}$",
                                    "required": true,
                                    "value": "{{name}}",
                                    "field-help": {
                                        "content": context.getMessage('ips_dynamic_name_tooltip')
                                    },
                                    "error": context.getMessage('ips_sig_name_length_error'),
                                    "help": context.getMessage('ips_sig_create_name_help')
                                }

                            ]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_section_heading_filter_criteria"),
                            "heading_text": context.getMessage("ips_sig_dynamic_form_filter_criteria_message")

                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_severity"),
                            "progressive_disclosure": "expanded",
                            "elements": [{
                                "element_checkbox": true,
                                "id": "sev-info",
                                "label": context.getMessage("ips_sig_dynamic_form_field_label_sev-info"),
                                "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_severity_info_info_tip')
                                    },
                                "values": [{
                                    "id": "sev-info",
                                    "name": "sev-info",
                                    "label": context.getMessage("enable"),
                                    "value": "enable"
                                }],
                                "error": "Please make a selection"
                            }, {
                                "element_checkbox": true,
                                "id": "sev-warning",
                                "label": context.getMessage("ips_sig_dynamic_form_field_label_sev-warning"),
                                "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_severity_warning_info_tip')
                                    },
                                "values": [{
                                    "id": "sev-warning",
                                    "name": "sev-warning",
                                    "label": context.getMessage("enable"),
                                    "value": "enable"
                                }],
                                "error": "Please make a selection"
                            }, {
                                "element_checkbox": true,
                                "id": "sev-minor",
                                "label": context.getMessage("ips_sig_dynamic_form_field_label_sev-minor"),
                                "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_severity_minor_info_tip')
                                    },
                                "values": [{
                                    "id": "sev-minor",
                                    "name": "sev-minor",
                                    "label": context.getMessage("enable"),
                                    "value": "enable"
                                }],
                                "error": "Please make a selection"
                            }, {
                                "element_checkbox": true,
                                "id": "sev-major",
                                "label": context.getMessage("ips_sig_dynamic_form_field_label_sev-major"),
                                "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_severity_major_info_tip')
                                    },
                                "values": [{
                                    "id": "sev-major",
                                    "name": "sev-major",
                                    "label": context.getMessage("enable"),
                                    "value": "enable"
                                }],
                                "error": "Please make a selection"
                            }, {
                                "element_checkbox": true,
                                "id": "sev-critical",
                                "label": context.getMessage("ips_sig_dynamic_form_field_label_sev-critical"),
                                "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_severity_critical_info_tip')
                                    },
                                "values": [{
                                    "id": "sev-critical",
                                    "name": "sev-critical",
                                    "label": context.getMessage("enable"),
                                    "value": "enable"
                                }],
                                "error": "Please make a selection"
                            }]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_service"),

                            "progressive_disclosure": "expanded",

                            "elements": [{
                                "element_text": true,
                                "id": "ips-sig-dyn-service-set",
                                "name": "Service",
                                "label": "Service",
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('ips_sig_select_service_error'),
                                "field-help": {
                                    "content": context.getMessage('ips_sig_dynamic_service_info_tip'),
                                    "ua-help-identifier": "alias_for_ips_sig_select_category_ua_event_binding"
                                },
                                "class": "list-builder"
                            }]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_category"),
                            "progressive_disclosure": "expanded",
                            "elements": [{
                                "element_text": true,
                                "id": "ips-sig-dyn-category-set",
                                "name": "Category",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_category"),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('ips_sig_select_category_error'),
                                "field-help": {
                                    "content": context.getMessage('ips_sig_dynamic_category_info_tip'),
                                    "ua-help-identifier": "alias_for_ips_sig_select_category_ua_event_binding"
                                },
                                "class": "list-builder"
                            }]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommended"),
                            "progressive_disclosure": "expanded",
                            "elements": [

                                {
                                    "element_description": true,
                                    "value": '<select class="recommended-container" style="width:100%"></select>',
                                    "class": "recommended-container-id",
                                    "id": "recommended-container-id",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommended"),
                                    "name": "recommended-name",
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_recommended_obj_info_tip')
                                    }

                                }

                            ]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_direction"),
                            "progressive_disclosure": "expanded",
                            "elements": [

                                {
                                    "element_description": true,
                                    "value": '<select class="directionContainer-any" style="width:100%"></select>',
                                    "class": "direction-container-any",
                                    "id":  "direction-container-any",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_any"),
                                    "name": "direction-container-any",
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_direction_any_info_tip')
                                    }

                                },
                                {
                                    "element_description": true,
                                    "value": '<select class="directionContainer-cts" style="width:100%"></select>',
                                    "class": "direction-container-cts",
                                    "id":  "direction-container-cts",
                                    "label":  context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_cts"),
                                    "name": "direction-container-cts",
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_direction_cts_info_tip')
                                    }

                                },
                                {
                                    "element_description": true,
                                    "value": '<select class="directionContainer-stc" style="width:100%"></select>',
                                    "class": "direction-container-stc",
                                    "id":  "direction-container-stc",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_stc"),
                                    "name": "direction-container-stc",
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_direction_stc_info_tip')
                                    }

                                },
                                                                {
                                    "element_description": true,
                                    "value": '<select class="directionContainer-exp" style="width:100%"></select>',
                                    "class": "direction-container-exp",
                                    "id":  "direction-container-exp",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_expression"),
                                    "name": "direction-container-exp",
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_direction_expression_info_tip')
                                    }

                                }
                            ]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_performance_impact"),
                            "progressive_disclosure": "expanded",
                            "elements": [
                                {
                                    "element_checkbox": true,
                                    "id": "perf-impact-unknown",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-unknown"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_perf_impact_unknown_info_tip')
                                    },
                                    "values": [{
                                        "id": "perf-impact-unknown",
                                        "name": "perf-impact-unknown",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }, {
                                    "element_checkbox": true,
                                    "id": "perf-impact-low",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-low"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_perf_impact_low_info_tip')
                                    },                                    
                                    "values": [{
                                        "id": "perf-impact-low",
                                        "name": "perf-impact-low",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }, {
                                    "element_checkbox": true,
                                    "id": "perf-impact-medium",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-medium"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_perf_impact_medium_info_tip')
                                    },                                    
                                    "values": [{
                                        "id": "perf-impact-medium",
                                        "name": "perf-impact-medium",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                },


                                {
                                    "element_checkbox": true,
                                    "id": "perf-impact-high",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-high"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_perf_impact_high_info_tip')
                                    },                                    
                                    "values": [{
                                        "id": "perf-impact-high",
                                        "name": "perf-impact-high",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }
                            ]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_section_heading_false_positives"),
                            "progressive_disclosure": "expanded",
                            "elements": [{
                                    "element_checkbox": true,
                                    "id": "false-positive-unknown",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-unknown"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_false_positive_unknown_info_tip')
                                    },
                                    "values": [{
                                        "id": "false-positive-unknown",
                                        "name": "false-positive-unknown",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }, {
                                    "element_checkbox": true,
                                    "id": "false-positive-low",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-low"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_false_positive_low_info_tip')
                                    },
                                    "values": [{
                                        "id": "false-positive-low",
                                        "name": "false-positive-low",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }, {
                                    "element_checkbox": true,
                                    "id": "false-positive-medium",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-medium"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_false_positive_medium_info_tip')
                                    },                                    
                                    "values": [{
                                        "id": "false-positive-medium",
                                        "name": "false-positive-medium",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                },


                                {
                                    "element_checkbox": true,
                                    "id": "false-positive-high",
                                    "label": context.getMessage("ips_sig_dynamic_form_field_label_perf-impact-high"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_false_positive_high_info_tip')
                                    },                                    
                                    "values": [{
                                        "id": "false-positive-high",
                                        "name": "false-positive-high",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }
                            ]
                        }, {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_object_type"),
                            "progressive_disclosure": "expanded",
                            "elements": [{
                                    "element_checkbox": true,
                                    "id": "obj-type-signature",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_obj-type-signature"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_object_type_sig_info_tip')
                                    },                                     
                                    "values": [{
                                        "id": "obj-type-signature",
                                        "name": "obj-type-signature",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }, {
                                    "element_checkbox": true,
                                    "id": "obj-type-anomaly",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_obj-type-protocol-anomaly"),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_object_type_anomaly_info_tip')
                                    }, 
                                    "values": [{
                                        "id": "obj-type-anomaly",
                                        "name": "obj-type-anomaly",
                                        "label": context.getMessage("enable"),
                                        "value": "enable"
                                    }],
                                    "error": "Please make a selection"
                                }

                            ]
                        }, 
                            {
                            "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor"),
                            "progressive_disclosure": "expanded",
                            "elements": [

                                {
                                    "element_dropdown": true,                                   
                                    "class": "vendorDropdown1",
                                    "id":  "vendorDropdown1",                                    
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor_type"),
                                    "name": "vendorDropdown1 ",
                                    "enableSearch": true,                                   
                                    "placeholder": context.getMessage('select_option'),
                                    "onChange": function(event) {                                  
                                        view.fetchVendorNameDropDown();
                                     },
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_form_tab_basic_section_heading_vendor_type_help')
                                    }

                                },
                                {
                                    "element_dropdown": true,                                    
                                    "class": "vendorDropdown2 ",
                                    "id":  "vendorDropdown2",
                                    "label":  context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor_name"),
                                    "name": "vendorDropdown2",
                                    "enableSearch": true,
                                    "placeholder": context.getMessage('select_option'),
                                    "onChange": function(event) {                                    
                                        view.fetchVendorTitleDropDown();
                                     },
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_form_tab_basic_section_heading_vendor_name_help')
                                    }

                                },
                                {
                                    "element_dropdown": true,
                                    "class": "vendorDropdown3",
                                    "id":  "vendorDropdown3",
                                    "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor_title"),
                                    "name": "vendorDropdown3",
                                    "enableSearch": true,
                                    "placeholder": context.getMessage('select_option'),
                                    "field-help": {
                                        "content": context.getMessage('ips_sig_dynamic_form_tab_basic_section_heading_vendor_title_help')
                                    }

                                }
                            ]
                        },                              
                                
                                        

                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "cancel_link": {
                        "id": "ips-sig-dynamic-group-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [{
                        "id": "preview-ips-sig",
                        "name": "preview",
                        "value": context.getMessage('ips_sig_dynamic_form_button_preview')
                    }
                    ,{
                        "id": "ips-sig-dynamic-group-save",
                        "name": "create",
                        "value": "OK"
                    }]
                };

            };

        };

        return Configuration;
    }
);