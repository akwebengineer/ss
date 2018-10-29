/**
 * A form with schedule and recurrence
 *
 * @module ScheduleRecurrenceForm
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/tooltip/tooltipWidget',
        './conf/scheduleRecurrenceFormConf.js',
        './TimeZoneUtil.js'
], function (Backbone, Syphon, FormWidget, TooltipWidget, FormConf, TimeZoneUtil) {
    var SCHEDULE_TYPE_LATER = 'later',
        SCHEDULE_TYPE_REMOVE = 'remove',
        REPEAT_TYPE_ON = 'on',
        DEFAULT_REPEAT_UNIT = 'Days';

    var getTime24 = function (value) {
        // HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10 or 23:10 or 23:59:59
        var time = value.trim();
        var custom_time = '', pmTag = 'PM', amTag = 'AM';
        if ((time.indexOf(amTag) > 0) || (time.indexOf(pmTag) > 0)) {
            var ampm = time.substr(time.length - 2, 2);
            custom_time = time.replace(ampm, '').trim();
            if(ampm === pmTag){
                try{
                    var timeArr = custom_time.split(':');
                    var hour = parseInt(timeArr[0]),
                        minute = timeArr[1];
                    custom_time = hour + (hour<12 ? 12: 0) + ':' + minute;
                }catch(e){
                    console.log('parse time error');
                }
            }
        } else {
            custom_time = time.substr(0, time.length - 7);
        }
        return custom_time;
    };

    var repeatUnitToDescription = function(repeatUnit, context) {
        var repeatDesc = {
            "Minutes": context.getMessage('signature_database_install_repeat_unit_minutes'),
            "Hours": context.getMessage('signature_database_install_repeat_unit_hours'),
            "Days": context.getMessage('signature_database_install_repeat_unit_days'),
            "Weeks": context.getMessage('signature_database_install_repeat_unit_weeks'),
            "Months": context.getMessage('signature_database_install_repeat_unit_months'),
            "Years": context.getMessage('signature_database_install_repeat_unit_years')
        }
        return repeatDesc[repeatUnit];
    };

    var ScheduleRecurrenceForm = function(conf) {
        this.build = function() {
            this.context = conf.context;
            this.container = conf.container;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();
            // If repeat field is not needed, remove it.
            if(conf.withoutRepeat){
                var sections = [];
                sections.push(formElements.sections[0]);
                formElements.sections = sections;
            }
            // If introductionText is configured, show it
            if(conf.introductionText){
                formElements.sections[0].heading_text = conf.introductionText;
            }
            // If scheduleTypeintroductionText is configured, show it
            if(conf.scheduleTypeintroductionText){
                formElements.sections[0].elements[0]['field-help'] = {'content': conf.scheduleTypeintroductionText};
            }
            // If excludeRecurrenceUnits is configured, remove the excluded recurrence unit options
            if($.isArray(conf.excludeRecurrenceUnits) && (conf.excludeRecurrenceUnits.length > 0) && (formElements.sections.length > 1)){
                var excludeArr = conf.excludeRecurrenceUnits,
                    options = formElements.sections[1].elements[0].values,
                    newOptions = [];
                for(var i = 0; i < options.length; i++){
                    if($.inArray(options[i].value, excludeArr) === -1){
                        newOptions.push(options[i]);
                    }
                }
                formElements.sections[1].elements[0].values = newOptions;
            }

            this.form = new FormWidget({
                container: this.container,
                elements: formElements
            });

            this.form.build();
            this.decoratePage();
            return this;
        };

        this.setScheduleStartInfo = function(startInfo) {
            if(startInfo) {
                this.form.formTemplateHtml.find("#signature-database-config-schedule-later").prop('checked',true).trigger("click");
                if(startInfo.startDateTime){
                    var datetime = new Date(startInfo.startDateTime);
                    this.setScheduleStartDatetime(datetime);
                }
            }
        };

        this.getScheduleStartInfo = function() {
            var startInfo = null;
            var scheduleLater = this.form.formTemplateHtml.find("#signature-database-config-schedule-later");

            var scheduleStartEnabled = scheduleLater.is(":checked");
            if(scheduleStartEnabled) {
                var dateObj = this.form.formTemplateHtml.find('#signature-database-config-schedule-date');
                var dateString = dateObj.val();
                var timeObj = this.form.formTemplateHtml.find('#signature-database-config-schedule-time');

                var time = timeObj.find('.time_text').val(),
                    timePeriod = timeObj.find('.time_period').val();
                var timeString = getTime24(time + timePeriod);
                startInfo = {};
                startInfo.date = dateString;
                startInfo.time = timeString;
                startInfo.startDateTime = this.getAcceptDateTime(startInfo);
            }else{
                var removeSchedule = this.form.formTemplateHtml.find("#signature-database-config-remove-schedule");
                if((removeSchedule.length > 0) && !removeSchedule.is(":hidden") && removeSchedule.is(":checked")){
                    startInfo = {};
                    startInfo.remove = true;
                }
            }
            return startInfo;
        };

        this.setScheduleRecurrenceInfo = function(recurrenceInfo) {
            if(recurrenceInfo){
                this.form.formTemplateHtml.find(".toggle_section > input").prop('checked',true);
                this.form.formTemplateHtml.find(".section_content").removeClass('hide').children().removeClass('hide');
                if(recurrenceInfo.repeatUnit && recurrenceInfo.repeatValue){
                    var intervalObj = this.form.formTemplateHtml.find("#signature-database-repeat-interval"),
                        unitObj = this.form.formTemplateHtml.find("#signature-database-repeat-unit");
                    unitObj.val(recurrenceInfo.repeatUnit);
                    intervalObj.val(recurrenceInfo.repeatValue);
                    this.form.formTemplateHtml.find("#signature-database-repeat-unit").trigger("change");
                }
                if(recurrenceInfo.endInfo){
                    if(recurrenceInfo.endInfo.endDateTime){
                        var datetime = new Date(recurrenceInfo.endInfo.endDateTime);
                        this.setRepeatEndDatetime(datetime);
                    }
                }else{
                    this.form.formTemplateHtml.find("#signature-database-config-repeat-never").prop('checked',true).trigger("click");
                }
            }else{
                this.form.formTemplateHtml.find(".toggle_section > input").prop('checked',false);
                this.form.formTemplateHtml.find(".section_content").addClass('hide').children().addClass('hide');
            }
        };

        this.getScheduleRecurrenceInfo = function() {
            var recurrenceInfo = null,
                section = this.form.formTemplateHtml.find("#signature-database-config-repeat"),
                sectionCheckBox = this.form.formTemplateHtml.find("#signature-database-config-repeat input[type='checkbox']"),
                onObj = this.form.formTemplateHtml.find("#signature-database-config-repeat-on");
            var onEnabled = onObj.is(":checked"),
                recurrenceEnabled = !section.is(":hidden") && sectionCheckBox.is(":checked");
            if(recurrenceEnabled) {
                var intervalObj = this.form.formTemplateHtml.find("#signature-database-repeat-interval"),
                    unitObj = this.form.formTemplateHtml.find("#signature-database-repeat-unit");
                recurrenceInfo = {};
                recurrenceInfo.repeatUnit = unitObj.val();
                recurrenceInfo.repeatValue = intervalObj.val();
                recurrenceInfo.endInfo = null;
                if (onEnabled) {
                    var dateObj = this.form.formTemplateHtml.find('#signature-database-repeat-endtime-date');
                    var dateString = dateObj.val();
                    var timeObj = this.form.formTemplateHtml.find('#signature-database-repeat-endtime-time');

                    var time = timeObj.find('.time_text').val(),
                        timePeriod = timeObj.find('.time_period').val();
                    var timeString = getTime24(time + timePeriod);
                    recurrenceInfo.endInfo = {};
                    recurrenceInfo.endInfo.date = dateString;
                    recurrenceInfo.endInfo.time = timeString;
                    recurrenceInfo.endInfo.endDateTime = this.getAcceptDateTime(recurrenceInfo.endInfo);
              }
            }
            return recurrenceInfo;
        };

        this.decoratePage = function() {
            var formTemplateHtml = this.form.formTemplateHtml;
            formTemplateHtml.find('#signature-database-config-schedule-date').bind('change', $.proxy(this.onScheduleChange, this));
            formTemplateHtml.find('#signature-database-config-schedule-time').bind('change',  $.proxy(this.onScheduleChange, this));
            formTemplateHtml.find('#signature-database-repeat-endtime-date').bind('change',  $.proxy(this.onRepeatEndtimeChange, this));
            formTemplateHtml.find('#signature-database-repeat-endtime-time').bind('change',  $.proxy(this.onRepeatEndtimeChange, this));
            formTemplateHtml.find(':radio[name="schedule-type"]').bind('click',  $.proxy(this.onScheduleLaterChange, this));
            formTemplateHtml.find(':radio[name="repeat-type"]').bind('click',  $.proxy(this.onRepeatEndsChange, this));
            formTemplateHtml.find('#signature-database-repeat-unit').bind('change',  $.proxy(this.onRepeatUnitChange, this));
            formTemplateHtml.find('#signature-database-config-remove-schedule').parent().hide();

            // Display timeZone text
            var timeUnitHtml = '<span class="optionselection inline"><label>' + TimeZoneUtil.getCurrentTimeZoneInfo().timeZone + '</label></span>';
            formTemplateHtml.find("#signature-database-config-schedule-time").children().last().after(timeUnitHtml);
            formTemplateHtml.find("#signature-database-repeat-endtime-time").children().last().after(timeUnitHtml);
            // Display repeat interval text
            var repeatIntervalHtml = '<span class="optionselection inline"><label id="repeat_interval_text"></label></span>';
            formTemplateHtml.find("#signature-database-repeat-interval").after(repeatIntervalHtml);
            // Adjust width for repeat interval
            formTemplateHtml.find("#signature-database-repeat-interval").addClass('repeat-interval');
            formTemplateHtml.find("#signature-database-repeat-unit").trigger("change");
            this.form.formTemplateHtml.find("#signature-database-config-schedule-run-now").trigger("click");
            this.form.formTemplateHtml.find("#signature-database-config-repeat-never").trigger("click");
            this.initDate(new Date());
        };

        this.initDate = function(datetime) {
            this.setScheduleStartDatetime(datetime);
            this.setRepeatEndDatetime(datetime);
        };

        this.setScheduleStartDatetime = function(datetime) {
            var date = '', date_fmt = "MM-DD-YYYY";
            var scheduleDate = this.form.formTemplateHtml.find("#signature-database-config-schedule-date");
            var scheduleDate = this.form.formTemplateHtml.find("#signature-database-config-schedule-date");

            date = Slipstream.SDK.DateFormatter.format(datetime, date_fmt);
            scheduleDate.val(date);
        };

        this.setRepeatEndDatetime = function(datetime) {
            var date = '', date_fmt = "MM-DD-YYYY";
            var repeatDate = this.form.formTemplateHtml.find("#signature-database-repeat-endtime-date");

            date = Slipstream.SDK.DateFormatter.format(datetime, date_fmt);
            repeatDate.val(date);
        };

        this.onScheduleChange = function(event) {
            var scheduleDate = this.form.formTemplateHtml.find("#signature-database-config-schedule-date"),
                scheduleTime = this.form.formTemplateHtml.find("#signature-database-config-schedule-time");
            this.validateFutureDate(event, scheduleDate, scheduleTime);
        },

        this.onRepeatEndtimeChange = function(event) {
            var endDate = this.form.formTemplateHtml.find("#signature-database-repeat-endtime-date"),
                endTime = this.form.formTemplateHtml.find("#signature-database-repeat-endtime-time");
            this.validateFutureDate(event, endDate, endTime);
        };

        this.validateFutureDate = function(event, dateObj, timeObj) {
            var date_fmt_24 = "MM-DD-YYYY HH:mm",
                date = dateObj.val(),
                time = timeObj.find('.time_text').val(),
                timePeriod = timeObj.find('.time_period').val();
            var currentDate = new Date(),
                currentDateHMStr = Slipstream.SDK.DateFormatter.format(currentDate, date_fmt_24),
                currentDateHM = new Date(currentDateHMStr);
            var scheduleDateHMStr = date + ' ' + getTime24(time + timePeriod),
                scheduleDateHM = new Date(scheduleDateHMStr);
            if(scheduleDateHM < currentDateHM){
                console.log('please select a future date');
                this.showErrorInfoForSchedule(event, dateObj, timeObj);
            }else{
                this.removeErrorInfoForSchedule(event, dateObj, timeObj);
            }
        };

        this.showErrorInfoForSchedule = function(event, dateObj, timeObj) {
            var timeText = timeObj.find('#time_text');
            var message = this.context.getMessage('signature_database_install_schedule_error');
            if(event.target.id === dateObj[0].id){
                dateObj.attr("data-invalid", "").parent().addClass('error');
                dateObj.parent().prev().addClass('error');
                dateObj.parent().find("small[class*='error']").text(message);
            }else if(event.target.id === 'time_text' || event.target.id === 'time_period'){
                timeText.attr("data-invalid", "").parent().parent().parent().addClass('error');
                timeText.next().text(message);
            }
        };

        this.removeErrorInfoForSchedule = function(event, dateObj, timeObj) {
            var timeText = timeObj.find('#time_text');
            dateObj.removeAttr('data-invalid').parent().removeClass('error');
            dateObj.parent().prev().removeClass('error');
            timeText.removeAttr('data-invalid').parent().parent().parent().removeClass('error');
        };

        this.onRepeatEndsChange = function(event) {
            var value = $(event.target).val();
            var inputs = this.form.formTemplateHtml.find('#signature-database-repeat-endtime-date').parent().parent().find(':input');
            if(value === REPEAT_TYPE_ON) {
                inputs.removeAttr("disabled");
                this.form.formTemplateHtml.find("#signature-database-repeat-unit").trigger("change");
            }
            else {
                inputs.attr("disabled",true);
                this.form.formTemplateHtml.find('#signature-database-repeat-summary').children().text($(event.target).next().text());
            }
        };

        this.onScheduleLaterChange = function(event) {
            var value = $(event.target).val(),
                inputs = this.form.formTemplateHtml.find('#signature-database-config-schedule-date').parent().parent().find(':input'),
                repeatSection = this.form.formTemplateHtml.find('#signature-database-config-repeat'),
                hideRepeat = false;
            if(value === SCHEDULE_TYPE_LATER) {
                inputs.removeAttr("disabled");
            }else if(value === SCHEDULE_TYPE_REMOVE){
                inputs.attr("disabled",true);
                hideRepeat = true;
            }else {
                inputs.attr("disabled",true);
            }
            if(repeatSection.length > 0){
                if(hideRepeat){
                    repeatSection.hide();
                }else{
                    repeatSection.show();
                }
            }
        };

        this.onRepeatUnitChange = function(event) {
            var label = this.form.formTemplateHtml.find('#repeat_interval_text');
            var interval = this.form.formTemplateHtml.find('#signature-database-repeat-interval').val();
            var repeatUnit = $(event.target).val() ? $(event.target).val() : DEFAULT_REPEAT_UNIT;
            var repeatDescription = repeatUnitToDescription(repeatUnit, this.context);
            label.text(repeatDescription);
            var summary = this.context.getMessage('signature_database_install_repeat_summary_start') + ' ' + interval + ' ' + repeatDescription.toLowerCase();
            this.form.formTemplateHtml.find('#signature-database-repeat-summary').children().text(summary);
        };

        this.getAcceptDateTime = function(dateObject) {
            var scheduleDate = dateObject.date,
                scheduleTime = dateObject.time;
            var scheduleDateArr = scheduleDate.split('-'),
                scheduleTimeArr = scheduleTime.split(':');
            var newDate = new Date();
            try{
                var month = parseInt(scheduleDateArr[0]) - 1,
                    year = parseInt(scheduleDateArr[2]),
                    date = parseInt(scheduleDateArr[1]),
                    hours = parseInt(scheduleTimeArr[0]),
                    minutes = parseInt(scheduleTimeArr[1]);

                newDate.setMinutes(minutes);
                newDate.setHours(hours);
                newDate.setDate(date);
                newDate.setMonth(month);
                newDate.setFullYear(year);
            }catch(e){
                console.log('get time error');
            }
            return Slipstream.SDK.DateFormatter.format(newDate);
        };

        this.showRemoveOption = function () {
            var removeOption = this.form.formTemplateHtml.find('#signature-database-config-remove-schedule'),
                scheduleOption = this.form.formTemplateHtml.find('#signature-database-config-schedule-later');
            removeOption.parent().show();
            scheduleOption.next().text(this.context.getMessage('signature_database_install_schedule_label_update'));
        };
    };

    return ScheduleRecurrenceForm;
});
