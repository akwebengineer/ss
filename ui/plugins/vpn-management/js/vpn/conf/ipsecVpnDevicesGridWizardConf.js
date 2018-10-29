/**
 * A configuration object with the parameters required to build 
 * a grid for VPN Devices
 *
 * @module ipsecVpnDevicesGridConfig
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 * Endpoint Settings Notes
 *
 * Device
 * Type **
 * External Interface
 * Tunnel Zone
 * Protected Zone/Networks/Interfaces
 * Route Settings  **
 * Routing Instance **
 * Ike Address
 * Certificate **
 * Proxy Id
 *
 * fields with **  appear and disappear from grid in SD implementation
 *
 * Issue with Column data:
 * Type, Route Settings, Routing Instance -> No rest response????
 *
 * Rest response fields:
 *
 * device
 * certificate
 * is-hub
 * ike-group-id
 * initiator
 * external-if-name
 * proxy-id ??? not in rest call response
 * protected-networks total=
 * protected-network-zones total=
 * protected-network-interfaces total=
 * tunnel-zone
 * export-default-routes
 * export-static-routes
 * export-ospf-routes
 * export-rip-routes
 * metric
 * extranet-device
 * device-moid
 * device-name
 * device-ip
 * edit-version
 * version
 * domain-id
 * id
 * tunnel-vr???  in tech-pub documentation but not in rest call response
 */

define([], function () {

    var IpsecVpnDevicesGridConfig = function(vpnData, context, linkValue, cuid) {

        this.getValues = function() {

            var formatEndpointInitiatorRecipientCell = function (cellValue, options, rowObject) {
                if (rowObject["is-hub"] == true)
                    cellValue = "Recipient";
                if (rowObject["is-hub"] == false)
                    cellValue = "Initiator";
               return cellValue;
            };

            var formatEndpointTypeCell = function (cellValue, options, rowObject) {
                var vpnType = context.vpnTypeCon;
                if (vpnType == "SITE_TO_SITE" || vpnType == "FULL_MESH") {
                   cellValue = "ENDPOINT";
                   return cellValue;
                };
                if (vpnType == "HUB_N_SPOKE") {
                    if (rowObject["is-hub"] === undefined) {
                        cellValue = "ENDPOINT";
                        return cellValue;
                    };
                    if (rowObject["is-hub"].toString() === "true")
                        cellValue = "HUB";
                    if (rowObject["is-hub"].toString() === "false")
                        cellValue = "ENDPOINT";
                    return cellValue;
                }
            };

            var formatIKEAddressCell = function (cellValue, options, rowObject) {
                 var vpnType = vpnData.type;
                 var profileMode = vpnData.modifygeneralsettingsprofilemode;
                 if (vpnType == "SITE_TO_SITE" && profileMode === "AGGRESSIVE") {
                     if(rowObject["is-hub"] != undefined) {
                         cellValue = (rowObject["is-hub"] === true || rowObject["is-hub"] == "Recipient") ? cellValue : "Not Applicable";
                     }
                 }
                return cellValue;
            };
            var formatTunnelZoneCell = function (cellValue, options, rowObject) {
                if (rowObject['extranet-device'])
                    return "Not Applicable";
                else
                    return cellValue;
            };
            var formatRoutingInstanceCell = function (cellValue, options, rowObject) {
                 if(rowObject['extranet-device']){
			        return "Not Applicable";
		         } else {
                 	return cellValue;
		         }
            };
            var formatRouteSettingsCell = function (cellValue, options, rowObject) {

                    var listValues = [];
                    var vpnType = vpnData.type;
                    if(rowObject['extranet-device'] || (vpnType == "HUB_N_SPOKE" && rowObject["is-hub"] === false && vpnData.routingOptions === "STATIC"))
                        return "Not Applicable";
                    if(cellValue != -1 && cellValue instanceof Array) {
                            listValues.push(cellValue[0]);
                            if(vpnType == "HUB_N_SPOKE" && cellValue[1] != undefined) {
                                listValues.push(cellValue[1]);
                            }
                    } else  {
                        if(rowObject['metric'] != undefined) {
                            var metricVal = (rowObject['metric'] < 0)? "" : rowObject['metric'];
                            var exportPresent = false;
                            var exportRoutingTypes = "Export: ";
                            if(rowObject['export-rip-routes']) {
                                exportRoutingTypes += "RIP ";
                                exportPresent = true;
                            }
                            if(rowObject['export-static-routes']){
                                if(exportPresent) {
                                  exportRoutingTypes += ", "
                                }
                                exportRoutingTypes += "Static";
                                exportPresent = true;
                            }
                            if(rowObject['export-default-routes']){
                                if(exportPresent) {
                                  exportRoutingTypes += ", "
                                }
                                exportRoutingTypes += "Default";
                                exportPresent = true;
                            }
                            if(rowObject['export-ospf-routes']){
                                if(exportPresent) {
                                  exportRoutingTypes += ", "
                                }
                                exportRoutingTypes += "OSPF";
                                exportPresent = true;
                            }
                            if(!exportPresent){
                                exportRoutingTypes = "Export: None";
                            }
                            listValues.push(exportRoutingTypes);
                        }
                        if(vpnType == "HUB_N_SPOKE" && rowObject["is-hub"]) {
                           listValues.push('Metric: '+metricVal);
                        }
                    }
                    return listValues;
            };
            var formatProtectedNetworkCell = function (cellValue, options, rowObject) {
                cellValue = "";
                if(rowObject['protected-networks']['protected-network'] != undefined && rowObject['protected-networks']['protected-network'].length > 0 ) {
                    cellValue = context.getMessage("ipsec_vpns_endpoints_column_combined_protected_addresses")+
                                    "\n"+rowObject['protected-networks']['protected-network']['name'];
                } else if(rowObject['protected-network-zones']['protected-network-zone'].length > 0) {
                    cellValue = context.getMessage("ipsec_vpns_endpoints_column_combined_protected_zones")+
                                    "\n"+rowObject['protected-network-zones']['protected-network-zone'];
                } else if(rowObject['protected-network-interfaces']['protected-network-interface'].length > 0) {
                    cellValue = context.getMessage("ipsec_vpns_endpoints_column_combined_protected_interfaces")+
                                    "\n"+rowObject['protected-network-interfaces']['protected-network-interface'];
                }

                return cellValue;
            };

            formatProtectedZoneInterfaceCell = function (cellValue, options, rowObject) {

                if (cellValue)
                    return cellValue;
                if(rowObject['extranet-device'] && (vpnData.routingOptions === "RIP" || vpnData.routingOptions === "OSPF"))
                    return "Not Applicable";

                var newCellValue = new Array();

                if (rowObject['protected-network-zones']['protected-network-zone'] && (rowObject['protected-network-zones']['protected-network-zone'].length != 0)) {
                    cellValue = rowObject['protected-network-zones']['protected-network-zone'];
                    cellValue[0] = "Zones: " + cellValue[0];
                } else if (rowObject['protected-network-interfaces']['protected-network-interface'] && (rowObject['protected-network-interfaces']['protected-network-interface'].length != 0)) {
                    cellValue = rowObject['protected-network-interfaces']['protected-network-interface'];
                    cellValue[0] = "Interfaces: " + cellValue[0];
                } else if (rowObject['protected-networks']['protected-network'] && (rowObject['protected-networks']['protected-network'].length != 0)) {
                   var objlength =  rowObject['protected-networks']['protected-network'].length;
                    for(i=0; i<objlength; i++)
                    {
                          newCellValue[i] = rowObject['protected-networks']['protected-network'][i].name;
                    };
                    newCellValue[0] = "Address: " + newCellValue[0];
                    return newCellValue;
                }
                return cellValue;
            };
            var formatIKEGroupIdCell = function (cellValue, options, rowObject) {
                cellValue = "";
               if(rowObject['ike-group-id']!= undefined && rowObject['ike-group-id'].length > 1 ) {
                   if(context.ikeIdentityType == "DN"){
                        var resultArray = rowObject['ike-group-id'].split(";");
                           if(resultArray.length > 1) {
                               var listValues = [];
                               listValues.push(resultArray[1])
                               listValues.push(resultArray[0])
                               cellValue = listValues;
                           }
                   } else if(context.ikeIdentityType == "HOSTNAME"){
                       cellValue = rowObject['ike-group-id'];
                   }
               }
                return cellValue;
            };
            var formatErrorStatusCell = function (cellValue, options, rowObject) {
                // Most severe error level 0 red exclamation mark
                // Less severe error level 1 yellow triangle
                var errorLevel = 0;
                var newCellValue = "";
                // No error message then just leave cell as blank
                if (rowObject["error-message"] === "")
                    return newCellValue;

                // Generate the error icon
                // Backend Rest now supports error level status
                newCellValue = formatIcons(cellValue, options, rowObject["error-level"]);
                return newCellValue;
            };


            setCustomActionStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
                 updateStatusSuccess({
                         "viewTunnelEvent": selectedRows.numberOfSelectedRows == 1 ? true : false

                 });
             };

            var formatIcons = function (cellvalue, options, errorLevel) {
                    var imageSrc = '../../installed_plugins/ui-common/images';
                var formattedCellValue;
                var iconsFlag = false;

                // Set up tool tip
                formattedCellValue = "<span>";

                // error icon
                if (errorLevel == 0) {
                    formattedCellValue += "<span data-tooltip = '"+ options.rowId + "' style='margin-right: 0px;'><div class='icon_error_vpn'></div></span>";
                    iconsFlag = true;
                };

                // warning icon
               if (errorLevel == 1) {
                   formattedCellValue += "<span data-tooltip = '"+ options.rowId + "' style='margin-right: 0px;'><div class='icon_warn_vpn'></div></span>";
                   iconsFlag = true;
               };

                // warning icon
               if (errorLevel == 2) {
                   formattedCellValue += "<span data-tooltip = '"+ options.rowId + "' style='margin-right: 0px;'><div class='icon_info_vpn'></div></span>";
                   iconsFlag = true;
               };

               formattedCellValue += "</span>";

               return formattedCellValue;
            };
            var onBeforeSearch = function (tokens){
                      var newTokens = [];
                      quickFilterParam = "quickFilter = ",
                          quickFilerParamLength = quickFilterParam.length;
                      tokens.forEach(function(token){
                          if (~token.indexOf(quickFilterParam)) {
                              var value = token.substring(quickFilerParamLength);
                              switch (value) {
                                    case 'hub':
                                       token = "is-hub contains 'true'";
                                    break;
                                    case 'spokes':
                                       token = "is-hub contains 'false'";
                                    break;
                                    default:
                                       token = 'error-level eq 0';
                                    break;
                              }
                          }
                          newTokens.push(token);
                      });
                      console.log(newTokens);
                      return newTokens;
            };
            return {
                "tableId": "devices",
                "numberOfRows": 20,
                "height": "auto",
                "repeatItems": "true",
                "scroll": true,
                "editRow": {
                    "showInline": true
                },
                "contextMenu": {
                    "edit": "Edit Row Selection"
                },
                "on_overlay": true,
                "showWidthAsPercentage" : false,
                "url": "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-endpoint-details?ui-session-id="+cuid,
                "jsonId": "id",
                "jsonRoot": "devices.device",
                "type": 'get',
                "jsonRecords": function(data) {
                    return data.devices['total'];
                },
                "filter": {
                     searchUrl: true,
                     onBeforeSearch: onBeforeSearch,
                     noSearchResultMessage : context.getMessage("ipsec_vpn_no_result_for_search"),
                     showFilter: {
                         quickFilters: [{
                                        "label": "Hub",
                                         "key": "hub"
                                        },{
                                         "label": "Spokes",
                                         "key": "spokes"
                                        },{
                                         "label": "Show All Errors",
                                         "key": "All Error"
                        }]
                     }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01'
                    }
                },
                multiselect: true,
                "actionButtons":{
                    "customButtons":[{
                        "button_type": false,
                        //"label": context.getMessage("update_context_menu_title"),
                        "label": context.getMessage("ipsec_vpns_modify_device_endpoints_action_label"),
                        "key": "saveEvent"
                    },{
                          "button_type": true,
                          "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_tunnel_title"),
                          "key": "viewTunnelEvent",
                          "disabledStatus": true
                      }],
                      "actionStatusCallback": setCustomActionStatus
                 },
                "columns": [
                    {
                        "index"           : "id",
                        "name"            : "id",
                        "hidden"          : true
                    },
                    {
                        "index": "error-icon",
                        "name": "error-icon",
                        "label": "",
                        "formatter": formatErrorStatusCell,
                        "width": 50
                    },
                    {
                        "index": "error-level",
                        "name": "error-level",
                        "label": "",
                        "hidden": true
                    },
                    {
                        "index"           : "error-message",
                        "name"            : "error-message",
                        "label"           : "",
                        "hidden"          : true
                    },
                    {
                        "index"           : "device-moid",
                        "name"            : "device-moid",
                        "label"           : "",
                        "hidden"          : true
                    },
                    {
                        "index"           : "device-name",
                        "name"            : "device-name",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_device")
                    },
                    {
                        "index"           : "is-hub_2",
                        "name"            : "is-hub_2",
                        "label"           : "Type",
                        "readonly"        : true,
                        "formatter"       : formatEndpointTypeCell
                    },
                    {
                        "index"           : "external-if-name",
                        "name"            : "external-if-name",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_external_interface"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "tunnel-zone",
                        "name"            : "tunnel-zone",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_tunnel_zone"),
                        "collapseContent": {
                            "formatData"       : formatTunnelZoneCell
                        }
                    },
                    {
                        "index"           : "metric",
                        "name"            : "metric",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_route_settings"),
                        "collapseContent": {
                            "formatData"       : formatRouteSettingsCell
                        }

                    },
                    {
                        "index"           : "tunnel-vr",
                        "name"            : "tunnel-vr",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_routing_instance"),
                        "collapseContent": {
                            "formatData"       : formatRoutingInstanceCell
                        }
                    },
                    {
                        "index"           : "is-hub",
                        "name"            : "is-hub",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_initiator_recipient"),
                        "collapseContent" : {
                            "formatData": formatEndpointInitiatorRecipientCell
                        }
                    },
                    {
                        "index"           : "ike-group-id",
                        "name"            : "ike-group-id",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_group_ike"),
                        "collapseContent" : {
                                "formatData": formatIKEGroupIdCell
                        }
                    },
                    {
                        "index"           : "ike-address",
                        "name"            : "ike-address",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_ike_address"),
                        "collapseContent" : {
                            "formatData": formatIKEAddressCell
                        }
                    },
                    {
                        "index"           : "certificate",
                        "name"            : "certificate",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_certificate"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "proxy-id",
                        "name"            : "proxy-id",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_proxyid"),
                        "collapseContent" : true
                    },
                    {
                        "index": "protected-zoneinterface",
                        "name":  "protected-zoneinterface",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent": true,
                        "collapseContent": {
                          "formatData": formatProtectedZoneInterfaceCell
                        },
                        "width": 140
                    },
/*
                    {
                        "index": "protected-networks.protected-network",
                        "name":  "protected-networks.protected-network",//"protected-network",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent": true,
                        "collapseContent": {
                          "formatData": formatProtectedNetworkCell
                        },
                        "width": 140
                    },
*/
                    {
                        "index": "protected-network-interfaces.protected-network-interface",
                        "name": "protected-network-zones.protected-network-zone",//"protected-network-interface",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent": true,
                        "collapseContent": {
                           "formatData": formatProtectedNetworkCell
                        },
                        "hidden": true,
                        "width": 140
                    },
                    {
                        "index": "protected-network-zones.protected-network-zone",
                        "name": "protected-network-zones.protected-network-zone",//"protected-networks",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent": true,
                        "collapseContent": {
                          "formatData": formatProtectedNetworkCell
                        },
                        "hidden": true,
                        "width": 140
                    }
                    
                ]
            }
        }
    };

    return IpsecVpnDevicesGridConfig;
});
