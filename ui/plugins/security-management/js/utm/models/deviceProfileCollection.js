/**
 * A Backbone collection for utm device profile
 *
 * @module DeviceProfileCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './deviceProfileModel.js',
    '../../../../ui-common/js/models/spaceCollection.js'
], function(Model, SpaceCollection) {

    var DeviceProfileCollection = SpaceCollection.extend({
        model: Model,
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'utm-device-profiles.utm-device-profile',
                accept: 'application/vnd.juniper.sd.utm-management.utm-device-profile-refs+json;version=1;q=0.01'
            });
        },
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/utm-device-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        }
    });

    return DeviceProfileCollection;
});