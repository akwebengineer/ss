/**
 *  A configuration object with the parameters required to build 
 *  a Create Filter Form
 *  
 *  @module EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([ ], 
	function () {

 	var formConfig = function(context) { 	

        this.getValues = function() {

            return {
			    "form_id": "create_new_filter_form",
			    "form_name": "create_new_filter_form",
			    "err_div_id": "errorDiv",             
                "err_timeout": "1000",
			    "on_overlay": true,		    
			    "sections": [
			 	{
		     		"section_id": "save_filter",
		            "elements": [
		             {
		                	"element_multiple_error": true,
							"id": "filter-name",
							"name": "filter-name",							
							"label": context.getMessage("ev_filter_name"),
							"value": "{{filter-name}}",							
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
                                    "error": context.getMessage('ev_save_filter_form_field_error_allowed_chars')
                                }
							],
							"notshowvalid": true							
		                },{
		                    "element_length": true,
                            "min_length":"0",
                            "max_length":"200",
		                    "id": "human-readable-filter-string",
		                    "name": "humanReadableFilterString",
		                    "label": context.getMessage('ev_save_filter_form_field_definition_field'),
		                    "value": "{{humanReadableFilterString}}",
		                    "disabled":true
		                },{
		                    "element_description": true,
						    "id": "time-period",
						    "name": "time-period",
						    "label": context.getMessage('ev_save_filter_form_field_time_field'),
						    "value": "{{time-period}}"
						},{
					  		"element_description": true,
					    	"id": "tags",
					    	"name": "tags",
					    	"label": context.getMessage('ev_save_filter_form_tags'),
					    	"value": "{{tags}}",
					    	"class": "tags"
						},{
					  		"element_text": true,
					    	"id": "start-time",
					    	"name": "start-time",
					    	"label": "",
					    	"value": "{{start-time}}",
					    	"class": "hide"
						},{
					  		"element_text": true,
					    	"id": "end-time",
					    	"name": "end-time",
					    	"label": "",
					    	"value": "{{end-time}}",
					    	"class": "hide"
						},{
                            "element_text": true,
                            "id": "filter-tags",
                            "name": "filter-tags",
                            "label": "",
                            "value": "{{filter-tags}}",
                            "class": "hide"
                        },{
					  		"element_text": true,
					    	"id": "duration",
					    	"name": "duration",
					    	"label": "",
					    	"value": "{{duration}}",
					    	"class": "hide"
						},{
					  		"element_text": true,
					    	"id": "aggregation",
					    	"name": "aggregation",
					    	"label": "",
					    	"value": "{{aggregation}}",
					    	"class": "hide"
						},{
					  		"element_text": true,
					    	"id": "time-unit",
					    	"name": "time-unit",
					    	"label": "",
					    	"value": "{{time-unit}}",
					    	"class": "hide"
						},{
                            "element_text": true,
                            "id": "id",
                            "name": "id",
                            "label": "",
                            "value": "{{id}}",
                            "class": "hide"
                        }]
		        	} 
		    	],

		    	"buttonsAlignedRight": true,
                "buttons": [                   
                    {
                        "id": "save-new-filter",
                        "name": "save-new-filter",
                        "value": context.getMessage('ok')
                    }
           		], 
           		 "cancel_link": {
		            "id": "cancel-new-filter",
		            "name": "cancel-new-filter",
		            "value": context.getMessage('cancel')
		        }            

			}
		};
    };

    return formConfig;
});	
