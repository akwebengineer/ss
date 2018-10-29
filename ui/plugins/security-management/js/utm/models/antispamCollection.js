/** 
 * A Backbone collection for anti-spam profile
 *
 * @module AntispamCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './antispamModel.js',
    '../../../../ui-common/js/models/spaceCollection.js'
], function(Model, SpaceCollection) {

    // TODO - Extend SpaceCollection (to be created) that understands accept and url filtering parameters
    var AntispamCollection = SpaceCollection.extend({
        model: Model,
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'anti-spam-profiles.anti-spam-profile',
                accept: 'application/vnd.juniper.sd.utm-management.anti-spam-profile-refs+json;version=1;q=0.01'
            });
            
        },
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/anti-spam-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        }
    });

    return AntispamCollection;
});