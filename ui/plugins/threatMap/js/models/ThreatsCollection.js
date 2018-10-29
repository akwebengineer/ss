/** 
 * A Backbone collection for all threats.
 *
 * @module ThreatsCollection
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './ThreatModel.js'
], function(
    Backbone,
    ThreatModel
) {
    /** 
     * ThreatsCollection defination.
     */
    var ThreatsCollection = Backbone.Collection.extend({
        url: '/api/juniper/ecm/log-scoop/logs',

        model: ThreatModel,

        initialize: function() {
        },

        fetch: function(options) {
            options = options || {};
            options.type = 'POST';
            Backbone.Collection.prototype.fetch.call(this, options);
        },

        parse: function(data) {
            //console.log('threats parse(), total-records: ' + data.response.header['result-count']);
            return data.response.result;
        }
    });

    return ThreatsCollection;
});