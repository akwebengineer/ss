/**
 * A configuration object with the parameters required to build 
 * a grid for Schedulers
 *
 * @module schedulerGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {
        var DELIMITER = "\r\n",
            DASH = " - ",
            EQUALMARK = " = ";

        var schedulesFormatter = function(value) {
            var data = [];
            if (!_.isEmpty(value) && _.isArray(value.schedule)) {
                for (var i = 0, len = value.schedule.length; i < len; i++) {
                    var item = value.schedule[i];
                    if (item["day"] == "DAILY") { //
                        data = [];
                        break;
                    }
                    if (item["all-day"]) {
                        data.push(item.day + DASH + context.getMessage("scheduler_day_option_allday"));
                    } else if (item["exclude"]) {
                        data.push(item.day + DASH + context.getMessage("scheduler_day_option_excluded"));
                    } else {
                        var str = item.day + DASH + DELIMITER;
                        if (item["start-time1"]) {
                            str += context.getMessage("scheduler_start_time1") + EQUALMARK + item["start-time1"];
                            str += DELIMITER + context.getMessage("scheduler_stop_time1") + EQUALMARK + item["stop-time1"];
                        } 
                        if (item["start-time2"]) {
                            str += DELIMITER + context.getMessage("scheduler_start_time2") + EQUALMARK  + item["start-time2"];
                            str += DELIMITER + context.getMessage("scheduler_stop_time2") + EQUALMARK  + item["stop-time2"];
                        }
                        data.push(str);
                    }
                }
            }
            return data;
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('scheduler_grid_title'),
                "title-help": {
                    "content": context.getMessage('scheduler_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SCHEDULER_CREATING")
                },
                "tableId": "schedulers",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/scheduler-management/schedulers",
                "jsonId": "id",
                "jsonRoot": "schedulers.scheduler",
                "jsonRecords": function(data) {
                    return data.schedulers[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.scheduler-management.schedulers+json;version=2;q=0.02'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('scheduler_grid_edit'),
                    "delete": context.getMessage('scheduler_grid_delete')
                },
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name')
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "sortable": false,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "label": context.getMessage('grid_column_description')
                    },
                    {
                        "index": "start-date1",
                        "name": "start-date1",
                        "sortable": false,
                        "width": 120,
                        "label": context.getMessage('scheduler_grid_column_start_date')
                    },
                    {
                        "index": "stop-date1",
                        "name": "stop-date1",
                        "sortable": false,
                        "width": 120,
                        "label": context.getMessage('scheduler_grid_column_stop_date')
                    },
                    {
                        "index": "start-date2",
                        "name": "start-date2",
                        "sortable": false,
                        "width": 120,
                        "label": context.getMessage('scheduler_grid_column_start_date_2')
                    },
                    {
                        "index": "stop-date2",
                        "name": "stop-date2",
                        "sortable": false,
                        "width": 120,
                        "label": context.getMessage('scheduler_grid_column_stop_date_2')
                    },
                    {
                        "index": "schedules",
                        "name": "schedules",
                        "sortable": false,
                        "width": 180,
                        "label": context.getMessage('scheduler_grid_column_schedules'),
                        "collapseContent": {
                            formatData: schedulesFormatter
                        }
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain')
                    }
                ]
            }
        }
    };

    return Configuration;
});
