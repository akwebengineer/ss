define([], function () {
 	var formConfig = function(context) {
        this.getValues = function() {
            return {
				"title": "Rule Changed",
			    "form_id": "rule_changed_form",
			    "form_name": "rule_changed_form",
			    "on_overlay": true,
			    "sections": [{
		            "section_id": "rule_changed",
		            "elements": [{
					    "element_description": true,
					    "disabled": true,
					    "value": "Rule is modified after pushed to the device."
					}]
		        }],
		        "buttonsAlignedRight": true,
		        "buttons": [{
    				"id": "comparerule",
    				"value": "Changes in Rule"
				},{
    				"id": "currentrule",
    				"value": "Go to Current Rule"
				},{
    				"id": "close",
    				"value": "Close"
				}]
			}
		}
    };
    return formConfig;
});