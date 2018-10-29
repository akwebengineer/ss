/**
 * A view that uses the timeSeriesChartWidget to produce a sample timeSeries chart
 * This example shows a timeSeries chart displaying legend at the right
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test TimeSeries Chart View
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!widgets/timeSeriesChart/templates/timeSeriesChart.html',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    './testData',
    'lib/template_renderer/template_renderer',
    'text!widgets/timeSeriesChart/tests/templates/timeSeriesChartExample.html'
], function(Backbone, sampleTimeSeriesChartTemplate, TimeSeriesChartWidget, TestData,render_template,example){
    var TimeSeriesChartView = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },

        render: function () {
            var timeSeriesChartElement = this.$el;

            var options = {
                title: 'Time Series Area Chart',
                yAxisTitle: 'yAxis-Title',
                yAxisThreshold: {
                    value: 900,
                    color: '#ff0000'
                },
                //timeRangeSelectorEnabled: false,
                presetTimeRangesEnabled: true,
                maxLegendLabelSize: 20,
                //'line', 'area', 'areaspline' are supported
                type: 'area',
                data: TestData.data,
                // time series chart events
                actionEvents: {
                    timeSeriesClickEvent: {
                            "handler": [function(e, data) {
                            console.log('Series Name: ' + data.seriesName + ', xValue: ' + data.xValue + ', yValue: ' + data.yValue);
                        }]
                    }
                }
            };

            var conf = {
                container: timeSeriesChartElement,
                options: options
            }
            
            var timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
            timeSeriesChartWidgetObj.build();        
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        }

    });

    return TimeSeriesChartView;
});
