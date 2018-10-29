/**
 * A form configuration for Firewall Rule VPN Tunnels
 *
 * @module BaseRuleVPNTunnelsConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var BaseRuleVPNTunnelsConfiguration = function (context) {

        this.getElements = function () {
            return [
                        {
                            "element_description": true,
                            "value": '<select class="wizardvpnTunnel" style="width: 100%"></select>',
                            "id": "vpn_tunnel",
                            "name": "vpn_tunnel",
                            "class": "vpn_tunnel_class",
                            "label": context.getMessage("tunnel"),
                            "width": 100,
                            "required": true,
                            "error": context.getMessage("error_make_selection"),
                            "field-help": {
                                "content": "Actions",
                                "ua-help-identifier": "alias_for_action_binding"
                            }
                        }
                    ]
        };
    };
    
    return BaseRuleVPNTunnelsConfiguration;
});
