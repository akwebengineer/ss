/**
 *  A configuration object with the parameters required to build 
 *  a Create Alert Definition Form
 *  
 *  @module CreateAlertDefinition
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([ ], 
	function () {

 	var formConfig = function(context) { 	

        this.getValues = function() {
            return {
			    "form_id": "sd_alert_definition_form_id",
			    "form_name": "sd_alert_definition_form_id",
			    "err_div_id": "errorDiv",	
			    "on_overlay": true,
			    "add_remote_name_validation": 'alert-definition-name',
			    "sections": [
			 	{
		     		"heading": context.getMessage('alert_def_form_section_general'),
		            "section_id": "general_id",
		            "elements": [
		             {
		                	"element_multiple_error": true,
							"id": "alert-definition-name",
							"name": "name",
							"label": context.getMessage("alerts_grid_column_name"),
							"value": "{{name}}",
							"placeholder": context.getMessage('alert_def_form_name_field_placeholder'),
							"ua-help": "alias_for_ua_event_binding",
    						//"help": context.getMessage('alert_def_form_name_hint'),
							"error": true,
							"required": true,							
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
		                    "placeholder": context.getMessage('alert_def_form_description_field_placeholder'),	
		                    "pattern": "^.{1,1024}$",
	                    	"ua-help": "alias_for_ua_event_binding",
    						//"help": context.getMessage('alert_def_form_description_hint'),	                    
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
		                }
		        	]
		    		},
		    		{
		                //"heading": context.getMessage('alert_def_form_section_trigger'),
		                "section_id": "add_filter",
		                "elements": [
		               	{
		                   "element_description": true,
		                	"id": "add_filter",		                	
		                	"label": context.getMessage('alert_def_form_section_trigger'),
		                	"value": "To trigger an alert, data is obtained from: <br />- Using the data criteria of filters from the Event Viewer <br/>- Or by adding data criteria(Time Span, Group By, Filter By) <br /><a href='#' id='filters'>Use data criteria from filters </a>",		                	
		                	"error": context.getMessage('alert_def_form_addfilter_field_error'),
		                	"field-help": {
                        	"content": context.getMessage('alert_def_form_trigger_field_help'),
                        	"ua-help-identifier": "alias_for_title_ua_event_binding"
                    	}
						}
						]
		    		},
		    		{
		                "heading": context.getMessage('alert_def_form_section_trigger'),
		                "section_id": "edit_filter",
		                "elements": [			             
						{
		                   "element_description": true,
		                	"id": "add_data_criteria_template",
		                	"label": context.getMessage('alert_def_form_data_criteria'),
		                	"field-help": {
	                        	"content": context.getMessage('alert_def_form_data_criteria_field_help'),
	                        	"ua-help-identifier": "alias_for_title_ua_event_binding"
	                        },
	                        "required": true
						},
                        {
                            "element_description": true,
                            "id": "add_timepicker_widget",
                            "label":context.getMessage('alert_def_form_time_span_field'),
                            "required": true,
                            "class" : "sd-common"
                        },
                        {
                            "element_description": true,
                            "id": "add_filter_bar_template",
                            "label": ""
                        },
                        {
                            "element_description": true,
                            "id": "edit_data_criteria",
                            "label":"",
                            "value": "<a href='#' id='filters'>Edit data criteria from filters</a>"
                        },

		                {		                   
		                    "element_number": true,
		                    "id": "threshhold",
		                    "name": "threshhold",
		                    "label": context.getMessage('alert_def_form_threshhold'),
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
    						"help": context.getMessage('alert_def_threshold_hint'),
	                    	"post_validation": "isThreshholdEmpty"
		                }		               
						]
					},	
		    		{
		                "heading": "",
		                "section_id": "submit_filter",
		                "elements": [{
		                   "element_description": true,
		                	"id": "filter-string",
		                	"label": "",
		                	"value":"{{alertcriteria.filter-string}}"
						},{
                            "element_description": true,
                            "id": "filter-id",
                            "label": ""
						}]
		            },{
		                "heading": context.getMessage('alert_def_form_section_recipients'),
		                "section_id": "recipient_id",
		                "elements": [		              
		                {
                            "element_description": true,
					    	"id": "additional-emails",
					    	"name": "additional-emails",
					    	"label": context.getMessage('alert_def_form_email'),
					   		"field-help": {
	                        	"content":  context.getMessage('alert_def_form_email_field_help'), 
	                        	"ua-help-identifier": "alias_for_title_ua_event_binding"
	                    	},	                    	
		                    "error": context.getMessage('alert_def_form_email_field_error')	
						},{
		                	"element_textarea": true,
		                    "id": "custom-message",
		                    "name": "custom-message",
		                    "label": context.getMessage('alert_def_form_custom_msg'),
		                    "value": "{{custom-message}}",
		                    "placeholder": context.getMessage('alert_def_form_custom_msg_field_placeholder'),
		                    "field-help": {
	                        	"content": context.getMessage('alert_def_form_custom_msg_field_help'),
	                        	"ua-help-identifier": "alias_for_title_ua_event_binding"
	                    	}	                    	
		                }
		            	]
		        	} 
		    	],
                
                "buttonsAlignedRight": true,
                "buttons": [                   
                    {
                        "id": "definition-save",
                        "name": "create",
                        "value": context.getMessage('ok')
                    }
           		],
                "cancel_link": {
		            "id": "definition-cancel",
		            "name": "cancel",
		            "value": context.getMessage('cancel')
		        }

			}
		}
    };

    return formConfig;
});	
