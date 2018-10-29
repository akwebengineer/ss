
/**
 * A Backbone model representing utm url category
 *
 * @module UrlCategoryModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * UrlCategoryModel definition.
    */
    var UrlCategoryModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/url-category-lists',
        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                "jsonRoot": "url-category-list",
                "accept": "application/vnd.juniper.sd.utm-management.url-category-list+json;version=1",
                "contentType": "application/vnd.juniper.sd.utm-management.url-category-list+json;version=1;charset=UTF-8"
            });
        }
    });

    return UrlCategoryModel;
});