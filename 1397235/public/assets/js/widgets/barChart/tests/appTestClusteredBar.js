/**
 * A view that uses the barChartWidget to produce a sample bar chart
 * This example shows a clustered bar chart
 *
 * @module Application Test Clustered Bar Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
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

            // array of multiple data series
            var dataArr = [{
                            name: 'Instances with Alerts',
                            color: '#ff3333',
                            data: [3, 2, 10, 20, 7]
                        },
                        {
                            name: 'Instances',
                            color: '#47d1ff',
                            data: [4, 20, 15, 20, 10]
                        },
                        {
                            name: 'Tenants',
                            color: '#bc49d8',
                            data: [5, 32, 20, 20, 25]
                        }];

            var tooltipArr = [{
                                name: 'Profile: 1',
                                value: ['Instances with Alerts: 3', 'Instances: 4', 'Tenants: 5']
                            },
                            {
                                name: 'Profile: 2',
                                value: ['Instances with Alerts: 2', 'Instances: 20', 'Tenants: 32']

                            },
                            {
                                name: 'Profile: 3',
                                value: ['Instances with Alerts: 10', 'Instances: 15', 'Tenants: 20']

                            },
                            {
                                name: 'Profile: 4',
                                value: ['Instances with Alerts: 20', 'Instances: 20', 'Tenants: 20']
                            },
                            {
                                name: 'Profile: 5',
                                value: ['Instances with Alerts: 7', 'Instances: 10', 'Tenants: 25']
                            }];

            var options = {
                type: 'clustered-bar',
                title: 'Clustered Bar Chart',
                xAxisTitle: 'Service Profiles',
                yAxisTitle: ' Instances',
                categories: ['Profile 1', 'Profile 2', 'Profile 3', 'Profile 4', 'Profile 5'],
                tooltip: tooltipArr,
                data: dataArr
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