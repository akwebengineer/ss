/**
 * A view that uses the donutChartWidget to produce a sample donut chart
 * This example shows a donut chart displaying Threat Counts
 *
 * @module Application Test Threat Count Donut Chart View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/donutChart/donutChartWidget',
    'text!widgets/donutChart/tests/templates/donutChartExample.html'
], function(Backbone, render_template,DonutChartWidget,example){
    var DonutChartView = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },

        render: function () {
            var donutChartElement = this.$el.find("#donutchart-threat-count");

            var options = {
                donut: {
                    name: "Threat Count",
                    data: [
                        ['Critical', 4440],
                        ['High', 3000],
                        ['Major', 2000],
                        ['Minor', 1700],
                        ['Low', 300]
                    ],
                    showInLegend: true
                },
                maxLegendLabelSize: 20,
                showPercentInLegend: true,
                actionEvents: {
                    donutClickEvent: {
                            "handler": [function(e, data) {
                            console.log('Series Name: ' + data.seriesName + ', Category: ' + data.category + ', Value: ' + data.value);
                        }]
                    }
                },

                // Uncomment following line to override widget colors array
                colors: ['#b72841', '#ff3344', '#ff9a00', '#fec240', '#ffe96b']
            };

            var conf = {
                container: donutChartElement,
                options: options
            }
            
            var donutChartWidgetObj = new DonutChartWidget(conf);
            donutChartWidgetObj.build();

            this.$el.find('#updateButton').click (function() {
                var newData = [
                        ['Critical', 5440],
                        ['Major', 3000],
                        ['Minor', 2000],
                        ['Warning', 1700],
                        ['Info', 300]
                    ];
                donutChartWidgetObj.update(newData);
            });

            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        }

    });

    return DonutChartView;
});