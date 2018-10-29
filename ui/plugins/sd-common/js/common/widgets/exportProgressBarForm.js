/**
 * A form with a progress bar for show export progress use
 *
 * @module exportProgressBarForm
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/progressBar/progressBarWidget',
    'text!../../templates/csvSampleLink.html',
    '../../../../ui-common/js/sse/smSSEEventSubscriber.js'
], function (Backbone, FormWidget, ProgressBarWidget, SampleLinkTemplate, SmSSEEventSubscriber) {
    var defaultConf = {
        title: '',
        statusText: '',
        inOverlay: true
    };

    var GET_JOB_STATUS_URL = '/api/space/job-management/jobs/';
    var JOB_ACCEPT = 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03';
    var JOB_EXPORT_URL = '/api/juniper/sd/job-management/jobs/export-jobs/';
    var JOB_EXPORT_ACCEPT = 'application/vnd.juniper.sd.export-job-response+json;version=1;q=0.01';
    var DOWNLOAD_URL = '/api/juniper/sd/file-management/download-file?file-name=';

    var ProgressBarForm = Backbone.View.extend({

        initialize: function(options) {
            this.conf = _.extend(defaultConf, options);
            this._progressBar = null;
            this.jobID = this.conf.jobID
            this.context = this.conf.parentView.context;
            this.view = this.conf.parentView;
            this.fileType = this.conf.fileType;
            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
        },

        events: {
            'click #progress-bar': "jumpToJobPage",
            'click #close-form-btn': "closeFormOverlay"
        },

        render: function() {
            var self = this;
            // Subscribe  for notification with respective JobID
            self.subscribeNotifications();

            var formElements = {
                    "title": this.conf.title,
                    "form_id": "progress-form",
                    "form_name": "progress-form",
                    "sections": [
                        {
                            "section_id": "progress-note",
                            "elements": [ {
                                            "element_description": true,
                                            "id": "progress-bar",
                                            "name": "progress-bar"
                                         },
                                         {
                                             "element_description": true,
                                             "id": "progress-note-1",
                                             "name": "progress-note-1",
                                             "value":  this.context.getMessage('export_note_1')
                                         },
                                         {
                                             "element_description": true,
                                             "id": "progress-note-2",
                                             "id": "progress-note-2",
                                             "value":  this.context.getMessage('export_note_2')
                                         },
                                         {
                                             "element_description": true,
                                             "id": "address-import-sample",
                                             "name": "address-import-sample",
                                             "label":  this.context.getMessage('download')
                                         }]
                        }
                    ],
                    "on_overlay": true,
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "buttons": [
                        {
                            "id": "close-form-btn",
                            "name": "close-form-btn",
                            "value": this.context.getMessage('ok')
                        }
                    ]
            };

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();

            this.conf.container = this.$el.find("#progress-bar");
            this._progressBar = new ProgressBarWidget(this.conf).build();

            this.$el.addClass("security-management");
            this.$el.find("#progress-bar").parent().addClass("element-left");
            this.$el.find("#progress-note-1").parent().addClass("elementinput-long-left");
            this.$el.find("#progress-note-2").parent().addClass("elementinput-long-left");
            this.$el.find("#address-import-sample").parent().prev().addClass("element-left-label");
            this.$el.find("#address-import-sample").parent().addClass("element-left-input");
            this.$el.find("#address-import-sample").parent().prev().hide();

            return this;
        },

         /**
         * [subscribeNotifications]
         * @return {SmSSEEventSubscriber obj} [ will subscribe for notifcation with job id] 
         * triggers the getJobStatus as notication call back
         */
        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this, sseEventHandler, notificationSubscriptionConfig = {
                'uri' : [GET_JOB_STATUS_URL+ self.jobID ],
                'autoRefresh' : true,
                'callback' : function () {
                   self.getJobStatus();
                }
            };
                
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },

        /**
         * [unSubscribeNotification]
         */
         unSubscribeNotification: function(){
            // unsubscribe Notification for job details
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
        },

        getJobStatus : function() {
             var self = this;
             $.ajax({
                    type: 'GET',
                    url: GET_JOB_STATUS_URL + self.jobID,
                    headers: {
                        "Accept": JOB_ACCEPT
                    },
                    enctype: 'multipart/form-data',
                    processData: false,
                    contentType: false,
                    success: function(data, textStatus) {
                        var progress = data['job']['percent-complete']/100;

                        if (progress == 1.0){
                            self._progressBar.setStatusText(self.context.getMessage("export_job_finished", [self.jobID]));

                            self.addDownloadLink();
                        }

                        self._progressBar.setProgressBar(progress);

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("fail to get job status");
                        self.form.showFormError(self.context.getMessage('export_get_job_status_fail'));
                    }
             });
        },

        // Get download filename, and add download link
        addDownloadLink: function() {

            var self = this;

            $.ajax({
                type: 'GET',
                url: JOB_EXPORT_URL + self.jobID,
                headers: {
                    "Accept": JOB_EXPORT_ACCEPT
                },
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function(data, textStatus) {
                        var filename = data["export-job-response"]["file-name"];

                        // Add download link
                        var templateData = {
                              id: 'address-export-sample',
                              url: DOWNLOAD_URL + filename,
                              content: self.fileType
                        };
                        self.$el.find('#address-import-sample').html(Slipstream.SDK.Renderer.render(SampleLinkTemplate, templateData));
                        self.$el.find("#address-import-sample").parent().prev().show();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("fail to download file");
                    self.form.showFormError(self.context.getMessage('export_csv_download_fail'));
                }
            });
        },

        // To support to jump to Job landing page, when the code of job management is finished, it can work.
        jumpToJobPage: function(event) {
            var jobId = this.jobID;
            console.log(jobId);
            if(jobId){
                // Launch JOB management activity for associated job
                var intent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
                    mime_type: 'vnd.net.juniper.space.job-management.jobs'
                });
                var data = {
                    filter: {
                        'jobid': jobId
                    }
                };
                intent.putExtras({data: data});
                Slipstream.vent.trigger("activity:start", intent);
            }
        },

        closeFormOverlay: function(event) {
            event.preventDefault();
            this.view.progressBarOverlay.destroy();
            this.unSubscribeNotification();
        },

        setStatusText: function(text) {
            if (this._progressBar) {
                this._progressBar.setStatusText(text);
            }
        },

        destroy: function() {
            if (this._progressBar) {
                this._progressBar.destroy();
            }
        }
    });

    return ProgressBarForm;
});
