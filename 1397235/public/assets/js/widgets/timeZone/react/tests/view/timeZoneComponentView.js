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
    'es6!widgets/timeZone/react/timeZone', 
    'es6!widgets/timeZone/react/tests/component/timezoneApp'
], function (React, ReactDOM, TimeZone, TimeZoneApp) {
    var TimeZoneComponentView = function(options) {
        this.el = options.$el[0];

        this.render = function () {
            ReactDOM.render(
                <div>
                    <label>Default timezone value</label>
                    <TimeZone/>
                    
                    <label>Set the timezone value via props</label>
                    <TimeZone
                       value = "America/Honolulu"
                    />
                    <label>Full example with onChange callback</label>
                    <TimeZoneApp/>
                </div>,
                this.el
            );

            return this;
        };
    };

    return TimeZoneComponentView
});