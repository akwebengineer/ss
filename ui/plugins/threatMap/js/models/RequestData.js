/** 
 * Helper to get backend data of various types for threat-map.
 *
 * @module RequestData
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './RequestConfig.js'
], function(
    RequestConfig
) {
    var RequestData = {
        getAggregatedCountForUnknown: function(timeRange, andFilters) {
            var reqBody = RequestConfig.getReqBodyForAggregate();
            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('priority');
            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }
            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate',
                type : 'POST',
                data : JSON.stringify(reqBody),
                contentType : 'application/json'
            });
        },
        getAggregatedCount: function(timeRange, andFilters, orFilters) {
            var reqBody = RequestConfig.getReqBodyForAggregate();

            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('priority');

            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters.and['or'] = orFilters;
            }

            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate', 
                type : 'POST',
                data : JSON.stringify(reqBody), 
                contentType : 'application/json'
            });
        },

        getTop: function(timeRange, attrs, andFilters, orFilters, howMany) {
            var reqBody = RequestConfig.getReqBodyForAggregate();
            reqBody.request['time-interval'] = timeRange;
            
            attrs.forEach(function (attr) {
                reqBody.request['aggregation-attributes'].push(attr);
            });

            reqBody.request['size'] = howMany;
            
            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters.and['or'] = orFilters;
            }
            
            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate', 
                type : 'POST',
                data : JSON.stringify(reqBody), 
                contentType : 'application/json'
            });
        },

        // Get the TOP 5 Inbound IP addresses and count
        getTopInboundIpAddresses: function(timeRange, andFilters) {
            var reqBody = RequestConfig.getReqBodyForAggregate(),
                orFilters = RequestConfig.getAllThreatFilters();

            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('destination-address');

            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters.and['or'] = orFilters;
            }

            return reqBody;
        },

        // Get the TOP 5 Outbound IP addresses and count
        getTopOutboundIpAddresses: function(timeRange, andFilters) {
            var reqBody = RequestConfig.getReqBodyForAggregate(),
                orFilters = RequestConfig.getAllThreatFilters();

            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('source-address');

            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters.and['or'] = orFilters;
            }

            return reqBody;
        },

        getNoDataRequestBody: function(timeRange, andFilters) {
            var reqBody = RequestConfig.getReqBodyForAggregate();

            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('destination-address');

            if (andFilters) {
                reqBody.request.filters.and['and'] = andFilters;
            }

            return reqBody;
        },

        getFiltersRequestBody: function(timeRange, countryName) {
            var orFilters = RequestConfig.getAllThreatFilters()
                .concat(RequestConfig.getCountryNameFilters(countryName, true))
                .concat(RequestConfig.getCountryNameFilters(countryName, false)),
                reqBody = {
                'dontPersistAdvancedSearch': true,
                'timeRange': {},
                'filters': {
                    'or': []
                } },
                orArrayLength = orFilters.length;

            reqBody['timeRange'] = timeRange;
            reqBody.filters['or'] = orFilters;

            return reqBody;
        }


    };

    return RequestData;
});