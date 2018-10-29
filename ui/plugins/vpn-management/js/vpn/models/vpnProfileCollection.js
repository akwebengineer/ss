/** 
 * A Backbone collection representing all devices (/api/juniper/sd/vpn-management/vpn-profiles/).
 *
 * @module VPNProfileModelCollection
 * @author Stanley <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './vpnProfileModel.js'
], function (
    SpaceCollection,
    VPNProfileModel
) {
    /** 
     * DeviceCollection definition.
     */
    var VPNProfileCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = '/api/juniper/sd/vpn-management/vpn-profiles';

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        model: VPNProfileModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'vpn-profiles.vpn-profile',
                accept: 'application/vnd.juniper.sd.vpn-management.vpn-profiles+json;q=0.01;version=1'
            });
        }
    });

    return VPNProfileCollection;
});
