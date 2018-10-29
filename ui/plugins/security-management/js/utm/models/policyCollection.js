/**
 * Collection for getting utm policy 
 * 
 * @module PolicyCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './policyModel.js'
], function(SpaceCollection, Model) {
    /**
     * PolicyCollection definition.
     */
    var PolicyCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/utm-policies";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'utm-policies.utm-policy',
                accept: 'application/vnd.juniper.sd.utm-management.utm-policy-refs+json;version=1;q=0.01'
            });
        }
  });

  return PolicyCollection;
});