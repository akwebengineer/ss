/**
 * A view that uses the lineChartWidget to produce a sample line chart
 * This example shows a line chart with plot lines
 *
 * @module Application Test Line Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/lineChart/lineChartWidget'
], function(Backbone, LineChartWidget){
    var LineChartView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            var lineChartElement = this.$el;

            var options = {
                xAxisTitle: '',
                yAxisTitle: 'Alarm Count',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                maxLabelSize: 10,

                // Draw two plot lines on the chart
                plotLines: [{
                    id: 'plotline-1',
                    value: 25, //value where the plotLine will be drawn
                    color: '#FF3344', //color of the plotLine
                    dashStyle: 'longdash', //style of the plotLine dash, shortdash, longdash
                    width: 1, //width of the plotLine
                    label: {
                        style: { //custom label style
                            color: '#999999',
                            fontFamily: 'Arial',
                            fontSize: '10px'
                        },
                        align: 'left', //label alignment
                        x: 0, //label x position
                        y: -5, //label y position
                        text: 'Plot line 1' //label text of the plotLine
                    }
                }, {
                    id: 'plotline-2',
                    value: 2,
                    color: '#0FC5CE',
                    dashStyle: 'longdash',
                    width: 1,
                    label: {
                        style: { //custom label style
                            color: '#999999',
                            fontFamily: 'Arial',
                            fontSize: '10px'
                        },
                        align: 'center', //label alignment
                        text: 'Plot line 2' //label text of the plotLine
                    }
                }],

                // Override default colors array
                colors: ['#C45AEC', '#0099FF', '#5A5AED'],

                //line chart data
                lines: [{
                    name: 'Device 1',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    lineWidth: 3.5
                }, {
                    name: 'Device 2',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
                    lineWidth: 3.5
                }, {
                    name: 'Device 3',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
                    lineWidth: 3.5
                }]

            };

            var conf = {
                container: lineChartElement,
                options: options
            }

            var lineChartWidgetObj = new LineChartWidget(conf);
            lineChartWidgetObj.build();

            return this;
        }

    });

    return LineChartView;
});