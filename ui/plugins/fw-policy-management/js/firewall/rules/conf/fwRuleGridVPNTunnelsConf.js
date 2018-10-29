/**
 * Rule Grid VPN Tunnels configuration object 
 *
 * @module FWRuleGridVPNTunnelsFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './baseVPNTunnelsConfig.js'
    ], function (BaseRuleVPNTunnelsConfig) {

    var FWRuleGridVPNTunnelsFormConfiguration = function (context) {

        this.gridVPNTunnels = function() {
            return {
                
                "title": context.getMessage("add_tunnel"),
                "heading": context.getMessage('tunnel_desc'),
                "form_id": "vpn_tunnels_form",
                "form_name": "vpn_tunnels_form",
                "title-help": {
                    "content": context.getMessage("add_tunnel"),
                    "ua-help-identifier": "alias_for_title_vpn_tunnels"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("add_tunnel"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "section_add_tunnel",
                        "section_class": "section_class",
                        "elements": new BaseRuleVPNTunnelsConfig(context).getElements()
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnVPNOk",
                        "name": "btnVPNOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
       };

    };

    return FWRuleGridVPNTunnelsFormConfiguration;

});
