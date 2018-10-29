/**
* Edit Recipients form configuration.
* This is form configuration object with 3 fields to be used by Recipients Widget.
* 
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([ ], 
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {
            return {		
			    "form_id": "recipients_form",
			    "form_name": "recipients_form",
                "on_overlay": true,
			    "sections": [{
		            "heading": context.getMessage('reports_form_recipients_email'),
		            "section_id": "recipients_id",
		            "elements": [{
					    "element_description": true,
					    "id": "additional-emails",
					    "name": "additional-emails",
					    "label": context.getMessage('reports_form_recipients_recipients'),
//					    "value": "{{additional-emails}}",
					    "required": true,
                        "field-help": {
                            "content": context.getMessage('reports_form_recipients_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
	                    },
                        "error": context.getMessage('reports_form_recipients_field_error')
					},{
					    "element_length": true,
					    "min_length": 0,
					    "id": "email-subject",
					    "name": "email-subject",
					    "label": context.getMessage('reports_form_recipients_subject'),
					    "value": "{{email-subject}}",
					    "placeholder": context.getMessage('reports_form_subject_field_placeholder'),
					    "required": false,
					    "field-help": {
					        "content": context.getMessage('reports_form_subject_field_help'),
					        "ua-help-identifier": "alias_for_title_ua_event_binding"
					    },
					    "error": false,
					    "class": "email-subject"
					},{
		               	"element_textarea": true,
		                "id": "comments",
		                "name": "comments",
		                "label": context.getMessage('reports_form_recipients_comments'),
		                "value": "{{comments}}",
		                "placeholder": context.getMessage('reports_form_comments_field_placeholder'),
		                "required": false,
		                "field-help": {
	                      	"content":  context.getMessage('reports_form_comments_field_help'),
	                      	"ua-help-identifier": "alias_for_title_ua_event_binding"
	                   	},
	                   	"error": false	
		            }]
		        }]
			}
		}
    };

    return formConfig;
});