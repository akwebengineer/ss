/**
 * A module that builds a colorPicker widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 *
 * @module ColorPickerWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    "lib/template_renderer/template_renderer",
    "text!widgets/colorPicker/templates/colorPickerContainer.html",
    "colorpicker"
], /** @lends ColorPickerWidget*/
function (render_template, colorPickerContainer) {

    var ColorPickerWidget = function (conf) {
        /**
         * ColorPickerWidget constructor
         *
         * @constructor
         * @class ColorPickerWidget- Builds a colorPicker widget from a configuration object.
         * @param {Object} conf - It requires the container parameter and it also has the optional parameter: value.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {string} conf.value - defines the value that will be assigned to the colorPicker
         * @returns {Object} Current ColorPickerWidget's object: this
         */

        var $colorPickerWrapper = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && !_.isUndefined(conf.container),
            colorPickerBuilt = false,
            errorMessages = {
                "noConf": "The configuration object for the color picker widget is missing",
                "noContainer": "The configuration for the color picker widget must include the container property",
                "noBuilt": "The color picker widget was not built"
            },
            $colorPickerContainer,
            self = this;

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
         * Builds the colorPicker widget in the specified container.
         * @returns {Object} returns the instance of the colorPicker widget that was built
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                $colorPickerWrapper = $colorPickerWrapper.append(render_template(colorPickerContainer, conf)).find(".color-picker-widget");
                $colorPickerContainer = $colorPickerWrapper.find(".color-picker-input");

                var $outputContainer = $colorPickerWrapper.find(".color-picker-output"),
                    outputIdentifier = _.uniqueId("color-picker-output");
                $outputContainer.addClass(outputIdentifier); //a unique class is needed per instance of the colorPicker as per library restrictions

                $colorPickerContainer.colorpicker({
                    parts: ['map', 'bar'],
                    alpha: true,
                    okOnEnter: true,
                    altField: "." + outputIdentifier,
                    open: function (event, color) {
                        $(".ui-colorpicker").addClass("color-picker-widget color-picker-widget-dialog-wrapper"); //container gets created as a child of body, outside of the widget container, so a class gets added to introduce the class namespace
                    },
                    select: function(event, color) {
                        $colorPickerContainer.trigger("slipstreamColorPicker:onChange", {
                            "updatedValue": color.hex
                        });
                    }
                });
                colorPickerBuilt = true;

            } else {
                showError();
            }
            return this;
        };

        /**
         * Provides the value set for the colorWidget input
         */
        this.getValue = function () {
            if (colorPickerBuilt) {
                return $colorPickerContainer.val();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Sets a value for the colorWidget input
         * @param {string} value - value to be updated in the input of the colorPicker
         */
        this.setValue = function (value) {
            if (colorPickerBuilt) {
                $colorPickerContainer.colorpicker("setColor", value);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Clean up the specified container from the resources created by the colorPicker widget
         * @returns {Object} returns the instance of the colorPicker widget
         */
        this.destroy = function () {
            if (colorPickerBuilt) {
                $colorPickerWrapper.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return ColorPickerWidget;
});