/**
 * A module that extends Backbone.Collection
 * for dashboard dashlet widgets.
 *
 * @module AggregateDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './spaceCollection.js'
], function (Backbone, SpaceCollection) {

    /**
     * AggregateDataCollection collections definition
     */
    var AggregateDataCollection = SpaceCollection.extend({
        initialize: function () {
            this.urlRoot = arguments[0].queryParams.url;
            this.urlTimeSeriesPath = arguments[0].queryParams.timeSeriesUrlPath;
            this.urlDefaultPath = arguments[0].queryParams.defaultUrlPath;

            SpaceCollection.prototype.initialize.call(this, {
                accept: '*/*'
            });
        },

        url: function () {
            if(arguments[0] === 'timeSeriesChart'){
                return this.urlRoot + this.urlTimeSeriesPath;
            }
            return this.urlRoot + this.urlDefaultPath;
        },

        fetch: function (options) {
            var self = this;
            options ||  (options = {});
            options.data = $.param(options.queryParams);

            this.startTime = options.queryParams['start-time'];
            this.endTime = options.queryParams['end-time'];

            var startTime = new Date(options.queryParams['start-time']).toJSON();
            var endTime = new Date(options.queryParams['end-time']).toJSON();

            var timeInterval = startTime.slice(0, startTime.length - 5) + 'Z' + '/' + endTime.slice(0, endTime.length - 5) + 'Z';

            var messageBody = {
                'time-interval'             : timeInterval,
                'order'                     : options.queryParams['order'],
                'aggregation'               : options.queryParams['aggregation'],
                'size'                      : options.queryParams['count']

            };
            var timeSeries = '';
            if(options.queryParams['response-type'] === 'timeSeriesChart' 
                || options.queryParams['response-type'] === 'timeline'){

                timeSeries = 'timeSeriesChart'
                if (options.queryParams['aggregation-attributes']) {
                    messageBody['aggregation-attributes'] = options.queryParams['aggregation-attributes'][0];
                }
                messageBody['slots'] = options.queryParams['slots'];

            }else {
                if (options.queryParams['aggregation-attributes']) {
                    messageBody['aggregation-attributes'] = options.queryParams['aggregation-attributes'];
                }
            }
            if (options.queryParams['filters']) {
                messageBody['filters'] = options.queryParams['filters'];
            }
            if (options.queryParams['aggregation-attribute']) {
                messageBody['aggregation-attribute'] = options.queryParams['aggregation-attribute'];
            }

            Backbone.Collection.prototype.fetch.call(this, {
                type: 'POST',
                contentType: 'application/json',
                url: self.url(timeSeries),
                data: JSON.stringify({'request' : messageBody}),
                success: options.success,
                error: options.error
            });
        },

        parse: function (response) {
            var hasResults = false;
            var resultArray;
            if (response.response.header.key == 'time-series') {
                var nSlots = response.response.header.value.length;
                var nValues = 0;
                for (var ii = 0 ; ii < nSlots; ii++) {
                    if (response.response.result[ii]['time-value'] != null) {
                        nValues = response.response.result[ii]['time-value'].length;
                    }
                    for (var jj = 0 ; jj < nValues; jj++) {
                        if (response.response.result[ii]['time-value'] != null) {
                            hasResults = true;
                            response.response.result[ii]['time-value'][jj]['time'] = response.response.header.value[ii];
                        }
                    }
                }
                if(hasResults) {
                    resultArray = response.response.result;
                }
                return resultArray;
            }
            resultArray = response.response.result;
            return resultArray;
        }
    });

    return AggregateDataCollection;
});
