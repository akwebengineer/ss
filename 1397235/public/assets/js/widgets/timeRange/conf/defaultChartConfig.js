/**
 * Default configuration file consumed by the Time Range widget
 *
 * @module DefaultChartConfig
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {
    var DefaultChartConfig = {};

    DefaultChartConfig = {
            'height': {
                'chart': 88,
                'timeRangeSelector': 65
            },
            'colors': {
                'barColor': '#ff5c69',
                'lineColor': '#05a4ff',
                'fillColor': 'rgba(5, 164, 255, 0.1)',
                'maskFill':  'rgba(5, 164, 255, 0.2)'
            }
    };
    return DefaultChartConfig;
});
