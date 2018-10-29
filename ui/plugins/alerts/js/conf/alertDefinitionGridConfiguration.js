/**
 *  A configuration object with the parameters required to build 
 *  a grid for Alert Definitions
 *  
 *  @module alertDefinitions
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([ 
'../../../ui-common/js/common/restApiConstants.js',
'../../../ui-common/js/common/utils/filterUtil.js'
],
    function (RestApiConstants, FilterUtil) {

        var Configuration = function(context) {

        // Find the Time Span based on Duration unit and Duration 
        this.getDataCriteriaFilter = function(cellValue, options, rowObject) {
            this.util = new FilterUtil();
            returnVal = cellValue;
            if (cellValue != null) {

                var aggregation = cellValue['aggregation'],
                    duration = cellValue['duration'],
                    filter_string = cellValue['filter-string'],
                    objectMap = this.util.getLCKeyObjectMap(context),
                    timePeriod =  this.util.millisToDaysHoursMinutes(duration);

                returnVal = context.getMessage('alert_def_data_criteria_group_by') + objectMap[aggregation] +
                            ", "+ context.getMessage('alert_def_data_criteria_time_span') + timePeriod + ", "+
                            context.getMessage('alert_def_data_criteria_filter_by')+ filter_string;
            }
            return '<span class="cellLink tooltip" data-tooltip="'+returnVal+'" title="'+returnVal+'">'+returnVal+'</span>';
        };

        this.getStatus  = function(cellValue, options, rowObject) {
            var imgSrc = '/assets/images/',
                img = 'deny14X14.png',
                msg = 'In-Active';
            if(cellValue === true){
                msg = 'Active';
                img = "permit14X14.png";
            }
            return '<span class="cellLink tooltip" data-tooltip="'+msg+'" title="'+msg+'"><img src="'+imgSrc+img+'" /></span>';
        };

        var getApplicationHelp = function () {//sample data for testing purposes
            var filterHelp = "Specify data criteria that has been selected for alert definition. ";
            return filterHelp;
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('alert_def_ilp_title'),
                "title-help": {
                    "content": context.getMessage('alert_def_ilp_tooltip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("ALERT_ALARM_DEFINITION_CREATING")
                },
                "tableId":"alert-definitions",   
                "scroll": "true",
                "height": 'auto',
                "numberOfRows":50,
                "multiselect":true,    
                "url": '/api/juniper/seci/alertdefinition-management/alert-definitions',
                "type": 'GET',
                "dataType": "json",
                "jsonId": "id",                           
                "ajaxOptions": {
                    headers: {                       
                        "Accept": 'application/vnd.juniper.seci.alertdefinition-management.alert-definitions+json;version=1'
                    }
                },
                "jsonRoot": "alert-definitions.alert-definition",
                "jsonRecords": function(data) {
                    return data['alert-definitions'][RestApiConstants.TOTAL_PROPERTY];
                },
                "sorting": [
                    {
                    "column": "created-time",
                    "order": "desc"
                    }
                ],
                "contextMenu": {
                    "edit": context.getMessage('alert_def_grid_edit'),
                    "delete": context.getMessage('alert_def_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('alerts_delete_title'),
                        question: context.getMessage('alert_def_delete_msg')
                    }
                },               
                "filter": {
                    searchUrl: function (value, url){
                       return url + "/search?pattern=" + value + "&caseSensitive=false";  
                    }
                },                   
                "columns": [{
                    "id": "id",
                    "name": "id",
                    "index": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage('alerts_grid_column_name'),
                    "width": 250
                }, {
                    "index": "description",
                    "name": "description",
                    "label": context.getMessage('alerts_grid_column_description'),
                    "width": 250
                }, {
                    "index": "alertcriteria",
                    "name": "alertcriteria",
                    "label": context.getMessage('alert_def_grid_column_filter'),
                    "formatter": this.getDataCriteriaFilter,
                    "sortable": false,
                    "width": 300,
                    "header-help": {
                        "content": getApplicationHelp,
                       // "ua-help-text": "More..",
                        "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                    }
                }, {
                    "index": "additional-emails",
                    "name": "additional-emails",
                    "label": context.getMessage('alert_def_grid_column_recipients'),
                    "width": 250
                }, {
                    "index": "status",
                    "name": "status",
                    "label": context.getMessage('alert_def_grid_column_active'),
                    "formatter": this.getStatus,
                    "width": 80
                }, {
                    "index": "severity",
                    "name": "severity",
                    "label": context.getMessage('alert_def_grid_column_alert_type'),
                    formatter:function(rawValue){
                        return 'Event-based'; 
                    },                   
                    "width": 120
                }, {
                    "index": "domain-id",
                    "name": "domain-id",
                    "label": "domain id hidden",
                    "hidden":true,
                    "width":10
                }]
            }
        } 
    };   
        
    return Configuration;
});
