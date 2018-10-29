/**
 * A Filters Grid Form Config to render the Filters Grid
 *
 * @module DownloadPDFReport
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "download_pdf_report",
                    "form_name": "download_pdf_report",
                    "title": context.getMessage('download_report_form_title'),
                    "title-help": {
                        "content": context.getMessage('download_report_form_title_help'),
                        "ua-help-text":context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("")
                    },
                    "on_overlay": true,
                    "sections": [
                    {
                        "elements": [
                        {
                            "element_description": true,
                            "id": "download_pdf",
                            "name": "download_pdf"
                        }
                        ]
                    }],
                    "buttonsAlignedRight": true,
                    "buttons": [                 
                    {
                        "id": "download_pdf_cancel",
                        "name": "download_pdf_cancel",
                        "value": context.getMessage('cancel')
                    }]
                };
            };
        };

        return Configuration;
    }
);
