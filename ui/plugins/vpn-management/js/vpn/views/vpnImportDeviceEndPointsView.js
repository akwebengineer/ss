/**
 * Module that implements the VpnImportDeviceEndPointsView.
 *
 * @module VpnImportDeviceEndPointsView
 * @author Anuranc <anuranc@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    '../conf/vpnImportEndPointGridConfiguration.js',
    'widgets/grid/gridWidget',
    'widgets/progressBar/progressBarWidget',
    'widgets/overlay/overlayWidget',
    './vpnImportQuickView.js',
    'widgets/form/formWidget',
    '../conf/vpnImportEndPointGridFormConfiguration.js',
    '../utils.js',
    '../../../../ui-common/js/common/restApiConstants.js'
],function(Backbone, vpnImportEndPointGridConfiguration, GridWidget, ProgressBarWidget, OverlayWidget, vpnImportQuickView,FormWidget , gridForm, Utils, RestApiConstants) {
        var VpnImportEndpointsView = Backbone.View.extend({
            events: {
                "click .cellLink": "openLink"
            },
            initialize: function(options) {
                this.context = options.context;
                this.dataObject = options.dataObject;
                this.uuid = this.dataObject.uuid;
                this.activity = options.activity;
                this.wizardView = options.wizardView;
                this.selectedDevices = this.options.selectedDevices;
                this.unSelectedDevices = this.options.unSelectedDevices;
                this.errorFlag = this.options.errorFlag;
                this.actionEvents = {
                    quickViewEvent:{
                        name: "QuickViewRow"
                    }
                }
                return this;
            },
            render: function() {
                this.$el.empty();
                var vpnImportEndPointGridConf = new vpnImportEndPointGridConfiguration(this);
                endPointFormConf = new gridForm(this.context);
                    this.formWidget = new FormWidget({
                    "elements" : endPointFormConf.getValues(),
                    "container" : this.el
                });
                this.formWidget.build();
                this.messageContainer = this.$el.find('.endpointgridplaceholder').empty();
                this.messageContainer.hide();

                this.vpnImportEndPointGrid = new GridWidget({
                      container: this.el,
                      actionEvents:this.actionEvents,
                      cellOverlayViews:this.cellOverlayViews,
                      cellTooltip:this.cellTooltip,
                      elements: vpnImportEndPointGridConf.getValues(this)
                });
                this.errorFlag = true;
                this.bindGridEvents();
                this.vpnImportEndPointGrid.build();
                this.$el.find('#moreMenu').hide();
                this.$el.find('span.tree-select-all').hide();
                return this;
            },
            getJsonForVpn : function (selectedRows,result,isCheckedFlag){
            var self = this;
            var isCheckedFlagVPN = false;
                for(i=0;i<selectedRows.selectedRows.length;i++){
                  if(selectedRows.selectedRows[i] !== undefined && selectedRows.selectedRows[i]["rowId"]===result[0].rowId){
                        isCheckedFlagVPN = true;
                        break;
                  }
              }
                 return self.mainObjectJson(isCheckedFlagVPN,isCheckedFlag,result,1);
            },
            getJsonForDevice : function (selectedRows,result,isCheckedFlag){
            var self = this;
                var isCheckedFlagVPN = false;
                for(i=0;i<selectedRows.selectedRows.length;i++){
                  if(selectedRows.selectedRows[i] !== undefined && selectedRows.selectedRows[i]["rowId"]=== result[0].myAncestors.split(',')[0]){
                        isCheckedFlagVPN = true;
                        break;
                     }

                }
                  if(result[0]["is_hub"] === ""){
                      result[0]["is_hub"] = false;
                  }
                 return self.mainObjectJson(isCheckedFlagVPN,isCheckedFlag,result,2);
            },
            getJsonForEndpoints : function (selectedRows,result,isCheckedFlag){
                   var self = this;
                   for(i=0;i<selectedRows.selectedRows.length;i++){
                     if(selectedRows.selectedRows[i] !== undefined && selectedRows.selectedRows[i]["rowId"]=== result[0].myAncestors.split(',')[0]){
                           isCheckedFlagVPN = true;
                           break;
                     }
                   }

                   if(result[0]["is_hub"] === ""){
                        result[0]["is_hub"] = false;
                   }
                    return self.mainObjectJson(isCheckedFlagVPN,isCheckedFlag,result,3);
            },

            mainObjectJson: function(isCheckedFlagVPN, isCheckedFlag, result, typeOfProcess){
            var thisVPNname ="";
            json =  {
                     "validate-selection-request": {
                     }
                    };
            if(typeOfProcess === 1 ||typeOfProcess === 2 || typeOfProcess ===3){
                if(result[0]["myType"] === 'vpn'){
                    thisVPNname = result[0]["rowId"];
                }else{
                    thisVPNname = result[0].myAncestors.split(',')[0];
                }
                json["validate-selection-request"]["vpn-bean"] =  {
                      "vpn-basic-import-bean": {
                          "name": thisVPNname,
                          "checked": isCheckedFlagVPN
                      }
                   };
                }
             if (typeOfProcess === 2||typeOfProcess === 3){
               json["validate-selection-request"][ "device-bean"]= {
                      "vpn-device-import-bean": {
                         "id": result[0].myAncestors.split(',')[1],
                         "name": result[0].myAncestors.split(',')[1],
                         "is-hub": result[0]["is_hub"],
                         "checked":isCheckedFlag
                     }
                  };
                }
             if(typeOfProcess === 3){
                json["validate-selection-request"]["tunnel-bean"] = {
                         "vpn-end-point-import-bean": {
                             "vpn-name-in-device": result[0].myAncestors.split(',')[2],
                             "device": {
                                 "id": result[0].myAncestors.split(',')[1],
                                 "name": result[0].myAncestors.split(',')[2]
                             },
                             "device-name":  result[0].myAncestors.split(',')[2],
                             "checked":isCheckedFlag
                         }
                    };
                }
                return json;
            },
            gridSelectionProcess : function (myOwnType,selectedRows,result,isCheckedFlag){
                var self = this;
                var jsonData ="";
                switch(myOwnType){
                  case 'vpn':
                  jsonData = self.getJsonForVpn(selectedRows,result,isCheckedFlag);
                  break;
                  case 'devices':
                  jsonData = self.getJsonForDevice(selectedRows,result,isCheckedFlag);
                  break;
                   case 'endpoints':
                   jsonData = self.getJsonForEndpoints(selectedRows,result,isCheckedFlag);
                 break;
                } /* End Switch */
                return jsonData;

            },
            bindGridEvents: function () {
              var self = this;
              this.$el
              .bind(self.actionEvents.quickViewEvent.name, function(e, quickViewRow){
                  new vpnImportQuickView({
                      'rowData': quickViewRow.selectedRows[0],
                      'ruleLevel': quickViewRow.selectedRows[0].ruleLevel
                  }).render();
              })
              .bind(this.actionEvents.toggleSelectedRow, function(e, selectedRows){
                  self.vpnImportEndPointGrid.toggleRowSelection(selectedRows);
              })
              .bind("gridOnRowSelection", function(e, selectedRows){
                      var isCheckedFlag = selectedRows.currentRow.selected;
                      var daatList = [];
                      var result ="";
                      // Checked or uncheked true false
                      var json = "";
                      self.options.errorFlag = true;

                      if(isCheckedFlag === false){
                        // Unchecked Condition
                        var thisRowId = selectedRows.currentRow.rowId
                        var thisRowData = selectedRows.allUnselectedRowData;
                            if(thisRowData === undefined){
                                return;
                            }
                          var unselectedRowIdsArray = selectedRows.allUnselectedRowIds;
                              if($.inArray(thisRowId, unselectedRowIdsArray) !== -1){
                                    var result = $.grep(thisRowData, function(e){ return e.rowId == thisRowId; });
                                        if(result[0].myType !== undefined){
                                            var myType = result[0].myType;
                                            json = self.gridSelectionProcess(myType,selectedRows,result,isCheckedFlag);
                                        } /* End Mytype*/
                              }
                          }else{
                                    // Redo Cheked condiftion
                                    var thisRowId = selectedRows.currentRow.rowId
                                    var thisRowData = selectedRows.selectedRows;
                                    if(thisRowData === undefined){
                                          return;
                                      }
                                    var selectedRowIdsArray = selectedRows.selectedRowIds;
                                      if($.inArray(thisRowId, selectedRowIdsArray) !== -1){
                                          var result = $.grep(thisRowData, function(e){ return e.rowId == thisRowId; });
                                          if(result[0].myType !== undefined){
                                              var myType = result[0].myType;
                                              json = self.gridSelectionProcess(myType,selectedRows,result,isCheckedFlag);
                                          } /* End Mytype*/
                                      }
                                    var myType = result[0].myType;
                                    json = self.gridSelectionProcess(myType,selectedRows,result,isCheckedFlag);

                          }
                          if(json){
                                $.ajax({
                                      url: '/api/juniper/sd/vpn-management/vpn-import/validate-selection-request?ui-session-id='+self.uuid,
                                      contentType: 'application/vnd.sd.vpn-management.vpn-import.validate-selection-request+json;version=2;charset=UTF-8',
                                      headers: {
                                          Accept: 'application/vnd.sd.vpn-management.vpn-import.validate-selection-response+json;version=2;q=0'
                                      },
                                      type: 'POST',
                                      cache : true,
                                      data: JSON.stringify(json),
                                      success: function(data) {
                                          if(data["validate-selection-response"].value !== 'True'){
                                            self.options.errorFlag= false;
                                          }
                                      },
                                      error: function(data) {
                                          console.log(data);
                                      }
                                });
                            }

              });

            },
            cellTooltip: function (cellData, renderTooltip){
                var colData = "";
                if(typeof cellData.rawData != "undefined" && cellData.columnName === "name" ){
                  colData = cellData.rawData.name;
                }else if(cellData.columnName === "status-level"){
                  colData = cellData.cellId;
                }
                renderTooltip(colData);
            },
            beforePageChange:function (currentStep, nextStep){
                var selectedDevices = [];
                var unSelectedDevices = [];
                var self = this;
                if(nextStep == 3 ){
                 selectedDevices = this.vpnImportEndPointGrid.getSelectedRows(true).selectedRows;
                 unSelectedDevices = this.vpnImportEndPointGrid.getSelectedRows(true).allUnselectedRowData;
                        if(typeof(unSelectedDevices) === 'undefined' || unSelectedDevices === undefined){
                               // Added for PR 1172972
                               unSelectedDevices =[];
                               var allData = this.vpnImportEndPointGrid.getAllVisibleRows(); // sorted By rule level
                               for(j=0;j<selectedDevices.length;j++){
                                   for(i=0;i<allData.length;i++){
                                       if(selectedDevices[j].rowId === allData[i].rowId.trim()){
                                              allData.splice(i, 1); // removing selected VPN from the list
                                           }
                                       }
                              }
                              for(u=0;u<allData.length;u++){
                                   // adding into new list
                                   unSelectedDevices.push(allData[u]);
                              }
                        }
                        var json = {
                             "vpns": {
                                 "vpn-basic-import-bean": selectedDevices,
                                 "total" : selectedDevices.length
                            }
                        };
                        this.wizardView.wizard.unSelectedDevices = unSelectedDevices;
                        if(!$.isArray(unSelectedDevices)){
                           var unselectedVpnNames =  unSelectedDevices.name;
                        }else{
                            var l = unSelectedDevices.length
                        }
                        // One VPN should be selected
                        var parentsList = [];
                        for(i=0;i<selectedDevices.length;i++){
                            if(selectedDevices[i].parent ==="" && selectedDevices[i].myType === "vpn"){
                                // First Level
                                parentsList.push(selectedDevices[i].rowId);
                             }
                        }
                        if(parseInt(parentsList.length) <= 0 || self.options.errorFlag === false){
                            //PR: 1124443
                            this.formWidget.showFormError(this.context.getMessage('import_vpn_endPoint_grid_warning_selection'));
                            return false;
                        }else{
                            this.messageContainer = this.$el.find('#errorDivEndpointWarning').empty();
                            this.messageContainer.hide();
                            return true;
                        }


                }
                if(nextStep == 1){
                  Utils.showNotification("warning", "Import VPN" + ': ' + "Going back will lose your selections ");
                  return true;
                }
            },
            getTitle: function () {
                return this.context.getMessage('import_vpn_endpoint_settings_form_title');
            }
    });

    return VpnImportEndpointsView;
});
