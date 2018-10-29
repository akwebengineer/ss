/**
 * A module that builds a TimeSeriesChart React component using the TimeSeriesChart widget
 *
 * @module TimeSeriesChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/timeSeriesChart/timeSeriesChartWidget'
], function (React, ReactDOM, PropTypes, TimeSeriesChartWidget) {

    class TimeSeriesChart extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            this.timeSeriesChartWidget = new TimeSeriesChartWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();
        }

       /*
        * Underlying timeSeries widget does not support update function
        * componentDidUpdate(prevProps) {
        *
        * }
        */

        componentWillUnmount() {
            this.timeSeriesChartWidget.destroy();
        }

        render() {
            return (
                <div ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    TimeSeriesChart.propTypes = {
        options: PropTypes.object,
    };

    return TimeSeriesChart;
});