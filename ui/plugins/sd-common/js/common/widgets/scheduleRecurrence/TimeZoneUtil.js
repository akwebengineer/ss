/**
 * A module provides common methods for time zone.
 *
 * @module TimeZoneUtil
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
        'widgets/timeZone/timeUtil',
        'text!widgets/timeZone/conf/timeZones.json'
], function (TimeUtil, timeZoneConf) {
    var TimeZoneUtil = {
        /**
         * Return abbreviation of the current time zone
         * 
         * @return
         */
        getCurrentTimeZoneInfo: function() {
            var timeZoneInfo = {};
            var timeZoneConfObj = JSON.parse(timeZoneConf);
            var currentTimezoneOffset = TimeUtil.GetTimezoneString();
            timeZoneInfo.timeZone = currentTimezoneOffset;
            for (var i = 0; i < timeZoneConfObj.length; ++i) {
                var tz = timeZoneConfObj[i];
                if (tz.offset.indexOf(currentTimezoneOffset) != -1) {
                    timeZoneInfo.timeZone = tz.short;
                    break;
                }
            }
            return timeZoneInfo;
        },
        /**
         * Return abbreviation of the given time zone
         * 
         * @param timezoneOffset
         * @return
         */
        getTimeZoneInfo: function(timezoneOffset) {
            var timeZoneInfo = {};
            var timeZoneConfObj = JSON.parse(timeZoneConf);
            // Add 0 for time zone less than 10
            var flag = timezoneOffset.substring(0, 1);
            var zone = timezoneOffset.substring(1);
            if(timezoneOffset.substring(0, 3) === '+/-'){
                timezoneOffset = '+/-00:00';
            }else{
                if(flag === '+' || flag === '-'){
                    if(zone.substring(0, 1) === '0')
                        timezoneOffset = flag + zone.substring(1);
                }
            }
            timeZoneInfo.timeZone = timezoneOffset;
            for (var i = 0; i < timeZoneConfObj.length; ++i) {
                var tz = timeZoneConfObj [ i ];
                if (tz.offset.indexOf(timezoneOffset) != -1) {
                    timeZoneInfo.timeZone = tz.short;
                    break;
                }
            }
            return timeZoneInfo;
        }
    };

    return TimeZoneUtil;
});
