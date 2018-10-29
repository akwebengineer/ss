/**
 * A form for Compare Version in Manage/Rollback Policy
 * @module CompareVersionView
 * @author <wasima@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/progressBar/progressBarWidget',
    'text!../../templates/compareSnapshotTemplate.html',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../../compare-policy/conf/comparePolicyResultConfiguration.js',
    '../../compare-policy/views/comparePolicyResultView.js',
    'widgets/overlay/overlayWidget',
    '../../../../../ui-common/js/common/utils/SmNotificationUtil.js'
], function (Backbone, FormWidget, ProgressBarWidget, SampleLinkTemplate,ProgressBarForm,ResultConfig,ResultView,OverlayWidget,SmNotificationUtil) {
    var defaultConf = {
        title: '',
        statusText: '',
        inOverlay: true
    };

    var CompareBarForm = Backbone.View.extend({

        initialize: function(options) {
            this.conf = _.extend(defaultConf, options);
            this.context = this.conf.parentView.context;
            this.view = this.conf.parentView;
            this.selectedRowName = this.conf.params.selectedRow.name;
            this.selectedRow = this.conf.params.selectedRow;
            this.record1 = this.conf.params.record1;
            this.record2 = this.conf.params.record2;
            this.params = this.conf.params;
            this.policyManagementConstants = this.params.policyManagementConstants;
            this.selectedRowId = this.conf.params.selectedRow.id;
            this.selectedRowNameParsed = this.handleParse(this.selectedRowName);
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            this.smNotificationUtil = new SmNotificationUtil();
            this.ignoreUnchangedRules = true;  //Ignore the unchanged rules for Diff
        },

        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this;
            var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId,
                uri = [self.policyManagementConstants.TASK_PROGRESS_URL+screenID];
            $.proxy(self.smNotificationUtil.subscribeNotifications,self)(uri, self.getProgressUpdate);
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

        showProgressBar: function() {
            var self = this;
            var firstString = self.selectedRowNameParsed;
            var secondString = self.record1['snapshot-version'];
            var thirdString = self.record2['snapshot-version']; 

            var title = self.ignoreUnchangedRules ? 'Compare Versions' : "Download Versions Diff";

            this.progressBar = new ProgressBarForm({
                statusText: title,
                title: "Comparing Versions:"+ firstString+">"+secondString + ":" + thirdString,
                hasPercentRate: true
            });
           
            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                height : "680px",
                showScrollbar: false
            });
            this.progressBarOverlay.build();

            this.notificationFlag = 0;
        },

        unSubscribeNotifications: function(){
          this.smNotificationUtil.unSubscribeNotifications();
        },

        getProgressUpdate : function() {
             var self = this;    
             var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;
             onProgressUpdateSucsess = function(data, status){
                var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        if(progress == 1 && self.notificationFlag === 0)
                        {
                            self.notificationFlag = 1;
                            self.progressBar._progressBar.setStatusText('Complete');
                            self.progressBar._progressBar.hideTimeRemaining();
                            self.progressBarOverlay.destroy();
                            self.unSubscribeNotifications();
                            //Show compare result View
                            self.compareUUID = screenID;
                            if(self.ignoreUnchangedRules) {
                                self.showCompareResultView();
                            } else{
                                location.href = self.policyManagementConstants.POLICY_DIFF_DOWNLOAD_URL + self.compareUUID + ".zip";
                            }
                        }
                        else {
                            if(self.progressBar) {
                                self.progressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                                self.progressBar._progressBar.setProgressBar(progress);  
                            }    
                        }    
                    } 
                    else 
                        self.progressBar._progressBar.setProgressBar(progress); 
             };
             onProgressUpdateError = function(){
               self.unSubscribeNotifications();
               console.log("Id retrival failed");
             };
             self.smNotificationUtil.getTaskProgressUpdate(screenID, onProgressUpdateSucsess, onProgressUpdateError )
        },

        getVersion : function(version) {
            if(version=="Current"){
                return 0;
            }else{
                return version;
            }
        },

        downloadDiff: function(ignoreUnchangedRules) {
            //Start Compare Job to download the diff with unchanged rules.
            this.ignoreUnchangedRules = ignoreUnchangedRules;
            //Generating a new UUID for download file
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            //initializing eventSubscriber
            this.smSSEEventSubscriber = new SmNotificationUtil();
            //Start compare job with unchnaged rules            
            this.startCompareJob();
        },

        startCompareJob : function() {
            var self = this;
            var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;
            self.subscribeNotifications();
            var postCompareData = {
              "compare-policy-versions-request": {
                  "first-version": self.getVersion(self.record1['snapshot-version']),
                  "second-version": self.getVersion(self.record2['snapshot-version']),
                  "ignore-unchanged-rules":self.ignoreUnchangedRules,
                  "screen-id": screenID,
                  "browser-id": ""
                }
            };

            self.showProgressBar();

            $.ajax({
                url: self.policyManagementConstants.POLICY_URL+self.selectedRowId+"/compare",
                type: 'post',
                headers: {
                   'content-type': self.policyManagementConstants.SNAPSHOT_VERSION_COMPARE_CONTENT_TYPE
                },
                data: JSON.stringify(postCompareData),
                success: function(data, status) {            
                  //self.compareUUID = data;
                },
                error: function() {
                  self.unSubscribeNotifications();
                  console.log("Id retrival failed");
                }
            });
        },

        showCompareResultView : function() {
            var self = this;

            var formConfig = new ResultConfig(self.context),
             formElements = formConfig.getValues();

            var overlayGridForm = new ResultView({
                parentView: self,
                params :{
                  compareId :self.compareUUID,
                  compareResultURL : self.policyManagementConstants.SNAPSHOT_VERSION_COMPARE_RESULT_URL
                }
             }); 
             this.htmlOverlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'xlarge',
                okButton: true,
                title:self.context.getMessage("compare_policy")

            });
           this.htmlOverlay.build();
        },

        destroy: function() {
            if (this._compareBar) {
                this._compareBar.destroy();
            }
        }
    });

    return CompareBarForm;
});
