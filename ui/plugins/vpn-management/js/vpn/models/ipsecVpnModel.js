/** 
 * A Backbone model representing a ipsec-vpn (/api/juniper/sd/vpn-management/ipsec-vpns/<id>).
 *
 * @module IpsecVpnModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /** 
     * IpsecVpnModel defination.
     */
    var IpsecVpnModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/ipsec-vpns',

        /** 
         * Derrived class constructor method
         * Provide following while deriving a model from base model:
         * jsonRoot: for wrapping model's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         * contentType: content-type in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'ipsec-vpn',
                accept: 'application/vnd.juniper.sd.vpn-management.ipsec-vpn+json;version=2',
                contentType: 'application/vnd.juniper.sd.vpn-management.ipsec-vpn+json;version=2;charset=UTF-8'
            });
        }
    });

    return IpsecVpnModel;
});