    /**
     * Module that implements the vpnImportSummaryGridConfiguration.
     *
     * @module vpnImportSummaryGridConfiguration
     * @author Anuranc <anuranc@juniper.net>
     * @copyright Juniper Networks, Inc. 2015
     */
    define(
        [
            '../../../../ui-common/js/common/restApiConstants.js'
        ], function(RestApiConstants) {
              var Configuration = function(context) {
                         this.getValues = function(option) {

                         var TOPLEVELVPNS = "/api/juniper/sd/vpn-management/vpn-import/vpns?ui-session-id="+context.wizardView.uuid;
                         var TOPLEVELVPNS_MEDIATYPE ="application/vnd.sd.vpn-management.vpn-import.vpns+json;version=2;q=0.02";
                         var DEVICES_MEDIATYPE = "application/vnd.sd.vpn-management.vpn-import.devices-of-vpns+json;version=2;q=0.02";
                         var ENDPOINTS_MEDIATYPE = "application/vnd.sd.vpn-management.vpn-import.end-points-of-devices+json;version=2;q=0.02";

                         var jsRoot = "vpns.vpn-basic-import-bean";
                           var getData = function (){
                               var self = this;
                                   if(JSON.parse(option.selectedDevices).vpns){
                                       var data = JSON.parse(option.selectedDevices).vpns["vpn-basic-import-bean"];
                                       if(!$.isArray(data)){
                                           data = [data];
                                       }
                                    $(this).addRowData('', data);
                                   }
                            };
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
                           var onBeforeSearch = function (tokens){
                               var newTokens = [];
                               quickFilterParam = "quickFilter = ",
                                   quickFilerParamLength = quickFilterParam.length;
                               tokens.forEach(function(token){
                                   if (~token.indexOf(quickFilterParam)) {
                                       var value = token.substring(quickFilerParamLength);
                                       switch (value) {
                                           case 'ERROR':
                                              token = "name+eq+'ERROR'";
                                           break;
                                           case 'WARN':
                                              token = "name+eq+'WARN'";
                                           break;
                                           case 'INFO':
                                              token = "name+eq+'INFO'";
                                           break;
                                           default:
                                       }
                                   }
                                   newTokens.push(token);
                               });
                               return newTokens;
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
                           var jRoot ="";
                           var data = 'expanded=' + node.expanded + '&nodeid=' + node.nodeId + '&parentid=' + node.parentId + '&n_level=' + node.n_level;
                               switch(node.n_level){
                                   case 1:
                                       url = "/api/juniper/sd/vpn-management/vpn-import/vpns/"+node.nodeId+"/devices-of-vpn?ui-session-id="+context.wizardView.uuid;
                                       accept = DEVICES_MEDIATYPE;
                                   break;
                                   case 2:
                                    var nodeIdnew = node.nodeId.split(node.parentId+"_")[1];
                                    url = "/api/juniper/sd/vpn-management/vpn-import/vpns/"+node.parentId+"/devices-of-vpn/"+nodeIdnew+"/end-points-of-device?ui-session-id="+context.wizardView.uuid;
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

                                   success: function(responsData) {
                                       switch(node.n_level){
                                           case 1:
                                           var totalData = responsData["devices-of-vpns"]["vpn-device-import-bean"].length;
                                           var ud = option.unSelectedDevices; // Unselected Device
                                            var firstChildList = [];
                                            var firstChildAncestorList = [];
                                            for(o=0;o<ud.length;o++){
                                                if(ud[o].myType === "devices"){
                                                 //device List
                                                   firstChildList.push(ud[o]);
                                                }
                                              }
                                            if(firstChildList.length){
                                                   for(j=0;j<firstChildList.length;j++){
                                                       for (var i = 0; i < totalData; i ++) {
                                                           if(firstChildList[j] !== undefined || typeof(firstChildList[j])!= 'undefined'){
                                                               if(firstChildList[j].name.includes(responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["device-name"]) && (firstChildList[j].parent === node.nodeId)){
                                                                   responsData["devices-of-vpns"]["vpn-device-import-bean"].splice(i, 1); // removing selected VPN from the list
                                                                   totalData = responsData["devices-of-vpns"]["vpn-device-import-bean"].length;
                                                                   if(totalData == 0 )
                                                                      break;
                                                                }
                                                           }
                                                       }
                                                   }
                                            }
                                            if(responsData["devices-of-vpns"]) {
                                                if(totalData > 0){
                                                   for (var i = 0; i < totalData; i ++) {
                                                         var divname = responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["device-name"];
                                                         var divId = responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["id"]
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["name"] = divname;
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["rowId"] = node.nodeId+"_"+divId;//divId;
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["ruleLevel"] = 2;
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["ruleOrder"] = 0;
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["parent"] =  node.nodeId;
                                                         responsData["devices-of-vpns"]["vpn-device-import-bean"][i]["leaf"] = false;
                                                       }
                                                }
                                            }
                                                returnData = responsData["devices-of-vpns"]["vpn-device-import-bean"];

                                           break;
                                           case 2:
                                               var totalData = responsData["end-points-of-devices"]["vpn-end-point-import-bean"].length;
                                               var uen = option.unSelectedDevices; // Unselected Device

                                               var secondChildList = [];
                                               var secondChildAncestorList = [];

                                               for(o=0;o<uen.length;o++){
                                                   if(uen[o].myType === "endpoints"){
                                                    //device List
                                                      secondChildList.push(uen[o]);
                                                   }
                                                 }

                                               if(secondChildList.length){
                                               for(j=0;j<uen.length;j++){
                                                      for (var i = 0; i < totalData; i ++) {
                                                      if(secondChildList[j] !== undefined || typeof(secondChildList[j])!= 'undefined'){
                                                            if(secondChildList[j].name.includes(responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["vpn-name-in-device"]) && (secondChildList[j].parent === node.nodeId)){
                                                               responsData["end-points-of-devices"]["vpn-end-point-import-bean"].splice(i, 1); // removing selected VPN from the list
                                                               totalData = responsData["end-points-of-devices"]["vpn-end-point-import-bean"].length;
                                                                    if(totalData == 0 )
                                                                    break;
                                                                }
                                                            }

                                                      }
                                                   }
                                               }
                                               if(responsData["end-points-of-devices"]) {
                                                if(totalData > 0){
                                                   for (var i = 0; i < totalData; i ++) {
                                                      var tunnelvname = responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["vpn-name-in-device"];
                                                      var tunnelId = responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i].device.id;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["name"] = tunnelvname;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["rowId"] = tunnelId;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["ruleLevel"] = 2;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["ruleOrder"] = 0;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["parent"] =  node.nodeId;
                                                         responsData["end-points-of-devices"]["vpn-end-point-import-bean"][i]["leaf"] = true;

                                                       }
                                                   }
                                                }
                                            returnData = responsData["end-points-of-devices"]["vpn-end-point-import-bean"];
                                           break;
                                           default:

                                           break;

                                       }
                                       addChildren(node.nodeId, returnData);
                                   },
                                   complete: function(data, status){
                                        switch(node.n_level){
                                           case 1:
                                             var coldata = option.$el.find('span.cell-wrapper').html();
                                             option.$el.find('span.cell-wrapper').removeClass('cell-wrapper').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                           break;
                                           case 2:
                                            var coldata = option.$el.find('span.cell-wrapperleaf').html();
                                            option.$el.find('span.cell-wrapperleaf').removeClass('cell-wrapperleaf').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                           break;
                                       }


                                   }

                               });
                           };
                           return {
                                     "tableId":"import_summary_review_grid",
                                     "url": TOPLEVELVPNS,
                                       "type": 'get',
                                       "jsonRoot": jsRoot,
                                       "jsonId": "rowId",
                                       "ajaxOptions": {
                                           "headers": {
                                              "Accept" : TOPLEVELVPNS_MEDIATYPE //Redundant is it!
                                           },
                                           "complete":function(res){
                                              var coldata = option.$el.find('span.cell-wrapper').html();
                                              option.$el.find('span.cell-wrapper').removeClass('cell-wrapper').addClass('cellLink').addClass('tooltip').attr('data-tooltip',coldata);
                                              option.$el.find('dd#moreMenu').hide();
                                              option.$el.find('.actionMenu .more').empty();
                                          }
                                       },
                                       "jsonRecords": function(data) {
                                            this.$el;

                                            if(data.vpns) {
                                               try {

                                                    var importSummeryBean = data.vpns["vpn-basic-import-bean"];
                                                    var parentsList = [];
                                                    for(i=0;i<data.vpns.total;i++){
                                                        // First Level
                                                        if(importSummeryBean[i].checked === false){
                                                             parentsList.push(importSummeryBean[i].name);
                                                        }
                                                    }
                                                   if(parentsList.length){
                                                     for(j=0;j<parentsList.length;j++){
                                                            totalData = data.vpns["vpn-basic-import-bean"].length;
                                                            for (var i = 0; i < totalData; i ++) {
                                                             if(parentsList[j]=== data.vpns["vpn-basic-import-bean"][i].name){
                                                                data.vpns["vpn-basic-import-bean"].splice(i, 1); // removing selected VPN from the list
                                                                totalData = data.vpns["vpn-basic-import-bean"].length;
                                                             }
                                                           }
                                                     }
                                                   }
                                                   totalDataTmp = data.vpns["vpn-basic-import-bean"].length;
                                                   if(totalDataTmp > 0){
                                                           for (var i = 0; i < totalDataTmp; i ++) {
                                                               data.vpns["vpn-basic-import-bean"][i].nextLevel = 2;
                                                               data.vpns["vpn-basic-import-bean"][i].rowId = data.vpns["vpn-basic-import-bean"][i].name;
                                                               data.vpns["vpn-basic-import-bean"][i].ruleLevel = 1;
                                                               data.vpns["vpn-basic-import-bean"][i].ruleOrder = 0;
                                                               data.vpns["vpn-basic-import-bean"][i].parent =  "";
                                                               data.vpns["vpn-basic-import-bean"][i].leaf = false;
                                                           }

                                                   }
                                             }catch(e){
                                                 console.log(e);
                                             }

                                           }

                                           return data.vpns[RestApiConstants.TOTAL_PROPERTY];
                                       },
                                      "height": "360",
                                      "numberOfRows": 10000,
                                      "tree": {
                                          "column": "name",
                                          "level": "ruleLevel",
                                          "initialLevelExpanded": 0,
                                          "parent": "parent", //optional since it's using the default value of the attribute
                                          "leaf": "leaf", //optional since it's using the default value of the attribute
                                          "getChildren": getChildren,
                                      },
                                      "filter": {
                                          searchUrl: function (value, url){
                                             return url;
                                           },
                                           onBeforeSearch: onBeforeSearch,
                                           noSearchResultMessage : self.context.getMessage("ipsec_vpn_no_result_for_search")
                                      },
                                      "columns": [ {
                                              "index": "name",
                                              "name": "name",
                                              "label": self.context.getMessage("import_vpn_device_endpoint_name"), //"Name",
                                              "width": 250
                                          },{
                                              "index": "remote-end-point.vpn-name-in-device",
                                              "name": "remote-end-point.vpn-name-in-device",
                                              "label": self.context.getMessage("import_vpn_remote_endpoint"), //"Remote end point",
                                              "width": 200
                                          },
                                          {
                                              "index":"error-level",
                                              "name": "error-level",
                                              "formatter":formatIcons,
                                              "label": self.context.getMessage("import_vpn_status"), // "error-level",
                                              "width": 100
                                          },
                                          {
                                              "index":"error-msg",
                                              "name": "error-msg",
                                              "label": self.context.getMessage("import_vpn_notification"), // "error-msg",
                                              "formatter":formaterrormsg,
                                              "width": 450
                                          }
                                        ]
                                    }
                             }
                     };
                    return Configuration;
                }
    );
