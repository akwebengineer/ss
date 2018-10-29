/**
 * Firewall rule wizard rule placement view 
 *
 * @module FirewallRuleWizardRulePlacementView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../constants/fwRuleGridConstants.js',
    '../conf/fwRuleWizardRulePlacementConfig.js',
    './fwRulesPlacementView.js',
    '../../../../../ui-common/js/common/utils/SmProgressBar.js',
    '../../../../../ui-common/js/sse/smSSEEventSubscriber.js'
], function(Backbone, FormWidget, OverlayWidget, PolicyManagementConstants, FirewallRulePlacementConf,
               RulePlacementView, SmProgressBar, SmSSEEventSubscriber) {
    var FirewallRuleWizardRulePlacementView = Backbone.View.extend({
        events: {
            "click #view_placement_link": "showRulePlacementOverlay",
            "click #view_report_link": "viewAnalysisReport"
        },
        
        initialize: function() {
            var self = this;

            this.context = this.options.context;
            this.policyObj = this.options.policyObj;
            this.model = this.options.model;
            this.cuid = this.options.cuid;

            this.formConfiguration = new FirewallRulePlacementConf(this.context);

            self.model.bind('ruleAnalysisFinished', $.proxy(self.displayAnalysisResult, self));

            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
        },

        render: function() {
            var self = this;
                       
            this.ruleAnalysis();

            this.form = new FormWidget({
                "elements": self.formConfiguration.getElements(),
                "container": this.el
            });

            this.form.build();

            this.$el.addClass("security-management");

            this.$el.find("#view_placement").closest(".elementinput").hide();
            this.$el.find("#view_analysis_report").closest(".elementinput").hide();
            this.$el.find("#view_report_link").hide();
                        
            this.displayAnalysisResult();

            return this;
        },

        ruleAnalysis: function() {
         
            if (this.model.get("run-analysis")) {
                this.runRuleAnalysis();
            } else {
                this.no_analysis();
            }
        },

       /**
         * [subscribeNotifications]
         * @return {SmSSEEventSubscriber obj} [ will subscribe for notifcation with job id]
         * triggers the checkProgressNotificationStatus as notication call back
         */
         subscribeNotifications : function (currentPage) {
            //Subscribe to the SSE event
            //generate new uuid for rules analysis process..
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            var self = this, sseEventHandler, notificationSubscriptionConfig = {
                'uri' : [ PolicyManagementConstants.TASK_PROGRESS_URL + '$' + self.screenId],
                'autoRefresh' : true,
                'callback' : $.proxy(self.checkProgressNotificationStatus, self)
            };
            sseEventHandler = $.proxy(self.checkProgressNotificationStatus, self);
            if(self.sseEventSubscriptions) {
                self.unSubscribeNotification();
            }
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
        /**
         * [checkProgressNotificationStatus chek for the progress status]
         */
        checkProgressNotificationStatus: function(){
            var self = this;

            //Check if the notiifcation has not come for 2 mins Else detroy pb
           self.progressBarOverlay.updateTimer();

            $.ajax({
                "url": PolicyManagementConstants.TASK_PROGRESS_URL + '$' + self.screenId,
                "type": 'get',
                "headers" :{
                    "accept": PolicyManagementConstants.TASK_PROGRESS_ACCEPT
                },
                "success": function( data, textStatus, jQxhr ) {
                    //Cancel timer
                    //self.progressBarOverlay.setStatusText(data['task-progress-response']['current-step']);
                    self.progressBarOverlay.setProgressBar(data['task-progress-response']['percentage-complete']/100);
                        
                    if(data['task-progress-response']['percentage-complete'] === 100){
                        self.fetchRuleAnalysisData();
                        self.progressBarOverlay.destroy();
                    }
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                    self.progressBarOverlay.destroy();
                    self.resetAnalysisResult();
                    self.displayErrorAnalysisResult();
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("rule_analysis_error")).setType('info').notify();
                }
            });
        },
        /**
         * [fetchRuleAnalysisData fetch the rule analysis data once the progress completed with 100%]
         */
        fetchRuleAnalysisData: function(){
            var self = this;
            $.ajax({
                "url": PolicyManagementConstants.POLICY_URL + self.policyObj.id + PolicyManagementConstants.RULE_DRAFT + "/analysis-result?screenId=" + self.screenId,
                "type": 'GET',
                "headers" :{
                    "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER
                },
                "success": function( data, textStatus, jQxhr ) {
                    self.saveAnalysisResult(data);
                    self.model.trigger('ruleAnalysisFinished');
                    self.unSubscribeNotification();
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                    self.progressBarOverlay.destroy();
                    self.resetAnalysisResult();
                    self.displayErrorAnalysisResult();
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("rule_analysis_error")).setType('info').notify();
                }
            });
        },

        runRuleAnalysis: function() {

            var self = this, policyId = self.policyObj.id;

            self.showProgressBar("analysis");
            self.subscribeNotifications();
            $.ajax({
                url: PolicyManagementConstants.POLICY_URL + policyId + PolicyManagementConstants.RULE_DRAFT + "/analyse?cuid=" + self.cuid + "&screenId=" + self.screenId,
                type: 'POST',
                dataType: "json",
                data: JSON.stringify({"firewall-rule":self.model.toJSON()}),

                beforeSend: function(request) {
                    request.setRequestHeader('Accept', PolicyManagementConstants.RULE_ACCEPT_HEADER);
                    request.setRequestHeader('Content-Type', PolicyManagementConstants.RULE_CONTENT_HEADER);
                },
                success: function(data) { 
                 console.log('run rule analysis success..');                     
                },
                error: function() {
                    console.log('API timed out, but the analysis progress is handled by notification..');
                }
            });

            return true;
        },

        no_analysis: function() {

            var self = this, policyId = this.policyObj.id;

            this.showProgressBar("no-analysis");

            $.ajax({
                url : PolicyManagementConstants.POLICY_URL + policyId + PolicyManagementConstants.RULE_DRAFT + "/no-analysis?cuid=" + self.cuid,
                type: 'POST',
                dataType: "json",
                data: JSON.stringify({"firewall-rule":self.model.toJSON()}),

                beforeSend: function(request) {
                    request.setRequestHeader('Accept', PolicyManagementConstants.RULE_ACCEPT_HEADER);
                    request.setRequestHeader('Content-Type', PolicyManagementConstants.RULE_CONTENT_HEADER);
                },
                success: function(data) {
                    self.progressBarOverlay.destroy();
                    self.saveAnalysisResult(data);
                    self.model.trigger('ruleAnalysisFinished');
                },
                error: function() {
                    self.progressBarOverlay.destroy();
                    self.resetAnalysisResult();
                    self.displayErrorAnalysisResult();
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("rule_placement_suggest_error")).setType('info').notify();
                }
            });
        },

        saveAnalysisResult: function (data) {

            var self = this;

            self.resetAnalysisResult();

            self.model.set("rule-order", data.fwRuleAnalysisResult.ruleOrder);
            self.model.set("seqNum", data.fwRuleAnalysisResult.seqNumber);
            self.model.set("rule-group-id", data.fwRuleAnalysisResult.ruleGroupUUID);
            self.model.set("rule-group-name", data.fwRuleAnalysisResult.ruleGroupName);
            self.model.set("ruleType", data.fwRuleAnalysisResult.ruleType);
            self.model.set("direction", data.fwRuleAnalysisResult.direction);
            self.model.set("referenceRuleName", data.fwRuleAnalysisResult.referenceRuleName);
            self.model.set("referenceRuleSeqNum", data.fwRuleAnalysisResult.referenceRuleSeqNumber);
            self.model.set('minValue', data.fwRuleAnalysisResult.minValue);
            self.model.set('maxValue', data.fwRuleAnalysisResult.maxValue);
            self.model.set("placementRules", data.fwRuleAnalysisResult.placementRules);
            self.model.set("resultFileName", data.fwRuleAnalysisResult.resultFileName);
            self.model.set("isRedundant", data.fwRuleAnalysisResult.isRedundant);
        },

        resetAnalysisResult: function () {

            var self = this;

            self.model.set("rule-order", "");
            self.model.set("seqNum", "");
            self.model.set("rule-group-id", "");
            self.model.set("rule-group-name", "");
            self.model.set("ruleType", "");
            self.model.set("direction", "");
            self.model.set("referenceRuleName", "");
            self.model.set("referenceRuleSeqNum", "");
            self.model.set('minValue', "");
            self.model.set('maxValue', "");
            self.model.set("placementRules", "");
            self.model.set("resultFileName", "");
            self.model.set("isRedundant", "");
        },

        showProgressBar: function(typeOfProgress) {
            
            var theStatusText, theTitle;

            if (typeOfProgress === "analysis") {
                theStatusText = this.context.getMessage("performing_analysis");
                theTitle = this.context.getMessage("rule_analysis");
            } else if (typeOfProgress === "no-analysis") {
                theStatusText = this.context.getMessage("suggest_placement_text");
                theTitle = this.context.getMessage("suggest_placement");
            } else if (typeOfProgress === "view-report") {
                theStatusText = this.context.getMessage("downloading_analysis_report");
                theTitle = this.context.getMessage("download_analysis_report");
            }

            this.progressBarOverlay =  new SmProgressBar({
                "container": $('.overlay-wrapper'),
                "hasPercentRate": true,
                "handleMask": true,
                "statusText": theStatusText
            });
            this.buildProgressBarOverlay();
        },
        buildProgressBarOverlay: function(){
            this.progressBarOverlay.build();
        },

        displayAnalysisResult: function() {
            var self = this,
                ruleType = self.model.get("ruleType"),
                ruleGroup = self.model.get("rule-group-name"),
                refRuleSeqNum = self.model.get("referenceRuleSeqNum"),
                seqNum = self.model.get("seqNum"),
                minVal = self.model.get('minValue'),
                maxVal = self.model.get('maxValue'),
                isRedundant = self.model.get('isRedundant'),
                resultsText = "",
                ruleLocationText = "";

            if (this.model.get("run-analysis")) {
                if (!isRedundant) {
                    resultsText = self.context.getMessage("results_desc") + " ";
                    if (minVal === maxVal) {
                        resultsText += self.context.getMessage("results_no_range_desc");
                    } else {
                        resultsText += self.context.getMessage("results_range_desc") + " (" + minVal + "-" + maxVal + ")";
                    }

                    resultsText += " " + self.context.getMessage("results_shadowing");
                } else {
                    resultsText = self.getRedundantRuleString();
                    self.$el.find("#analysis_result").addClass("errorimage");
                }
                self.$el.find("#view_report_link").show();
            } else {
                resultsText = self.context.getMessage("rule_analysis_not_performed") + "\n" +
                              self.context.getMessage("no_rule_analysis_desc");
                self.$el.find("#view_report_link").hide();
            }
            
            self.$el.find("#analysis_result").html(resultsText);

            //Rule Placing
            
            self.$el.find("#rule_type").text(ruleType);
            if (ruleGroup !== "Zone" && ruleGroup !== "Global") {
                self.$el.find("#rule_group").text(ruleGroup);
            } else {
                self.$el.find(".ruleGroupClass").hide();
            }

            ruleLocationText = self.getRuleSequenceString(refRuleSeqNum, seqNum);

            self.$el.find("#location_sequence").html(ruleLocationText);
        },

        displayErrorAnalysisResult: function() {
            var self = this,
                resultsText = "";

            self.$el.find("#view_report_link").hide();
            self.$el.find("#view_placement_link").hide();
            self.$el.find(".ruleGroupClass").hide();
            self.$el.find("#rule_type").text("");

            if (this.model.get("run-analysis")) {
                resultsText = self.context.getMessage("rule_analysis_error");
            } else {
                resultsText = self.context.getMessage("rule_placement_suggest_error");
            }
            
            self.$el.find("#analysis_result").html(resultsText);
            self.$el.find("#location_sequence").html("");
        },

        getRuleSequenceString: function(refRuleSeqNum, seqNum) {
            var self = this, ruleLocationText = "";
            if (self.model.get("direction") && self.model.get("referenceRuleName")) {
                ruleLocationText += self.context.getMessage("rule_location_desc") + " " +
                                    self.context.getMessage(self.model.get("direction")) + " " ;
                if (refRuleSeqNum) {
                    ruleLocationText += self.context.getMessage("rule_no") + " " + refRuleSeqNum + ": \"";
                } else {
                    ruleLocationText += self.context.getMessage("ruleGroup") + " " + "\"";
                }
                ruleLocationText += self.model.get("referenceRuleName") + "\".  " + "\n";
            }
            ruleLocationText += self.context.getMessage("rule_sequence") + " " + seqNum;
            return ruleLocationText;
        },

        getRedundantRuleString: function() {
            var self = this,
                refRuleSeqNum = self.model.get("referenceRuleSeqNum"),
                referenceRuleName = self.model.get("referenceRuleName"),
                isRedundant = self.model.get('isRedundant'),
                text = "";

            if (isRedundant) {
                text = self.context.getMessage("rule_analysis_redundant", [referenceRuleName, refRuleSeqNum]);
            }
            return text;   
        },

        getSummary: function() {
            var summary = [],
                self = this, 
                ruleGroupName = "",
                ruleLocationText = "";

            summary.push({
                label: self.context.getMessage('rule_placement'),
                value: ' '
            });

            summary.push({
                label: self.context.getMessage('rule_type'),
                value: this.model.get("ruleType")
            });

            ruleGroupName = this.model.get("rule-group-name");
            if (ruleGroupName !== "Zone" && ruleGroupName !== "Global") {
                summary.push({
                    label: self.context.getMessage('ruleGroup'),
                    value: this.model.get("rule-group-name")
                });
            }

            if (self.model.get("run-analysis")) {
                if (self.model.get('isRedundant')) {
                    ruleLocationText = self.getRedundantRuleString();
                    ruleLocationText += "\n";
                }    
            } else {
                ruleLocationText = self.context.getMessage("rule_analysis_not_performed");
                ruleLocationText += "\n";
            }

            ruleLocationText += self.getRuleSequenceString(self.model.get("referenceRuleSeqNum"), self.model.get("seqNum")); 

            summary.push({
                label: self.context.getMessage('location_sequence'),
                value: ruleLocationText
            });
            
            return summary;
        },

        getTitle: function () {
            return this.context.getMessage('auto_rule_placement');
        },

        showRulePlacementOverlay: function() {
            var self = this,
                placementRules = self.model.get("placementRules"),
                rulePlacementView;

            rulePlacementView = new RulePlacementView({
                'policyObj': this.policyObj,
                'context': this.context,
                "model" : this.model,
                'placementRules': placementRules,
                'policyManagementConstants': PolicyManagementConstants
            });

            self.viewPlacementOverlay = new OverlayWidget({
                title: self.context.getMessage("view_rule_placement"),
                view: rulePlacementView,
                type: 'xlarge',
                showScrollbar: true,
                okButton: true
            });
            self.buildViewPlacementOverlay();
        },
        buildViewPlacementOverlay: function(){
            this.viewPlacementOverlay.build();
        },

        analysisReportDownload: function(data) {
            var self = this, pdfFileName = data["preview-report-response"]["file-name"];

            $.ajax({
                url: PolicyManagementConstants.RULE_ANALYSIS_DOWNLOAD_PDF_URL + pdfFileName,
                type: 'GET',
                cache: 'false',
                "headers" :{
                    "accept": "application/pdf"
                },
                success: function(data) {
                    self.progressBarOverlay.destroy();
                    location.href = PolicyManagementConstants.RULE_ANALYSIS_DOWNLOAD_PDF_URL + pdfFileName;
                },
                error: function() {
                    self.progressBarOverlay.destroy();
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("analysis_report_download_pdf_error")).setType('info').notify();
                }
            });
        },

        viewAnalysisReport: function() {

            var self = this;
            self.showProgressBar("view-report");

             $.ajax({
                url: PolicyManagementConstants.RULE_ANALYSIS_REPORT_URL + self.model.get("resultFileName"),
                type: 'GET',
                cache: 'false',
                 "headers" :{
                     "accept": PolicyManagementConstants.RULE_ANALYSIS_REPORT_ACCEPT_HEADER
                 },
                success: $.proxy(self.analysisReportDownload,self),
                error: function() {
                    self.progressBarOverlay.destroy();
                    new Slipstream.SDK.Notification().setText(self.context.getMessage("analysis_report_generate_error")).setType('info').notify();
                }
            });

            return true;
        }
    });
    return FirewallRuleWizardRulePlacementView;

});
