/** 
 * A Backbone collection for object reference
 *
 * @module ObjectReferenceCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './spaceCollection.js'
], function(SpaceCollection) {

    var ObjectReferenceCollection = SpaceCollection.extend({
        url: function(query) {
            var baseUrl = "/api/space/search/query";

            if (query) {
                return baseUrl + "?qstr=referenceIds:(" + query + ")&appname=SD&facet=All&page=1&start=0&limit=1000";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'response',
                accept: 'application/vnd.net.juniper.space.search.query-response+json;version=1'
            });
        }
    });

    return ObjectReferenceCollection;
});