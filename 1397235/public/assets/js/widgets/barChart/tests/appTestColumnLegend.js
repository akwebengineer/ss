/**
 * A view that uses the barChartWidget to produce a sample column chart
 * This example shows a column chart displaying legend at the bottom
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test Legend Column Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!widgets/barChart/templates/barChart.html',
    'widgets/barChart/barChartWidget'
], function (Backbone, sampleBarChartTemplate, BarChartWidget) {
    var BarChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var barChartElement = this.$el;

            var options = {
                type: 'column',
                width: 500,
                height: 300,
                title: 'Column: Displaying Legend (multi-color with tooltips)',
                xAxisTitle: 'Features',
                yAxisTitle: 'Number of Attacks',
                categories: ['DNS-1', 'DNS-2','DNS-3', 'TCP-1', 'TCP-2', 'TCP-3','LPR-1','LPR-2', 'VNC-1', 'VNC-2'],
                tooltip: ['DNS-1', 'DNS-2','DNS-3', 'TCP-1', 'TCP-2', 'TCP-3','LPR-1','LPR-2', 'VNC-1', 'VNC-2'],
                legend: [{ name: 'Label1', color: '#68eef4'},
                         { name: 'Label2', color: '#28a9f8'},
                         { name: 'Label3', color: '#26a7b4'},
                         { name: 'Label4', color: '#b5dcf9'},
                         { name: 'Label5', color: '#7460ee'}],
                data: [{ y: 90, color: '#68eef4'},
                       { y: 80, color: '#28a9f8'},
                       { y: 75, color: '#26a7b4'},
                       { y: 73, color: '#26a7b4'},
                       { y: 72, color: '#68eef4'},
                       { y: 63, color: '#7460ee'},
                       { y: 39, color: '#b5dcf9'},
                       { y: 32, color: '#26a7b4'},
                       { y: 20, color: '#7460ee'},
                       { y: 10, color: '#68eef4'}]
            };

            var conf = {
                container: barChartElement,
                options: options
            };

            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});