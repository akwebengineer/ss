define([
    'jquery',
    'widgets/donutChart/donutChartWidget'
], function ($, DonutChartWidget) {
    describe('DonutChartWidget- Unit tests:', function () {

        var $el = $('#test_widget'),
                containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = donut-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        var donutChartWidgetObj = null;
        var widgetObj = null;            

        describe('donutChart widget', function () {
            before(function () {

                var options = {
                    series: [{
                        name: "Test Count",
                        data: [
                            ['Critical', 400],
                            ['Major', 300],
                            ['Minor', 200],
                            ['Warning', 100],
                            ['Info', 50]
                        ],
                        showInLegend: true
                    }]
                };

                var conf = {
                    container: '#donutchart',
                    options: options
                };

                donutChartWidgetObj = new DonutChartWidget(conf);
                widgetObj = donutChartWidgetObj.build();
            });

            after(function () {
                donutChartWidgetObj.destroy();
            });

            it('should exist', function () {
                donutChartWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof donutChartWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return donutChartWidget object', function () {
                assert.equal(widgetObj, donutChartWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof donutChartWidgetObj.destroy == 'function').should.be.true;
            });

        });

        describe('should have ellipsis in the legend label when it exceeds maxLegendLabelSize', function() {
            before(function () {
                this.$donutChartContainer = createContainer();
                this.options = {
                    donut: {
                        name: "Test Count",
                        data: [
                            ['Critical', 400],
                            ['Major', 300],
                            ['Minor', 200],
                            ['Warning', 100],
                            ['Info', 50]
                        ],
                        showInLegend: true
                    },
                    maxLegendLabelSize: 3
                };

                var conf = {
                    container: this.$donutChartContainer[0],
                    options: this.options
                };

                this.donutChartWidgetObj = new DonutChartWidget(conf);
                widgetObj = this.donutChartWidgetObj.build();
            });
            after(function () {
                this.donutChartWidgetObj.destroy();
            });
            it('legend labels are displayed based on maxLegenedLabelSize', function () {
                var label = this.$donutChartContainer.find('.donutLegendLabelEllipsis')[0].outerText;
                if (label.length > this.options.maxLegendLabelSize) {
                    var last3 = label.substr(label.length - 3);
                    assert.isTrue(last3 == "...", "ellipsis exists in the legend label");
                }
            });
        });

        describe('should display percentage value in the legend label when showPercentInLegend is true', function() {
            before(function () {
                this.$donutChartContainer = createContainer();
                this.options = {
                    donut: {
                        name: "Test Count",
                        data: [
                            ['Critical', 400],
                            ['Major', 300],
                            ['Minor', 200],
                            ['Warning', 100],
                            ['Info', 50]
                        ],
                        showInLegend: true
                    },
                    showPercentInLegend: true
                };

                var conf = {
                    container: this.$donutChartContainer[0],
                    options: this.options
                };

                this.donutChartWidgetObj = new DonutChartWidget(conf);
                widgetObj = this.donutChartWidgetObj.build();
            });
            after(function () {
                this.donutChartWidgetObj.destroy();
            });
            it('percentage labels are displayed in the legend', function () {
                var label = this.$donutChartContainer.find('.donutLegendLabelEllipsis')[0].outerText;
                if (label.length) {
                    var last2 = label.substr(label.length - 2);
                    assert.isTrue(last2 == '%)', "percentage exists in the legend label");
                }
            });
        });

        describe('With actionEvents configured', function() {
            before(function () {
                this.$donutChartContainer = createContainer();
            });
            after(function () {
                this.donutChartWidgetObj.destroy();
            });

            it('function exists to fire the donutClickEvent', function () {
                this.options = {
                    donut: {
                        name: "Test Count",
                        data: [
                            ['Critical', 400],
                            ['Major', 300],
                            ['Minor', 200],
                            ['Warning', 100],
                            ['Info', 50]
                        ]
                    },
                    actionEvents: {}
                };

                var conf = {
                    container: this.$donutChartContainer[0],
                    options: this.options
                };

                conf.options.actionEvents.donutClickEvent = {
                    "handler": [function(e, data) {
                        //assert whether correct data attributes are passed
                        assert.equal(data.seriesName, conf.options.donut.name);
                        assert.equal(data.category, conf.options.donut.data[0][0]);
                        assert.equal(data.value, conf.options.donut.data[0][1]);
                    }]
                }

                this.donutChartWidgetObj = new DonutChartWidget(conf);
                this.widgetObj = this.donutChartWidgetObj.build();
                //check whether firePointEvent function exists that will fire the donutClickEvent
                (typeof this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent === 'function').should.be.true;
                //if it exists, fire the donutClickEvent for first category  data point
                this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent('click');
            });
        });

    });
});
