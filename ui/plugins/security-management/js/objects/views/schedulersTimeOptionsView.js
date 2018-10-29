/**
 * View to create a scheduler
 * 
 * @module Scheduler
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/schedulerTimeOptionsFormConf.js',
    '../../../../ui-common/js/views/apiResourceView.js'
], function (Backbone, FormWidget, schedulerForm, ResourceView) {

    var SEPARATOR = "time_range_separate_line";
    var DAILY = "DAILY";
    var EXCLUDE = "exclude";
    var ALLDAY = "all-day";
    var TIMERANGE = "timerange";
    var TIME_START = "09:00 AM";
    var TIME_STOP = "05:00 PM";

    var timeOptionsView = ResourceView.extend({

        events: {
            'click #time-options-cancel': "cancel",
            'click #time-options-save': "submit",
            'click #add_time_range_button': "addTimeRange",
            'click #remove_time_range_button': "removeTimeRange"
        },

        submit: function(event) {
            event.preventDefault();

            var value = ALLDAY;
            var type = this.$el.find("input[name=time-options]").val();
            if (this.$el.find("#time-options-exclude").is(":checked")) {
                value = EXCLUDE;
            }

            if (this.$el.find("#time-options-timerange").is(":checked")) {
                var start_time1 = this.getTimeWidgetValue("#time_range_start1");
                var stop_time1 = this.getTimeWidgetValue("#time_range_stop1");
                if (!start_time1) {
                    this.form.showFormError(this.context.getMessage("scheduler_form_time_error", ["Start time"]));
                    return false;
                }
                if (!stop_time1) {
                    this.form.showFormError(this.context.getMessage("scheduler_form_time_error", ["Stop time"]));
                    return false;
                }
                if (!this.validateTimeRange(start_time1, stop_time1)) {
                    this.form.showFormError(this.context.getMessage("scheduler_form_time_range_error"));
                    return false;
                }
                value = start_time1 + "," + stop_time1;
                if (this.hasTwoRanges) {
                    var start_time2 = this.getTimeWidgetValue("#time_range_start2");
                    var stop_time2 = this.getTimeWidgetValue("#time_range_stop2");
                    if (!start_time1) {
                        this.form.showFormError(this.context.getMessage("scheduler_form_time_error", ["Second start time"]));
                        return false;
                    }
                    if (!stop_time1) {
                        this.form.showFormError(this.context.getMessage("scheduler_form_time_error", ["Second stop time"]));
                        return false;
                    }
                    if (!this.validateTimeRange(start_time2, stop_time2)) {
                        this.form.showFormError(this.context.getMessage("scheduler_form_time_range_error"));
                        return false;
                    }
                    value += ";" + start_time2 + "," + stop_time2;
                }
            }
            var result = {
                "day": this.model.get("day"),
                "value": value
            };

            $.proxy(this.addOnResult, this.parentView, result)();
            this.activity.overlay.destroy();
        },

        validateTimeRange: function(time1, time2) {
            var timeArray1 = time1.split(" ");
            var timeArray2 = time2.split(" ");
            if (timeArray1[1] !== timeArray2[1]) {
                return timeArray1[1] < timeArray2[1];
            } else {
                var tempTime1 = timeArray1[0].replace(/^12/, "00"); 
                var tempTime2 = timeArray2[0].replace(/^12/, "00"); 
                return tempTime1 < tempTime2;
            }
        },

        /**
         * Get the timewidget value and turn to 24-hour value
         * @param {String} id - timeWidget ID
         * @return {String} time - time in "09:30 AM" format
         */
        getTimeWidgetValue: function(id) {
            var timeWidget = this.$el.find(id);
            var time_text = timeWidget.find('.time_text').val();
            var time_period = timeWidget.find('.time_period').val();

            var hour = time_text.substring(0, time_text.indexOf(":"));
            var min = time_text.substr(time_text.indexOf(":") + 1, 2);
            if (!parseInt(hour) || parseInt(hour) > "12") { // not a valid hour
                return false;
            }
            time_text = hour + ":" + min;
            return time_text + " " + time_period;
        },

        /**
         * @param {String} id - timewidge id
         * @param {String} value - 09:00 AM
         */
        setTimeWidgetValue: function(id, value) {
            value = value.split(" ");

            if (value[0].length < 6) {
                value[0] += ":00";
            }
            var timeWidget = this.$el.find(id);
            var time_text = timeWidget.find('.time_text').val(value[0]);
            var time_period = timeWidget.find('.time_period').val(value[1]);
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.addOnResult = options.addOnResult;
            this.parentView = options.parentView;
        },

        render: function() {
            var formConfiguration = new schedulerForm(this.context),
            formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();
            this.initForm();

            return this;
        },

        addDynamicFormConfig: function(formConfiguration) {
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            if (this.model.get("title") === "apply_to_all") { // Apply to all days
                var dynamicProperties = {};
                dynamicProperties.title = this.context.getMessage('scheduler_apply_to_all_overlay_title');
                formConfiguration.sections[0]["heading"] = this.context.getMessage('fw_scheduler_times_range_apply_to_all_warning');
                // maybe we should change the info tips as well
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initForm: function() {
            this.$el.addClass("security-management");

            this.$el.find('#'+SEPARATOR).parent().html("<hr id='"+SEPARATOR+"'>").addClass("element-left-align");
            this.$el.find('#'+SEPARATOR).parent().hide();

            this.$el.find('#time_range').hide();

            //workaround, timewidget has redundant label configuration
            this.$el.find('label[for=time_text]').parent().hide();
            //workaround, hide 24 hour options from timewidget
            this.$el.find('option[value="24 hour"]').hide();

            // bind event
            this.$el.find("input[name=time-options]").click($.proxy(this.timeOptionsChange, this));
            this.$el.find("input[name=time-options]").prop("checked", false);
            var timeOptions = this.model.get("time-options");
            if (timeOptions === TIMERANGE) {
                this.$el.find("#time-options-timerange").prop("checked", true);
                this.$el.find("#time-options-timerange").trigger("click");

                this.setTimeWidgetValue("#time_range_start1", this.model.get("start-time1"));
                this.setTimeWidgetValue("#time_range_stop1", this.model.get("stop-time1"));
                if (this.model.get("start-time2")) {
                    this.addTimeRange();
                    this.setTimeWidgetValue("#time_range_start2", this.model.get("start-time2"));
                    this.setTimeWidgetValue("#time_range_stop2", this.model.get("stop-time2"));
                } else {
                    this.setTimeWidgetValue("#time_range_start2", TIME_START);
                    this.setTimeWidgetValue("#time_range_stop2", TIME_STOP);
                }
            } else {
                this.setTimeWidgetValue("#time_range_start1", TIME_START);
                this.setTimeWidgetValue("#time_range_stop1", TIME_STOP);
                this.setTimeWidgetValue("#time_range_start2", TIME_START);
                this.setTimeWidgetValue("#time_range_stop2", TIME_STOP);
                if (timeOptions === ALLDAY) {
                    this.$el.find("#time-options-allday").prop("checked", true);
                    this.$el.find("#time-options-allday").trigger("click");
                } else if (timeOptions === EXCLUDE) {
                    this.$el.find("#time-options-exclude").prop("checked", true);
                    this.$el.find("#time-options-exclude").trigger("click");
                }
            }
        },

        timeOptionsChange: function() {
            var option = this.$el.find('input[type=radio][name=time-options]:checked').val();
            if (option === EXCLUDE || option === ALLDAY) {
                this.$el.find('#time_range').hide();
            } else if (option === TIMERANGE) {
                this.$el.find('#time_range').show();
            }
        },

        /**
         * show second time range
         */
        addTimeRange: function() {
            this.$el.find('#'+SEPARATOR).parent().show();
            this.$el.find('#time_range_start2').parent().show();
            this.$el.find('#time_range_stop2').parent().show();
            this.$el.find('#remove_time_range_button').show();

            this.$el.find('#add_time_range_button').hide();
            this.hasTwoRanges = true;
        },

        /**
         * hide second time range
         */
        removeTimeRange: function() {
            this.$el.find('#'+SEPARATOR).parent().hide();
            this.$el.find('#time_range_start2').parent().hide();
            this.$el.find('#time_range_stop2').parent().hide();
            this.$el.find('#remove_time_range_button').hide();

            this.$el.find('#add_time_range_button').show();
            this.hasTwoRanges = false;
        }
    });

    return timeOptionsView;
});
