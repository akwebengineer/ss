/**
 * A view that uses the barChart component (created from the barChart widget) to render a basic barChart using React
 *
 * @module BarChart Component View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/barChart/react/barChart'
], function (React, ReactDOM, BarChart) {
    var BarChartComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {

            //creates a React component from the barChart component so states can be handled by the user of the basic barChart component
            class BarChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            type: 'bar',
                            title: 'Bar: Top 5 Source IP Addresses',
                            xAxisTitle: 'Source IP Addresses',
                            yAxisTitle: 'Count',
                            color: '#26a7b4',
                            categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
                            tooltip: ['88,000,000', '81,000,000', '75,000,000', '73,000,000', '72,000,00'],
                            data: [88000000, 81000000, 75000000, 73000000, 7200000],
                            actionEvents: {
                                barClickEvent: function(data){
                                    console.log('category name ' + data[0] + ' category value ' + data[1]);
                                }
                            }
                        }
                    };
                }

                render() {
                    return (
                        <BarChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            ReactDOM.render(<BarChartApp />, this.el);

            return this;
        };
    };

    return BarChartComponentView;
});