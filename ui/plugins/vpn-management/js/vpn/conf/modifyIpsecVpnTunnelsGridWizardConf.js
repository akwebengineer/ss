/**
 * A configuration object with the parameters required to build 
 * a grid for VPN Tunnels
 *
 * @module modifyIpsecVpnTunnelsGridConfiguration
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 * device-name
 * external-if-name
 * tunnel-zone
 * peer-device
 * device-name
 * device-ip
 * traffic-selectors
 * tunnel-if-name
 * ike-id
 * vpn-name-in-device
 * local-proxyid
 * remote-proxyid
 * ike-gateway-name
 * ike-policy-name
 * ipsec-policy-name
 * preshared-key
 * profile
 * device-ip
 * edit-version
 * version
 * domain-id
 *
 * Display Columns
 * --------------
 * peer device
 * vpn name
 * vpn profile
 * ike id
 * proxy id
 * traffic selector
 * preshared key
 * external interface
 * tunnel interface
 * tunnel zone
 * ike policy name
 * ipsec policy name
 * ike gateway
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context, linkValue) {

        this.getValues = function(UUID) {

             formatMTUCell = function (cellValue, options, rowObject) {
                cellValue = "";
                if(rowObject['max-transmission-unit'] != "-1") {
                       cellValue = rowObject['max-transmission-unit'];
                } else {
                    return cellValue;
                }
                return cellValue;
             };

             formatAdvpnCell = function (cellValue, options, rowObject) {
                   cellValue = "";
                   if(rowObject['advpn-settings']['shortcut-conn-limit'] != undefined && rowObject['advpn-settings']['shortcut-conn-limit'] != "" &&
                      rowObject['advpn-settings']['idle-threshold'] != undefined && rowObject['advpn-settings']['idle-threshold'] != "" &&
                      rowObject['advpn-settings']['idle-time'] != undefined && rowObject['advpn-settings']['idle-time'] != "") {

                           cellValue = "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_shortcut_limit")+"</b>"+ ":" + rowObject['advpn-settings']['shortcut-conn-limit']+"\n";
                           cellValue += "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_threshold")+"</b>" + ":" + rowObject['advpn-settings']['idle-threshold']+"\n";
                           cellValue += "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_time")+"</b>" + ":" + rowObject['advpn-settings']['idle-time'];
                    }

                  return cellValue;
              };

             formatTunnelSelectorCell = function (cellValue, options, rowObject) {
                  cellValue = "";
                  var ts = rowObject['traffic-selectors']['traffic-selector'];
                  if(ts != undefined) {
                      cellValue += "<b>"+context.getMessage("ipsec_vpns_tunnels_column_ts_local-ip")+"</b>" + " - " + "<b>" + context.getMessage("ipsec_vpns_tunnels_column_ts_remote-ip") + "</b>" + "\n";
                      ts.forEach(function(object) {
                          cellValue += object['local-ip'] + " - " + object['remote-ip'] + "\n";
                      });
                  }

                  return cellValue;
             };

             formatProxyIdCell = function (cell, cellValue, options, rowObject) {
                cellValue = "";
                var listValues = [];
                listValues.push(rowObject['local-proxyid']);
                listValues.push(rowObject['remote-proxyid']);
                cellValue = listValues;
             return cellValue;
               /*


                localProxyId = rowObject['local-proxyid'];
                remoteProxyId = rowObject['remote-proxyid'];
                if(localProxyId != undefined && localProxyId != "" &&
                    remoteProxyId != undefined && remoteProxyId != "") {
                        cellValue = rowObject['local-proxyid']+"\n"+rowObject['remote-proxyid'];
                }*/

      //          return listValues;
             };

            return {
                "title-help": {
                    "content": context.getMessage("view_tunnel_tooltip"),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "tunnelEndpoints",
                "numberOfRows": 20,
                "height": "350px",
                "repeatItems": "true",
                "showWidthAsPercentage" : false,
                "scroll": true,
                "editRow": {
                    "showInline": true
                },
                "contextMenu": {
                    "edit": "Edit Row Selection"
                },
               // "on_overlay": true,
                "multiselect": true,
                "url": "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-tunnel-endpoints?ui-session-id=" + UUID,
                "jsonRoot": "tunnels.tunnel",
                "jsonRecords": function(data) {
                    return data.tunnels['@total'];
                },

                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-tunnel-details+json;version=1;q=0.01'
                    }
                },

                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_action_label"),
                        "key": "saveEvent"
                    }]
                 },
                "columns": [
                    {
                        "index"           : "id",
                        "name"            : "id",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_id"),
                        "hidden"          : true
                    },
                    {
                        "index"           : "device-name",
                        "name"            : "device-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_device")
                    },
                    {
                        "index"           : "peer-device.device-name",
                        "name"            : "peer-device.device-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_peer_device")
                    },
                    {
                        "index"           : "vpn-name-in-device",
                        "name"            : "vpn-name-in-device",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_vpn_name_in_device"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "profile.name",
                        "name"            : "profile.name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_profile"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "ike-id",
                        "name"            : "ike-id",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_id"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "local-proxyid",
                        "name"            : "local-proxyid",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_proxy_id"),
               //         "formatter"       : formatProxyIdCell,
                        "collapseContent" : true
                    },
                    {
                        "index"           : "traffic-selectors",
                        "name"            : "traffic-selectors",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector"),
                        "readonly"        : true,
                        "formatter"       : formatTunnelSelectorCell
                    },
                    {
                        "index"           : "preshared-key",
                        "name"            : "preshared-key",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_preshared_key"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "external-if-name",
                        "name"            : "external-if-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_external_interface")
                     },
                    {
                        "index"           : "tunnel-if-name",
                        "name"            : "tunnel-if-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_interface")
                    },
                    {
                        "index"           : "max-transmission-unit",
                        "name"            : "max-transmission-unit",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_mtu"),
                        "formatter"       : formatMTUCell,
                        "editCell": {
                            "type": "input",
                            "pattern": "^([1-9]\d*)$"
                        }
                    },
                    {
                        "index"           : "tunnel-zone",
                        "name"            : "tunnel-zone",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_zone")
                    },
                    {
                        "index"           : "advpn-settings",
                        "name"            : "advpn-settings",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_advpn_settings"),
                        "readonly"        : true,
                        "formatter"       : formatAdvpnCell
                    },
                    {
                        "index"           : "ike-policy-name",
                        "name"            : "ike-policy-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_policy_name")
                    },
                    {
                        "index"           : "ipsec-policy-name",
                        "name"            : "ipsec-policy-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ipsec_policy_name")
                    },
                    {
                        "index"           : "ike-gateway-name",
                        "name"            : "ike-gateway-name",
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_gateway")
                    }]
            }
        }
    };

    return Configuration;
});
