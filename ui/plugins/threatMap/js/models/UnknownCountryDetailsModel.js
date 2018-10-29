/** 
 * A Backbone model representing the unknow country-details.
 *
 * @module UnknownCountryDetailsModel
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
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
     * CountryDetailsModel defination.
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
                'srcIpsCount': 0,
                'srcAvCount': 0,
                'srcAsCount': 0,
                'srcDaCount': 0,

                'dstTotalCount': 0,
                'dstIpsCount': 0,
                'dstAvCount': 0,
                'dstAsCount': 0,
                'dstDaCount': 0,

                'totalCount': 0
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


            var timeRange = this.getTimeInterval(),
                self = this,
                srcCountryFilters = RequestConfig.getUnknownSourceCountryFilters(),
                dstCountryFilters = RequestConfig.getUnknownDestCountryFilters(),
                ipsFilters = RequestConfig.getIPSThreatFilters(),
                avFilters = RequestConfig.getAntivirusThreatFilters(),
                asFilters = RequestConfig.getAntispamThreatFilters(),
                daFilters = RequestConfig.getDeviceAuthThreatFilters(),
                allThreatFilters = RequestConfig.getAllThreatFilters();
            
            $.when(
                RequestData.getAggregatedCountForUnknown(timeRange, srcCountryFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, ipsFilters),
                RequestData.getAggregatedCount(timeRange, srcCountryFilters, avFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, avFilters),
                RequestData.getAggregatedCount(timeRange, srcCountryFilters, asFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, asFilters),
                RequestData.getAggregatedCount(timeRange, srcCountryFilters, daFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, daFilters),

                RequestData.getAggregatedCount(timeRange, srcCountryFilters, allThreatFilters),
                RequestData.getAggregatedCount(timeRange, dstCountryFilters, allThreatFilters)
            ).then(function(
                srcIpsCount, dstIpsCount,
                srcAvCount, dstAvCount,
                srcAsCount, dstAsCount,
                srcDaCount, dstDaCount,
                srcTotalCount, dstTotalCount
            ) {
                // get IPS threat count
                if (srcIpsCount[0].response.result) {
                    if (srcIpsCount[0].response.result.length > 0) {
                        self.set('srcIpsCount', Number(srcIpsCount[0].response.result[0].value));
                    } else {
                        self.set('srcIpsCount', 0);
                    }

                }
                if (dstIpsCount[0].response.result) {
                    if (dstIpsCount[0].response.result.length > 0) {
                        self.set('dstIpsCount', Number(dstIpsCount[0].response.result[0].value));
                    } else {
                        self.set('dstIpsCount', 0);
                    }
                }

                // get Anti-Virus threat count
                if (srcAvCount[0].response.result) {
                    if (srcAvCount[0].response.result.length > 0) {
                        self.set('srcAvCount', Number(srcAvCount[0].response.result[0].value));
                    } else {
                        self.set('srcAvCount', 0);
                    }
                }
                if (dstAvCount[0].response.result) {
                    if (dstAvCount[0].response.result.length > 0) {
                        self.set('dstAvCount', Number(dstAvCount[0].response.result[0].value));
                    } else {
                        self.set('dstAvCount',0);
                    }
                }

                // get Anti-Spam threat count
                if (srcAsCount[0].response.result) {
                    if (srcAsCount[0].response.result.length > 0) {
                        self.set('srcAsCount', Number(srcAsCount[0].response.result[0].value));
                    } else {
                        self.set('srcAsCount', 0);
                    }
                }
                if (dstAsCount[0].response.result) {
                    if (dstAsCount[0].response.result.length > 0) {
                        self.set('dstAsCount', Number(dstAsCount[0].response.result[0].value));
                    } else {
                        self.set('dstAsCount', 0);
                    }
                }

                // get Device Authentication threat count
                if (srcDaCount[0].response.result) {
                    if (srcDaCount[0].response.result.length > 0) {
                        self.set('srcDaCount', Number(srcDaCount[0].response.result[0].value));
                    } else {
                        self.set('srcDaCount', 0);

                    }
                }
                if (dstDaCount[0].response.result) {
                    if (dstDaCount[0].response.result.length > 0) {
                        self.set('srcDaCount', Number(dstDaCount[0].response.result[0].value));
                    } else {
                        self.set('srcDaCount', 0);
                    }
                }

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

//                self.set('srcTotalCount', self.get('srcIpsCount') + self.get('srcAvCount') + self.get('srcAsCount') + self.get('srcDaCount'));
                // console.log('country-details model: srcTotalCount: ' + self.get('srcTotalCount') + ', srcIpsCount: ' + self.get('srcIpsCount') + ', srcAvCount: ' + self.get('srcAvCount') + ', srcAsCount: ' + self.get('srcAsCount') + ', srcDaCount: ' + self.get('srcDaCount'));

//                self.set('dstTotalCount', self.get('dstIpsCount') + self.get('dstAvCount') + self.get('dstAsCount') + self.get('dstDaCount'));
                // console.log('country-details model: dstTotalCount: ' + self.get('dstTotalCount') + ', dstIpsCount: ' + self.get('dstIpsCount') + ', dstAvCount: ' + self.get('dstAvCount') + ', dstAsCount: ' + self.get('dstAsCount') + ', dstDaCount: ' + self.get('dstDaCount'));

                self.set('totalCount', self.get('srcTotalCount') + self.get('dstTotalCount'));

                self.trigger('sync', self);
            }, function(xhr, state, error) {
                console.log('error: ', JSON.stringify(error));
                self.trigger('error', self);
            });
        }
    });

    return CountryDetailsModel;
});