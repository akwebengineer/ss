/**
 * A view that uses the barChartWidget to produce a sample column chart
 * This example shows a stacked colum chart displaying input/output
 *
 * @module Application Test Stacked Colum Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
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
            
            var options = {
                type: 'stacked-column',
                title: 'Stacked Column Chart',
                xAxisTitle: '',
                yAxisTitle: 'GB/sec',
                categories: ['10:00 pm', '', '', '', '', '', '', '', '', '', '', '', '11:00 pm', '', '', '', '', '', '', '', '', '', '', '', '12:00 am', '', '', '', '', '', '', '', '', '', '', '', '1:00 am', '', '', '', '', '', '', '', '', '', '', '2:00 am'],
                //tooltip: tooltipArr,
                data: [ {
                            name: 'Output',
                            color: '#cfe5fb',
                            y: [3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20, 3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20, 7, 3, 2, 10, 20]
                        },
                        {
                            name: 'Input',
                            color: '#7460ee',
                            y: [4, 35, 25, 20, 10, 11, 35, 25, 20, 10, 4, 35, 4, 35, 25, 20, 10, 11, 35, 25, 20, 10, 4, 35,4, 35, 25, 20, 10, 11, 35, 25, 20, 10, 4, 35, 4, 35, 25, 20, 10, 11, 35, 25, 20, 10, 4, 35]
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