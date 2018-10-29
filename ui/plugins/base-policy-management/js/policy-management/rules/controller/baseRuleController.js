/*
 Firewall rule grid controller
 */
define([
  'widgets/confirmationDialog/confirmationDialogWidget',
     '../util/lockManager.js',
     '../../../../../sd-common/js/common/utils/Timer.js',

     'widgets/overlay/overlayWidget',
     '../views/saveCommentsFormView.js'
], function(ConfirmationDialogWidget, LockManager, Timer, OverlayWidget,SaveCommentsView) {

    var mCurrentIndexInNavigation = -1;
    var RuleController = function() {};

    _.extend(RuleController.prototype, {

        policyManagementConstants: undefined,

        setContext: function(options) {
            var me = this;
            me.policyObj = options.policyObj;
            me.launchWizard = options.launchWizard;
            me.context = options.context;
            me.cuid = options.cuid;
            me.extras = options.extras;
            me.showNavigationControls = options.showNavigationControls === true ? true : false;
        },

        initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
            var me = this;
            me.ruleCollection = new RuleCollection(me.cuid, me.policyObj ,me.context);
            me.policyManagementConstants = PolicyManagementConstants;
            mCurrentIndexInNavigation = -1;

            me.view = new RulesView({
                context: me.context,
                actionEvents: me.actionEvents,
                ruleCollection: me.ruleCollection,
                policyManagementConstants: PolicyManagementConstants,
                cuid: me.cuid,
                customColumns: me.activity.customColumns,
                extras: me.extras,
                objectsViewData : me.getObjectsViewData() // shared Object menu option value
            });

            me.actionEvents = me.view.actionEvents;
            me.isScrolling = false;
            me.editRowMap = [];
            me.bindModelEvents();
            me.bindGridEvents();
            me.reloadPage(true);
//            me.ruleCollection.fetch({
//                reset: true,
//                page: 1,
//                rows: me.policyManagementConstants.DEFAULT_PAGE_SIZE
//            });
            if (me.ENABLE_LOCKING) {
                me.initializeLockManager();
            }
            me.checkCopiedRules();
            //
            if(me.showNavigationControls){
                me.ruleCollection.getOrderedListOfRuleIds(function(response){
                    me.orderedListOfRuleIds = response["ruleIdList"]["ruleIDs"];
                    me.bindNavigationEvents();
                }, function(error){
                    console.log(error);
                });                
            };
            //
        },

        checkCopiedRules: function() {
            this.ruleCollection.checkCopiedRules();
        },

        initializeLockManager: function () {
            var me = this;
            me.lockManager = new LockManager();
            me.lockManager.setup({
                policyManagementConstants: me.policyManagementConstants,
                view: me.view,
                cuid: me.cuid
            });
        },

        bindModelEvents: function() {
            var self = this, ruleCollection = self.ruleCollection;
            ruleCollection.bind('fetchComplete', $.proxy(self.handleFetchComplete, self)
            ).bind('fetchStart', $.proxy(self.handleFetchStart, self)
            ).bind('refresh-page', function(actions, showFirst, noSpinner, scrollForward) {
                self.handleRefreshPage(actions, showFirst, noSpinner, scrollForward);
            }).bind("after-policy-save", $.proxy(self.handlePolicySaved, self))
            .bind("load-filtered", function() {
                self.reloadPage(true);
            }).bind("clearSelection", $.proxy(self.deSelectRules, self)
            ).bind("closeRuleWizard",function(e, flag){
                self.overlay.destroy();
                self.reloadPage();
                return false;
            }).bind("afterCreateRule",function(data){
                self.handleAfterCreateRule(data);
            }).bind("highlightRule",function(data){
                self.handleHighlightRow(data);
            }).bind("before-policy-save", $.proxy(self.handleBeforePolicySave,self))
            .bind('rule-collection-dirty', function() {
              self.policyStatusMsgChangeHandler();
            });

          //update the button status and policy message on fetch complete
          ruleCollection.once('fetchComplete', function() {
            self.policyStatusMsgChangeHandler();
          });
        },

        deSelectRules: function (ruleIds) {
        	var me = this,
        			selectedRules = me.getSelectedRows(),
        			selectedRuleIds = _.isArray(selectedRules)? _.pluck(selectedRules, 'id') : [];

        	ruleIds = _.intersection(ruleIds, selectedRuleIds);
        	me.toggleSelections(ruleIds);
        },

        handleBeforePolicySave : function() {
          var self = this;
          self.ruleCollection.setSavePolicyInProgress(true);
          $(self.view.$el).trigger('showloading');
        },

        emptyGridRows: function() {
            var self = this,
                gridTable = self.view.getGridTable(),
                grid = self.view.getGridTable()[0].grid;
            gridTable.jqGrid('clearGridData');
            grid.bDiv.scrollTop = 0;
        },

      /**
       * lock the policy on create rule, if locked then let it go through.
       */
      registerCreateEventHandler: function () {
        var self = this;
        if (self.actionEvents.createEvent) {
          self.view.$el.bind(self.actionEvents.createEvent.name, function (e, gridRowsObject) {
            if (self.ENABLE_LOCKING && !self.lockManager.selfPolicyLockObject) {
              //try to acquire lock on the policy
              //if it succeeds then allow edit
              //else say that lock cannot be acquired and make the page read only
              self.lockManager.lockPolicy($.proxy(function (response, status) {
                switch (status) {
                  case "success":
                    self.createRuleHandler();
                    break;
                  case "error":
                    self.view.$el.trigger("policy-read-only-error", [false, response, true]);
                    break;
                }
              }, self));
            } else {
              self.createRuleHandler();
            }
          });
        }
      },

        /**
         * It registers the delete event action. Delete rules from the collection
         */
        registerDeleteEventHandler: function () {
            var self = this, i, ruleCollection = self.ruleCollection;
            if (self.actionEvents.deleteEvent) {
                self.view.$el.bind(self.actionEvents.deleteEvent.name, function (e, gridRowsObject) {

                    var deletedRows = gridRowsObject.deletedRows,
                        deletedIds = [];
                    if (deletedRows.length !== 0) {
                        for (i = 0; i < deletedRows.length; i++) {
                            deletedIds.push(deletedRows[i][self.policyManagementConstants.JSON_ID]);
                        }
                    }
                    ruleCollection.deleteRule(deletedIds);
                });
            }
        },

        registerPublishRuleHandler: function () {
            var self = this, i, ruleCollection = self.ruleCollection;
            if (self.actionEvents.publishRules) {
                self.view.$el.bind(self.actionEvents.publishRules.name, function (e, gridRowsObject) {
                    console.log("Publish rules clicked");
                    var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_PUBLISH', {
                        mime_type: self.policyManagementConstants.PUBLISH_MIME_TYPE
                    });
                    intent.putExtras({selectedPolicies: [self.ruleCollection.policy]});

                    self.context.startActivityForResult(intent, function (resultCode, data) {
                        if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                            console.log("Publish activity successful");
                            //trigger event to disable the policy button and enable the update button
                            self.view.$el.trigger('publish-policy');
                        }
                    });
                });
            }
        },

        registerPublishUpdateRuleHandler: function () {
            var self = this, i, ruleCollection = self.ruleCollection;
            if (self.actionEvents.updatePublishedRules) {
                self.view.$el.bind(self.actionEvents.updatePublishedRules.name, function (e, gridRowsObject) {
                    console.log("Update Published rules clicked");
                    var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_UPDATE', {
                        mime_type: self.policyManagementConstants.UPDATE_MIME_TYPE
                    });
                    intent.putExtras({selectedPolicies: [self.ruleCollection.policy]});

                    self.context.startActivityForResult(intent, function (resultCode, data) {
                        if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                            console.log("Publish and update activity successful");
                            //trigger event to disable the update button
                            self.view.$el.trigger('update-policy');
                        }
                    });
                });
            }
        },

        bindNavigationEvents: function(){
            var me=this;
            //listen to rulegridreloadcomplete event to disable/enable the navigation controls
            me.view.$el.off("rulegridreloadcomplete").on("rulegridreloadcomplete", function(){
                me.enableDisableNavigationButtons();
            });
        },
        /**
        method to handle navigating to first rule in the rule change list
        */        
        navigateToFirstRule: function(e, gridRowsObject){
            var me=this;
            if(mCurrentIndexInNavigation !== 0){
                mCurrentIndexInNavigation = 0;
                me.ruleCollection.highlightRule("highlightRule", {ruleIds:[me.orderedListOfRuleIds[mCurrentIndexInNavigation]], isRowEditable:false, onNavigation: true});
            };
            me.enableDisableNavigationButtons();
        },
        /**
        method to handle navigating to next rule in the rule change list
        */
        navigateToNextRule: function(e, gridRowsObject){
            var me=this;
            if(mCurrentIndexInNavigation !== me.orderedListOfRuleIds.length -1){
                me.ruleCollection.highlightRule("highlightRule", {ruleIds:[me.orderedListOfRuleIds[++mCurrentIndexInNavigation]], isRowEditable:false, onNavigation: true});
            };
            me.enableDisableNavigationButtons();
        },
        /**
        method to handle navigating to previous rule in the rule change list
        */
        navigateToPreviousRule: function(e, gridRowsObject){
            var me=this;
            if(mCurrentIndexInNavigation !== 0){
                me.ruleCollection.highlightRule("highlightRule", {ruleIds:[me.orderedListOfRuleIds[--mCurrentIndexInNavigation]], isRowEditable:false, onNavigation: true});
            };
            me.enableDisableNavigationButtons();
        },
        /**
        method to handle navigating to last rule in the rule change list
        */        
        navigateToLastRule: function(e, gridRowsObject){
            var me=this;
            if(mCurrentIndexInNavigation !== me.orderedListOfRuleIds.length -1){
                mCurrentIndexInNavigation = me.orderedListOfRuleIds.length -1;
                me.ruleCollection.highlightRule("highlightRule", {ruleIds:[me.orderedListOfRuleIds[mCurrentIndexInNavigation]], isRowEditable:false, onNavigation: true});
            };
            me.enableDisableNavigationButtons();
        },
        /**
        Enable or Disable the navigation buttons based on the index only if ordered list array length > 0. 
        */
        enableDisableNavigationButtons: function(){
            var me=this,
                $parentContainer = me.view.$el;
            if(me.orderedListOfRuleIds.length > 0){//means enable all the navigation buttons
                $parentContainer.find("#navigateToFirstRule .iconImg").removeClass("block_icon_button_first_disable");
                $parentContainer.find("#navigateToPreviousRule .iconImg").removeClass("block_icon_button_previous_disable");
                $parentContainer.find("#navigateToNextRule .iconImg").removeClass("block_icon_button_next_disable");
                $parentContainer.find("#navigateToLastRule .iconImg").removeClass("block_icon_button_last_disable");
            }
            //
            if(mCurrentIndexInNavigation === 0 || mCurrentIndexInNavigation === -1){//disable the previous and first button
                $parentContainer.find("#navigateToFirstRule .iconImg").addClass("block_icon_button_first_disable");
                $parentContainer.find("#navigateToPreviousRule .iconImg").addClass("block_icon_button_previous_disable");
            }
            //
            if(mCurrentIndexInNavigation === me.orderedListOfRuleIds.length -1){//disable the next and last button
                $parentContainer.find("#navigateToNextRule .iconImg").addClass("block_icon_button_next_disable");
                $parentContainer.find("#navigateToLastRule .iconImg").addClass("block_icon_button_last_disable");
            };
            //
        },
        //
      bindGridEvents: function () {
            var self = this, ruleCollection = self.ruleCollection, i = 0;
            //
            if(self.actionEvents.navigateToFirstRule){
                self.view.$el.bind(self.actionEvents.navigateToFirstRule.name, $.proxy(self.navigateToFirstRule, self));
            };
            //
            if(self.actionEvents.navigateToPreviousRule){
                self.view.$el.bind(self.actionEvents.navigateToPreviousRule.name, $.proxy(self.navigateToPreviousRule, self));
            };
            //
            if(self.actionEvents.navigateToNextRule){
                self.view.$el.bind(self.actionEvents.navigateToNextRule.name, $.proxy(self.navigateToNextRule, self));
            };
            //
            if(self.actionEvents.navigateToLastRule){
                self.view.$el.bind(self.actionEvents.navigateToLastRule.name, $.proxy(self.navigateToLastRule, self));
            };
            //
            self.registerCreateEventHandler();
            if (self.actionEvents.updateEvent) {
                self.view.$el.bind(self.actionEvents.updateEvent.name, function (e, gridRowsObject) {
                    self.editRuleHandler(gridRowsObject, e);
                });
            }

            self.registerDeleteEventHandler();
            if (self.actionEvents.expandAllRules) {
                self.view.$el.bind(self.actionEvents.expandAllRules.name, function (e, gridRowsObject) {
                    console.log("Expand All rules clicked");
                    ruleCollection.expandAllRules();
                });
            }
            if (self.actionEvents.collapseAllRules) {
                self.view.$el.bind(self.actionEvents.collapseAllRules.name, function (e, gridRowsObject) {
                    console.log("Collapse All rules clicked");
                    ruleCollection.collapseAllRules();
                });
            }
            if (self.actionEvents.saveRules) {
                self.view.$el.bind(self.actionEvents.saveRules.name, function (e, gridRowsObject) {
                    console.log("Save rules clicked");
                    self.handleSaveButton();
                });
            }
            if (self.actionEvents.discardRules) {
                self.view.$el.bind(self.actionEvents.discardRules.name, function (e, gridRowsObject) {
                    console.log("Discard rules clicked");
                    self.handleDiscardButton();
                });
            }
            self.registerPublishRuleHandler();
            self.registerPublishUpdateRuleHandler();

            self.view.$el.bind("gridRowOnEditMode", function (e, editModeRow) {
                self.handleRowDataEdit(editModeRow);
            })
            .bind("gridOnRowSelection", function (e, editModeRow) {
                var selectedRows = self.getSelectedRows();
                self.view.updateSelectionState(selectedRows);
            })
            .bind("treegridnodeexpand", function (e, rule) {
                self.ruleGroupExpandCollapseHandler(rule, "expand");
            })
            .bind("treegridnodecollapse", $.proxy(self.collapseRuleGroup, self))
            .bind("gridOnPageRequest", function(e, pageRequest){
                self.handleGridOnPageRequest(pageRequest);
                return false;
            })
            .bind("gridTableEmpty", function(e) {
                ruleCollection.resetCollection = true;
            })
            //Policy modified or deleted notification
            .bind("policy-modified", function(e, args) {
                self.policyModifiedNotificationHandler(args);
            })
            //When different user acquires lock, lock manager fires policy-read-only notification to change rules page as read-only
            .bind("policy-read-only", function(e,isPolicyReadOnly,userName) {
              self.policyReadOnlyHandler(isPolicyReadOnly,userName);
            })
            .bind('exportRulesToPDF', $.proxy(self.view.exportRulesToPDF, self.view))
            .bind("policy-status-msg-change", $.proxy(self.policyStatusMsgChangeHandler, self))
            .bind("close-overlays", $.proxy(self.closeOverlays,self))
            .bind("reloadRuleGrid", function () {
                  self.reloadPage();
                })
            .bind("logScrollPosition", function(){
                  console.log(" Current  scroll position " + self.view.gridWidgetObject.getScrollPosition());
                })
            .bind("collectionRule", function(e, rowData){
                var selectedIds = rowData.selectedRowIds,
                len = selectedIds.length;
                if(len !== 0){
                    console.log("Collection selected rule(s)");
                    for(var i = 0;i < len ;i++){
                        var rule = self.ruleCollection.get(selectedIds[i]);
                        console.log(rule.toJSON());
                    }
                }
            })
            .bind("gridRule", function(e, rowData){
                console.log("Gird selected rule(s)");
                console.log(rowData.selectedRows);
            })
            .bind("gridCollection", function(e, rowData){
                console.log("Grid Collection");
                console.log(self.ruleCollection.toJSON());
            })
            .bind("gridViewPort", function(e, rowData){
                console.log("Grid View Port");
                console.log(self.view.gridWidgetObject.getViewportRows());
            });
        },

        /**
         * Handle page request on scrolling
         * @param pageRequest
         */
        handleGridOnPageRequest: function(pageRequest) {
            var self = this;
            if (self.isScrolling && pageRequest.pageRequest === self.pageRequested) {
                console.log('Already the given page ' + self.pageRequested +'is requested');
                return;
            }

            // set scroll flag
            self.isScrolling = true;

            self.pageRequested = pageRequest.pageRequest;
            console.log("Page from grid on pageRequest " + pageRequest.pageRequest);

            self.removeEditMode(self.editRowMap, true);

            // store the
            self.ruleCollection.fetch({ page: pageRequest.pageRequest, rows : self.policyManagementConstants.DEFAULT_PAGE_SIZE, scrollForward: true});
            //setting result to false as this will ensure that loading in the grid will be stopped
            pageRequest.result = false;
        },

        closeOverlays : function() {
          var self=this;
          if(self.overlay) {
              self.overlay.destroy();
          }
          $.each(self.view.cellOverlayViews, function(i,view){
            view.options.close();
          });
        },

        /**
         * Creates confirmation dialog. Handles callback on confirmation or deny
         * @param conf Dialog configuration
         * @param onConfirmCallback
         * @param onDenyCallback
         */
        createConfirmationDialog: function (conf, onConfirmCallback, onDenyCallback) {
            var self = this, confirmationDialogWidget;

            confirmationDialogWidget = new ConfirmationDialogWidget(conf);

            // On confirm trigger handler
            confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (onConfirmCallback) {
                    onConfirmCallback.call();
                }
                // destroy the dialog
                confirmationDialogWidget.destroy();
                self.confirmationDialogWidget = null;
            });

            // On deny trigger handler
            confirmationDialogWidget.vent.on('noEventTriggered', function() {
                if (onDenyCallback) {
                    onDenyCallback.call();
                }
                // destroy the dialog
                confirmationDialogWidget.destroy();
                self.confirmationDialogWidget = null;
            });

            // creates the dialog
            confirmationDialogWidget.build();

            // store the copy
            self.confirmationDialogWidget = confirmationDialogWidget;

        },

        getSelectedRows: function() {
        	var me = this;
        	return me.view.gridWidgetObject.getSelectedRows();
        },

        /**
         * collapse rule group handler. need to unselect all the child members of the group
         *
         */
        collapseRuleGroup: function (e, rule) {
          var me = this;
          me.ruleGroupExpandCollapseHandler(rule, "collapse");
        },

        policyReadOnlyHandler : function(isPolicyReadOnly,userName){
          var self=this;
          self.ruleCollection.setPolicyReadOnly(isPolicyReadOnly);
          self.view.$el.trigger("policy-status-msg-change");
        },

        policyModifiedNotificationHandler : function(args) {
            var self=this;
            console.log("policy modified notification");
            if(self.ruleCollection.isSavePolicyInProgress()) {
                var firePolicyModifiedEvent = $.proxy(self.triggerPolicyModifiedHandler,self);
                _.delay(firePolicyModifiedEvent,2000);
            } else {
                self.triggerPolicyModifiedHandler();
            }
        },

        //Trigger policy modified handler
        triggerPolicyModifiedHandler : function(){
            var self=this;
            self.ruleCollection.getPolicy($.proxy(function(data) {
                self.policyStatusMsgChangeHandler();
                var newPolicyObj = self.getPolicyObject(data);
                self.policyModifiedHandler(newPolicyObj);
            }, self));
        },

        //Override this method in case the policy object is not sent as {policy:Object}
        getPolicyObject : function(data){
          return data && data.policy && data.policy.id? data.policy : undefined;
        },

        policyModifiedHandler : function(newPolicyObj){
          var self=this, policyName = self.ruleCollection.policy.name,conf
          //if policy is undefined, then some other user has deleted the policy
          //tested to be working fine
          if(newPolicyObj === undefined) {
              //give a message that some other user has deleted the policy and navigate back to policies listing page
              conf = {
                  title: "Error",
                  question: "The policy "+'\"'+policyName+'\" is deleted. Redirecting to policy page.',
                  yesButtonLabel: self.view.context.getMessage('ok'),
                  yesButtonTrigger:'yesEventTriggered',
                  kind: 'error'
              };

              self.createConfirmationDialog(conf, function() {
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST, {
                        'mime_type': self.policyManagementConstants.POLICY_MIME_TYPE
                    }
                );
                self.view.context.startActivityForResult(intent);
              });

          } else {
                //if policy is modified check if locking is enabled for the feature
                //If yes - Lock manager to handle the notification
                //Else - case 1 - if current user has local changes then warn the user that policy is modified and provide save as option to features
                //case 2 - if current user doesnt have any local changes then warn the user that policy is modified and reload the rules
                if(self.ENABLE_LOCKING) {
                  self.lockManager.policyModifiedHandler(newPolicyObj);
                } else {
                  if(newPolicyObj['edit-version'] !== self.ruleCollection.policy['edit-version']){
                    self.view.$el.trigger("close-overlays");
                    if(self.ruleCollection.isCollectionDirty()) {
                      self.handleConcurrentEdit(newPolicyObj);
                    } else {
                      conf = {
                        title: "Warning",
                        question: "The policy "+'\"'+policyName+'\" is modified. Reloading the rules.',
                        yesButtonLabel: self.view.context.getMessage('ok'),
                        yesButtonTrigger:"yesEventTriggered",
                        kind: 'warning'
                      };

                      self.createConfirmationDialog(conf, function() {
                        self.ruleCollection.resetStore($.proxy(function(response,status) {
                          self.ruleCollection.policy = newPolicyObj;
                          self.ruleCollection.trigger('refresh-page', {}, true);
                        }));
                      });
                    }
                  }
                }
            }
        },

        saveAsPolicyYesButtonCallback : function(){

        },

        saveAsPolicyNoButtonCallback : function(newPolicyObj){
          var self=this;
          self.ruleCollection.resetStore($.proxy(function(response,status) {
            if(newPolicyObj) {
              self.ruleCollection.policy = newPolicyObj;
            }
            self.ruleCollection.trigger('refresh-page', {}, true);
          }));
        },

        handleConcurrentEdit :function(newPolicyObj){
          var self=this,conf;
          if(!self.ENABLE_LOCKING) {
            conf = {
              title: 'Warning',
              question: "Policy has been modified by different user while there are edits in process. Do you want to save this policy with a different name?",
              yesButtonLabel: 'Yes',
              noButtonLabel: 'No',
              yesButtonTrigger: 'yesEventTriggered',
              noButtonTrigger: 'noEventTriggered',
              kind: 'warning'
            };

              self.createConfirmationDialog(conf, $.proxy(self.saveAsPolicyYesButtonCallback, self),
                  $.proxy(self.saveAsPolicyNoButtonCallback, self, newPolicyObj));

          }
        },

        // Save button handler
        handleSaveButton : function(){
           var self = this, ruleCollection = self.ruleCollection, isSaveCommentsEnabled = self.ruleCollection.isSaveCommentsEnabled();

           if(self.ruleCollection.isCollectionDirty()) {
             //If Save Comments is enable then launch Save Comments view to get comments from user.
             if (isSaveCommentsEnabled) {
               var view = new SaveCommentsView({
                 parentView: self
               });
               self.Overlay = new OverlayWidget({
                 view: view,
                 type: 'small'
               });
               self.Overlay.build();
             } else {
               self.ruleCollection.savePolicy();
             }
           }
        },

        handleDiscardButton : function(){
            var self=this;
            var conf = {
                title:'Warning' ,
                question: "Do you want to discard the changes ?",
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                kind: 'warning'
            };

            self.createConfirmationDialog(conf, $.proxy(self.discardPolicyYesButtonCallback, self),
                $.proxy(self.discardPolicyNoButtonCallback, self));


        },

        discardPolicyYesButtonCallback : function(){
            var self=this;
            if(self.ENABLE_LOCKING){self.lockManager.unlockInProgress=true;}
            self.removeAllSelections();
            self.ruleCollection.resetStore(function(response,status) {
              self.afterResetStoreOnDiscard(response, status);
            });
        },

      /**
       * callback method for discard policy. this is called after reset store is done.
       * This starts fetching the rule from page 1
       *
       * @param response
       * @param status
       */
      afterResetStoreOnDiscard: function(response,status) {
        var self=this, filter = self.view.filterApplied;
        console.log("Removing locks and timers from the discard button no handler");
        self.removeAllSelections();
        self.view.$el.trigger("after-discard-policy");
        self.policyStatusMsgChangeHandler();

        // retaining the search after discard changes.
        if (filter) { // if any filter was applied before
            // once the collection is fetched, re-apply the filter
            self.ruleCollection.once('fetchComplete', function() {
                self.ruleCollection.handleFilter(filter);
            });
        }

        self.ruleCollection.trigger('refresh-page', {}, true);
        if(self.ENABLE_LOCKING){self.lockManager.unlockInProgress=false;}
      },

        removeAllSelections: function() {
          var me = this, selectedRows = me.getSelectedRows(), selectedIds = [];
          if (_.isEmpty(selectedRows)) {
            return;
          }
          _.each(selectedRows, function(selectedRow) {
            selectedIds.push(selectedRow.id);
          });
          me.toggleSelections(selectedIds, "unselected");
        },

        checkPermission: function(capability) {
            if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
               var rbacResolver = new Slipstream.SDK.RBACResolver();
                return rbacResolver.verifyAccess([capability]);
            }
        },



        /* Extending classes can override this to set the data for the other editors and also handlers for the data change
        * Extending classes should call this method if the name and description changes have to be saved
        */
        handleRowDataEdit :function(editModeRow){

        },

        /**
        * Will be overridden in the child classes if required
        * handle save of name and description edit when user clicks on different cell or different row
        *when the update event is triggered
        */
        editRuleHandler: function(rowObject, event) {

            return;
        },

        ruleGroupExpandCollapseHandler: function (rule, operation) {
            this.ruleCollection.expandCollapseRuleGroup(rule, operation);
            return false;
        },


        toggleSelections: function (selectedRowIds, status) {
            if (_.isArray(selectedRowIds) && selectedRowIds.length > 0) {
                this.view.gridWidgetObject.toggleRowSelection(selectedRowIds, status);
            }
        },



        /**
         * reloads the current page on the grid
         * @showFirst flag which determines which page to load
         * @nospinner flag to decide if spinner has to be shown
         * @scrollForward  flag to check if the scrollposition has to be incremented after the fetch
         */
        reloadPage: function(showFirst, noSpinner, scrollForward) {
            var self = this, ruleCollection = self.ruleCollection, currentPage = 1;

            //check if the viewport has rules from one page ot multiple pages
            if (showFirst !== true){
               var pages = self.getViewPortPageNumbers();
               if(pages.length !== 0){
                currentPage = pages[0];
               }
            }

            // set current page
            self.pageRequested = currentPage;
            self.isScrolling = false;

            ruleCollection.fetch({
                reset: true,
                noSpinner: noSpinner,
                page: currentPage,
                showFirst: showFirst,
                scrollForward: scrollForward,
                rows: self.policyManagementConstants.DEFAULT_PAGE_SIZE
            });
        },

        getViewPortPageNumbers: function(){
            var self = this, selectedRules = self.getSelectedRows(), ruleCollection = self.ruleCollection,
            selectedRuleIds = _.isArray(selectedRules)? _.pluck(selectedRules, self.policyManagementConstants.JSON_ID) : [],
            $firstRow, firstRule, $lastRow, lastRule, editModeRows = [], pages = [];

            //the edit mode on the rows have to be removed to get the correct page numbers
            //if the row being edited is the last row of first page when it is put in edit mode it expands beyond the viewport(if it has multiple entries in any column)
            //then the number of rows count in the viewport will be wrong
            self.removeEditMode(editModeRows);

            var visibleRows = self.view.gridWidgetObject.getViewportRows();
            if (visibleRows.length > 0) {
                $firstRow = $(visibleRows[0]);
                firstRule = ruleCollection.get($firstRow.attr("id"));
                pages.push(firstRule.get("pageNum"));
                $lastRow = $(visibleRows[visibleRows.length-1]);
                lastRule = ruleCollection.get($lastRow.attr("id"));
                if(firstRule.get("pageNum") !== lastRule.get("pageNum")){
                    pages.push(lastRule.get("pageNum"));
                }
            }

            //put the rows back in edit mode after calculating the currentpage numbers in the viewport
            self.restoreEditMode(editModeRows);
            return pages;
        },

        //overwritten in the subclasses
        handleAfterCreateRule: function(data){
            var self = this, rowData = data.rowData;

            if(typeof(data.isRowEditable) !== 'undefined' && data.isRowEditable === true){
                self.handleRuleGridLoadComplete({
                    editRuleId: rowData["rule-row-info"].rowId
                });
            }

            self.handleHighlightRow(data);
            self.policyStatusMsgChangeHandler();
        },

        /*fetches the data and sets the scroll position and also highlights the row
        * data ----- details of the row to be highlighted(rowId, rowNumber,pageNumberOfRow, totalRows)
        */
        handleHighlightRow: function(data){
            var self = this, rowData = data.rowData,ruleCollection = self.ruleCollection,
            page = rowData["rule-row-info"].pageNumber,
            rowNum = rowData["rule-row-info"].rowNumber,
            changeViewport = false,
            $firstRow, firstRule, $lastRow, lastRule, visibleRows, scrollPosition,
            totalPages = Math.ceil(rowData["rule-row-info"].totalCount/self.policyManagementConstants.DEFAULT_PAGE_SIZE);

            // Always change the viewport on navigation. This will highlight the row on the top
            if (data.onNavigation) {
                changeViewport = true;
            } else {

                // fix till slipstream fix it
                visibleRows = self.view.$el.find('tr.jqgrow:in-viewport');
                if (visibleRows.length > 0) {
                    $firstRow = $(visibleRows[0]);
                    firstRule = ruleCollection.get($firstRow.attr("id"));
                    $lastRow = $(visibleRows[visibleRows.length-1]);
                    lastRule = ruleCollection.get($lastRow.attr("id"));
                    if(rowNum < firstRule.get("rowNum") || rowNum > lastRule.get("rowNum")){
                        changeViewport = true;
                    }
                }
            }
            self.isScrolling = false;


            // check if the ata fething is required or not
            self.ruleCollection.fetch({
                reset: true,
                noSpinner: false,
                page: page,
                rowNumber: rowNum,
                rowPageNumber: page,
                highLightRowsCount: data.ruleIds.length,
                isRowEditable: data.isRowEditable,
                changeViewport: changeViewport,
                rows: self.policyManagementConstants.DEFAULT_PAGE_SIZE
            });
        },

        /*
        * returns the scroll position for the given row number
        * and also highlights the row
        * rowIndex ---- index of the row in the grid
        * lastPage ----- flag to check if the row is in last page
        */
        getScrollPositionForRow: function(rowIndex, isLastPage){
            var self = this, gridTable = self.view.getGridTable(),
            pageSize = self.policyManagementConstants.DEFAULT_PAGE_SIZE;
            gridTable[0].grid.prevRowHeight = undefined; // workaround for jqGrid bug. https://github.com/tonytomov/jqGrid/issues/690

            var relativePageIndex = self.getRelativePageIndex(rowIndex, isLastPage);
            var scrollAmount = 0;

            // Get the total client height of all rows on the page above the target row
            for (var i = 1; i < relativePageIndex; i++) {
                scrollAmount += gridTable[0].rows[i].offsetHeight;
            }


            // scroll the viewport to the correct row
            //if the new row is in the first page then scrollTop is not needed because the
            //scroll amount is calculated to right value
             // SInce fetching one page before,
             // in case row is greater than the previous page plus current page, add the scrolltop
            if(rowIndex > pageSize * 2){
                scrollAmount += $(gridTable[0].grid.bDiv).scrollTop();
            }

            gridTable[0].grid.scrollTop = scrollAmount;
            return scrollAmount;
        },

        //returns relative page index for the given row number
        getRelativePageIndex : function(rowIndex, isLastPage){
            var self = this,
            pageSize = self.policyManagementConstants.DEFAULT_PAGE_SIZE;

            var relativePageIndex = (rowIndex % pageSize);

            //if the row is in last page then pagesize has to be added to the
            //relative index because we are fetching the previous page also
            if(rowIndex > pageSize){
                relativePageIndex += self.policyManagementConstants.DEFAULT_PAGE_SIZE;
            }else{
                //if the relative index is zero then pagesize will be relative index
                if(relativePageIndex === 0 && rowIndex !== 0){
                    relativePageIndex = pageSize;
                }
            }
            return relativePageIndex;
        },

        handleFetchStart: function(collection, response, options) {
            var self = this;

            if (!options.noSpinner) {
                self.view.$el.addClass("view-min-height");

                // show loading
                $(self.view.$el).trigger('showloading');
            }
        },

        /**
         * handles the fetch complete from collection
         *
         * @param collection
         * @param response
         * @param options
         */
        handleFetchComplete: function(data, totalCount, options) {
            var self = this,
            scrollPosition = self.view.gridWidgetObject.getScrollPosition(),
            gridWidgetObject = self.view.gridWidgetObject,
            selectedRows = self.getSelectedRows(),
            totalPages = Math.ceil(totalCount/self.policyManagementConstants.DEFAULT_PAGE_SIZE),
            selectedRowIds = [];

            if (self.isScrolling) {
                if (self.pageRequested === 1) {
                    if (data[0].pageNum !== 1) {
                        return;
                    }

                } else if (self.pageRequested !== data[1].pageNum) {
                    return;
                }
            }

            $.each(selectedRows, function (i, rule) {
                selectedRowIds.push(rule[self.policyManagementConstants.JSON_ID]);
            });

            //removing the setting of minimun height for the view so that auto height can calculate it right
            self.view.$el.removeClass("view-min-height");

            // Always clearing data before in fetch complete
//            if (resetFlag) {
              console.log('removing rows before inserting');
                self.emptyGridRows();
//            }

            console.log('removed rows before inserting');

            $.each(data, function(i, dataObj) {
                if(dataObj.rules.length !==0){
                    gridWidgetObject.addPageRows(dataObj.rules, {
                        numberOfPage: dataObj.pageNum,
                        totalPages: totalPages,
                        totalRecords: totalCount
                    });
                }
            });
            console.log('added all pages');

            self.ruleCollection.resetCollection = false;
            self.view.addTreeViewRendering();
            console.log('tree view rendered');

            self.view.formatRulesGrid();
            self.restoreEditMode(self.editRowMap);



            self.editRowMap = [];

            console.log('format Rules Grid');

            $(self.view.$el).trigger('destroyloading');

            $(self.view.$el).trigger('rulegridreloadcomplete');

            self.fireGridActivityEvent();

            self.validateIcon();

            //if the flag to showFirst page is not turned on then set the scroll position
            if(options.showFirst !== true){
                if(options.changeViewport){
                   scrollPosition = self.getScrollPositionForRow(options.rowNumber, totalPages === options.rowPageNumber);
                }
                //required to trigger the reload of the next page when the current page does not take the entire viewport
                console.log('in handleFetchComplete setting scroll position to - ' + scrollPosition);
                self.view.gridWidgetObject.setScrollPosition(scrollPosition);

                if(options.rowNumber){
                    var relativePageIndex = self.getRelativePageIndex(options.rowNumber, totalPages === options.rowPageNumber);
                    for(var i=0 ; i<options.highLightRowsCount; i++){
                        var $row = $(self.view.getGridTable()[0].rows[relativePageIndex+i]);
                        $row.addClass("scroll_highlight");
                    }
                }
            } else {
                console.log('in handleFetchComplete setting scroll position to - 0 ');
                self.view.gridWidgetObject.setScrollPosition(0);
            }

            console.log('handleFetchComplete done');
        },

        validateIcon:function(){
            var self =this;
            $('.validate_icon').mouseover(function(e){
                var policyId = e.target.attributes[1].nodeValue;
                var errorlevel = e.target.attributes[2].nodeValue;
                var rowId = e.target.attributes[3].nodeValue;
                var cellId = e.target.attributes[4].nodeValue;
                var cellData ={
                  rawData : {
                    'policy-id' : policyId,
                    'error-level': errorlevel
                  },
                  rowId: rowId,
                  cellId: cellId
                };
                self.view.iconCellTooltip(cellData,$(e.target));
                //console.warn("hover");
              });
        },

        isRowInEditMode: function(ruleId){
            var gridTable = this.view.getGridTable();
            return gridTable.find("tr[id=" + ruleId + "]").attr("editable") === "1";
        },

        //handles the refresh page event
        handleRefreshPage: function(actions, showFirst, noSpinner, scrollForward){
            var self = this;

            if(!$.isEmptyObject(actions)){
                self.handleRuleGridLoadComplete(actions);
            }
            self.reloadPage(showFirst, noSpinner, scrollForward);
            self.policyStatusMsgChangeHandler();
        },
        /**
         * Update visual effect for the sorted rows
         * @param {Array} rowIds
         * @inner
         */
        updateRowVisualEffect : function(rowIds){
          var me = this, gridTable = me.view.getGridTable(),
            toggleClass = function(){
            rowIds.forEach(function(id){
              if (gridTable){
                var $row = gridTable.find("#" + id);
                if ($row.hasClass('sortable-success')){
                  $row.removeClass('sortable-success');
                }else{
                  $row.addClass('sortable-success');
                }
              }
            });
          };
          toggleClass();
          setTimeout(toggleClass, 3000);
        },
        /**
         * Update visual effect for the dropped target column
         * @param {jQuery Object} $dropColumn
         * @inner
         */
        updateColumnVisualEffect : function($dropColumn){
          var isRowExpanded = $dropColumn.find('.cellExpandWrapper').is(':visible'),
            removeHighlight = function(){
              isRowExpanded? $dropColumn.removeClass('droppable-hover'): $dropColumn.removeClass('droppable-hover override-hover');
            };
          $dropColumn.addClass('droppable-hover');
          setTimeout(removeHighlight, 3000);
        },
        //High light the rows and cells dropped
        hightlightDrop: function (actions) {
          var self = this, gridTable, ruleId, col;
          if (!(_.isEmpty(actions) || _.isEmpty(actions.dnd) || _.isEmpty(actions.dnd.highlight))) {
            if (actions.dnd.highlight.rows) {
              //Highlight dropped rows
              self.updateRowVisualEffect(actions.dnd.highlight.rows);
            } else if (actions.dnd.highlight.cell) {
              //Highlight dropped target cell
              gridTable = self.view.getGridTable();
              ruleId = actions.dnd.highlight.cell.row;
              col = gridTable.find("tr[id=" + ruleId + "] td:eq(" + actions.dnd.highlight.cell.index + ")");
              self.updateColumnVisualEffect(col);
            }
          }
        },

      //handler for grid load complete event
      handleRuleGridLoadComplete: function(actions){
            var self = this;
            $(self.view.$el).on('rulegridreloadcomplete', function() {
              $(self.view.$el).off('rulegridreloadcomplete');
              //High light if any items were dropped before grid refresh
              self.hightlightDrop(actions);
              var gridWidgetObject = self.view.gridWidgetObject,
                    selectedRows = self.getSelectedRows(),
                    selectedRowIds = _.isArray(selectedRows)? _.pluck(selectedRows, self.policyManagementConstants.JSON_ID) : [];
                if ($.isEmptyObject(actions)) {
                    return;
                }
                //need to remove selection and add selection for proper state calculation
                self.toggleSelections(selectedRowIds, "unselected");
                if (actions.editRuleId) {
                    self.toggleSelections([actions.editRuleId], "selected");
                    gridWidgetObject.addEditModeOnRow(actions.editRuleId);
                } else {
                    self.toggleSelections(selectedRowIds);
                }
            });
        },
      handlePolicySaveFailed: function (errorKey) {
        var self =this;
        //If it is a concurrent edit failure, provide option to the user to save the changes as a new policy
        if (errorKey === self.policyManagementConstants.SAVE_FAILED_DUE_TO_CONCURRENT_EDIT) {
          self.handleConcurrentEdit();
        } else {
          var msg, title;
          switch (errorKey) {
            case self.policyManagementConstants.SAVE_FAILED_FOR_VALIDATION_ERRORS :
              msg = self.context.getMessage("rule_grid_validation_error");
              title = self.context.getMessage("rule_grid_validation_error_title");
              break;
            case self.policyManagementConstants.SAVE_FAILED_DUE_TO_SOME_INTERNAL_FAILURE :
              msg = self.context.getMessage("rule_grid_save_failed_error");
              title = self.context.getMessage("rule_grid_save_failed_title");
              break;
            default:
              msg = self.context.getMessage("rule_grid_error");
              title = self.context.getMessage("rule_grid_error_title");
          }

          var conf = {
            title: title,
            question: msg,
            yesButtonLabel: 'OK',
            yesButtonTrigger:'yesEventTriggered'
          };
          self.createConfirmationDialog(conf);
          self.fireGridActivityEvent();
          self.policyStatusMsgChangeHandler();
          //reload has to be done on save because all the rules should get the saved uuid or errors have to be shown
          self.reloadPage();
        }
      },
      handlePolicySaveSuccess: function (ruleIdMap) {
        var self = this;
        self.updateSelectionForUnsavedRules(ruleIdMap);
        self.view.$el.trigger("after-save-policy");
        //remove the rows from edit mode before reloading so that the lock will not be acquired again
        //when the rules are taken out and put back in edit mode during the reload
        self.removeEditMode();
        self.policyStatusMsgChangeHandler();
        //reload has to be done on save because all the rules should get the saved uuid or errors have to be shown
        self.reloadPage();
      },

      //handles policy saved event which is triggered when policy is saved
      handlePolicySaved :function(errorKey, parameters, ruleIdMap){
          var self =this;

          if (errorKey !== ""){
            self.handlePolicySaveFailed(errorKey);
          } else {
            self.handlePolicySaveSuccess(ruleIdMap);
          }
          $(self.view.$el).trigger('destroyloading');
        },

      /**
       * method to update the rule selection for new rules. This will unselect all the new rules added in the current edit
       * session
       *
       * @param ruleIdMap
       */
      updateSelectionForUnsavedRules: function(ruleIdMap) {
          var me = this, ruleCollection = me.ruleCollection,
              selectedRows = me.getSelectedRows(), removeSelections = [],  newSelections = [];

          if (_.isEmpty(ruleIdMap) || _.isEmpty(selectedRows)) {
            return;
          }

          _.each(selectedRows, function(selectedRow) {
            var oldId = selectedRow.id, newRuleId = ruleIdMap[oldId];
            if (newRuleId) {
              removeSelections.push(oldId);
              newSelections.push(newRuleId);
            }
          });

          if (_.isEmpty(removeSelections)) {
            return;
          }
          me.toggleSelections(removeSelections, 'unselected');
        },

        //removes rows from edit mode
        removeEditMode: function(editRowMap, viewOnly){
            var self = this, selectedRules = self.getSelectedRows(),
            selectedRuleIds = _.isArray(selectedRules)? _.pluck(selectedRules, self.policyManagementConstants.JSON_ID) : [];
             $.each(selectedRuleIds, function (i, ruleId) {
                if(self.isRowInEditMode(ruleId)){
                    if (!viewOnly) {
                        self.view.gridWidgetObject.removeEditModeOnRow(ruleId);
                    }

                    if (editRowMap) {
                        editRowMap.push(ruleId);
                    }
                }
            });
        },

        // it restore edit mode on grid
        restoreEditMode: function(editRowMap) {
            var self = this;
            if(editRowMap.length > 0){
                $.each(editRowMap, function (i, ruleId) {
                    self.view.gridWidgetObject.addEditModeOnRow(ruleId);
                });
            }
        },

        fireGridActivityEvent: function () {
            var self = this;
            self.view.$el.triggerHandler("rule-grid-activity-event");
        },


        policyStatusMessageGenerator: function(userName, isCurrentlyEditingPolicy) {
            var self = this, ruleCollection = self.ruleCollection,
                editedMsg = ruleCollection.getPolicyEditMessage(isCurrentlyEditingPolicy),
                iconCls = ruleCollection.isCollectionDirty() || isCurrentlyEditingPolicy ? "editicon" : "noediticon",
                resolver = new Slipstream.SDK.AuthenticationResolver();

            if (userName) {
                editedMsg = self.context.getMessage('ruleGrid_editing_msg', [userName]);
                if (userName === resolver.getUserName()) {
                    editedMsg += " " + self.context.getMessage('ruleGrid_editing_another_session_msg') + ".";
                } else {
                    editedMsg += ".";
                }

                iconCls = "readonlyicon";
            }
            self.view.$el.find("#ruleEditMsg").text(editedMsg);
            self.view.$el.find("#ruleEditMsg").attr("class", iconCls);
        },

        policyStatusMsgChangeHandler : function() {
            var self=this;
            if (self.ENABLE_LOCKING) {
                self.lockManager.policyStatusMessageGenerator($.proxy(self.policyStatusMessageGenerator, self));
            } else {
                self.policyStatusMessageGenerator();
            }
        },
      getObjectsViewData : function () {
        return [];
      }
    });
    return RuleController;
});
