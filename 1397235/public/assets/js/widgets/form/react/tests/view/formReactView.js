/**
 * A view that uses a FormApp component to render a form component built using React
 *
 * @module FormComponent View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/form/react/tests/component/formApp'
], function (React, ReactDOM, FormApp) {

    var FormComponentView = function (options) {
        this.el = document.createElement("div");

        this.render = function () {
            ReactDOM.render(
                <FormApp/>
                , this.el
            )
            return this;
        };

    };

    return FormComponentView;

});