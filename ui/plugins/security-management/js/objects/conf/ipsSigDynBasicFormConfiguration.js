/*
 * ipsSigDynBasicFormConfiguration.js
 * @author dkumara <dkumara@juniper.net>
 */
define([], function() {
    var BasicFormConf = function(context) {

        this.getValues = function() {

            return {
                "form_id": "phase1-configuration",
                "form_name": "phase1-configuration",
                "title-help": {
                    "content": context.getMessage("ips_sig_dynamic_form_tab_basic_title_help"),
                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                },

                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_div_link_text": "Create VPN Profile help",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                // "on_overlay": true,
                "sections": [

                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_recommended"),
                        "progressive_disclosure": "expanded",
                        "elements": [

                           {
                                "element_checkbox": true,
                                "id": "recommended-yes",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommendedYes"),
                                "values": [{
                                    "id": "recommended-yes",
                                    "name": "recommended-yes",
                                    "label": context.getMessage("enable"),
                                    "value": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommendedYes")
                                }],
                                "error": "Please make a selection"
                            }, {
                                "element_checkbox": true,
                                "id": "recommended-no",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommendedNo"),
                                "values": [{
                                    "id": "recommended-no",
                                    "name": "recommended-no",
                                    "label": context.getMessage("enable"),
                                    "value": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_recommendedNo")
                                }],
                                "error": "Please make a selection"
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_direction"),
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                               "element_description": true,
                                "value": '<select class="direction-any-container" style="width:100%"></select>',
                                "class":"direction-any1-container-id",
                                "id": "direction-any1",
                                "name": "direction-any1",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_any")
                            }, {

                               "element_description": true,
                                "value": '<select class="direction-cts-container" style="width:100%"></select>',
                                "class":"direction-cts-container-id",
                                "id": "direction-cts-drop",
                                "name": "direction-cts-drop",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_cts")
                            }, {
                                "element_description": true,
                                "value": '<select class="direction-stc-container" style="width:100%"></select>',
                                "class":"direction-stc-container-id",
                                "id": "direction-stc-drop",
                                "name": "direction-stc-drop",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_stc")
                            }, {
                                "element_description": true,
                                "value": '<select class="direction-expression-container" style="width:100%"></select>',
                                "class":"direction-expression-container-id",
                                "id": "direction-expression-drop",
                                "name": "direction-expression-drop",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_expression")
                            }

                        ]
                    },
                     {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_match_assurance"),
                        "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                        "elements": [
                                                            {
                                "element_description": true,
                                "value": '<select class="math-ass-container" style="width:100%"></select>',
                                "class":"math-ass-container-id",
                                "id": "math-ass-container-id",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_match_assurance"),
                                "name": "math-ass-container-name"
                            }
                 
                        ]
                    },
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_performance_impact"),
                        "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                        "elements": [
                                                            {
                                "element_description": true,
                                "value": '<select class="perf-impact-container" style="width:100%"></select>',
                                "class":"perf-impact-container-id",
                                "id": "perf-impact-container-id",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_performance_impact"),
                                "name": "perf-impact-container-name"
                            }
                 
                        ]
                    },
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_object_type"),
                        "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                        "elements": [
                                                            {
                                "element_description": true,
                                "value": '<select class="obj-type-container" style="width:100%"></select>',
                                "class":"obj-type-container-id",
                                "id": "obj-type-container-id",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_object_type"),
                                "name": "obj-type-container-name"
                            }
                 
                        ]
                    },
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor"),
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "vendor",
                                "name": "vendor",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_vendor"),
                                "value": "{{name}}"
                            }

                        ]
                    } 

                ]
            };

        };
    };

    return BasicFormConf;

});