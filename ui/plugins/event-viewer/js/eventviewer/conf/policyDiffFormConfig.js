define([], function () {
 	var formConfig = function(context) {
        this.getValues = function() {
            return {
				"title": "Compare Versions : SRX-218 => #1 : Current",
			    "form_id": "policy_diff_form",
			    "form_name": "policy_diff_form",
			    "on_overlay": true,
			    "sections": [{
		            "section_id": "policy_diff",
		            "elements": [{
					}]
		        }],
/*		        "buttonsAlignedRight": true,*/
		        "buttons": [{
    				"id": "close",
    				"value": "Close"
				}]
			}
		}
    };
    return formConfig;
});