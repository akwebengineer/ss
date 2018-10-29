/**
 *  A configuration object with the parameters required to build 
 *  a grid for Generated Alerts
 *  
 *  @module generatedAlerts
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
'../../../ui-common/js/common/restApiConstants.js',
'../../../ui-common/js/common/utils/filterUtil.js'
], function (RestApiConstants, FilterUtil) {

    var Configuration = function(context) {
        filterUtil =  new FilterUtil();

        // Method to get the Date and Time format
        this.getDateTimeFormat =  function(cellValue, options, rowObject) {
            return cellValue ? Slipstream.SDK.DateFormatter.format(new Date(cellValue), "llll") : ""
        };

        // Returns the formatted Description
        this.getFormattedDescription = function(cellValue, options, rowObject) {
            var returnVal = cellValue , str;
            if(cellValue != null) {
                str = cellValue;
                returnVal= str.replace(/\n/g, " ");
            }
            return '<span class="cellLink tooltip" data-tooltip="'+returnVal+'" title="'+returnVal+'">'+returnVal+'</span>';
        };

        // Returns the data which triggered the alert
        this.getTriggeredSource = function(cellvalue, options, rowObject){
            var returnValue = "", aggregation = rowObject['aggregation'], 
                aggValue = context.getMessage(filterUtil.getUIKey(aggregation)) + ":" + cellvalue[rowObject['aggregation']],
                thresholdValue = context.getMessage('alerts_grid_triggered_source_threshold') + ":" + cellvalue['Threshhold'],
                timeValue = context.getMessage('alerts_grid_triggered_source_time') + ":" + cellvalue['Time Duration'];
            returnValue = aggValue + "; " + thresholdValue + "; " + timeValue;
            return returnValue;
        };

        // Returns the Severity icons 
        this.getSeverityIcons = function(cellValue, options, rowObject) {
            var imgSrc = '/assets/images/',
                img = 'delete.png',
                msg = '';

            switch(cellValue) {
                case 1:
                    msg = 'Info';
                    img = "info18X18.png";
                    break;
                case 2:
                    msg = "Minor";
                    img = "icon_minor_alert.svg";
                    break;
                case 3:
                    msg = "Major";
                    img = "major_alert18X18.png";
                    break;
                case 4:
                    msg = "Critical";
                    img = "critical_alert18X18.png";
                    break
            }
            return '<span class="cellLink tooltip" data-tooltip="'+msg+'" title="'+msg+'"><img src="'+imgSrc+img+'" style="height: 18px; width: 18px;" /></span>';
        };
        var addToolTip = function (cellvalue, options, rowObject){
            return '<span class="cellLink tooltip" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</span>';
        };

        this.getValues = function() {

            return {
               "title":  context.getMessage('alerts_grid_title'),
                "title-help": {
                    "content": context.getMessage('alerts_grid_title_help'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("ALERT_ALARM_GENERATED_VIEWING")
                },  
                "tableId":"generated_alerts",
                "numberOfRows":50,
                "scroll": "true",
                "height": 'auto',
                "multiselect": true,
                "repeatItems": "false",  
                "url": '/api/juniper/seci/alert-management/alerts',
                "type": 'GET',
                "dataType": "json",
                "jsonId": "id", 
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.seci.alert-management.alert+json;version=1;q=0.01'
                    },
                },
                "jsonRoot": "alerts.alert",
                "jsonRecords": function(data) {
                    return data['alerts'][RestApiConstants.TOTAL_PROPERTY];
                },
                "sorting": [
                    {
                    "column": "generated-time",
                    "order": "desc"
                    }
                ],
                "contextMenu": {
                    "delete": context.getMessage('alerts_grid_delete'),
                    "custom":[{
                        "label":"Jump to Event Viewer",
                        "key":"jumpToEVFromAlerts"
                    }]
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('alerts_delete_title'),
                        question: context.getMessage('alerts_delete_msg')
                    }
                }, 
                "filter": {
                    searchUrl: function (value, url){
                       return url + "/search?pattern=" + value + "&caseSensitive=false";
                   }
                },
                "columns": 
                    [{
                        "index": "generated-time",
                        "name": "generated-time",
                        "label": context.getMessage('alerts_grid_column_time'),
                        "formatter":this.getDateTimeFormat,
                        "width": 200
                    }, {
                        "index": "definition-name",
                        "name": "definition-name",
                        "label": context.getMessage('alerts_grid_column_name'),
                        "width": 200
                    }, {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('alerts_grid_column_description'),
                        "formatter": this.getFormattedDescription, 
                        "width": 200
                    }, {
                        "index": "source",
                        "name": "source",
                        "label": context.getMessage('alerts_grid_column_source'),
                        "width": 300,
                        "sortable": false,
                        "formatter": this.getTriggeredSource
                    }, {
                        "index":"alert-type",
                        "name":"alert-type",
                        "label":context.getMessage('alerts_grid_column_alert_type'),
                        "width": 150
                    }, {
                        "index": "severity",
                        "name": "severity",
                        "label": context.getMessage('alerts_grid_column_severity'),
                        "formatter": this.getSeverityIcons,
                        "width": 100
                    }, {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('alerts_grid_column_alert_id'),
                        "width": 100
                    }, {
                        "index":"start-time",
                        "name":"start-time",
                        "label": "Start Time",
                        "width": '',
                        "hidden": true
                    }, {
                        "index":"end-time",
                        "name":"end-time",
                        "label": "End Time",
                        "width": '',
                        "hidden": true
                    }, {
                        "index":"formatted-filter",
                        "name":"formatted-filter",
                        "label": "Filter",
                        "width": '',
                        "hidden": true
                    }] 
                }
            }
        };

    return Configuration;
});
