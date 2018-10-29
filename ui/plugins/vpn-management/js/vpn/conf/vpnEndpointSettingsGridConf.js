/**
 * A configuration object with the parameters required to build a grid for Endpoint Settings
 *
 * @module endpointSettingsGridConf
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 * Endpoint Settings Notes:
 *
 * Device
 * External Interface
 * Tunnel Zone
 * Protected Zone/Networks/Interfaces
 * Routing Instance 
 *
 */

define([], function () {

    var VPNEndpointSettingsGridConf = function(context){

        this.getValues = function(uuid){

            formatEndpointTypeCell = function (cellValue, options, rowObject) {
                var vpnType = context.vpnType;
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

            formatEndpointInitiatorRecipientCell = function (cellValue, options, rowObject) {
                var vpnType = context.vpnType;
                var profileMode = context.profileMode;
                if ((vpnType == "SITE_TO_SITE") && (profileMode === "AGGRESSIVE")) {
                    if (rowObject["is-hub"] != undefined) {
                        cellValue = (rowObject["is-hub"].toString() === "true") ? "Recipient" : "Initiator";
                    } else if (rowObject["is-hub-two"] != undefined){
                        cellValue = (rowObject["is-hub-two"][0].toString() === "Recipient") ? "Recipient" : "Initiator";
                    }
                } else {
                   cellValue = "";
                }
                return cellValue;
            };

            formatIKEAddressCell = function (cellValue, options, rowObject) {
                 var vpnType = context.vpnType;
                 var profileMode = context.profileMode;
                 if (vpnType == "SITE_TO_SITE" && profileMode === "AGGRESSIVE") {
                     if(rowObject["is-hub"] != undefined) {
                         cellValue = (rowObject["is-hub"].toString() === "true") ? cellValue : "Not Applicable";
                         rowObject["is-hub-two"] = rowObject["is-hub"].toString() ? "Recipient" : "Initiator";
                     } else if(rowObject["is-hub-two"] != undefined){
                         cellValue = (rowObject["is-hub-two"][0].toString() === "Recipient" || rowObject["is-hub-two"][0].toString() === "") ? cellValue : "Not Applicable";
                     }
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
            formatRoutingInstanceCell = function (cellValue, options, rowObject) {
                if (rowObject['extranet-device'])
                    return "Not Applicable"
                else
                    return cellValue;
            };

            formatIcons = function (cellvalue, options, errorLevel) {
                var formattedCellValue;iconsFlag = false;
                var imageSrc = '../../installed_plugins/ui-common/images';
                // Set up tool tip
                formattedCellValue = "<span>";

                // error icon
                if (errorLevel == 0) {
                    formattedCellValue += "<span data-tooltip = '"+ options.rowId + "' style='margin-right: 0px;'><div class='icon_error_vpn'></div></span>";
                    iconsFlag = true;
                };

                // warning icon icon_warning icon_info
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

            formatErrorStatusCell = function (cellValue, options, rowObject) {
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

            formatProtectedZoneInterfaceCell = function (cellValue, options, rowObject) {

                if (cellValue)
                    return cellValue;
                if(rowObject['extranet-device'] && (context.routingOptions === "RIP" || context.routingOptions === "OSPF"))
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

            var formatRouteSettingsCell = function (cellValue, options, rowObject) {
                if(rowObject['extranet-device'] || (context.vpnType == "HUB_N_SPOKE" && rowObject["is-hub"] === false && context.routingOptions === "STATIC"))
                    return "Not Applicable";
                var listValues = [];
                var initString = "Export: ";
                var exportString = initString;

                if (cellValue)
                    return cellValue;

                if (rowObject['export-static-routes']) {
                   exportString = exportString + "Static";
                   if (rowObject['export-ospf-routes'] || rowObject['export-rip-routes'])
                       exportString = exportString + ",";
                };
                if (rowObject['export-ospf-routes']) {
                   exportString = exportString + "OSPF";
                };
                if (rowObject['export-rip-routes']) {
                   exportString = exportString + "RIP";
                };
                if (rowObject['export-default-routes']) {
                     exportString = exportString + "Default";
                };
                // if no additions to init string then set to none
                if (exportString === initString)
                   exportString = exportString + "None";

                listValues.push(exportString);

                if(context.vpnType == "HUB_N_SPOKE" && rowObject["is-hub"]) {
                  var metricVal = (rowObject['metric']< 0)? "":rowObject['metric'];
                  listValues.push('Metric: '+metricVal);
                }

                return listValues;
            };

            var formatTunnelZoneCell = function (cellValue, options, rowObject) {
                if (rowObject['extranet-device'])
                    return "Not Applicable";
                else
                    return cellValue;
            };

            var formatCertificateCell = function (cellValue, options, rowObject) {
                if (rowObject['extranet-device'])
                    return "Not Applicable";
                else
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
                "tableId": "endpointSettingsGrid",
                "url": "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-endpoint-details?ui-session-id="+uuid,
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01'
                    }
                },
                "filter": {
                    searchUrl: function (value, url){
                               return url;
//                               return url +  "?filter=(global eq "+'"'+ value +'")';
//                               return url + "?search=" + value +  "&filter=(global eq "+'"'+ value +'")';
//                               return url + "?search=" + '"' + value + '"' + "&filter=(global eq "+'"'+ value +'")';
                    },
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
                "jsonId": "id",
                "jsonRoot": "devices.device",
                "numberOfRows": 20,
                "height": "auto",
                "repeatItems": "true",
                "showWidthAsPercentage" : false,
                "scroll": true,
                "contextMenu": {
                    "edit": "Edit Row Selection"
                },
		        "jsonRecords": function(data) {
                    return data.devices.total;
                },
                "editRow": {
                    "showInline": true
                },
                multiselect: true,
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
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
                        "index": "error-message",
                        "name": "error-message",
                        "label": "",
                        "hidden": true
                    },
                    {
                        "index": "device-name",
                        "name": "device-name",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_device")
                    },
                    {
                        "index": "is-hub",
                        "name": "is-hub",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_type"),
                        "hidden": true
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_type"),
                        "formatter": formatEndpointTypeCell
                    },
                    {
                        "index": "external-if-name",
                        "name": "external-if-name",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_external_interface"),
                        "collapseContent":true
                    },
                    {
                        "index": "tunnel-zone",
                        "name": "tunnel-zone",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_tunnel_zone"),
                        "collapseContent": {
                            "formatData": formatTunnelZoneCell
                        }
                    },
                    {
                        "index": "is-hub-two",
                        "name": "is-hub-two",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_initiator_recipient"),
                        "collapseContent": {
                            "formatData": formatEndpointInitiatorRecipientCell
                        }
                    },
                    {
                        "index": "protected-zoneinterface",
                        "name": "protected-zoneinterface",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent": {
                          "formatData": formatProtectedZoneInterfaceCell
                        },
                        "width": 250
                    },
                    {
                        "index": "protected-zoneinterface-type",
                        "name": "protected-zoneinterface-type",
                        "label": "protected type",
                        "hidden": true
                    },
                    {
                        "index": "protected-network-zone",
                        "name": "protected-network-zone",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent":true,
                        "hidden":true,
                    },
                    {
                        "index": "protected-network-interface",
                        "name": "protected-network-interface",
                        "label": "protected-network-interfaces",
                        "collapseContent":true,
                        "hidden":true,
                    },
                    {
                        "index": "protected-network",
                        "name": "protected-network",
                        "label": "protected-networks-address",
                        "collapseContent":true,
                        "hidden":true,
                    },
                    {
                        "index": "route-settings",
                        "name": "route-settings",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_route_settings"),
                        "hidden": true,
                        "collapseContent": {
                            "formatData": formatRouteSettingsCell
                        }
                    },
                    {
                        "index": "tunnel-vr",
                        "name": "tunnel-vr",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_routing_instance"),
                        "collapseContent": {
                            "formatData": formatRoutingInstanceCell
                        }
                    },
                    {
                        "index": "ike-address",
                        "name": "ike-address",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_ike_local_address"),
                        "collapseContent": {
                            "formatData": formatIKEAddressCell
                        }
                    },
                    {
                        "index": "certificate",
                        "name": "certificate",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_certificate"),
                        "collapseContent": {
                            "formatData": formatCertificateCell
                        }
                    },
                    {
                        "index": "device-moid",
                        "name": "device-moid",
                        "label": "device-moid",
                        "hidden":true,
                        "collapseContent":true
                    },
                    {
                        "index": "ike-group-id",
                        "name": "ike-group-id",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_group_ike"),
                        "collapseContent": {
                            "formatData": formatIKEGroupIdCell
                        }
                    },
                    {
                        "index": "metric",
                        "name": "metric",
                        "label": "metric",
                        "hidden":true,
                        "collapseContent":true
                    }
                ]
            }
        }
    };

    return VPNEndpointSettingsGridConf;
});
