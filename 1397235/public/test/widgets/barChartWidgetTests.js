define([
    'jquery',
    'widgets/barChart/barChartWidget',
    'text!/test/templates/barChartWidgetTemplate.html'
], function ($, BarChartWidget, TestTemplate) {
    describe('BarChartWidget- Unit tests:', function () {

        describe('barChart widget', function () {
            var options = {
                xAxisTitle: 'xAxis-Title',
                yAxisTitle: 'yAxis-Title',
                categories: ['category-1', 'category-2', 'category-3'],
                data: [1, 2, 3],
                actionEvents: {
                    barClickEvent: function (data) {
                        console.log(data);
                    }
                }
            };

            var conf = {
                container: '#barchart',
                options: options
            };
            before(function () {
                this.barChartWidgetObj = new BarChartWidget(conf);
                this.widgetObj = this.barChartWidgetObj.build();
            });

            after(function () {
                this.barChartWidgetObj.destroy();
            });

            it('should exist', function () {
                this.barChartWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof this.barChartWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return barChartWidget object', function () {
                assert.equal(this.widgetObj, this.barChartWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof this.barChartWidgetObj.destroy == 'function').should.be.true;
            });

            it('configuration without dataLabels should return bars with no data labels', function () {
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-data-labels').length, 0);
            });
        });
            //unit tests for stacked charts config
        describe('Stacked Chart unit tests', function(){
            var options = {
                type: 'stacked-column',
                categories: ['category-1', 'category-2', 'category-3'],
                data: [ {
                    name: 'Minor',
                    color: '#F9D544',
                    y: [1, 2, 3]
                },
                    {
                        name: 'Critical',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    },
                    {
                        name: 'Major',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    }]
            };
            var conf = {
                container: '#barchart',
                options: options
            };
            before(function(){
                this.barChartWidgetObj = new BarChartWidget(conf);
                this.widgetObj = this.barChartWidgetObj.build();
            });
            after(function(){
                this.barChartWidgetObj.destroy();
            });

            //unit tests for stacked charts
            it('Stacked chart with multiple data objects should return barChartWidget object with correct number of series', function(){
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-series-group .highcharts-series').length, options.data.length);
            });

            it('Stacked chart should return barChartWidget object with correct number of legend items', function () {
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-legend').first().find('.highcharts-legend-item').length, options.data.length);
            });

            it('barChart should not show legend link', function () {
                var visibleElementDisplay = this.barChartWidgetObj.$chartElement.find('.chartControls').css("display");
                assert.equal(visibleElementDisplay, 'none', 'visibility should be hidden');
            });

        });

        describe('barChart widget basic tests', function () {
            var options = {
                xAxisTitle: 'xAxis-Title',
                yAxisTitle: 'yAxis-Title',
                categories: ['category-1', 'category-2', 'category-3'],
                data: [1, 2, 3],
                dataLabels: true,
                actionEvents: {
                    barClickEvent: function (data) {
                        console.log(data);
                    }
                }
            };

            var conf = {
                container: '#barchart',
                options: options
            };
            before(function () {
                this.barChartWidgetObj = new BarChartWidget(conf);
                this.widgetObj = this.barChartWidgetObj.build();
            });

            after(function () {
                this.barChartWidgetObj.destroy();
            });

            it('configuration with dataLabels set to true should return bars with data labels', function () {
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-data-labels').length, 1);
            });
        });

        describe('Clustered Chart unit tests', function(){
            var options = {
                type: 'clustered-bar',
                categories: ['category-1', 'category-2', 'category-3'],
                data: [ {
                        name: 'Minor',
                        color: '#F9D544',
                        data: [1, 2, 3]
                    },
                    {
                        name: 'Critical',
                        color: '#FFAD5A',
                        data: [10, 20, 30]
                    },
                    {
                        name: 'Major',
                        color: '#FFAD5A',
                        data: [10, 20, 30]
                    }]
            };
            var conf = {
                container: '#barchart',
                options: options
            };
            before(function(){
                this.barChartWidgetObj = new BarChartWidget(conf);
                this.widgetObj = this.barChartWidgetObj.build();
            });
            after(function(){
                this.barChartWidgetObj.destroy();
            });

            it('Clustered bar chart with multiple data objects should return correct number of series', function(){
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-series-group .highcharts-series').length, options.data.length);
            });

            it('Clustered bar chart should return correct number of bars', function(){
                // 3 data series * 3 categories = 9
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-series-group .highcharts-series').find("rect").length, ((options.data.length)*options.categories.length));
            });

            it('Clustered bar chart should return correct number of legend items', function () {
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-legend').first().find('.highcharts-legend-item').length, options.data.length);
            });

        });


        describe('barChart widget Legend unit tests', function(){
            var options = {
                type: 'stacked-column',
                categories: ['category-1', 'category-2', 'category-3', 'category-4', 'category-5', 'category-6'],
                data: [ {
                    name: 'Minor',
                    color: '#F9D544',
                    y: [1, 2, 3]
                },
                    {
                        name: 'Critical',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    },
                    {
                        name: 'Major',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    },
                    {
                        name: 'Minor',
                        color: '#F9D544',
                        y: [1, 2, 3]
                    },
                    {
                        name: 'Critical',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    },
                    {
                        name: 'Major',
                        color: '#FFAD5A',
                        y: [10, 20, 30]
                    }]
            };
            var conf = {
                container: '#barchart',
                options: options
            };
            before(function(){
                this.barChartWidgetObj = new BarChartWidget(conf);
                this.widgetObj = this.barChartWidgetObj.build();
            });
            after(function(){
                this.barChartWidgetObj.destroy();
            });

            it('barChart should not show any legend items', function () {
                assert.equal(this.barChartWidgetObj.$chartElement.find('.highcharts-legend').first().find('.highcharts-legend-item').length, 0);
            });

            it('barChart should show legend link', function () {
                var visibleElementDisplay = this.barChartWidgetObj.$chartElement.find('.chartControls').css("display");
                assert.notEqual(visibleElementDisplay, 'none', 'visibility should be visible');
            });
        });

        //unit tests for actionEvents config
        // describe('barChart Widget actionEvents unit tests', function(){
        //     var options = {
        //         xAxisTitle: 'xAxis-Title',
        //         yAxisTitle: 'yAxis-Title',
        //         categories: ['category-1', 'category-2', 'category-3'],
        //         data: [1, 2, 3],
        //         actionEvents:{}
        //     };
        //     //unit test for barclickevent config
        //     it('actionEvents.barClickEvent should fire incase actionevents.barClickEvent is configured', function(){
        //         options['actionEvents']['barClickEvent'] = function(data){
        //             //assert whether correct category name and category value passed via data argument is correct
        //             assert.equal(data[0], 'category-1');
        //             assert.equal(data[1], 1);
        //         };
        //         this.widgetObj = new BarChartWidget({
        //             container: '#barchartactionevents',
        //             options: options
        //         }).build();
        //         //
        //         //assert whether firePointEvent function exists that will fire the barClickEvent
        //         (typeof this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent === 'function').should.be.true;
        //         //if exists, fire the barclickevent for category-1 bar
        //         this.widgetObj.$chartElement.highcharts().series[0].data[0].firePointEvent('click');
        //         this.widgetObj.destroy();
        //     });
        // });


    });
});
