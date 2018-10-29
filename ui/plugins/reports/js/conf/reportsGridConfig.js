/**
* Reports: Reports Grid configuration
* A configuration object with the parameters required to build a grid for Reports
*  
* @module reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../ui-common/js/common/restApiConstants.js',
    "../utils/reportConstants.js",
    "../utils/reportUtilMixin.js",
], function (RestApiConstants, ReportsConstants, ReportsUtilMixIn) {
        var Configuration = function(context) {

        // Report Content is comma-separted 'sections.section'
        this.getReportContent = function(cellValue, options, rowObject) {

            var i = 0,currentRow = rowObject,content = "";
            if(currentRow['report-content-type'] === ReportsConstants.ReportTypes.POLICY_ANOMALY){
                content = "Anomalies: ";
                if(currentRow['policy-analysis-content']['anomalies'] != undefined){
                   var anomalies = currentRow['policy-analysis-content']['anomalies']['anomalies'];
                   // if contains anomalies add else return none
                   if(anomalies.length > 0){
                       for(var j in anomalies){
                        content += anomalies[j] + " ";
                       } 
                    }
                    else {
                        content += "None ";
                    }
                }
                if(currentRow['policy-analysis-content']['firewall-policy'] != undefined){
                    content += "Firewall Policy: ";
                    // if has firewall policy adds it else returns none
                    if(currentRow['policy-analysis-content']['firewall-policy-name'] == 0){
                        content += "None";
                    }
                    else {
                        content +=  currentRow['policy-analysis-content']['firewall-policy-name'];
                    }
                }    
            }else if(currentRow['report-content-type'] === ReportsConstants.ReportTypes.BANDWIDTH){
                content = "Count "+ rowObject['bandwidth-template-content']['count']; 
                if(currentRow['bandwidth-template-content']['time-duration'] != undefined){
                    content += ", Time Duration "+ (currentRow['bandwidth-template-content']['time-duration'])/(60*60*1000)+" Hours";
                }
            }else if(currentRow['report-content-type'] === ReportsConstants.ReportTypes.LOG_BASED){
                if(Array.isArray(currentRow['sections']['section'])){
                    for(i=0; i<currentRow['sections']['section'].length; i++) {
                        content += currentRow['sections']['section'][i]['section-title'] + ', ';
                    }
                    content = content.slice(0,-2);
                }
            }
            return '<span class="cellLink tooltip" data-tooltip="'+content+'" title="'+content+'">'+content+'</span>';
        }

        // Get schedule from lang file 
        this.getScheduleText  = function(cellValue, options, rowObject) {
    
            var schedule = cellValue;

            switch(schedule) {
                case '':
                    scheduleText = context.getMessage('reports_grid_schedule_none'); break;
                case 'Daily':
                    scheduleText = context.getMessage('reports_grid_schedule_daily'); break;
                case 'Weekly':
                    scheduleText = context.getMessage('reports_grid_schedule_weekly'); break;
                case 'Monthly':
                    scheduleText = context.getMessage('reports_grid_schedule_monthly'); break;
                case 'Now':
                    scheduleText = context.getMessage('reports_grid_schedule_now'); break;
                case 'Once':
                    scheduleText = context.getMessage('reports_grid_schedule_once'); break;
                default:
                    scheduleText = context.getMessage('reports_grid_schedule_unknown'); break;
            }

            return scheduleText;
        };

        // Method to get Date and Time format
        this.getDateTimeFormat =  function(cellValue, options, rowObject) {
            return cellValue ? new Date(cellValue).toLocaleString() : "";   
        };  

        this.getValues = function() {
            var me = this;
            return {
                "title": context.getMessage('reports_grid_title'),
                "title-help": {
                    "content": context.getMessage('reports_grid_title_help'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("REPORT_DEFINITION_OVERVIEW")
                },
                "tableId":"ReportTemplate",   
                "scroll": "true",
                "height": "auto",
                "numberOfRows": 50,
                "sortorder": "asc",
                "sortname": "",
                "multiselect":true,
                "repeatItems": "false",
                "url": '/api/juniper/seci/report-management/report-templates',               
                "type": 'GET',
                "dataType": "json",
                "jsonId": "id",                           
                "ajaxOptions": {
                    headers: {                       
                        "Accept": 'application/vnd.juniper.seci.report-management.report-templates+json;version=1'
                    }
                },
              
                "jsonRoot": "report-templates.report-template",
                "jsonRecords": function(data) {
                    return data['report-templates'][RestApiConstants.TOTAL_PROPERTY];
                },
                "contextMenu": {
                    "delete": context.getMessage('generated_reports_delete'),
                    "custom":[{
                            "label":context.getMessage('reports_run_reports'),
                            "key":"runReportsEvent",
                            "scope": me,
                            "isDisabled": $.proxy(function(eventName, selectedItems) {
                                if (selectedItems.length === 1 && me.isEnableRunReport(selectedItems)) {
                                    return false;
                                }
                                return true;
                            },me)
                        },{
                            "label":context.getMessage('reports_ctxmenuitem_preview_pdf'),
                            "key":"previewPDFEvent",
                            "scope": me,
                            "isDisabled": $.proxy(function(eventName, selectedItems) {
                                if (selectedItems.length === 1) {
                                  return false;
                                }
                                return true;
                            },me)
                        },{
                            "label":context.getMessage('reports_ctxmenuitem_send_report'),
                            "key":"sendReportEvent",
                            "scope": me,
                            "isDisabled": $.proxy(function(eventName, selectedItems) {
                                if (selectedItems.length === 1) {
                                  return false;
                                }
                                return true;
                            },me)
                        },{
                            "label":context.getMessage('reports_ctxmenuitem_edit_recipients'),
                            "key":"editRecipientsEvent",
                            "scope": me,
                            "isDisabled": $.proxy(function(eventName, selectedItems) {
                                if (selectedItems.length === 1) {
                                  return false;
                                }
                                return true;
                            },me)
                        },{
                            "label":context.getMessage('reports_ctxmenuitem_edit_schedule'),
                            "key":"editScheduleEvent",
                            "scope": me,
                            "isDisabled": $.proxy(function(eventName, selectedItems) {
                                if (selectedItems.length === 1) {
                                  return false;
                                }
                                return true;
                            },me)
                        }
                        // ,{
                        //     "label":context.getMessage('reports_ctxmenuitem_upload_logo'),
                        //     "key":"uploadLogoEvent"
                        //}
                        ]
                },
                "confirmationDialog":{
                    "delete": {
                        title: context.getMessage('reports_delete_title'),
                        question: context.getMessage('reports_delete_msg')
                    }
                },
                "actionButtons":{
                    "defaultButtons":{ //overwrite default CRUD grid buttons
                        "create": {
                            "label": "Create",
                            "key": "createEvent",
                            "items": [{
                               "label":'Policy Analysis Report Definition',
                               "key":"policyAnalysisReport"
                            },{
                               "label":'Log Report Definition',
                               "key":"logReportDefinition"
                            },{
                               "label":'Bandwidth Report Definition',
                               "key":"bandwidthReportDef"
                            }]
                        }
                    },
                    "customButtons":[{
                        "button_type": true,
                        "label": context.getMessage('reports_run_reports'),
                        "key": "runReportsEvent",
                        "disabledStatus" : true,
                        "secondary": true
                    }]
                },
                "filter": {
                    searchUrl: function (value, url) {
                       return url + "/search?pattern=" + value + "&caseSensitive=false";
                    },
                    //columnFilter: true,
                    showFilter: true,
                    optionMenu: {
                        "showHideColumnsItem": {
                            "setColumnSelection": function(columnStatus) {
                                return columnStatus;
                            },
                            "updateColumnSelection": function(columnStatus) {
                                return columnStatus;
                            }
                        },
                        "customItems": []
                    }              
                },
                "columns": [{
                    "id": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage('reports_grid_column_name'),
                    "width": 120
                }, {
                    "index": "description",
                    "name": "description",
                    "label": context.getMessage('reports_grid_column_description'),
                    "width": 220
                }, {
                    "index": "report-content-type",
                    "name": "report-content-type",
                    "label": context.getMessage('reports_grid_column_type'),
                    "width": 80,
                }, {
                    "index": "sections.section",
                    "name": "sections.section",
                    "label": context.getMessage('reports_grid_column_content'),
                    "formatter": this.getReportContent,
                    "width": 220,
                    "sortable": false
                }, {
                    "index": "scheduler.schedule-type",
                    "name": "scheduler.schedule-type",
                    "label": context.getMessage('reports_grid_column_schedule'),
                    "formatter": this.getScheduleText,
                    "width": 80,
                    "sortable": false
                }, {
                    "index": "additional-emails",
                    "name": "additional-emails",
                    "label": context.getMessage('reports_grid_column_recipients'),                                    
                    "width": 150
                },  {
                    "index": "last-generated-time",
                    "name": "last-generated-time",
                    "label": context.getMessage('reports_grid_column_last_generated'),
                    "formatter": this.getDateTimeFormat,                                
                    "width": 150
                },  {
                    "index": "job-id",
                    "name": "job-id",
                    "label": context.getMessage('reports_grid_column_job_id'),                                   
                    "width": 80,
                    "sortable": false
                }, {
                    "index": "domain-id",
                    "name": "domain-id",
                    "hidden":true,
                    "label": "",
                }]
            }
        } 
    };
    _.extend(Configuration.prototype, ReportsUtilMixIn);
    return Configuration;
});
