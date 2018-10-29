/**
 * A view that uses the spinner component (created from the spinner widget) to render a indeterminate spinner using React
 *
 * @module Spinner Component View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/spinner/react/spinner'
], function (React, ReactDOM, Spinner) {
    var SpinnerComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            //render React components
            ReactDOM.render(
                <Spinner
                    statusText='Current stage of operation...'
                />
                , this.el);

            return this;
        };
    };

    return SpinnerComponentView;
});