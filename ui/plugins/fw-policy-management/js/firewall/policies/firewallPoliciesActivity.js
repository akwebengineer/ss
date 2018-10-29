/**
 * A module that implements a BasePoliciesActivity for Firewall Policies
 *
 * @module FirewallPoliciesActivity
 * @author Vidushi Gupta <vidushi@juniper.net>
 8 @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  '../../../../base-policy-management/js/policy-management/policies/basePoliciesActivity.js',
  './conf/firewallPolicyGridConfiguration.js',
  './models/firewallPolicyModel.js',
  './models/fwPolicyCollection.js',
  './views/firewallPoliciesView.js',
  './views/firewallPolicyFormView.js',
  './constants/fwPolicyManagementConstants.js',
  'text!../../../../base-policy-management/js/policy-management/rulename-template/constants/firewallRuleNameTemplate.json',
  'widgets/overlay/overlayWidget',
  '../policyhits/policyHitsActivity.js',
  '../../../../ui-common/js/common/widgets/progressBarForm.js',
  '../rules/controller/fwRulesController.js',
  '../../../../reports/js/service/reportsService.js',
  '../../../../ui-common/js/common/utils/SmNotificationUtil.js'
], function (BasePoliciesActivity, GridConfiguration, Model, Collection,
             FirewallPoliciesView, CreatePolicyView,
             PolicyManagementConstants,
             FirewallRuleNameTemplateJson,OverlayWidget,
             PolicyHitsActivity,ProgressBarForm, FWRulesController,ReportsService,SmNotificationUtil) {
  /**
   * Constructs a FirewallPoliciesActivity.
   */

  var FirewallPoliciesActivity = function () {
    BasePoliciesActivity.call(this, {policyManagementConstants: PolicyManagementConstants});
  };
  FirewallPoliciesActivity.prototype = Object.create(BasePoliciesActivity.prototype);
  FirewallPoliciesActivity.prototype.constructor = FirewallPoliciesActivity;


  _.extend(FirewallPoliciesActivity.prototype, BasePoliciesActivity.prototype, {

    controller: FWRulesController,
    gridConfiguration: GridConfiguration,
    policiesView: FirewallPoliciesView,
    createPolicyView: CreatePolicyView,

    getNewModelInstance: function() {
      return new Model();
    },

    getNewCollectionInstance : function(){
      return new Collection();
    },

    getRuleNameTemplateJSON: function () {
      return FirewallRuleNameTemplateJson;
    },

    getRuleNameConstantStringLength: function () {
      return 63;
    },

    /**
     * @overridden from gridActivity
     * Bind the publish event to the grid context menu
     */
    bindEvents: function() {
      BasePoliciesActivity.prototype.bindEvents.call(this);

      this.bindPreviewPDFEvent();
      this.bindHitCountEvent();
      this.bindRefreshDevicesEvent();
      this.bindPromote2GroupEvent();
    },


    bindPreviewPDFEvent: function() {
      this.events.previewPDFEvent = "previewPDFEvent";
      this.view.$el.bind(this.events.previewPDFEvent, $.proxy(this.onPreviewPDFEvent, this));
    },

    bindHitCountEvent: function() {
      this.events.latestPolicyHits = {
      name: "latestPolicyHits",
        capabilities: PolicyManagementConstants.MANAGE_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.latestPolicyHits.name, $.proxy(this.onProbeHitCountsEvent, this, PolicyManagementConstants.POLICY_LATEST_HITS));

      this.events.resetPolicyHits = {
        name: "resetPolicyHits",
        capabilities: PolicyManagementConstants.RESET_HIT_COUNT_CAPABILITY
      };
      this.view.$el.bind(this.events.resetPolicyHits.name, $.proxy(this.onProbeHitCountsEvent, this,PolicyManagementConstants.RESET_POLICY_HITS));
    },

    bindRefreshDevicesEvent: function() {
      this.events.refreshDevicesEvent = {
        name: "refreshDevicesEvent",
        capabilities: PolicyManagementConstants.MANAGE_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.refreshDevicesEvent.name, $.proxy(this.onRefreshDevicesEvent, this));

    },

    bindPromote2GroupEvent: function() {
      this.events.promote2GroupEvent = {
        name: "promote2GroupEvent",
        capabilities: PolicyManagementConstants.MODIFY_CAPABILITY
      };
      this.view.$el.bind(this.events.promote2GroupEvent.name, $.proxy(this.onPromoteToGroupPolicyIntent, this));
    },

    

    onRefreshDevicesEvent: function() {
      var self = this;
      var policyId = this.view.gridWidget.getSelectedRows()[0].id;

      // show progress bar
      var progressBar = new ProgressBarForm({
        statusText: self.context.getMessage('source_IDs_update_msg'),
        title: self.context.getMessage('source_IDs_update_title')
      });

      self.progressBarOverlay = new OverlayWidget({
        view: progressBar,
        type: 'small',
        showScrollbar: false
      });
      self.progressBarOverlay.build();

      self.policyUrl = PolicyManagementConstants.POLICY_URL;
      $.ajax({
        url: PolicyManagementConstants.POLICY_URL + policyId + PolicyManagementConstants.SOURCE_ID_REFRESH,
        type: 'POST',
        contentType: PolicyManagementConstants.SOURCE_ID_REFRESH_CONTENT_TYPE,

        success: function(data) {
          self.progressBarOverlay.destroy();
          new Slipstream.SDK.Notification().setText(self.context.getMessage("source_IDs_update_confirm")).setType('success').notify();
        },

        error: function(data) {
          console.log('Failed to refresh roles for device');
          // console.log(data);
          // console.log(data.responseJSON.key);
          // console.log(data.responseJSON.value);
          var key = data.responseJSON.key;
          var deviceName = [data.responseJSON.value];
          self.progressBarOverlay.destroy();
          new Slipstream.SDK.Notification().setText(self.context.getMessage(key, deviceName)).setType('error').notify();
        }
      });
    },


    onProbeHitCountsEvent: function(args) {
      PolicyHitsActivity.overlayLaunch({
        activity: this,
        params : {
          selectedPolicy: this.view.gridWidget.getSelectedRows()[0],
          opType: args
        }
      });
    },


    onPreviewPDFEvent: function(){
      var me = this,
          reportsModel,
          onSuccessGetReportDef, onSuccessGetPDFfileName, onSuccessGetPDFfile, getRequestStructure;
      var service = new ReportsService(),smNotificationUtil = new SmNotificationUtil();
      me.progressBar = new ProgressBarForm({
        statusText: "Downloading report",
        title: "Generate Policy Analysis Report"
      });
      me.generateReportScreenID = Math.floor(Math.random() * 1000);
      var  uri = [me.policyManagementConstants.TASK_PROGRESS_URL+"$"+me.generateReportScreenID];
      $.proxy(smNotificationUtil.subscribeNotifications,me)(uri, me.getProgressUpdate);

      me.progressBarOverlayPDF = new OverlayWidget({
        view: me.progressBar,
        type: 'small',
        showScrollbar: false
      });
      me.progressBarOverlayPDF.build();

      getRequestStructure = function(){

        var jsonRequest = {"report-template":{"name": "Policy-analysis-report","report-content-type":"POLICY_ANOMALY","job-id":me.generateReportScreenID,
                             "policy-analysis-content":{"firewall-policy":"","anomalies":{"anomalies":[]}
                           }}};
        return JSON.stringify(jsonRequest);
      };

      onSuccessGetPDFfileName = function(response) { // PDF file is created.
        me.generateReportFileName = response.responseJSON['preview-report-response']['file-name'];
      };

      var request = getRequestStructure();
      if(request !== undefined){
        request = JSON.parse(request);
      }
      if(request !== undefined){
        request["report-template"]["policy-analysis-content"]["firewall-policy"] = parseInt(me.view.gridWidget.getSelectedRows()[0].id);
        var reportsModelJson = JSON.stringify(request);
        service.getPDFfileName(reportsModelJson, onSuccessGetPDFfileName);
      }
    },

    getProgressUpdate: function () {
      var self = this, smNotificationUtil = new SmNotificationUtil(), service = new ReportsService();
      onProgressUpdateSucsess = function (data, status) {
        var progress = 0;
        if (data['task-progress-response']) {
          progress = data['task-progress-response']['percentage-complete'] / 100;
          self.progressBar.setStatusText(data['task-progress-response']['current-step']);
          if (progress >= 1) {
            self.progressBarOverlayPDF.destroy();
            onSuccessGetPDFfileName = function (response) {
              location.href = self.policyManagementConstants.POLICY_ANALYSIS_REPORT_LOCATION + self.generateReportFileName;
              smNotificationUtil.unSubscribeNotifications();            
            };

            onError = function () {
              console.log("reportsService::getPDFfile() - Error");
            };
            service.getPDFfile(self.generateReportFileName, onSuccessGetPDFfileName, onError);
          }

        }
      };
      onProgressUpdateError = function () {
        console.log("Id retrival failed");
      };
      smNotificationUtil.getTaskProgressUpdate(("$" + self.generateReportScreenID), onProgressUpdateSucsess, onProgressUpdateError)
    },

    onPromoteToGroupPolicyIntent: function() {
      var self = this;
      var id = self.view.gridWidget.getSelectedRows()[0].id,
        intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT,
          {
            mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
          }
        );
      intent.putExtras({id: id, mode:"PROMOTE_TO_GROUP"});
      self.view.context.startActivityForResult(intent);
    }
  });

  return FirewallPoliciesActivity;
});
