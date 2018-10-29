/** 
 * A Backbone model representing a collection of ipsec-vpns devices (/api/juniper/sd/vpn-management/ipsec-vpns/<id>/devices).
 *
 * @module IpsecVpnDevicesCollection
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './ipsecVpnDevicesModel.js'
], function(
    SpaceCollection,
    IpsecVpnDevicesModel
) {
    /** 
     * IpsecVpnDevicesCollection definition.
     */
    var IpsecVpnDevicesCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = '/api/juniper/sd/vpn-management/ipsec-vpns';

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " " + filter.value + "')";
            }
            return baseUrl;
        },
        model: IpsecVpnDevicesModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'devices.device',
                accept: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=2'
            });
        }
    });

    return IpsecVpnDevicesCollection;
});
