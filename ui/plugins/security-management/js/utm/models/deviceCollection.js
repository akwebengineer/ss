/**
 * Collection for getting devices
 *
 * @module DeviceCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './deviceModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * DeviceCollection definition.
     */
    var DeviceCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/utm-management/utm-device-profiles/available-devices?sortby=(name(ascending))";

            if (filter) {
                return baseUrl + "&filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'available-devices.device',
                accept: 'application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1'
            });
        }
  });

  return DeviceCollection;
});