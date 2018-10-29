/**
 * A module that builds a NumberStepper React component using the NumberStepper widget
 * The configuration is included as a part of the NumberStepper tag properties and the container is the same where the tag is added
 *
 * @module NumberStepper
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/numberStepper/numberStepperWidget'
], function (React, ReactDOM, PropTypes, NumberStepperWidget) {

    class NumberStepper extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            this.numberStepperWidget = new NumberStepperWidget(_.extend({
                    container: this.$el
                }, this.props
            )).build();
            this.$el.bind("slipstreamNumberStepper:onChange", (e, data) => {
                this.props.onChange(e, data);
            });
        }

        componentDidUpdate(prevProps) {
            if (this.props.value !== prevProps.value) {
                this.numberStepperWidget.setValue(this.props.value);
            }
            if (this.props.disabled !== prevProps.disabled) {
                if (this.props.disabled) {
                    this.numberStepperWidget.disable();
                } else {
                    this.numberStepperWidget.enable();
                }
            }
        }

        componentWillUnmount() {
            this.numberStepperWidget.destroy();
        }

        render() {
            return (
                <div className="number-stepper-component"
                     ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    NumberStepper.propTypes = {
        value: PropTypes.number,
        onChange: PropTypes.func,
        disabled: PropTypes.bool
    };

    return NumberStepper;

});