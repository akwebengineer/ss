/**
 * A view that uses the Confirmation Dialog (created from the Confirmation Dialog widget) to render a Confirmation Dialog using React
 *
 * @module ConfirmationDialogComponent View
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/confirmationDialog/react/confirmationDialog',
    'es6!widgets/confirmationDialog/react/tests/component/confirmationDialogApp'
], function (React, ReactDOM, ConfirmationDialogComponent, ConfirmationDialogApp, configurationSample) {

    var ConfirmationDialogComponent = function (options) {

        this.render = function () {
            this.el = document.createElement("div");
            ReactDOM.render(<ConfirmationDialogApp/>,this.el);
            return this;
        };
    };

    return ConfirmationDialogComponent;

});