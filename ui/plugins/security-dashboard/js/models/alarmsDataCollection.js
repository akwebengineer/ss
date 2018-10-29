/**
 * A module that extends Backbone.Collection
 * for device api based data models. 
 *
 * @module DeviceTrafficDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 
define([
    './spaceModel.js',
    './deviceDataCollection.js'
], function (SpaceModel, DeviceCollection) {

    var barComponents  = { 1 : 'Info', 2 : 'Minor', 3: 'Major', 4: 'Critical'};

    /**
     * AlarmsDataCollection collections definition
     */
    var DeviceDataCollection = DeviceCollection.extend({
        initialize: function () {
                SpaceModel.prototype.initialize.call(this, {
                    accept: 'application/vnd.juniper.seci.alarms+json;version=1',
                    contentType: 'application/vnd.juniper.seci.alarms+json;version=1'
                });
        },
        fetch: function (options) {
            var self = this;
            options ||  (options = {});
        
            options.queryParams['max-results'] = options.queryParams['count'];
            this.startTime = options.queryParams['start-time'];
            this.endTime = options.queryParams['end-time'];
            self.url = options.queryParams.url;
            this.viewBy = barComponents[options.queryParams['severity']];
            options.data = $.param(options.queryParams);
            delete options.queryParams;
            Backbone.Collection.prototype.fetch.apply(self, [options]);
        },
        parse: function (response) {
            var self =  this;
            var rootKey = Object.keys(response)[0].trim();

            var resultArray = response[rootKey]['alarmCountBySource'];
            var keys = _.pluck(resultArray, 'sourceIp');
            var totals = _.pluck(resultArray, 'alarmCount');


            var transFormedResultArray = [];
            if(resultArray) {
                for (var ii = 0; ii < resultArray.length; ii++) {
                    var obj =  {
                            'key'           : keys[ii], 
                            'total'         : totals[ii],
                            'barComponents' : {},                            
                            'value'         : totals[ii],
                            'details'       : 'Device: ' + keys[ii] + '<br />' + 'Alarm count:  ' + totals[ii]
                        };
                    obj.barComponents[self.viewBy] = totals[ii];
                    transFormedResultArray.push(obj);
                }
            }
            return transFormedResultArray;
        }
    });

    return DeviceDataCollection;
});
