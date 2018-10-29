/**
 * NumberStepper widget creates the step up/step down buttons in a number field.
 *
 * @module NumberStepperWidget
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'jqueryui',
    'jqueryNumberStepperGlobalize',
    'text!widgets/numberStepper/templates/numberStepperWrapper.html',
    'lib/template_renderer/template_renderer',
    'widgets/form/formTemplates'
], function(NumberStepper, NumberStepperGlobalize, numberStepperWrapper, render_template, FormTemplates){
    var NumberStepperWidget = function (conf){
        /**
         * NumberStepperWidget constructor
         *
         * @constructor
         * @class NumberStepperWidget- Builds a NumberStepper widget from a configuration object.
         * @param {Object} conf - It requires the container and the options for the number stepper.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {String} conf.max_value - Max value of the spinner.
         * @param {String} conf.min_value - Min value of the spinner.
         * @param {String} conf.step - Size of the step to take when spinning via buttons. Can be a float string in case of float number format.
         * @param {Boolean} conf.disabled - If true, disabled the container. By default, false.
         * @param {String} conf._numberFormat - If set to "n", the number format is float.
         * @param {Boolean} conf._required - If set to true, then in reference to form widget, the field will be a required field in form validation
         * @param {Boolean} conf._post_validation - In reference to form, it represents the name of the custom event that will be triggered when a validation has been completed completed.
         * @param {Boolean} conf._onfocus - In reference to form, it forces focus on the input element
         * @returns {Object} Current NumberStepperWidget's object: this
         */
        var self = this,
            numberStepperBuilt = false,
            errorMessages = {
                'noConf': 'The configuration object for the number stepper widget is missing',
                'noContainer': 'The configuration for the number stepper widget must include a container',
                'noBuilt': 'The number stepper widget was not built'
            },
            $container = $(conf.container);

        /**
         * Builds the number stepper widget in the specified container.
         * @returns {Object} returns the instance of the number stepper widget that was built.
         */
        this.build = function() {
            var templates = new FormTemplates();
            var hasRequiredConfiguration = _.isObject(conf) && !_.isUndefined(conf.container);
            if(hasRequiredConfiguration) {
                var convertAttributes = ['required', 'post_validation', 'onfocus'];
                for( var i=0;i<convertAttributes.length;i++) {
                    conf[convertAttributes[i]] = conf['_'+convertAttributes[i]];
                    delete conf['_'+convertAttributes[i]];
                }
                $container = $container.append(render_template(numberStepperWrapper, conf, templates.getPartialTemplates())).find('input.number-stepper');
                conf.options = {
                    'step': conf.step || 1, //sets a default 1 if conf.step is not available
                    'disabled': conf.disabled,
                    'numberFormat': conf._numberFormat
                };
                if(!_.isUndefined(conf.min_value)) {
                    conf.options.min = conf.min_value;
                }
                if(!_.isUndefined(conf.max_value)) {
                    conf.options.max = conf.max_value;
                }
                $container.spinner(conf.options);
                numberStepperBuilt = true;
                registerEvents();
            } else {
                showError();
            }
            return this;
        };

        /**
         * Disables the specified container in which the number stepper is build.
         * @returns {Object} returns the instance of the number stepper widget.
         */
        this.disable = function() {
            if(numberStepperBuilt) {
                $container.spinner("disable");
            } else {
                showError();
            }
            return this;
        };

        /**
         * Enables the specified container in which the number stepper is build.
         * @returns {Object} returns the instance of the number stepper widget.
         */
        this.enable = function() {
            if(numberStepperBuilt) {
                $container.spinner("enable");
            } else {
                showError();
            }
            return this;
        };

        /**
         * Returns value in the container having number stepper
         * @returns {string} returns the value
         */
        this.getValue = function() {
            if(numberStepperBuilt) {
                var value = $container.spinner("value");
                return value;
            } else {
                showError();
            }
        };

        /**
         * Sets the value in the container having number stepper
         * @param {string} the input value
         */
        this.setValue = function(value) {
            if(numberStepperBuilt) {
                $container.spinner("value", value);
            } else {
                showError();
            }
        };

        /**
         * Throws error messages if some required properties of the configuration are not available
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Clean up the specified container from the resources created by the number stepper widget.
         * @returns {Object} returns the instance of the number stepper widget.
         */
        this.destroy = function() {
            if(numberStepperBuilt) {
                $container.spinner("destroy");
            } else {
                showError();
            }
            return this;
        };

        /**
         * Register/trigger events related to the numberStepper widget like the onChange event
         * @inner
         */
        var registerEvents = function () {
            $container.on("change", function (e) {
                var updatedValue = self.getValue();
                $(this).trigger("slipstreamNumberStepper:onChange", {
                    "updatedValue": updatedValue
                });
            });
            $container.on("focus", function (e) {
                $(this).closest(".ui-spinner").addClass("number-stepper-focus");
            });
            $container.on("blur", function (e) {
                $(this).closest(".ui-spinner").removeClass("number-stepper-focus");
            });
        };

    };

    return NumberStepperWidget;
});