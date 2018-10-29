/**
 * A module that extends Backbone.Collection
 * for device api based data models. 
 *
 * @module DeviceTrafficDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 
define([
    './deviceDataCollection.js'
], function (DeviceCollection) {

    /**
     * DeviceTrafficDataCollection collections definition
     */
    var DeviceDataCollection = DeviceCollection.extend({
        fetch: function (options) {
            var self = this;
            options ||  (options = {});
            
            if(options.queryParams['rank-by']){
                var queryType = options.queryParams['rank-by'].split('-');
                this.viewBy = queryType[0];
                if (queryType.length === 3 ) {
                    this.rankBy = queryType[1] + '-' + queryType[2];
                } else {
                    this.rankBy = queryType[1];
                }
            }
            options.queryParams['max-results'] = options.queryParams['count'];
            this.startTime = options.queryParams['start-time'];
            this.endTime = options.queryParams['end-time'];
            self.url = options.queryParams.url;
            options.data = $.param(options.queryParams);
            delete options.queryParams;
            Backbone.Collection.prototype.fetch.apply(self, [options]);
        },
        parse: function (response) {
            var rootKey = Object.keys(response)[0].trim();
            var nameKey = 'zone';
            var nameLabel = 'Zone Name: ';
            var keys = [];
            if (rootKey === 'top-devices') {
                nameKey = 'host';
                nameLabel = 'Device Name: ';
                keys = _.map(response[rootKey].results, function(item){ return item['device'][nameKey + '-name'] });
            } else {
                keys = _.pluck(response[rootKey].results, nameKey + '-name');
            }
            var resultArray = response[rootKey];
            var rankBy = this.rankBy;

            var multiplier = _.map(resultArray.results, function(item){
                    if(item['values-unit'] === undefined){
                        return 1;
                    } return item['values-unit'];
                }
            );
            
            var inputPackets = _.pluck(resultArray.results, 'input-' + rankBy);
            var outputPackets = _.pluck(resultArray.results, 'output-' + rankBy);                                    
            var valuesInPackets = _.pluck(resultArray.results, 'total-' + rankBy);

            // pluck time series data.
            var timeValues = [];
            var values = []; 
            var timeValue = [];

            for(var jj = 0; jj < resultArray.results.length; jj++){
                if(response[rootKey].results[jj]['sample-data']){
                    values = _.pluck(response[rootKey].results[jj]['sample-data'], this.viewBy + '-' + this.rankBy);
                    timeValues = _.map(_.pluck(response[rootKey].results[jj]['sample-data'], 'time'), function(epochTime){
                        return new Date(epochTime); 
                    });
                    for(var x = 0 ; x < timeValues.length; x++){
                        if(x == 0){
                            // init child array.
                            timeValue[jj] = [];
                        }
                        timeValue[jj].push(
                            { 
                                'value' : values[x] * multiplier[jj],
                                'time'  : timeValues[x], 
                                'key'   : response[rootKey].results[jj][nameKey + '-name']
                            }
                        );
                    }
                } else {
                    break;
                }
            }

            var transFormedResultArray = [];
            for (var ii = 0; ii < resultArray.results.length; ii++) {
                var obj =  {
                        'key'           : keys[ii], 
                        'total'         : valuesInPackets[ii] * multiplier[ii],
                        'barComponents' : {},
                        'time-value'    : timeValue[ii],
                        'details'       : ''
                    };
                if (this.viewBy == 'total') {
                    obj.value = Math.round(valuesInPackets[ii] * multiplier[ii]).toLocaleString();
                    obj.barComponents['Incoming'] = inputPackets[ii] * multiplier[ii];
                    obj.barComponents['Outgoing'] = outputPackets[ii] * multiplier[ii];
                    obj.details =  nameLabel + keys[ii] + '<br />' + 'Incoming: ' + Math.round(inputPackets[ii] * multiplier[ii]).toLocaleString() + ' ' + rankBy + '<br />' + 'Outgoing: ' + Math.round(outputPackets[ii] * multiplier[ii]).toLocaleString() + ' ' + rankBy;
                } else if (this.viewBy == 'input') {
                    obj.value = Math.round(inputPackets[ii] * multiplier[ii]).toLocaleString();
                    obj.barComponents['Incoming'] = inputPackets[ii] * multiplier[ii];
                    obj.details = nameLabel + keys[ii] + '<br />' + 'Incoming: ' + Math.round(inputPackets[ii] * multiplier[ii]).toLocaleString() + ' ' + rankBy;
                } else if (this.viewBy == 'output') {
                    obj.value = Math.round(outputPackets[ii] * multiplier[ii]).toLocaleString();                    
                    obj.barComponents['Outgoing'] = outputPackets[ii] * multiplier[ii]; 
                    obj.details = nameLabel + keys[ii] + '<br />' + 'Outgoing: ' + Math.round(outputPackets[ii] * multiplier[ii]).toLocaleString() + ' ' + rankBy;
                }
                if (timeValue[ii]) {
                    obj['time-value'] = timeValue[ii];
                }
                transFormedResultArray.push(obj);
            }
            return transFormedResultArray;
        }
    });

    return DeviceDataCollection;
});
