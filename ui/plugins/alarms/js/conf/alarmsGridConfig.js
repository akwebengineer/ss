/**
 *  A configuration object with the parameters required to build 
 *  a grid for Alarms
 *  
 *  @module AlarmsGridConfig
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
'../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context, intent) {
        // Returns the severity
        this.getSeverity = function(cellValue, options, rowObject) {
            var returnVal = "";
            switch(cellValue){
                case 1:
                    returnVal = context.getMessage('alarms_severity_info');
                    break;
                case 2:
                    returnVal = context.getMessage('alarms_severity_minor');
                    break;
                case 3:
                    returnVal = context.getMessage('alarms_severity_major');
                    break;
                case 4:
                    returnVal = context.getMessage('alarms_severity_critical');
                    break;                    
            }
            return returnVal;
        };
        this.formatDateObject = function(cellValue){
           return new Date(cellValue).toLocaleString();
        };

        this.getValues = function() {
            var data = intent.getExtras(),
                severity = 0;
            //
            if(data['filters']){
                severity = parseInt(data['filters']['severity']) || 0
            };
            //
            var reformatUrl = function(data){
                var sortColumnName = data['sidx'],
                    sortColumnBy = data['sord'];
                //no sort applied, then default to lastUpdated(DESC)
                if(sortColumnName === ""){
                    sortColumnName = "lastUpdated";
                    sortColumnBy=  "DESC";
                }
                //
                delete data['sidx'];
                delete data['sord'];
                delete data['sortby'];
                data.sortBy = sortColumnName + "(" + sortColumnBy + ")"
                //
                if(severity > 0){
                    data.severity = severity;
                }
                //
                return data;
            };
            return {
               "title":  context.getMessage('alarms_grid_title'),
                "title-help": {
                    "content": context.getMessage('alarms_grid_title_help'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("ALERT_ALARM_VIEWING")
                },  
                "tableId":"generated_alarms",
                "numberOfRows":50,
                "scroll": "true",
                "height": 'auto',
                "sorting":{
                    "column": "lastUpdated",
                    "order": "desc"
                },
                "multiselect": true,
                "repeatItems": "false",  
                "url": '/api/juniper/seci/alarms',
                "type": 'GET',
                "dataType": "json",
                "jsonId": "alarmId", 
                "reformatUrl": reformatUrl,
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.seci.alarms+json;version=1'
                    },
                },
                "jsonRoot": "alarms.alarm",
                "jsonRecords": function(data) {
                    return data['alarms'][RestApiConstants.TOTAL_PROPERTY];
                },
                "filter": {
                    searchUrl: function (value, url){
                        var sevValue=-1;
                        switch(value.length > 0 && value[0].toLowerCase()){
                            case "info":
                                sevValue = 1;
                                break;
                            case "minor":
                                sevValue = 2;
                                break;
                            case "major":
                                sevValue = 3;
                                break;
                            case "critical":
                                sevValue = 4;
                                break;                    
                        }
                        return url + "?severity=" + sevValue;                            
                   }
                },
                "columns":
                    [{
                        "index":"alarmId",
                        "name":"alarmId",
                        "label" : context.getMessage('alarms_grid_column_id'),
                        "hidden": true
                    },{
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('alarms_grid_column_name'),
                        "width": 200
                    }, {
                        "index": "alarmDescription",
                        "name": "alarmDescription",
                        "label": context.getMessage('alarms_grid_column_desc'),
                        "width": 400
                    },
                    {
                        "index": "source",
                        "name": "source",
                        "label": context.getMessage('alarms_grid_column_device'),
                        "width": 200
                    }, {
                        "index": "severity",
                        "name": "severity",
                        "label": context.getMessage('alarms_grid_column_severity'),
                        "formatter": this.getSeverity, 
                        "width": 70,
                    }, {
                        "index": "entityId",
                        "name": "entityId",
                        "label": context.getMessage('alarms_grid_column_entity'),
                        "width": 100
                    }, {
                        "index": "lastUpdated",
                        "name": "lastUpdated",
                        "label": context.getMessage('alarms_grid_column_updated'),
                        "width": 200,
                        "formatter":this.formatDateObject
                    }] 
                }
            }
        };

    return Configuration;
});