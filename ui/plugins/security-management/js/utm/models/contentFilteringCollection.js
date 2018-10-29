/** 
 * A Backbone collection for content filtering profile
 *
 * @module ContentFilteringCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './contentFilteringModel.js',
    '../../../../ui-common/js/models/spaceCollection.js'
], function(Model, SpaceCollection) {

    var ContentFilteringCollection = SpaceCollection.extend({
        model: Model,
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'content-filtering-profiles.content-filtering-profile',
                accept: 'application/vnd.juniper.sd.utm-management.content-filtering-profile-refs+json;version=1;q=0.01'
            });
        },
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/content-filtering-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        }
    });

    return ContentFilteringCollection;
});