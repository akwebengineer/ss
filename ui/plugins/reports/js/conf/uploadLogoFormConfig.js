/**
* Upload Logo form configuration.
* 
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([], 
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {
            return {		
				"title": 'Add Information to All Reports',
			    "form_id": "logo_form",
			    "form_name": "logo_form",
			    "sections": [{
		            "heading": 'Add a company logo for the report.',
		            "section_id": "logo",
		            "elements": [{
					    "element_description": true,
					    "id": "logoImgContainer",
					    "name": "logoImgContainer",
					    "label": "Logo",
					    "value": "",
					},{
					    "element_file": true,
					    "min_length": 0,
					    "id": "fileName",
					    "name": "fileName",
					    "label": 'Logo image file',
					    "value": "{{fileName}}",
					    "placeholder": "Please select a Logo ...",
					    "required": true,
					    "fileupload_button_label": "Browse",
					    "error": "Please select a valid file"
					}]
		        }]
			}
		}
    };

    return formConfig;
});