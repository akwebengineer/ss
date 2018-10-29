/**
 * A view that uses the progressBar component (created from the progressBar widget) to render a indeterminate progressBar using React
 *
 * @module ProgressBar Component View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/progressBar/react/progressBar'
], function (React, ReactDOM, ProgressBar) {
    var ProgressBarComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            //render React components
            ReactDOM.render(
                <ProgressBar
                    statusText='Current stage of operation...'
                />
                , this.el);

            return this;
        };
    };

    return ProgressBarComponentView;
});