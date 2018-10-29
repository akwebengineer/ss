/**
 * A module that builds a LineChart React component using the LineChart widget
 *
 * @module LineChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/lineChart/lineChartWidget'
], function (React, ReactDOM, PropTypes, LineChartWidget) {

    class LineChart extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            this.lineChartWidget = new LineChartWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();
        }

        componentDidUpdate(prevProps) {
            // Update the chart with new options
            if (this.props.options !== prevProps.options) {
                this.lineChartWidget.update(this.props.options);
            }
        }

        componentWillUnmount() {
            this.lineChartWidget.destroy();
        }

        render() {
            return (
                <div ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    LineChart.propTypes = {
        options: PropTypes.object,
    };

    return LineChart;
});