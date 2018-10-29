/**
 *  A configuration object with the parameters required to build 
 *  a Report Wizard
 *  
 *  @module EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
], function () {

 	var formConfig = function(context) { 	
      
      	// Wizard configuration elements for General Information
        this.generalConfig = function() {	        
        	return {        		
			    "form_id": "general_form",
			    "form_name": "general_form",
			    "err_div_id": "errorDiv",				                  
                "err_timeout": "1000",
			    "on_overlay": false,		    
			    "sections": [
			 	{
                    "heading": context.getMessage("ev_create_report_general_page_heading"),
                    "section_id": "general_info",
                    "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "name",
                        "name": "name",
                        "value": "{{name}}",
                        "label": context.getMessage('report_def_form_name'),
                        "field-help": {
                            "content": context.getMessage('report_def_form_name_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "required": true,
                        "notshowvalid": true,
                        "error": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": context.getMessage('name_require_error')
                            },
                            {
                                "regexId": "regex1",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/\\s]{0,62}$",
                                "error": context.getMessage('report_def_form_name_error_invalid')
                            }
                        ]
                    },
                    {
                        "element_textarea": true,
                        "id": "description",
                        "name": "description",
                        "label": context.getMessage('ev_create_report_form_description'),
                        "value": "{{description}}",
                        "required": true,
                        "pattern": "^.{1,1024}$",
                        "error": context.getMessage('report_def_form_desc_error_max_length'),
                        "field-help": {
                            "content": context.getMessage('report_def_form_description_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    }]
		        	} 
		    	]
			}			
		}; 

		// Wizard configuration elements for Data Criteria
		this.filterConfig = function() {	        
        	return {        		
        		"form_id": "filter_form",
			    "form_name": "filter_form",
			    "err_div_id": "errorDiv",				                  
                "err_timeout": "1000",
			    "on_overlay": false,		    
			    "sections": [
			 	{
			 		//"heading": "Data Criteria",
			        "section_id": "filter_info",
			        "elements": [				            		            
			        {			        	
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"200",
                        "id": "aggregation",
                        "name": "aggregation",
                        "label": context.getMessage('ev_create_report_form_group_by'),
                        "value": "{{section.aggregation}}",
                        "disabled":true
                    },
                    {
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"200",
                        "id": "filter-string",
                        "name": "filter-string",
                        "label": context.getMessage('ev_create_report_form_filter_string'),
                        "value": "{{section.filter-string}}",
                        "disabled":true
                    },
                    {
                       "element_description": true,
                        "id": "add_timepicker_widget",
                        "label": context.getMessage('ev_create_report_form_time_span'),
                        "value": "",
                        "class" : "sd-common"
                    }
			        ]	
			 	}]
			 }
		};
	}
    return formConfig;
});	
