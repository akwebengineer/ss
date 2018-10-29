/**
 * An example showing the usage of Time component along with states update
 *
 * @module TimeApp
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/time/react/time'
], function (React, ReactDOM, Time) {

    class TimeApp extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                disabled: false,
                value: "10:10:10"
            };
        }

        // Method to enable / disable the component
        disable(value) {
            this.setState({disabled: value});
        }

        // Method to set new time
        setValue() {
            this.setState({value: "11:11:11 PM"});
        }

        // Method to get the current time
        getValue() {
            console.log(this.state.value);
        }

        render() {
            return (
                <div>
                    <Time
                        disabled={this.state.disabled}
                        value={this.state.value}
                        onChange={(data) => this.setState({value: data})}
                    />
                    <span className="slipstream-primary-button" onClick={() => this.disable(false)}>Enable</span>
                    <span className="slipstream-primary-button" onClick={() => this.disable(true)}>Disable</span>
                    <span className="slipstream-primary-button" onClick={() => this.setValue()}>Set Value</span>
                    <span className="slipstream-primary-button" onClick={() => this.getValue()}>Get Value</span>
                </div>
            );
        }
    }

    return TimeApp;
});