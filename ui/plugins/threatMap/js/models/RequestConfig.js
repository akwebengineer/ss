/** 
 * Some constants defined in here whic are used for preparing request-body for POST.
 *
 * @module RequestConstants
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function(
) {
    var RequestConfig = {
        getRequestBodyForLogs: function() {
            return {  
                'request': {  
                    'time-interval': '',
                    'size': 1,
                    'slot': 1,
                    'order': 'ascending',
                    'filters': {  
                        'or': []
                    }
                }
            }
        },
        getReqBodyForAggregate: function() {
            return {
                'request': {  
                    'time-interval': '',
                    'aggregation': 'COUNT',
                    'aggregation-attributes': [],
                    'size': 1,
                    'slot': 1,
                    'order': 'ascending',
                    'filters': {
                        "and":{
                            'or': []
                        }
                    }
                }
            };  
        },
        getUnknownSourceCountryFilters: function() {
            return {
                "filter": {
                    "key": "field",
                    "operator": "NOT_EXISTS",
                    "value": "src-geo.country-code2"
                }
            };
        },
        getUnknownDestCountryFilters: function() {
            return {
                "filter": {
                    "key": "field",
                    "operator": "NOT_EXISTS",
                    "value": "dst-geo.country-code2"
                }
            };
        },
        FILTER_TEMPLATE: function() {
            return {  
                'key': '',
                'operator': 'EQUALS',
                'value': ''
            };
        },
        FILTER_TEMPLATE_UNKNOWN: function() {
            return {
                'key': 'field',
                'operator': 'NOT_EXISTS',
                'value': 'dst-geo.country-code'
            };
        },
        getThreatFilters: function(eventTypes) {
            var filters = [];
            var self = this;
            eventTypes.forEach(function (type) {
                var filter = self.FILTER_TEMPLATE();
                filter.key = 'event-type';
                filter.value = type;
                filters.push({ 'filter': filter });
            });
            return filters;
        },
        getDeviceFilters: function(devices) {
            var filters = [];
            var self = this;
            devices.forEach(function (device) {
                var filter = self.FILTER_TEMPLATE();
                filter.key = 'syslog-hostname';
                filter.value = device;
                filters.push({ 'filter': filter });
            });
            return filters;
        },
        getCountryFilters: function(countryCodes, isSource) {
            var filters = [];
            var self = this;
            countryCodes.forEach(function (code) {
                var filter = self.FILTER_TEMPLATE();
                filter.key = (isSource == true) ? 'src-country-code2' : 'dst-country-code2';
                filter.value = code;
                filters.push({ 'filter': filter });
            });
            return filters;
        },

        getCountryNameFilters: function(countryName, isSource) {
            var filters = [],
                self = this,
                filter = self.FILTER_TEMPLATE();

            filter.key = (isSource == true) ? 'src-country-name' : 'dst-country-name';
            filter.value = countryName;
            filters.push({ 'filter': filter });

            return filters;
        },

        getIPSThreatEventTypes: function() {
            return [
                'IDP_ATTACK_LOG_EVENT',
                'IDP_ATTACK_LOG_EVENT_LS',
                'IDP_APPDDOS_APP_ATTACK_EVENT_LS',
                'IDP_APPDDOS_APP_STATE_EVENT',
                'IDP_APPDDOS_APP_STATE_EVENT_LS'
            ];
        },
        getIPSThreatFilters: function() {
            return this.getThreatFilters(this.getIPSThreatEventTypes());
        },

        getAntivirusThreatEventTypes: function() {
            return [
                'AV_VIRUS_DETECTED_MT',
                'AV_VIRUS_DETECTED'
            ];
        },
        getAntivirusThreatFilters: function() {
            return this.getThreatFilters(this.getAntivirusThreatEventTypes());
        },

        getAntispamThreatEventTypes: function() {
            return [
                'ANTISPAM_SPAM_DETECTED_MT',
                'ANTISPAM_SPAM_DETECTED_MT_LS'
            ];
        },
        getAntispamThreatFilters: function() {
            return this.getThreatFilters(this.getAntispamThreatEventTypes());
        },

        getDeviceAuthThreatEventTypes: function() {
            return [
//                'FWAUTH_FTP_LONG_PASSWORD',
//                'FWAUTH_FTP_LONG_PASSWORD_LS',
//                'FWAUTH_FTP_LONG_USERNAME',
//                'FWAUTH_FTP_LONG_USERNAME_LS',
                //'FWAUTH_FTP_USER_AUTH_ACCEPTED',
                //'FWAUTH_FTP_USER_AUTH_ACCEPTED_LS',
                'FWAUTH_FTP_USER_AUTH_FAIL',
                'FWAUTH_FTP_USER_AUTH_FAIL_LS',
                //'FWAUTH_HTTP_USER_AUTH_ACCEPTED',
                //'FWAUTH_HTTP_USER_AUTH_ACCEPTED_LS',
                'FWAUTH_HTTP_USER_AUTH_FAIL',
                'FWAUTH_HTTP_USER_AUTH_FAIL_LS',
                //'FWAUTH_HTTP_USER_AUTH_OK',
                //'FWAUTH_HTTP_USER_AUTH_OK_LS',
//                'FWAUTH_TELNET_LONG_PASSWORD',
//                'FWAUTH_TELNET_LONG_PASSWORD_LS',
//                'FWAUTH_TELNET_LONG_USERNAME',
//                'FWAUTH_TELNET_LONG_USERNAME_LS',
                //'FWAUTH_TELNET_USER_AUTH_ACCEPTED',
                //'FWAUTH_TELNET_USER_AUTH_ACCEPTED_LS',
                'FWAUTH_TELNET_USER_AUTH_FAIL',
                'FWAUTH_TELNET_USER_AUTH_FAIL_LS',
                //'FWAUTH_TELNET_USER_AUTH_OK',
                //'FWAUTH_TELNET_USER_AUTH_OK_LS',
                'FWAUTH_WEBAUTH_FAIL',
                'FWAUTH_WEBAUTH_FAIL_LS',
                //'FWAUTH_WEBAUTH_SUCCESS',
                //'FWAUTH_WEBAUTH_SUCCESS_LS'
            ];
        },
        getDeviceAuthThreatFilters: function() {
            return this.getThreatFilters(this.getDeviceAuthThreatEventTypes());
        },

        getAllThreats: function() {
            return this.getIPSThreatEventTypes()
                .concat(this.getAntivirusThreatEventTypes())
                .concat(this.getAntispamThreatEventTypes())
                .concat(this.getDeviceAuthThreatEventTypes())
        },
        getAllThreatFilters: function() {
            return this.getIPSThreatFilters()
                .concat(this.getAntivirusThreatFilters())
                .concat(this.getAntispamThreatFilters())
                .concat(this.getDeviceAuthThreatFilters())
        }
    };

    return RequestConfig;
});