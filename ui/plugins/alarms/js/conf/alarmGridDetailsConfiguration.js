/**
 * Created by ramesha on 11/6/15.
 */

define([], function() {

    var Configuration = function(context) {
        this.formatDateObject = function(cellValue){
            return new Date(cellValue).toLocaleString();
         };
        this.getValues = function(id) {
            return {
                "tableId": "alarm-events-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "dataType": "json",
                "jsonRoot": "alarmDetail.events.events",
                "jsonId": "slipstreamGridWidgetRowId",
                "url": '/api/juniper/seci/alarms/'+id,
                "ajaxOptions": {
                     headers: {
                         "Accept": 'application/vnd.juniper.seci.alarm+json;version=1'
                     }
                             },
                "contextMenu": {
                   "quickView" : "Detail View"
                 },
                "actionButtons":{
                        "customButtons":
                             []
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('alarm_events_grid_column_name'),
                        "width": "90"
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage('alarm_events_grid_column_type'),
                        "width": 90
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('alarm_events_grid_column_description'),
                        "width": 110
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('alarm_events_grid_column_category'),
                        "width": 90
                    },
                    {
                        "index": "source",
                        "name": "source",
                        "label": context.getMessage('alarm_events_grid_column_source'),
                        "width": 100
                    },
                    {
                        "index": "timeUpdated",
                        "name": "timeUpdated",
                        "label": context.getMessage('alarm_events_grid_column_timeUpdated'),
                        "width": 90,
                        "formatter":this.formatDateObject
                    },
                    {
                        "index": "eventId",
                        "name": "eventId",
                        "label": context.getMessage('alarm_events_grid_column_eventId'),
                        "width": 150
                    }
                ]
            };
        };

        this.getEvents = function() {
            return {
                 quickViewEvent  : "showDetailsViewAction"
            };
        };
    };

    return Configuration;
});
