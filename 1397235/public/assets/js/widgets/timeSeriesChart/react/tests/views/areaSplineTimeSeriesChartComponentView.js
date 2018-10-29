/**
 * A view that uses the timeSeriesChart component (created from the timeSeriesChart widget) to render a area-spline timeSeriesChart using React
 *
 * @module TimeSeiesChart Component View
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'widgets/timeSeriesChart/tests/testAreaSplineData',
    'es6!widgets/timeSeriesChart/react/timeSeriesChart'
], function (React, ReactDOM, TestData, TimeSeriesChart) {
    var TimeSeriesChartComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {

            //creates a React component from the timeSeriesChart component so states can be handled by the user of the area-spline timeSeriesChart component
            class TimeSeriesChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            title: 'Time Series Area Spline React Component',
                            yAxisTitle: 'yAxis-Title',
                            maxLegendLabelSize: 20,
                            //'line', 'area', 'areaspline' are supported
                            type: 'areaspline',
                            data: TestData.data
                        }
                    };
                }

                render() {
                    return (
                        <TimeSeriesChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            ReactDOM.render(<TimeSeriesChartApp />, this.el);

            return this;
        };
    };

    return TimeSeriesChartComponentView;
});