/**
 * A module that extends Backbone.Collection
 * for device api based data models. 
 *
 * @module PolicyDataCollection
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
 
define([
    './deviceDataCollection.js'
], function (SpaceCollection) {

    /**
     * PolicyDataCollection collections definition
     */
    var PolicyDataCollection = SpaceCollection.extend({
        parse: function (response) {
            var rootKey = Object.keys(response)[0].trim();
            var resultArray = response[rootKey];

            var values = _.pluck(resultArray['policy-hit-count-reference'], 'rule-count'); 
            var keys = _.pluck(resultArray['policy-hit-count-reference'], 'policy-name');

            var transFormedResultArray = [];
            for (var ii = 0; ii < resultArray['policy-hit-count-reference'].length; ii++) {
                transFormedResultArray.push(
                    {
                        'key'           : keys[ii], 
                        'value'         : values[ii]
                    }
                );
            }
            return transFormedResultArray;
        }
    });

    return PolicyDataCollection;
});
