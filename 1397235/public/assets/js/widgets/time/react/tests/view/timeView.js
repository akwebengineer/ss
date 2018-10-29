/**
 * A view that uses the Time component (created from the time widget) to render a time using React
 *
 * @module TimeComponent View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/time/react/time',
    'es6!widgets/time/react/tests/component/timeApp'
], function (React, ReactDOM, Time, TimeApp) {

    var TimeComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            ReactDOM.render(
                <div>
                    <div className="slipstream-content-title">Time Component &lt;Time&gt;</div>
                    <Time label={false}/>
                    <Time disabled={true}/>
                    <TimeApp/>
                </div>
                , this.el
            );
            return this;
        };
    };

    return TimeComponentView;

});