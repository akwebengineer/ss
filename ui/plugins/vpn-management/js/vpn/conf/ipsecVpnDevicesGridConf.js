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

    var IpsecVpnDevicesGridConfig = function(context, linkValue, cuid) {

        this.getValues = function() {

            var formatRouteSettingsCell = function (cellValue, options, rowObject) {
                metric = (rowObject['metric'] != "-1") ? (context.getMessage("ipsec_vpns_endpoints_column_route_settings_metric")+":"+cellValue) : "";
                exportedRoutes = context.getMessage("ipsec_vpns_endpoints_column_route_settings_exported_routes")+":"+"\n";
                isExportedRoutes = false;
                if(rowObject['export-default-routes'] == true) {
                    exportedRoutes += context.getMessage("ipsec_vpns_endpoints_column_route_settings_exported_default_routes")+"\n";
                    isExportedRoutes = true;
                }
                if(rowObject['export-static-routes'] == true) {
                    exportedRoutes += context.getMessage("ipsec_vpns_endpoints_column_route_settings_exported_static_routes")+"\n";
                    isExportedRoutes = true;
                }
                if(rowObject['export-rip-routes'] == true) {
                    exportedRoutes += context.getMessage("ipsec_vpns_endpoints_column_route_settings_exported_rip_routes")+"\n";
                    isExportedRoutes = true;
                }

                return cellValue=(isExportedRoutes)?exportedRoutes+metric:metric;
            };

            var formatProtectedNetworkCell = function (cellValue, options, rowObject) {
                cellValue = "";
                if(rowObject['protected-networks']['protected-network'].length > 0 ) {
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

            var formatErrorStatusCell = function (cellValue, options, rowObject) {
                // Most severe error level 0 red exclamation mark
                // Less severe error level 1 yellow triangle
                var errorLevel = 0;
                var newCellValue = "";

                // No error message then just leave cell as blank
                if (rowObject["error-message"] === "")
                    return newCellValue;

                if (rowObject["error-message"][0].length > 0) {
                    errorLevel = 0;
                } else if (rowObject["error-message"][1].length > 0) {
                    errorLevel = 1;
                };
                // Generate the error icon
                newCellValue = formatIcons(cellValue, options, errorLevel);
                return newCellValue;
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

            return {
                "title": context.getMessage("ipsec_vpns_modify_endpoints_grid_title"),
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_endpoints_grid_tooltip"),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "devices",
                "numberOfRows": 20,
                "height": "350px",
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
                "jsonRoot": "devices.device",
                "type": 'get',
                "jsonRecords": function(data) {
                    return data.devices['total'];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01'
                    }
                },
                "multiselect": true,
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        //"label": context.getMessage("update_context_menu_title"),
                        "label": context.getMessage("ipsec_vpns_modify_device_endpoints_action_label"),
                        "key": "saveEvent"
                    },{
                          "button_type": true,
                          "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_tunnel_title"),
                          "key": "viewTunnelEvent"
                      }]
                 },
                "columns": [
                    {
                        "index"           : "id",
                        "name"            : "id",
                        "hidden"          : true
                    },
                    {
                        "index"           : "error-icon",
                        "name"            : "error-icon",
                        "label"           : "",
                        "formatter"       : formatErrorStatusCell,
                        "width"           : 50
                    },
                    {
                        "index"           : "error-message",
                        "name"            : "error-message",
                        "label"           : "",
                        "hidden"          : true
                    },
                    {
                        "index"           : "device-name",
                        "name"            : "device-name",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_device")
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
                        "collapseContent" : true
                    },
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
                        "collapseContent" : true
                    },
                    {
                        "index"           : "is-hub",
                        "name"            : "is-hub",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_initiator_recipient"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "ike-group-id",
                        "name"            : "ike-group-id",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_group_ike"),
                        "collapseContent" : true
                    },
                    {
                        "index"           : "ike-address",
                        "name"            : "ike-address",
                        "label"           : context.getMessage("ipsec_vpns_endpoints_column_ike_address"),
                        "collapseContent" : true

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
                    }
                ]
            }
        }
    };

    return IpsecVpnDevicesGridConfig;
});
