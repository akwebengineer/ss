/** 
 * A Backbone collection for anti-virus profile
 *
 * @module AntiVirusCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './antiVirusModel.js'
], function(SpaceCollection, Model) {

    // TODO - Extend SpaceCollection (to be created) that understands accept and url filtering parameters
    var AntiVirusCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/anti-virus-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'anti-virus-profiles.anti-virus-profile',
                accept: 'application/vnd.juniper.sd.utm-management.anti-virus-profile-refs+json;version=1;q=0.01'
            });
        }
    });

    return AntiVirusCollection;
});