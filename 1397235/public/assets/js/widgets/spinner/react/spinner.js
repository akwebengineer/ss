/**
 * A module that builds a Spinner React component using the Spinner widget
 *
 * @module SpinnerWidget
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/spinner/spinnerWidget'
], function (React, ReactDOM, PropTypes, SpinnerWidget) {

    class Spinner extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.spinnerWidget = new SpinnerWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();
        }

        componentDidUpdate(prevProps) {
            if (this.props.progress !== prevProps.progress) {
                this.spinnerWidget.setSpinnerProgress(this.props.progress);
            }
            if (this.props.timeStamp !== prevProps.timeStamp) {
                this.spinnerWidget.setTimeRemaining(this.props.timeStamp);
            }
            if (this.props.statusText !== prevProps.statusText) {
                this.spinnerWidget.setStatusText(this.props.statusText);
            }
            if (!this.props.timeStampVisible) {
                this.spinnerWidget.hideTimeRemaining();
            }
        }

        componentWillUnmount() {
            this.spinnerWidget.destroy();
        }

        render() {
            return (
                <div className="spinner-component"
                     ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    Spinner.propTypes = {
        statusText: PropTypes.string,
        progress: PropTypes.number,
        timeStamp: PropTypes.number,
        timeStampVisible: PropTypes.bool,
        hasPercentRate: PropTypes.bool
    };

    return Spinner;
});