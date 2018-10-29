/**
 * View to create a version
 * 
 * @module SnapshotVersionView
 * @author dkumara@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/createSnapshotConfiguration.js',
    '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function(Backbone, FormWidget, OverlayWidget, progressBarForm, FormConfiguration, SmSSEEventSubscriber,ValidationUtility, ConfirmationDialogWidget) {

    var SnapshotVersionView = Backbone.View.extend({
        events: {
            'click #snappolicy-save': "submit",
            'click #snappolicy-cancel': "cancel"
        },

        submit: function(event) {

            event.preventDefault();
            if (! this.form.isValidInput()) {
                return;
            }
            var self = this;
            self.smSSEEventSubscriber = new SmSSEEventSubscriber();
            self.subscribeNotifications();
            var commentVal = self.$el.find('#snappolicy-comment').val();

            var dataObj;
            dataObj = {
                "create-snapshot-request": {
                    "comments": commentVal,
                    "browser-id": "",
                    "screen-id": self.screenId,
                    "total-services": "5",
                    "tag-comments": "No-Comments",
                    "job-instance-id": "",
                    "task-percentage-completed": "100",
                    "total-services-completed": "5",
                    "delete-oldest": self.deleteoldest
                }
            };

            this.showProgressBar();
            $.ajax({
                url: self.policyManagementConstants.getManageVersionURLRoot(this.params.id),
                headers: {
                    Accept: self.policyManagementConstants.SNAPSHOT_CREATE_ACCEPT_HEADER
                },
                type: "POST",
                data: JSON.stringify(dataObj),
                contentType: self.policyManagementConstants.POLICY_CREATE_SNAPSHOT_CONTENT_HEADER,
                success: function(data, textStatus) {
                    self.notify('success', self.context.getMessage('snapshot_create_success'));

                    // if the notificationflag is already set to 1 by the progress bar, then skip below calls
                    if (self.notificationFlag !== 1) {
                        self.notificationFlag = 1;
                        self.gridWidget.reloadGrid();
                        self.progressBarOverlay.destroy();
                        self.unSubscribeNotifications();

                        // handling destroy of overlay only if required.
                        // Avoiding multiple destroy calls
                        self.activity.overlay.destroy();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    self.progressBarOverlay.destroy();
                    self.unSubscribeNotifications();
                    if (XMLHttpRequest.responseText.indexOf("DuplicateSnapshotException")>-1) {
                        self.activity.overlay.destroy();
                        self.showDeleteErrDialog(self.context.getMessage("snapshot_policy"), self.context.getMessage("snapshot_duplicate_error"));   
                    } else if (XMLHttpRequest.responseText.indexOf("MaxVersionCountException")>-1) {
                        self.showOldVersionDeleteConfirm();
                    } else {

                        self.activity.overlay.destroy();
                        self.showDeleteErrDialog(self.context.getMessage("snapshot_delete_error_title"), self.context.getMessage("snapshot_create_error"));
                    }
                }
            }).done(function(data) {
                self.activity.finish();

                if(self.snapshotCreateCallback){
                    self.snapshotCreateCallback();
                }
            });
        },

        notify: function(type, message) {
          new Slipstream.SDK.Notification()
              .setText(message)
              .setType(type)
              .notify();
        },

        showOldVersionDeleteConfirm : function() {
          var self=this;
          var conf = {
              title: self.context.getMessage("max_limit_title"),
              question: self.context.getMessage("snapshot_oldest_delete_confirmation"),
              yesButtonLabel: 'Yes',
              noButtonLabel: 'No',
              yesButtonTrigger: 'yesEventTriggered',
              noButtonTrigger: 'noEventTriggered',
              kind: 'warning'
          };

          self.confirmationDialogWidget = new ConfirmationDialogWidget(conf);
          self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
              self.closeConfirmationWidget();
              self.deleteoldest = true;
              self.$el.find('#snappolicy-save').trigger("click");
                            
          });

          self.confirmationDialogWidget.vent.on('noEventTriggered', function() {
            self.closeConfirmationWidget();
            self.activity.finish();
            self.activity.overlay.destroy();
          });

          self.confirmationDialogWidget.build();
        },

        showDeleteErrDialog : function(title,errMsg) {
            var self = this;
            var conf = {
                title: title,
                question: errMsg,
                okEvent: function() {
                    self.deleteErrDialogWidget.destroy();
                }
            };
            self.deleteErrDialogWidget = new ConfirmationDialogWidget({
                title: conf.title,
                question: conf.question,
                yesButtonLabel: self.context.getMessage('ok'),
                yesButtonTrigger: 'okEventTriggered',
                xIcon: false
            });
            self.deleteErrDialogWidget.vent.on('okEventTriggered', function() {
                if (conf.okEvent) {
                    conf.okEvent();
                }
            });

            self.deleteErrDialogWidget.build();
        },


        closeConfirmationWidget : function(){
          var self=this;
          if(self.confirmationDialogWidget) {
            self.confirmationDialogWidget.destroy();
            self.confirmationDialogWidget = undefined;
          } 
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            _.extend(this, ValidationUtility);
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.params = options.params;
            this.policyManagementConstants = this.params.policyManagementConstants;
            this.gridWidget = options.gridWidget;
            this.deleteoldest = options.deleteOldestSnapshot;
            this.smSSEEventSubscriber = null;
            this.sseEventSubscriptions = null;
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            this.snapshotCreateCallback = options.snapshotCreateCallback;
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConfiguration(this.context, self.params);
            var formElements = formConfiguration.getValues();
            this.form = new FormWidget({
                container: this.el,
                elements: formConfiguration.getValues()
            });
            this.form.build();
            this.addSubsidiaryFunctions(formElements);
            this.$el.find("#snappolicy-name").html('<label>' + this.handleParse(this.params.selectedRow.name) + '</label>');

            return this;
        },

        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this;
            var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;
            var sseEventHandler, notificationSubscriptionConfig = {
                'uri' : [ self.policyManagementConstants.TASK_PROGRESS_URL + screenID ],
                'autoRefresh' : true,
                'callback' : function () {
                    self.getProgressUpdate();
                }
            };
                
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },

        close : function(){
          this.unSubscribeNotifications();
        },

        unSubscribeNotifications: function(){
          if(this.smSSEEventSubscriber && this.sseEventSubscriptions) {
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
            this.smSSEEventSubscriber = null;
            this.sseEventSubscriptions = null;
          }
        },

        handleParse : function(str){
            var self = this;
            var finalStr = self.reverseString(str);
            finalStr = finalStr.split("<");
            finalStr = finalStr[1];
            finalStr = finalStr.split(">");
            finalStr = finalStr[0];
            finalStr = self.reverseString(finalStr);
            return finalStr;
        },

        reverseString : function(s){
            var o = '';
            for (var i = s.length - 1; i >= 0; i--)
                  o += s[i];
                 return o;
        },

        getProgressUpdate : function() {
             var self = this;    
             var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;        
             $.ajax({
                url: self.policyManagementConstants.TASK_PROGRESS_URL + screenID,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': self.policyManagementConstants.TASK_PROGRESS_ACCEPT
                },               
                success: function(data, status) {  
                    var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        if(progress >= 1 && self.notificationFlag === 0)
                        {
                            self.notificationFlag = 1;
                            self.progressBar._progressBar.setStatusText('Complete');
                            self.progressBar._progressBar.hideTimeRemaining();
                            self.progressBarOverlay.destroy();
                            self.unSubscribeNotifications();
                            self.gridWidget.reloadGrid();

                            self.activity.finish();
                            self.activity.overlay.destroy();
                        }
                        else if(progress<=1){
                            if(self.progressBar) {
                                self.progressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                                self.progressBar._progressBar.setProgressBar(progress);  
                            }    
                        }    
                    } 
                    else 
                        self.progressBar._progressBar.setProgressBar(progress);          
                },
                error: function() {
                  self.unSubscribeNotifications();
                  console.log("Id retrival failed");
                }
            });
        },

        showProgressBar: function() {
          var self=this;
          this.progressBar = new progressBarForm({
              statusText: this.context.getMessage("snapshot_create_version"),
              title: this.context.getMessage("snapshot_create_please_wait"),
              hasPercentRate: true
          });

          this.progressBarOverlay = new OverlayWidget({
              view: this.progressBar,
              type: 'small',
              showScrollbar: false
          });
          this.progressBarOverlay.build();

          this.notificationFlag = 0;
        }

    });

    return SnapshotVersionView;
});