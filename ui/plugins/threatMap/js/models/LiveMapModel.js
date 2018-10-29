/** 
 * A Backbone model representing threat-map live data.
 *
 * @module LiveMapModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    './RequestConfig.js',
    './RequestData.js',
    './ThreatsCollection.js'
], function(
    Backbone,
    RequestConfig,
    RequestData,
    ThreatsCollection
) {
    /** 
     * LiveMapModel defination.
     */
    var LiveMapModel = Backbone.Model.extend({
        defaults: function() {
            return {
                'animationStartTime' : 0,
                // request fields (from client)
                'startTime': undefined,
                'endTime': undefined,

                'threatCount': 0,

                // response fields (from server)
                'threats': new ThreatsCollection()     // a backbone collection for all threats
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
            var startTime = new Date(options.now.getTime() - options.pollInterval);   // start at poll interval behind 
            var endTime = options.now; // ends at now
            this.set('startTime', startTime);
            this.set('endTime', endTime);

            var self = this;
            RequestData.getAggregatedCount(this.getTimeInterval(), null, RequestConfig.getAllThreatFilters()).then(function(data) {
                // get all threats count
                if (data.response.result) {
                    if (data.response.result.length > 0) {
                        self.set('threatCount', Number(data.response.result[0].value));
                    }
                }

                self.fetchThreats().then(function() {
                    // console.log('-------new fetched group---------');
                    var fetchStartTime = new Date(self.get('startTime')).getTime();
                    self.set('animationStartTime', fetchStartTime);
                    self.trigger('sync', self);
                }, function(xhr, state, error) {
                    console.log('error: ', JSON.stringify(error));
                    self.trigger('error', self);
                });

            }, function(xhr, state, error) {
                console.log('error: ', JSON.stringify(error));
                  self.trigger('error', self);
            });
        },

        fetchThreats: function() {
            var deferred = $.Deferred();

            var reqBody = RequestConfig.getRequestBodyForLogs();
            reqBody.request['time-interval'] = this.getTimeInterval();
            var threatCount = this.get('threatCount');
            if (threatCount == 0 || !(threatCount)) {
                threatCount = 1;
            }
            reqBody.request['size'] = threatCount > 400 ? 400 : threatCount;
            // reqBody.request['size'] = threatCount;

            reqBody.request.filters['or'] = RequestConfig.getAllThreatFilters();

            this.get('threats').fetch({
                data: JSON.stringify(reqBody),
                contentType: 'application/json',
                success: function() {
                    //console.log('threats fetched');
                    deferred.resolve();
                },
                error: function() {
                    console.log('threats can\'t be fetched');
                    deferred.reject();
                }
            });

            return deferred.promise();
        }
    });

    return LiveMapModel;
});