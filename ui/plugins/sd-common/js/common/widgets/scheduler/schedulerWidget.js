/**
* Reusable Scheduler Widget for Reports, reuses and customizes scheduleRecurrence.
*
* @module Common (Scheduler Widget)
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    'widgets/scheduleRecurrence/scheduleRecurrenceWidget',
    './models/schedulerModel.js',
    ],
    function(ScheduleRecurrenceWidget, SchedulerModel){

        var SchedulerWidget = Backbone.View.extend({

            initialize: function(options) {
                var me = this, scheduleRecurrence;
                me.options = options;
                me.context = options.context;
                me.model = options.model;
                me.schedulerTitle = options.title;
                /* neverEndsTime: Make it something reasonable.
                   API update doesn't support null or Fri, 31 Dec 9999 23:59:59.
                */
                me.neverEndsTime = new Date(2300, 11, 31); // Mon Dec 31 2300 00:00:00 in user's timezone
                me.validSchedules = [ScheduleRecurrenceWidget.recurrence.repeatUnits.DAYS, ScheduleRecurrenceWidget.recurrence.repeatUnits.WEEKS, ScheduleRecurrenceWidget.recurrence.repeatUnits.MONTHS];
                me.daysMap =  {
                    '1': 'Sunday', 'Sunday': '1',
                    '2': 'Monday', 'Monday': '2',
                    '3': 'Tuesday', 'Tuesday': '3',
                    '4': 'Wednesday', 'Wednesday': '4',
                    '5': 'Thursday', 'Thursday': '5',
                    '6': 'Friday', 'Friday': '6',
                    '7': 'Saturday', 'Saturday': '7'
                };
                me.scheduleTypeMap = {
                    'Hourly': 'Hours',
                    'Hours': 'Hourly',
                    'Daily': 'Days', 
                    'Days': 'Daily',
                    'Weekly': 'Weeks', 
                    'Weeks': 'Weekly',
                    'Monthly': 'Months', 
                    'Months': 'Monthly',
                    'Yearly': 'Years', 
                    'Years': 'Yearly'
                };
            },

            render: function() {
                var me = this,
                schedulerObj = me.model.get("scheduler"),
                startTime = (typeof schedulerObj['start-time'] === 'undefined') ? null : new Date(schedulerObj['start-time']),
                endTime = (typeof schedulerObj['end-time'] === 'undefined') ? null : new Date(schedulerObj['end-time']),
                reOccurence = schedulerObj['re-occurence'] || 0,
                scheduleType = (schedulerObj['schedule-type'] === "Once") ? "later" : schedulerObj['schedule-type'],
                repeatUnit = (!scheduleType) ? null : me.scheduleTypeMap[scheduleType],
                dateOfMonth = (typeof schedulerObj['date-of-month']==='undefined') ? null : schedulerObj['date-of-month'],
                daysOfWeek = (typeof schedulerObj['days-of-week']==='undefined') ? null : schedulerObj['days-of-week'],
                dayOfWeek = (!daysOfWeek || typeof daysOfWeek['day-of-week']==='undefined') ? null : daysOfWeek['day-of-week'],
                selectedDays = (schedulerObj["schedule-type"] == 'Weekly') ? schedulerObj['days-of-week']['day-of-week'] : null;
                if(selectedDays && selectedDays.length>0) {
                    selectedDays = selectedDays.map(function(e) { 
                        return me.daysMap[e];
                    });
                }
                me.daysOfWeekUri = (!daysOfWeek || typeof daysOfWeek['uri']==='undefined') ? null : daysOfWeek['uri'];
                me.daysOfWeekTotal = (!daysOfWeek || typeof daysOfWeek['total']==='undefined') ? null : daysOfWeek['total'];

                var values = {
                    recurrenceInfo: {
                        repeatUnit: me.scheduleTypeMap[scheduleType],
                        repeatValue: reOccurence,
                        selectedDays: selectedDays
                    }
                };

                if(startTime && endTime) {
                    values["scheduleStartTime"] = startTime;
                    if(me.getMilliseconds(endTime) !== me.getMilliseconds(me.neverEndsTime)) {
                        values["recurrenceInfo"]["endTime"] = endTime;
                    }
                }
                if(startTime && scheduleType === "later") {
                     values["scheduleStartTime"] = startTime;
                }

                scheduleRecurrence = new ScheduleRecurrenceWidget({
                    title: me.schedulerTitle,
                    container: me.$el,
                    values: values,
                    recurrenceRepeatUnits:[
                        ScheduleRecurrenceWidget.recurrence.repeatUnits.DAYS,
                        ScheduleRecurrenceWidget.recurrence.repeatUnits.WEEKS,
                        ScheduleRecurrenceWidget.recurrence.repeatUnits.MONTHS
                    ]
                }).build();

                if(!schedulerObj["end-time"]) {
                    me.$el.find(".toggle_section [type='checkbox']").trigger("click");
                }
                return me;
            },

            isValid: function() {
                var me = this, scheduleRecurrenceInfo = scheduleRecurrence.getScheduleRecurrenceInfo();
                if(!scheduleRecurrence.isValid()) {
                    return false;
                }

                if(scheduleRecurrenceInfo && $.inArray(scheduleRecurrenceInfo.repeatUnit, me.validSchedules)>-1 === false) {
                    $(".alert-box").html("<strong><em>Repeat</em></strong> should be Daily, Weekly or Monthly.");
                    $(".alert-box").css("display", "block");
                    return false;
                }
            },

            /**
                On form submit, update SchedulerModel.
                Return updated SchedulerModel to caller activity.
            */
            getValues: function() {
                var me = this;
                var schedulerStartDate = scheduleRecurrence.getScheduleStartTime(), schedulerEndDate,
                    scheduleRecurrenceInfo = scheduleRecurrence.getScheduleRecurrenceInfo(),
                    schedulerObj, reOccurence = 1, daysOfWeek = [], scheduleType;
                if(!schedulerStartDate) {
                    scheduleType = "Now";
                    schedulerStartDate = new Date();
                    schedulerStartDate.setSeconds(2);
                }

                if(scheduleRecurrenceInfo) {
                    reOccurence = me.$el.find(".toggle_section [type='checkbox']").prop('checked') === true ? scheduleRecurrenceInfo.repeatValue : 0,
                    daysOfWeek = scheduleRecurrenceInfo.repeatUnit=='Weeks' ? me.getDaysOfWeek(scheduleRecurrenceInfo.selectedDays) : [],
                    scheduleType = me.scheduleTypeMap[scheduleRecurrenceInfo.repeatUnit];
                    schedulerEndDate = me.getMilliseconds(scheduleRecurrenceInfo.endTime);
                    schedulerEndDate = isNaN(schedulerEndDate) ? me.neverEndsTime : schedulerEndDate; // Ends Never.
                    schedulerStartDate = (schedulerStartDate===null) ? new Date() : schedulerStartDate // API won't allow start-time null.
                }

                if(schedulerStartDate && !scheduleType) {
                    scheduleType = "Once";
                    reOccurence  = 0;
                }

                schedulerObj = {
                    "start-time": me.getMilliseconds(schedulerStartDate),
                    "schedule-type": scheduleType,
                    "re-occurence": reOccurence, // 0 else 1 or more.
                    "date-of-month": schedulerStartDate.getDate(),
                    "end-time": me.getMilliseconds(schedulerEndDate),
                    "days-of-week": {
                        "day-of-week": daysOfWeek,
                        "uri": me.daysOfWeekUri,
                        "total": me.daysOfWeekTotal
                    }
                }
                me.model.set("scheduler", schedulerObj);
            },
            getMilliseconds: function(date) {
                if(!date) return date;
                var d = new Date(date);
                var ms = d.getTime();
                return ms;
            },
            getDaysOfWeek: function(days) {
                var me = this; daysText = new Array();
                if(days.length > 0) {
                    for(var i=0; i<days.length; i++) {
                        daysText.push(me.daysMap[days[i]]);
                    }
                    return daysText;
                }
                return days;
            },
            destroy: function(){
                scheduleRecurrence && scheduleRecurrence.destroy();
            }
        });
        return SchedulerWidget;
});