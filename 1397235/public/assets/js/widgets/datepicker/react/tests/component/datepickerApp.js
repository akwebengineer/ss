/**
 * An example that demostrates the use of Datepicker component (created from the datepicker widget) and shows the usage of various methods to set states and modify values
 *
 * @module DatepickerApp
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/datepicker/react/datepicker'
], function (React, Datepicker) {
    var minDate = new Date(),
        maxDate = new Date();
    maxDate.setDate(minDate.getDate() + 7);

    //creates an example of React component using Datepicker component
    //states and events can be handled by the user of the Datepicker component
    class DatepickerApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                disabled: true,
                value: new Date()
            };
            this.handleChange = this.handleChange.bind(this);
            this.enable = this.enable.bind(this);
            this.disable = this.disable.bind(this);
            this.setToday = this.setToday.bind(this);
            this.setMinDate = this.setMinDate.bind(this);
            this.setMaxDate = this.setMaxDate.bind(this);
        }

        handleChange(value) {
            console.log("Selected Date is: " + value);
        }

        enable() {
            this.setState({disabled: false});
        }

        disable() {
            this.setState({disabled: true});
        }

        setToday() {
            this.setState({value: new Date()});
        }

        setMinDate() {
            minDate.setDate(minDate.getDate() + 2);
            this.setState({minDate: minDate});
        }

        setMaxDate() {
            maxDate.setDate(minDate.getDate() + 2);
            this.setState({maxDate: maxDate});
        }

        render() {
            return (
                <span>
                    <Datepicker
                        id="datepicker_interactive"
                        value={this.state.value}
                        disabled={this.state.disabled}
                        onChange={this.handleChange}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                    <br/><br/><br/>
                    <span className="slipstream-primary-button" onClick={this.enable}>Enable</span>
                    <span className="slipstream-primary-button" onClick={this.disable}>Disable</span>
                    <span className="slipstream-primary-button" onClick={this.setToday}>set Today</span>
                    <span className="slipstream-primary-button" onClick={this.setMinDate}>set Min Date</span>
                    <span className="slipstream-primary-button" onClick={this.setMaxDate}>set Max Date</span>
                </span>
            );
        }
    }
    ;

    DatepickerApp.defaultProps = {
        disabled: false,
        dateFormat: "mm/dd/yyyy",
        onChange: ()=> {}
    };

    return DatepickerApp;

});