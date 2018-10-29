/**
 * Module that implements the VpnImportDeviceGridView.
 * @module VpnImportDeviceGridView
 * @author anuranc <anuranc@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define(
	[
		'backbone',
		'../conf/vpnImportDevicesGridConfiguration.js',
		'../conf/vpnImportDeviceGridFormConfiguration.js',
		'widgets/grid/gridWidget',
		'widgets/progressBar/progressBarWidget',
        'widgets/overlay/overlayWidget',
		'widgets/spinner/spinnerWidget',
		'../../../../ui-common/js/common/widgets/progressBarForm.js',
		'widgets/form/formWidget',
		'../utils.js',
		'../../../../ui-common/js/sse/smSSEEventSubscriber.js',
		'../../../../sd-common/js/common/timeKeeper.js'
	],
	function(Backbone, ImportVpnFromDevicesGrid, vpnImportDeviceGridFormConfiguration, GridWidget, ProgressBarWidget, OverlayWidget, SpinnerWidget, ProgressBarForm, FormWidget, Utils, SmSSEEventSubscriber, TimeKeeper) {
		var timer;
		var VpnImportGridView = Backbone.View.extend({
			initialize: function(options) {
				this.context = options.context;
				this.dataObject = options.dataObject;
				this.activity = options.activity;
                this.wizardView = options.wizardView;
                this.dataObject.readyForNext  = false;
                this.dataObject.jobDone  = false;
                this.completed = false;
				this.uuid = this.dataObject.uuid;
				this.jobIDsForNotificationSubscribe = [];
				this.smSSEEventSubscriber = new SmSSEEventSubscriber();
				return this;
			},

			render: function() {
			    this.$el.empty();
			    var vpnImportGridConfiguration = new ImportVpnFromDevicesGrid(this.context);


			    deviceFormConf = new vpnImportDeviceGridFormConfiguration(this.context);
				this.formWidget = new FormWidget({
					"elements" : deviceFormConf.getValues(),
					"container" : this.el
				});
				this.formWidget.build();
				this.messageContainer = this.$el.find('.devicegridplaceholder').empty();
				this.messageContainer.hide();
				this.importGrid = new GridWidget({
					container: this.el,
					elements: vpnImportGridConfiguration.getValues(this.uuid)
				});
				this.progressBar =  new ProgressBarWidget({
					 "container": this.el,//this.options.wizardView.activity.view.overlay.getOverlayContainer(),
					 "hasPercentRate": false,
					 "inOverlay": true,
					 "statusText": 'Please wait while VPN configurations are being analyzed. Once complete, you may select VPN Endpoints to import...',
					 "title": 'Import VPN'
				});
				this.importGrid.build();
				return this;
			},
			getJobProgressInformation : function(jbid){
				self = this;
				var returnJobStatus;
				$.ajax({
						"url": '/api/juniper/sd/task-progress/$'+jbid,
						"type": 'get',
						"headers": {
							"accept": 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02',
						},
						"async": false,
						"dataType": "json",
						"success": function( jobdata, textStatus, jQxhr ) {

							var jobPercentage = jobdata['task-progress-response']['percentage-complete'];
							var jobStatus = jobdata['task-progress-response']['current-step'];
							if(jobPercentage === 100){
								self.unSubscribeNotification();
								self.getImportVpnRecordCount();
							}else if(jobPercentage < 0){
								self.unSubscribeNotification();
								self.getImportVpnRecordCount();
							}
							else{
								self.progressBar.setStatusText("Job In Progress ...");
							}
						},
						"error": function( jqXhr, textStatus, errorThrown ) {
								console.log( errorThrown );
						}
				});
				return returnJobStatus;
				//return self.dataObject.jobDone;
			},
			getImportVpnRecordCount: function(){
				self = this;
				var deviceCount;
				$.ajax({
						"url": '/api/juniper/sd/vpn-management/vpn-import/vpn-count?ui-session-id='+self.uuid,
						"type": 'get',
						"headers": {
							"Accept": 'application/vnd.sd.vpn-management.vpn-import.vpn-count+json;version=2;q=0.02'
						},
						"jsonRoot": "imported-vpn-count",
						"jsonRecords": function(dataCount) {
						   return dataCount["imported-vpn-count"].value;
					   	},
						"dataType": "json",
						"success": function( dataCount, textStatus, jQxhr ) {
							deviceCount = dataCount["imported-vpn-count"].value;
							if(deviceCount > 0 ){
								// VPN's are avilable
								self.dataObject.readyForNext  = true;
								self.options.wizardView.wizard.nextPage(2);
							}else if(deviceCount <= 0 ){
								// VPN conflict or no VPN
								self.progressBar.destroy();
								self.$el.find('.grid-widget').show(); // Show Device Grid
								$('.shortWizardPageTitle').show();
								Utils.showNotification("error", "Import VPN" + ': ' + "No VPN Configured or can be VPN conflict");
							}
							else{
								// VPN's are not avilable
								self.progressBar.destroy();
								self.$el.find('.grid-widget').show(); // Show Device Grid
								$('.shortWizardPageTitle').show();
								self.dataObject.readyForNext  = false;
							}
							self.unSubscribeNotification();
						},
						"error": function( jqXhr, textStatus, errorThrown ) {
								console.log( errorThrown );
						}
				});
			},
			getimportVpnList:function(selectedDevices){
				var moidList = [];
				var self = this;
                /*for(i=0;i<selectedDevices.length;i++){
                	moidList[i] = selectedDevices[i].moid;
                }*/
				var devicedata = {
						"import-vpn-request": {
							 "device-ids":{
							   "device-id":
								   selectedDevices
							}
						}
				};
				$.ajax({
                    "url": '/api/juniper/sd/vpn-management/vpn-import/import-vpn?ui-session-id='+this.uuid+'&browser-id=ImportVpnRest',
                    "type": 'post',
                    "contentType": 'application/vnd.sd.vpn-management.vpn-import.import-vpn-request+json;version=2;charset=UTF-8',
                     "headers" :{
                         "accept": 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.02'
                     },
                    "processData": false,
                    "data": JSON.stringify(devicedata),
                    "success": function( job, textStatus, jQxhr ) {
                     	if(job["task"].id > 0){
                    		self.subscribeNotifications('ImportVpnRest');
                    	}
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });
			},
			subscribeNotifications : function (jobID) {
					//Subscribe to the SSE event
					var self = this, sseEventHandler, notificationSubscriptionConfig = {
						'uri' : ['/api/juniper/sd/task-progress/$'+jobID],//['/api/space/job-management/jobs/'+ self.currentJobID ],
						'autoRefresh' : true,
						'callback' : function () {
							self.getJobProgressInformation(jobID);
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
			beforePageChange:function (currentStep, nextStep){
				var selectedDevices = [];
				var self = this;
				var result = false;
					if(nextStep == 2 ){
						// getting selected device from grid
            				selectedDevices = this.importGrid.getSelectedRows(true);
							if(selectedDevices.allRowIds && selectedDevices.allRowIds.length >0){
								selectedDevices = selectedDevices.allRowIds;
							}else{
								selectedDevices = selectedDevices.selectedRowIds;
							}
							if(!self.dataObject.readyForNext && selectedDevices.length !=0){
								self.progressBar.build();
								self.messageContainer = this.$el.find('#errorDivImportWarning').empty();
								self.messageContainer.hide();
								self.$el.find('.grid-widget').hide();
								$('.shortWizardPageTitle').hide();
							    self.getimportVpnList(selectedDevices);
							}else if(self.dataObject.readyForNext && selectedDevices.length !=0){
								self.dataObject.readyForNext = false;
								return true;
							}else{
								self.formWidget.showFormError(this.context.getMessage('import_vpn_device_grid_warning_selection'));
								return false;
							}
							//console.log("Result Called "+  result);
							//return result;
					}
			},
            getTitle: function () {
              return this.context.getMessage('import_vpn_trg_settings_form_title');
            }

  });

  return VpnImportGridView;
});