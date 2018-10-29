/**
 * A module that builds a BarChart React component using the BarChart widget
 *
 * @module BarChart
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/barChart/barChartWidget'
], function (React, ReactDOM, PropTypes, BarChartWidget) {

    class BarChart extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            this.barChartWidget = new BarChartWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();
        }

        componentDidUpdate(prevProps) {
            // Update the chart with new options
            if (this.props.options !== prevProps.options) {
                this.barChartWidget.update(this.props.options);
            }
        }

        componentWillUnmount() {
            this.barChartWidget.destroy();
        }

        render() {
            return (
                <div ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    BarChart.propTypes = {
        options: PropTypes.object,
    };

    return BarChart;
});