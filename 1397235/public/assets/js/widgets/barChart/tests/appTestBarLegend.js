/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a bar chart displaying legend at the bottom
 * Legend is a box that displays name and color for items appearing on the chart
 *
 * @module Application Test Bar Chart Legend View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
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
                title: 'Bar: Displaying Legend (multi-color with tooltips)',
                width: 500,
                height: 300,
                xAxisTitle: 'Top Sources',
                yAxisTitle: 'Number of Attacks',
                maxLabelSize: 10,
                categories: ['North Korea ISP', 'China Mobile Group','Syria Telecom Group', 'Iraq Broadband', 'Columbia', 'Taipei Broadband','Romania Broadband','Link Egypt', 'Korea Internet Data Center', 'Unknown'],
                tooltip: ['North Korea', 'China', 'Syria', 'Iraq', 'Columbia', 'Taipei Broadband','Romania','Egypt', 'North Korea', 'Unknown'],
                legend: [{ name: 'Critical', color: '#b82540'},
                         { name: 'Major', color: '#ff3344'},
                         { name: 'Moderate', color: '#ffbb44'},
                         { name: 'Low', color: '#fcdf0b'},
                         { name: 'Info', color: '#7ace4c'}],
                data: [{ y: 90, color: '#b82540'},
                       { y: 80, color: '#ff3344'},
                       { y: 75, color: '#ffbb44'},
                       { y: 73, color: '#fcdf0b'},
                       { y: 72, color: '#b82540'},
                       { y: 63, color: '#7ace4c'},
                       { y: 39, color: '#7ace4c'},
                       { y: 32, color: '#fcdf0b'},
                       { y: 20, color: '#7ace4c'},
                       { y: 10, color: '#b82540'}]
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