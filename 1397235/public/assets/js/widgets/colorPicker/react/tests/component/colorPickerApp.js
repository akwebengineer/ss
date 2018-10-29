/**
 * A view that renders the color picker with value
 *
 * @module ColorPickerApp
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/colorPicker/react/colorPicker'
], function (React, ReactDOM, ColorPicker) {
    //creates a React component from the ColorPicker component so states can be handled by the user of the ColorPicker component
    class ColorPickerApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: "b988b9"
            };
            this.handleChange = this.handleChange.bind(this);
            this.setValue = this.setValue.bind(this);
            this.getValue = this.getValue.bind(this);
        }

        handleChange(e, value) {
            this.setState({value: value.updatedValue});
            console.log(value);
        }

        setValue() {
            this.setState({"value": "348ccb"});
        }

        getValue() {
            console.log(this.state.value);
        }

        render() {
            return (
                <div>
                    <ColorPicker
                        value = {this.state.value}
                        onChange={this.handleChange}
                    />
                    <br/>
                    <span className="set-value-with-non-value-r slipstream-secondary-button" onClick={this.setValue}>Set Value</span>
                    <span className="get-value-with-non-value-r slipstream-primary-button" onClick={this.getValue}>Get Value</span>
                </div>
            );
        }
    };

    return ColorPickerApp;

});