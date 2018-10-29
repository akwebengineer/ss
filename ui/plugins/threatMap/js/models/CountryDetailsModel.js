/** 
 * A Backbone model representing country-details.
 *
 * @module CountryDetailsModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './RequestConfig.js',
    './RequestData.js'
], function(
    Backbone,
    RequestConfig,
    RequestData
) {
    /** 
     * CountryDetailsModel definition.
     */
    var CountryDetailsModel = Backbone.Model.extend({
        defaults: function() {
            return {
                // request fields (from client)
                'startTime': undefined,
                'endTime': undefined,

                'countryName': '',
                'countryCode': '',
                'flagCode': '',

                'srcTotalCount': 0,
                'dstTotalCount': 0,
                'totalCount': 0,
                'viewType': ''
            };
        },

        getTimeInterval: function() {
            var startTime = this.get('startTime').toJSON();
            var endTime = this.get('endTime').toJSON();
            return startTime.slice(0, startTime.length - 5) + 'Z' + '/' + endTime.slice(0, endTime.length - 5) + 'Z';
        },

        fetch: function(options) {
            var now = new Date();
            now.setMilliseconds(0);
            var endTime = new Date(now.getTime() - options.pollInterval),  // ends at poll interval behind
                startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());    // start at midnight
            this.set('startTime', startTime);
            this.set('endTime', endTime);

            this.set('countryName', options.countryName);
            this.set('countryCode', options.countryCode);
            this.set('flagCode', options.countryCode.toLowerCase());


            var timeRange = this.getTimeInterval();
            var self = this;
            var srcCountryFilters = RequestConfig.getCountryFilters([self.get('countryCode')], true);
            var dstCountryFilters = RequestConfig.getCountryFilters([self.get('countryCode')], false);
            var allThreatFilters = RequestConfig.getAllThreatFilters();


            $.when(
                RequestData.getAggregatedCount(timeRange, srcCountryFilters, allThreatFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, allThreatFilters)

            ).then(function(
               srcTotalCount, dstTotalCount
            ) {
                if (srcTotalCount[0].response.result) {
                    if (srcTotalCount[0].response.result.length > 0) {
                        self.set('srcTotalCount', Number(srcTotalCount[0].response.result[0].value));
                    } else {
                        self.set('srcTotalCount', 0);
                    }

                }
                if (dstTotalCount[0].response.result) {
                    if (dstTotalCount[0].response.result.length > 0) {
                        self.set('dstTotalCount', Number(dstTotalCount[0].response.result[0].value));
                    } else {
                        self.set('dstTotalCount', 0);
                    }
                }

                self.set('totalCount', self.get('srcTotalCount') + self.get('dstTotalCount'));
                if(self.get('srcTotalCount') > self.get('dstTotalCount')) {
                    self.set('viewType', 'view-source-country');
                }else {
                    self.set('viewType', 'view-destination-country');
                }

                self.trigger('sync', self);
            }, function(xhr, state, error) {
                console.log('error: ', JSON.stringify(error));
                self.trigger('error', self);
            });
        }
    });

    return CountryDetailsModel;
});