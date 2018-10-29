/**
 * Time Range Widget
 *
 * @module TimeRange
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'jquery',
    'highcharts',
    'text!widgets/timeRange/templates/timeRange.html',
    'text!widgets/timeRange/templates/timeStamp.html',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'lib/dateFormatter/dateFormatter'
], /** @ TimeRange */ function ($, highcharts, TimeRangeTemplate, timeStampTemplate, render_template, i18n, dateFormatter) {

    /**
     * TimeRangeWidget constructor
     *
     * @constructor
     * @class TimeRangeWidget
     *
     * @param {Object} conf - Time Range's configuration object
     * container - id of the Time Range div
     * options - object containing chart options
     *
     * where options can contain one or more of the following:
     *
     * data - array of data points for the lines that need to be shown in this chart
     *     data can be given in following ways:
     *     1. An array of objects, each object having a name key, color key and a points key.
     *        The name is a string value and points is an array of arrays representing each point on the chart.
     *        The color is the color to be used for the timeline.
     *        In the data value, each point's x value represents the epoch 
     *        time-stamp (https://en.wikipedia.org/wiki/Unix_time), 
     *        the y value represents the value you want to display,
     *        marker.symbol is configured as 'url(<url_name>)' where <url_name> is a link 
     *        to the marker symbol you want to be used at that point. Ignore setting it
     *        if you want the default symbol set.
     *        
     *        Note: ensure your list is sorted in ascending order of x values (timestamp)
     *              in case you are setting a threshold, so excessive processing isn't done
     *              in the browser for the threhold line
     * 
     *        Eg. data: [{
     *                      name: 'MSFT',
     *                      color: '#78bb4c',
     *                      points: [[1147651200000,23.15],{x: 1147737600000, y: 23.01, marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}]},[1147824000000,22.73],[1147910400000,22.83],[1147996800000,22.56],[1148256000000,22.88],[1148342400000,22.79],[1148428800000,23.5],[1148515200000,23.74],[1148601600000,23.72],[1148947200000,23.15],[1149033600000,22.65],[1149120000000,22.82],[1149206400000,22.76],[1149465600000,22.5],[1149552000000,22.13],[1149638400000,22.04],[1149724800000,22.11],[1149811200000,21.92],[1150070400000,21.71],[1150156800000,21.51],[1150243200000,21.88],[1150329600000,22.07],[1150416000000,22.1],[1150675200000,22.55],[1150761600000,22.56],[1150848000000,23.08],[1150934400000,22.88],[1151020800000,22.5],[1151280000000,22.82],[1151366400000,22.86],[1151452800000,23.16],[1151539200000,23.47],[1151625600000,23.3],[1151884800000,23.7],[1152057600000,23.35],[1152144000000,23.48],[1152230400000,23.3],[1152489600000,23.5],[1152576000000,23.1]]
     *                   },
     *                   {
     *                      name: 'AAPL',
     *                      color: '#ec1c24',
     *                      points: [[1147651200000,67.79],[1147737600000,64.98],[1147824000000,65.26],[1147910400000,63.18],[1147996800000,64.51],[1148256000000,63.38],[1148342400000,63.15],[1148428800000,63.34],[1148515200000,64.33],[1148601600000,63.55],[1148947200000,61.22],[1149033600000,59.77],[1149120000000,62.17],[1149206400000,61.66],[1149465600000,60],[1149552000000,59.72],[1149638400000,58.56],[1149724800000,60.76],[1149811200000,59.24],[1150070400000,57],[1150156800000,58.33],[1150243200000,57.61],[1150329600000,59.38],[1150416000000,57.56],[1150675200000,57.2],[1150761600000,57.47],[1150848000000,57.86],[1150934400000,59.58],[1151020800000,58.83],[1151280000000,58.99],[1151366400000,57.43],[1151452800000,56.02],[1151539200000,58.97],[1151625600000,57.27],[1151884800000,57.95],[1152057600000,57],[1152144000000,55.77],[1152230400000,55.4],[1152489600000,55],[1152576000000,55.65]]
     *                   }]
     * @return {Object} instance of time range object
     */

    var TimeRangeWidget = function (conf) {

        var $chartContainer = $(conf.container),
            options = conf.options,
            chartObj =  { //default settings
                            'type': 'areaspline',
                            'height': {
                                'chart': 88,
                                'timeRangeSelector': 65
                            },
                            'colors': {
                                'lineColor': '#05a4ff',
                                'fillColor': 'rgba(5, 164, 255, 0.1)',
                                'maskFill':  'rgba(5, 164, 255, 0.2)',
                                'barColor': '#ff5c69'
                            }
                        },
            yAxisObj = {    'enabled': true,
                            'title': undefined,
                            'tickInterval': undefined,
                            'min': undefined,
                            'max': undefined
                        },
            showYAxis = true, //enable yAxis by default, if app side did not configure it
            timeRangeSelector,
            $timeRangeSelector;

            var labelStyle = {
                fontFamily: 'ArialMT',
                color: '#999999'
            };

            var titleStyle = {
                fontFamily: 'Helvetica',
                color: '#999999'
            };

        if (options.yAxis) {
            if ((options.yAxis.enabled !== undefined) && (_.isBoolean(options.yAxis.enabled))) {
                showYAxis = options.yAxis.enabled;
            }
        }

        (showYAxis) ? (_.extend(yAxisObj, options.yAxis)) : (_.extend(yAxisObj, {'enabled': false}));

        if (options) {
            _.extend(chartObj, options);
        }

        /**
         * Build the time range
         *
         * @return {Object} this TimeRangeWidget object
         */
        this.build = function () {
            var self = this, 
                t = null,
                width = ($chartContainer.width())? $chartContainer.width(): 800,
                isBarType = (chartObj.type === 'bar') ? true : false;

            timeRangeSelector = render_template(TimeRangeTemplate);

            $timeRangeSelector = $(timeRangeSelector);

            // append the container to the parent before the chart is rendered so that the width is inherited from the parent.
            $chartContainer.empty().append($timeRangeSelector);

            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            $timeRangeSelector.highcharts('StockChart', {
                chart: {
                    height: chartObj.height.chart
                },

                rangeSelector: {
                    enabled: false
                },

                yAxis: {
                    height: 0,
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0
                },

                xAxis: {
                    labels: {
                        enabled: false
                    },
                    lineWidth: 0,
                    tickLength: 0,
                    events: {
                        afterSetExtremes: function (event) {
                            var min = this.min,
                                max = this.max;
                            /*
                            if (typeof t === "number") { 
                                clearTimeout(t); 
                            } 
                            t = setTimeout(function(){                                     
                                var minTime = new Date(min),
                                    maxTime = new Date(max);

                                $chartContainer.find('.timestamp').html(minTime  + ' - ' + maxTime);
                                console.log({min: min, max: max});
                                $timeRangeSelector.trigger('afterSetTimeRange', {min: min, max: max}); 

                            }, 300);*/

                            setTimeStamp(min, max);

                            console.log({min: min, max: max});
                            //if DOMEvent exists then trigger the event only in case of mouse up
                            if(event.DOMEvent && event.DOMEvent.type !== "mouseup"){
                                return;
                            }
                            $timeRangeSelector.trigger('afterSetTimeRange', {min: min, max: max}); 
                        }
                    }
                },
                
                credits: {
                    enabled: false
                },
                
                scrollbar : {
                    enabled : false
                },

                series: createSeries(options),

                navigator: {
                    maskFill: chartObj.colors.maskFill,
                    outlineColor: '#CCC',
                    height: chartObj.height.timeRangeSelector,
                    series: {
                        type: chartObj.type,
                        lineWidth: 1.5,
                        lineColor: chartObj.colors.lineColor,
                        fillColor: chartObj.colors.fillColor,
                        maxPointWidth: 12,
                        color: chartObj.colors.barColor
                    },
                    handles: {
                        backgroundColor: '#FFF',
                        borderColor: '#999'
                    },
                    xAxis: {
                        lineWidth: 1,
                        lineColor: '#CCC',
                        labels: {
                            x: -16,
                            y: 15,
                            style: labelStyle
                        },
                        ordinal: isBarType ? false : true
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        startOnTick: false,
                        endOnTick: false,
                        minPadding: 0.1,
                        maxPadding: 0.1,
                        labels: {
                            enabled: (showYAxis) ? true : false,
                            style: labelStyle
                        },
                        title: {
                            text: yAxisObj.title,
                            style: titleStyle
                        },
                        tickWidth: (showYAxis) ? 1 : 0,
                        tickInterval: yAxisObj.tickInterval,
                        lineWidth: (showYAxis) ? 1 : 0,
                        min: yAxisObj.min,
                        max: yAxisObj.max,
                    }
                }
            });

            var extremes = this.getTimeRange();
            setTimeStamp(extremes.min, extremes.max);

            $chartContainer.find('.timeRange').on('afterSetTimeRange', options.afterSetTimeRange);

            return this;
        };

        /**
         * Sets the time range for the timestamp container
         * @inner
         */
        var setTimeStamp = function (min, max) {
            var minTime = dateFormatter.format(new Date(min), {format: "short"}),
                maxTime = dateFormatter.format(new Date(max), {format: "short"}),
                timezone = dateFormatter.format(new Date(max), {format: "long"});

            $chartContainer.find('.timestamp').html(render_template(timeStampTemplate, {
                "min": minTime,
                "separator": ' to ',
                "max": maxTime,
                "timezone": ',' +timezone.substring(maxTime.length + 1)
            }));
        };

        var createSeries = function (options) {
            var series = [];

            for (var ii = 0; ii < options.data.length; ii++) {
                series.push({
                    data: options.data[ii].points,
                    enableMouseTracking: false,
                    color: options.data[ii].color,
                    name: options.data[ii].name
                });
            }

            return series;
        };

        /**
         * Remove time range 
         *
         * @return {Object} this TimeRangeWidget object
         */
        this.destroy = function () {
            if (this.$chartElement) {
                var highChart = $timeRangeSelector.highcharts();
                if (highChart) {
                    highChart.destroy();
                }
            }

            return this;
        };

        /**
         * Add new data series into the time range widget
         */
        this.addSeries = function (options) { 

            var highChart = $timeRangeSelector.highcharts();

            _.extend(options, {xAxis: 1, yAxis: 1, enableMouseTracking: false});
            
            if (highChart) {
                highChart.addSeries(options);
            }

        };

        /**
         * Remove the existing data series from the time range widget
         *
         * @param String: pass the name of data series that you want to remove
         */
        this.removeSeries = function (name) { 

            var highChart = $timeRangeSelector.highcharts();
            if (highChart) {
                var seriesLength = highChart.series.length;
                for(var i = seriesLength - 1; i > -1; i--)
                {
                    if(highChart.series[i].name === name)
                        highChart.series[i].remove();
                }
            }

        };

        /**
         * Get the time range from the time range widget
         *
         * @return {Object} this includes min and max time range
         */
        this.getTimeRange= function () { 

            var highChart = $timeRangeSelector.highcharts();
            if (highChart) {
                return highChart.xAxis[0].getExtremes();
            }
            return;
        };

        /**
         * Set the time range in the time range widget 
         *
         * @param Millionseconds: pass max and min million seconds that you want to display
         */
        this.setTimeRange = function (min, max) { 

            var highChart = $timeRangeSelector.highcharts();
            if (highChart) {
                highChart.xAxis[0].setExtremes(min, max);
            }

        };
    };

    return TimeRangeWidget;
});