/**
 * Collection for getting url category 
 * 
 * @module WebFilteringCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './webFilteringModel.js'
], function(SpaceCollection, Model) {
    /**
     * WebFilteringCollection definition.
     */
    var WebFilteringCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/web-filtering-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'web-filtering-profiles.web-filtering-profile',
                accept: 'application/vnd.juniper.sd.utm-management.web-filtering-profile-refs+json;version=1;q=0.01'
            });
        }
  });

  return WebFilteringCollection;
});
