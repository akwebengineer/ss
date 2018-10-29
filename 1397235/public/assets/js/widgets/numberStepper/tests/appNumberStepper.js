/**
 * A view that uses the number stepper widget to render step up /step down buttons from a configuration object
 *
 * @module Number Stepper View
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/numberStepper/numberStepperWidget',
    'widgets/numberStepper/conf/configurationSample',
    'widgets/numberStepper/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/numberStepper/tests/templates/numberStepperExample.html',
    'es6!widgets/numberStepper/react/tests/view/numberStepperComponentView',
], function(Backbone, NumberStepperWidget, configurationSample, formConfiguration, FormWidget, render_template, numberStepperExample, NumberStepperComponentView){
    var NumberStepperView = Backbone.View.extend({

        events: {
            "click #enable": "enable",
            "click #disable": "disable",
            "click #setValue": "setValue",
            "click #getValue": "getValue",
            "click #get-form-value": "getFormValue",
            "click #validate-form-values": "validateForm",
            "click .enable-number-component": "enableNumberStepperComponent",
            "click .disable-number-component": "disableNumberStepperComponent",
            "click .set-number-value-component": "setNumberStepperComponent"
        },

        initialize: function () {
            this.addTemplates();
            this.renderForm();
            this.addReactNumberStepper();
            this.render();
        },

        render: function () {
            new NumberStepperWidget({
                "container": this.$default,
                "id": "numberTest1"
            }).build();

            new NumberStepperWidget(_.extend(configurationSample.useMinMaxOption, {
                "container": this.$useMinMaxOption,
                "id": "numberTest2"
            })).build();

            new NumberStepperWidget(_.extend(configurationSample.useMinMaxDisabledOption, {
                "container": this.$useMinMaxDisabledOption,
                "id": "numberTest3"
            })).build();

            this.enableDisableGetSetNS = new NumberStepperWidget(_.extend(configurationSample.useMinMaxOption, {
                "container": this.$useMinMaxEnableDisableGetSetTest,
                "id": "numberTest4"
            })).build();
            return this;
        },

        renderForm: function () {
            this.form = new FormWidget({
                "elements": formConfiguration,
                "container": this.$numberStepperFormContainer
            }).build();
        },

        addTemplates: function () {
            this.$el.append((render_template(numberStepperExample)));

            //numberStepper containers
            this.$default = this.$el.find("#stepper-demo-range-1");
            this.$useMinMaxOption = this.$el.find("#stepper-demo-range-2");
            this.$useMinMaxDisabledOption = this.$el.find("#stepper-demo-range-3");
            this.$useMinMaxEnableDisableGetSetTest = this.$el.find("#stepper-demo-range-4");
            this.$numberStepperFormContainer = this.$el.find("#number-stepper-form-demo");
            this.$numberStepperReactContainer = this.$el.find("#number-stepper-react");
        },

        disable: function () {
            this.enableDisableGetSetNS.disable();
        },

        enable: function () {
            this.enableDisableGetSetNS.enable();
        },

        setValue: function () {
            this.enableDisableGetSetNS.setValue(4);
        },

        getValue: function () {
            var val = this.enableDisableGetSetNS.getValue();
            console.log("VALUE: "+val);
        },

        getFormValue: function () {
            var isValid = this.form.isValidInput();
            if(isValid) {
                var values = this.form.getValues(true);
                console.log(values);
            } else {
                console.log("The form isValid is "+isValid);
            }
        },

        validateForm: function () {
            var isValid = this.form.isValidInput();
            console.log("The form isValid is "+isValid);
        },
        addReactNumberStepper: function () {
            this.numberStepperComponentView = new NumberStepperComponentView({
                $el: this.$numberStepperReactContainer
            }).render();
        },

        enableNumberStepperComponent: function () {
            this.numberStepperComponentView.enableNumberStepperComponent();
        },

        disableNumberStepperComponent: function () {
            this.numberStepperComponentView.disableNumberStepperComponent();
        },

        setNumberStepperComponent: function () {
            this.numberStepperComponentView.setNumberStepperComponent();
        }

    });

    return NumberStepperView;
});