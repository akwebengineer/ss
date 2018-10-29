define([], function () {
 	var formConfig = function(context) {
        this.getValues = function() {
            return {
				"title": "Compare Versions",
			    "form_id": "policy_compare_dialog",
			    "form_name": "policy_compare_dialog",
			    "on_overlay": true,
			    "sections": [{
		            "section_id": "policy_compare_dialog",
		            "elements": [{
					    "element_description": true,
					    "disabled": true,
					    "id": "policy_name",
					    "label": "Policy Name:",
					    "value": "SRX-218"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "policy_version_base",
					    "label": "Base Version:",
					    "value": "Current"
					},{
						"element_description": true,
						"disabled": true,
					    "id": "policy_version_compareto",
					    "label": "Compare To:",
					    "value": "#1"
					}]
		        }],
		        "buttonsAlignedRight": true,
		        "buttons": [{
    				"id": "swap",
    				"value": "Swap"
				},{
    				"id": "compare",
    				"value": "Compare"
				},{
    				"id": "close",
    				"value": "Cancel"
				}]
			}
		}
    };
    return formConfig;
});