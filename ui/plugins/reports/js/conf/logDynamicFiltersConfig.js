/**
 * A Filters  Form Config to render the selected Filters 
 *
 * @module LogReportsDefinition
 * @author Aslam a <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {
            this.getValues = function(filters , sectionNumber) {
                return {
                     "section_id": "appended_section_id_"+sectionNumber,
                        "elements": [
                        {
                           "element_text": true,
                           "id": "report_section_filter_id_"+sectionNumber,
                           "name": "report_title",
                           "value" : filters.id,
                           "required" : false     
                        
                        }, 
                        {
                           "element_text": true,
                           "id": "report_section_title_"+sectionNumber,
                           "label": context.getMessage("report_log_section_title"),
                           "name": "report_title",
                           "value" : filters.filter_name,
                           "required" : true     
                        
                        },                      
                        {
                           "element_text": true,
                           "id": "report_description_"+sectionNumber,
                           "label": context.getMessage("report_log_section_description"),
                           "name": "report_description",
                           "value" : filters.filter_description,
                           "required" : true          
                        
                        },
                        {
                           "element_description": true,
                           "id": "report_data_criteria_"+sectionNumber,
                           "label": context.getMessage("report_log_data_criteria"),
                           "name": "report_description",
                           "required" : true,
                           "field-help": {
                               "content": context.getMessage('report_data_criteria_field_help'),
                               "ua-help-identifier": "alias_for_title_ua_event_binding"
                           }
                        },
                        {
                           "element_description": true,
                            "id": "add_timepicker_widget"+sectionNumber,
                            "label": context.getMessage('report_log_time_span'),
                            "value": "",
                            "required": true,
                            "class" : "sd-common"
                        },
                        {
                            "element_description": true,
                            "id": "report_time_span_"+sectionNumber,
                            "label":""
                        },
                        {
                            "element_dropdown": true,
                            "id": "report_chart_"+sectionNumber,
                            "name": "report_chart",
                            "label": context.getMessage('report_log_chart'),
                            "values": [
                                        {
                                            "label": "BAR",
                                            "value": "BAR"                                    
                                        },
                                        {
                                            "label": "COMPARISON_BAR",
                                            "value": "COMPARISON_BAR"
                                        },
                                        {
                                            "label": "TIMELINE",
                                            "value": "TIMELINE"
                                        },
                                        {
                                            "label": "GRID",
                                            "value": "GRID"
                                        }
                            ],
                            "field-help": {
                               "content": context.getMessage('report_chart_field_help'),
                               "ua-help-identifier": "alias_for_title_ua_event_binding"
                            }
                        },
                        {
                            
                            "element_number": true,
                            "id": "bandwidth_count_"+sectionNumber,
                            "name": "bandwidth_count",
                            "label": context.getMessage('report_bandwidth_top'),
                            "min_value" : "1",
                            "max_value":"20",
                            "value": "10",
                            "class": "report-log-section",
                            "error": context.getMessage('report_bandwidth_top_error_msg'),
                            "field-help": {
                               "content": context.getMessage('bandwidth_count_field_help'),
                               "ua-help-identifier": "alias_for_title_ua_event_binding"
                            }
                        }
                        ]
                };

            };

        this.getValues1 = function(filters , sectionNumber) {
            return {
                     "section_id": "appended_section_count_id_"+sectionNumber,
                        "elements": [
                        {
                            "element_dropdown": true,
                            "id": "report_section_count_"+sectionNumber,
                            "name": "report_section_count",
                            "label": context.getMessage('report_log_section_count'),
                            "values": [
                                        
                            ],
                            "inlineButtons": [{
                                    "id": "report-delete-section",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "deletesection",
                                    "value": context.getMessage('report_log_section_delete')
                                     }]
                        }
                        ]
                };
        }
        };

        return Configuration;
    }
);
