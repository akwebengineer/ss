/**
 * A configuration object used to configure dashlet filters
 *
 * @module TopAlarmsFilterConf
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var FilterConf = function (context) {
        var filters = [
            {
                'name': 'dashlet_alarms_severity_filter',
                'label': 'Severity',
                'values': [
                    // {
                    //     'label': 'All',
                    //     'value': 'all',
                    //     'selected': true
                    // },
                    {
                        'label': 'Critical',
                        'value': 4,
                        'selected' : true
                    },
                    {
                        'label': 'Major',
                        'value': 3
                    },
                    {
                        'label': 'Minor',
                        'value': 2
                    },
                    {
                        'label': 'Info',
                        'value': 1
                    }
                ]
            }
        ];
        this.getValues = function() {
            return filters;
        };
    };
    return FilterConf;
});
