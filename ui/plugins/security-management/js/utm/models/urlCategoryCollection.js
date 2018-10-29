/**
 * Collection for getting url category 
 * 
 * @module UrlCategoryCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './urlCategoryModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * UrlCategoryCollection definition.
     */
    var UrlCategoryCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/url-category-lists";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'url-category-lists.url-category-list',
                accept: 'application/vnd.juniper.sd.utm-management.url-category-lists+json;version=2;q=0.02'
            });
        }
  });

  return UrlCategoryCollection;
});