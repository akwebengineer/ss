/**
 * Utility Class for filter management
 * This class will be used across Alerts, Reports and EV
 * @module FilterUtil
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FilterUtil = function() {
        //Log Collector Enums. If LC key change this must be only single place to change
        this.LC_KEY = {
            "SOURCE_ADDRESS": "source-address",
            "DESTINATION_ADDRESS": "destination-address",
            "APPLICATION": "application",
            "THREAT_SEVERITY": "threat-severity",
            "EVENT_TYPE": "event-type",
            "ATTACK_NAME":"attack-name",
            "NAME": "name",
            "EVENT_CATEGORY": "event-category",
            "SOURCE_COUNTRY_NAME": "src-country-name",
            "DESTINATION_COUNTRY_NAME": "dst-country-name",
            "SOURCE_PORT": "source-port",
            "DESTINATION_PORT": "destination-port",
            "HOST": "host",
            "USER_NAME": "username",
            "SYSLOG_HOST_NAME": "syslog-hostname",
            "SERVICE_NAME": "service-name",
            "PROTOCOL_ID": "protocol-id",
            "POLICY_NAME": "policy-name",
            "SOURCE_ZONE_NAME": "source-zone-name",
            "DESTINATION_ZONE_NAME": "destination-zone-name",
            "NESTED_APPLICATION": "nested-application",
            "ROLES": "roles",
            "REASON": "reason",
            "NAT_SOURCE_PORT": "nat-source-port",
            "NAT_DESTINATION_PORT": "nat-destination-port",
            "SOURCE_NAT_RULE_NAME": "src-nat-rule-name",
            "DESTINATION_NAT_RULE_NAME": "dst-nat-rule-name",
            "NAT_SOURCE_ADDRESS": "nat-source-address",
            "NAT_DESTINATION_ADDRESS": "nat-destination-address",
            "SESSION_ID_32": "session-id-32",
            "URL": "url",
            "OBJECT_NAME": "object-name",
            "LOGICAL_SYSTEM_NAME": "logical-system-name",
            "RULE_NAME": "rule-name",
            "ACTION": "action",
            "PROFILE_NAME": "profile-name",
            "PATH_NAME": "pathname",
            "HOST_NAME": "hostname",
            "ENCRYPTED": "encrypted",
            "CATEGORY":"category"
        };
        //
        this.getDurationBasedOnUnit = function(duration_unit, duration) {
            // Find the Time Span based on Duration unit and Duration
            var timePeriod = 0;

            if(duration_unit == 0){//Minutes
                timePeriod = Math.floor(duration / 60 / 1000);
            }
            if(duration_unit == 1){//Hours
                timePeriod = duration / 60 / 60 / 1000;
            }
            else if(duration_unit == 2){//Days
                timePeriod = duration / 60 / 60 / 24 / 1000;
            }
            else if(duration_unit == 3){//Weeks
                timePeriod = duration / 60 / 60 / 24 / 7 / 1000;
            }
            else if(duration_unit == 4){//Months
                timePeriod = duration / 2628000000;
            }
            return Math.round(timePeriod);
        };

        // Get duration in milli-seconds
        this.getDurationInMS = function(duration, duration_unit) {
            var timePeriod = 0,
                returnVal = duration;

            if (duration != null) {
                if(duration_unit == 0){//Minutes
                    timePeriod = duration * 60 * 1000;
                }
                else if(duration_unit == 1){//Hours
                    timePeriod = duration * 60 * 60 * 1000;
                }
                else if(duration_unit == 2){//Days
                    timePeriod = duration * 60 * 60 * 24 * 1000;
                }
                else if(duration_unit == 3){//Weeks
                    timePeriod = duration * 60 * 60 * 24 * 7 * 1000;
                }
                else if(duration_unit == 4){//Months
                    timePeriod = duration * 2628000000;
                }
                returnVal = timePeriod;
            }
            return Math.round(returnVal);
        };

        // Method to get the Days, Hours and Minutes for Save Filters
        this.millisToDaysHoursMinutes = function(ms) {
            var result, returnVal, resultStr,
                months = "", weeks = "", days = "", hours = "", minutes = "";
            if(ms) {
                result = this.convertMS(ms)
            }
            if (result) {
                resultStr = result.toString();
                resultArray = resultStr.split(".");
                if(resultArray[0] != 0) {
                    days = resultArray[0] + " day(s) ";
                }
                if(resultArray[1] != 0) {
                    hours = resultArray[1] + " hour(s) ";
                }
                if(resultArray[2] != 0) {
                    minutes = resultArray[2] + " minute(s) ";
                }
                if(resultArray[3] != 0) {
                    weeks = resultArray[3] + " week(s) ";
                }

                returnVal = weeks + days + hours + minutes;
            }

            return returnVal;
        };
        //
        this.convertMS = function(ms) {
            var d, h, m, s, w, n, result;
                s = Math.floor(ms / 1000);
                m = Math.floor(s / 60);
                s = s % 60;
                h = Math.floor(m / 60);
                m = m % 60;
                d = Math.floor(h / 24);
                h = h % 24;
                w = Math.floor(d / 7);
                n = Math.floor(ms / 2628000000);
                d = d % 7;
            result =  d + "." + h + "." +  m + "." + w + "." + n;
            return result;
        };
        //
        this.getTimeSpanFromMS = function(duration){
            var values, days, hours, minutes, weeks, months, unit,
                timePeriod =  this.convertMS(duration),
                matchPos = timePeriod.indexOf("."), returnVal = {};

            if(matchPos != -1) {
                values = timePeriod.split(".");
                days = values[0];
                hours = values[1];
                minutes = values[2];
                weeks = values[3];
            }
            if(days !== "0") {
                value = days;
                unit = 2;
            } else if(minutes !== "0") {
                value = minutes;
                unit = 0;
            }
            if(hours !== "0") {
                value = hours;
                unit = 1;
            }
            if(weeks !== "0") {
                value = weeks;
                unit = 3;
            }
            returnVal = {
                "duration": value,
                "unit": unit
            };
            return returnVal;
        };

        this.preciseTimeSpan = function(duration_unit, duration) {
            var timeSpanDet, duration, unit, returnVal = {};

            if(duration_unit > 0) {
                duration    = this.getDurationBasedOnUnit(duration_unit, duration),
                unit        = duration_unit;
            } else {
                timeSpanDet = this.getTimeSpanFromMS(duration),
                duration    = timeSpanDet["duration"],
                unit        = timeSpanDet["unit"];
            }
            returnVal = {
                "duration": duration,
                "unit": unit
            };
            return returnVal;
        };
        //returns the UI key for the log collector key. Mapping is stored in msgs.properties
        this.getUIKey = function(lcKey){
            return "lc-" + lcKey;
        };
        //returns the object map of lcKey and corresponding ui local language key.
        this.getLCKeyObjectMap = function(context){
            var me=this, objectMap={}, lcKeysArray;
            lcKeysArray = me.getLCKeys();
            //
            for(var i=0; i < lcKeysArray.length; i++){
                objectMap[lcKeysArray[i]["lcKey"]] = context.getMessage(me.getUIKey(lcKeysArray[i]["lcKey"]))
            };
            //
            return objectMap;

        };
        //returns filter string to human readable string in local language
        this.formatFilterStringToHumanReadableString = function(filterString, context){
            var me=this,
                objectMap = me.getLCKeyObjectMap(context),
                humanReadableStr="",
                re = new RegExp(Object.keys(objectMap).join("|"),"gi");
            //
            humanReadableStr = filterString.replace(re, function(matched){
              return objectMap[matched];
            });
            //
            return humanReadableStr;
        };
        //Returns the filter list replacing LC keys with LC labels
        this.getLCLabels = function(context, filterList){
            var i, length = filterList.length;
            for (i = 0; i < length; i++){
                var token = filterList[i], tokenIndex = token.indexOf(" "), lcKEY, lcLabel;
                if(tokenIndex != -1){
                    lcKEY = filterList[i].substring(0, tokenIndex);
                    lcLabel = context.getMessage(this.getUIKey(lcKEY));
                    filterList[i] = filterList[i].replace(lcKEY, lcLabel);
                }
            }
            return filterList;
        };
        //Returns complete list of Log Collector Keys
        this.getLCKeys = function(){
            var me=this,
                lcKeys=[];
            lcKeys = [{
                "lcKey": me.LC_KEY.SOURCE_ADDRESS
            },{
                "lcKey": me.LC_KEY.DESTINATION_ADDRESS
            },{
                "lcKey": me.LC_KEY.APPLICATION
            },{
                "lcKey": me.LC_KEY.THREAT_SEVERITY
            },{
                "lcKey": me.LC_KEY.EVENT_TYPE
            },{
                "lcKey": me.LC_KEY.ATTACK_NAME
            },{
                "lcKey": me.LC_KEY.NAME
            },{
                "lcKey": me.LC_KEY.EVENT_CATEGORY
            },{
                "lcKey": me.LC_KEY.SOURCE_COUNTRY_NAME
            },{
                "lcKey": me.LC_KEY.DESTINATION_COUNTRY_NAME
            },{
                "lcKey": me.LC_KEY.SOURCE_PORT
            },{
                "lcKey": me.LC_KEY.DESTINATION_PORT
            },{
                "lcKey": me.LC_KEY.HOST
            },{
                "lcKey": me.LC_KEY.USER_NAME
            },{
                "lcKey": me.LC_KEY.SYSLOG_HOST_NAME
            },{
                "lcKey": me.LC_KEY.SERVICE_NAME
            },{
                "lcKey": me.LC_KEY.PROTOCOL_ID
            },{
                "lcKey": me.LC_KEY.POLICY_NAME
            },{
                "lcKey": me.LC_KEY.SOURCE_ZONE_NAME
            },{
                "lcKey": me.LC_KEY.DESTINATION_ZONE_NAME
            },{
                "lcKey": me.LC_KEY.NESTED_APPLICATION
            },{
                "lcKey": me.LC_KEY.ROLES
            },{
                "lcKey": me.LC_KEY.REASON
            },{
                "lcKey": me.LC_KEY.NAT_SOURCE_PORT
            },{
                "lcKey": me.LC_KEY.NAT_DESTINATION_PORT
            },{
                "lcKey": me.LC_KEY.SOURCE_NAT_RULE_NAME
            },{
                "lcKey": me.LC_KEY.DESTINATION_NAT_RULE_NAME
            },{
                "lcKey": me.LC_KEY.NAT_SOURCE_ADDRESS
            },{
                "lcKey": me.LC_KEY.NAT_DESTINATION_ADDRESS
            },{
                "lcKey": me.LC_KEY.SESSION_ID_32
            },{
                "lcKey": me.LC_KEY.URL
            },{
                "lcKey": me.LC_KEY.OBJECT_NAME
            },{
                "lcKey": me.LC_KEY.LOGICAL_SYSTEM_NAME
            },{
                "lcKey": me.LC_KEY.RULE_NAME
            },{
                "lcKey": me.LC_KEY.ACTION
            },{
                "lcKey": me.LC_KEY.PROFILE_NAME
            },{
                "lcKey": me.LC_KEY.PATH_NAME
            }, {
               "lcKey": me.LC_KEY.HOST_NAME
            }, {
                "lcKey": me.LC_KEY.ENCRYPTED
            }];

            lcKeys.sort(function(a, b){
                return ((a.lcKey > b.lcKey) - (b.lcKey > a.lcKey));
            });
            return lcKeys;
        };
    };
    return FilterUtil;
});