/**
* Time Picker Widget, displays time and unit
*
* @module sd-common (Time Picker Widget)
* @author Shini <shinig@juniper.net>
* @copyright Juniper Networks, Inc. 2016
**/

define([
    'widgets/form/formWidget',
    './conf/timePickerConf.js',
    './utils/timePickerConstants.js',
    '../../../../../ui-common/js/common/utils/filterUtil.js'
    ],
    function(FormWidget, TimePickerConf, TimePickerConstants, FilterUtil){

        var TimePickerWidget = function (conf) {

        this.widgetConf = {
            "$container": $(conf.container),
            "units": conf.units,
            "values": conf.values
        };
        filterUtil = new FilterUtil();

         /**
          * Builds the Time Picker Widget in the specified container
          * @returns {Object} Current instance (this) of the class
          */
        this.build = function(){

            var widgetContainer = $("<div>", {'class' : "time-picker-widget"});
            this.widgetConf.$container.empty().append(widgetContainer);

            timePickerConf = new TimePickerConf(conf);
            this.widgetConf.formWidget = new FormWidget({
                "elements": timePickerConf.getValues(),
                "container": $("<div>"),
                "values": this.widgetConf.values
            }).build();

          var $sections = this.widgetConf.formWidget.formTemplateHtml.find(".form_section");
            widgetContainer.append($sections);
            return this;
        };

        /**
         * Get the time duration and duration unit
         * @returns {Object} Duration object containing duration and duration-unit.
         */

        this.getValues = function(){
            var durationObj = {},
                duration = this.widgetConf.$container.find("[id^=duration]").val(),
                duration_unit = this.widgetConf.$container.find("[id^=duration-unit]").val();
                duration_unit = TimePickerConstants.DURATION_UNIT_VALUES[duration_unit];

            duration = filterUtil.getDurationInMS(duration, duration_unit);
            durationObj = {
                "duration": duration,
                "duration-unit": duration_unit
            };

            return durationObj;
        };

        /**
         * Set the duration and duration unit
         * @param {conf} object containing duration and duration-unit.
         */
        this.setValues = function(setConf) {
            var duration_unit = setConf["duration-unit"],
                constant = TimePickerConstants.DURATION_UNIT_MAPPING,
                duration = filterUtil.getDurationBasedOnUnit(setConf["duration-unit"], setConf["duration"]);
            this.widgetConf.$container.find("[id^=duration]").val(duration);
            this.widgetConf.$container.find("[id^=duration-unit]").val(constant[duration_unit]);
        };

        this.destroyForm = function() {
            this.widgetConf.formWidget.destroy();
        };
    };

    /**
     * Define the duration units of the value, the interval between recurrences.  e.g. : "Days", "Weeks"
     */

    TimePickerWidget.repeatUnits = TimePickerConstants.DURATION_UNITS;
    TimePickerWidget.unitMapping = TimePickerConstants.DURATION_UNIT_MAPPING;

    return TimePickerWidget;
});
