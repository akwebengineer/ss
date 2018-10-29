/**
 * A view that uses the toggleButton component (created from the toggleButton widget) to render a toggle button using React
 *
 * @module ToggleButtonComponent View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/toggleButton/react/toggleButton'
], function (React, ReactDOM, ToggleButton) {
    var ToggleButtonComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            var self = this;

            //creates a React component from the ToggleButton component so states can be handled by the user of the ToggleButton component
            class ToggleButtonApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        isOn: false,
                        isDisabled: false
                    };
                    this.handleClick = this.handleClick.bind(this);
                    self.toggleButtonAppInstance = this;
                }
                handleClick(e, value) {
                    console.log(value);
                }
                render() {
                    return (
                        <ToggleButton
                            id="togglebutton_3_r"
                            name="togglebutton_3_r"
                            on={this.state.isOn}
                            disabled={this.state.isDisabled}
                            inlineLabel={true}
                            onChange={this.handleClick}
                        />
                    );
                }
            };

            //render React components
            ReactDOM.render(
                <div>
                    <ToggleButton
                        id="togglebutton_1_r"
                        name="togglebutton_1_r"
                        on={true}
                        disabled={true}
                        ref={(component) => {
                           // this.toggleButtonWidgetInstance = component.toggleButtonWidget; //kept as a reference to underlying widget, but ideally, component updates should be handled through states
                        }}
                    />
                    <ToggleButton
                        id="togglebutton_2_r"
                        name="togglebutton_2_r"
                        on={true}
                        inlineLabel={{
                            "on": "Active",
                            "off": "Inactive"
                        }}
                    />
                    <ToggleButtonApp/>
                </div>, this.el
            );

            return this;
        };

        this.disableToggleButtonComponent = function () {
            this.toggleButtonAppInstance.setState({isDisabled: true});
        };

        this.enableToggleButtonComponent = function () {
            this.toggleButtonAppInstance.setState({isDisabled: false});
        };

        this.setToggleButtonOnComponent = function () {
            !this.toggleButtonAppInstance.state.isDisabled && this.toggleButtonAppInstance.setState({isOn: true});
        };

        this.setToggleButtonOffComponent = function () {
            !this.toggleButtonAppInstance.state.isDisabled && this.toggleButtonAppInstance.setState({isOn: false});
        };

    };

    return ToggleButtonComponentView;

});