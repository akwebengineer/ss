define([
    'jquery',
    'widgets/lineChart/lineChartWidget'
], function ($, LineChartWidget) {
    describe('LineChartWidget- Unit tests:', function () {

        var $el = $('#test_widget'),
                containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = line-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        var lineChartWidgetObj = null;
        var widgetObj = null;

        var basicLineConf = {
            xAxisTitle: '',
            yAxisTitle: 'yAxis-Title',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            // Line chart data
            lines: [{
                name: 'Device 1',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'Device 2',
                data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Device 3',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        };

        var plotLineConf = {
            plotLines: [{
                value: 10,
                color: 'green',
                width: 2,
                label: {
                    text: 'plotLine 1'
                }
            }],
            lines: [{
                name: 'Device 1',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'Device 2',
                data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Device 3',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        };

        var actionEventsConf = {
            xAxisTitle: '',
            yAxisTitle: 'Alarm Count',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            //line chart data
            lines: [{
                name: 'Critical',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Major',
                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Minor',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }],

            // line chart events
            actionEvents: {}
        };

        describe('lineChart widget', function () {
            before(function () {

                var conf = {
                    container: '#linechart',
                    options: basicLineConf
                };

                lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = lineChartWidgetObj.build();
            });

            after(function () {
                lineChartWidgetObj.destroy();
            });

            it('should exist', function () {
                lineChartWidgetObj.should.exist;
            });

            it('build() function should exist', function () {
                (typeof lineChartWidgetObj.build == 'function').should.be.true;
            });

            it('build() should return lineChartWidget object', function () {
                assert.equal(widgetObj, lineChartWidgetObj);
            });

            it('destroy() function should exist', function () {
                (typeof lineChartWidgetObj.destroy == 'function').should.be.true;
            });
        });

        describe('With blank line data', function() {
            before(function () {
                this.$lineChartContainer = createContainer();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            it('build() with blank line data should return lineChartWidget object with no series', function () {
                var options = {
                };

                var conf = {
                    container: this.$lineChartContainer[0],
                    options: options
                };

                this.lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = this.lineChartWidgetObj.build();
                assert.equal(this.$lineChartContainer.find('.highcharts-series-group .highcharts-series').length, 0);
            });
        });

        describe('With one line', function() {
            before(function () {
                this.$lineChartContainer = createContainer();

                var options = {
                    xAxisTitle: '',
                    yAxisTitle: 'yAxis-Title',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    lines: [{
                        name: 'Device 1',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
                };

                var conf = {
                    container: this.$lineChartContainer[0],
                    options: options
                };

                this.lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = this.lineChartWidgetObj.build();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            it('build() with one line object should return lineChartWidget object with one series', function () {
                assert.equal(this.$lineChartContainer.find('.highcharts-series-group .highcharts-series').length, 1);
            });

            it('configuration without dataLabels should return lines with no data labels', function () {
                assert.equal(this.$lineChartContainer.find('.highcharts-data-labels').length, 0);
            });
        });

        describe('With legend', function() {
            before(function () {
                this.$lineChartContainer = createContainer();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            it('build() with legend config should return lineChartWidget object with correct number of legends', function () {
                var legendConf = $.extend(basicLineConf, {legend: { enabled: true, position: 'bottom' }});

                var conf = {
                    container: this.$lineChartContainer[0],
                    options: legendConf
                };

                this.lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = this.lineChartWidgetObj.build();
                assert.equal(this.$lineChartContainer.find('.highcharts-legend').first().find('.highcharts-legend-item').length, 3);
            });
        });

        describe('With plotLine configuration', function() {
            before(function () {
                this.$lineChartContainer = createContainer();

                var conf = {
                    container: this.$lineChartContainer[0],
                    options: plotLineConf
                };

                this.lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = this.lineChartWidgetObj.build();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            // This version of highcharts is not allowing attachment of a className to the plotLines.
            // Therefore we have to use 'path' and 'svg' to access the plotLine attributes for writing unit tests
            // If we upgrade highcharts to the latest version, the following lines of code can be replaced by the class name 'highcharts-plot-line'
            it('should return lineChart with configured plotLine color', function () {
                var plotLineColor = this.$lineChartContainer.find('.highcharts-container').find("path")[0].getAttribute('stroke');
                assert.equal(plotLineColor, plotLineConf.plotLines[0].color);
            });
            it('should return lineChart with configured plotLine stroke width', function () {
                var strokeWidth = this.$lineChartContainer.find('.highcharts-container').find("path")[0].getAttribute('stroke-width');
                assert.equal(strokeWidth, plotLineConf.plotLines[0].width);
            });
            it('should return lineChart with configured plotLine label', function () {
                var label = this.$lineChartContainer.find('.highcharts-container').find("svg").find("text")[0].textContent;
                assert.equal(label, plotLineConf.plotLines[0].label.text);
            });
        });

        describe('With actionEvents configured', function() {
            before(function () {
                this.$lineChartContainer = createContainer();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            it('function exists to fire the lineClickEvent', function () {
                var conf = {
                    container: this.$lineChartContainer[0],
                    options: actionEventsConf
                };

                conf.options.actionEvents.lineClickEvent = {
                    "handler": [function(e, data) {
                        //assert whether correct data attributes are passed
                        assert.equal(data.seriesName, conf.options.lines[0].name);
                        assert.equal(data.category, conf.options.categories[0]);
                        assert.equal(data.value, conf.options.lines[0].data[0]);
                    }]
                }

                this.lineChartWidgetObj = new LineChartWidget(conf);
                this.widgetObj = this.lineChartWidgetObj.build();
                //check whether firePointEvent function exists that will fire the lineClickEvent
                (typeof this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent === 'function').should.be.true;
                //if it exists, fire the lineClickEvent for first category  data point
                this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent('click');
            });
        });

        describe('Data labels tests', function() {
            before(function () {
                this.$lineChartContainer = createContainer();
            });
            after(function () {
                this.lineChartWidgetObj.destroy();
            });

            it('configuration with dataLabels set to true should return lines with data labels', function () {
                var options = {
                    xAxisTitle: '',
                    yAxisTitle: 'yAxis-Title',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    dataLabels: true,
                    lines: [{
                        name: 'Device 1',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }]
                };

                var conf = {
                    container: this.$lineChartContainer[0],
                    options: options
                };

                this.lineChartWidgetObj = new LineChartWidget(conf);
                widgetObj = this.lineChartWidgetObj.build();
                assert.equal(this.$lineChartContainer.find('.highcharts-data-labels').length, 1);
            });
        });

    });
});
