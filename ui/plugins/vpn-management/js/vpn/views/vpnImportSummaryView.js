/**
 * Module that implements the VpnImportSummaryView.
 *
 * @module VpnImportSummaryView
 * @author anuranc <anuranc@juniper.net>
 * @modified anuranc
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'backbone',
    '../conf/vpnImportSummaryGridConfiguration.js',
    'widgets/grid/gridWidget',
    'widgets/progressBar/progressBarWidget',
    'widgets/overlay/overlayWidget',
    './vpnImportQuickView.js',
    'widgets/form/formWidget',
    'widgets/spinner/spinnerWidget',
    '../../../../ui-common/js/common/restApiConstants.js'
],function(Backbone, ImportVpnEndPointsSummaryGrid, GridWidget, ProgressBarWidget, OverlayWidget, vpnImportQuickView, FormWidget,SpinnerWidget, RestApiConstants) {
       var VpnImportSummaryView = Backbone.View.extend({
        events: {
            "click .cellLink": "openLink"
        },
        initialize: function(options) {

            this.context = options.context;
            this.dataObject = options.dataObject;
            this.activity = options.activity;
            this.wizardView = options.wizardView;
            this.dataObject.readyForNext  = false;
            this.dataObject.summary = [];
            this.dataObject.jobDone  = false;
            this.actionEvents = {
                quickViewEvent:{
                    name: "QuickViewRow"
                }
            }
            this.jobId ="";
            //this.bindGridEvents();
            return this;
        },
        /*bindGridEvents: function () {
              var self = this;
                this.$el
                .bind(self.actionEvents.quickViewEvent.name, function(e, quickViewRow){
                    console.log(quickViewRow);
                new vpnImportQuickView({
                    'rowData': quickViewRow.selectedRows[0],
                    'ruleLevel': quickViewRow.selectedRows[0].ruleLevel
                }).render();
            })
               .bind("gridOnRowSelection", function(e, selectedRows){
                console.log(selectedRows);
            });
        },*/
        render: function() {
           this.$el.empty();
           this.selectedDevices = this.wizardView.wizard.selectedDevices;
           this.unSelectedDevices = this.wizardView.wizard.unSelectedDevices;
           //console.log("Unseleted : " + this.unSelectedDevices);
           var VpnImportSummaryGridConfiguration = new ImportVpnEndPointsSummaryGrid(this);

           this.summaryProgressBar = new ProgressBarWidget({
                   "container": this.el,
                   "hasPercentRate": false,
                   "statusText": 'Please wait while Persist VPN data are being analyzed. Once complete, you may check the log reports.',
                   "inOverlay": true
           });

           this.importSummaryGrid = new GridWidget({
               container: this.el,
               actionEvents:this.actionEvents,
               cellOverlayViews:this.cellOverlayViews,
               elements: VpnImportSummaryGridConfiguration.getValues(this)
           });
               this.$el.find('dd#moreMenu').hide();
               this.$el.find('.actionMenu .more').empty();
           this.importSummaryGrid.build();
           return this;
        },
        getJobDetails : function(jbid){
            self = this;
            				var returnJobStatus;
            				$.ajax({
            						"url": '/api/space/job-management/jobs/'+jbid,
            						"type": 'get',
            						"headers": {
            							"Accept": 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03'
            						},
            						"async": false,
            						"dataType": "json",
            						"success": function( jobdata, textStatus, jQxhr ) {

                                             var jobId =  jobdata["job"]["id"];
                                             var jobState = jobdata["job"]["job-state"].toUpperCase();
                                             var jobStatus = jobdata["job"]["job-status"].toUpperCase();
                                             switch(jobState){
                                                case 'INPROGRESS':
                                                    self.summaryProgressBar.setStatusText("Job In Progress ...");
                                                	returnJobStatus = "INPROGRESS";
                                                	return returnJobStatus;
                    	                            break;
                                                case 'DONE':
            										returnJobStatus = "DONE";
            										return returnJobStatus;
                	                                break;

                                             }
                                    },
            						"error": function( jqXhr, textStatus, errorThrown ) {
            								console.log( errorThrown );
            						}
            });
            return returnJobStatus;
        },
        getSummaryInfo: function(jobId){
            var summaries=[];
            var self = this;
            self.jobId = jobId;
                        $.ajax({
                               "url": '/api/juniper/sd/vpn-management/vpn-import/vpn-import-summaries?job-id='+jobId,
                               "type": 'get',
                               "headers" :{
                                     "accept": 'application/vnd.sd.vpn-management.vpn-import.vpn-import-summary-response+json;version=2;q=0.02'
                               },
                               "async": false,
                               "dataType" : 'json',
                               "processData": false,
                               "beforeSend":function(){
                                   self.summaryProgressBar.setStatusText("Please wait while Generating Summary Report ");
                               },
                               "success": function( response, textStatus, jQxhr ) {
                                   var myCustomHtml = $("<img src='/assets/images/success.png'/>");
                                   //summaries.push({"label":" ","value":"Below VPN settings have successfully been imported"});
                                   summaries.push({"label":self.context.getMessage("import_vpn_pass_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-vpns"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_device_pass"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-devices"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_passed_vpn_endpoints"),"value": JSON.parse(response["vpn-import-summary-response"]["passed-vpn-endpoints"]).toString()});
                                   /*summaries.push({"label":self.context.getMessage("import_vpn_total_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["total-vpn-endpoints"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_failed_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["failed-vpns"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_failed_vpn_endpoints"),"value": JSON.parse(response["vpn-import-summary-response"]["failed-vpn-endpoints"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_passed_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["passed-vpns"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_device"),"value": response["vpn-import-summary-response"]["devices"].toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_total_device"),"value": JSON.parse(response["vpn-import-summary-response"]["total-devices"]).toString()});
                                   //summaries.push({"label":self.context.getMessage("import_vpn_total_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["total-vpns"]).toString()});
                                   summaries.push({"label":self.context.getMessage("import_vpn_message"),"value": response["vpn-import-summary-response"]["message"].toString()});*/
                                   /*summaries.push({
                                    "label":self.context.getMessage("import_vpn_link"),
                                     "value": response["vpn-import-summary-response"]["summary-text" ].toString()
                                   });*/
                                    self.dataObject.readyForNext = true;
                                    self.dataObject.summary = summaries;
                               },
                               "error": function( jqXhr, textStatus, errorThrown ) {
                                   console.log( errorThrown );
                               }
                        });
               return self.dataObject.summary;
        },
        beforePageChange:function (currentStep, nextStep){
                var self = this;
                var selectedDevices = [];

                if(nextStep == 4 ){
                  selectedDevices = self.selectedDevices;
                  var len = JSON.parse(selectedDevices).vpns[RestApiConstants.TOTAL_PROPERTY];
                    if(len == 0){
                            return false;
                    }else{
                       self.summaryProgressBar.build();
                       this.$el.find('.grid-widget').hide();
                       stat = self.getPersistimportVpn(self.unSelectedDevices);
                       if(stat ===  true){

                       }
                       return self.dataObject.readyForNext;
                       // TODO:

                    }
               }
               if(nextStep == 2){
                    return true;
               }

         },
         getSummary: function() {
           var self = this;
           self.summaryProgressBar.destroy();
           var summary = [];
           summary = self.dataObject.summary;
           return summary;
         },

         submit: function(event) {
            event.preventDefault();
            // Check is form valid
            if (! this.form.isValidInput()) {
                return;
            }
            this.activity.overlay.destroy();
         },
         cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
         },
         getTitle: function () {
          return this.context.getMessage('import_vpn_trg_settings_form_section_heading_Summary');
         }
  });

  return VpnImportSummaryView;
});
