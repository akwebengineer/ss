/**
 * A module that extends Backbone.Collection
 * for device api based data models. 
 *
 * @module DeviceDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 
define([
    'backbone',
    './spaceCollection.js',
    'mockjax'
], function (Backbone, SpaceCollection) {

    /**
     * DeviceDataCollection collections definition
     */
    var DeviceDataCollection = SpaceCollection.extend({
        initialize: function () {
            var acceptHeaderString = 'application/json';
            if(arguments[0]){
                if(arguments[0]['accept']){
                    acceptHeaderString = arguments[0]['accept'];
                }
            }
            SpaceCollection.prototype.initialize.call(this, {
                accept: acceptHeaderString
            });
        },

        url: function () {
            return this.urlRoot;
        },

        fetch: function (options) {
            var self = this;
            options ||  (options = {});

            this.startTime = options.queryParams['start-time'];
            this.endTime = options.queryParams['end-time'];
            self.url = options.queryParams.url;
            options.data = $.param(options.queryParams);
            delete options.queryParams;
            Backbone.Collection.prototype.fetch.apply(self, [options]);
        },

        parse: function (response) {
            var rootKey = Object.keys(response)[0].trim();
            var resultArray = response[rootKey];
            var values = _.pluck(resultArray.results, 'utilization-summary'); 
            var keys = _.pluck(_.pluck(resultArray.results, 'device'), 'host-name');
            var transFormedResultArray = [];
            for (var ii = 0; ii < resultArray.results.length; ii++) {
                var details = resultArray.results[ii]['component-utilization-summaries'];
                var detailsArray = [];
                if (details) {
                    if (!Array.isArray(details)) {
                        detailsArray.push(details);
                    } else {
                        detailsArray = details;
                    }
                }
                transFormedResultArray.push(
                    {
                        'key'           : keys[ii], 
                        'value'         : values[ii], 
                        'detailsArray'  : detailsArray,
                        'threshold'     : 90
                    }
                );
            }
            return transFormedResultArray;
        }
    });

    return DeviceDataCollection;
});
