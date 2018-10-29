/**
 *  Configuration object to build Run Report View
 *
 *  @module Reports
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define([ ],
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {

            return {
                "title": context.getMessage('run_report_form_title'),
                "title-help": {
                    "content": context.getMessage('run_report_form_title_help'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("")
                },
			    "form_id": "run_reports_form_config",
			    "form_name": "run_reports_form_config",
			    "err_div_id": "errorDiv",
                "err_timeout": "1000",
			    "on_overlay": true,
			    "sections": [
			 	{
                    "section_id": "report_definition_details",
                    "heading_text": context.getMessage('run_report_msg'),
		            "elements": [
		            {
                        "element_description": true,
                        "id": "id",
                        "name": "id"
                    },{
                        "element_description": true,
                        "id": "progress-bar",
                        "name": "progress-bar"
                    },{
                        "element_description": true,
                        "id": "download-pdf",
                        "name": "download-pdf"
                    }]
		        }],
		        "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "cancel_run_report",
                        "name": "cancel_run_report",
                        "value": context.getMessage('ok')
                    }
                ]
			}
		};
    };

    return formConfig;
});
