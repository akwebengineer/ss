/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var formConfiguration = {};
    var formatTexts = function (cellvalue, options, rowObject){
        var rowSubtitle = cellvalue.toLowerCase();
        if (cellvalue){
            rowSubtitle = cellvalue.split("_");
            if (rowSubtitle[0]&&rowSubtitle[1]){
                rowSubtitle = rowSubtitle[0].substr(0,1).toUpperCase()+rowSubtitle[0].substr(1).toLowerCase() + " " + rowSubtitle[1].substr(0,1).toUpperCase()+rowSubtitle[1].substr(1).toLowerCase();
            }
        }
        return rowSubtitle;
    };
    formConfiguration.EndPointQuickView = {
            "title": "EndPoint Details",
            "form_id": "endPoint_details_form",
            "form_name": "endPoint_details_form",
            "on_overlay": true,
            "sections": [
                        {
                        "elements": [
                            {
                                "element_description": true,
                                "id": "quick_view_name",
                                "label": "Device Name", //this.context.getMessage('import_vpn_device_name'),
                                "value": "{{name}}"
                            },{
                                "element_description": true,
                                "id": "quick_view_getway_ip",
                                "label": "Getway IP" ,//this.context.getMessage('import_vpn_getway_ip'), //,
                                "value": "{{gw_address}}"
                            },{
                              "element_description": true,
                              "id": "quick_view_tunnel_interface",
                              "label": "Tunnel Interface" , //this.context.getMessage('import_vpn_ike_policy'), //,
                              "value": "{{tunnel_if_name}}"
                            },{
                                "element_description": true,
                                "id": "quick_view_ike_policy",
                                "label": "IKE Policy",//this.context.getMessage('import_vpn_ike_policy'),
                                "value": "{{ike_policy_name}}"
                            },{
                              "element_description": true,
                              "id": "quick_view_ipsec_policy",
                              "label": "IPSec Policy" , //this.context.getMessage('import_vpn_ike_policy'), //,
                              "value": "{{ipsec-policy-name}}"
                            },{
                                "element_description": true,
                                "id": "quick_view_proxy_id",
                                "label": "Proxy Id" , //this.context.getMessage('import_vpn_ike_policy'), //,
                                "value": "{{proxy-id}}"
                            }
                        ]
            }],
            "buttons": [{
                "id": "quick_view_ok",
                "name": "quick_view_ok",
                "value": "Close"
              }
            ]
        };

    formConfiguration.DeviceQuickView = {
        "title": "Device Details",
        "form_id": "device_details_form",
        "form_name": "device_details_form",
        "on_overlay": true,
        "sections": [
                    {
                    "elements": [
                        {
                            "element_description": true,
                            "id": "device_quick_view_name",
                            "label": "IP Address",//this.context.getMessage('import_vpn_device_name'),
                            "value": "{{name}}"
                        }
                    ]
        }],
        "buttons": [{
            "id": "quick_view_ok",
            "name": "quick_view_ok",
            "value": "Close"
          }
        ]
    };

    formConfiguration.VpnQuickView = {
        "title": "VPN Details",
        "form_id": "quick_view_form",
        "form_name": "quick_view_form",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_description": true,
                        "id": "quick_view_name",
                        "label": "Name",//this.context.getMessage('import_vpn_device_name'),
                        "value": "{{rowId}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_routing_type",
                        "label": "Type",//this.context.getMessage('import_vpn_type'),
                        "value": "{{vpn-tunnel-mode-types}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_topology",
                        "label": "Topology",
                        "value": "{{topology-type}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_profile_name",
                        "label": "Profile Name", //this.context.getMessage('import_vpn_profile_name'),
                        "value": "{{profile_name}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_multi_proxy",
                        "label": "Multi Proxy Id",//this.context.getMessage('import_vpn_multi_proxy_vpn'), //"Multi ProxyId VPN",
                        "value": "{{multi-proxy-id}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_auto_vpn",
                        "label": "Auto VPN", //this.context.getMessage('import_vpn_auto_vpn'), //"Auto VPN",
                        "value": "{{auto-vpn}}"
                    },{
                        "element_description": true,
                        "id": "quick_view_advpn",
                        "label": "ADVPN",//this.context.getMessage('import_vpn_add_vpn'), //"ADVPN",
                        "value": "{{advpn}}"
                     },{
                        "element_description": true,
                        "id": "quick_view_tunnel_interface_type",
                        "label": "Tunnel Interface Type (Subnet)", //this.context.getMessage('import_vpn_tunnel_mode_types'), //"Tunnel Interface Type (Subnet)",
                        "value": "{{tunnel-interface-type}}"
                     },{
                       "element_description": true,
                       "id": "quick_view_routing_type",
                       "label": "Routing Type", //this.context.getMessage('import_vpn_routing_type'), //"Routing Type",
                       "value": "{{routing-type}}"
                    }
                ]
            }],
        "buttons": [{
                "id": "quick_view_ok",
                "name": "quick_view_ok",
                "value": "Close"
            }
        ]
    };

return formConfiguration;

});
