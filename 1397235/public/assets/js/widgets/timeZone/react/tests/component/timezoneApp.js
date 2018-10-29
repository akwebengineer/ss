/**
 * A view that uses the timeZone component to render a time zone selector using React
 *
 * @module TimeZoneComponentView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/timeZone/react/timeZone'
], function (React, ReactDOM, TimeZone) {
    // Create a react component that is used to render an instance of the TimeZone component
    class TimeZoneApp extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                value: 'America/Honolulu'
            }

            this.handleChange = (data) => console.log(data);
        }

        render() {
            return (
                <TimeZone
                    onChange = {this.handleChange}
                    value = {this.state.value}
                />
            );
        }
    };

    return TimeZoneApp;
});