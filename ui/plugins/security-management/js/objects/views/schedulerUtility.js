/**
 * A object for some common methods in Scheduler features.
 * 
 * @module SchedulerUtility
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function() {

    var AM_TAG = "AM",
        PM_TAG = "PM";

    var SchedulerUtility = {
        DATE_DISPLAY_FORMAT: "MM/DD/YYYY",
        DATE_SAVE_FORMAT: "YYYY-MM-DD",
        /**
         * Convert 12-hour time system to 24-hour time system
         * @param {String} value - time in 12-hour system (HH:MM[:SS] [AM|PM])
         */
        getTime24 : function(value) {
            // HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10
            // or 23:10 or 23:59:59
            var custom_time = '', time = value.trim();
            if ((time.indexOf(AM_TAG) > 0) || (time.indexOf(PM_TAG) > 0)) {
                var ampm = time.split(" ")[1];
                custom_time = time.split(" ")[0];
                if (ampm === PM_TAG) {
                    try {
                        var timeArr = custom_time.split(':');
                        if (timeArr[0] == '12') {
                            timeArr[0] = '00';
                        }
                        timeArr[0] = parseInt(timeArr[0], 10) + 12;
                        custom_time = timeArr.join(':');
                    } catch (e) {
                        console.log('parse time error');
                    }
                } else if (ampm === AM_TAG) {
                    try {
                        var timeArr = custom_time.split(':');
                        if (timeArr[0] == '12') { // 12:00 AM is 00:00 
                            timeArr[0] = '00';
                        }
                        custom_time = timeArr.join(':');
                    } catch (e) {
                        console.log('parse time error');
                    }
                }
            } else {
                custom_time = time.substr(0, time.length - 7);
            }
            return custom_time;
        },

        /**
         * Convert time in 24-hour system to 12-hour system
         * @param {String}
         * time - time in 24-hour. like 23:34:44 or 09:01:02
         */
        getTimeAMPM : function(time) {
            var ampm = AM_TAG;
            var hour = time.substring(0, time.indexOf(":"));
            var min = time.substr(time.indexOf(":") + 1, 2);
            hour = parseInt(hour, 10);
            if (hour == 0) {
                hour += 12; // 00:23 -> 12:23 AM
            } else if (hour == 12) {
                ampm = PM_TAG; // 12:23 -> 12:23 PM
            } else if (hour > 12) {
                hour = hour - 12;
                ampm = PM_TAG;
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            return (hour + ":" + min + " " + ampm);
        },

        /**
         * Format date with specify format.
         * Only accept YYYY-MM-DD and MM/DD/YYYY, no other format, no time is allowed.
         * @param date
         * @param {String} format - default value is "YYYY-MM-DD"
         */
        formatDate : function(date, format) {
            format = format || this.DATE_SAVE_FORMAT;
            date = new Date(Date.parse(date)); // check if Invalida Date
            return Slipstream.SDK.DateFormatter.format(date, format);
        },

        /**
         * Get the yesterday's date to use as afterDate
         */
        getAfterDate : function() {
            var afterDate = new Date();
            afterDate.setDate(afterDate.getDate()-1); // get previous date
            return Slipstream.SDK.DateFormatter.format(afterDate, this.DATE_DISPLAY_FORMAT);
        },

        getFieldLabels : function(context) {
            return {
                "startTime1" : context.getMessage("scheduler_start_time1"),
                "stopTime1" : context.getMessage("scheduler_stop_time1"),
                "startTime2" : context.getMessage("scheduler_start_time2"),
                "stopTime2" : context.getMessage("scheduler_stop_time2"),
                "allDay" : context.getMessage("scheduler_day_option_allday"),
                "exclude" : context.getMessage("scheduler_day_option_excluded"),
                "to" : context.getMessage("scheduler_day_option_range_to")
            };
        }
    };

    return SchedulerUtility;
});