/**
 *
 * @module ModifyTunnelRouteSettingsVpnModel
 * @author Srinivasan Sriramulu <ssriram@juniper.net>
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
    var ModifyTunnelRouteSettingsVpnModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-tunnel-settings-in-cache?ui-session-id=',

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
                jsonRoot:   'vpn-basic-details',
                //accept: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.modify-vpn-response+json;version=1',
                contentType: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8'
            });
        }
    });

    return ModifyTunnelRouteSettingsVpnModel;
});