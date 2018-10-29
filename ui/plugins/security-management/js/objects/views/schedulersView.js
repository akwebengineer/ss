/**
 * View to create a scheduler
 * 
 * @module Scheduler
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/schedulerFormConfiguration.js',
    '../models/schedulerModel.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    './schedulersTimeOptionsView.js',
    './schedulerUtility.js',
    'text!../templates/schedulerWeeklyDays.html',
    '../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone, Syphon, FormWidget, schedulerForm, schedulerModel, 
        ResourceView, TimeOptionsView, SchedulerUtility, WeeklyDaysTemplate, ValidationUtility) {
    var DAILY = "DAILY",
        APPLY_TO_ALL = "apply_to_all",
        REQUIRED = "required",
        EXCLUDE = "exclude",
        ALLDAY = "all-day",
        DATERANGE = "daterange";

    var HTML_BR = "<br/>",
        HTML_INPUT = " input",
        HTML_SELECT = " select",
        AM_TAG = "AM",
        DATE_TIME_DEFAULT = "12:00";

    var START_DATE_ID_1 = "start-date1",
        STOP_DATE_ID_1 = "stop-date1",
        START_DATE_ID_2 = "start-date2",
        STOP_DATE_ID_2 = "stop-date2",
        START_DATE_TIME_ID_1 = "start-date1-time",
        STOP_DATE_TIME_ID_1 = "stop-date1-time",
        START_DATE_TIME_ID_2 = "start-date2-time",
        STOP_DATE_TIME_ID_2 = "stop-date2-time",
        START_TIME_ID_1 = "start-time1",
        STOP_TIME_ID_1 = "stop-time1",
        START_TIME_ID_2 = "start-time2",
        STOP_TIME_ID_2 = "stop-time2";

    var schedulerView = ResourceView.extend({
        events: {
            'click #scheduler-save': "submit",
            'click #scheduler-cancel': "cancel",
            'click #date-forever': "dateRangeTypeChange",
            'click #date-range': "dateRangeTypeChange",
            'click #time-range-specify': "timeRangeClick"
        },

        submit: function(event) {
            event.preventDefault();

            var params = Syphon.serialize(this);
            if (params["date-range-type"] === DATERANGE && !this.isDateValid(params)) {
                return false;
            }

            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                this.form.showFormError(this.context.getMessage("scheduler_form_validate_error"));
                return false;
            }

            var jsonDataObj = {
                "name" : params["name"],
                "description" : params["description"]
            };
            if (params["date-range-type"] === DATERANGE) { // has specify date range
                var time;
                if (params[START_DATE_ID_1] && params[STOP_DATE_ID_1]) {
                    time = this.getDateTimeValue(START_DATE_TIME_ID_1);
                    time = SchedulerUtility.getTime24(time);
                    jsonDataObj[START_DATE_ID_1] = SchedulerUtility.formatDate(params[START_DATE_ID_1]) + "." + time;

                    time = this.getDateTimeValue(STOP_DATE_TIME_ID_1);
                    time = SchedulerUtility.getTime24(time);
                    jsonDataObj[STOP_DATE_ID_1] = SchedulerUtility.formatDate(params[STOP_DATE_ID_1]) + "." + time;
                }
                if (params[START_DATE_ID_2] && params[STOP_DATE_ID_2]) {
                    time = this.getDateTimeValue(START_DATE_TIME_ID_2);
                    time = SchedulerUtility.getTime24(time);
                    jsonDataObj[START_DATE_ID_2] = SchedulerUtility.formatDate(params[START_DATE_ID_2]) + "." + time;

                    time = this.getDateTimeValue(STOP_DATE_TIME_ID_2);
                    time = SchedulerUtility.getTime24(time);
                    jsonDataObj[STOP_DATE_ID_2] = SchedulerUtility.formatDate(params[STOP_DATE_ID_2]) + "." + time;
                }
            } else { // delete current configuration. don't set undefined here because that value will be ignored by model
                jsonDataObj[START_DATE_ID_1] = "";
                jsonDataObj[STOP_DATE_ID_1] = "";
                jsonDataObj[START_DATE_ID_2] = "";
                jsonDataObj[STOP_DATE_ID_2] = "";
            }

            if (params["time-range-specify"]) { // has specify configuration for each day.
                this.schedulesArray.forEach(function(item) {
                    if(item[START_TIME_ID_1]) {
                        item[START_TIME_ID_1] = SchedulerUtility.getTime24(item[START_TIME_ID_1]);
                    }
                    if(item[STOP_TIME_ID_1]) {
                        item[STOP_TIME_ID_1] = SchedulerUtility.getTime24(item[STOP_TIME_ID_1]);
                    }
                    if(item[START_TIME_ID_2]) {
                        item[START_TIME_ID_2] = SchedulerUtility.getTime24(item[START_TIME_ID_2]);
                    }
                    if(item[STOP_TIME_ID_2]) {
                        item[STOP_TIME_ID_2] = SchedulerUtility.getTime24(item[STOP_TIME_ID_2]);
                    }
                });
                jsonDataObj.schedules = {
                    schedule: this.schedulesArray
                };
            } else { // set all-day for daily if time-range not specified
                jsonDataObj.schedules = {
                    schedule: [{
                        "day": DAILY,
                        "exclude" : false,
                        "all-day" : true
                    }]
                };
            }
            this.bindModelEvents();
            this.model.set(jsonDataObj);
            this.model.save();
        },

        /**
         * validate date range:
         * 1. stop date should be after start date 
         * 2. stop date should be specified if start date is not empty
         * 3. date value should not empty when date range is required
         */
        isDateValid: function(params) {
            var dateRangeInvalid = false,
                dateRangeRequiredInvalid = false;
            // at least one date field values is invalid
            this.$el.find("input[widget-type=datepicker]").each(function(idx, element) {
                if ($(element).parent().hasClass("error")) {
                    dateRangeInvalid = true;
                    if ($(element).prop(REQUIRED)) {
                        dateRangeRequiredInvalid = true;
                    }
                }
            });
            if (dateRangeInvalid) {
                if (dateRangeRequiredInvalid) {
                    this.form.showFormError(this.context.getMessage("scheduler_form_validate_error_required"));
                } else {
                    this.form.showFormError(this.context.getMessage("scheduler_form_validate_error"));
                }
                return false;
            }

            if (params[START_DATE_ID_1] && !params[STOP_DATE_ID_1]) {
                // no end date specified
                this.showElementErrorMsg(STOP_DATE_ID_1, "scheduler_error_end_date_invalid", "scheduler_form_date_range_error");
                return false;
            }
            if (params[START_DATE_ID_2] && !params[STOP_DATE_ID_2]) {
                this.showElementErrorMsg(STOP_DATE_ID_2, "scheduler_error_end_date_invalid", "scheduler_form_date_range_error");
                return false;
            }
            if (params[START_DATE_ID_1] && params[STOP_DATE_ID_1]) {
                var startDate1 = new Date(params[START_DATE_ID_1]);
                var stopDate1 = new Date(params[STOP_DATE_ID_1]);
                if (startDate1 > stopDate1) {
                    // start date is after end date
                    this.showElementErrorMsg(STOP_DATE_ID_1, "scheduler_error_date_range_invalid", "scheduler_form_date_invalidate_error");
                    return false;
                } else if (startDate1.toISOString() == stopDate1.toISOString()) {
                    var time1 = SchedulerUtility.getTime24(this.getDateTimeValue(START_DATE_TIME_ID_1));
                    var time2 = SchedulerUtility.getTime24(this.getDateTimeValue(STOP_DATE_TIME_ID_1));
                    if (time1 >= time2) {
                        this.showElementErrorMsg(STOP_DATE_ID_1, "scheduler_error_date_range_invalid", "scheduler_form_date_invalidate_error");
                        return false;
                    }
                }
            }
            if (params[START_DATE_ID_2] && params[STOP_DATE_ID_2]) {
                var startDate2 = new Date(params[START_DATE_ID_2]);
                var stopDate2 = new Date(params[STOP_DATE_ID_2]);
                if (startDate2 > stopDate2) {
                    // start date is after end date
                    this.showElementErrorMsg(STOP_DATE_ID_2, "scheduler_error_date_range_invalid", "scheduler_form_date_invalidate_error");
                    return false;
                } else if (startDate2.toISOString() == stopDate2.toISOString()) {
                    var time1 = SchedulerUtility.getTime24(this.getDateTimeValue(START_DATE_TIME_ID_2));
                    var time2 = SchedulerUtility.getTime24(this.getDateTimeValue(STOP_DATE_TIME_ID_2));
                    if (time1 >= time2) {
                        this.showElementErrorMsg(STOP_DATE_ID_2, "scheduler_error_date_range_invalid", "scheduler_form_date_invalidate_error");
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * Show form error notification as well as element error message
         */
        showElementErrorMsg : function(eleID, eleErrMsgKey, formErrMsgKey) {
            this.form.showFormError(this.context.getMessage(formErrMsgKey));
            this.$el.find("#" + eleID + " ~small").text(this.context.getMessage(eleErrMsgKey));
            this.$el.find("#" + eleID).parent().addClass("error");
        },

        /**
         * Create overlay for time options view
         * and build model for data render
         * @param {String} param - value is like "sunday" or "monday", etc.
         */
        showTimeOptionsView: function(param) {
            var model = new Backbone.Model();
            if (param === APPLY_TO_ALL) {
                model.set("title", APPLY_TO_ALL);
                model.set("day", APPLY_TO_ALL);
                model.set("time-options", ALLDAY);
            } else {
                for (var i = 0, len = this.schedulesArray.length; i < len; i++) {
                    var schedule = this.schedulesArray[i];
                    if (schedule.id === param) {
                        model.set("title", schedule.title);
                        model.set("day", schedule.id);
                        if (schedule[ALLDAY]) {
                            model.set("time-options", ALLDAY);
                        } else if (schedule[EXCLUDE]) {
                            model.set("time-options", EXCLUDE);
                        } else {
                            model.set("time-options", "timerange");
                            model.set(START_TIME_ID_1, schedule[START_TIME_ID_1]);
                            model.set(STOP_TIME_ID_1, schedule[STOP_TIME_ID_1]);
                            model.set(START_TIME_ID_2, schedule[START_TIME_ID_2]);
                            model.set(STOP_TIME_ID_2, schedule[STOP_TIME_ID_2]);
                        }
                        break;
                    }
                }
            }
            var view = new TimeOptionsView({
                activity: this.activity,
                parentView: this,
                addOnResult: this.onTimeOptionsChange,
                model: model
            });
            this.activity.buildOverlay(view, {"size": "small"});
        },

        /**
         * callback function for time options view OK button
         * Update days elements' value and style
         * @param {Object} result - have two required keys: "day"  and "value"
         * {"day": "sunday", "value": "09:00 AM, 12:30 PM;02:00 PM,05:30 PM"
         */
        onTimeOptionsChange: function(result) {
            // save the new value in this.schedulesArray
            if (result.day === APPLY_TO_ALL) {//Apply to all
                for (var i = 0, len = this.schedulesArray.length; i < len; i++) {
                    var schedule = this.schedulesArray[i];
                    this.updateScheduleValue(schedule, result.value);
                    this.updateDayElements(schedule.id, result.value);
                }
            } else {
                var schedule;
                for (var i = 0, len = this.schedulesArray.length; i < len; i++) {
                    if (this.schedulesArray[i].id === result.day) {
                        schedule = this.schedulesArray[i];
                        break;
                    }
                }
                this.updateScheduleValue(schedule, result.value);
                this.updateDayElements(result.day, result.value);
            }
        },

        //set all attributes as undefined or false
        clearSchedule: function(schedule) {
            schedule[EXCLUDE] = schedule[ALLDAY] = false;
            schedule[START_TIME_ID_1] = schedule[STOP_TIME_ID_1] = undefined;
            schedule[START_TIME_ID_2] = schedule[STOP_TIME_ID_2] = undefined;
            return schedule;
        },

        /**
         * update schedule object with the value which is from timeOptionsView
         *  
         * @param {Object} schedule - Object with all attributes
         * @param {String} value - "all-day", "exclude" or "09:30 AM, 05:30 PM"
         */
        updateScheduleValue: function(schedule, value) {
            this.clearSchedule(schedule);
            if (value === EXCLUDE) {
                schedule[EXCLUDE] = true;
            } else if (value === ALLDAY) {
                schedule[ALLDAY] = true;
            } else {
                var timerange = value.split(";");
                if (!_.isEmpty(timerange[0])) {
                    var starttime1 = timerange[0].split(",");
                    schedule[START_TIME_ID_1] = starttime1[0];
                    schedule[STOP_TIME_ID_1] = starttime1[1];
                }
                if (!_.isEmpty(timerange[1])) {
                    var starttime2 = timerange[1].split(",");
                    schedule[START_TIME_ID_2] = starttime2[0];
                    schedule[STOP_TIME_ID_2] = starttime2[1];
                }
            }
            return schedule;
        },

        /**
         * Update corresponding element with new value and css
         * @param {String} day - "sunday", "monday", etc.
         * @param {String} value - "all-day", "exclude" or "09:30 AM, 05:30 PM"
         */
        updateDayElements: function(day, value) {
            var string_to = this.context.getMessage("scheduler_day_option_range_to");
            if (value === EXCLUDE) {
                this.$el.find('#' + day + '-value').html(this.context.getMessage("scheduler_day_option_excluded"));
                this.$el.find('#' + day + '-value-second').html("");
                this.$el.find("#scheduler-weekly-"+ day).addClass("excluded");
            } else if (value === ALLDAY) {
                this.$el.find('#' + day + '-value').html(this.context.getMessage("scheduler_day_option_allday"));
                this.$el.find('#' + day + '-value-second').html("");
                this.$el.find("#scheduler-weekly-"+ day).removeClass("excluded");
            } else {// time range
                value = value.split(";");
                if (!_.isEmpty(value[0])) {
                    var timerange = value[0].split(",");
                    this.$el.find('#' + day + '-value').html(timerange[0] + " " + string_to + HTML_BR + timerange[1]);
                } else {
                    this.$el.find('#' + day + '-value').html("");
                }
                if (!_.isEmpty(value[1])) {
                    var timerange = value[1].split(",");
                    /*
                     *  if use $.find() the result is [] and _.isEmpty() is true. 
                     *  while this.$el.find result is [], but _.isEmpty() is not true.
                     *  because it contains some other elements like "context", "prevObject", "selector" etc.
                     *  so I have to use length==0 to check the result. Any good idea?
                     */
                    var secondTimeRangeEL = this.$el.find('#' + day + '-value-second');
                    if (secondTimeRangeEL.length == 0) { // not render the second label at initial, add it
                        this.$el.find('#' + day + '-value').after("<div id="+day+"-value-second></div>");
                    }
                    this.$el.find('#' + day + '-value-second').html(HTML_BR + timerange[0] + " " + string_to + HTML_BR + timerange[1]);
                } else {
                    this.$el.find('#' + day + '-value-second').html("");
                }
                this.$el.find("#scheduler-weekly-"+ day).removeClass("excluded");
            }
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.activity = options.activity;
            this.context = options.activity.getContext();

            _.extend(this, ValidationUtility);

            this.weekDays = {
                    "SUNDAY": ["sunday", this.context.getMessage("scheduler_day_selection_sunday")],
                    "MONDAY": ["monday", this.context.getMessage("scheduler_day_selection_monday")],
                    "TUESDAY": ["tuesday", this.context.getMessage("scheduler_day_selection_tuesday")],
                    "WEDNESDAY": ["wednesday", this.context.getMessage("scheduler_day_selection_wednesday")],
                    "THURSDAY": ["thursday", this.context.getMessage("scheduler_day_selection_thursday")],
                    "FRIDAY": ["friday", this.context.getMessage("scheduler_day_selection_friday")],
                    "SATURDAY": ["saturday", this.context.getMessage("scheduler_day_selection_saturday")]
            };

            this.successMessageKey = 'scheduler_create_success';
            this.editMessageKey = 'scheduler_edit_success';
            this.fetchErrorKey = 'scheduler_fetch_error';
            this.fetchCloneErrorKey = 'scheduler_fetch_clone_error';
        },

        render: function() {
            var formConfiguration = new schedulerForm(this.context),
            formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.setModelDateTime();
            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();

            this.initForm();
            this.addSubsidiaryFunctions(formElements);

            return this;
        },

        // dynamic title for this overlay
        addDynamicFormConfig: function(formConfiguration) {
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    this.model.set("title", this.context.getMessage('scheduler_edit'));
                    break;
                case this.MODE_CREATE:
                    this.model.set("title", this.context.getMessage('scheduler_create'));
                    break;
                case this.MODE_CLONE:
                    this.model.set("title", this.context.getMessage('scheduler_clone'));
                    break;
            }
        },

        /**
         * render new element for days after form's build
         * Also bind event, hide or show elements according to model value, etc.
         */
        initForm: function() {
            this.$el.addClass("security-management");
            //workaround, hide 24 hour options from timewidget
            this.$el.find('option[value="24 hour"]').hide();

            // hide those elements what should not be shown first
            this.$el.find("#scheduler_date_range").hide();
            this.$el.find("#scheduler_times").hide();
            this.$el.find("#separate_line").hide();
            this.$el.find("#separate_line").parent().html("<hr>").addClass("element-left-align");

            this.$el.find("input[widget-type=datepicker]").attr("data-afterDate", SchedulerUtility.getAfterDate());
            this.$el.find("#" + START_DATE_ID_1).on("checkRequired", $.proxy(this.updateDateRangeErrorMsg, this));
            this.$el.find("#" + STOP_DATE_ID_1).on("checkRequired", $.proxy(this.updateDateRangeErrorMsg, this));

            this.buildScheduleObjects();
            this.renderWeeklyDays();
            this.$el.find("#apply_to_all_days").click($.proxy(this.showTimeOptionsView, this, APPLY_TO_ALL));

            var schedules = this.model.get("schedules") ? this.model.get("schedules").schedule : [];
            var dailyOption = false;
            for (var i = 0, len = schedules.length; i < len; i++) {
                if (schedules[i]["day"] == "DAILY") {
                    dailyOption = true;
                    break;
                }
            }
            if (!dailyOption && !_.isEmpty(schedules)) {
                this.$el.find("#time-range-specify").prop("checked", true);
                this.timeRangeClick();
            }
            if (!_.isEmpty(this.model.get(START_DATE_ID_1)) ||
                    !_.isEmpty(this.model.get(START_DATE_ID_2))) {
                this.$el.find("#date-forever").prop("checked", false);
                this.$el.find("#date-range").prop("checked", true);
                this.dateRangeTypeChange();
            }

            // set value for dateTimeWidget according to model data
            this.setDateTimeValue();
        },

        /**
         * Just need to set time value as date can be set automatically
         */
        setDateTimeValue: function() {
            var temp;
            if (!_.isEmpty(this.model.get(START_DATE_ID_1))) {
                temp = this.model.get(START_DATE_TIME_ID_1);
                temp = temp.split(" ");
                this.$el.find("#"+START_DATE_TIME_ID_1 + HTML_INPUT).val(temp[0]);
                this.$el.find("#"+START_DATE_TIME_ID_1 + HTML_SELECT).val(temp[1]);

                temp = this.model.get(STOP_DATE_TIME_ID_1);
                temp = temp.split(" ");
                this.$el.find("#"+STOP_DATE_TIME_ID_1 + HTML_INPUT).val(temp[0]);
                this.$el.find("#"+STOP_DATE_TIME_ID_1 + HTML_SELECT).val(temp[1]);
            } else {
                this.$el.find("#"+START_DATE_TIME_ID_1 + HTML_INPUT).val(DATE_TIME_DEFAULT);
                this.$el.find("#"+START_DATE_TIME_ID_1 + HTML_SELECT).val(AM_TAG);
                this.$el.find("#"+STOP_DATE_TIME_ID_1 + HTML_INPUT).val(DATE_TIME_DEFAULT);
                this.$el.find("#"+STOP_DATE_TIME_ID_1 + HTML_SELECT).val(AM_TAG);
            }

            if (!_.isEmpty(this.model.get(START_DATE_ID_2))) {
                temp = this.model.get(START_DATE_TIME_ID_2);
                temp = temp.split(" ");
                this.$el.find("#"+START_DATE_TIME_ID_2 + HTML_INPUT).val(temp[0]);
                this.$el.find("#"+START_DATE_TIME_ID_2 + HTML_SELECT).val(temp[1]);

                temp = this.model.get(STOP_DATE_TIME_ID_2);
                temp = temp.split(" ");
                this.$el.find("#"+STOP_DATE_TIME_ID_2 + HTML_INPUT).val(temp[0]);
                this.$el.find("#"+STOP_DATE_TIME_ID_2 + HTML_SELECT).val(temp[1]);
            } else {
                this.$el.find("#"+START_DATE_TIME_ID_2 + HTML_INPUT).val(DATE_TIME_DEFAULT);
                this.$el.find("#"+START_DATE_TIME_ID_2 + HTML_SELECT).val(AM_TAG);
                this.$el.find("#"+STOP_DATE_TIME_ID_2 + HTML_INPUT).val(DATE_TIME_DEFAULT);
                this.$el.find("#"+STOP_DATE_TIME_ID_2 + HTML_SELECT).val(AM_TAG);
            }
        },

        getDateTimeValue: function(id) {
            var time = this.$el.find("#" + id + HTML_INPUT).val();
            var period = this.$el.find("#" + id + HTML_SELECT).val();
            return time + " " + period;
        },

        /**
         * Render days elements according to template and data
         * Record all the schedules as an object, so that we can get these values easily during submit
         * this method must be invoked after buildScheduleObjects which will build this.schedulesArray for it
         */
        renderWeeklyDays: function() {
            var self = this;

            // render days elements
            var data = {
                schedule: this.schedulesArray,
                fieldLabels: SchedulerUtility.getFieldLabels(this.context)
            };

            var daysEl = this.$el.find("#scheduler-weekly-days-placeholder").parent().parent();
            daysEl.hide();
            daysEl.parent().append(Slipstream.SDK.Renderer.render(WeeklyDaysTemplate, data));

            this.schedulesArray.forEach(function(item) {
                var day = self.weekDays[item.day][0];
                // update excluded day's class
                if (item["exclude"]) {
                    self.$el.find("#scheduler-weekly-"+ day).addClass("excluded");
                }
                // bind click event to all elements
                self.$el.find("#scheduler-weekly-"+day).click($.proxy(self.showTimeOptionsView, self, day));
            });
        },

        /**
         * get date and time value and return as array
         * @param {String} date - value like "2016-01-14.14:21"
         * 
         * @return ["01/14/2016", "02:21 PM"]
         */
        separateDateAndTime: function(date) {
            var time = date.substring( date.indexOf(".") + 1, date.length);
            date = date.substring(0, date.indexOf("."));

            date = SchedulerUtility.formatDate(date, SchedulerUtility.DATE_DISPLAY_FORMAT);
            time = SchedulerUtility.getTimeAMPM(time);
            return [date, time];
        },

        /**
         * set start/stop date and time repectively since dateTimeWidget cannot get value from conf
         */
        setModelDateTime: function(date) {
            var temp;
            if (this.model.get(START_DATE_ID_1)) {
                temp = this.separateDateAndTime(this.model.get(START_DATE_ID_1));
                this.model.set(START_DATE_ID_1, temp[0]);
                this.model.set(START_DATE_TIME_ID_1, temp[1]);
            }
            if (this.model.get(STOP_DATE_ID_1)) {
                temp = this.separateDateAndTime(this.model.get(STOP_DATE_ID_1));
                this.model.set(STOP_DATE_ID_1, temp[0]);
                this.model.set(STOP_DATE_TIME_ID_1, temp[1]);
            }
            if (this.model.get(START_DATE_ID_2)) {
                temp = this.separateDateAndTime(this.model.get(START_DATE_ID_2));
                this.model.set(START_DATE_ID_2, temp[0]);
                this.model.set(START_DATE_TIME_ID_2, temp[1]);
            }
            if (this.model.get(STOP_DATE_ID_2)) {
                temp = this.separateDateAndTime(this.model.get(STOP_DATE_ID_2));
                this.model.set(STOP_DATE_ID_2, temp[0]);
                this.model.set(STOP_DATE_TIME_ID_2, temp[1]);
            }
        },

        /**
         * Record schedules in an member variable - this.schedulesArray
         * This object data will sync up with days elements' value
         */
        buildScheduleObjects: function () {
            var originalSchedules = this.model.get("schedules");
            if (originalSchedules) {
                originalSchedules = originalSchedules.schedule ? originalSchedules.schedule : [];
            } else {
                originalSchedules = [];
            }

            var schedule = [],
                days = Object.keys(this.weekDays);

            for (var i = 0, len = days.length; i < len; i++) {
                var day = days[i],
                    found = false;
                for (var j = 0, length = originalSchedules.length; j < length; j++) {
                    if (originalSchedules[j].day === day) {
                        originalSchedules[j].id = this.weekDays[day][0];
                        originalSchedules[j].title = this.weekDays[day][1];
                        if (originalSchedules[j][START_TIME_ID_1]) {
                            originalSchedules[j][START_TIME_ID_1] = SchedulerUtility.getTimeAMPM(originalSchedules[j][START_TIME_ID_1]);
                        }
                        if (originalSchedules[j][STOP_TIME_ID_1]) {
                            originalSchedules[j][STOP_TIME_ID_1] = SchedulerUtility.getTimeAMPM(originalSchedules[j][STOP_TIME_ID_1]);
                        }
                        if (originalSchedules[j][START_TIME_ID_2]) {
                            originalSchedules[j][START_TIME_ID_2] = SchedulerUtility.getTimeAMPM(originalSchedules[j][START_TIME_ID_2]);
                        }
                        if (originalSchedules[j][STOP_TIME_ID_2]) {
                            originalSchedules[j][STOP_TIME_ID_2] = SchedulerUtility.getTimeAMPM(originalSchedules[j][STOP_TIME_ID_2]);
                        }
                        schedule.push(originalSchedules[j]);
                        found = true;
                        break;
                    }
                }

                if (!found) { // not configured before, so set as all-day
                    schedule.push({
                        "day": day,
                        "exclude" : false,
                        "all-day" : true,
                        "id" : this.weekDays[day][0],
                        "title" : this.weekDays[day][1]
                    });
                }
            }
            this.schedulesArray = schedule;
        },

        dateRangeTypeChange: function() {
            var dateRange = this.$el.find("input[type=radio][name=date-range-type]:checked").val();
            if (dateRange == "forever") {
                this.$el.find("#scheduler_date_range").hide();
            } else if (dateRange == DATERANGE) {
                this.$el.find("#scheduler_date_range").show();
            }
            this.determineDateRangeRequired();
        },

        timeRangeClick: function() {
            var specifyEnabled = this.$el.find("#time-range-specify").is(':checked');
            if (specifyEnabled) {
                this.$el.find("#scheduler_times").show();
            } else {
                this.$el.find("#scheduler_times").hide();
            }
            this.determineDateRangeRequired();
        },

        determineDateRangeRequired: function() {
            var dateRange = this.$el.find("input[type=radio][name=date-range-type]:checked").val();
            var timeRange = this.$el.find("#time-range-specify").is(':checked');
            if (dateRange === "forever" || timeRange) {
                this.$el.find("#"+START_DATE_ID_1).prop(REQUIRED, false);
                this.$el.find("#"+STOP_DATE_ID_1).prop(REQUIRED, false);
                this.$el.find("[data-widgetidentifier=dateTime_date_start1_time] label").removeClass(REQUIRED);
                this.$el.find("[data-widgetidentifier=dateTime_date_stop1_time] label").removeClass(REQUIRED);
            } else {
                this.$el.find("#"+START_DATE_ID_1).prop(REQUIRED, true);
                this.$el.find("#"+STOP_DATE_ID_1).prop(REQUIRED, true);
                this.$el.find("[data-widgetidentifier=dateTime_date_start1_time] label").addClass(REQUIRED);
                this.$el.find("[data-widgetidentifier=dateTime_date_stop1_time] label").addClass(REQUIRED);
            }
        },

        /**
         * The first date-range must be specified if user choose "custom" date-range and not specified time-range
         * In this case, the error msg should be updated to "this field is required"
         */
        updateDateRangeErrorMsg: function(e, isValid) {
            var comp = $(e.target),
                value = comp.val();
            if (comp.prop(REQUIRED) && _.isEmpty(value)) {
                comp.find("~small").text(this.context.getMessage("require_error"));
            }
        }
    });

    return schedulerView;
});
