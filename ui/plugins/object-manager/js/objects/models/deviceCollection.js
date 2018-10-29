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
    var ServiceCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/device-management/devices";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'devices.device',
                accept: 'application/vnd.juniper.sd.device-management.devices+json;version=1;q=0.01'
            });
        }
  });

  return ServiceCollection;
});