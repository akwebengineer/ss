/**
 * A module that builds a ToggleButton React component using the ToggleButton widget
 * The configuration is included as a part of the ToggleButton element properties and the container is the same where the element is added
 *
 * @module ToggleButtonWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/toggleButton/toggleButtonWidget'
], function (React, ReactDOM, PropTypes, ToggleButtonWidget) {

    class ToggleButton extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.toggleButtonWidget = new ToggleButtonWidget({
                ...this.props,
                container: this.el
            }).build();
            this.bindEvents();
        }

        bindEvents() {
            this.$el = $(this.el);
            if (this.props.onChange) {
                this.$el.bind("slipstreamToggleButton:onChange", (e, data) => {
                    this.props.onChange(e, data);
                });
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.on !== prevProps.on) {
                this.toggleButtonWidget.setValue(this.props.on);
            }
            if (this.props.disabled !== prevProps.disabled) {
                if (this.props.disabled) {
                    this.toggleButtonWidget.disable();
                } else {
                    this.toggleButtonWidget.enable();
                }
            }
        }

        componentWillUnmount() {
            this.toggleButtonWidget.destroy();
        }

        render() {
            return (
                <div className="toggle-button-component"
                     ref={el => this.el = el}>
                </div>
            );
        }

    }

    ToggleButton.propTypes = {
        onChange: PropTypes.func,
        on: PropTypes.bool,
        disabled: PropTypes.bool
    };

    return ToggleButton;

});