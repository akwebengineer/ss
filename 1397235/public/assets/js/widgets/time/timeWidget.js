/**
 * Time widget is used to display time based on period.
 * Two integral elements:
 * 1. input field: to display time
 * 2. drop down: to select period
 *
 * @module TimeWidget
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'text!widgets/time/templates/time.html',
    'widgets/time/conf/config',
    'widgets/time/lib/timePeriodInteraction',
    'lib/validator/extendedValidator',
    'widgets/form/formTemplates',
    'lib/dateFormatter/dateFormatter',
    'widgets/dropDown/dropDownWidget'
], /** @lends TimeWidget */
function (render_template, i18n, elementsTemplate, WidgetConfig, TimePeriodInteraction, Validator, FormTemplates, dateFormatter, DropDownWidget) {

    /**
     * TimeWidget constructor
     *
     * @constructor
     * @class TimeWidget - Builds a Time widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: defines the container where the widget will be rendered | required
     * value: time value as input | optional
     * label: By default label is shown | if set false, the label will not show | optional
     *
     * @returns {Object} Current TimeWidget object: this
     */
    var TimeWidget = function (conf) {

        var self = this;

        this.conf = {
            "$container": $(conf.container),
            "value": conf.value,
            "label": conf.label
        };

        /**
         * Renders the time widget with a time value specified by the conf object
         * or to the current time value of the client machine.
         * @instance
         * @returns {Object} this object
         */
        this.build = function () {
            var templates = new FormTemplates();
            var elementInteraction = new TimePeriodInteraction();
            var elementsTemplateHtml = render_template(elementsTemplate, formatConfig(WidgetConfig.getElements()), templates.getPartialTemplates());
            this.conf.$container.addClass('row time-widget').append(elementsTemplateHtml);

            var currentTime = getDisplayTime(this.conf.value);

            var time_period = this.conf.$container.find('.time_period');

            this.conf.$container.find('.time_text').val(currentTime.time);
            this.conf.$container.find('.time_period :selected').removeAttr('selected');
            this.conf.$container.find(".time_period option[value='" + currentTime.period + "']").prop('selected', true);
            time_period.data('previous', currentTime.period);

            elementInteraction.addPostValidationHandlers(this.conf.$container);

            // trigger a change event on the time period since setting the selection doesn't trigger it.
            time_period.trigger("change");

            // Use drop down widget to convert the time_period in UX defined drop down styling
            new DropDownWidget({
                "container": time_period,
                "width": "auto"
            }).build();

            bindEvents();

            return this;
        };

        var bindEvents = function () {
            self.conf.$container.find('.time_text').on("change", function () {
                $(this).trigger("slipstreamTime:onChange", {value : self.getTime()});
            });

            self.conf.$container.find('.time_period').on("change", function () {
                $(this).trigger("slipstreamTime:onChange", {value: self.getTime()});
            });
        };

        // Method to format the time period config based on user provided config
        var formatConfig = function (timePeriodElementsConfig) {
            if (_.isBoolean(self.conf.label) && !self.conf.label) {
                timePeriodElementsConfig.elements[0].label = self.conf.label;
            }
            return timePeriodElementsConfig;
        };
        /**
         * Helper method to get time for displaying in time input field.
         * If provided, then displays user defined time value else shows current time from system in required format
         * @returns {Object} with custom_time & period value
         */
        var getDisplayTime = function (value) {
            // HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10 or 23:10 or 23:59:59
            var time = (typeof value == 'string') ? value.trim() : '';
            var ampm = '';
            var custom_time = '';
            if (time.length == 0 || !Validator.isTime(time)) {
                // time not specified in conf, so get it from the client machine in HH:MM:SS AM|PM format
                var datetime = new Date();

                time = dateFormatter.format(datetime, "hh:mm:ss A");

                var split_time = time.split(" ");
                var ampm = split_time[1];
            }

            if ((time.indexOf('AM') > 0) || (time.indexOf('PM') > 0)) {
                ampm = time.substr(time.length - 2, 2);
                custom_time = time.replace(ampm, '').trim();
            } else {
                custom_time = time.trim();
                ampm = "24 hour";
            }

            return {
                time: custom_time,
                period: ampm
            };
        };

        /**
         * Helper method to format the time values (hours, minutes OR seconds)
         * @returns {String} formatted value
         */
        var getNumberString = function (number) {
            if (number < 10) {
                return '0' + number;
            } else {
                return '' + number
            }
        };

        /**
         * Gets the time value of the widget.
         * @instance
         * @returns The time string in HH:MM:SS AM/PM format ot HH:MM:SS (24 hours) format.
         */
        this.getTime = function () {
            var current = this.conf.$container.find('.time_period :selected').val();
            if (current === '24 hour') {
                return this.conf.$container.find('.time_text').val().trim();
            } else {
                return this.conf.$container.find('.time_text').val().trim() + ' ' + current;
            }
        };

        /**
         * Sets the time and period value for the widget.
         * @params string value containing time and period to define the actual time, format as - HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10 or 23:10 or 23:59:59
         */
        this.setValue = function (value) {
            var newTime = getDisplayTime(value);
            this.setTime(newTime.time);
            this.setTimePeriod(newTime.period);
        };

        /**
         * Sets the time value of the widget.
         * @instance
         * @params The time string in HH:MM:SS format.
         */
        this.setTime = function (time) {
            if (time) {
                var time_text = this.conf.$container.find('.time_text');
                time_text.val(time.trim());
                time_text.trigger("change", this.getTime());
            }
        };

        /**
         * Sets the time period value of the widget.
         * @instance
         * @params The time period - can be 'AM', 'PM', or '24 hour'
         */
        this.setTimePeriod = function (timePeriod) {
            if (timePeriod) {
                this.conf.$container.find('.time_period :selected').removeAttr('selected');
                this.conf.$container.find(".time_period option[value='" + timePeriod + "']").prop('selected', true);
                this.conf.$container.find('.time_period').trigger("change", this.getTime());
            }
        };

        /**
         * Enables / Disables the input field and dropdown
         * @instance
         * @param {Boolean} value as true / false
         */
        this.disable = function (value) {
            this.conf.$container.find("input[type='text']").prop('disabled', value);
            this.conf.$container.find('select').prop('disabled', value);
        };


        /**
         * Destroys all elements created by the Time widget
         * @instance
         * @returns {Object} this object
         */
        this.destroy = function () {
            this.conf.$container.empty();
            return this;
        }
    };

    return TimeWidget;
});