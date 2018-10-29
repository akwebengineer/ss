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

    var Configuration = function(context, isMultiProxy, advpnSettings, autoVPN, vpnProfileDetails) {
        context.advpnSettings = advpnSettings;
        context.vpnProfileDetails = vpnProfileDetails;
        context.allData = "";
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
                var listValues = [];

                   if(cellValue != undefined && cellValue instanceof Array) {
                      return cellValue;
                   }else{

                      if(rowObject["advpn-settings"]["shortcut-conn-limit"] == undefined && rowObject["advpn-settings"]["idle-threshold"] == undefined && rowObject["advpn-settings"]["idle-time"] == undefined){
                            listValues.push("Inherited from VPN");
                  }
                      if(rowObject["advpn-settings"]["shortcut-conn-limit"] != undefined){
                        listValues.push(context.getMessage("ipsec_vpns_tunnels_column_advpn_shortcut_limit")+ ":" + rowObject["advpn-settings"]["shortcut-conn-limit"])+"\n";
                      }
                      if(rowObject["advpn-settings"]["idle-threshold"] != undefined){
                        listValues.push(context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_threshold")+ ":" + rowObject["advpn-settings"]["idle-threshold"]) +"\n";
                      }
                      if(rowObject["advpn-settings"]["idle-time"] != undefined){
                        listValues.push(context.getMessage("ipsec_vpns_tunnels_column_advpn_idle_time")+ ":" + rowObject["advpn-settings"]["idle-time"]);
                      }
                   }
                 return listValues;
             };

             formatProfileSelectorCell = function (cellValue, options, rowObject) {
                  if((cellValue === "") || (cellValue === undefined)) {
                     cellValue = context.vpnProfileDetails.name;
                  }
                  return cellValue;
             };

             formatNotApplicableCell = function(cellValue){
                    return "Not Applicable"
             };

             formatTunnelSelectorCell = function (cellValue, options, rowObject) {
                 var listValues = [];

                 if(!isMultiProxy) {
                    return listValues;
                 }

                 if(cellValue != undefined && cellValue instanceof Array) {
                    if(cellValue[0]["name "] != undefined) {
                        for(j=0; j<cellValue.length; j++) {
                             listValues.push("Name: "+cellValue[j]["name "]+", Local: "+cellValue[j]["local-ip"]+", Remote: "+cellValue[j]["remote-ip"]);
                        }
                    } else if (cellValue[0].indexOf(",")) {
                        return cellValue;
                    }
                 }
                 return listValues;
             };

             formatProxyIdCell = function (cellValue, options, rowObject) {
                var listValues = [];

                if(isMultiProxy || autoVPN){
                    return listValues;
                }

                if(cellValue != undefined && cellValue instanceof Array) {
                    return cellValue;
                } else if(rowObject['local-proxyid'] != undefined && rowObject['local-proxyid'] != "" &&
                          rowObject['remote-proxyid'] != undefined && rowObject['remote-proxyid'] != "" ) {
                          listValues.push("Local: "+rowObject['local-proxyid']);
                          listValues.push("Remote: "+rowObject['remote-proxyid']);
                          cellValue = listValues;
                } else if(rowObject['local-proxyid'] != undefined && rowObject['local-proxyid'] != "" &&
                          rowObject['remote-proxyid'] == "" ) {
                          cellValue = "Local: "+rowObject['local-proxyid'];
                } else if(rowObject['remote-proxyid'] != undefined && rowObject['remote-proxyid'] != "" &&
                          rowObject['local-proxyid'] == "" ) {
                          cellValue = "Remote: "+rowObject['remote-proxyid'];
                }
                return cellValue;
             };

             formatIKEIdCell = function (cellValue, options, rowObject) {
                var listValues = [];

                var ikeTypeValue = "";
                var ikeIDValue = "";
                if(rowObject['ike-type'] == "Host Name"){
                   ikeTypeValue = "Hostname";
                }else if(rowObject['ike-type'] == "User At Hostname"){
                   ikeTypeValue = "User@hostname";
                }else if(rowObject['ike-type'] == "IP Address"){
                   ikeTypeValue = "IPAddress";
                }else { // This block is for the case of IKE Id Type :"None" or " " or "DN"
                   ikeTypeValue = rowObject['ike-type'];
                }

               if(cellValue != undefined && cellValue instanceof Array) {
                    return cellValue;
               }else{
                    if(rowObject['ike-id'] != "" && rowObject['ike-id'] != undefined && rowObject['ike-type'] != "" && rowObject['ike-type'] != undefined){
                        listValues.push('IKE Id:' +rowObject['ike-id']);
                        listValues.push('IKE Id Type:' +ikeTypeValue);
                    }else{
                        listValues.push('IKE Id:');
                        listValues.push('IKE Id Type:' +ikeTypeValue);
                    }
               }
               return listValues;
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
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "tunnelEndpoints",
                "numberOfRows": 20,
                "height": "auto",
                "repeatItems": "true",
                "showWidthAsPercentage" : false,
                "scroll": true,
                "editRow": {
                    "showInline": true
                },
                "contextMenu": {
                    "edit": "Edit Row Selection"
                },
                "on_overlay": true,
                "multiselect": false, //PR 1147530
                "url": "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-tunnel-endpoints?ui-session-id=" + UUID,
                "jsonRoot": "tunnels.tunnel",
                "jsonRecords": function(data) {
                    if(data.tunnels.total >0 ){
                        context.allData = data;
                        /* change the profile name to "custom" for customised VPN */
                        $.each(context.allData.tunnels.tunnel, function (i,tunnelobject) {
                          if(tunnelobject.profile['name'] && tunnelobject.profile['name'].startsWith("net.juniper")) {
                            tunnelobject.profile['name'] = "CUSTOM"
                          } 
                        });
                                             
                        context.advpnSettings = context.allData.tunnels.tunnel[0]["advpn-settings"];
                        return data.tunnels.total;
                    }

                },

                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-tunnel-details+json;version=1;q=0.01'
                    },
                },

                "actionButtons":{
                    "customButtons":[{
                        "button_type": false,
                        "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_action_label"),
                        "key": "saveEvent"
                    }]
                 },
                 "filter": {
                    searchUrl: function (value, url){
                         return url;
                    },
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
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_vpn_name_in_device"),
                        "collapseContent" : true
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
                        "collapseContent" :{
                            "formatData": formatIKEIdCell
                        }
                    },
                    {
                        "index"           : "local-proxyid",
                        "name"            : "local-proxyid",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_proxy_id"),
                        "collapseContent" : {
                            "formatData": formatProxyIdCell
                        }
                    },
                    {
                        "index"           : "traffic-selectors.traffic-selector",
                        "name"            : "traffic-selectors.traffic-selector",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector"),
                        "width"           : 350,
                        "collapseContent" : {
                            "formatData": formatTunnelSelectorCell
                        }
                    },
                    {
                        "index"           : "preshared-key",
                        "name"            : "preshared-key",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_preshared_key"),
                        "collapseContent" : true
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
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_interface"),
                        "width"           : 130
                    },
                    {
                        "index"           : "tunnel-address",
                        "name"            : "tunnel-address",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_address"),
                        "collapseContent" : true,
                        "width"           : 130
                    },
                    {
                        "index"           : "max-transmission-unit",
                        "name"            : "max-transmission-unit",
                        "sortable"        : false,
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
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_tunnel_zone")
                    },
                    {
                        "index"           : "advpn-settings",
                        "name"            : "advpn-settings",
                        "sortable"        : false,
                        "label"           : context.getMessage("ipsec_vpns_tunnels_column_advpn_settings"),
                        "collapseContent" : {
                               "formatData"       : formatAdvpnCell
                        }
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
                    }]
            }
        }
    };

    return Configuration;
});
