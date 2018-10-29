/**
 * A configuration object with the parameters required to build 
 * a grid for VPN Tunnels
 *
 * @module ipsecVpnTunnelsGridConfiguration
 * @author Stanley Quan <squan@juniper.net>
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

    var Configuration = function(context, linkValue, vpnProfileDetails, selectedVPN) {
        context.vpnProfileDetails = vpnProfileDetails;

        this.getValues = function() {

             formatMtuCell = function (cellValue, options, rowObject) {
                return (rowObject['max-transmission-unit'] != "-1") ? rowObject['max-transmission-unit'] : "";
             };

             formatProxyIdCell = function (cellValue, options, rowObject) {
                cellValue = "";
                localProxyId = rowObject['local-proxyid'];
                remoteProxyId = rowObject['remote-proxyid'];
                if(localProxyId != undefined && localProxyId != "")
                        cellValue += "<b>" +"Local:  "+ "</b>"  + rowObject['local-proxyid'] +"\n";

                if(remoteProxyId != undefined && remoteProxyId != "")
                        cellValue += "<b>" +"Remote:  "+ "</b>" + rowObject['remote-proxyid'];

             return cellValue;
             };

             formatAdvpnCell = function (cellValue, options, rowObject) {
                 cellValue = "Not Applicable";

                 if(selectedVPN["advpn"] == "Enable") {
                    var shortcutVal = ((rowObject["advpn-settings"]['shortcut-conn-limit'] != undefined && rowObject["advpn-settings"]['shortcut-conn-limit'] != "") ? rowObject["advpn-settings"]['shortcut-conn-limit'] : "");
                    var idleThresholdVal = ((rowObject["advpn-settings"]['idle-threshold'] != undefined && rowObject["advpn-settings"]['idle-threshold'] != "") ? rowObject["advpn-settings"]['idle-threshold'] : "");
                    var idleTimeVal = ((rowObject["advpn-settings"]['idle-time'] != undefined && rowObject["advpn-settings"]['idle-time'] != "") ? rowObject["advpn-settings"]['idle-time'] : "");

                    cellValue = "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_shortcut_limit")+"</b>"+ ":" + shortcutVal+"\n";
                    cellValue += "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_threshold")+"</b>" + ":" + idleThresholdVal+"\n";
                    cellValue += "<b>"+context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_time")+"</b>" + ":" + idleTimeVal;
                 }

                return cellValue;
             };

             formatProfileSelectorCell = function (cellValue, options, rowObject) {
                  if((cellValue === "") || (cellValue === undefined)) {
                     cellValue = context.vpnProfileDetails;
                  }
                  return cellValue;
             };

             formatTunnelSelectorCell = function (cellValue, options, rowObject) {
                cellValue = "";
                var ts = rowObject['traffic-selectors']['traffic-selector'];
                if(ts != undefined && ts[0] != undefined) {
                    for(var v =0; v< ts.length; v++) {
                        cellValue += "<b>" + context.getMessage("ipsec_vpns_tunnels_column_ts_local-ip")+":  "+ "</b>"  + ts[v]['local-ip'] +" - ";
                        cellValue += "<b>" + context.getMessage("ipsec_vpns_tunnels_column_ts_remote-ip")+":  "+ "</b>" + ts[v]['remote-ip']+"\n";
                    }
                }
                return cellValue;
             };


           formatIkeIdCell = function (cellValue, options, rowObject) {
                 cellValue = "";
                 var ike_type_value = "";
                 if(rowObject['ike-type'] == "Host Name"){
                    ike_type_value = "Hostname";
                 }else if(rowObject['ike-type'] == "User At Hostname"){
                    ike_type_value = "User@hostname";
                 }else if(rowObject['ike-type'] == "IP Address"){
                    ike_type_value = "IPAddress";
                 }else if(rowObject['ike-type'] == "DN"){
                    ike_type_value = "DN";
                 }else if(rowObject['ike-type'] == "NONE"){
                    ike_type_value = "None";
                 }

                 if(rowObject['ike-id'] != "" && rowObject['ike-id'] != undefined && rowObject['ike-type'] != ""){
                   cellValue = '<b>'+ 'IKE Id:' +'</b>' +rowObject['ike-id']+"\n";
                   if(ike_type_value == ""){
                        cellValue += '<b>' +'IKE Id Type:' +'</b>' +rowObject['ike-type'];
                   }else{
                        cellValue += '<b>' +'IKE Id Type:' +'</b>' +ike_type_value;
                   }
                 }else{
                        cellValue = '<b>' +'IKE Id:' +'</b>'+"\n";
                   if(ike_type_value == ""){
                        cellValue += '<b>' +'IKE Id Type:' +'</b>' +rowObject['ike-type'];
                   }else{
                        cellValue += '<b>' +'IKE Id Type:' +'</b>' +ike_type_value;
                   }
                 }

                 return cellValue;
              };
            var onBeforeSearch = function (tokens){
                var newTokens = [];
                quickFilterParam = "quickFilter = ",
                    quickFilerParamLength = quickFilterParam.length;
                tokens.forEach(function(token){
                    if (~token.indexOf(quickFilterParam)) {
                        var value = token.substring(quickFilerParamLength);
                        switch (value) {
                            default:
                        }
                    }
                    newTokens.push(token);
                });
                return newTokens;
            };
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_grid_title"),
                "title-help": {
                    "content": context.getMessage("view_tunnel_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("VPN_IPSEC_TUNNEL_VIEWING")
                },
                "tableId": "devices",
                "numberOfRows": 20,
                "height": "auto",
                "repeatItems": "true",
                "scroll": true,
                "showWidthAsPercentage" : false,
                "on_overlay": true,
                "url": "/api/juniper/sd/vpn-management/ipsec-vpns/" + linkValue + "/tunnels",
                "jsonRoot": "tunnels.tunnel",
                "jsonRecords": function(data) {
                    return data.tunnels[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.tunnels+json;version=2;q=0.02'
                    }
                },
                "filter": {
                    searchUrl: true,
                    /*searchUrl: function (value, url){
                           return url;
                    },*/
                    onBeforeSearch: onBeforeSearch,
                    noSearchResultMessage : context.getMessage("ipsec_vpn_no_result_for_search")
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
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_device")
                    },
                    {
                        "index"           : "peer-device.device-name",
                        "name"            : "peer-device.device-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_peer_device")
                    },
                    {
                        "index"           : "vpn-name-in-device",
                        "name"            : "vpn-name-in-device",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_vpn_name_in_device")
                    },
                    {
                        "index"           : "profile.name",
                        "name"            : "profile.name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_profile"),
                        "collapseContent" : {
                            "formatData": formatProfileSelectorCell
                        }
                    },
                    {
                        "index"           : "ike-id",
                        "name"            : "ike-id",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_id"),
                        "formatter"       : formatIkeIdCell
                    },
                    {
                        "index"           : "local-proxyid",
                        "name"            : "local-proxyid",
                        "sortable"        : false,
                        "width"           : 250,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_proxy_id"),
                        "formatter"       : formatProxyIdCell
                    },
                    {
                        "index"           : "traffic-selectors",
                        "name"            : "traffic-selectors",
                        "sortable"        : false,
                        "width"           : 250,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector"),
                        "formatter"       : formatTunnelSelectorCell
                    },
                    {
                        "index"           : "preshared-key",
                        "name"            : "preshared-key",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_preshared_key")
                    },
                    {
                        "index"           : "external-if-name",
                        "name"            : "external-if-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_external_interface")
                    },
                    {
                        "index"           : "tunnel-if-name",
                        "name"            : "tunnel-if-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_interface")
                    },
                    {
                        "index"           : "max-transmission-unit",
                        "name"            : "max-transmission-unit",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_mtu"),
                        "formatter"       : formatMtuCell
                    },
                    {
                        "index"           : "tunnel-zone",
                        "name"            : "tunnel-zone",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_zone")
                    },
                    {
                        "index"           : "shortcut-conn-limit",
                        "name"            : "shortcut-conn-limit",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_advpn_settings"),
                        "formatter"       : formatAdvpnCell
                    },
                    {
                        "index"           : "ike-policy-name",
                        "name"            : "ike-policy-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_policy_name")
                    },
                    {
                        "index"           : "ipsec-policy-name",
                        "name"            : "ipsec-policy-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ipsec_policy_name")
                    },
                    {
                        "index"           : "ike-gateway-name",
                        "name"            : "ike-gateway-name",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_ike_gateway")
                    }
                ]
            }
        }
    };

    return Configuration;
});
