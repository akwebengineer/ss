/**
 * A view that uses the Datepicker component (created from the DatepickerWidget) to render a datepicker using React
 *
 * @module DatepickerComponent View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/datepicker/react/datepicker',
    'es6!widgets/datepicker/react/tests/component/datepickerApp'
], function (React, ReactDOM, Datepicker, DatepickerApp) {
    var DatepickerComponentView = function (options) {
        this.el = options.$el[0];

        var minDate = new Date(),
            maxDate = new Date();
        maxDate.setDate(minDate.getDate() + 7);

        this.render = function () {
            var self = this;

            //render React components
            ReactDOM.render(
                <div>
                    <label>Basic:
                        <Datepicker
                            id="datepicker_basic"
                            value={new Date()}
                            dateFormat="mm/dd/yyyy"
                        />
                    </label>
                    <label>Format:
                        <Datepicker
                            id="datepicker_dateformat"
                            dateFormat="dd-mm-yyyy"
                        />
                    </label>
                    <label>Min Max:
                        <Datepicker
                            id="datepicker_min_max"
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </label>
                    <label>Interactive:
                        <DatepickerApp/>
                    </label>
                </div>,
                this.el
            );

            return this;
        };
    };

    return DatepickerComponentView;
});