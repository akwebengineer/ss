/**
* Alert detail form configuration.
* This is form configuration object to show detail view of alerts.
* 
* @module Alerts
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([ ], 
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {
            return {		
				"title": "Alert Detail",
				"on_overlay": true,
			    "form_id": "alertdetail_form",
			    "form_name": "alertdetail_form",
			    "sections": [{
		            "section_id": "recipients_id",
		            "elements": [{
					    "element_description": true,
					    "disabled": true,
					    "id": "definition-name",
					    "label": context.getMessage('alertdetail_definition_name'),
					    "value": "{{definition-name}}"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "description",
					    "label": context.getMessage('alertdetail_description'),
					    "value": "{{description}}"
					},{
						"element_description": true,
					    "id": "alert-type",
					    "label": context.getMessage('alert_def_grid_column_alert_type'),
					    "value": "{{alert-type}}"
		            },{
						"element_description": true,
					    "id": "severity",
					    "label": context.getMessage('alerts_grid_column_severity'),
					    "value": "{{severity}}"
		            },{
						"element_description": true,
					    "id": "target",
					    "label": context.getMessage('alerts_grid_column_source')
					   // "value": "{{source}}"
		            },{
						"element_description": true,
					    "id": "generated-time",
					    "label": context.getMessage('alertdetail_generatedtime'),
					    "value": "{{generated-time}}"
		            },{
						"element_description": true,
					    "id": "start-time",
					    "label": context.getMessage('alertdetail_starttime'),
					    "value": "{{start-time}}"
		            },{
						"element_description": true,
					    "id": "end-time",
					    "label": context.getMessage('alertdetail_endtime'),
					    "value": "{{end-time}}"
		            },{
						"element_description": true,
					    "id": "aggregation",
					    "label": context.getMessage('alertdetail_aggregation'),
					    "value": "{{aggregation}}"
		            },{
						"element_description": true,
					    "id": "email-recepients",
					    "label": context.getMessage('alertdetail_email_recipients'),
					    "value": "{{email-recepients}}"
		            },{
						"element_description": true,
					    "id": "message",
					    "label": context.getMessage('alertdetail_message'),
					    "value": "{{message}}"
		            }]
		        }],
		        "buttonsAlignedRight": true,
                "buttons": [                   
                    {
            			"id": "detail-view-close",
            			"name": "close",
            			"value": "Close"
                    }
                ]
			}
		}
    };

    return formConfig;
});