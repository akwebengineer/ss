/** 
 * A module that implements a Slipstream Alarm Provider.
 *
 * @module AlarmProvider
 * @copyright Juniper Networks, Inc. 2015
 */
define(['mockjax', 'jquery'], function(mockjax, $) {
	var ALARM_URL = '/api/juniper/seci/alarms';
    var ALARM_ACCEPT = 'application/vnd.juniper.seci.alarms+json;version=1;';
    var CRITICAL_SEVERITY = 4;

    function AlarmProvider() {
        Slipstream.SDK.AlarmProvider.call(this);
    }

	AlarmProvider.prototype = Object.create(Slipstream.SDK.AlarmProvider.prototype);
    AlarmProvider.prototype.constructor = AlarmProvider;

    AlarmProvider.prototype.getMostRecent = function(n, options) {
        var severity = (options.severity == undefined) ? CRITICAL_SEVERITY : options.severity;

        function decorateData(data) {
             data["alarms"]["alarm"].forEach(function(obj) {
                 obj.href = "/alarms/generated-alarms?filter=(id eq " + obj.alarmId + ")";
             });
        }

        $.ajax({
            url: ALARM_URL,
            headers: {
                Accept: ALARM_ACCEPT
            },
            data: {
                sortBy: "lastUpdated(DESC)",
                paging: "(start eq 0, limit eq " + n + ")",
                severity: severity  
            },
            success: function(data) {
                if (options.success) {
                    decorateData(data);
                    options.success(data);
                }
            },
            error: function(errorMsg) {
                if (options.fail) {
                    options.fail(errorMsg);
                }
            }
        });  
    }

    AlarmProvider.prototype.getURL = function() {
        return "/alarms/generated-alarms";
    }

	  return AlarmProvider;
});
