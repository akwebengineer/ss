define(['backbone' ,
        'backbone.syphon',
        '../../../ui-common/js/views/apiResourceView.js',
        'widgets/form/formWidget', 
        'widgets/form/formValidator', 
        'widgets/overlay/overlayWidget',
        '../conf/reportsDefinitionFormConfig.js', 
        '../models/reportsModel.js',
        '../../../sd-common/js/common/widgets/recipients/models/recipientsModel.js',
        '../../../sd-common/js/common/widgets/recipients/recipientsWidget.js',
        '../conf/firewallPolicyGridConfig.js',
        '../service/reportsService.js',
        '../utils/reportConstants.js',
        '../../../sd-common/js/common/widgets/scheduler/schedulerWidget.js',
        '../../../sd-common/js/common/widgets/scheduler/models/schedulerModel.js'],
    function(Backbon, 
             Syphon,
             ResourceView,
             FormWidget, 
             FormValidator, 
             OverlayWidget, 
             FormConfigs, 
             ReportsModel,
             RecipientsModel,
             RecipientsWidget, 
             FirewallPolicyGridConfig, 
             ReportsService,
             ReportConstants,
             SchedulerWidget, 
             SchedulerModel){
    var BaseReportDefinitionCreateView = ResourceView.extend({
         events: {
             'click #add-schedule' : "showSchedulerOverlay",
             'click #edit-schedule' : 'showSchedulerOverlay',
             'click #delete-schedule' : 'deleteScheduler',
             'click #add-email' : "showRecipientsOverlay",
             'click #edit-email' : "showRecipientsOverlay",
             'click #delete-email' : "deleteRecipients",
             'click #cancel-report': "cancel",
             'click #save-report' : 'submit',
             'click #send-report' : 'sendReport',
             'click #preview-pdf' : 'previewAsPDF',
             'click #choose-filter' : 'showFiltersOverlay',
             'click #report-delete-section' : 'deleteSection',
             'change [id^=report_section_count]' : 'swapSections'
         },

        initialize:function(options){
            var me=this;
            ResourceView.prototype.initialize.call(me, options);
            me.successMessageKey = 'reports_def_create_success';
            me.editMessageKey = 'reports_def_edit_success';
            me.context = options.activity.getContext();
            me.recipientsModel = new RecipientsModel();
        },

        render: function(){
            var self = this,
                formConfiguration = new FormConfigs(this.context),
                formElements = formConfiguration.getReportFormConfig(this.context);

          //  self.addFormTitle(formElements, "Create Policy Analysis Report Definition");
            self.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            self.addDynamicFormConfig(formElements);
            self.form.build();

            self.$el.find('.report_create_content_section').empty();
            self.displayRecipientsDetails();
            self.displaySchedulerDetails();
            if(!self.$el.hasClass(self.context["ctx_name"])){
                self.$el.addClass(self.context["ctx_name"]);
            }

            return self;
        },
        
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            dynamicProperties['title-help'] = {
                "content" : dynamicProperties.title,
                "ua-help-text": this.context.getMessage("more_link")
            };
            if(ReportConstants.ReportTypes.POLICY_ANOMALY === this.model.get("report-content-type")){
                dynamicProperties['title-help']['ua-help-identifier'] = this.context.getHelpKey("REPORT_DEFINITION_POLICY_ANALYSIS_CREATING");
            }
            if(ReportConstants.ReportTypes.BANDWIDTH === this.model.get("report-content-type")){
               dynamicProperties['title-help']['ua-help-identifier'] = this.context.getHelpKey("REPORT_DEFINITON_BANDWIDTH_REPORT_CREATING");
            }
            if(ReportConstants.ReportTypes.LOG_BASED === this.model.get("report-content-type")){
               dynamicProperties['title-help']['ua-help-identifier'] = this.context.getHelpKey("REPORT_DEFINITION_CREATING");
            }

            switch (this.formMode) {
                case "CREATE":
                    if(ReportConstants.ReportTypes.POLICY_ANOMALY === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_create_policy_analysis");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_create_policy_analysis");
                    }
                    else if(ReportConstants.ReportTypes.BANDWIDTH === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_create_bandwidth_report");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_create_bandwidth_report");
                    }
                    else if(ReportConstants.ReportTypes.LOG_BASED === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_create_log_report");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_create_log_report");
                    }
                    break;

                case 'EDIT':
                    if(ReportConstants.ReportTypes.POLICY_ANOMALY === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_edit_policy_analysis");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_edit_policy_analysis");
                    }
                    else if(ReportConstants.ReportTypes.BANDWIDTH === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_edit_bandwidth_report");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_edit_bandwidth_report");
                    }
                    else if(ReportConstants.ReportTypes.LOG_BASED === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_edit_log_report");
                       dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_edit_log_report");
                    }
                    break;
                case 'CLONE':
                    if(ReportConstants.ReportTypes.POLICY_ANOMALY === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_clone_policy_analysis");
                    }
                    else if(ReportConstants.ReportTypes.BANDWIDTH === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_clone_bandwidth_report");
                    }
                    else if(ReportConstants.ReportTypes.LOG_BASED === this.model.get("report-content-type")){
                       dynamicProperties.title = this.context.getMessage("report_def_form_title_clone_log_report");
                    }
                    dynamicProperties['title-help']['content'] =  this.context.getMessage("report_def_form_title_tooltip_clone_report");
                    dynamicProperties['title-help']['ua-help-identifier'] = this.context.getHelpKey("REPORT_EDITING_CLONING");
                    break;
            }
             _.extend(formConfiguration, dynamicProperties);
        },

        submit: function(event) {
            event.preventDefault();
            var self = this, 
                jsonObj = {};

            // Check is form valid
            if (!self.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            //
            if(self.isValid()){
                this.getJsonReportObj(function(jsonObj){
                    if(jsonObj) {
                        self.bindModelEvents();
                        self.model.set(jsonObj);
                        self.model.save();
                    }
                });
            }
        },
        //
        isValid: function(){
            var me=this,
                isValid=true;
            properties  = Syphon.serialize(this);
            return isValid;
        },
        //
        getJsonReportObj: function(successCallBack) {
            var self = this,
                properties  = {},
                jsonDataObj = {},
                emailIds = "", subject = "",
                comments = "", scheduler;
            properties  = Syphon.serialize(this);
            if(self.recipientsModel.get('additional-emails')) {
                emailIds = self.recipientsModel.get('additional-emails');
                subject = self.recipientsModel.get('email-subject');
                comments = self.recipientsModel.get('comments');
            }
            jsonDataObj = {
                "report-content-type" : self.model.get("report-content-type"),
                "description": properties['description'],
                "name":  properties['name'],
                "email-subject": subject,
                "additional-emails": emailIds,
                "comments": comments
            };
            if(self.model.get('scheduler')) {
                scheduler = self.model.get('scheduler');
            }
            jsonDataObj.scheduler = scheduler;
            //
            successCallBack(jsonDataObj);
        },

        sendReport: function (event) {
            event.preventDefault();
            var self = this,
                service;

            // Check is form valid
            if (! self.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            //
            service = new ReportsService();
            this.getJsonReportObj(function(jsonDataObj){
                jsonDataObj = '{"report-template":' + JSON.stringify(jsonDataObj) + '}';
                onSuccess = function(response) {
                    var sendReportJobId = response.responseJSON['send-report-response'].value,
                        sendReportJobIdText = ' ' + sendReportJobId + '. ';
                    new Slipstream.SDK.Notification().setText(self.context.getMessage('reports_send_report_nofity_jobstatus')+sendReportJobIdText+self.context.getMessage('reports_send_report_nofity_sending')).setType('info').notify();
                };

                onError = function(){
                    console.log("reportsActivity::modSendReport() - Error");
                };

                service.fetchSendReportInfo(jsonDataObj, onSuccess);
            });
        },
    //
        previewAsPDF: function(event) {
            event.preventDefault();
            var self = this,
                service;

            if (! self.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            service = new ReportsService();
            this.getJsonReportObj(function(jsonDataObj){
                jsonDataObj = '{"report-template":' + JSON.stringify(jsonDataObj) + '}';
                onSuccessGetPDFfile = function(response) {
                    if (response.status == 200) { // Make sure API is making a file download.
                        location.href = "/api/juniper/seci/report-management/download-pdf?file-name=" + fileName;
                    }
                }
                onErrorGetPDFfile = function() {
                    console.log("reportsService::getPDFfile() - Error");
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("reports_preview_pdf_file_retreive_error")).setType('error').notify();
                }

                onSuccessGetPDFfileName = function(response) { // PDF file is created.
                    fileName = response.responseJSON['preview-report-response']['file-name'],
                    service.getPDFfile(fileName, onSuccessGetPDFfile, onErrorGetPDFfile);
                    clearInterval(pdfCreateTimer);
                    self.destroySpinner(spinner);
                };

                var pdfCreateTimer = setInterval(function(){
                    service.getPDFfileName(jsonDataObj, onSuccessGetPDFfileName);
                },3000); 

            });
        },

        cancel: function(event) {
            event.preventDefault();
            if(this.options.activity.overlayWidgetObj) {
                this.options.activity.overlayWidgetObj.destroy();
            } else {
                this.options.activity.overlay.destroy();
            }
        },

        showSchedulerOverlay: function(){
            var schedulerModel = new SchedulerModel({
                    "scheduler":{
                        "startTime": new Date()//initialize again at the time of invoke
                    }
                }),
                me = this, 
                title = "Add Report Schedule",
                reportsModel = me.model;
            //
            if(reportsModel.get("scheduler") && reportsModel.get("scheduler")["start-time"]){
                schedulerModel.set("scheduler", reportsModel.get("scheduler"));
                title = "Edit Report Schedule"
            };
            //
            schedulerWidget = new SchedulerWidget({
                "context": this.context,
                "model": schedulerModel,
            });
            //
            overlayWidgetObj = new OverlayWidget({
                title: title,
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
                me.displaySchedulerDetails();
            });
        },
        // Set the Scheduler details in the Report Definition form
        displaySchedulerDetails: function(){
            var me = this,
                schedulerModel = me.model.get("scheduler"), 
                jsonDataObj = {};
            jsonDataObj.scheduler = {};
            if(schedulerModel && schedulerModel["start-time"]){
                me.$el.find('#schedule-type').html('<label>' + schedulerModel["schedule-type"] +'</label>');
                me.$el.find('#re-occurence').html('<label>' + schedulerModel["re-occurence"] +'</label>');
                me.$el.find('#start-time').html('<label>' + me.getMilliseconds(schedulerModel["start-time"] )+'</label>');
                if(schedulerModel["end-time"] && schedulerModel["end-time"] !== 10445221800000) {
                    me.$el.find('#end-time').html('<label>' + me.getMilliseconds(schedulerModel["end-time"]) +'</label>');
                } else if(schedulerModel["end-time"] === 10445221800000){
                    me.$el.find('#end-time').html('<label>' + "Never"+'</label>');
                }else{
                    me.$el.find('#end-time').html('<label>' + "--"+'</label>');
                }
                me.$el.find('.date-of-month').hide();
                me.$el.find('.days-of-week').hide();

                if(schedulerModel["schedule-type"] === "Monthly"){
                    me.$el.find('#date-of-month').html('<label>' + schedulerModel["date-of-month"] +'</label>');
                    me.$el.find('.date-of-month').show();
                    me.$el.find('.days-of-week').hide();
                }
                if(schedulerModel["schedule-type"] === "Weekly"){
                    me.$el.find('#days-of-week').html('<label>' + schedulerModel["days-of-week"]["day-of-week"].toString() +'</label>');
                    me.$el.find('.days-of-week').show();
                    me.$el.find('.date-of-month').hide();
                }

                me.$el.find('#add-schedule').hide();
                me.$el.find('.schedule-type').show();
                me.$el.find('.re-occurence').show();
                me.$el.find('.start-time').show();
                me.$el.find('.end-time').show();
                me.$el.find('.editLink').show();
                me.$el.find('.deleteLink').show();
                jsonDataObj.scheduler = me.model.get('scheduler'); 
                
            }
            me.model.set(jsonDataObj);
        },
        //
        showRecipientsOverlay: function(){
            var me = this, conf;
            me.recipientsWidget = new RecipientsWidget({
                "context": me.context,
                "model": me.recipientsModel,
                onOverlay: true,
                activity: this
            });
            conf = {
                view: me.recipientsWidget,
                type: 'medium'
            };
            me.overlayWidgetObj = new OverlayWidget(conf);
            me.overlayWidgetObj.build();
        },
        //
        displayRecipientsDetails : function(additionalEmails, emailSubject, comments) {
            var me = this,
                additionalEmails = additionalEmails || me.model.get('additional-emails'),
                emailSubject = emailSubject || me.model.get('email-subject') || "",
                comments    = comments || me.model.get('comments') || "";
            //
            if(additionalEmails){
                me.$el.find('#additional-email-ids').html('<label>' + additionalEmails +'</label>');
                me.$el.find('#email-subject').html('<label>' + emailSubject +'</label>');
                me.$el.find('#comments').html('<label>' + comments +'</label>');

                me.recipientsModel.set('additional-emails', additionalEmails);
                me.recipientsModel.set('email-subject', emailSubject);
                me.recipientsModel.set('comments', comments);

                me.$el.find('#add-email').hide();
                me.$el.find('.emails').show();
                me.$el.find('.subject').show();
                me.$el.find('.comments').show();
                me.$el.find('.editEmailLink').show();
                me.$el.find('.deleteEmailLink').show();
            }
        },
        //
        deleteRecipients: function() {
            var me = this,
                recipientsWidget = new RecipientsWidget({
                    "context": me.context,
                    "model": me.recipientsModel,
                });

            me.recipientsModel.set('additional-emails', "");
            me.recipientsModel.set('email-subject', "");
            me.recipientsModel.set('comments', "");

            me.$el.find('#additional-email-ids').val("");
            me.$el.find('#email-subject').val("");
            me.$el.find('#comments').val("");

            me.$el.find('.emails').hide();
            me.$el.find('.subject').hide();
            me.$el.find('.comments').hide();
            me.$el.find('.editEmailLink').hide();
            me.$el.find('.deleteEmailLink').hide();
            me.$el.find('#add-email').show();
        },
        //
        deleteScheduler: function() {
            var me = this;

            me.model.set('scheduler', "")
            
            me.$el.find('.schedule-type').hide();
            me.$el.find('.re-occurence').hide();
            me.$el.find('.date-of-month').hide();
            me.$el.find('.days-of-week').hide();
            me.$el.find('.start-time').hide();
            me.$el.find('.end-time').hide();
            me.$el.find('.editLink').hide();
            me.$el.find('.deleteLink').hide();
            me.$el.find('#add-schedule').show();
        },
        //

        getMilliseconds: function(date) {
            var d = new Date(date);
            var ms = d.toString();
            return ms;
        }
    });
    return BaseReportDefinitionCreateView;
})