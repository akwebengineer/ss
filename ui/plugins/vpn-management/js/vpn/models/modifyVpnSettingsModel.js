/**
 * A Backbone model representing a ipsec-vpn (/api/juniper/sd/vpn-management/ipsec-vpns/modify-vpn).
 * @module ModifyIpsecVpnModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * ModifyIpsecVpnModel definition
     */
    var ModifyIpsecVpnModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/ipsec-vpns/modify-vpn',

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
                jsonRoot: 'modify-vpn',
                accept: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.modify-vpn-response+json;version=2',
                contentType: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.modify-vpn+json;version=2;charset=UTF-8'
            });
        }
    });

    return ModifyIpsecVpnModel;
});