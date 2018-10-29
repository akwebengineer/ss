/**
 * A module that extends Backbone.Collection
 * for device api based data models. 
 *
 * @module SessionsDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 
define([
    './deviceTrafficDataCollection.js'
], function (DeviceCollection) {

    /**
     * DeviceDataCollection collections definition
     */
    var SessionsDataCollection = DeviceCollection.extend({
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
            
            var inputPackets = _.pluck(resultArray.results, 'incoming-' + rankBy);
            var outputPackets = _.pluck(resultArray.results, 'outgoing-' + rankBy);                                    
            var valuesInPackets = _.pluck(resultArray.results, 'total-' + rankBy);

            // pluck time series data.
            var timeValues = [];
            var values = []; 
            var timeValue = [];

            for(var jj = 0; jj < resultArray.results.length; jj++){
                if(response[rootKey].results[jj]['sample-data']){
                    values      = _.pluck(response[rootKey].results[jj]['sample-data'], this.viewBy + '-' + this.rankBy);
                    timeValues  = _.map(_.pluck(response[rootKey].results[jj]['sample-data'], 'time'), function(epochTime){
                        return new Date(epochTime); 
                    });
                    for(var x = 0 ; x < timeValues.length; x++){
                        if(x == 0){
                            // init child array.
                            timeValue[jj] = [];
                        }
                        timeValue[jj].push(
                            { 
                                'value' : values[x],
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
                        'total'         : valuesInPackets[ii],
                        'barComponents' : {},
                        'time-value'    : timeValue[ii],
                        'details'       : ''
                    };
                if (this.viewBy == 'total') {
                    obj.value = Math.round(valuesInPackets[ii]).toLocaleString();
                    obj.barComponents['Incoming'] = inputPackets[ii];
                    obj.barComponents['Outgoing'] = outputPackets[ii];
                    obj.details =  nameLabel + keys[ii] + '<br />' + 'Incoming: ' + Math.round(inputPackets[ii]).toLocaleString() + ' ' + rankBy + '<br />' + 'Outgoing: ' + Math.round(outputPackets[ii]).toLocaleString() + ' ' + rankBy;
                } else if (this.viewBy == 'incoming') {
                    obj.value = Math.round(inputPackets[ii]).toLocaleString();
                    obj.barComponents['Incoming'] = inputPackets[ii];
                    obj.details = nameLabel + keys[ii] + '<br />' + 'Incoming: ' + Math.round(inputPackets[ii]).toLocaleString() + ' ' + rankBy;
                } else if (this.viewBy == 'outgoing') {
                    obj.value = Math.round(outputPackets[ii]).toLocaleString();                    
                    obj.barComponents['Outgoing'] = outputPackets[ii]; 
                    obj.details = nameLabel + keys[ii] + '<br />' + 'Outgoing: ' + Math.round(outputPackets[ii]).toLocaleString() + ' ' + rankBy;
                }
                if (timeValue[ii]) {
                    obj['time-value'] = timeValue[ii];
                }
                transFormedResultArray.push(obj);
            }
            return transFormedResultArray;
        }
    });

    return SessionsDataCollection;
});
