/** 
 * A module that implements a Slipstream Alert Provider.
 *
 * @module AlertProvider
 * @copyright Juniper Networks, Inc. 2015
 */
define(['jquery'], function($) {
	var ALERT_URL = '/api/juniper/seci/alert-management/alerts';
	var ALERT_ACCEPT = 'application/vnd.juniper.seci.alert-management.alert+json;version=1';
    var CRITICAL_SEVERITY = 4;    

	function AlertProvider() {
        Slipstream.SDK.AlertProvider.call(this);
	}

	AlertProvider.prototype = Object.create(Slipstream.SDK.AlertProvider.prototype);
    AlertProvider.prototype.constructor = AlertProvider;

    AlertProvider.prototype.getMostRecent = function(n, options) {
        var severity = (options.severity == undefined) ? CRITICAL_SEVERITY : options.severity;

        function decorateData(data) {
             data["alerts"]["alert"].forEach(function(obj) {
                 obj.href = "/alerts/generated-alerts?filter=(id eq " + obj.id + ")";
             });
        }

        $.ajax({
            url: ALERT_URL,
            headers: {
                Accept: ALERT_ACCEPT
            },
            data: {
                sortby:"(generated-time(descending))",
                paging: "(start eq 0, limit eq " + n + ")",
                filter: "(severity eq " + severity + ")"
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

    AlertProvider.prototype.getURL = function() {
        return "/alerts/generated-alerts";
    }

	return AlertProvider;
});
