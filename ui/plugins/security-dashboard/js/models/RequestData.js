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
        getAggregatedCountForUnknown: function(timeRange, andFilters, onComplete) {
            var reqBody = RequestConfig.getReqBodyForAggregate();
            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('priority');
            if (andFilters) {
                reqBody.request.filters['and'] = andFilters;
            }
            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate',
                type : 'POST',
                data : JSON.stringify(reqBody),
                contentType : 'application/json',
                success: onComplete.success,
                error: onComplete.error
            });
        },
        getAggregatedCount: function(timeRange, andFilters, orFilters, viewBy, onComplete) {
            var reqBody = RequestConfig.getReqBodyForAggregate();

            reqBody.request['time-interval'] = timeRange;
            reqBody.request['aggregation-attributes'].push('priority');
            switch (viewBy) {
                case 'source':
                    reqBody.request['aggregation-attributes'].push('src-country-code2');
                    reqBody.request['aggregation-attributes'].push('src-country-name');
                    break;

                case 'destination':
                    reqBody.request['aggregation-attributes'].push('dst-country-code2');
                    reqBody.request['aggregation-attributes'].push('dst-country-name');
                    break;
            }

            if (andFilters) {
                reqBody.request.filters['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters['or'] = orFilters;
            }

            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate',
                type : 'POST',
                data : JSON.stringify(reqBody),
                contentType : 'application/json',
                success: onComplete.success,
                error: onComplete.error
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
                reqBody.request.filters['and'] = andFilters;
            }
            if (orFilters) {
                reqBody.request.filters['or'] = orFilters;
            }
            
            return $.ajax({
                url : '/api/juniper/ecm/log-scoop/aggregate', 
                type : 'POST',
                data : JSON.stringify(reqBody), 
                contentType : 'application/json'
            });
        }
    };

    return RequestData;
});