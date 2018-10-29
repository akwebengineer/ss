/**
 * A view that uses the toggleButton widget and the toggleButton component to render toggle buttons from a configuration object or toggleButton element properties
 *
 * @module ToggleButton View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'backbone',
    'widgets/toggleButton/toggleButtonWidget',
    'widgets/form/formWidget',
    'widgets/toggleButton/tests/conf/formConfiguration',
    'es6!widgets/toggleButton/react/tests/view/toggleButtonComponentView',
    'lib/template_renderer/template_renderer',
    'text!widgets/toggleButton/tests/templates/toggleButtonExample.html'
], function (Backbone, ToggleButtonWidget, FormWidget, formConfiguration, ToggleButtonComponentView, render_template, toggleButtonExample) {
    var ToggleButtonView = Backbone.View.extend({

        events: {
            "click .set-toggle-value": "setToggleButtonValue",
            "click .set-toggle-value-off": "setToggleButtonValueOff",
            "click .get-toggle-value": "getToggleButtonValue",
            "click .get-isDisabled-value": "getIsDisabledValue",
            "click .disable-toggle": "disableToggleButton",
            "click .enable-toggle": "enableToggleButton",
            "click #get-form-value": "getFormValue",
            "click .enable-toggle-component": "enableToggleButtonComponent",
            "click .disable-toggle-component": "disableToggleButtonComponent",
            "click .set-toggle-value-on-component": "setToggleButtonOnComponent",
            "click .set-toggle-value-off-component": "setToggleButtonOffComponent"
        },

        initialize: function () {
            this.addTemplates();
            this.renderForm();
            this.addReactToggleButton();
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.toggleButton = new ToggleButtonWidget({
                "container": this.$toggleButtonContainer,
                "id": "togglebutton_1",
                "name": "togglebutton_1",
                "inlineLabel": true,
                // "disabled": true,
                "on": false
            }).build();
            return this;
        },

        renderForm: function () {
            this.form = new FormWidget({
                "elements": formConfiguration,
                "container": this.$toggleButtonFormContainer
            }).build();
        },

        setToggleButtonValue: function () {
            this.toggleButton.setValue(true);
        },

        setToggleButtonValueOff: function () {
            this.toggleButton.setValue(false);
        },

        getToggleButtonValue: function () {
            var value = this.toggleButton.getValue();
            console.log(value);
        },

        getIsDisabledValue: function () {
            var isDisabled = this.toggleButton.isDisabled();
            console.log(isDisabled);
        },

        disableToggleButton: function () {
            this.toggleButton.disable();
        },

        enableToggleButton: function () {
            this.toggleButton.enable();
        },

        getFormValue: function () {
            var values = this.form.getValues(true);
            console.log(values);
        },

        addTemplates: function () {
            this.$el.append((render_template(toggleButtonExample)));
            this.$toggleButtonContainer = this.$el.find("#toggle-button-demo");
            this.$toggleButtonFormContainer = this.$el.find("#toggle-button-form-demo");
            this.$toggleButtonReactContainer = this.$el.find("#toggle-button-react");
        },

        addReactToggleButton: function () {
            this.toggleButtonComponentView = new ToggleButtonComponentView({
                $el: this.$toggleButtonReactContainer
            }).render();
        },

        enableToggleButtonComponent: function () {
            this.toggleButtonComponentView.enableToggleButtonComponent();
        },

        disableToggleButtonComponent: function () {
            this.toggleButtonComponentView.disableToggleButtonComponent();
        },

        setToggleButtonOnComponent: function () {
            this.toggleButtonComponentView.setToggleButtonOnComponent();
        },

        setToggleButtonOffComponent: function () {
            this.toggleButtonComponentView.setToggleButtonOffComponent();
        }
    });

    return ToggleButtonView;
});