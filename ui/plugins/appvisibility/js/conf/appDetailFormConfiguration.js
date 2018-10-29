define([], 
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {
            return {		
				"title": "View Details",
				"on_overlay": true,
			    "form_id": "alertdetail_form",
			    "form_name": "alertdetail_form",
			    "sections": [{
		            "section_id": "recipients_id",
		            "elements": [{
					    "element_description": true,
					    "disabled": true,
					    "label": "Application Name",
					    "value": "{{name}}"
					},{
						"element_description": true,
						"disabled": true,
					    "label": "Application Description",
					    "value": "{{description}}"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "UDescription",
					    "label": "Risk-Level",
					    "value": "{{risk}}"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "UDescription",
					    "label": "Category",
					    "value": "{{category}}"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "UDescription",
					    "label": "Sub-Category",
					    "value": "{{sub-category}}"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "UDescription",
					    "label": "Characteristics",
					    "value": "{{characteristic}}"
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