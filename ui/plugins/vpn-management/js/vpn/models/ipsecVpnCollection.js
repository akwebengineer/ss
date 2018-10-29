/** 
 * A Backbone model representing a collection of ipsec-vpns (/api/juniper/sd/vpn-management/ipsec-vpns/).
 *
 * @module IpsecVpnCollection
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './ipsecVpnModel.js'
], function(
    SpaceCollection,
    IpsecVpnModel
) {
    /** 
     * IpsecVpnCollection definition.
     */
    var IpsecVpnCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = '/api/juniper/sd/vpn-management/ipsec-vpns';

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " " + filter.value + "')";
            }
            return baseUrl;
        },
        model: IpsecVpnModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ipsec-vpns.ipsec-vpn',
                accept: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns+json;version=1'
            });
        }
    });

    return IpsecVpnCollection;
});