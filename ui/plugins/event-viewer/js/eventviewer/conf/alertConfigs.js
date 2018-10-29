/**
 *  A configuration object with the parameters required to build 
 *  a Alert Wizard
 *  
 *  @module EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
], function () {

 	var formConfig = function(context) { 	
      
      	// Wizard configuration elements for General Information
        this.generalConfig = function() {	        
        	return {        		
			    "form_id": "general-form",
			    "form_name": "general-form",
			    "err_div_id": "errorDiv",				                  
                "err_timeout": "1000",
			    "on_overlay": false,
			    "sections": [{
                    "section_id": "general-info",
                    "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "name",
                        "name": "name",
                        "label": context.getMessage("alerts_grid_column_name"),
                        "value": "{{name}}",
                        "error": true,
                        "required": true,
                        "post_validation": "requiredField",
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": context.getMessage("name_require_error")
                            },
                            {
                                "regexId": "regex1",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/\\s]{0,62}$",
                                "error": context.getMessage('alert_def_form_field_error_allowed_chars')
                            }

                        ],
                        "notshowvalid": true,
                        "field-help": {
                            "content": context.getMessage('alert_def_form_name_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_textarea": true,
                        "id": "description",
                        "name": "description",
                        "label": context.getMessage('alerts_grid_column_description'),
                        "value": "{{description}}",
                        "pattern": "^.{1,1024}$",
                        "error": context.getMessage('alert_def_form_description_field_error'),
                        "field-help": {
                            "content": context.getMessage('alert_def_form_description_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                       "element_description": true,
                        "id": "alert_type",
                        "label": context.getMessage('alerts_def_form_alert_type'),
                        "value": context.getMessage('alerts_def_form_alert_type_value')
                    },
                    {
                        "element_checkbox": true,
                        "id": "status",
                        "label": context.getMessage('alert_def_form_status_field'),
                        "values": [
                            {
                                "id": "status",
                                "name": "status",
                                "label": context.getMessage('alert_def_form_status_field_option'),
                                "value": "true",
                                "checked": true
                            }
                        ],
                        "field-help": {
                            "content": context.getMessage('alert_def_form_status_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_radio": true,
                        "id": "severity",
                        "label": context.getMessage('alert_def_form_severity_field'),
                        "values": [
                            {
                                "id": "info",
                                "name": "severity",
                                "label": context.getMessage('alert_def_form_severity_field_option1'),
                                "value": "1",
                                "checked": "true"
                            }, {
                                "id": "minor",
                                "name": "severity",
                                "label": context.getMessage('alert_def_form_severity_field_option2'),
                                "value": "2"
                            }, {
                                "id": "major",
                                "name": "severity",
                                "label": context.getMessage('alert_def_form_severity_field_option3'),
                                "value": "3"
                            }, {
                                "id": "critical",
                                "name": "severity",
                                "label": context.getMessage('alert_def_form_severity_field_option4'),
                                "value": "4"
                            }
                        ],
                        "field-help": {
                            "content": context.getMessage('alert_def_form_severity_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    }]
		        }]
			}
		}; 

		// Wizard configuration elements for Data Criteria
		this.filterConfig = function(filterObj) {
            return {
        		"form_id": "filter-form",
			    "form_name": "filter-form",
			    "err_div_id": "errorDiv",				                  
                "err_timeout": "1000",
			    "on_overlay": false,		    
			    "sections": [
			 	{
                    "section_id": "filter-picker",
                    "elements": [
                    {
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"200",
                        "id": "aggregation",
                        "name": "aggregation",
                        "label": context.getMessage('alert_def_form_aggregation_field'),
                        "value": "{{alertcriteria.aggregation}}",
                        "disabled":true
                    },
                    {
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"200",
                        "id": "filter-string",
                        "name": "filter-string",
                        "label": context.getMessage('alert_def_form_filter_string_field'),
                        "value": "{{alertcriteria.filter-string}}",
                        "disabled":true
                    },
                    {
                       "element_description": true,
                        "id": "add_timepicker_widget",
                        "label": context.getMessage('alert_def_form_time_span_field'),
                        "value": "",
                        "class" : "sd-common"
                    },
                    {
                        "element_number": true,
                        "id": "threshhold",
                        "name": "threshhold",
                        "label": context.getMessage('alert_def_form_threshhold'),
                        "placeholder": "",
                        "value": "{{alertcriteria.threshhold}}",
                        "required": true,
                        "min_value":"1",
                        "max_value":"1000000000",
                        "placeholder": context.getMessage('alert_def_threshold_placeholder'),
                        "field-help": {
                            "content": context.getMessage('alert_def_form_threshhold_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": context.getMessage('alert_def_threshold_field_error_msg'),
                        "ua-help": "alias_for_ua_event_binding",
                        "help": context.getMessage('alert_def_threshold_hint')
                    }]
		        }]
        	}
        };
	}
    return formConfig;
});