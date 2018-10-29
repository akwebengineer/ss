/**
 * A configuration object used to configure dashlet filters
 *
 * @module TopThroughputFilterConf
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var FilterConf = function (context) {
        var filters = [
            {
                'name': 'dashlet_previous_filter',
                'label': 'Previous',
                'values': [
                    {
                        'label': '5 mins',
                        'value': 300000
                    },
                    {
                        'label': '15 mins',
                        'value': 900000
                    },
                    {
                        'label': '30 mins',
                        'value': 1800000
                    },
                    {
                        'label': '1 hour',
                        'value': 3600000,
                        'selected': true
                    },
                    {
                        'label': '8 hours',
                        'value': 28800000
                    },
                    {
                        'label': '1 day',
                        'value': 86400000
                    },
                    {
                        'label': '4 days',
                        'value': 345600000
                    },
                    {
                        'label': '7 days',
                        'value': 604800000
                    }
                ]
            },
            {
                'name': 'dashlet_viewby_filter',
                'label': 'View By',
                'values': [
                    {
                        'label': 'Total',
                        'value': 'total'
                    },
                    {
                        'label': 'Incoming',
                        'value': 'input'
                    },
                    {
                        'label': 'Outgoing',
                        'value': 'output'
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
