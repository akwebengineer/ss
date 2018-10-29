/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a stacked bar chart displaying devices with most alarms
 *
 * @module Application Test Stacked Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!widgets/barChart/templates/barChart.html',
    'widgets/barChart/barChartWidget'
], function(Backbone, sampleBarChartTemplate, BarChartWidget){
    var BarChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var barChartElement = this.$el;

            var tooltipArr = [ 'Device: 192.168.1.1' + '<br>' + 'Type 1: 30' + '<br>' + 'Type 2: 4' + '<br>' +  'Type 3: 3',
                               'Device: 192.168.1.2' + '<br>' + 'Type 1: 25' + '<br>' + 'Type 2: 35' + '<br>' + 'Type 3: 2',
                               'Device: 192.168.1.3' + '<br>' + 'Type 1: 20' + '<br>' + 'Type 2: 25' + '<br>' + 'Type 3: 10',
                               'Device: 192.168.1.4' + '<br>' + 'Type 1: 20' + '<br>' + 'Type 2: 20' + '<br>' + 'Type 3: 20',
                               'Device: 192.168.1.5' + '<br>' + 'Type 1: 25' + '<br>' + 'Type 2: 10' + '<br>' + 'Type 3: 7'
                             ];
            
            var options = {
                type: 'stacked-bar',
                title: 'Stacked Bar Chart',
                xAxisTitle: 'Devices',
                yAxisTitle: ' Count',
                categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
                tooltip: tooltipArr,
                data: [ {
                            name: 'Type 3',
                            color: '#c596f5',
                            y: [3, 2, 10, 20, 7]
                        },
                        {
                            name: 'Type 2',
                            color: '#cfe5fb',
                            y: [4, 35, 25, 20, 10]
                        },
                        {
                            name: 'Type 1',
                            color: '#7460ee',
                            y: [30, 25, 20, 20, 25]
                        }
                ]
            };

            var conf = {
                container: barChartElement,
                options: options
            }
            
            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});