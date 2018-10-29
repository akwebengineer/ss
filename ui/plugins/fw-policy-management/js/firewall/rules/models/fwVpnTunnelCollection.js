/**
 * A Backbone model representing firewall VPN Tunnel collection
 * @module FWVpnTunnelCollection
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  '../constants/fwRuleGridConstants.js'
], function (SpaceCollection, PolicyManagementConstants) {
    /**
     * FWVpnTunnelCollection definition.
     */
    var VPNTunnelCollection = SpaceCollection.extend({
        urlRoot: undefined,
        policyId: undefined,

        initialize: function(policyId) {

            this.policyId = policyId;
            this.urlRoot = PolicyManagementConstants.POLICY_URL;
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'VpnTunnelList.vpn-tunnel-refs',
                accept: PolicyManagementConstants.POLICY_VPN_ACCEPT_HEADER,
                contentType: PolicyManagementConstants.POLICY_VPN_CONTENT_TYPE
            });
        },

        sync: function (method, model, options) {
            switch (method) { // method = update | delete | read | create | patch
                case "read":
                    options.url = this.urlRoot + this.policyId + PolicyManagementConstants.VPN_TUNNELS;
                break;
            }
            return SpaceCollection.prototype.sync.call(this, method, model, options);
        }
    });

    return VPNTunnelCollection;
});
