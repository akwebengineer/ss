define([
    'jquery',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'widgets/timeSeriesChart/tests/testData',
    'text!/test/templates/timeSeriesChartWidgetTemplate.html'
], function ($, TimeSeriesChartWidget, TestData, TestTemplate) {
    describe('TimeSeriesChartWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
                containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = timeseries-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        var timeSeriesChartWidgetObj = null;
        var widgetObj = null;

        var testData = TestData.data;

        describe('timeSeries widget', function () {
            before(function () {
                var options = {
                    title: 'TimeSeries Chart with Legend',
                    yAxisTitle: 'yAxis-Title',
                    yAxisThreshold: {
                        value: 500,
                        color: '#ff0000'
                    },
                    data: testData
                };

                var conf = {
                    container: '#timeSeriesChart',
                    options: options
                };

                timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
                widgetObj = timeSeriesChartWidgetObj.build();
            });
            after(function () {
                timeSeriesChartWidgetObj.destroy();
            });

            it('should exist', function () {
                timeSeriesChartWidgetObj.should.exist;
            });

            it('build() function should exist', function () {
                (typeof timeSeriesChartWidgetObj.build == 'function').should.be.true;
            });

            it('build() should return timeSeriesChartWidgetObj object', function () {
                assert.equal(widgetObj, timeSeriesChartWidgetObj);
            });

            it('destroy() function should exist', function () {
                (typeof timeSeriesChartWidgetObj.destroy == 'function').should.be.true;
            });
        });

        describe('With valid chart type configured', function() {
            before(function () {
                this.$timeSeriesChartContainer = createContainer();
            });
            after(function () {
                this.timeSeriesChartWidgetObj.destroy();
            });
            it('build() with chart type set as line should return timeSeriesChartWidget object with lines', function () {
                var options = {
                    type: 'line',
                    title: 'TimeSeries Line Chart',
                    yAxisTitle: 'yAxis-Title',
                    yAxisThreshold: {
                        value: 500,
                        color: '#ff0000'
                    },
                    data: testData
                };

                var conf = {
                    container: this.$timeSeriesChartContainer[0],
                    options: options
                };

                this.timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
                widgetObj = this.timeSeriesChartWidgetObj.build();
                assert.isTrue(this.$timeSeriesChartContainer.find('.timeSeriesLine').length > 0, "time series line chart has rendered inside the container");
            });
        });

        describe('With invalid chart type configured', function() {
            before(function () {
                this.$timeSeriesChartContainer = createContainer();
            });
            after(function () {
                this.timeSeriesChartWidgetObj.destroy();
            });
            it('build() with chart set to an invalid type should return default timeSeriesChartWidget object area chart', function () {
                var options = {
                    type: 'dummy',
                    title: 'TimeSeries Chart',
                    yAxisTitle: 'yAxis-Title',
                    yAxisThreshold: {
                        value: 500,
                        color: '#ff0000'
                    },
                    data: testData
                };

                var conf = {
                    container: this.$timeSeriesChartContainer[0],
                    options: options
                };

                this.timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
                widgetObj = this.timeSeriesChartWidgetObj.build();
                assert.isTrue(this.$timeSeriesChartContainer.find('.timeSeriesArea').length > 0, "time series area chart has rendered inside the container");
            });
        });

        describe('should have ellipsis in the legend label when it exceeds maxLegendLabelSize', function() {
            before(function () {
                this.$timeSeriesChartContainer = createContainer();
                this.options = {
                    type: 'area',
                    title: 'TimeSeries Chart',
                    yAxisTitle: 'yAxis-Title',
                    yAxisThreshold: {
                        value: 500,
                        color: '#ff0000'
                    },
                    maxLegendLabelSize: 3,
                    data: testData
                };

                var conf = {
                    container: this.$timeSeriesChartContainer[0],
                    options: this.options
                };

                this.timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
                widgetObj = this.timeSeriesChartWidgetObj.build();
            });
            after(function () {
                this.timeSeriesChartWidgetObj.destroy();
            });
            it('legend labels are displayed based on maxLegenedLabelSize', function () {
                var label = this.$timeSeriesChartContainer.find('.timeSeriesLegendLabelEllipsis')[0].outerText;
                if (label.length > this.options.maxLegendLabelSize) {
                    var last3 = label.substr(label.length - 3);
                    assert.isTrue(last3 == "...", "ellipsis exists in the legend label" );
                }
            });
        });

        describe('With actionEvents configured', function() {
            before(function () {
                this.$timeSeriesChartContainer = createContainer();
            });
            after(function () {
                this.timeSeriesChartWidgetObj.destroy();
            });

            it('function exists to fire the timeSeriesClickEvent', function () {
                this.options = {
                    type: 'line',
                    data: testData,
                    actionEvents: {}
                };

                var conf = {
                    container: this.$timeSeriesChartContainer[0],
                    options: this.options
                };

                conf.options.actionEvents.timeSeriesClickEvent = {
                    "handler": [function(e, data) {
                        assert.equal(data.seriesName, conf.options.data[0].name);
                    }]
                }

                this.timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
                this.widgetObj = this.timeSeriesChartWidgetObj.build();
                //check whether firePointEvent function exists that will fire the timeSeriesClickEvent
                (typeof this.widgetObj.$chartElement.highcharts().series[0].points[0].firePointEvent === 'function').should.be.true;
                //if it exists, fire the timeSeriesClickEvent for first category  data point
                this.widgetObj.$chartElement.highcharts().series[0].points[0].firePointEvent('click');
            });
        });

    });
});
