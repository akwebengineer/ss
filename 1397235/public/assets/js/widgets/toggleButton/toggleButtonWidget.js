/**
 * A module that builds a toggle button widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget and the id and name of the toggle button
 *
 * @module ToggleButtonWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/toggleButton/templates/toggleButtonContainer.html',
    'lib/i18n/i18n'
], /** @lends ToggleButtonWidget*/
function (render_template, toggleContainer, i18n) {

    var ToggleButtonWidget = function (conf) {
        /**
         * ToggleButtonWidget constructor
         *
         * @constructor
         * @class ToggleButtonWidget- Builds a toggle button widget from a configuration object.
         * @param {Object} conf - It requires the container and the id parameters.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered
         * @param {string} conf.id - defines the id of the toggle button widget
         * @param {string} conf.name - defines the name of the toggle button widget
         * @param {boolean} conf.on - if it is set to true, the toggle button is considered "on"; otherwise it considered is off.
         * @param {boolean} conf.disabled - if it is set to true, the toggle button is disabled and in this case, the assigned value can't be updated once it is rendered; otherwise the toggle button interaction is enabled.
         * @param {boolean} conf.inlineLabel - boolean/Object that defines the inline label to be shown next to the toggle button
         * @returns {Object} Current ToggleButtonWidget's object: this
         */

        var $toggleButtonContainer = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && !_.isEmpty(conf.id) && typeof(conf.container) != 'undefined',
            toggleButtonBuilt = false,
            self = this,
            defaultMessages = _.extend({
                "on": i18n.getMessage("toggle_on"),
                "off": i18n.getMessage("toggle_off")
            }, conf.inlineLabel),
            errorMessages = {
                "noConf": "The configuration object for the toggle button widget is missing",
                "noId": "The configuration for the toggle button widget must include the id parameter",
                "noContainer": "The configuration for the toggle button widget must include the container parameter",
                "noBuilt": "The toggle button widget was not built"
            },
            $toggleInput, $toggleLabel;

        /**
         * Throws error messages if some required properties of the configuration are not available
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            if (_.isEmpty(conf.id))
                throw new Error(errorMessages.noId);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Builds the toggle button widget in the specified container
         * @returns {Object} returns the instance of the toggle button widget that was built
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                $toggleButtonContainer = $toggleButtonContainer.append(render_template(toggleContainer, conf)).find('.toggle-button-widget');
                $toggleInput = $toggleButtonContainer.find('input.toggle-button');
                $toggleLabel = $toggleButtonContainer.find('.toggle-inline-label');
                updateLabel(conf.on);
                registerEvents();
                toggleButtonBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Updates the inline label of the toggle button according to its current value
         * @param {boolean} value - if it is set to true, the toggle button is on; otherwise it is off
         * @inner
         */
        var updateLabel = function (value) {
            if ($toggleLabel) {
                if (value) {
                    $toggleLabel.html(defaultMessages.on);
                } else {
                    $toggleLabel.html(defaultMessages.off);
                }
            }
        };

        /**
         * Register/trigger events related to the toggleButton widget like the onChange event
         * @inner
         */
        var registerEvents = function () {
            $toggleInput.on("change", function (e) {
                var updatedValue = self.getValue();
                updateLabel(updatedValue);
                $toggleButtonContainer.trigger("slipstreamToggleButton:onChange", {
                    "updatedValue": updatedValue
                });
            });
        };

        /**
         * Sets the toggle button value to the state on (true) or off (false)
         * @param {boolean} value - if it is set to true, the toggle button is on; otherwise it is off
         */
        this.setValue = function (value) {
            if (toggleButtonBuilt) {
                var currentValue = _.isUndefined(this.getValue()) ? false : true;
                if (currentValue != value) {
                    $toggleInput.prop("checked", value);
                    $toggleInput.trigger("change"); //change event doesn't get triggered when the checked value is set programmatically
                }
            } else {
                showError();
            }
            return this;
        };

        /**
         * Gets the value of the toggle button widget
         * @returns {string} returns true if the toggle is on and undefined if it is off
         */
        this.getValue = function () {
            if (toggleButtonBuilt) {
                //the val() method will return 'undefined' if find() doesn't actually find a matching object
                return $toggleButtonContainer.find('input.toggle-button:checked').val();
            } else {
                showError();
            }
        };

        /**
         * Update toggle state to disable or enable it
         * @param {boolean} disabled - true, if the toggle button is disabled; otherwise, off
         * @inner
         */
        var updateState = function (disabled) {
            $toggleInput.prop("disabled", disabled);
            if (disabled) {
                $toggleLabel.attr("disabled", true);
            } else {
                $toggleLabel.removeAttr("disabled");
            }
        };

        /**
         * Disables the user interaction in the toggle button widget
         */
        this.disable = function () {
            if (toggleButtonBuilt) {
                updateState(true);
            } else {
                showError();
            }
        };

        /**
         * Enables the user interaction in the toggle button widget
         */
        this.enable = function () {
            if (toggleButtonBuilt) {
                updateState(false);
            } else {
                showError();
            }
        };

        /**
         * Checks if the toggle button widget is disabled
         * @returns {boolean} value - if it is disabled then it returns true; otherwise it returns false
         */
        this.isDisabled = function () {
            if (toggleButtonBuilt) {
                return $toggleInput.prop("disabled");
            } else {
                showError();
            }
        };

        /**
         * Clean up the specified container from the resources created by the toggle button widget
         * @returns {Object} returns the instance of the toggle button widget
         */
        this.destroy = function () {
            if (toggleButtonBuilt) {
                $toggleButtonContainer.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return ToggleButtonWidget;
});