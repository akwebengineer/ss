/**
 * A module that extends Backbone.Collection
 * for threat data models. 
 *
 * @module ThreatMapDashletModel
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015, 2016
 */
 
define([
    'backbone',
    './RequestConfig.js',
    './RequestData.js'
], function (
    Backbone,
    RequestConfig,
    RequestData
) {

    /**
     * ThreatMapDashletModel collections definition
     */
    var ThreatMapDashletModel = Backbone.Model.extend({
        defaults: function() {
            return {
                // request fields (from client)
                //'threatType': '',
                'startTime': undefined,
                'endTime': undefined,
                'viewBy': undefined,
                'maxThreatCount': 0,    // max treat count found in all countries

                'countries': new Backbone.Collection()
            };
        },

        getTimeInterval: function() {
            var startTime = this.get('startTime').toJSON();
            var endTime = this.get('endTime').toJSON();
            return startTime.slice(0, startTime.length - 5) + 'Z' + '/' + endTime.slice(0, endTime.length - 5) + 'Z';
        },

        fetch: function (options) {
            this.set('startTime', options.startTime);
            this.set('endTime', options.endTime);
            this.set('viewBy', options.viewBy);

            var timeRange = this.getTimeInterval();
            var self = this;

            var filters;
            switch (this.get('threatType')) {
                case 'ips':
                    filters = RequestConfig.getIPSThreatFilters();
                    break;
                case 'antivirus':
                    filters = RequestConfig.getAntivirusThreatFilters();
                    break;
                case 'antispam':
                    filters = RequestConfig.getAntispamThreatFilters();
                    break;
                case 'device-authentication':
                    filters = RequestConfig.getDeviceAuthThreatFilters();
                    break;
                default:
                    filters = RequestConfig.getAllThreatFilters()
                    break;
            }

            var unknown_AndFilters = null;

            if( self.get('viewBy') === 'source') {
                if (this.get('threatType') === 'ips') {
                    unknown_AndFilters = RequestConfig.getUnknownSourceIPSFilters();
                } else if (this.get('threatType') === 'antivirus') {
                    unknown_AndFilters = RequestConfig.getUnknownSourceAntiVirusFilters();
                }
            } else if (self.get('viewBy') === 'destination') {
                if (this.get('threatType') === 'ips') {
                    unknown_AndFilters = RequestConfig.getUnknownDestIPSFilters();
                } else if (this.get('threatType') === 'antivirus') {
                    unknown_AndFilters = RequestConfig.getUnknownDestAntiVirusFilters();
                }
            }

            var deferred = $.Deferred();

            var getThreats = function() {
                var unknownThreats = RequestData.getAggregatedCountForUnknown(timeRange, unknown_AndFilters.filters.and, {success: options.success, error: options.error});
                var aggThreats = RequestData.getAggregatedCount(timeRange, null, filters, self.get('viewBy'), {success: options.success, error: options.error});
                $.when(unknownThreats, aggThreats)
                .done(function(unknownCount, aggCount) {
                    self.get('countries').reset();
                    var unKnownThreatCountValue = 0;
                    if(unknownCount[0].response.result.length > 0) {
                        unKnownThreatCountValue = unknownCount[0].response.result[0].value;
                    }
                    var model = new Backbone.Model({
                        'id': 'QQ',
                        'countryCode2': 'QQ',
                        'countryName': 'Unknown Geo IP Location',
                        'threatCount': unKnownThreatCountValue
                    });
                    self.get('countries').add(model);
                    var countries = null;
                    if (aggCount[0].response.result instanceof Array) {
                        countries = aggCount[0].response.result;
                    } else {
                        countries = [aggCount[0].response.result];
                    }
                    var maxThreatCount = 0;
                    countries.forEach(function (country) {
                        if (country) {
                            model = new Backbone.Model({
                                'id': country.keys[1],
                                'countryCode2': country.keys[1],
                                'countryName': country.keys[2],
                                'threatCount': country.value
                            });
                            self.get('countries').add(model);
                            if (country.value > maxThreatCount) {
                                maxThreatCount = country.value;
                            }
                        }
                    });
                    self.set('maxThreatCount', maxThreatCount);

                    self.trigger('sync', self);
                    options.success(self);

                    return deferred.resolve();
                });
                return deferred.promise();
            };

            return getThreats();
        }
    });

    return ThreatMapDashletModel;
});
