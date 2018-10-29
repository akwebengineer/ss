/**
 * View to show profile versions
 *
 * @module ManageVersionView
 * @author <dkumara@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
  'backbone',
  'widgets/form/formWidget',
  'widgets/grid/gridWidget',
  '../conf/manageVersionFormConfiguration.js',
  '../conf/manageVersionGridConfiguration.js',
  '../../../../../security-management/js/importconfig/views/importConfigWizardView.js',
  'widgets/overlay/overlayWidget',
  './createSnapshotView.js',
  './compareSnapshotVersionView.js',
  'widgets/confirmationDialog/confirmationDialogWidget',
  '../../../../../security-management/js/publish/snapshot/views/snapShotMaxCountValidator.js',
  '../../../../../ui-common/js/common/utils/SmUtil.js'
], function (Backbone, FormWidget, GridWidget, FormConf, ManageVersionGridConfiguration, RollbackWizard,
             OverlayWidget, CreateSnapshotView, CompareVersionView, ConfirmationDialogWidget, SnapShotMaxCountValidator, SmUtil) {

  // return true if the context item should be disabled; return false if the context item should be enabled
  var setItemStatus = function (key, isItemDisabled, selectedRows){
    console.log("setItemStatus:" + key + ": ");
    console.log(selectedRows);
    return false;
  };

  var ManageVersionView = Backbone.View.extend({

    events: {
      'click #managerollback-groups-close': "closeView"
    },

    closeView: function(event) {
      event.preventDefault();
      this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
      this.activity.finish();
      this.activity.overlay.destroy();
    },

    initialize: function(options) {
      this.activity = options.activity;
      this.policy = options.policy;
      this.context = options.activity.getContext();
      this.params = options.params;
      this.policyManagementConstants=this.params.policyManagementConstants;
      this.gridConf = new ManageVersionGridConfiguration(this.context,this.policyManagementConstants,this.policy.get("id"));
      this.model = new Backbone.Collection();
      this.snapshotpolicyActivity = options.snapshotpolicyActivity;
      this.actionEvents = {
        deleteVersion:"deleteVersion",
        managerollback : "rollbackEvent",
        createsnapshotVersion : "createsnapshotVersion",
        compareVersion: "compareVersionEvent"
      };
      this.bindGridEvents();
    },

    render: function() {
      var self = this;
      var formConfiguration = new FormConf(this.context);
      var formElements = formConfiguration.getValues();

      this.form = new FormWidget({
        container: this.el,
        elements: formElements
      });

      this.form.build();
      this.addGridWidget();
      this.$el.addClass("security-management");
      this.initButtonStatus();
      return this;
    },

    hasReadOnlyPermission: function() {
      var self = this;
      if (Juniper.sm.DomainProvider.isNotCurrentDomain(self.policy.get('domain-id'))) {
        return true;
      }

      //check if user has permission with capability
      if(!new SmUtil().checkPermission(self.policyManagementConstants.MODIFY_CAPABILITY)) {
        return true;
      }

      return false;
    },

    initButtonStatus: function(){
      var self = this,
          deleteButton = self.$el.find("#deleteVersion_button"),
          rollbackButton = self.$el.find("#managerollback_button"),
          compareButton = self.$el.find("#compareVersion_button"),
          createSnapshotButton = self.$el.find("#createsnapshotVersion_button");
      if(self.policyManagementConstants.SERVICE_TYPE && self.policyManagementConstants.SERVICE_TYPE === 'ips'){
        compareButton.hide();
      }
      deleteButton.addClass("disabled");
      compareButton.addClass("disabled");
      rollbackButton.addClass("disabled");

      //Show Create, Rollback and Delete only if user has permissions
      if (self.hasReadOnlyPermission()) {
        createSnapshotButton.hide();
        deleteButton.hide();
        rollbackButton.hide();
      }
      if(self.policy.isPolicyLocked()){
          rollbackButton.addClass("disabled");
      }
    },

    addGridWidget: function() {
      var gridElements = this.gridConf.getValues(),
          gridContainer = this.$el.find('.gridWidgetPlaceHolder');
      gridContainer.empty();
      gridElements.contextMenuItemStatus = setItemStatus;
      this.gridWidget = new GridWidget({
        container: gridContainer,
        elements: gridElements,
        actionEvents:this.actionEvents
      });
      this.gridWidget.build();
    },

    onRollbackEvent : function() {
      var intent = new Slipstream.SDK.Intent("sd.intent.action.ACTION_ROLLBACK",
          {
            mime_type: "vnd.juniper.net.rollback"
          }
      );
      intent.putExtras(
          {
            "data":{
              "selectedRecord":this.gridWidget.getSelectedRows()[0],
              "service":this.policyManagementConstants.SERVICE_TYPE
            }
          });
      this.context.startActivity(intent);


    },
    onSnapshotVersionEvent : function() {
      var self = this,
          smv = new SnapShotMaxCountValidator({
            "context":self.context,
            "serviceType":self.policyManagementConstants.SERVICE_TYPE,
            "policyOptions": {"selectedPolicies": [self.params.selectedRow]},
            "snapshotCallback": $.proxy(self.launchCreateSnapShotOverlay, self)
          });
      smv.checkForSnapShotMaxCount();


    },
    launchCreateSnapShotOverlay : function(deleteOldestSnapshot) {
      var self = this;
      var options = {
            "size": "small",
            "showScrollbar": "false"
          },
          view = new CreateSnapshotView({
            activity: self.activity,
            params: self.params,
            deleteOldestSnapshot: deleteOldestSnapshot,
            gridWidget:self.gridWidget,
            "snapshotCreateCallback": $.proxy(self.initButtonStatus, self)
          });
      self.activity.buildOverlay(view, options);

    },
    onCompareVersionEvent : function() {
      var self = this;
      self.params.record1 = self.gridWidget.getSelectedRows()[0];
      self.params.record2 = self.gridWidget.getSelectedRows()[1];
      this.compareBar = new CompareVersionView({
        "parentView": this,
        "params": self.params
      });
      this.compareBar.startCompareJob();
    },

    doButtonValidation: function(selectedRows) {
      var self = this;
      var numberOfRow = selectedRows.length;
      var data = selectedRows;
      var currentVersionSelected = false;
      data && data.forEach(function(element) {
        if (element["snapshot-version"] == "Current") {
          currentVersionSelected = true;
        }
      });

      var deleteButton = self.$el.find("#deleteVersion_button"),
          compareButton = self.$el.find("#compareVersion_button"),
          rollbackButton = self.$el.find("#managerollback_button"),
          deleteDisable, compareDisable, rollbackDisable;
      if (numberOfRow === 0) {
        deleteDisable = true;
        compareDisable = true;
        rollbackDisable = true;
      } else if (numberOfRow === 1) {
        deleteDisable = false;
        compareDisable = true;
        rollbackDisable = false;
      } else if (numberOfRow === 2) {
        deleteDisable = false;
        compareDisable = false;
        rollbackDisable = true;
      } else if (numberOfRow > 2) {
        deleteDisable = false;
        compareDisable = true;
        rollbackDisable = true;
      }
      if (currentVersionSelected || Juniper.sm.DomainProvider.isNotCurrentDomain(self.policy.get('domain-id'))) {
        deleteDisable = true;
        rollbackDisable = true;
      }
      if(self.policy.isPolicyLocked()) {
        rollbackDisable = true;
      }
      deleteDisable? deleteButton.removeClass("disabled").addClass("disabled") : deleteButton.removeClass("disabled");
      compareDisable? compareButton.removeClass("disabled").addClass("disabled") : compareButton.removeClass("disabled");
      rollbackDisable? rollbackButton.removeClass("disabled").addClass("disabled") : rollbackButton.removeClass("disabled");
    },

    bindGridEvents: function () {
      var self = this;
      this.$el
          .bind(this.actionEvents.deleteVersion, function(e, selectedRows){
            self.handleDelete(e, selectedRows);

          })
          .bind(this.actionEvents.mergeEvent, function(e, selectedRows){

          })
          .bind(this.actionEvents.findUsageEvent, function(e, selectedRows){
            self.activity.overlay.destroy();
            self.activity.onFindUsageEvent(e, selectedRows);
          })
          .bind(this.actionEvents.managerollback, $.proxy(this.onRollbackEvent, this))
          .bind(this.actionEvents.createsnapshotVersion, $.proxy(this.onSnapshotVersionEvent, this))
          .bind(this.actionEvents.compareVersion, $.proxy(this.onCompareVersionEvent, this))
          .bind("gridOnRowSelection", function(e, selectedRows){
            self.doButtonValidation(selectedRows.selectedRows);
          });
    },

    handleDelete: function(e, selectedRows) {
      var self =this;

      var OkButtonCallback = function () {
        confirmationDialogWidget.destroy();

        var idArr = [];
        var deletedRows = selectedRows.selectedRows;

        for (var i=0; i<deletedRows.length; i++) {
          idArr.push(deletedRows[i]['snapshot-version']);
        }

        var dataObj = {
          "id-list":
          {
            'ids': idArr
          }
        };
        var onDeleteSuccess = function (data) {
          self.notify('success', self.context.getMessage("delete_success"));
          self.gridWidget.reloadGrid({
             resetSelection : true
          });
          self.initButtonStatus();
        };

        var onDeleteError = function () {
          self.notify('error', self.context.getMessage("delete_error"));
        };

        $.ajax({
          url: self.policyManagementConstants.POLICY_URL + self.params.selectedRow.id + '/delete',
          headers: {
            "Content-Type": self.policyManagementConstants.DELETE_CONTENT_TYPE
          },
          type: "POST",
          data: JSON.stringify(dataObj),
          success: onDeleteSuccess,
          error: onDeleteError
        });

      };

      var cancelButtonCallback = function () {
        confirmationDialogWidget.destroy();
      };

      var conf = {
        title: 'Warning',
        question: self.context.getMessage('snapshot_delete_confirmation'),
        yesButtonLabel: 'Yes',
        yesButtonCallback: OkButtonCallback,
        noButtonLabel: 'Cancel',
        noButtonCallback: cancelButtonCallback,
        kind: 'warning'
      };
      var confirmationDialogWidget = new ConfirmationDialogWidget(conf);
      confirmationDialogWidget.build();

    },



    /**
     *  Helper method to display a toast/non-persistent notification
     */
    notify: function(type, message) {
      new Slipstream.SDK.Notification()
          .setText(message)
          .setType(type)
          .notify();
    }
  });

  return ManageVersionView;
});
