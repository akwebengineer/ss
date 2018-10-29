/**
 * A module that builds a Time React component using the Time widget
 *
 * @module Time
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/time/timeWidget'
], function (React, ReactDOM, PropTypes, TimeWidget) {

    class Time extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.timeWidget = new TimeWidget({
                container: this.el,
                value: this.props.value,
                label : this.props.label
            }).build();

            if (!_.isUndefined(this.props.disabled)) {
                this.timeWidget.disable(this.props.disabled);
            }

            this.bindEvents();
        }

        bindEvents() {
            this.$el = $(this.el);
            if (this.props.onChange) {
                this.$el.find(".time_text").on("slipstreamTime:onChange", (e, data) => {
                    this.props.onChange(data.value);
                });
                this.$el.find(".time_period").on("slipstreamTime:onChange", (e, data) => {
                    this.props.onChange(data.value);
                });
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.disabled !== prevProps.disabled) {
                this.timeWidget.disable(this.props.disabled);
            }

            if (this.props.value !== prevProps.value) {
                this.timeWidget.setValue(this.props.value);
            }
        }

        componentWillUnmount() {
            this.timeWidget.destroy();
        }

        render() {
            return (
                <div className="time-component"
                     ref={el => this.el = el}>
                </div>
            );
        }
    }

    Time.propTypes = {
        disabled: PropTypes.bool,
        value: PropTypes.string
    };

    return Time;
});