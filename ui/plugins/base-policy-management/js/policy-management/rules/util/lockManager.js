define(['../../../../../sd-common/js/common/utils/Timer.js',
'widgets/confirmationDialog/confirmationDialogWidget',
'../../../../../ui-common/js/sse/smSSEEventSubscriber.js'
],function(Timer,ConfirmationDialogWidget,SmSSEEventSubscriber){
      var LockManager = function() {
      };
      _.extend(LockManager.prototype, {
        timer:undefined,
        otherPolicyLockObject:undefined,
        selfPolicyLockObject : undefined,
        lockInactivityTimeout : 2, //In case the value is not received from backend, we will set it to 2minutes 
        timeUnit : 60*1000, //1 minute in milliseconds
        timerIncrement:0,
        confirmationDialogWidget:undefined,
        isWarningTimerRunning:false,
        lockInProgress:false,
        unlockInProgress:false,
        smSSEEventSubscriber:undefined,
        setup: function(options){
            var me = this;
            me.policyManagementConstants = options.policyManagementConstants;
            me.view = options.view;
            me.ruleCollection=me.view.ruleCollection;
            me.policyObjId = me.ruleCollection.policy.id;
            me.cuid = options.cuid;
            me.warningTimer = new Timer({method:$.proxy(me.warningTimerCallBack, me)});
            me.lockTimer = new Timer({method:$.proxy(me.lockTimerCallBack, me)});
            me.smSSEEventSubscriber = new SmSSEEventSubscriber();
            me.subscribeNotifications();
            me.getLockSettings($.proxy(function(response) {
                if (response && response["lock-settings"] && 
                  response["lock-settings"]["system-lock-inactivity-timeout"]) {
                    me.lockInactivityTimeout = response["lock-settings"]["system-lock-inactivity-timeout"];
                    me.timerIncrement = (me.lockInactivityTimeout - 1) * me.timeUnit;
                } else {
                    var conf = {
                        title: "Error",
                        question: "Policy lock settings could not be retrieved. No edit operations will be allowed.",
                        yesButtonLabel: me.view.context.getMessage('ok'),
                        yesButtonTrigger: 'yesEventTriggered',
                        kind: 'error'
                    };
                    if(me.confirmationDialogWidget) {
                      me.confirmationDialogWidget.destroy();
                    }
                    me.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

                    me.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                      me.view.$el.trigger("policy-read-only",true);
                      me.lockInactivityTimeout = 0;
                      me.timerIncrement = 0; 
                      if(me.confirmationDialogWidget) {
                        me.confirmationDialogWidget.destroy();
                      }
                    });

                    me.confirmationDialogWidget.build();
                }
            }, me));

            me.getPolicyLocks();

            if(me.view){
                me.bindViewEvents();
            }
        },

       subscribeNotifications : function () {
           //Subscribe to the SSE event
           var self = this;
           var policyId = self.ruleCollection.policy.id;
           var notificationSubscriptionConfig = {
               'uri' : [self.policyManagementConstants.POLICY_URL+"lock/"+policyId,
                        self.policyManagementConstants.POLICY_URL+"unlock/"+policyId],
               'callback' : function (args) {
                 console.log("Notification received for policy rule page lock manager-- "+args.uri);
                 self.view.$el.trigger("policy-lock-modified", args);
               }
           };
           var sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self.view);
           self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
           return self.sseEventSubscriptions;
       },

        bindViewEvents: function(){
            var self = this;
            self.view.$el
            //check if policy is allowed for edit on before edit row event
            .bind("gridRowBeforeEdit",function(e,rowId) {
              return self.isPolicyLocked(rowId);
            })
            //on view close - unsubscribe notifications and unlock policy
            .bind("view-close", $.proxy(self.viewCloseHandler,self))
            //reset the lock timer on the policy
            .bind("reset-policy-lock-timer", $.proxy(self.resetPolicyLockTimer, self))
            //reset the lock timer on the policy
            .bind("rule-grid-activity-event", $.proxy(self.resetTimers, self))
            //remove lock objects and stop timers after policy save
            .bind("after-save-policy", $.proxy(self.removeLocks, self))
            //remove lock objects and stop timers after policy discard
            .bind("after-discard-policy", $.proxy(self.removeLocks, self))
            //listen on warning timer expired event
            .bind("warning-timer-expired", $.proxy(self.handleWarningTimerExpiry,self))
            //listen on lock timer expired event
            .bind("lock-timer-expired", $.proxy(self.handleLockTimerExpiry,self))
            //listen on policy lock expired event
            .bind("policy-lock-expired",function(e,args){
                self.handlePolicyLockExpiry(args.reachedTimeout,args.isPolicyUnlocked);
            })
            //policy locked/unlocked notification
            .bind("policy-lock-modified", function(e,args){
              self.policyLockModifiedNotificationHandler(args);
            })
            //Policy read only error event to show error that some other user acquired the lock
            .bind("policy-read-only-error", function(e,fetchLockedUser,userName,triggerPolicyReadOnlyEvent) {
              self.policyReadOnlyErrorHandler(fetchLockedUser,userName,triggerPolicyReadOnlyEvent);
            });

            self.ruleCollection.bind("policy-edit-lock-not-available",function(e){
              var userName = self.otherPolicyLockObject["user-id"];
              self.policyReadOnlyErrorHandler(false,userName,false);
            });
        },

        policyLockModifiedNotificationHandler : function(args){
            var self=this, uri = args.uri,
                policyId=self.ruleCollection.policy.id, fireUnlockEvent;
            switch (uri) {
                case self.policyManagementConstants.POLICY_URL+"lock/"+policyId:
                    console.log("policy lock notification");
                    if(self.lockInProgress) {
                        console.log("triggering lock after 2secs");
                        var fireLockEvent = $.proxy(self.policyLockModifiedHandler,self,[true]);
                        _.delay(fireLockEvent,2000);
                    } else {
                        console.log("triggering lock immediately");
                        self.policyLockModifiedHandler(true);
                    }
                    break;
                case self.policyManagementConstants.POLICY_URL+"unlock/"+policyId:
                    console.log("policy unlock notification");
                    if(self.ruleCollection.isSavePolicyInProgress() || self.unlockInProgress) {
                        console.log("triggering unlock after 2secs");
                        fireUnlockEvent = $.proxy(self.policyLockModifiedHandler,self,[false]);
                        _.delay(fireUnlockEvent,2000);
                    } else {
                        console.log("triggering unlock immediately");
                        self.policyLockModifiedHandler(false);
                    }
                break;
            }
        },

        unSubscribeNotifications: function(){
            if(this.smSSEEventSubscriber && this.sseEventSubscriptions) {
              this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
              this.smSSEEventSubscriber = null;
              this.sseEventSubscriptions = null;
            }
        },

        viewCloseHandler : function(){
            this.unSubscribeNotifications();
            this.unlockPolicy();
        },

        closeConfirmationWidget : function(){
          var self=this;
          if(self.confirmationDialogWidget) {
            self.confirmationDialogWidget.destroy();
            self.confirmationDialogWidget = undefined;
          } 
        },

        getLockSettings : function(callback) {
            var self=this;
            return $.ajax({
                headers: {
                    accept: self.policyManagementConstants.POLICY_LOCK_SETTINGS_ACCEPT,
                    "Content-Type": self.policyManagementConstants.POLICY_LOCK_SETTINGS_ACCEPT
                },
                type: 'GET',
                url: self.policyManagementConstants.POLICY_URL + 
                self.policyManagementConstants.POLICY_LOCK_SETTINGS,
                dataType: "json",
                success: function(response, status) {
                   console.log("get lock settings");
                   callback(response);
                },
                error: function() {
                    console.log("failed to get lock settings");
                    callback();
                }
            });
        },

        //tested to be working fine - tested with 2minutes
        warningTimerCallBack : function() {
            this.view.$el.trigger('warning-timer-expired');
        },

        //tested to be working fine - tested with 2minutes
        lockTimerCallBack : function() {
            this.view.$el.trigger('lock-timer-expired');
        },
        
        //tested to be working fine - tested with 2minutes for both yes and no cases
        handleWarningTimerExpiry : function() {
          var self=this,policyName = self.ruleCollection.policy.name;
          console.log("stopping warning timer from handleWarningTimerExpiry");
          self.warningTimer.stop();
          console.log("starting lock timer from handleWarningTimerExpiry");
          self.startLockTimer();
          var conf = {
              title: 'Inactivity Timeout',
              question: 'The lock on '+ '\"' + policyName +'\" will expire in less than 1 minute due to inactivity. Do you want to extend the lock? If you have unsaved changes to \"' + policyName +'\" then you should choose \"Yes\".',
              yesButtonLabel: 'Yes',
              noButtonLabel: 'No',
              yesButtonTrigger: 'yesEventTriggered',
              noButtonTrigger: 'noEventTriggered',
              kind: 'warning'
          };

          self.closeConfirmationWidget();

          self.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

          self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
              console.log("stopping lock timer from handleWarningTimerExpiry");
              self.stopLockTimer();
              self.resetPolicyLockTimer();   
              self.closeConfirmationWidget();
          });

          self.confirmationDialogWidget.vent.on('noEventTriggered', function() {
            self.closeConfirmationWidget();
          });

          self.confirmationDialogWidget.build();
        },

        //tested to be working fine - tested with 2minutes
        handleLockTimerExpiry : function() {
             var self =this;
             console.log("stopping lock timer from handleLockTimerExpiry");
             self.stopLockTimer();
             self.unlockPolicy(true);     
        },

        //tested to be working fine - tested with 2minutes for both yes and no cases.
        handlePolicyLockExpiry : function(reachedTimeout,isPolicyUnlocked){
            var self=this, policyName = self.ruleCollection.policy.name;
            if(self.selfPolicyLockObject){
              console.log("removing locks from handlePolicyLockExpiry");
              self.removeLocks();
              self.view.$el.trigger("close-overlays");
              var title = 'A Policy Lock Has Been Removed',question="";
              if(reachedTimeout){
                  question = 'The lock for '+ '\"' + policyName +'\" has expired and been released while there are edits in process. Do you want to save this policy with a different name?';
              }
              if(isPolicyUnlocked){
                  question = 'The lock for '+ '\"' + policyName +'\" has been released by different user while there are edits in process. Do you want to save this policy with a different name?';
              }
             //If timer expired then provide message that timer expired and provide saveAs option
             //If some other user unlocked the policy while current user had acquired a lock
             //provide message that someone unlocked the policy and give saveAs option
             //If yes then save as new policy and on success redirect to policy page
             //If no then reset the store and all changes that current user made should be lost
             var conf = {
                title:title ,
                question: question, 
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                kind: 'warning'
            };

            self.closeConfirmationWidget();

            self.confirmationDialogWidget = new ConfirmationDialogWidget(conf);  

            self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE,
                      {
                          mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
                      }
                );
                intent.putExtras({id: self.policyObjId, mode:"SAVE_AS", cuid:self.cuid});
                self.view.context.startActivityForResult(intent);
                self.closeConfirmationWidget(); 
            });

            self.confirmationDialogWidget.vent.on('noEventTriggered', function() {
              self.ruleCollection.resetStore($.proxy(function(response,status) {
                self.ruleCollection.trigger('refresh-page', {}, true);
              }));
              self.closeConfirmationWidget();
            });

            self.confirmationDialogWidget.build();
          }
        },

        policyModifiedHandler : function(newPolicyObj){
          var self=this, policyName = self.ruleCollection.policy.name;
          self.getPolicyLocks($.proxy(function(newLockObject) {
            //if policy exists and lock doesnt exists from both current and different user,
            //then no user has locked the policy yet,
            //but there may be modifications from the other user on the policy
            if(newLockObject === undefined && self.selfPolicyLockObject === undefined) {
              //check the edit-version in this case for existing policy and current policy data
              //if they are not same, then for the current user show a message that policy is modified
              //and refresh the rule collection since current user has not made any changes yet
              //tested to be working fine with edit-version
              if(newPolicyObj['edit-version'] !== self.ruleCollection.policy['edit-version']){
                var conf = {
                    title: "Warning",
                    question: "The policy "+'\"'+policyName+'\" is modified. Reloading the rules.',
                    yesButtonLabel: self.view.context.getMessage('ok'),
                    yesButtonTrigger:"yesEventTriggered",
                    kind: 'warning'
                };

                self.closeConfirmationWidget();
                self.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

                self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                  self.ruleCollection.resetStore($.proxy(function(response,status) {
                    self.ruleCollection.policy = newPolicyObj;
                    self.ruleCollection.trigger('refresh-page', {}, true);
                  }));
                  self.closeConfirmationWidget();
                });

                self.confirmationDialogWidget.build();
              }
            }
          }, self));
        },

        policyLockModifiedHandler : function(isPolicyLocked){
          var self=this, policyName = self.ruleCollection.policy.name;
          if(isPolicyLocked){
            self.getPolicyLocks($.proxy(function(newLockObject) {
                //if policy exists, lock object exists and current lock object doesnt exists
                //then some other user has locked the policy and current user has not locked 
                //tested to be working fine - except that buttons and menus should be disabled
                if(newLockObject && self.selfPolicyLockObject === undefined) {
                  //if the lock is acquired by same user(from backend it can occur)
                  //then just save the lock object in the lock manager 
                  //else give the message that some other user acquired lock
                  //TODO :check for user id also
                  if(self.cuid === newLockObject["requester-id"]) {
                    self.selfPolicyLockObject = newLockObject;
                    console.log("starting warning timer from policyLockModifiedHandler");
                    self.startWarningTimer();
                  } else {
                    //ideally in this case when user comes from policies page, the actions will be disabled
                    //but in race conditions, after rules page is rendered, lock can be acquired by some other user
                    //give a message that different user has acquired lock and make rules page read-only for current user
                    console.log("triggering policy-read-only from policyLockModifiedHandler");
                    self.view.$el.trigger("policy-read-only",[true,newLockObject["user-id"]]);
                  }
                }
            }));
          } else {
            //if policy is unlocked then provide message that someone unlocked the policy and give saveAs option
            //when doesnt want to saveAs, resetStore is invoked and rules page is refreshed
            if(!self.unlockInProgress) {
              console.log("triggering policy-read-only from policyLockModifiedHandler");
              self.view.$el.trigger("policy-read-only");
              self.view.$el.trigger("policy-lock-expired",{"reachedTimeout":false,"isPolicyUnlocked":true});
            }
          }
        },

        //obtain the lock for the policy if it is not already obtained
        //called for all the actions which modify the policy
        lockPolicy: function(callback){
            var self = this;
            self.lockInProgress=true;
            if(self.selfPolicyLockObject === undefined){
              console.log("locking policy");
              $.ajax({
                url: self.policyManagementConstants.POLICY_URL + self.policyObjId +
                    self.policyManagementConstants.POLICY_LOCK + "?cuid=" + self.cuid,
                type: 'POST',
                dataType: 'json',
                headers: {
                  'accept': self.policyManagementConstants.POLICY_LOCK_ACCEPT
                },
                success: function (data,status) {
                  self.lockInProgress=false;
                  console.log("locking policy success");
                  self.selfPolicyLockObject = data["object-lock"];
                  self.view.$el.trigger("policy-status-msg-change");
                  console.log("starting warning timer from lockPolicy");
                  self.startWarningTimer();
                  if(callback) {
                    callback(data,status);
                  }
                },
                error: function (data,status) {
                  console.log("call to lock policy failed");
                  if(callback) {
                    callback(data.responseText,status);
                  }
                }
              });
            } 
        },

        //release the lock on the policy as it is saved successfully
        unlockPolicy: function(reachedTimeout){
            var self = this;
            self.unlockInProgress=true;
            if(self.selfPolicyLockObject){
                console.log("unlocking the policy");
                $.ajax({
                    url: self.policyManagementConstants.POLICY_URL + self.policyObjId +
                        self.policyManagementConstants.POLICY_UNLOCK,
                    type: 'POST',
                    success: function (data,status) {
                        self.unlockInProgress=false;
                        console.log("unlock policy success");
                        if(reachedTimeout){
                          console.log("triggering timeout handler");
                          self.view.$el.trigger("policy-lock-expired",{"reachedTimeout":true,"isPolicyUnlocked":false});
                        } else {
                          //In case user is using the method externally, we need to reset the locks
                          self.removeLocks();
                        }
                    },
                    error: function () {
                      console.log("call to unlock policy failed");
                      console.log("removing locks from unlockPolicy error case");
                      self.removeLocks();
                    }
                });
            }
        },

        //reset lock timer for the policy
        resetPolicyLockTimer : function() {
            var self =this;
            if(self.selfPolicyLockObject) {
                $.ajax({
                    url: self.policyManagementConstants.POLICY_URL + self.policyObjId +
                        self.policyManagementConstants.POLICY_RESET_LOCK_TIMER,
                    type: 'POST',
                    success: function (data) {
                      console.log("resetting warning timer from resetPolicyLockTimer");
                      self.resetWarningTimer();
                    },
                    error: function () {
                      console.log("call to reset lock timer failed");
                    }
                });
            }
        },

        getPolicyLocks : function(callback){
            var self=this;
            var policy=self.ruleCollection.policy;
            $.ajax({
                type: 'GET',
                url: self.policyManagementConstants.POLICY_URL + policy.id+
                self.policyManagementConstants.POLICY_LOCKS,
                dataType:"json",
                headers: {
                    'accept': self.policyManagementConstants.POLICY_LOCK_ACCEPT
                },
                success: function(data,status) {
                  var newLockObject = data && data['object-lock'] && data['object-lock']['requester-id'] ?
                      data['object-lock']:undefined;

                  if(newLockObject && newLockObject["requester-id"] !== self.cuid) {
                    self.otherPolicyLockObject = newLockObject;
                    self.ruleCollection.setPolicyReadOnly(true);
                  } else {
                    self.otherPolicyLockObject = undefined;
                    self.ruleCollection.setPolicyReadOnly(false);
                  }
                  if(callback) {
                    callback(newLockObject);
                  }
              },
              error: function () {
                  console.log("call to fetch locks failed");
                  if (callback) {
                    callback();
                  }
              }
          });
        },


        /**
         * this method generates the status message based on the lock. if current user is editing than it will
         * say "Currently Editing the policy", else "User is editing the policy"
         * @param callback
         * @returns {*}
         */
        policyStatusMessageGenerator: function(callback) {
            var me = this, ruleCollection = me.ruleCollection, userId = undefined;
            if (ruleCollection.isCollectionDirty() || me.selfPolicyLockObject) {
                return callback(undefined, true);
            }

            if (me.otherPolicyLockObject && me.ruleCollection.isPolicyReadOnly()) {
                userId = me.otherPolicyLockObject['user-id'];
            }
            
            if (callback) {
                return (callback(userId));
            }
           
            return callback();
        },

        startWarningTimer : function() {
          var self = this;
          if (self.isWarningTimerRunning) {
            return;
          }
          self.warningTimer.start(self.timerIncrement);
          self.isWarningTimerRunning = true;
        },

        startLockTimer : function(){
          var self=this;
          self.lockTimer.start(self.timeUnit);
        },

        stopLockTimer : function(){
          var self=this;
          self.lockTimer.stop();
        },

        stopTimers : function(){
          var self = this;
          self.isWarningTimerRunning=false;
          self.warningTimer.stop();
          self.stopLockTimer();
        },

        resetWarningTimer : function() {
          var self = this;
          if (self.isWarningTimerRunning) {
            self.isWarningTimerRunning = true;
            self.warningTimer.reset(self.lockInactivityTimeout * self.timeUnit);
          }
        },

        resetTimers : function(){
          var self=this;
          self.resetWarningTimer(); 
          self.stopLockTimer();
        },

        removeLocks : function(){
            var self = this;
            self.selfPolicyLockObject=undefined;
            self.stopTimers();
        },

        isPolicyLocked : function(rowId) {
          var self=this,
          rule = self.ruleCollection.get(rowId),policyName = self.ruleCollection.policy.name;
          //If it is a group row then dont allow edit
          if(rule && rule.get("is-leaf") === false)
              return false;
          else {
            //if current user has the lock object then allow edit
            if(self.selfPolicyLockObject){
              return true;
            } else {
              //try to acquire lock on the policy
              //if it succeeds then allow edit 
              //else say that lock cannot be acquired and make the page read only
              self.lockPolicy($.proxy(function(response,status) {
                switch (status) {
                case "success":
                  console.log('LockManager -- Succeeded in getting the policy lock. Edit should work fine.');
                  break;
                case "error":
                  console.log('LockManager -- Failed in getting the policy lock. Edit should be blocked.');
                  self.view.$el.trigger("policy-read-only-error",[false,response,true]);
                  self.view.gridWidgetObject.removeEditModeOnRow(rowId);
                  break;
                }
              }, self));
              return true;
            }
          }
        },

        policyReadOnlyErrorHandler : function(fetchLockedUser,userName,triggerPolicyReadOnlyEvent){
          var self=this;
          if(fetchLockedUser){
            self.getPolicyLocks($.proxy(function(newLockObject) {
              if(newLockObject) {
                self.showPolicyLockedError(newLockObject["user-id"],false);
              }
            }));
          } else {
            self.showPolicyLockedError(userName,triggerPolicyReadOnlyEvent);
          }
        },

        showPolicyLockedError : function(userName,triggerPolicyReadOnlyEvent){
          var self=this,policyName = self.ruleCollection.policy.name;
          console.log("Policy is locked by user : "+userName);
          var conf = {
              title: "Warning",
              question: 'Policy '+'\"'+policyName+' \"is locked by \"'+userName+
                          '\" user. Rules cannot be modified.',
              yesButtonLabel: self.view.context.getMessage('ok'),
              yesButtonTrigger:"yesEventTriggered",
              kind: 'warning'
          };

          self.closeConfirmationWidget();
          self.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

          self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
            if(triggerPolicyReadOnlyEvent) {
              self.view.$el.trigger("policy-read-only",[true,userName]);
            }
            self.closeConfirmationWidget();
          });

          self.confirmationDialogWidget.build();
        }
      });
      return LockManager;
  });
