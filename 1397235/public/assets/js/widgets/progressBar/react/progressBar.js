/**
 * A module that builds a ProgressBar React component using the ProgressBar widget
 *
 * @module ProgressBar Component
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/progressBar/progressBarWidget'
], function (React, ReactDOM, PropTypes, ProgressBarWidget) {

    class ProgressBar extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.progressBarWidget = new ProgressBarWidget(_.extend({
                    container: this.el
                }, this.props
            )).build();
        }

        componentDidUpdate(prevProps) {
            if (this.props.progress !== prevProps.progress) {
                this.progressBarWidget.setProgressBar(this.props.progress);
            }
            if (this.props.timeStamp !== prevProps.timeStamp) {
                this.progressBarWidget.setTimeRemaining(this.props.timeStamp);
            }
            if (this.props.statusText !== prevProps.statusText) {
                this.progressBarWidget.setStatusText(this.props.statusText);
            }
            if (!this.props.timeStampVisible) {
                this.progressBarWidget.hideTimeRemaining();
            }
        }

        componentWillUnmount() {
            this.progressBarWidget.destroy();
        }

        render() {
            return (
                <div className="progressBar-component"
                     ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    ProgressBar.propTypes = {
        statusText: PropTypes.string,
        progress: PropTypes.number,
        timeStamp: PropTypes.number,
        timeStampVisible: PropTypes.bool,
        hasPercentRate: PropTypes.bool
    };

    return ProgressBar;
});