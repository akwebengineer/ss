/**
 * Module that implements the VpnImportWizardView.
 *
 * @module VpnImportWizardView
 * @author Ponraja <ponraja@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/shortWizard/shortWizard',
    'widgets/grid/gridWidget',
    'widgets/progressBar/progressBarWidget',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/spinnerWidget',
    './vpnImportIntroPageView.js',
    './vpnImportDeviceGridView.js',
    './vpnImportDeviceEndPointsView.js',
    './vpnImportQuickView.js',
    './vpnImportSummaryView.js',
    './vpnImportCustomSummaryResultView.js',
    '../conf/vpnImportSummaryGridConfiguration.js',
    '../utils.js',
    '../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../../ui-common/js/views/apiResourceView.js'
    ], function(
           Backbone,
           FormWidget,
           ShortWizard,
           GridWidget,
           ProgressBarWidget,
           OverlayWidget,
           SpinnerWidget,
           VpnImportIntroPageView,
           VpnImportDeviceGridView,
           VpnImportDeviceEndPointsView,
           vpnImportQuickView,
           VpnImportSummaryView,
           customSummaryResult,
           importVpnEndPointsSummaryGrid,
           Utils,
           SmSSEEventSubscriber,
           ResourceView){

    var VpnCreateWizardView = ResourceView.extend({

        initialize: function (options) {
            var self = this,
                pages = [],
                dataObject = {},
                serviceType = [];
            this.context = options.activity.getContext();

            ResourceView.prototype.initialize.call(this, options);

            this.uuid = this.getUUId();
            this.dataObject = dataObject;
            this.dataObject.isInitiated = false;
            this.serviceType = 'importvpn';
            this.customSummaryResultformConfiguration = new customSummaryResult(this.context);
            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
           dataObject.uuid = this.uuid;
           pages.push({
                title: this.context.getMessage(''),
                view: new VpnImportIntroPageView({
                    "context": this.context,
                    "dataObject": dataObject,
                    "uuid":this.uuid
                }),
                intro: true

           });

            pages.push({
                title: this.context.getMessage('import_vpn_trg_settings_form_title'),
                view: new VpnImportDeviceGridView({
                    "context": this.context,
                    "dataObject": dataObject,
                    "uuid":this.uuid,
                    "wizardView" : self,
                    model: this.model
                })

            });

            pages.push({
                title: this.context.getMessage('import_vpn_trg_settings_form_section_heading_select_endpoints'),
                view: new VpnImportDeviceEndPointsView({
                    "context": this.context,
                    "dataObject": dataObject,
                    "uuid":this.uuid,
                    "serviceType" : this.serviceType,
                    "wizardView" : self,
                    model: this.model
                })
            });


            var vpnImportSummaryPage = {
            /*pages.push({ */
                title: this.context.getMessage('import_vpn_trg_settings_form_section_heading_Summary'),
                view: new VpnImportSummaryView({
                    "id": "import-vpn-summary-page",
                    "class" : "cls-import-vpn-summary-page",
                    "context": this.context,
                    "dataObject": dataObject,
                    "wizardView" : self,
                    "uuid":this.uuid,
                     model: this.model
                })
            };

            CustomDoneStatusFooter = Backbone.View.extend({
                    initialize: function(options){
                        //this.options.summary = self.dataObject.summary;
                    },
                    render: function(){
                        this.formWidget = new FormWidget({
                             container: this.el,
                             elements: self.customSummaryResultformConfiguration.getValues(self.dataObject.summary),
                             values: self.dataObject.summary
                        });
                        this.formWidget.build();
                        return this;
                    }
            });
            customSummaryView = Backbone.View.extend({
                    initialize: function(pages){
                        this.context = pages[2].view.context;
                        this.dataObject = dataObject;
                        this.activity = pages[2].view.activity;
                        this.wizardView = pages[2].view.wizardView;
                        this.dataObject.readyForNext  = false;
                        this.dataObject.summary = [];
                        this.dataObject.jobDone  = false;
                        this.actionEvents = {
                            quickViewEvent:{
                                name: "QuickViewRow"
                            }
                        }
                        this.jobId ="";
                        this.bindGridEvents();
                        return this;
                    },
                    bindGridEvents: function () {
                       var self = this;
                           this.$el
                           .bind(self.actionEvents.quickViewEvent.name, function(e, quickViewRow){
                               //console.log(quickViewRow);
                           new vpnImportQuickView({
                               'rowData': quickViewRow.selectedRows[0],
                               'ruleLevel': quickViewRow.selectedRows[0].ruleLevel
                           }).render();
                         })
                        .bind("gridOnRowSelection", function(e, selectedRows){
                         //console.log(selectedRows);
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
                    render: function(){
                       this.$el.empty();
                       this.selectedDevices = this.wizardView.wizard.selectedDevices;
                       this.unSelectedDevices = this.wizardView.wizard.unSelectedDevices;

                       var vpnImportSummaryGridConfiguration = new importVpnEndPointsSummaryGrid(this);
                       vpnImportSummaryGridConfiguration.render;
                        this.importSummaryGrid = new GridWidget({
                              container: this.el,
                              actionEvents:this.actionEvents,
                              cellOverlayViews:this.cellOverlayViews,
                              cellTooltip:this.cellTooltip,
                              elements: vpnImportSummaryGridConfiguration.getValues(this)
                          });
                       this.importSummaryGrid.build();
                       return this;
                    }
            });

            this.wizard = new ShortWizard({
                id: 'importVPNWizard',
                container: this.el,
                title: this.context.getMessage('import_vpn_wizard_title'),
                titleHelp: {
                    "content": this.context.getMessage('import_vpn_wizard_title_tooltip'),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("VPN_IPSEC_IMPORTING")
                },
                showSummary: customSummaryView,
                pages: pages,
                type: "xlarge",
                save:  function(options) {
                     self.getPersistimportVpn(self.wizard.unSelectedDevices , options);
                },
                onDone: function() {
                    self.activity.view.overlay.destroy();
                    self.activity.view.gridWidget.reloadGrid();
                    var intent = new Slipstream.SDK.Intent('Space.Intent.action.DETAILED_JOB_VIEW',{
                            mime_type: 'vnd.net.juniper.sm.job.detailedView'
                    });
                    intent.putExtras({data: {id: self.jobId } });
                    self.context.startActivity(intent);
                },
                onCancel: function() {
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                    self.activity.finish();
                    self.activity.view.overlay.destroy();
                    self.activity.view.gridWidget.reloadGrid();
                },
                onClickRelatedLinks: function(){
                    console.log('onClickRelatedLinks');
                },
                customSuccessStatusFooter: new CustomDoneStatusFooter(),
                customErrorStatusFooter: new CustomDoneStatusFooter()
            });
            return this;
        },

        render: function() {
          this.dataObject.lastScreen=0;
          this.wizard.build();
          return this;
        },
        getPersistimportVpn:function(unSelectedDevices, options){
            var self = this;
            var len = unSelectedDevices.length //JSON.parse(selectedDevices).vpns["vpn-basic-import-bean"].length;
            selectedVpnNames = [];

             /* Final Output for Unselected JSON*/
               var parentsList = [];
               var firstChildList = [];
               var secondChildList = [];
               var firstChildAncestorList = [];
               var secondChildAncestorList = [];
               for(i=0;i<unSelectedDevices.length;i++){
               if(unSelectedDevices[i].parent ==="" && unSelectedDevices[i].myType === "vpn"){
                // First Level
                    parentsList.push(unSelectedDevices[i].rowId.trim());
                }
               }
               for(o=0;o<unSelectedDevices.length;o++){
                  if(unSelectedDevices[o].myType === "devices"){
                    //device List
                      firstChildAncestorList.push(unSelectedDevices[o].myAncestors);
                   }
                 }
               //console.log("devices List : "+firstChildAncestorList);
                 for(n=0;n<unSelectedDevices.length;n++){
                   if(unSelectedDevices[n].myType === "endpoints"){
                    //Endpoint List
                      secondChildAncestorList.push(unSelectedDevices[n].myAncestors);
                   }
                 }
               //console.log("Endpoint List : "+ secondChildAncestorList);

               var finalDeviceList = [];
                for(y=0;y<firstChildAncestorList.length;y++){
                    //console.log(typeof(secondChildAncestorList[y]));
                    if(typeof(secondChildAncestorList[y]) != 'undefined' || secondChildAncestorList[y] != undefined){
                        var tmp = secondChildAncestorList[y].split(',');
                        finalDeviceList .push({"vpn-name" : tmp[0],"device-id" : tmp[1]});
                    }
                }
                //console.log(finalDeviceList);

                var finalEndpointList = [];
                for(y=0;y<secondChildAncestorList.length;y++){
                    var tmp = secondChildAncestorList[y].split(',');
                    finalEndpointList.push({"vpn-name" : tmp[0],"device-id" : tmp[1],"ep-names" : tmp[2]});
                }
                //console.log(finalEndpointList);
               /* End Final Output for Unselected JSON*/
               var data = {
                           "persist-vpn-request": {
                              "user-data": {
                                  "vpn-unselected-list": {
                                      "vpn-name":parentsList
                                  },
                                  "device-unselected-list": {
                                    "device-list": finalDeviceList
                                },
                                "endpoint-unselected-list": {
                                    "endpoint-list":finalEndpointList
                                }
                              }
                          }
                };
                $.ajax({
                    "url": '/api/juniper/sd/vpn-management/vpn-import/persist-vpn?ui-session-id='+this.uuid+'&browser-id=ImportVpnRest',
                    "type": 'post',
                    "contentType": 'application/vnd..sd.vpn-management.vpn-import.persist-vpn-request+json;version=2;charset=UTF-8',
                     "headers" :{
                         "accept": 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.02'
                     },
                    "processData": false,
                    "data": JSON.stringify(data),
                    "success": function( job, textStatus, jQxhr ) {
                            if(job["task"].id > 0){
                                self.subscribeNotifications(job["task"].id, options);
                            } // IF HAS Jobid
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });
        },
        subscribeNotifications : function (jobID , options) {
            //Subscribe to the SSE event
            var self = this, sseEventHandler, notificationSubscriptionConfig = {
                'uri' : ['/api/space/job-management/jobs/'+jobID],
                'autoRefresh' : true,
                'callback' : function () {
                    self.getJobDetails(jobID, options);
                }
            };
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },
        unSubscribeNotification: function(){
            // unsubscribe Notification for job details
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
        },
        getSummaryInfo: function(jobId, options){
                    var summaries=[];
                    var self = this;
                    self.jobId = jobId;
                        $.ajax({
                               "url": '/api/juniper/sd/vpn-management/vpn-import/vpn-import-summaries?job-id='+jobId,
                               "type": 'get',
                               "headers" :{
                                     "accept": 'application/vnd.sd.vpn-management.vpn-import.vpn-import-summary-response+json;version=2;q=0.02'
                               },
                               "dataType" : 'json',
                               "processData": false,
                               "beforeSend":function(){
                               },
                               "success": function( response, textStatus, jQxhr ) {
                                   var myCustomHtml = $("<img src='/assets/images/success.png'/>");
                                   summaries.push({"label":self.context.getMessage("import_vpn_pass_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-vpns"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_device_pass"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-devices"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_passed_vpn_endpoints"),"value": JSON.parse(response["vpn-import-summary-response"]["passed-vpn-endpoints"]).toString()});
                                   self.dataObject.summary = summaries;
                                   self.relatedActivities = self.dataObject.summary;
                                   if ( summaries) {
                                         // Replace the placeholder "{0}" with the vpn name
                                         Utils.showNotification("success", summaries[0].value + " " + self.context.getMessage("import_vpn_notification_success"));
                                         responseString = self.context.getMessage("import_vpn_success");
                                         responseString = responseString.replace("{0}",summaries[0].value);
                                         options.success(responseString);
                                     } else {
                                         Utils.showNotification("error", summaries[0].value + " " + self.context.getMessage("import_vpn_notification_failure"));
                                         responseString = self.context.getMessage("import_vpn_failure");
                                         responseString = responseString.replace("{0}",summaries[0].value);
                                     }
                                   self.dataObject.readyForNext = true;
                                   self.unSubscribeNotification();
                               },
                               "error": function( jqXhr, textStatus, errorThrown ) {
                                   console.log( errorThrown );
                               }
                        });
        },
        getJobDetails : function(jbid, options){
            self = this;
            var returnJobStatus;
            $.ajax({
                    "url": '/api/space/job-management/jobs/'+jbid,
                    "type": 'get',
                    "headers": {
                        "Accept": 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03'
                    },
                    "dataType": "json",
                    "success": function( jobdata, textStatus, jQxhr ) {
                             var jobId =  jobdata["job"]["id"];
                             var jobState = jobdata["job"]["job-state"].toUpperCase();
                             var jobStatus = jobdata["job"]["job-status"].toUpperCase();
                             switch(jobState){
                                case 'INPROGRESS':
                                break;
                                case 'SUCCESS':
                                case 'DONE':
                                    self.getSummaryInfo(jbid, options);
                                break;
                             }
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                            console.log( errorThrown );
                    }
            });
        },
        /**
        *  generate Unique Id for each Import Configuration action.
        *  returns unique identifier String
        */
        getUUId: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
    });

  return VpnCreateWizardView;
});
