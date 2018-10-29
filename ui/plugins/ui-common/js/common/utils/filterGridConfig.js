/**
 * A Filters Grid Config for Log Report Definition
 *
 * @module LogReportsDefinition
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    "../restApiConstants.js",
    "./filterUtil.js"], function (RestApiConstants, FilterUtil) {

    var Configuration = function(context) {
        var filterUtil = new FilterUtil();
        // Get the time span
        this.getTimeSpanString = function(cellValue, options, rowObject){
            returnVal = cellValue;
            if (cellValue != null) {
                var duration_unit = rowObject['time-unit'],
                    duration = rowObject['duration'],
                    timePeriod =  filterUtil.millisToDaysHoursMinutes(duration);
                returnVal =  "Last " + timePeriod;
            }
            return returnVal;
        }
        //
        this.addToolTip = function (cellvalue, options, rowObject){
            return '<span class="cellLink tooltip" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</span>';
        };
        //
        this.formatFilterString = function(cellValue, options, rowObject){
            var humanReadableString = filterUtil.formatFilterStringToHumanReadableString(cellValue, context);
            return "<div class='tooltip' title='" + humanReadableString + "' data-raw-filter-string='" + cellValue + "'>" + humanReadableString + "</div>";
        };
        //
        this.unFormatFilterString = function(cellvalue, options, rowObject){
            return $($(rowObject).html()).data("raw-filter-string");
        };
        //        
        this.formatAggregation = function(cellValue, options, rowObject){
            return "<div data-raw-aggregation='" + cellValue + "'>" + context.getMessage(filterUtil.getUIKey(cellValue)) + "</div>";
        };
        //
        this.unFormatAggregation = function(cellvalue, options, rowObject){
            return $($(rowObject).html()).data("raw-aggregation");
        };
        //
        this.getValues = function(isSingleSelect){
            var me=this,
                isSingleSelect = isSingleSelect === undefined ? true : false;
            return{
                "tableId":"saved_filters_grid_list",
                "scroll": "true",
                "url": '/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true',
                "type": 'GET',
                "numberOfRows":50,
                "singleselect": isSingleSelect,
                "multiselect": !isSingleSelect,
                "contextMenu": {},//dont remove this
                "onSelectAll": false,
                "sorting": [
                    {
                    "column": "filter-name",
                    "order": "asc"
                    }
                ],
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.seci.filter-management.event-filter-refs+json;version=1;q=0.01'
                    },
                },
                "jsonId": "id",
                "jsonRoot": "event-filters.event-filter",
                "jsonRecords": function(data) {
                    return data['event-filters'][RestApiConstants.TOTAL_PROPERTY];
                },
                "filter": {
                    searchUrl : true
                },
                "showWidthAsPercentage": false,
                "columns": [{
                    "index": "filter-name",
                    "name": "filter-name",
                    "label": context.getMessage('filter_grid_column_name'),
                    "width": 200
                },{
                    "index": "filter-description",
                    "name": "filter-description",
                    "label": context.getMessage('filter_grid_column_description'),
                    "width": 150,
                    "sortable": false,
                    "formatter": me.addToolTip,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    }
                }, {
                    "index": "aggregation",
                    "name": "aggregation",
                    "label": context.getMessage('filter_grid_column_aggregation'),
                    "width": 150,
                    "formatter": me.formatAggregation,
                    "unformat": me.unFormatAggregation,
                }, {
                    "index": "duration",
                    "name": "duration",
                    "label": context.getMessage('filter_grid_column_time_span'),
                    "width": 150,
                    "formatter": me.getTimeSpanString,
                    "sortable": false
                }, {
                    "index": "duration",
                    "name": "duration",
                    "hidden": true
                },{
                    "index": "time-unit",
                    "name": "time-unit",
                    "hidden":true
                }, {
                    "index": "filter-string",
                    "name": "filter-string",
                    "label": context.getMessage('filter_grid_column_filter_by'),
                    "width": 200,
                    "sortable": false,
                    "formatter": this.formatFilterString,
                    "unformat": this.unFormatFilterString
                }, {
                    "index": "id",
                    "name": "id",
                    "label": "",
                    "hidden": true
                }, {
                   "index": "filter-string",
                   "name": "filter-string",
                   "label": "",
                   "hidden": true
                }]                
            }

        }
    };
    return Configuration;
});