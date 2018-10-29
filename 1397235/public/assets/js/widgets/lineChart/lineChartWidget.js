/**
 * Line Chart Widget
 *
 * @module LineChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'jquery',
    'highcharts',
    'text!widgets/lineChart/templates/lineChart.html',
    'text!widgets/lineChart/templates/lineLegendLabel.html',
    'widgets/baseWidget',
    'lib/template_renderer/template_renderer'

], /** @lends LineChart */ function ($, highcharts, LineChartTemplate, LegendLabelTemplate, BaseWidget, render_template) {

	var LineChartWidget = function (conf) {

        BaseWidget.call(this, {
            "events":conf.options.actionEvents
        })

		var $chartContainer = $(conf.container),
			chart = conf.options,
			total = 0,
			series = [],
			showLegend = true,
			legendPosition = 'right',
			legendAlign = 'middle',
			legendLayout = 'vertical',
			showMarkers = false,
			markerSymbol = 'circle';

        var self = this;

		// Set default chart width and height to fit inside a double dashlet
		// This can be overridden by setting the div width and height
        var chartWidth = ($chartContainer.width() > 0) ? $chartContainer.width() : 818;
        var chartHeight = ($chartContainer.height() > 0) ? $chartContainer.height() : 223;

        if (chart) {

            series.push(chart);

            // if colors array is not provided, set it to a default colors array
            if (chart.colors ==  undefined) {
                chart.colors = ['#bf8bf4', '#3ea178', '#7ace4c', '#4025f3', '#90c4f7', '#68eef4', '#33ccff', '#11a0f8', '#bc49d8', '#0097a7'];
            }

            // display the legend by default
            if (chart.legend) {
                if (chart.legend.enabled != undefined) {
                    showLegend = chart.legend.enabled;
                }
                // only 2 legend positions are allowed - 'bottom' or 'right' (dafault is 'right')
                if (chart.legend.position != undefined) {
                    switch (chart.legend.position) {
                        case 'bottom': {
                            legendPosition = 'center';
                            legendAlign = 'bottom';
                            legendLayout = 'horizontal';
                            break;
                        }
                        default: {
                            legendPosition = 'right';
                            legendAlign = 'middle';
                            legendLayout = 'vertical';
                        }
                    }
                    legendPostion = (chart.legend.position == 'bottom') ? 'bottom' : 'right';
                }
            }

            // hide the markers by default
            if (chart.markers) {
                if (chart.markers.enabled != undefined) {
                    showMarkers = chart.markers.enabled;
                }
                // override 'circle' marker symbol
                if (chart.markers.multiple == true) {
                    markerSymbol = undefined;
	            }
            }
        }

		/**
         * Build the line chart
         *
         * @return {Object} this Line object
         */
        this.build = function () {
            this.$chartElement = $(render_template(LineChartTemplate));

            var truncateLegendLabel = function () {
                var label = this.name,
                    maxLabelSize = chart.maxLabelSize;
                    formattedLabel = label.length > (maxLabelSize) ? label.substring(0, maxLabelSize) + '...' : label;

                var formattedDiv = render_template(LegendLabelTemplate, { label: label,
                                                                     formattedLabel: formattedLabel });
                return formattedDiv;
            };

            // Override the default symbols in the line chart legend
            // Instead of showing different symbols for each series, show rectangles in the legend
            Highcharts.seriesTypes.line.prototype.drawLegendSymbol = Highcharts.seriesTypes.area.prototype.drawLegendSymbol;

            this.$chartElement.highcharts({

                chart: {
                    width: chartWidth,
                    height: chartHeight
                },

		        title: {
		            text: chart.title
		        },

		        xAxis: {
		            title: {
		                text: chart.xAxisTitle
		            },
                    tickLength: 0,
		            categories: chart.categories
		        },
		        yAxis: {
		            title: {
		                text: chart.yAxisTitle
		            },
		            plotLines: chart.plotLines
		        },
		        // Options for the tooltip that appears when the user hovers over a line
                tooltip: {
                    enabled: true,
                    backgroundColor: null,
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    style: {
                        padding: 0,
                        fontSize: '11px'
                    },
                    // Callback function to format the text of the tooltip
                    formatter: function () {
                        return this.series.name + ': ' + this.y;
                    }
                },
		        plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: (chart.dataLabels) ? true : false,
                            formatter: function () {
                                var axis = this.series.yAxis;
                                return axis.defaultLabelFormatter.call({
                                    axis: axis,
                                    value: this.y
                                });
                            }
                        }
                    },
			        series: {
			            marker: {
			                enabled: showMarkers,
			                symbol: markerSymbol
			            },
                        cursor: chart.actionEvents && chart.actionEvents.lineClickEvent && 'pointer',
                        point: {
                            events: {
                                click: function (e) {
                                    var data = {
                                        "seriesName": this.series.name,
                                        "category": this.category,
                                        "value": this.y
                                    };
                                    if (chart.actionEvents && chart.actionEvents.lineClickEvent) {
                                        self._invokeHandlers("lineClickEvent", e, data);
                                    }
                                }
                            }
                        },
			        }
			    },
		        legend: {
                    enabled: showLegend,
		            align: legendPosition,
		            verticalAlign: legendAlign,
		            layout: legendLayout,
		            itemStyle: {
                        fontWeight: 'normal'
                    },
		            useHTML: true,
		            labelFormatter: truncateLegendLabel,
		            borderWidth: 0,
		            symbolHeight: 8,
		            symbolWidth: 8,
		            symbolRadius: 4
		        },
		        // Highchart by default puts a credits label on the chart - disable it
                credits: {
                    enabled: false
                },
                colors: chart.colors,
                series: chart.lines

		    }, function (chart) { // on complete

            });

            $chartContainer.empty().append(this.$chartElement);

            return this;
        };


        /**
	     * Update the line chart with new data
	     *
	     * @param {Object} new set of options
	     */
        this.update = function (options) {
	        var highChart = this.$chartElement.highcharts();
	        if (highChart) {
	            var numSeries = highChart.series.length;
	            for (var ii = 0; ii < numSeries; ii++) {
		            var series = highChart.series[ii];
		            if (options) {
		                series.setData(options.lines[ii].data);
		                highChart.redraw();
					}
				}
	        }
        };

	    /**
	     * Remove the line chart
	     *
	     * @return {Object} this LineChartWidget object
	     */
	    this.destroy = function () {
	        var highChart = this.$chartElement.highcharts();
	        highChart.destroy();
	        return this;
	    };

        LineChartWidget.prototype = Object.create(BaseWidget.prototype);
        LineChartWidget.prototype.constructor = LineChartWidget;

    };

    return LineChartWidget;
});
