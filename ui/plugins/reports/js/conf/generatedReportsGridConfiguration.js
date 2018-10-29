/**
 * Created by wasima on 11/9/15.
 */

define([  '../../../ui-common/js/common/restApiConstants.js','text!../templates/generatedReports.html'
], function(RestApiConstants,reportsTemplate) {

    var Configuration = function(context) {

        // Method to get Date and Time format
        this.getDateTimeFormat =  function(cellValue, options, rowObject) {
            return cellValue ? new Date(cellValue).toLocaleString() : "";   
        }; 

        this.downloadReport = function(cellText, options, rowObject) {
            return Slipstream.SDK.Renderer.render(reportsTemplate, {
                "reportId": rowObject["id"],
                "cellValue": rowObject["report-pdf-name"],
                "id":"generatedreportId"});
         };

        
        this.getValues = function(config) {
            var me = this;
            return {
                "tableId": "generated_reports",
                "numberOfRows": 50,
                "title": context.getMessage('generated_reports_grid_title'),
                "title-help": {
                    "content": context.getMessage('generated_reports_grid_title_help'),
                    "ua-help-text":context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("REPORT_GENERATED_USING")
                },
                "height": "auto",
                "sortName": "generated-time",
                "sortOrder": "desc",
                "repeatItems": "false",
                "multiselect": "true",
                "scroll": true,
                "dataType":"json",
                "type":"GET",
                "url": "/api/juniper/seci/report-management/generated-reports",
                "jsonId": "id", 
                "jsonRoot":"generated-report-info-response.generated-reports-info",
                "jsonRecords": function(data) {
                    return data['generated-report-info-response'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/json'
                    }
                },
                "contextMenu": {
                    "delete": context.getMessage('generated_reports_delete'),
                    // "custom":[{
                    //         "label":context.getMessage('generated_reports_download_pdf'),
                    //         "key":"downloadPDFEvent"
                    //     }]
                },
                "confirmationDialog":{
                    "delete": {
                        title: context.getMessage('generated_reports_title'),
                        question: context.getMessage('generated_reports_delete_msg')
                    }
                },
                "columns": [
                    {
                        "index": "report-pdf-name",
                        "name": "report-pdf-name",
                        "label": context.getMessage('generated_reports_grid_column_pdf_file_name'),
                        "width": 250,
                        "formatter": this.downloadReport,
                        "sortable": false
                    },
                    {
                        "index": "generated-time",
                        "name": "generated-time",
                        "label": context.getMessage('generated_reports_grid_column_generated_time'),
                        "formatter": this.getDateTimeFormat, 
                        "width": 200,
                        "sortable": false
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('generated_reports_grid_column_description'),
                        "width": 200,
                        "sortable": false
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('generated_reports_grid_column_definition_name'),
                        "width": 150,
                        "sortable": false
                    },
                    {
                        "index": "last-modified-by-user-name",
                        "name": "last-modified-by-user-name",
                        "label": context.getMessage('generated_reports_grid_column_generated_by'),
                        "width": 150,
                        "sortable": false
                    },
                    {
                        "index": "recipients",
                        "name": "recipients",
                        "label": context.getMessage('generated_reports_grid_column_recipients'),
                        "width": 150,
                        "sortable": false
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "width": 186,
                        "hidden": true
                    }
                ]
            }
        };
    };

    return Configuration;

});
