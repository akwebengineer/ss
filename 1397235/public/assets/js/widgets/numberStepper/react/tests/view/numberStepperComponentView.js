/**
 * A view that uses the numberStepper component (created from the numberStepper widget) to render a number stepper using React
 *
 * @module NumberStepperComponentView
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/numberStepper/react/numberStepper'
], function (React, ReactDOM, NumberStepper) {
    var NumberStepperComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            var self = this;

            //creates a React component from the NumberStepper component so states can be handled by the user of the NumberStepper component
            class NumberStepperApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        isDisabled: false,
                        value: undefined
                    };
                    this.handleClick = this.handleClick.bind(this);
                    self.numberStepperAppInstance = this;
                }

                handleClick(e, value) {
                    self.numberStepperAppInstance.setState({value: value.updatedValue});
                    console.log(value);
                }

                render() {
                    return (
                        <NumberStepper
                            id="numbersteppper_4_r"
                            name="numbersteppper_4_r"
                            value = {this.state.value}
                            disabled={this.state.isDisabled}
                            onChange={this.handleClick}
                        />
                    );
                }
            };

            ReactDOM.render(
                <div>
                    <NumberStepper
                        id = "numberStepper_field_1_r"
                        name = "numberStepper_field_1_r"
                        placeholder = "Default Number Stepper"
                    />
                    <NumberStepper
                        id = "numberStepper_field_2_r"
                        name = "numberStepper_field_2_r"
                        min_value = {-10}
                        max_value = {10}
                        placeholder = "Number Stepper with min-max"
                    />
                    <NumberStepper
                        id = "numberStepper_field_3_r"
                        name = "numberStepper_field_3_r"
                        min_value = {-10}
                        max_value = {10}
                        disabled = {true}
                        placeholder = "Disabled Number Stepper with min-max"
                    />
                    <NumberStepperApp/>
                </div>, this.el
            );
            return this;
        };

        this.disableNumberStepperComponent = function () {
            this.numberStepperAppInstance.setState({isDisabled: true});
        };

        this.enableNumberStepperComponent = function () {
            this.numberStepperAppInstance.setState({isDisabled: false});
        };

        this.setNumberStepperComponent = function () {
            this.numberStepperAppInstance.setState({value: 6});
        };
    };

    return NumberStepperComponentView;

});