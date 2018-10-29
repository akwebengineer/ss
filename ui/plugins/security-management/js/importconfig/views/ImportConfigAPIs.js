/**
 * Module that defines all the server interaction apis.
 *
 * @module ImportConfigAPIs
 * @author Vinuth Tulasi <vinutht@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

 define(['../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    'widgets/confirmationDialog/confirmationDialogWidget',
     "widgets/overlay/overlayWidget",
     '../../../../ui-common/js/common/widgets/progressBarForm.js'
 ], function(SmSSEEventSubscriber, ConfirmationDialogWidget, OverlayWidget, ProgressBar) {

    return function(wizardActivity) {
        var apiConfig = wizardActivity.apiConfig,smSSEEventSubscriber = new SmSSEEventSubscriber(),sseEventSubscriptions, api = apiConfig.api;
        if (api === 'import-zip') {
            api = apiConfig.serviceType + '/rollback';
        }
        return {

            postManagedServices: function(currentPage) {
                var self = this,

                selectedServices = currentPage.importConfigServicesGrid.getSelectedRows();
                if(selectedServices && currentPage.dataObject.services){
                    var services = currentPage.dataObject.services;

                    for(var i=0;i<services.length;i++){
                           services[i]["is-selected"] = false;
                        for(var j=0;j<selectedServices.length;j++){
                            if(services[i].MOID == selectedServices[j].MOID){
                                 services[i]["is-selected"] = true;
                                break;
                            }
                        }
                    }
                    selectedServices = {"service-summary":services};
                }
                var data = {
                    "managed-services": selectedServices
                };



                $.ajax({
                    "url": '/api/juniper/sd/policy-management/' + api + '/managed-services?uuid='+currentPage.dataObject.uuid,
                    "type": 'post',
                    "contentType": 'application/vnd.juniper.sd.policy-import-management.managed-services+json;version=1;charset=UTF-8',
                    "processData": false,
                    "data": JSON.stringify(data),
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("pushed managed services - Success");
                        self.calculateConflicts(currentPage);
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                        currentPage.progressBar.destroy();
                        wizardActivity.removeMask();
                    }
                });
            },
        /**
         * [subscribeNotifications]
         * @return {SmSSEEventSubscriber obj} [ will subscribe for notifcation with job id]
         * triggers the getConfigJobResult as notication call back
         */
         subscribeNotifications : function (currentPage) {
            //Subscribe to the SSE event
            var self = this, sseEventHandler, notificationSubscriptionConfig = {
                'uri' : ['/api/juniper/sd/task-progress/$' + currentPage.dataObject.uuid ],
                'autoRefresh' : true,
                'callback' : $.proxy(self.checkProgressNotificationStatus, self)
            };
            sseEventHandler = $.proxy(self.checkProgressNotificationStatus, {currentPage:currentPage, self:self});
            if(sseEventSubscriptions) {
                self.unSubscribeNotification();
            }
            sseEventSubscriptions = smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            currentPage.unSubscribeNotificationOnClose = function(){
                self.unSubscribeNotification();
            };
            return sseEventSubscriptions;
        },
        /**
         * [unSubscribeNotification]
         */
         unSubscribeNotification: function(){
            // unsubscribe Notification for job details
            smSSEEventSubscriber.stopSubscription(sseEventSubscriptions);
        },
        checkProgressNotificationStatus: function(){
            var me = this, self = me.self, currentPage = me.currentPage, timer

            //Check if the notiifcation has not come for 2 mins Else detroy pb
           currentPage.progressBar.updateTimer();

            $.ajax({
                "url": '/api/juniper/sd/task-progress/$' + currentPage.dataObject.uuid,
                "type": 'get',
                "headers" :{
                    "accept": 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02',
                },
                "success": function( data, textStatus, jQxhr ) {
                    if(data['task-progress-response']['percentage-complete'] === 100){
                        //Cancel timer
                        currentPage.progressBar.clearProgressTimerout();
                        if(data['task-progress-response']['current-step'] === 'Calculating Conflicts'){
                            console.log('Calculate Conflicts - Success - through notification..');
                            if(currentPage.page == "ocr"){
                                self.getConflicts(currentPage);
                            } else{
                                currentPage.dataObject.readyForNext = true;
                                currentPage.progressBar.destroy();
                                currentPage.wizardView.wizard.nextPage();
                                wizardActivity.removeMask();
                            }
                        } else if(data['task-progress-response']['current-step'] === 'Generating Reports'){
                            console.log("Get Summary Report - Success - through notification..");
                            self.getSummaryInfo(currentPage);
                        }

                    }
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                    currentPage.progressBar.destroy();
                    self.activity.removeMask();
                }
            });
        },
        calculateConflicts: function(currentPage) {
            var self = this;
            self.subscribeNotifications(currentPage);
            $.ajax({
                "url": '/api/juniper/sd/policy-management/' + api + '/calculate-conflicts?uuid='+currentPage.dataObject.uuid,
                "type": 'post',
                "contentType": 'application/vnd.juniper.sd.policy-import-management+json;version=1;charset=UTF-8',
                "processData": false,
                "success": function( data, textStatus, jQxhr ) {
                    console.log("Calculate Conflicts - Success - through normal request..");
                    /*if(currentPage.page == "ocr"){
                        self.getConflicts(currentPage);
                    }
                    else{
                          currentPage.dataObject.readyForNext = true;
                          currentPage.progressBar.destroy();
                          currentPage.wizardView.wizard.nextPage();
                          wizardActivity.removeMask();
                    }*/
                    /*self.dataObject.readyForNext = true;
                    self.progressBar.destroy();
                    self.deviceILP.wizard.nextPage();*/
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    /*console.log( errorThrown );
                    currentPage.progressBar.destroy();
                    wizardActivity.removeMask();*/
                }
            });
        },

            getConflicts : function(currentPage){
                var self = this;
                $.ajax({
                    "url": '/api/juniper/sd/policy-management/' + api + '/object-conflicts?uuid='+currentPage.dataObject.uuid,
                    "type": 'get',
                    "headers" :{
                        "accept": 'application/vnd.juniper.sd.policy-import-management.object-conflicts+json;q=0.01;version=1'
                    },
                    "processData": false,
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Object Conflicts - Success");
                        var conflictsExits = data["object-conflicts"]["object-conflict"];
                        if(conflictsExits.length>0){
                                    currentPage.completed = false;
                                    currentPage.progressBar.destroy();
                                    wizardActivity.removeMask();
                                    currentPage.importConfigOCRGrid.reloadGrid();

                        }
                        else{
                        if(currentPage.page == "ocr"){

                            self.getGenerateSummaryReport(currentPage);
                        }
                        else{
                              currentPage.dataObject.readyForNext = true;
                              currentPage.progressBar.destroy();
                              currentPage.wizardView.wizard.nextPage();
                              wizardActivity.removeMask();
                            }
                        }
                        /*self.dataObject.readyForNext = true;
                        self.progressBar.destroy();
                        self.deviceILP.wizard.nextPage();*/
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                        currentPage.progressBar.destroy();
                        wizardActivity.removeMask();
                    }
                });


            },
             /**
             * gets the current summary to be show in the summary Page of the Wizard.
             *
             */
            getGenerateSummaryReport: function(currentPage){
                var self = this;
                self.unSubscribeNotification();
                self.subscribeNotifications(currentPage);
                $.ajax({
                    "url": '/api/juniper/sd/policy-management/' + api + '/generate-summary?uuid='+currentPage.dataObject.uuid,
                    "type": 'post',
                    "processData": false,
                    "beforeSend":function(){
                        currentPage.progressBar.setStatusText("Generating Summary Report");
                    },
                    "success": function( data, textStatus, jQxhr ) {
                        console.log('Reports generated.. normal request..');
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        /*console.log( errorThrown );
                        currentPage.progressBar.destroy();
                        wizardActivity.removeMask();*/
                    }
                });
            },
            /**
             * gets the current summary to be show in the summary Page of the Wizard.
             *
             */
            getSummaryInfo: function(currentPage){
                var self = this;
                $.ajax({
                    "url": '/api/juniper/sd/policy-management/' + api + '/summary?uuid='+currentPage.dataObject.uuid,
                    "type": 'get',
                    "headers" :{
                        'accept': 'application/vnd.juniper.sd.policy-import-management.summary-reports+json;version=1;q=0.01',
                    },
                    "processData": false,
                    "beforeSend":function(){
                        currentPage.progressBar.setStatusText("Generating Summary Report");
                    },
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Get Summary Report - Success - normal flow");
                        var summaries=[],dataSummaries = data["summary-reports"];
                        dataSummaries = dataSummaries["summary-report"];
                        if(dataSummaries){
                        for(i=0;i<dataSummaries.length;i++){
                            var summary = dataSummaries[i];
                            summaries.push({"label":summary["name"],"value":summary["report"]});
                        }
                        summaries.push({"label":"Report","value":"<span id='downloadSummary' style='cursor:pointer;color: #3366cc'>SummaryReport.zip</span>"});
                        currentPage.dataObject.ocrSummaries = summaries;
                        }
                        currentPage.completed = true;
                        currentPage.wizardView.wizard.gotoPage(2);
                        // update click handler on the download button
                        self.downloadButton = currentPage.wizardView.$el.find('#downloadSummary');
                        self.downloadButton.off('click').on('click',
                            $.proxy(self.onSummaryDownloadClick, self, currentPage.dataObject.uuid, currentPage.context));


                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        /*console.log( errorThrown );
                        currentPage.progressBar.destroy();
                        wizardActivity.removeMask();*/
                    }
                });
            },

            /**
             * On click of summary, a progress bar window will open up. It will show a download button on complete.
             * @param uuid
             */
            onSummaryDownloadClick: function (uuid, context) {
                var self = this;
                self.displayProgressBar(context);
                self.generateSummaryReport(uuid)
            },

            /**
             * Show progress bar while fetching the policies, can be reused when calculating diff
             * @param title
             * @param text
             * @param okButton
             * @param cancelButton
             */
            displayProgressBar: function (context) {
                var self = this;
                self.progressBar = new ProgressBar({
                    title: context.getMessage('import_download_summary_title'),
                    statusText: context.getMessage('import_download_summary_status_text'),
                    hasPercentRate: true,
                    // add buttons
                    buttons: [
                        {
                            "id": "close-download-summary-btn",
                            "name": "close-download-summary-btn",
                            "value": context.getMessage('ok')
                        }
                    ]
                });
                self.progressBarOverlay = new OverlayWidget({
                    view: self.progressBar,
                    type: 'small',
                    showScrollbar: false
                }).build();

                // add click event
                self.progressBar.$el.find('#close-download-summary-btn').click(function(event) {
                    event.preventDefault();
                    self.progressBarOverlay.destroy();
                });

                self.progressBar.$el.find('.slipstream-content-wrapper').append(
                    '<div style = "font-size:12px; padding-left:20px;">' +
                        'A download link will be available upon report generate completion.' +
                        '</div>')

            },

            /**
             * Handles notification on the download summary
             * @param uuid
             */

            generateSummaryReport: function (uuid) {
                var self = this, sseEventHandler, notificationSubscriptionConfig;
                if (sseEventSubscriptions) {
                    self.unSubscribeNotification();
                }

                // SET NOTIFICATION CONFIG
                notificationSubscriptionConfig = {
                    'uri': ['/api/juniper/sd/task-progress/$' + uuid],
                    'autoRefresh': true,
                    'callback': function () {
                        self.summaryReportHandler(uuid);
                    }
                };

                // set event handler
                sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
                sseEventSubscriptions = smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);

                // trigger genrating report
                $.ajax({
                    "url": '/api/juniper/sd/policy-management/' + api + '/generate-report?uuid=' + uuid,
                    "type": 'post',
                    "processData": false,
                    "success": function (data, textStatus, jQxhr) {
                        console.log(data);
                    },
                    "error": function (jqXhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                        self.progressBarOverlay.destroy();
                        self.unSubscribeNotification();
                    }
                });
            },

            /**
             * Get download link
             * @param displayText
             * @param uuid
             * @returns {string}
             */
            getDownloadHTMLText: function(displayText, uuid) {
                return "<a href='/api/juniper/sd/policy-management/import/download-summary?uuid=" + uuid +
                    "' download='SummaryReport.zip'>" + displayText +"</a>";
            },

            /**
             * Check for notification.
             * On 100% compltion of generating report, provide a download link. On click of download link, the report should be directly downloaded
             * @param uuid
             */
            summaryReportHandler: function (uuid) {
                var self = this;

                $.ajax({
                    "url": '/api/juniper/sd/task-progress/$' + uuid,
                    "type": 'get',
                    "headers": {
                        "accept": 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02'
                    },
                    "success": function (data, textStatus, jQxhr) {
                        var progress = 0, currentStep, uuid;
                        if (data['task-progress-response']) {

                            progress = data['task-progress-response']['percentage-complete'] / 100;
                            currentStep = data['task-progress-response']['current-step'];
                            if (progress >= 1) {
                                self.progressBar._progressBar.setStatusText(currentStep);
                                self.progressBar._progressBar.hideTimeRemaining();
                                self.progressBar._progressBar.setProgressBar(1);

                                self.unSubscribeNotification();
                                uuid = data['task-progress-response']['task-id'].substring(1);

                                self.progressBar.$el.find('.slipstream-content-wrapper').append(
                                        '<div style = "margin-top:10px;"><span style = "font-size:12px; padding-left:20px; padding-right:50px;">' +
                                        'Download</span>' + self.getDownloadHTMLText('SummaryReport.zip', uuid)) +'</div>';

                                // change the summary button as well
                                self.downloadButton.parent().html(
                                    self.getDownloadHTMLText('SummaryReport.zip', uuid)
                                );

                            }
                            else {
                                if (self.progressBar) {
                                    self.progressBar._progressBar.setStatusText(currentStep);
                                    self.progressBar._progressBar.setProgressBar(progress);
                                }
                            }
                        }
                        else {
                            self.progressBar._progressBar.setProgressBar(progress);
                        }

                    },
                    "error": function (jqXhr, textStatus, errorThrown) {
                        self.progressBarOverlay.destroy();
                        self.unSubscribeNotification();
                    }
                });
            }
        }
    };

 });
