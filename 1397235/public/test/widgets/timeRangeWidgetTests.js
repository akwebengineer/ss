define([
    'jquery',
    'widgets/timeRange/timeRangeWidget',
    'widgets/timeRange/conf/defaultChartConfig',
], function ($, TimeRangeWidget, DefaultChartConfig) {
    describe('TimeRangeWidget- Unit tests:', function () {

        var $el = $('#test_widget'),
                containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = timerange-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        var timeRangeWidgetObj = null;
        var widgetObj = null;
        var testData = [{
                        name: 'ALL',
                        color: '#05a4ff',
                        points: [[1434649823120,374.5],[1434650823120,370.99],[1434651823120,370.02],[1434652823120,370.95],[1434653823120,375.58],[1434654823120,381.25],[1434655823120,382.99], [1434656823120,376.2],[1434657823120,371.3],[1434658823120,374.5],[1434659823120,370.99], [1434660823120,396.2], [1434661823120,346.2], [1434662823120,376.2],[1434663823120,376.2],[1434664023120,371.3],[1434664123120,374.5],[1434664223120,370.99],[1434664323120,370.02],[1434664423120,370.95],[1434664523120,375.58],[1434664723120,381.25],[1434664723120,382.99],[1434664823120,381.35],[1434664923120,371.94]]
                    }];

        describe('timeRange widget', function () {
            before(function () {
                var options = {
                    data: testData
                };

                var conf = {
                    container: '#timerange',
                    options: options
                };

                timeRangeWidgetObj = new TimeRangeWidget(conf);
                widgetObj = timeRangeWidgetObj.build();
            });
            after(function () {
                timeRangeWidgetObj.destroy();
            });

            it('should exist', function () {
                timeRangeWidgetObj.should.exist;
            });

            it('build() function should exist', function () {
                (typeof timeRangeWidgetObj.build == 'function').should.be.true;
            });

            it('build() should return timeRangeWidget object', function () {
                assert.equal(widgetObj, timeRangeWidgetObj);
            });

            it('destroy() function should exist', function () {
                (typeof timeRangeWidgetObj.destroy == 'function').should.be.true;
            });
        });

        describe('With y-axis enabled', function() {
            before(function () {
                this.$timeRangeContainer = createContainer();
            });
            after(function () {
                this.timeRangeWidgetObj.destroy();
            });
            it('build() with custom y-axis configuration should return timeRangeWidget object with y-axis title', function () {
                var options = {
                    data: testData,
                    yAxis: {
                        enabled: true,
                        title: "Count",
                        tickInterval: 400
                    }
                };

                var conf = {
                    container: this.$timeRangeContainer[0],
                    options: options
                };

                this.timeRangeWidgetObj = new TimeRangeWidget(conf);
                widgetObj = this.timeRangeWidgetObj.build();
                assert.equal(this.$timeRangeContainer.find('.highcharts-axis text').first().text(), options.yAxis.title);
            });
        });

        describe('Without y-axis', function() {
            before(function () {
                this.$timeRangeContainer = createContainer();
            });
            after(function () {
                timeRangeWidgetObj.destroy();
            });
            it('build() with y-axis disabled should return timeRangeWidget object without y-axis title', function () {
                var options = {
                    data: testData,
                    yAxis: {
                        enabled: false,
                    }
                };

                var conf = {
                    container: this.$timeRangeContainer[0],
                    options: options
                };

                timeRangeWidgetObj = new TimeRangeWidget(conf);
                widgetObj = timeRangeWidgetObj.build();
                assert.equal(this.$timeRangeContainer.find('.highcharts-axis text').first().length, 0, 'y-axis title should not be present');
            });
        });

        describe('With default configuration', function() {
            before(function () {
                this.$timeRangeContainer = createContainer();
                this.options = {
                    data: testData
                };

                var conf = {
                    container: this.$timeRangeContainer[0],
                    options: this.options
                };

                this.timeRangeWidgetObj = new TimeRangeWidget(conf);
                widgetObj = this.timeRangeWidgetObj.build();
            });
            after(function () {
                this.timeRangeWidgetObj.destroy();
            });
            it('should be an areaspline', function () {
                var $timeRange = this.$timeRangeContainer.find('.timeRange');
                var $path = $timeRange.find('g.highcharts-series path');
                assert.isTrue($path.length > 0);
            });
            it('should have default chart height', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var height = $(timeRange).find('.highcharts-container').css('height').split('px')[0];
                assert.isTrue(height == DefaultChartConfig.height.chart);
            });
            it('should have default time range selector height', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-navigator');
                var selectorHeight = $(selector)[0].childNodes[0].getAttribute('height');
                assert.isTrue(selectorHeight == DefaultChartConfig.height.timeRangeSelector);
            });
            it('should have default mask fill color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-navigator');
                var maskFill = $(selector)[0].childNodes[0].getAttribute('fill');
                assert.isTrue(maskFill == DefaultChartConfig.colors.maskFill);
            });
            it('should have default fill color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-series');
                var fillColor = $(selector)[1].childNodes[0].getAttribute('fill');
                assert.isTrue(fillColor == DefaultChartConfig.colors.fillColor);
            });
            it('should have default line color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-series');
                var lineColor = $(selector)[1].childNodes[1].getAttribute('stroke');
                assert.isTrue(lineColor == DefaultChartConfig.colors.lineColor);
            });
        });

        describe('With custom configuration', function() {
            before(function () {
                this.$timeRangeContainer = createContainer();
                this.options = {
                    data: testData,
                    height: {
                                chart: 60,
                                timeRangeSelector: 35
                            },
                    colors: {
                                lineColor: 'red',
                                fillColor: 'rgba(250, 128, 114, 0.5)',
                                maskFill:  'rgba(5, 164, 255, 0.2)'
                           }
                };

                var conf = {
                    container: this.$timeRangeContainer[0],
                    options: this.options
                };

                this.timeRangeWidgetObj = new TimeRangeWidget(conf);
                widgetObj = this.timeRangeWidgetObj.build();
            });
            after(function () {
                this.timeRangeWidgetObj.destroy();
            });
            it('should have user defined chart height', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var height = $(timeRange).find('.highcharts-container').css('height').split('px')[0];
                assert.isTrue(height == this.options.height.chart);
            });
            it('should have user defined time range selector height', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-navigator');
                var selectorHeight = $(selector)[0].childNodes[0].getAttribute('height');
                assert.isTrue(selectorHeight == this.options.height.timeRangeSelector);
            });
            it('should have user defined mask fill color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-navigator');
                var maskFill = $(selector)[0].childNodes[0].getAttribute('fill');
                assert.isTrue(maskFill == this.options.colors.maskFill);
            });
            it('should have user defined fill color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-series');
                var fillColor = $(selector)[1].childNodes[0].getAttribute('fill');
                assert.isTrue(fillColor == this.options.colors.fillColor);
            });
            it('should have user defined line color', function () {
                var timeRange = this.$timeRangeContainer.find('.timeRange')[0];
                var selector = $(timeRange).find('g.highcharts-series');
                var lineColor = $(selector)[1].childNodes[1].getAttribute('stroke');
                assert.isTrue(lineColor == this.options.colors.lineColor);
            });
        });

        describe('Bar Type With default configuration', function() {
            describe('With default configuration', function() {
                before(function () {
                    this.$timeRangeContainer = createContainer();
                    this.options = {
                        data: testData,
                        type: 'bar'
                    };

                    var conf = {
                        container: this.$timeRangeContainer[0],
                        options: this.options
                    };

                    this.timeRangeWidgetObj = new TimeRangeWidget(conf);
                    widgetObj = this.timeRangeWidgetObj.build();
                });
                after(function () {
                    this.timeRangeWidgetObj.destroy();
                });
                
                it('should be a bar', function () {
                    var $timeRange = this.$timeRangeContainer.find('.timeRange');
                    var $bar = $timeRange.find('g.highcharts-series rect');
                    assert.isTrue($bar.length > 0);
                });
                it('should have default bar fill color', function () {
                    var $timeRange = this.$timeRangeContainer.find('.timeRange');
                    var $selector = $timeRange.find('g.highcharts-series').eq(1);
                    var fillColor = $selector[0].childNodes[0].getAttribute('fill');
                    assert.isTrue(fillColor == DefaultChartConfig.colors.barColor);
                });
            });
            describe('With custom configuration', function() {
                before(function () {
                    this.$timeRangeContainer = createContainer();
                    this.options = {
                        data: testData,
                        type: 'bar',
                        colors:{
                            barColor: 'black'
                        }
                    };

                    var conf = {
                        container: this.$timeRangeContainer[0],
                        options: this.options
                    };

                    this.timeRangeWidgetObj = new TimeRangeWidget(conf);
                    widgetObj = this.timeRangeWidgetObj.build();
                });
                after(function () {
                    this.timeRangeWidgetObj.destroy();
                });
                it('should have custom bar fill color', function () {
                    var $timeRange = this.$timeRangeContainer.find('.timeRange');
                    var $selector = $timeRange.find('g.highcharts-series').eq(1);
                    var fillColor = $selector[0].childNodes[0].getAttribute('fill');
                    assert.isTrue(fillColor == this.options.colors.barColor);
                });
            });
        });
    });
});
