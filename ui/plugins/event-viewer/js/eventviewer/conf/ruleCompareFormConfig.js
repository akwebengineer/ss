define([], function () {
 	var formConfig = function(context) {
        this.getValues = function() {
            return {
				"title": "Changes in Rule",
			    "form_id": "rule_comparison_form",
			    "form_name": "rule_comparison_form",
			    "on_overlay": true,
			    "sections": [{
		            "section_id": "rule_comparison",
		            "elements": [{
					}]
		        }],
		        "buttonsAlignedRight": true,
		        "buttons": [{
    				"id": "currentrule",
    				"value": "Go to Current Rule"
				},{
    				"id": "comparepolicy",
    				"value": "Go to Policy Comparison"
				},{
    				"id": "close",
    				"value": "Close"
				}]
			}
		}
    };
    return formConfig;
});