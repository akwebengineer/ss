/**
 * A view that uses the timeSeriesChartWidget to produce a sample timeSeries area spline chart
 *
 * @module Application Test Time Series Area Spline Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'text!widgets/timeSeriesChart/templates/timeSeriesChart.html',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    './testAreaSplineData',
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
                title: 'Time Series Area Spline Chart',
                yAxisTitle: 'yAxis-Title',
                maxLegendLabelSize: 20,
                //'line', 'area', 'areaspline' are supported
                type: 'areaspline',
                data: TestData.data
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