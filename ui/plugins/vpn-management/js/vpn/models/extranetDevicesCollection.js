/** 
 * A Backbone collection representing a extranet-device (/api/juniper/sd/vpn-management/extranet-devices).
 *
 * @module ExtranetDevicesCollection
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './extranetDeviceModel.js'
], function(
    SpaceCollection,
    ExtranetDeviceModel
) {
    /** 
     * ExtranetDevicesCollection defination.
     */
    var ExtranetDevicesCollection = SpaceCollection.extend({
      url: function(filter) {
            var baseUrl = "/api/juniper/sd/vpn-management/extranet-devices";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        model: ExtranetDeviceModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'extranet-devices.extranet-device',
                accept: 'application/vnd.juniper.sd.vpn-management.extranet-devices+json;q=0.01;version=1'
            });
        }
    });

    return ExtranetDevicesCollection;
});