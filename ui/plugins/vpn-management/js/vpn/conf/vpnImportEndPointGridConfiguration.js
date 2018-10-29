/**
* Module that implements the vpnImportEndPointGridConfiguration.
*
* @module vpnImportEndPointGridConfiguration
* @author Anuranc <anuranc@juniper.net>
* @copyright Juniper Networks, Inc. 2015
*/
define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function(RestApiConstants) {
    var Configuration = function(grid) {
         var context = grid.context;
         var firsLodedFlag = true;
         this.getValues = function(currentPage) {
              var TOPLEVELVPNS_MEDIATYPE ="application/vnd.sd.vpn-management.vpn-import.vpns+json;version=2;q=0.02";
              var DEVICES_MEDIATYPE = "application/vnd.sd.vpn-management.vpn-import.devices-of-vpns+json;version=2;q=0.02";
              var ENDPOINTS_MEDIATYPE = "application/vnd.sd.vpn-management.vpn-import.end-points-of-devices+json;version=2;q=0.02";
              var getTreeRowIds = function (setIdsSuccess, setIdsError, tokens, parameters) {
                      $.ajax({
                          type: 'GET',
                          cache : true,
                          url: '/api/juniper/sd/vpn-management/vpn-import/vpn-names',
                          headers: {
                                Accept: 'application/vnd.sd.vpn-management.vpn-import.vpn-names+json;version=2;q=0.02'
                          },
                          success: function(data) {
                              setIdsSuccess(data["vpn-names"].name);
                          },
                          error: function() {
                              setIdsError("Getting all row ids in the grid FAILED.");
                          }
                      });
              };
              var formaterrormsg = function (cellvalue, options) {
                var newcellvalue ="";
                if( cellvalue instanceof Array && typeof(cellvalue) != "undefined"){
                    for (var message in cellvalue) {
                      for(key in cellvalue[message]){
                        if(cellvalue[message][key].length > 0){
                          newcellvalue += cellvalue[message][key][0].key+'\n';
                        }
                      }
                    }
                    cellvalue = newcellvalue;

                }else{
                    cellvalue ="";
                }
                return cellvalue;

              };
              var formatIcons = function (cellvalue, options) {
                if( cellvalue !== 'undefined'){
                     var imageSrc = '/installed_plugins/ui-common/images';
                     var formattedCellValue;
                     var iconsFlag = false;
                     error_level = cellvalue;
                     formattedCellValue = "<span class='icons-tooltip'>";
                        // error icon
                        if (error_level == 0) {
                             tooltip = 'Error';
                             formattedCellValue += "<a class='tooltip' data-tooltip= "+ tooltip +" id='errorTooltip" + tooltip + "' style='margin-right: 0px;'><img style='width:16px; height: 16px;' src='" + imageSrc + "/icon_error.svg'/></a>";
                             iconsFlag = true;
                         };
                        // warning icon
                        if (error_level == 1) {
                             tooltip = 'Warning';
                             formattedCellValue += "<a class='tooltip' data-tooltip= "+ tooltip +" id='warnTooltip" + tooltip + "' style='margin-right: 0px;'><img style='width:16px; height: 16px;' src='" + imageSrc + "/icon_warn.svg'/></a>";
                             iconsFlag = true;
                        };
                        // info icon
                        if (error_level == 2) {
                             tooltip = 'Info'
                             formattedCellValue += "<a class='tooltip' data-tooltip= "+ tooltip +" id='infoTooltip" + tooltip + "' style='margin-right: 0px;'><img style='width:16px; height: 16px;' src='" + imageSrc + "/icon_info.svg'/></a>";
                             iconsFlag = true;
                        };
                        formattedCellValue += "</span>";
                    return formattedCellValue;
                }
              };
              var getChildren = function (node, addChildren) {
              var data = 'expanded=' + node.expanded + '&nodeid=' + node.nodeId + '&parentid=' + node.parentId + '&n_level=' + node.n_level;
                                    switch(node.n_level){
                                        case 1:
                                            url = "/api/juniper/sd/vpn-management/vpn-import/vpns/"+node.nodeId+"/devices-of-vpn?ui-session-id="+currentPage.uuid;
                                            accept = DEVICES_MEDIATYPE;
                                        break;
                                        case 2:
                                           var nodeIdnew = node.nodeId.split(node.parentId+"_")[1];
                                           url = "/api/juniper/sd/vpn-management/vpn-import/vpns/"+node.parentId+"/devices-of-vpn/"+nodeIdnew+"/end-points-of-device?ui-session-id="+currentPage.uuid;
                                           accept = ENDPOINTS_MEDIATYPE;
                                        break;
                                        default:
                                        break;
                                    }
                                    $.ajax({
                                        type: 'GET',
                                        url: url,
                                        headers: {
                                           "Accept" : accept
                                        },
                                        success: function(responseData) {
                                            switch(node.n_level){
                                                case 1:
                                                var vpnDdeviceImportBean = responseData["devices-of-vpns"]["vpn-device-import-bean"];
                                                var totalData = vpnDdeviceImportBean.length;
                                                    if(responseData["devices-of-vpns"]) {
                                                     if(totalData > 0){
                                                        for (var i = 0; i < totalData; i ++) {
                                                              var divname = vpnDdeviceImportBean[i]["device-name"];
                                                              var divId = vpnDdeviceImportBean[i]["id"]
                                                              vpnDdeviceImportBean[i]["name"] = divname;
                                                              vpnDdeviceImportBean[i]["rowId"] = node.nodeId+"_"+divId;
                                                              vpnDdeviceImportBean[i]["ruleLevel"] = 2;
                                                              vpnDdeviceImportBean[i]["ruleOrder"] = 0;
                                                              vpnDdeviceImportBean[i]["parent"] =  node.nodeId;
                                                              vpnDdeviceImportBean[i]["leaf"] = false;
                                                              vpnDdeviceImportBean[i]["gw_address"]= vpnDdeviceImportBean[i]["gw-address"];
                                                              vpnDdeviceImportBean[i]["is_hub"]= vpnDdeviceImportBean[i]["is-hub"];
                                                              vpnDdeviceImportBean[i]["device_ip"] = vpnDdeviceImportBean[i]["device-ip"];
                                                              vpnDdeviceImportBean[i]["extranet_device"] = vpnDdeviceImportBean[i]["extranet-device"];
                                                              // Extra for end points
                                                              vpnDdeviceImportBean[i]["ike_policy_name"]= "none";
                                                              vpnDdeviceImportBean[i]["tunnel_if_name"]= "none";
                                                              vpnDdeviceImportBean[i]["ike_gw_name"]= "none";
                                                              /* Added */
                                                              vpnDdeviceImportBean[i].myAncestors = node.nodeId+","+divId;
                                                              vpnDdeviceImportBean[i].myType = "devices";
                                                              vpnDdeviceImportBean[i]["tmpDeviceName"] = divId;

                                                            }
                                                        }
                                                     }
                                                     returnData = vpnDdeviceImportBean;

                                                break;
                                                case 2:
                                                var vpnEndPointImportBean = responseData["end-points-of-devices"]["vpn-end-point-import-bean"];
                                                    var totalData = vpnEndPointImportBean.length;
                                                    if(responseData["end-points-of-devices"]) {
                                                     if(totalData > 0){
                                                        for (var i = 0; i < totalData; i ++) {
                                                           var tunnelvname = vpnEndPointImportBean[i]["vpn-name-in-device"];
                                                           var tunnelId = vpnEndPointImportBean[i].device.id;
                                                              vpnEndPointImportBean[i]["name"] = tunnelvname;
                                                              var rowid = node.parentId+'_'+tunnelvname+'_'+tunnelId;
                                                              vpnEndPointImportBean[i]["rowId"] = rowid.split('.').join('-');
                                                              vpnEndPointImportBean[i]["ruleLevel"] = 3;
                                                              vpnEndPointImportBean[i]["ruleOrder"] = 0;
                                                              vpnEndPointImportBean[i]["parent"] =  node.parentId+'_'+tunnelId;
                                                              vpnEndPointImportBean[i]["leaf"] = true;
                                                              vpnEndPointImportBean[i]["gw_address"]= vpnEndPointImportBean[i]["gw-address"];
                                                              vpnEndPointImportBean[i]["is_hub"]= vpnEndPointImportBean[i]["is-hub"];
                                                              vpnEndPointImportBean[i]["ike_policy_name"]= vpnEndPointImportBean[i]["ike-policy-name"];
                                                              vpnEndPointImportBean[i]["tunnel_if_name"]= vpnEndPointImportBean[i]["tunnel-if-name"];
                                                              vpnEndPointImportBean[i]["ike_gw_name"]= vpnEndPointImportBean[i]["ike-gw-name"];
                                                               /* Added */
                                                               vpnEndPointImportBean[i].myAncestors = node.parentId+","+nodeIdnew+","+tunnelvname;
                                                               vpnEndPointImportBean[i].myType = "endpoints";
                                                               vpnEndPointImportBean[i].tmpDeviceName = "none";
                                                            }
                                                        }
                                                     }
                                                      var coldata = $('table').find('span.cell-wrapperleaf').html();
                                                      $('table').find('span.cell-wrapperleaf').removeClass('cell-wrapperleaf').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                                      returnData = vpnEndPointImportBean;
                                                break;
                                                default:

                                                break;

                                            }
                                            addChildren(node.nodeId, returnData);
                                        },
                                        complete: function(data, status){
                                             switch(node.n_level){
                                                case 1:
                                                  var coldata = currentPage.$el.find('span.cell-wrapper').html();
                                                  currentPage.$el.find('span.cell-wrapper').removeClass('cell-wrapper').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                                break;
                                                case 2:
                                                 var coldata = currentPage.$el.find('span.cell-wrapperleaf').html();
                                                 currentPage.$el.find('span.cell-wrapperleaf').removeClass('cell-wrapperleaf').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                                break;
                                            }
                                        }
                                    });
              };
              var formatHubSpokeIconColumn = function(cellValue, options, rowObject ) {
                 var imageSrc = '/installed_plugins/vpn-management/images';
                 if(!cellValue){
                   return "";
                 }
                 var img = "transparent.png";
                 var type ="";
                 if(rowObject["topology-type"]){
                    type = rowObject["topology-type"];
                 }else if(rowObject["is-hub"]== true){
                    type= "HUB_DEVICE";
                 }else if(rowObject["is-hub"]== false){
                    type= "SPOKE";
                 }else{
                    type= "";
                 }

                 switch(type){
                    case 'SITE_TO_SITE':
                        img = 'icon_site_to_site.svg';
                    break;

                    case 'HUB_N_SPOKE':
                        img = 'icon_hub_and_spoke.svg';
                    break;

                    case 'FULL_MESH':
                        img = 'icon_mesh.svg';
                    break;

                     case 'HUB_DEVICE':
                        img = 'icon_hub_device.svg';
                     break;
                     case 'SPOKE':
                         img = 'icon_end_points.svg';
                     break;
                 }
                 return '<img id="device_image_' + cellValue + '" width="12px" height="14px" src="' + imageSrc +'/' + img + '"/> <span>' + cellValue + '</span>';
              };
              var onBeforeSearch = function (tokens){
                    var newTokens = [];
                    quickFilterParam = "quickFilter = ",
                        quickFilerParamLength = quickFilterParam.length;
                    tokens.forEach(function(token){
                        if (~token.indexOf(quickFilterParam)) {
                            var value = token.substring(quickFilerParamLength);
                            switch (value) {
                                case 'ERROR':
                                   token = "name contains 'ERROR'";
                                break;
                                case 'WARN':
                                   token = "name contains 'WARN'";
                                break;
                                case 'INFO':
                                   token = "name contains 'INFO'";
                                break;
                                default:
                            }
                        }
                        newTokens.push(token);
                    });
                    return newTokens;
              };
              return {
                          "url": "/api/juniper/sd/vpn-management/vpn-import/vpns?ui-session-id="+currentPage.uuid,//TOPLEVELVPNS,
                          "type": 'get',
                          "jsonRoot": "vpns.vpn-basic-import-bean",
                          "jsonId": "rowId",
                          "ajaxOptions": {
                              "headers": {
                                 "Accept" : TOPLEVELVPNS_MEDIATYPE
                              },
                               "complete":function(res){
                                   var coldata = currentPage.$el.find('span.cell-wrapper').html();
                                    currentPage.$el.find('span.cell-wrapper').removeClass('cell-wrapper').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                    var rowIds = [];
                                     if(firsLodedFlag == true ){
                                       grid.vpnImportEndPointGrid.toggleSelectAllRows();
                                     }
                                     var importBean = res.responseJSON.vpns["vpn-basic-import-bean"];
                                     for(i=0;i<res.responseJSON.vpns.total;i++){
                                         if(importBean[i].checked === false){
                                            grid.vpnImportEndPointGrid.toggleRowSelection(importBean[i].name,'unselected');
                                         }
                                      if(importBean[i].checked === true){
                                            grid.vpnImportEndPointGrid.toggleRowSelection(importBean[i].name,'selected');
                                      }
                                    }
                                   firsLodedFlag = false;
                               }
                          },
                          "jsonRecords": function(data) {
                               this.$el;
                               if(data.vpns) {
                                  try {
                                  var dataVPNS = data.vpns["vpn-basic-import-bean"];
                                    var totalData = dataVPNS.length;
                                      if(totalData > 0){
                                              for (var i = 0; i < totalData; i ++) {
                                                  dataVPNS[i].nextLevel = 2;
                                                  dataVPNS[i].rowId = dataVPNS[i].name;
                                                  dataVPNS[i].ruleLevel = 1;
                                                  dataVPNS[i].ruleOrder = 0;
                                                  dataVPNS[i].parent =  "";
                                                  dataVPNS[i].leaf = false ;
                                                  // Profile has to modify with Profile_name as discussed with Miriam
                                                  dataVPNS[i].profile_name = dataVPNS[i].profile.name;
                                                  // For Device
                                                  dataVPNS[i].gw_address = "none";
                                                  dataVPNS[i].is_hub = false;
                                                  dataVPNS[i].device_ip = "none";
                                                  dataVPNS[i].extranet_device = "none";
                                                  // For endpoints
                                                  dataVPNS[i].ike_policy_name = "none";
                                                  dataVPNS[i].tunnel_if_name = "none";
                                                  dataVPNS[i].ike_gw_name = "none";
                                                  dataVPNS[i].myAncestors = "none";
                                                  /* Added */
                                                  dataVPNS[i].myAncestors = "";
                                                  dataVPNS[i].myType = "vpn";
                                                  dataVPNS[i].tmpDeviceName = "none";
                                              }

                                      }
                                }catch(e){
                                    console.log(e);
                                }

                              }
                              return data.vpns[RestApiConstants.TOTAL_PROPERTY];
                          },
                          "tableId":"import_configuration_end_point_grid",
                          "height": "360",
                          "numberOfRows": 10000, //PR 1155484
                          "onSelectAll": getTreeRowIds,
                          "multiselect": true,
                          "tree": {
                                "column": "name",
                                "level": "ruleLevel",
                                "initialLevelExpanded": 0,
                                "parent": "parent", //optional since it's using the default value of the attribute
                                "leaf": "leaf", //optional since it's using the default value of the attribute
                                "parentSelect": true,
                                "getChildren": getChildren,
                                "preselection": true
                           },
                           "contextMenu":{
                           "quickView": "Detail View"
                           },
                           "filter": {
                            searchUrl: function (value, url){
                               return url;
                             },
                                 onBeforeSearch: onBeforeSearch,
                                 noSearchResultMessage : context.getMessage("ipsec_vpn_no_result_for_search"),
                                 showFilter: {
                                      quickFilters: [{
                                        "label": "Show Info",
                                        "key":"INFO"
                                      },
                                      {
                                        "label": "Show Warning",
                                        "key":"WARN"
                                      },
                                      {
                                         "label": "Show Error",
                                         "key":"ERROR"
                                      }]
                                  }
                           },
                           "columns": [{
                                            "index": "name",
                                            "name": "name",
                                            "label": context.getMessage("import_vpn_device_endpoint_name"), //"Name",
                                            "formatter": formatHubSpokeIconColumn,
                                            "width": 250
                                        },
                                        {
                                           "index": "rowId",
                                           "name": "rowId",
                                           "hidden" : true
                                        },
                                        {
                                            "index": "remote-end-point.vpn-name-in-device",
                                            "name": "remote-end-point.vpn-name-in-device",
                                            "label": context.getMessage("import_vpn_remote_endpoint"), //"Remote end point",
                                            "width": 200
                                        },
                                        {
                                            "index":"error-level",
                                            "name": "error-level",
                                            "formatter":formatIcons,
                                            "label": context.getMessage("import_vpn_status"), // "status-level",
                                            "width": 100
                                        },
                                        {
                                            "index":"error-msg",
                                            "name": "error-msg",
                                            "label": context.getMessage("import_vpn_notification"), // "error-msg",
                                            "formatter":formaterrormsg,
                                            "width": 450
                                        },
                                        {
                                            "index":"profile_name",
                                            "name": "profile_name",
                                            //"label": context.getMessage("import_vpn_routing_type"), // "profile name",
                                            "label": "Profile Name",
                                            "hidden" : true
                                        },
                                        {
                                            "index":"routing-type",
                                            "name": "routing-type",
                                            "label": context.getMessage("import_vpn_routing_type"), // "routing-type",
                                            "hidden" : true
                                        },
                                        {
                                            "index":"tunnel-interface-type",
                                            "name": "tunnel-interface-type",
                                            "label": context.getMessage("import_vpn_interface_type"), // "interface-type",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "vpn-tunnel-mode-types",
                                            "name":  "vpn-tunnel-mode-types",
                                            "label": context.getMessage("import_vpn_tunnel_mode_types"), // "tunnel-mode-types",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "multi-proxy-id",
                                            "name":  "multi-proxy-id",
                                            "label": context.getMessage("import_vpn_multi_proxy_id"), //"multi-proxy-id",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "preshared-key-type",
                                            "name":  "preshared-key-type",
                                            "label": context.getMessage("import_vpn_preshared_key_type"), //"preshared-key-type",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "auto-vpn",
                                            "name":  "auto-vpn",
                                            "label": context.getMessage("import_vpn_auto_vpn"), //"auto-vpn",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "advpn",
                                            "name":  "advpn",
                                            "label": context.getMessage("import_vpn_add_vpn"), //"advpn",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "gw_address",
                                            "name":  "gw_address",
                                            "label": "GW Address", //"Getway Address",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "device_ip",
                                            "name":  "device_ip",
                                            "label": "deviceip", //"device Ip",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "extranet_device",
                                            "name":  "extranet_device",
                                            "label": "externet", //"externet",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "is_hub",
                                            "name":  "is_hub",
                                            "hidden" : true
                                        },
                                        {
                                            "index": "ike_policy_name",
                                            "name":  "ike_policy_name",
                                            "label": "IKE policy", //"IKE policy",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "tunnel_if_name",
                                            "name":  "tunnel_if_name",
                                            "label": "Tunnel Interface", //"Tunnel Interface",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "ike_gw_name",
                                            "name":  "ike_gw_name",
                                            "label": "ike_gw_name", //"IKE GetWay Name",
                                            "hidden" : true,
                                            "width": 100
                                        },
                                        {
                                            "index": "topology-type",
                                            "name": "topology-type",
                                            "label": "Topology",
                                            "hidden" : true,
                                            "width": 10
                                        },
                                        {
                                            "index": "myAncestors",
                                            "name":  "myAncestors",
                                            "label": "myAncestors", //"myAncestors",
                                            "hidden" : true,
                                            "width": 10
                                        },
                                        {
                                            "index": "myType",
                                            "name":  "myType",
                                            "label": "myType", //"type",
                                            "hidden" : true,
                                            "width": 1
                                        },
                                        {
                                           "index": "tmpDeviceName",
                                           "name":  "tmpDeviceName",
                                           "label": "tmpDeviceName", //"tempUse",
                                           "hidden" : true,
                                           "width": 10
                                        },
                                        {
                                             "index": "ipsec-policy-name",
                                             "name": "ipsec-policy-name",
                                             "label": "IPsec Policy",
                                             "hidden" : true,
                                             "width": 10
                                         },
                                         {
                                            "index": "proxy-id",
                                            "name": "proxy-id",
                                            "label": "Proxy-id",
                                            "hidden" : true,
                                            "width": 10
                                        }
                            ]


                }
             }
     };
    return Configuration;
}
);

