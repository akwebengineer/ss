/**
 * A module that builds a slider widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget, the base range, the handles and the scale in the slider.
 *
 * @module SliderWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/slider/templates/sliderContainer.html',
    'nouislider'
], /** @lends SliderWidget*/
function (render_template, sliderContainer, noUiSlider) {

    var SliderWidget = function (conf) {

        /**
         * SliderWidget constructor
         *
         * @constructor
         * @class SliderWidget- Builds a slider widget from a configuration object.
         * @param {Object} conf - It requires the container, the handles and the connection around the handles.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {Array} conf.handles - It defines an array of Objects with the handles, the labels and the connections around the handles. It's an array of Objects, where each object could have: value property (data type is number, required property and represents the default value of the handle), connect property (an Object with the left property and right property, the latter is ONLY available for the last handle in the array. It represents the segments around the handle location), label property (boolean, indicates if the value of the handle will be showed).
         * @param {Object} conf.scale - Defines the total range of values for the slider. It is composed by range, numberOfValues and density properties.
         * @param {Object} conf.scale.range - Required property, represented by an Object with the min (the smallest value in the scale) and max (the biggest value is the scale).
         * @param {number} conf.scale.numberOfValues - Represents how many values between the scale's min and max values to be displayed.
         * @param {number} conf.scale.density - Represents the number of divisions between any two numbers in the scale. It helps as a reference for the possible location of a number in a scale.
         * @param {Object} conf.options - Additional properties used to define the interaction in the slider. It is composed by step, handleDistance and labels.
         * @param {number} conf.options.step - Represents how many steps will be the handle jump before moving to the next value. Its data type is number. If it's 0 (default value), the handle can move to values that includes decimal, any value for step bigger than 0 will produce an Integer value.
         * @param {Object} conf.options.handleDistance - Provides the minimum and maximum distance allowed between any two adjacent handles. It has the min property (the closest the handles could be) and max property (the further the handles could be).
         * @param {boolean or Object} conf.options.label - Represents the current value of the handle. It could be a boolean or an Object. If it's set to true, the default value of the handle will be showed. If it's set to false, no label will be showed for any of the handles. If it's defined as an Object, it should include the format and unformat properties and optionally, the width property. Formatter callback helps to define a new label while unformat should remove all strings added to the original value and return a number. Since format could introduce a wider label, width property allows ot define a new width for the label.
         * @returns {Object} Current SliderWidget's object: this
         */
        var $sliderContainer = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && typeof(conf.container) != 'undefined' && _.isObject(conf.handles) && _.isObject(conf.scale) && _.isObject(conf.scale.range),
            sliderBuilt = false,
            enabledSelectionColor = [],
            errorMessages = {
                'noConf': 'The configuration object for the slider widget is missing',
                'noContainer': 'The configuration for the slider widget must include the container property',
                'noHandles': 'The configuration for the slider widget must include the handles property',
                'noRange': 'The configuration for the slider widget must include the range property in the scale property',
                'noBuilt': 'The slider widget was not built'
            };

        /**
         * Throws error messages if some required properties of the configuration are not available.
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            if (!_.isObject(conf.handles))
                throw new Error(errorMessages.noHandles);
            if (!_.isObject(conf.scale) || !_.isObject(conf.scale.range))
                throw new Error(errorMessages.noRange);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Gets the configuration required by the slider library from the values provided in the slider configuration. For optional values (for example; label, step), it assigns default values.
         * @inner
         */
        var getSliderConfiguration = function () {
            var noUiSliderConfiguration = {
                    "start": [],
                    "connect": [],
                    "tooltips": []
                },
                getConnect = function (connectValue, position) {
                    if (connectValue && _.isBoolean(connectValue[position])) {
                        return connectValue[position];
                    }
                    return true;
                },
                getTooltip = function (labelValue) {
                    if (!_.isUndefined(labelValue)) {
                        return labelValue;
                    } else if (conf.options && _.isBoolean(conf.options.label)) {
                        return conf.options.label
                    }
                    return true;
                },
                getConnectColor = function (connectValue, position) {
                    if (connectValue && connectValue[position] && connectValue[position].color) {
                        return connectValue[position].color;
                    }
                    return false;
                },
                numberOfHandles = conf.handles.length;

            //start, connect and tooltip properties
            conf.handles.forEach(function (handle) {
                noUiSliderConfiguration.start.push(handle.value);
                noUiSliderConfiguration.connect.push(getConnect(handle.connect, "left"));
                noUiSliderConfiguration.tooltips.push(getTooltip(handle.label));

                // saves background color for the left selection bar (connect)
                if (_.isUndefined(handle.connect) || _.isUndefined(handle.connect.left) || handle.connect.left !== false) {
                    enabledSelectionColor.push(getConnectColor(handle.connect, "left"));
                }
            });

            if (noUiSliderConfiguration.start.length == 1) {
                noUiSliderConfiguration.start = noUiSliderConfiguration.start[0];
            }

            var lastHandleConnect = conf.handles[numberOfHandles - 1].connect;
            noUiSliderConfiguration.connect.push(getConnect(lastHandleConnect, "right"));

            //saves background color for the last right selection bar (connect)
            if (_.isUndefined(lastHandleConnect) || _.isUndefined(lastHandleConnect.right) || lastHandleConnect.right !== false) {
                enabledSelectionColor.push(getConnectColor(lastHandleConnect, "right"));
            }

            //step, snap, margin, and limit properties
            if (conf.options) {
                conf.options.step && (noUiSliderConfiguration.step = conf.options.step);
                if (conf.handles.length > 1 && conf.options.handleDistance) {
                    conf.options.handleDistance.min && (noUiSliderConfiguration.margin = conf.options.handleDistance.min);
                    conf.options.handleDistance.max && (noUiSliderConfiguration.limit = conf.options.handleDistance.max);
                }
            }

            //pips property
            if (conf.scale.numberOfValues) {
                noUiSliderConfiguration.pips = {
                    "mode": "count",
                    "values": conf.scale.numberOfValues ? conf.scale.numberOfValues : 6
                };
                if (conf.scale.density) {
                    noUiSliderConfiguration.pips.density = conf.scale.density;
                } else {
                    $sliderContainer.addClass("no-scale-density");
                }
            } else {
                $sliderContainer.addClass("no-scale");
            }

            //format property
            noUiSliderConfiguration.format = {
                "to": function (value, handle) {
                    var hasDecimal = (conf.options && conf.options.step == 0) || _.isUndefined(conf.options) || _.isUndefined(conf.options.step);
                    if (conf.options) {
                        if (conf.options.step) { //integer
                            value = Math.round(value);
                        }
                        if (_.isObject(conf.options.label) && _.isFunction(conf.options.label.format)) {
                            value = conf.options.label.format(value, handle);
                        }
                    }
                    if (hasDecimal) { //decimal
                        value = value.toFixed(1);
                    }
                    return value;
                },
                "from": function (value) {
                    return value;
                }
            };

            return noUiSliderConfiguration;
        };

        /**
         * Adjusts the style of the bar that connects the slider handle by using some predefined sets of color or ovewriting it by the ones defined in the slider configuration.
         * @inner
         */
        var adjustConnectStyle = function () {
            var $connect = $sliderContainer.find('.noUi-connect '),
                setConnectColor = function ($element, color) {
                    color && $element.css("background", color);
                };

            //sets default selection bar colors
            switch ($connect.length) {
                case 2:
                    $connect.eq(0).addClass("oneOfTwo");
                    $connect.eq(1).addClass("twoOfTwo");
                    break;
                case 3:
                    $connect.eq(0).addClass("oneOfThree");
                    $connect.eq(1).addClass("twoOfThree");
                    $connect.eq(2).addClass("threeOfThree");
                    break;
                case 4:
                    $connect.eq(0).addClass("oneOfFour");
                    $connect.eq(1).addClass("twoOfFour");
                    $connect.eq(2).addClass("threeOfFour");
                    $connect.eq(3).addClass("fourOfFour");
                    break;
            }

            //overwrites default selection bar colors with the ones passed by configuration
            for (var i = 0; i < enabledSelectionColor.length; i++) {
                setConnectColor($connect.eq(i), enabledSelectionColor[i]);
            }
        };

        /**
         * Adjusts the style in the label that is showed at the top of the slider handles.
         * @param {array} tooltipConfiguration - Array of booleans that represents if a label should be showed or not for each of the handles of the slider.
         * @inner
         */
        var adjustTooltipStyle = function (tooltipConfiguration) {
            var hasTooltip = tooltipConfiguration.some(function (value) {
                return value;
            });
            if (hasTooltip) {
                var hasTooltipWidthConf = conf.options && _.isObject(conf.options.label) && !_.isUndefined(conf.options.label.width);
                hasTooltipWidthConf && $sliderContainer.find(".noUi-tooltip").css("width", conf.options.label.width);
            } else {
                $sliderContainer.addClass("no-label");
            }
        };

        /**
         * Adds a listener to changes in the value of the slider handles. It triggers a "slipstreamSlider.handleValueUpdated" event with a data Object that provides the location of the handle that was updated and an array with the current value of all the handles.
         * @inner
         */
        var addListener = function () {
            $sliderContainer[0].noUiSlider.on("update", function (values, handle) {
                $sliderContainer.trigger("slipstreamSlider.handleValueUpdated", {
                    "handle": handle,
                    "values": getUnformattedValues(values)
                });
            });
        };

        /**
         * Gets the curent value of each handle. If unformat callback is available, then value will be calculated in the callback.
         * @param {array} handlesValue - values of each handle in the order that are showed in the slider (left to right).
         * @returns {array} returns the current value of each handle
         * @inner
         */
        var getUnformattedValues = function (values) {
            var unformattedValues;
            if (conf.options && _.isObject(conf.options.label) && _.isFunction(conf.options.label.unformat)) {
                unformattedValues = values.map(function (value, handleIndex) {
                    return conf.options.label.unformat(value, handleIndex);
                });
            } else {
                unformattedValues = values;
            }
            return unformattedValues;
        };

        /**
         * Disables the option to change the value of a handle. Additionally, the handle will not be visible. The disabled property is a boolean that is true by default (enabled).
         * @inner
         */
        var initHandleStates = function () {
            var $handles = $sliderContainer.find(".noUi-origin"),
                $handle;
            for (var i = 0; i < conf.handles.length; i++) {
                if (conf.handles[i].disabled) {
                    $handle = $handles.eq(i);
                    $handle.attr("disabled", true);
                    $handle.find(".noUi-handle").hide();
                    $sliderContainer.addClass("no-handle");
                }
            }
        };

        /**
         * Builds the slider widget in the specified container.
         * @returns {Object} returns the instance of the slider widget that was built.
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                $sliderContainer = $sliderContainer.append(render_template(sliderContainer)).find('.slider-wrapper');
                var noUiSliderConfiguration = getSliderConfiguration();
                noUiSlider.create($sliderContainer[0], _.extend(noUiSliderConfiguration, {
                    "range": conf.scale.range,
                    "behaviour": 'drag'
                }));
                adjustConnectStyle();
                adjustTooltipStyle(noUiSliderConfiguration.tooltips);
                addListener();
                initHandleStates();
                sliderBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Sets the values of the handles in the slider widget.
         * @param {array} handlesValue - values to be assigned to each handle in the order that are showed in the slider (left to right). For no change in one of the handles value, the value should be null.
         */
        this.setValues = function (handlesValue) {
            if (sliderBuilt) {
                return $sliderContainer[0].noUiSlider.set(handlesValue);
            } else {
                showError();
            }
        };

        /**
         * Gets the current values of handles in the slider widget.
         * @returns {array} returns the values assigned to each handle in the order that are showed in the slider (left to right).
         */
        this.getValues = function () {
            if (sliderBuilt) {
                var values = $sliderContainer[0].noUiSlider.get();
                return getUnformattedValues(values);
            } else {
                showError();
            }
        };

        /**
         * Clean up the specified container from the resources created by the slider widget.
         * @returns {Object} returns the instance of the slider widget.
         */
        this.destroy = function () {
            if (sliderBuilt) {
                $(conf.container).find(".slider-widget").remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return SliderWidget;
});