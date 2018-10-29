/**
 * A view that uses the lineChart component (created from the lineChart widget) to render a basic lineChart using React
 *
 * @module LineChart Component View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/lineChart/react/lineChart'
], function (React, ReactDOM, LineChart) {
    var LineChartComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            var self = this;

            //creates a React component from the lineChart component so states can be handled by the user of the basic lineChart component
            class LineChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            xAxisTitle: '',
                            yAxisTitle: 'Count',
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            maxLabelSize: 10,
                            legend: {
                                enabled: true,
                                position: 'right'
                            },
                            //line chart data
                            lines: [{
                                    name: 'Device 1',
                                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                                }, {
                                    name: 'Device 2',
                                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                                }, {
                                    name: 'Device 3',
                                    data: [5.9, 6.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 2.0]
                                }, {
                                    name: 'Device 4',
                                    data: [10, 20, 23, 12, 5, 4, 11, 16, 17, 15, 14, 5]
                                }, {
                                    name: 'Long Device Name',
                                    data: [7, 7, 7, 7, 17, 7, 7, 7, 14.3, 9.0, 3.9, 2.0]
                                }, {
                                    name: 'Device 6',
                                    data: [5,5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                                }, {
                                    name: 'Device 7',
                                    data: [2, 3, 3.9, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                                }, {
                                    name: 'Device 8',
                                    data: [12, 12, 14, 14, 14, 16, 16, 16, 16, 18, 18, 18]
                                }, {
                                    name: 'Device 9',
                                    data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                                }, {
                                    name: 'Device 10',
                                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                            }],
                            // line chart events
                            actionEvents: {
                                lineClickEvent: {
                                        "handler": [function(e, data) {
                                        console.log('Series Name: ' + data.seriesName + ', Category: ' + data.category + ', Value: ' + data.value);
                                    }]
                                }
                            }
                        }
                    };
                }

                render() {
                    return (
                        <LineChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            ReactDOM.render(<LineChartApp />, this.el);

            return this;
        };
    };

    return LineChartComponentView;
});