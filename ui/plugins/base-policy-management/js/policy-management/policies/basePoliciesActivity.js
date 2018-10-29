/**
 * A module that implements a Grid Activity for Policies
 *
 * @module BasePoliciesActivity
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  '../../../../ui-common/js/gridActivity.js',
  '../assign-devices/assignDevicesActivity.js',
  '../assign-devices/models/assignDevicesModel.js',
  '../manage-version/manageVersionActivity.js',
  '../compare-policy/comparePolicyActivity.js',
  '../rulename-template/ruleNameTemplateBuilderActivity.js',
  '../custom-column/customColumnBuilderActivity.js',
  '../../../../ui-common/js/common/widgets/progressBarForm.js',
  'widgets/overlay/overlayWidget',
  '../export/exportPolicyActivity.js',
  '../rules/controller/baseRuleController.js',
  '../rules/util/ruleGridConstants.js',
  '../rules/views/rulesIntegratedView.js',
  '../policy-import/policyImportActivity.js'
], function ( GridActivity, AssignDevicesActivity, AssignDevicesModel, ManageVersionActivity,
              ComparePolicyActivity, RuleNameTemplateBuilderActivity, CustomColumnBuilderActivity, ProgressBarForm, OverlayWidget,
              ExportPolicyActivity, BaseRulesController, RuleGridConstants, RulesIntegratedView, ImportPolicyActivity) {
  /**
   * Constructs a BasePoliciesActivity.
   */

  var BasePoliciesActivity = function (options) {
    GridActivity.call(this);
    this.initialize(options);
  };

  BasePoliciesActivity.prototype = Object.create(GridActivity.prototype);
  BasePoliciesActivity.prototype.constructor = BasePoliciesActivity;


  _.extend(BasePoliciesActivity.prototype, GridActivity.prototype, {

    controller: BaseRulesController,
    constants: RuleGridConstants,
    cuid: Slipstream.SDK.Utils.url_safe_uuid(),
    GLOBAL: "GLOBAL",
    DRAFT: "DRAFT",

    initialize: function(options) {
      this.policyManagementConstants = options.policyManagementConstants;
      this.model = this.getNewModelInstance();
      this.collection = this.getNewCollectionInstance();
      this.populateCapabilities();
    },

    populateCapabilities: function() {
      var me = this, policyManagementConstants = me.policyManagementConstants;
      this.capabilities =  {
        "create": {
          view: me.createPolicyView,
          rbacCapabilities: policyManagementConstants.CREATE_CAPABILITY
        },
        "edit": {
          view: me.createPolicyView,
          rbacCapabilities: policyManagementConstants.MODIFY_CAPABILITY
        },
        "delete": {
          rbacCapabilities: policyManagementConstants.DELETE_CAPABILITY
        },
        "assignToDomain": {
          rbacCapabilities: policyManagementConstants.ASSIGN_TO_DOMAIN_CAPABILITY
        },
        "clone" : {
          view : me.createPolicyView,
          rbacCapabilities: policyManagementConstants.CREATE_CAPABILITY
        }
      };
    },



    /**
     * @overridden from gridActivity
     * Bind the publish event to the grid context menu
     */
    bindEvents: function() {
      GridActivity.prototype.bindEvents.call(this);

      this.bindAssignDevicesEvent();
      this.bindUnAssignDevicesEvent();
      this.bindPublishEvent();
      this.bindUpdatePolicyEvent();
      this.bindManageRollbackEvent();
      this.bindComparePolicyEvent();
      this.bindExportPolicyEvent();
      this.bindExportPolicyEventJson();
      this.bindImportPolicyEvent();
      this.bindRuleNameTemplateBuilderEvent();
      this.bindCustomColumnBuilderEvent();
      this.bindUnlockPolicyEvent();
    },

    //Method to be overridden by sub-classes
    getNewCollectionInstance : function(){
      return undefined;
    },

    bindUnAssignDevicesEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.unassignDeviceEvent = {
        name: policyManagementConstants.UN_ASSIGN_DEVICE_EVENT,
        capabilities: policyManagementConstants.ASSIGN_DEVICE_CAPABILITY
      };
      this.view.$el.bind(policyManagementConstants.UN_ASSIGN_DEVICE_EVENT, $.proxy(this.onUnassignDeviceEvent, this));
    },

    /**
     * @overridden from gridActivity
     * Bind the assign device event to the grid context menu
     */
    bindAssignDevicesEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.assignDevicesEvent = {
        name: policyManagementConstants.ASSIGN_DEVICE_EVENT,
        capabilities: policyManagementConstants.ASSIGN_DEVICE_CAPABILITY
      };
      this.view.$el.bind(policyManagementConstants.ASSIGN_DEVICE_EVENT, $.proxy(this.onAssignDevicesEvent, this));

    },

    bindUnlockPolicyEvent: function() {
      this.events.unlockPolicyEvent =  {
        name: "unlockPolicyEvent",
        capabilities: this.policyManagementConstants.UNLOCK_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.unlockPolicyEvent.name, $.proxy(this.onUnlockPolicyEvent, this));
    },

    /**
     * @overridden from gridActivity
     * Bind the publish event to the grid context menu
     */
    bindPublishEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.publishEvent = {
        name: "publishAction",
        capabilities: policyManagementConstants.PUBLISH_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.publishEvent.name, $.proxy(this.onPublishEvent, this));
    },

    /**
     * @overridden from gridActivity
     * Bind the publish event to the grid context menu
     */
    bindUpdatePolicyEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.updatePolicyEvent = {
        name: "updateAction",
        capabilities: policyManagementConstants.UPDATE_DEVICE_CAPABILITY
      };
      this.view.$el.bind(this.events.updatePolicyEvent.name, $.proxy(this.onUpdatePolicyEvent, this));
    },

    bindManageRollbackEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.manageRollbackEvent = {
        name: "manageRollbackEvent",
        capabilities: policyManagementConstants.MANAGE_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.manageRollbackEvent.name, $.proxy(this.onManageRollbackEvent, this));
    },

    bindComparePolicyEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.comparePolicyEvent = {
        name: "comparePolicyEvent",
        capabilities: policyManagementConstants.MANAGE_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.comparePolicyEvent.name, $.proxy(this.onComparePolicyEvent, this));
    },

    bindExportPolicyEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.exportPolicyEvent= {
        name: "exportPolicyToPDFAction",
        capabilities: policyManagementConstants.EXPORT_POLICY_CAPABILITY
      };
      this.view.$el.bind(this.events.exportPolicyEvent.name, $.proxy(this.onExportPolicyEvent, this, this.policyManagementConstants.PDF));
    },

    bindExportPolicyEventJson: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.exportPolicyEventJson = {
        name: "exportPolicyEventJson"
      };
      this.view.$el.bind(this.events.exportPolicyEventJson.name, $.proxy(this.onExportPolicyEvent, this, this.policyManagementConstants.ZIP));
    },

    bindImportPolicyEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.importPolicyEvent = {
        name: "importPolicyEvent"
      };
      this.view.$el.bind(this.events.importPolicyEvent.name, $.proxy(this.onImportPolicyEvent, this));
    },

    bindRuleNameTemplateBuilderEvent: function() {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.ruleNameTemplateBuilderEvent = {
        name: "ruleNameTemplateBuilderAction",
        capabilities: policyManagementConstants.RULE_NAME_TEMPLATE_CAPABILITY
      };
      this.view.$el.bind(this.events.ruleNameTemplateBuilderEvent.name, $.proxy(this.onRuleNameTemplateBuilderEvent, this));
    },
    
    bindCustomColumnBuilderEvent : function () {
      var policyManagementConstants = this.policyManagementConstants;
      this.events.customColumnBuilderEvent = {
        name: "customColumnBuilderAction",
        capabilities: policyManagementConstants.CUSTOM_COLUMN_MANAGE_CAPABILITY
      };
      this.view.$el.bind(this.events.customColumnBuilderEvent.name, $.proxy(this.onCustomColumnBuilderEvent, this));
    },

    onUnlockPolicyEvent: function(e, selectedRows, policyId) {
      var self = this;

      var confirmDialogConf = {
        title: this.getContext().getMessage('action_unlock_policy_confirm_title'),
        question: this.getContext().getMessage('action_unlock_policy_confirm_question'),
        onYesEvent: $.proxy(self.unlockPolicy, self, policyId),
        xIcon: false,
        kind: 'warning'
      };
      self.createConfirmationDialog(confirmDialogConf);
    },


    unlockPolicy: function(inPolicyId) {
      var self = this,
          policyId = inPolicyId ? inPolicyId : self.view.gridWidget.getSelectedRows()[0].id,
          policyManagementConstants = this.policyManagementConstants;

      self.closeConfirmationDialog();

      self.progressBar = new ProgressBarForm({
        statusText: self.context.getMessage("action_unlock_policy_progress_text"),
        title: self.context.getMessage("action_unlock_policy_progress_title"),
        hasPercentRate: false
      });

      self.progressBarOverlay = new OverlayWidget({
        view: self.progressBar,
        type: 'small',
        showScrollbar: false
      });
      self.progressBarOverlay.build();

      var onUnlockPolicySuccess = function() {
        //self.view.notify("success", self.context.getMessage("action_unlock_policy_succeed"));
        console.log("Unlock policy success");
        self.progressBarOverlay.destroy();
      };
      var onUnlockPolicyError = function() {
        //self.view.notify("error", self.context.getMessage("action_unlock_policy_failed"));
        console.log("Unlock policy failed");
        self.progressBarOverlay.destroy();
      };

      $.ajax({
        type: 'POST',
        url: policyManagementConstants.POLICY_URL + policyId + "/unlock",
        success: onUnlockPolicySuccess,
        error: onUnlockPolicyError
      });
    },

    onRuleNameTemplateBuilderEvent: function() {
      var me = this, policyManagementConstants = me.policyManagementConstants,
          ruleNamesObj = JSON.parse(me.getRuleNameTemplateJSON()),
          constantLength = me.getRuleNameConstantStringLength();
      RuleNameTemplateBuilderActivity.launchOverlay({
            activity: me,
            params : {
              serviceType: policyManagementConstants.SERVICE_TYPE,
              url: policyManagementConstants.RULE_NAME_TEMPLATE_URL,
              ruletemplateNames: ruleNamesObj,
              constantLength : constantLength
            }
          }
      );
    },
    onCustomColumnBuilderEvent : function() {
      var me = this;
      CustomColumnBuilderActivity.launchOverlay({
        activity : me,
        params : {
          url : me.policyManagementConstants.CUSTOM_COLUMN_URL
        }
      });
    },


    /**
     *  @overridden from gridActivity
     *  Called when the publish action is clicked
     *  Publish activity will take care of publish view in this case
     *  publish trigger logic is common across policies, so maintain same refer PublishActivity
     */
    onPublishEvent: function() {
      var me = this, policyManagementConstants = me.policyManagementConstants,
          intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_PUBLISH',{
            mime_type: policyManagementConstants.PUBLISH_MIME_TYPE
          });
      var selectedPolicies = this.getSelectedPolicies(this.view.gridWidget.getSelectedRows());    
      intent.putExtras({selectedPolicies: selectedPolicies});

      this.context.startActivity(intent);
    },

    /**
     *  @overridden from gridActivity
     *  Called when the publish action is clicked
     *  Publish activity will take care of publish view in this case
     *  publish trigger logic is common across policies, so maintain same refer PublishActivity
     */
    onUpdatePolicyEvent: function() {
      var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_UPDATE',{
        mime_type: this.policyManagementConstants.UPDATE_MIME_TYPE
      });
      var selectedPolicies = this.getSelectedPolicies(this.view.gridWidget.getSelectedRows());   
      intent.putExtras({selectedPolicies: selectedPolicies});

      this.context.startActivity(intent);
    },

    onManageRollbackEvent: function() {
      var self = this,
          policyManagementConstants = self.policyManagementConstants,
          model = new self.getNewModelInstance(),
          policy=self.collection.get(this.view.gridWidget.getSelectedRows()[0].id);
        ManageVersionActivity.launchOverlay({
            activity: self,
            model: model,
            policy:policy,
            params: {
                id:self.view.gridWidget.getSelectedRows()[0].id,
                selectedRow : self.view.gridWidget.getSelectedRows()[0],
                policyManagementConstants:policyManagementConstants
            }
        });
    },

    onComparePolicyEvent: function() {
      var self = this,
          policyManagementConstants = self.policyManagementConstants,
          model = self.getNewModelInstance(),
          record=this.view.gridWidget.getSelectedRows()[0],
          collection = self.getNewCollectionInstance();
      var gridConf = new self.gridConfiguration(self.getContext(),collection, policyManagementConstants);
      var params = {
        policyManagementConstants:policyManagementConstants,
        gridConf: gridConf,
        collection:collection
      };
      ComparePolicyActivity.launchOverlay({
        activity: self,
        params : params,
        obj : record
      });
    },

    onExportPolicyEvent: function(args) {
      var self =  this,
          policyManagementConstants = self.policyManagementConstants;
      ExportPolicyActivity.exportPolicyOverlayLaunch({
            activity: self,
            params : {
              selectedPolicies: self.view.gridWidget.getSelectedRows(),
              fileType: args,
              policyManagementConstants:policyManagementConstants
            }
          }
      );
    },

    onImportPolicyEvent: function(){
      var self =  this,
          policyManagementConstants = self.policyManagementConstants;
      ImportPolicyActivity.ImportPolicyActivityOverlay({
            activity: self,
            params : {
              policyManagementConstants:policyManagementConstants
            }
          }
      );
    },

  isDisabledClone: function(eventName, selectedRows) {
    selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
    // Check if it is single row selection
    if (!selectedRows || selectedRows.length !=1 ) {
      return true;
    }

    //disable the clone for global policies
    return selectedRows[0].isGlobalPolicy();
  },

  getRowIds: function(setIdsSuccess) {
    var me = this,
        collection = me.collection, 
        ids = collection.getAllPolicyIds();
    setIdsSuccess(ids);
  },



    //overwrite the list Intent to show the rules view if the policyId is passed in the url
    //else show the policy view
    onListIntent: function() {
      var self = this,
          policyId = self.getIntent().getExtras().objectId,
          view = self.getIntent().getExtras().view;
      if (policyId && view === 'rules') {
        this.launchRulesView(policyId);
      } else if(policyId && view === 'policies') {
        this.launchPoliciesView(policyId);
      } else {
        GridActivity.prototype.onListIntent.call(this);
      }
    },

    launchPoliciesView : function(policyId) {
      var self =  this;
      self.filter = "id = "+policyId;
      self.searchPolicy = self.getIntent().getExtras()._search;
      GridActivity.prototype.onListIntent.call(this);
    },

    getExtraParams: function(){
      var self = this;
      var extras = self.getIntent().getExtras();
      return extras;
    },

    launchRulesView: function(policyId) {
      var self =  this, launchWizard = self.getIntent().getExtras().launchWizard,
      filter = self.getIntent().getExtras().filter, getPolicyAjax, getCustomColumnsAjax, policyObj = {};   
      //load the policy object using the policyId passed from the policy view
      //TODO add code to handle the filter being passed from the globalsearch

      getPolicyAjax = $.ajax({
        url: self.policyManagementConstants.POLICY_URL + policyId,
        type: 'GET',
        headers: {
          Accept: self.policyManagementConstants.POLICY_ACCEPT_HEADER
        },
        success: function (data) {
          policyObj = data["policy"];
        },
        error: function () {
          console.log("call to fetch policy in base rules activity failed");
          var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
              {
                mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
              }
          );
          self.context.startActivity(intent);
        }
      });
      self.customColumns = [];
      if(self.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS !== undefined) {
        getCustomColumnsAjax = $.ajax({
          method: 'GET',
          dataType:'json',
          headers: { 
            'accept': self.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS_ACCEPT_HEADER
          },
          url: self.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS,
          success: function(data) {
            if(data['custom-columns'] && data['custom-columns']['custom-column']) {
              self.customColumns = data['custom-columns']['custom-column'];
            }
          },
          error: function() {
            console.log('Failed to load custom column info');
          }
        });  
      } else {
        getCustomColumnsAjax = $.Deferred();
        getCustomColumnsAjax.resolve();
      }
      
      $.when(getPolicyAjax, getCustomColumnsAjax).done(function () {
        var confObject = {context:self.context, policyObj:policyObj, launchWizard:launchWizard, cuid:self.cuid, customColumns : self.customColumns},
        extras = self.getExtraParams(), controller, objectsViewData;
        if (!_.isEmpty(extras)) {
          $.extend(confObject,{extras: extras});
        }
        controller = new self.controller(confObject);
        objectsViewData = controller.getObjectsViewData();
        //Create the integrated view comprising of rule view and objects grids
        self.setContentView(new RulesIntegratedView(self.context, controller.view, objectsViewData));
      });
    },

    getView: function () {
      var me=this;
      if (me.view) {
        return me.view;
      }
      var context = me.getContext();
      var gridConf = new me.gridConfiguration(context, me.collection, me.policyManagementConstants);
      var conf = gridConf.getPolicyGridConfiguration();
      conf.footer.getTotalRows = $.proxy(function() {
        var totalRows = me.collection.length;
        return totalRows === 0 ? totalRows : totalRows-3;
      },me);
      me.view = new me.policiesView({
        conf: conf,
        actionEvents: me.events,
        context: me.getContext(),
        collection:me.collection,
        policyManagementConstants:me.policyManagementConstants,
        cuid:me.cuid,
        filter: me.filter,
        search: me.searchPolicy
      });
      me.view.conf.customSortCallback = ($.proxy(me.view.handleSorting,me.view));
      me.setContextMenuItemStatus(me.view.conf);
      me.addSelectAllCallback(me.view.conf);
      me.bindEvents();
      return me.view;
    },

    setButtonStatus: function(selectedRows, updateStatusSuccess, updateStatusError){
      selectedRows = selectedRows.selectedRows;
       var enableEdit = !this.isDisabledEditButton(selectedRows),
          enableDelete = !this.isDisabledDeleteButton(selectedRows),
          enablePublish = !this.isDisabledPublishButton(selectedRows),
          enableUpdate = !this.isDisabledUpdateButton(selectedRows);

      updateStatusSuccess({
        "edit": enableEdit,
        "delete": enableDelete,
        "publishEvent": enablePublish,
        "updatePolicyEvent": enableUpdate
      });
    },

    getRecordsFromPolicyCollection: function (selectedRows) {
      var records = [];
      if (_.isEmpty(selectedRows)) {
        return records;
      }
      selectedRows = this.getSelectedPolicies(selectedRows);
      for (var i=0; i<selectedRows.length; i++) {
        var record = this.collection.get(selectedRows[i].id);
        if (!record) {
          continue;
        }
        records.push(record);
      }
      return records;
    },

    isDifferentDomain: function(selectedRows) {
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
      for (var i=0; i<selectedRows.length; i++) {
        if (selectedRows[i].isDifferentDomainPolicy()) {
          return true;
        }
      }

      return false;
    },

    isPolicyLocked: function(selectedRows){
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
      if (selectedRows && selectedRows.length > 0) {
        for (var i=0; i<selectedRows.length; i++) {
          var locked = selectedRows[i].isPolicyLocked();
          if (locked) {
            return true;
          }
        }
      }
      return false;
    },

    isGlobalPolicy: function(selectedRows) {
      for (var i=0; i<selectedRows.length; i++) {
        if (selectedRows[i].isGlobalPolicy())
        {
          return true;
        }
      }
      return false;
    },

    isDraftPolicy: function(selectedRows) {
      if (selectedRows && selectedRows.length > 0) {
        for (var i=0; i<selectedRows.length; i++) {
          if (selectedRows[i].isDraftPolicy()) {
            return true;
          }
        }
      }
      return false;
    },

    getSelectedRows: function() {
      var extras = this.getIntent().getExtras();
      return this.getSelectedPolicies(extras.selectedRows);    
    },

    /*
      Select the rows excluding static groups
    */

    getSelectedPolicies : function(selectedRows) {
      var self = this, selectedPolicies = [];
      $.each(selectedRows, function (index, object) {
        if(object.id > 0) {
          selectedPolicies.push(object);
        }
      });
      return selectedPolicies;
    },

    isDisabledEdit: function(eventName, selectedRows) {
      // Check if it is single row selection
      if (!selectedRows || selectedRows.length != 1) {
        return true;
      }
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
      //Check if group row is selected
      if(this.isGroupSelected(selectedRows)) {
        return true;
      }
      // check whether default object is included in selected items
      if (this.isPredefinedObject(selectedRows)) {
        return true;
      }
      // If objects are in a different domain, they cannot be edited
      if (this.isDifferentDomain(selectedRows)) {
        return true;
      }
      //If policy is locked
      if(this.isPolicyLocked(selectedRows)){
        return true;
      }
      return false;
    },

    isDisabledDelete: function(eventName, selectedRows) {
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
      //Check if group row is selected
      if(this.isGroupSelected(selectedRows)) {
        return true;
      }
      // check whether default object is included in selected items
      if (this.isPredefinedObject(selectedRows)) {
        return true;
      }
      // If objects are in a different domain, they cannot be deleted
      if (this.isDifferentDomain(selectedRows)) {
        return true;
      }
      //If policy is locked
      if(this.isPolicyLocked(selectedRows)){
        return true;
      }
      //If policy is a global policy (All pre and All post)
      if(this.isGlobalPolicy(selectedRows)){
        return true;
      }
      return false;
    },

    isDisabledAssignToDomain: function(eventName, selectedRows) {
      // Check if it is atleast single row selection
      if (selectedRows.length < 1) {
        return true;
      }
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);

      // check whether default object is included in selected items
      if (this.isPredefinedObject(selectedRows)) {
        return true;
      }
      //If policy is a global policy (All pre and All post)
      if(this.isGlobalPolicy(selectedRows)){
        return true;
      }
      // If objects are in a different domain, they cannot be assigned to domain
      if (this.isDifferentDomain(selectedRows)) {
        return true;
      }
      //If policy is locked
      if (this.isPolicyLocked(selectedRows)) {
        return true;
      }
      return false;
    },

    isDisabledDeleteButton: function(selectedRows) {
      // If no objects are selected, "delete" is disabled
      if (!selectedRows || selectedRows.length < 1)
      {
        return true;
      }
      return this.isDisabledDelete(null,selectedRows);
    },

    isDisabledEditButton: function(selectedRows) {
      return this.isDisabledEdit(null,selectedRows);
    },

    isDisabledPublishButton: function(selectedRows){
      // If no objects are selected, "publish" is disabled
      if (!selectedRows || selectedRows.length < 1)
      {
        return true;
      }
      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);
      //if policy is in draft state, "publish" is disabled
      if(this.isDraftPolicy(selectedRows)){
        return true;
      }

      // If objects are in a different domain, they cannot be assigned to domain
      if (this.isDifferentDomain(selectedRows)) {
        return true;
      }

      //Check if group row is selected
      if(this.isGroupSelected(selectedRows)) {
        return true;
      }
      return false;
    },

    isDisabledUpdateButton: function(selectedRows){
      // If no objects are selected, "update" is disabled
      if (!selectedRows || selectedRows.length < 1)
      {
        return true;
      }

      selectedRows = this.getRecordsFromPolicyCollection(selectedRows);

      // If objects are in a different domain, they cannot be assigned to domain
      if (this.isDifferentDomain(selectedRows)) {
        return true;
      }
      //if policy is in draft state, "update" is disabled
      if(this.isDraftPolicy(selectedRows)){
        return true;
      }
      //Check if group row is selected
      if(this.isGroupSelected(selectedRows)) {
        return true;
      }
      return false;
    },

    isGroupSelected: function(selectedRows){
      for (var i=0; i<selectedRows.length; i++) {
        var predefinedGroupSelected = selectedRows[i].isPredefinedGroupSelected();
        if (predefinedGroupSelected) {
          return true;
        }
      }
      return false;
    },


    onUnassignDeviceEvent: function() {
      var self = this;

      var confirmDialogConf = {
        title: self.getContext().getMessage('action_unassign_device_confirm_title'),
        question: self.getContext().getMessage('action_unassign_device_confirm_question'),
        onYesEvent: $.proxy(self.unassignDevice, self),
        xIcon: false,
        kind: 'warning'
      };
      this.createConfirmationDialog(confirmDialogConf);
    },

    unassignDevice: function() {
      var self = this, policyId = self.view.gridWidget.getSelectedRows()[0].id,
          policyManagementConstants = self.policyManagementConstants;
      this.closeConfirmationDialog();

      self.progressBar = new ProgressBarForm({
        statusText: self.context.getMessage("action_unassign_device_progress_text"),
        title: self.context.getMessage("action_unassign_device_progress_title"),
        hasPercentRate: false
      });

      self.progressBarOverlay = new OverlayWidget({
        view: self.progressBar,
        type: 'small',
        showScrollbar: false
      });
      self.progressBarOverlay.build();

      $.ajax({
        url: policyManagementConstants.getDevicesForPolicyURLRoot(policyId),
        type: 'get',
        dataType: 'json',
        headers: {
          'accept': policyManagementConstants.POLICY_DEVICESFORPOLICY_ACCEPT_HEADER
        },
        success: function(data, status) {
          if(data['devices'] !== undefined && data['devices']['device'] !== undefined) {
            var deviceIds = [], devices = data['devices']['device'];
            devices = $.isArray(devices)? devices : [devices];
            $.each(devices, function (index, object) {
              deviceIds.push(object.id+"");
            });
            self.unassignDeviceCall(deviceIds,policyId);
          }
        },
        error: function() {
          console.log('Devices for policy not fetched');
        },
        async: false
      });
    },

    unassignDeviceCall: function(deviceIds,policyId) {
      var self = this, policyManagementConstants = self.policyManagementConstants,
          properties =  {},deletedIdsArr = [];
      deviceIds.forEach(function (object) {
        if (object !== "") {
          deletedIdsArr.push({
            "id":object
          });
        }
      });
      properties["add-list"]= {};
      properties["delete-list"]={"device":deletedIdsArr};

      var model= new AssignDevicesModel({
        assignDevicesURLRoot: policyManagementConstants.getAssignDevicesURLRoot(policyId),
        assignDevicesContentType: policyManagementConstants.POLICY_ASSIGN_DEV_CONTENT_HEADER
      });
      model.save(properties, {
        success: function (model, response, options) {
          console.log("Unassign devices success");
          self.progressBarOverlay.destroy();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Unassign devices failed");
          self.progressBarOverlay.destroy();
        }
      });
    },

    /*beforeDeleteCallback : function(){
      var self=this;
      self.progressBar = new ProgressBarForm({
        statusText: self.context.getMessage("action_delete_policy_progress_text"),
        title: self.context.getMessage("action_delete_policy_progress_title"),
        hasPercentRate: false
      });

      self.progressBarOverlay = new OverlayWidget({
        view: self.progressBar,
        type: 'small',
        showScrollbar: false
      });
      console.log("start progress bar");
      self.progressBarOverlay.build();
    },

    startDeleteActivity : function(selectedRows, isSelectAll, allRowIds, selectedRowIds) {
      var self = this, selectedPolicies = self.getSelectedPolicies(selectedRows),
        rowIds = isSelectAll ? allRowIds : _.pluck(selectedPolicies, 'id');
      self.beforeDeleteCallback();
      var dataObj = self.getDeleteIDListObject(rowIds);
      $.ajax({
        type: 'POST',
        url: self.getDeleteObjectsUrl(),
        data: JSON.stringify(dataObj),
        //timeout : 120000,
        headers: {
          "Content-Type": self.getDeleteObjectContentType()
        },
        dataType: "json",
        success: ($.proxy(self.onDeleteSuccess,self)),
        error: ($.proxy(self.onDeleteError,self))
      });
    },*/

    getDeleteIDListObject: function (idArr) {
      return { 'id-list' :{'ids': idArr}};
    },

    getDeleteObjectsUrl: function() {
      return this.policyManagementConstants.POLICY_URL + this.policyManagementConstants.POLICY_DELETE;
    },

    getDeleteObjectContentType: function() {
      return this.policyManagementConstants.POLICY_DELETE_CONTENT_TYPE;
    },

    /*onDeleteSuccess : function(data){
      var self=this;
      console.log("destroy progress bar on success");
      self.progressBarOverlay.destroy();
      GridActivity.prototype.onDeleteSuccess.call(self);
    },

    onDeleteError : function(XMLHttpRequest, textStatus, errorThrown, selectedRowIds, selectedRows){
      var self=this;
      console.log("destroy progress bar on error");
      self.progressBarOverlay.destroy();
      GridActivity.prototype.onDeleteError.call(self);
    },*/

    /**
     *  @overridden from gridActivity
     */
    onAssignDevicesEvent: function() {
      var self = this,
          model = self.getNewModelInstance(),
          policyId = this.view.gridWidget.getSelectedRows()[0].id,
          policyManagementConstants = this.policyManagementConstants;
      model.set('id', policyId);
      model.fetch({
        success: function (collection, response, options) {
          AssignDevicesActivity.launchOverlay({
            activity: self,
            model: model,
            policyManagementConstants: policyManagementConstants
          });
        },
        error: function (collection, response, options) {
          console.log('Policy model not fetched');
        }
      });
    }
  });

  return BasePoliciesActivity;
});
