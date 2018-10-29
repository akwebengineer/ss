/**
* ReportsActivity displays main reports grid and registers all user-events.
*
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../ui-common/js/gridActivity.js',
    './conf/reportsGridConfig.js',
    './models/logoModel.js',
    '../../sd-common/js/common/widgets/recipients/models/recipientsModel.js',
    './utils/reportsManager.js',
    './conf/uploadLogoFormConfig.js',
    'widgets/form/formWidget',
    '../../sd-common/js/common/widgets/recipients/recipientsWidget.js',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/spinnerWidget',
    '../../sd-common/js/common/widgets/scheduler/schedulerWidget.js',
    '../../sd-common/js/common/widgets/scheduler/models/schedulerModel.js',
    './service/reportsService.js',
    './views/policyAnalysisReportView.js',
    './views/logReportView.js',
    './models/reportsModel.js',
    './models/reportsCollection.js',
    '../../ui-common/js/models/cloneable.js',
    './utils/reportConstants.js',
    './views/bandWidthReportView.js',
    '../../ui-common/js/common/utils/SmNotificationUtil.js',
    '../../ui-common/js/common/utils/SmProgressBar.js',
    './views/downloadReportView.js',
    './utils/reportUtilMixin.js',
    './views/runReportView.js'
], function(GridActivity, ReportsGridConfig, LogoModel, RecipientsModel, ReportsManager, UploadLogoFormConfig, FormWidget, RecipientsWidget,
            OverlayWidget, SpinnerWidget, SchedulerWidget, SchedulerModel, ReportsService, PolicyAnalysisReportView, LogReportView,
            ReportsModel, ReportsCollection, Cloneable, ReportConstants, BandWidthReportView,SmNotificationUtil, SmProgressBar,DownloadReportView,
            ReportsUtilMixIn, RunReportView) {
    /**
    * Constructs an ReportsActivity.
    */

    var ReportsGridActivity = function() {
        this.capabilities = {
            "create": {
                rbacCapabilities: ["createReports"]
            },
            "edit": {
                rbacCapabilities: ["modifyReports"]
            },
            "clone": {
                rbacCapabilities: ["createReports"]
            },
            "delete": {
                rbacCapabilities: ["deleteReports"]
            },
            "select": {}
        };
        this.gridConf = ReportsGridConfig;
        this.model = ReportsModel;
        this.collection = new ReportsCollection();
        this.reportsManager = new ReportsManager();
        var service = new ReportsService(),
        smNotificationUtil = new SmNotificationUtil();


        this.getProgressUpdate = function() {
            var self = this, formTitleObj, onSuccessGetPDFfileName = function() {}, onError = function() {};
            onProgressUpdateSucsess = function(data, status){
                var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        self.progressBarOverlay.setStatusText(data['task-progress-response']['current-step']);
                        self.progressBarOverlay.setProgressBar((data['task-progress-response']['percentage-complete'])/100);
                        if(progress >= 1)
                        {
                            self.progressBarOverlay.destroy();
                            if(self.runReportView && self.runReportNow) {
                                onSuccessGetPDFfileName = function(response){
                                   var href = "/api/juniper/seci/report-management/download-pdf?file-name=" + self.fileName;
                                   self.runReportView.$el.find("#download-pdf").html("<a download href=" + href + ">"+self.context.getMessage('download_pdf_report_link')+"</a>");
                                   self.runReportNow = false;
                                }
                            } else if(!self.runReportNow) {
                                onSuccessGetPDFfileName = function(response){
                                var href = "/api/juniper/seci/report-management/download-pdf?file-name=" + self.fileName,
                                downloadReportView = new DownloadReportView (
                                {  "activity": self,
                                    "context": self.context,
                                    "filePath" : href
                                });

                                conf = {
                                    view: downloadReportView,
                                    cancelButton: false,
                                    okButton: false,
                                    type: 'small'
                                };

                                 self.downloadPDFWidget = new OverlayWidget(conf);
                                 self.downloadPDFWidget.build();
                                }
                            }

                            onError = function(){console.log("reportsService::getPDFfile() - Error");};
                            service.getPDFfile(self.fileName, onSuccessGetPDFfileName, onError);
                            smNotificationUtil.unSubscribeNotifications();                           
                        }

                    }
            };
            onProgressUpdateError = function(){
                console.log("Id retrieval failed");
            };
            smNotificationUtil.getTaskProgressUpdate(("$"+ self.screenID), onProgressUpdateSucsess, onProgressUpdateError )
        },

        /**
        * @overridden from gridActivity.
        * Bind the publish event to the grid context menu.
        */
        this.bindEvents = function() {
            GridActivity.prototype.bindEvents.call(this);

            this.events.runReportsEvent = {
                capabilities : ['modifyReports'],
                name: "runReportsEvent"
            };
            this.events.previewPDFEvent = {
                capabilities : ['modifyReports'],
                name: "previewPDFEvent"
            }
            this.events.sendReportEvent = {
                capabilities : ['modifyReports'],
                name: "sendReportEvent"
            }
            this.events.editScheduleEvent = "editScheduleEvent";
            this.events.editRecipientsEvent = "editRecipientsEvent";
            //this.events.uploadLogoEvent = "uploadLogoEvent";
            this.events.policyAnalysisReport = {
                capabilities : ['createReports'],
                name: "policyAnalysisReport"
            };
            this.events.logReportDefinition = {
                capabilities : ['createReports'],
                name: "logReportDefinition"
            };
            this.events.bandwidthReportDef = {
                capabilities : ['createReports'],
                name: "bandWidthReportDefinition"
            };

            this.view.$el.bind(this.events.runReportsEvent.name, $.proxy(this.modRunReport, this));
            this.view.$el.bind(this.events.previewPDFEvent.name, $.proxy(this.modPreviewPDF, this));
            this.view.$el.bind(this.events.sendReportEvent.name, $.proxy(this.modSendReport, this));
            this.view.$el.bind(this.events.editScheduleEvent, $.proxy(this.modEditSchedule, this));
            this.view.$el.bind(this.events.editRecipientsEvent, $.proxy(this.modEditRecipients, this));
            this.view.$el.bind(this.events.uploadLogoEvent, $.proxy(this.uploadLogo, this));
            this.view.$el.bind(this.events.policyAnalysisReport.name, $.proxy(this.policyAnalysisReport, this));
            this.view.$el.bind(this.events.logReportDefinition.name, $.proxy(this.logReportDefinition, this));
            this.view.$el.bind(this.events.bandwidthReportDef.name, $.proxy(this.bandWidthReportDefinition, this));
        };

        /**
        * This function handles 'Edit Recipients' user-event.
        * Get id of selcted row (user can select only one) and set fields of Recipients Model.
        * Then invoke Recipients Widget having set form fields on a overlay having form action buttons.
        * Form events are handled here, updated values from 'Recipients Model' is fetched and saved to 'Reports Model'.
        */
        this.editRecipients = function(reportId, editRecSuccess) {
            var me = this;

            onFetch = function(model) {
                var recipientsModel = new RecipientsModel(),
                    reportsModel = model,
                    overlayWidgetObj;

                recipientsModel.set("additional-emails", reportsModel.get("additional-emails"));
                recipientsModel.set("email-subject", reportsModel.get("email-subject"));
                recipientsModel.set("comments", reportsModel.get("comments"));

                recipientsWidget = new RecipientsWidget({
                    "context": me.context, //Required to create RecipientsWidget.
                    "model": recipientsModel,
                });

                conf = {
                    view: recipientsWidget,
                    cancelButton: true,
                    okButton: true,
                    type: 'medium'
                };
                overlayWidgetObj = new OverlayWidget(conf);
                overlayWidgetObj.build();

                overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(e) {
                    e.preventDefault();
                    if(!recipientsWidget.formWidget.isValidInput()) {
                        return false;
                    }

                    var recipientsModel = recipientsWidget.getValues();
                    reportsModel.set('additional-emails', recipientsModel.get('additional-emails'));
                    reportsModel.set('email-subject', recipientsModel.get('email-subject'));
                    reportsModel.set('comments', recipientsModel.get('comments'));
                    reportsModel.save({},{ // Don't simply rely on plain model.save()
                        complete: function (response) {
                            overlayWidgetObj.destroy();
                            if (typeof editRecSuccess !== 'undefined') { editRecSuccess(); }
                        }
                    });
                    return this;
                })
            };

            onError = function() {
                console.log("reportsActivity::modSendReport() - Error");
            };

            me.reportsManager.getReportDefinition(reportId, onFetch, onError);
        };
        //
        this.modRunReport = function() {
            console.log("Run Reports functionality");
            var me = this,
                reportId    = me.view.gridWidget.getSelectedRows()[0].id;
            me.onRunReport(reportId);
        };

        this.onRunReport = function(reportId) {
            var me = this,
                reportsModel,
                onSuccessRunReport,
                onErrorRunReport,
                service = new ReportsService();
                console.log('Run Report view rendered');

            onSuccessRunReport = function(model) {
                me.runReportView = new RunReportView({
                    context:me.context,
                    activity: me
                });

                var reportsModel = model,
                    uri = [],
                    conf = {
                        view: me.runReportView,
                        cancelButton: false,
                        okButton: false,
                        type: 'small'
                    };

                runReportOverlayWidget = new OverlayWidget(conf);
                runReportOverlayWidget.build();
                me.runReportNow = true;

                me.screenID = Math.floor(Math.random() * 1000);
                uri = ['/api/juniper/sd/task-progress/'+"$"+me.screenID];
                $.proxy(smNotificationUtil.subscribeNotifications,me)(uri, me.getProgressUpdate);

                runReportOverlayWidget.getOverlay().$el.find('#cancel_run_report').on('click', function(e) {
                    e.preventDefault();
                    me.runReportView = null;
                    runReportOverlayWidget.destroy();
                });

                onSuccessGetPDFfileName = function(response) { // PDF file is created.
                    me.fileName = response.responseJSON['preview-report-response']['file-name'];
                    me.runReport = true;
                };

                reportsModel.set("job-id", me.screenID);
                reportsModelJson    = '{"report-template":' + JSON.stringify(reportsModel.attributes) + '}';
                reportsModelJsonObj = JSON.parse(reportsModelJson);
                reportsModelJson    = JSON.stringify(reportsModelJsonObj);
                var progressBarOverlayContainer = runReportOverlayWidget.getOverlay().$el.find('#download-pdf');

                me.progressBarOverlay =  new SmProgressBar({
                    "container": progressBarOverlayContainer,
                    "hasPercentRate": true,
                    "handleMask": true,
                    "isSpinner": false,
                    "statusText": me.context.getMessage('preview_pdf_status_text')
                });

                me.progressBarOverlay.build();
                service.runReportNow(reportsModelJson, onSuccessGetPDFfileName);
            };

            onErrorRunReport = function() {
                console.log('reportsActivity::onRunReport() - Error');
            };

            me.reportsManager.getReportDefinition(reportId, onSuccessRunReport, onErrorRunReport);
        };
        //

        this.modEditRecipients = function() {
            var me = this,
                reportId = me.view.gridWidget.getSelectedRows()[0].id,
                onSuccess = function() {
                    new Slipstream.SDK.Notification().setText(me.getContext().getMessage('form_recipients_success_msg')).setType('info').notify();
                };
            me.editRecipients(reportId, onSuccess);
        };

        this.modSendReport = function() {
            var me = this,
                reportId = me.view.gridWidget.getSelectedRows()[0].id,
                additionalEmails = me.view.gridWidget.getSelectedRows()[0]["additional-emails"] || "",
                handleEditReci,
                onSuccess,
                onError;

            onSuccess = function(response) {
                var sendReportJobId = response.responseJSON['send-report-response'].value,
                    sendReportJobIdText = ' ' + sendReportJobId + '. ';
                new Slipstream.SDK.Notification().setText(me.getContext().getMessage('reports_send_report_nofity_jobstatus')+sendReportJobIdText+me.getContext().getMessage('reports_send_report_nofity_sending')).setType('info').notify();
            };

            onError = function(){
                console.log("reportsActivity::modSendReport() - Error");
            };

            handleEditReci = function(){
                me.editRecipients(reportId, function(){
                    me.reportsManager.sendReport(reportId, null, onSuccess, onError);
                });
            };
            //
            if(additionalEmails.length > 0){
                me.reportsManager.sendReport(reportId, null, onSuccess, onError);    
            }else{
                me.reportsManager.sendReport(reportId, handleEditReci, onSuccess, onError);    
            }
            
        };

        this.modEditSchedule = function() {
            var me = this;
            me.onEditSchedule(me.view.gridWidget.getSelectedRows()[0].id);
        };

        this.onEditSchedule = function(reportId) {
            var me = this, reportsModel;

            onSuccessGetReportDef = function(model) {
                var schedulerModel = new SchedulerModel(), reportsModel = model;
                schedulerModel.set("scheduler", reportsModel.get("scheduler"));

                schedulerWidget = new SchedulerWidget({
                    "context": me.context,
                    "model": schedulerModel,
                });
                overlayWidgetObj = new OverlayWidget({
                    title:"Edit Report Schedule",
                    view: schedulerWidget,
                    cancelButton: true,
                    okButton: true,
                    type: "medium"
                }).build();

                overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(e) {
                    e.preventDefault();
                    if(schedulerWidget.isValid() === false) {
                        return false;
                    }
                    schedulerWidget.getValues();
                    reportsModel.set("scheduler", schedulerModel.get("scheduler"));
                    reportsModel.save({},{
                        success: function(response) {
                            new Slipstream.SDK.Notification().setText('Schedule is updated successfully.').setType('success').notify();
                        },
                        error: function(response) {
                            console.log('reportsActivity::onEditSchedule() - Error');
                        }
                    });
                });
            };

            onErrorGetReportDef = function() {
                console.log('reportsActivity::utils/reportsManager/getReportDefinition() - Error');
            };

            me.reportsManager.getReportDefinition(reportId, onSuccessGetReportDef, onErrorGetReportDef);
        };
        this.modPreviewPDF = function() {
            var me = this;
            me.onPreviewPDF(me.view.gridWidget.getSelectedRows()[0].id);
        };

        this.onPreviewPDF = function(reportId) {
            var me = this,
                reportsModel,
                onSuccessGetReportDef, onSuccessGetPDFfileName,
                onErrorGetReportDef,
                service = new ReportsService();
                
            var uri = [];
                me.screenID = Math.floor(Math.random() * 1000);
                uri = ['/api/juniper/sd/task-progress/'+"$"+me.screenID];
                $.proxy(smNotificationUtil.subscribeNotifications,me)(uri, me.getProgressUpdate);
                
                onSuccessGetPDFfileName = function(response) { // PDF file is created.
                    me.fileName = response.responseJSON['preview-report-response']['file-name'];
                };

                onSuccessGetReportDef = function(model) {
                    reportsModel = model,
                    filterStr= {}; 
                    reportsModel.set("job-id", me.screenID);

                    reportsModelJson = '{"report-template":' + JSON.stringify(reportsModel.attributes) + '}';
                    reportsModelJsonObj = JSON.parse(reportsModelJson);
                    reportsModelJson = JSON.stringify(reportsModelJsonObj);

                    me.progressBarOverlay =  new SmProgressBar({
                         "container": me.view.$el,
                         "hasPercentRate": true,
                         "handleMask": true,
                         "isSpinner": false,
                         "statusText": me.getContext().getMessage('preview_pdf_status_text')
                    });
                    me.progressBarOverlay.build();                   
                    service.getPDFfileName(reportsModelJson, onSuccessGetPDFfileName);
                };
                onErrorGetReportDef = function() {
                    console.log('reportsActivity::getReportDefinition() - Error');
                };

                me.reportsManager.getReportDefinition(reportId, onSuccessGetReportDef, onErrorGetReportDef);
        };

        this.setButtonStatus = function(selectedRows, updateStatusSuccess, updateStatusError){
            selectedRows = selectedRows.selectedRows;
            updateStatusSuccess({
                "runReportsEvent": this.isEnableRunReport(selectedRows)
            });
        };

        this.uploadLogo = function() {
            var me = this,
                fileUser, fileReader, fileName, properties, inputFile, formData,
                onSuccessGetLogoImgFile = function(response) {
                    if(response.status == 200) {
                        uploadLogoView.$el.find('#logoImgContainer label').html('<img id="logoImg" src="/api/juniper/seci/report-management/download-logo?file-name=' + fileName + '"/>');
                    }
                },
                onErrorGetLogoImgFile = function() {
                    console.log("reportsService::getLogoImgFile() - Error");
                    new Slipstream.SDK.Notification().setText(me.getContext().getMessage('reports_upload_logo_file_retrieve_error')).setType('info').notify();
                    overlayWidgetObj.getOverlay().$el.find('#cancel').trigger('click');
                },
                onSuccessgetLogoFileName = function(response) {
                    fileName = response.responseJSON['report-logo'].fileName;
                    service.getLogoImgFile(fileName, onSuccessGetLogoImgFile, onErrorGetLogoImgFile);
                },
                onSuccessLogoUpload = function(response) {
                    new Slipstream.SDK.Notification().setText(me.getContext().getMessage('reports_upload_logo_file_save_success')).setType('info').notify();
                },
                uploadLogoView = new Backbone.View(),
                logoModel = new LogoModel(),
                service = new ReportsService();

            overlayWidgetObj = new OverlayWidget({
                view: uploadLogoView,
                cancelButton: true,
                okButton: true,
                type: 'small'
            }).build();

            logoModel.fetch({ // Don't simply rely on plain model.get()
                complete: function (response) {
                   onSuccessgetLogoFileName(response);
                }
            });

            uploadLogoFormConfig = new UploadLogoFormConfig(me.context);
            formWidget = new FormWidget({
                container: uploadLogoView.el,
                elements: uploadLogoFormConfig.getValues(),
                model: logoModel,
                values: logoModel.attributes
            }).build();

            uploadLogoView.$el.find("#logo_form").on('change', function(e){
                e.preventDefault();
                fileReader = new FileReader();
                fileReader.onload = function (e) {
                    uploadLogoView.$el.find('#logoImg').attr('src', e.target.result);
                }

                fileUser = uploadLogoView.$el.find("#logo_form").find(".fileupload")[0].files[0];
                fileReader.readAsDataURL(fileUser);
            });

            overlayWidgetObj.getOverlay().$el.find('#cancel').on('click', function(e) {
                e.preventDefault();
                overlayWidgetObj.destroy();
            });

            overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(e) {
                e.preventDefault();

                properties = Syphon.serialize(uploadLogoView);
                logoModel.set("logoName", 'defaultLogo');
                logoModel.set("fileName", properties['fileName']);

                inputFile = uploadLogoView.$el.find("#logo_form").find(".fileupload")[0];
                formData = new FormData();
                formData.append("file", inputFile.files[0]);

                service.logoUpload(formData, onSuccessLogoUpload);
            });
        };

        // Create Policy Analysis Report Definition
        this.policyAnalysisReport = function() {
            var me=this;
            me.createReportDef(ReportConstants.ReportTypes.POLICY_ANOMALY);
        };
        //
        this.createReportDef = function(reportType){
            var me=this,
                model = new me.model(),
                intent = me.createNewIntent(me.getIntent(), Slipstream.SDK.Intent.action.ACTION_CREATE);
            //set the model
            model.set("report-content-type", reportType);
            //
            if(reportType === ReportConstants.ReportTypes.LOG_BASED){
                view = LogReportView;
            } else if(reportType === ReportConstants.ReportTypes.POLICY_ANOMALY){
                view = PolicyAnalysisReportView;
            } else if(reportType === ReportConstants.ReportTypes.BANDWIDTH){
                view = BandWidthReportView;
            }
            //            
            intent.putExtras({
                model: model,
                view: view
            });
            // Start activity using the CREATE action and then add the result to the grid
            this.getContext().startActivityForResult(intent);
        };
        this.editReportDef = function(row, isClone){
            var me = this,
                intent = me.createNewIntent(me.getIntent(), isClone ? Slipstream.SDK.Intent.action.ACTION_CLONE : Slipstream.SDK.Intent.action.ACTION_EDIT),
                reportType = isClone ? row.selectedRows[0]['report-content-type'] : row.originalRow['report-content-type'],
                view,
                id = isClone ? row.selectedRows[0]["id"] : row.originalRow.id;
            //
            if(reportType === ReportConstants.ReportTypes.LOG_BASED){
                view = LogReportView;
            } else if(reportType === ReportConstants.ReportTypes.POLICY_ANOMALY){
                view = PolicyAnalysisReportView;
            } else if(reportType === ReportConstants.ReportTypes.BANDWIDTH){
                view = BandWidthReportView;
            }
            //
            intent.putExtras({
                id: id,
                view: view
            });
            //
            me.getContext().startActivityForResult(intent);
        };
        //Create Band Width Report Definition
        this.bandWidthReportDefinition = function() {
            var me=this;
            me.createReportDef(ReportConstants.ReportTypes.BANDWIDTH);
        };
        // Create Log Report Definition
        this.logReportDefinition = function() {
            var me=this;
            me.createReportDef(ReportConstants.ReportTypes.LOG_BASED);
        };
        /**
         * Called when edit is clicked
         */
        this.onEditEvent = function(e, row) {
            var me=this;
            me.editReportDef(row);
        };
        /**
         * Getting called when Clone is clicked
         */
        this.onCloneEvent = function(e, row) {
            var me=this;
            me.editReportDef(row, true);
        };
        //
    }

    ReportsGridActivity.prototype = new GridActivity();
    _.extend(ReportsGridActivity.prototype, ReportsUtilMixIn);
    return ReportsGridActivity;
});