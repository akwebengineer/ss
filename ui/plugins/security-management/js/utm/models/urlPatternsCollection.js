/**
 * Collection for getting url patterns 
 * 
 * @module UrlPatternsCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './urlPatternModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * UrlPatternsCollection defination.
     */
    var UrlPatternsCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/url-patterns";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'url-patterns.url-pattern',
                accept: 'application/vnd.juniper.sd.utm-management.url-patterns-refs+json;version=1;q=0.01'
            });
            
        }
  });

  return UrlPatternsCollection;
});