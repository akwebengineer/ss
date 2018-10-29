/** 
 * A Backbone model representing threat-map data.
 *
 * @module InsightBarModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
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
     * InsightBarModel defination.
     */
    var InsightBarModel = Backbone.Model.extend({
        defaults: function() {
            return {
                // request fields (from client)
                'startTime': undefined,
                'endTime': undefined,

                'totalCount': 0,
                'ipsCount': 0,
                'avCount': 0,
                'asCount': 0,
                'daCount': 0,

                'topDestDevices': new Backbone.Collection(),    // an collection containing key-value pair for top destinations devices
                'topDestCountries': new Backbone.Collection(),  // an collection containing key-value pair for top destinations countries
                'topSrcCountries': new Backbone.Collection()    // an collection containing key-value pair for top source countries
            };
        },

        /** 
         * constructor
         */
        initialize: function() {
        },

        getTimeInterval: function() {
            var startTime = this.get('startTime').toJSON();
            var endTime = this.get('endTime').toJSON();
            return startTime.slice(0, startTime.length - 5) + 'Z' + '/' + endTime.slice(0, endTime.length - 5) + 'Z';
        },

        fetch: function(options) {
            var endTime = new Date(options.now.getTime() - options.pollInterval);  // ends at poll interval behind
            var startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());    // start at midnight
            this.set('startTime', startTime);
            this.set('endTime', endTime);

            var self = this;
            var timeRange = this.getTimeInterval();

            $.when( 
                RequestData.getAggregatedCount(timeRange, null, RequestConfig.getIPSThreatFilters()), 
                RequestData.getAggregatedCount(timeRange, null, RequestConfig.getAntivirusThreatFilters()),
                RequestData.getAggregatedCount(timeRange, null, RequestConfig.getAntispamThreatFilters()), 
                RequestData.getAggregatedCount(timeRange, null, RequestConfig.getDeviceAuthThreatFilters()), 
                RequestData.getTop(timeRange, ['syslog-hostname'], null, RequestConfig.getAllThreatFilters(), 5),
                RequestData.getTop(timeRange, ['dst-country-code2', 'dst-country-name'], null, RequestConfig.getAllThreatFilters(), 5),
                RequestData.getTop(timeRange, ['src-country-code2', 'src-country-name'], null, RequestConfig.getAllThreatFilters(), 5)
            ).then(function(
                ipsCount, avCount, asCount, daCount, 
                topDestDevices, topDestCountries, topSrcCountries) 
            {

                // get IPS threat count
                if (ipsCount[0].response.result) {
                    if (ipsCount[0].response.result.length > 0) {
                        self.set('ipsCount', Number(ipsCount[0].response.result[0].value));
                    }
                }
                // get Anti-Virus threat count
                if (avCount[0].response.result) {
                    if (avCount[0].response.result.length > 0) {
                        self.set('avCount', Number(avCount[0].response.result[0].value));
                    }
                }

                // get Anti-Spam threat count
                if (asCount[0].response.result) {
                    if (asCount[0].response.result.length > 0) {
                        self.set('asCount', Number(asCount[0].response.result[0].value));
                    }
                }

                // get Device Authentication threat count
                if (daCount[0].response.result) {
                    if (daCount[0].response.result.length > 0) {
                        self.set('daCount', Number(daCount[0].response.result[0].value));
                    }
                }

                self.set('totalCount', self.get('ipsCount') + self.get('avCount') + self.get('asCount') + self.get('daCount'));
                console.log('insight-bar model: totalCount: ' + self.get('totalCount') + ', ipsCount: ' + self.get('ipsCount') + ', avCount: ' + self.get('avCount') + ', asCount: ' + self.get('asCount') + ', daCount: ' + self.get('daCount'));

                // get top destination devices
                if (topDestDevices[0].response.result) {
                    var devices = null;
                    if (topDestDevices[0].response.result instanceof Array) {
                        devices = topDestDevices[0].response.result;
                    } else {
                        devices = [topDestDevices[0].response.result];
                    }
                    self.get('topDestDevices').reset();
                    devices.forEach(function (device) {
                        var uiModel = {
                            'deviceName': device.key,
                            'threatCount': device.value
                        };
                        self.get('topDestDevices').add(uiModel);
                    });
                    //console.log('topDestDevices: ' + JSON.stringify(self.get('topDestDevices').toJSON()));
                }

                // get top destination countries
                if (topDestCountries[0].response.result) {
                    var countries = null;
                    if (topDestCountries[0].response.result instanceof Array) {
                        countries = topDestCountries[0].response.result;
                    } else {
                        countries = [topDestCountries[0].response.result];
                    }
                    self.get('topDestCountries').reset();
                    countries.forEach(function (country) {
                        var model = new Backbone.Model({
                            'countryCode2': country.keys[0].toLowerCase(),
                            'countryName': country.keys[1],
                            'threatCount': country.value
                        });
                        self.get('topDestCountries').add(model);
                    });
                    //console.log('topDestCountries: ' + JSON.stringify(self.get('topDestCountries').toJSON()));
                }

                // get top source countries
                if (topSrcCountries[0].response.result) {
                   var countries = null;
                    if (topSrcCountries[0].response.result instanceof Array) {
                        countries = topSrcCountries[0].response.result;
                    } else {
                        countries = [topSrcCountries[0].response.result];
                    }
                    self.get('topSrcCountries').reset();
                    countries.forEach(function (country) {
                        var model = new Backbone.Model({
                            'countryCode2': country.keys[0].toLowerCase(),
                            'countryName': country.keys[1],
                            'threatCount': country.value
                        });
                        self.get('topSrcCountries').add(model);
                    });
                    //console.log('topSrcCountries: ' + JSON.stringify(self.get('topSrcCountries').toJSON()));
                }

                self.trigger('sync', self);
            }, function(xhr, state, error) {
                console.log('error: ', JSON.stringify(error));
                self.trigger('error', self);
            });
        }
    });

    return InsightBarModel;
});