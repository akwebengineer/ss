/**
 * Block Application View for
 * @module
 * @author kkhan@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    "backbone",
    "widgets/grid/gridWidget",
    "widgets/overlay/overlayWidget",
    'widgets/form/formWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../../../ui-common/js/common/utils/SmUtil.js',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../../../security-management/js/jobs/JobDetailedView.js',
    '../../policies/models/firewallPolicyModel.js',
    '../../policies/models/fwPolicyCollection.js',
    '../../policies/views/firewallPoliciesView.js',
    '../../policies/constants/fwPolicyManagementConstants.js',
    './blockSummaryView.js',
    '../service/blockService.js',
    '../conf/blockPolicyGridConf.js',
    '../conf/blockViewFormConf.js'
], function (Backbone,
             GridWidget,
             OverlayWidget,
             FormWidget,
             ConfirmationDialogWidget,
             SmUtil,
             ProgressBarForm,
             SmSSEEventSubscriber,
             JobDetailedView,
             Model,
             Collection,
             PolicyView,
             PolicyConstants,
             SummaryPage,
             AppSecureService,
             GridConf,
             BlockViewFormConf) {

    var BlockApplicationView = Backbone.View.extend({

        events: {
            "click #saveButton": "onSaveClick",
            "click #publishButton": "publishPolicies",
            "click #updateButton": "updatePolicies",
            "click #blockAppLink": "calculateDiffAndLaunchCompare",
            'click #cancelBlockApp': 'onCancel'
        },

        /**
         * Initialize the view
         * @param input
         * @param activity
         */
        initialize: function (input, activity) {
            var self = this;
            self.input = input;
            self.activity = activity;
            self.selectedApplications = input.selectedApplications;
            self.service = new AppSecureService();
            self.context = activity.context;
            self.blockHeader = input.blockHeader;
            //changelist
            self.policyIdChangeListMap = {};

        },

        /**
         * Show progress bar while fetching the policies, can be reused when calculating diff
         * @param title
         * @param text
         * @param okButton
         * @param cancelButton
         */
        displayProgressBar: function (title, text, okButton, cancelButton, hasPercentage) {
            var self = this;
            self.progressBar = new ProgressBarForm({
                title: title,
                statusText: text,
                hasPercentRate: hasPercentage,
                close: function() {
                    self.progressBarOverlay = undefined;
                }
            });
            if (!okButton) {
                okButton = false;
            }
            if (!cancelButton) {
                cancelButton = false;
            }
            self.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false,
                okButton: okButton,
                cancelButton: cancelButton
            });
            self.progressBarOverlay.build();

        },

        showSummaryPage: function (policyId) {
            var me = this,
                overLayWidget;
            //
            var changeList = me.collection.get(policyId).get("change-list"),
                ruleChangeList = changeList && changeList["rule-change-list"];
            //
            if(ruleChangeList){
                ruleChangeList["policy-id"] = policyId;
            };
            //
            me.summaryPage = new SummaryPage({
                    "context": me.context,
                    "policyObject": me.collection.get(policyId).attributes,
                    "cuid": Slipstream.SDK.Utils.url_safe_uuid(),
                    "ruleChangeList": ruleChangeList,
                    "closeOverLay": function(){
                        overLayWidget && overLayWidget.destroy();
                        me.summaryPage = null;
                    }
            });
            //
            overLayWidget = new OverlayWidget({
                title: me.context.getMessage("block_summary_page_title"),
                okButton: true,
                cancelButton: true,
                view: me.summaryPage,
                type: 'xlarge',
                height: "900px",
                showScrollbar: true,
                xIconEl: true,
                "beforeSubmit": function(){
                    return me.summaryPage.isValid();
                },
                "cancel": function(){
                    me.summaryPage.close();
                    me.summaryPage = null;
                },
                "submit": function(){
                    var effectiveChangeListSuccess,
                        effectiveChangeListFailure;
                    effectiveChangeListSuccess = function(response){
                      var policy = me.collection.get(policyId);
                      policy.set("change-list", changeList);
                      policy.get("change-list")["rule-change-list"] = response["modify-rules"];
                      //cache the changelist in the view. this is required to be put back
                      // in the collection on notification refresh
                      me.policyIdChangeListMap[policyId] = changeList;
                      me.summaryPage.close();
                      me.summaryPage = null;
                    };
                    //
                    effectiveChangeListFailure = function(error){
                        console.log(error);
                    };
                    me.summaryPage.getEffectiveRuleChangeList(effectiveChangeListSuccess, effectiveChangeListFailure);                    
                }
            });

            me.progressBarOverlay.destroy();
            overLayWidget.build();
        },

        /**
         * Subscibe for task callback
         * @returns {*|BlockApplicationView.sseEventSubscriptions}
         */

        /**
         * [subscribeNotifications description]
         * @return {object} [sseEventSubscriptions with regestered uri]
         */
        subscribeNotifications: function (screenId, successCallBack, failureCallback) {
            //Subscribe to the SSE event
            var self = this,
                screenID = screenId[0] !== '$' ? ('$' + screenId) : screenId,
                sseEventHandler,
                notificationSubscriptionConfig = {
                    'uri': ['/api/juniper/sd/task-progress/' + screenID],
                    'autoRefresh': true,
                    'callback': function () {
                        self.getProgressUpdate(screenId, successCallBack, failureCallback);
                    }
                };
            self.smSSEEventSubscriber = new SmSSEEventSubscriber();
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },

        /**
         * [unSubscribeNotification]
         */
        unSubscribeNotification: function () {
            // unsubscribe Notification for job details
            this.smSSEEventSubscriber.stopSubscription(this.subscribedNotificationObj);
        },
        /**
         * [getProgressUpdate description]
         */
        getProgressUpdate: function (screenId, successCallBack, failureCallback) {
            var self = this,
                screenID = screenId[0] !== '$' ? ('$' + screenId) : screenId;
            $.ajax({
                url: '/api/juniper/sd/task-progress/' + screenID,
                type: 'GET',
                dataType: "json",
                headers: {
                    'accept': 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02'
                },
                success: function (data) {
                    var progress = 0, currentStep, currentStepText;
                    if (data['task-progress-response']) {

                        progress = data['task-progress-response']['percentage-complete'] / 100;
                        currentStep = data['task-progress-response']['current-step'];
                        if (screenId !== self.uuid) {
                            currentStepText = currentStep;
                        } else {
                            currentStepText = self.context.getMessage(currentStep);
                        }
                        if (progress >= 1) {
                            self.progressBar._progressBar.setStatusText(currentStepText);
                            self.progressBar._progressBar.hideTimeRemaining();
                            self.progressBar._progressBar.setProgressBar(1);

                            if (self.subscribedNotificationObj) {
                                self.unSubscribeNotification();
                            }
                            if (currentStep !== 'SAVE_POLICY_FAILED' && currentStep !== 'LOCK_ACQUISITION_FAILED'
                                && currentStep !== 'SAVE_POLICY_FAILED_CUNCURRENT_EDIT') { //ERROR will be saved seperately
                                successCallBack();
                            }
                        }
                        else {
                            if (self.progressBar) {
                                self.progressBar._progressBar.setStatusText(currentStepText);
                                self.progressBar._progressBar.setProgressBar(progress);
                            }
                        }
                    }
                    else {
                        self.progressBar._progressBar.setProgressBar(progress);
                    }
                },
                error: function () {
                    failureCallback();
                }
            });
        },

        /**
         * Once the user save the policies, remove all the changelist as these changes are already saved in the system
         */
        removeChangeList: function () {
            var self = this, policies, changeListId;
            policies = self.gridView.getPolicies(self.collection);
            _.each(policies, function (policy) {
                if (!policy.isStatic) {
                    // make cahnge list as empty array
                    policy['change-list'] = [];
                }
            });

            // check if the change list is added in DB.
            // For policy analysis workflow, change list id will be the UUID
            // For other workflow, it will be the screen id used to calculate changelist
            changeListId = self.input.UUID || self.changeListDBId;

            // clean the change list from the DB
            if (changeListId) {
                self.service.deleteChangeList(changeListId);
            }

        },

        /**
         * Fetch the change list and store in policy mo
         * @param appAccessDetails
         * @param successCallBack
         */
        getAllChangeList: function (appAccessDetails, successCallBack, isLaunchedFromSave) {
            var self = this, requestObj, onSuccess, screenID;

            screenID = Slipstream.SDK.Utils.url_safe_uuid();
            self.changeListDBId = screenID;
            requestObj = {
                'calculate-changelist-request': {
                    'app-access-policies': {
                        'app-access-policy-details': appAccessDetails
                    }
                }
            };

            // subscribe notifications
            self.subscribedNotificationObj = self.subscribeNotifications(screenID, function () {
                // fetch the change list and launch compare view
                // launch the summary page
                self.fetchPoliciesByUUID(screenID, function (jsonRoot, jsonObj, path, response) {
                    if (response[jsonRoot].total > 0) {
                        _.each(response[jsonRoot][jsonObj], function (policyDetails) {
                            var policyFromModel = self.collection.get(policyDetails['policy-id']);
                            if (policyFromModel) {
                                policyFromModel.set(path, policyDetails);
                            }
                        });
                    }
                    // show changelist fetch and call success
                    setTimeout(function () {
                        successCallBack.call(self);
                    }, 2000);
                });
            }, function () {
                self.progressBarOverlay.destroy();
                // show error message
                self.showErrorMessage(self.context.getMessage('block_changelist_error'));
                console.log('Error in calculating diff');
            });

            // handle success callback
            onSuccess = function (response) {
                var taskId;
                if (!response) {
                    self.progressBarOverlay.destroy();
                    self.disableAllButtons();
                    // show error message
                    self.showErrorMessage(self.context.getMessage('block_changelist_error'));
                    console.log('Error in calculating diff');
                }
            };
            self.service.calculateChangeList(requestObj, screenID, onSuccess, function () {
                self.progressBarOverlay.destroy();
                self.disableAllButtons();
                // show error message
                self.showErrorMessage(self.context.getMessage('block_changelist_error'));
                console.log('Handle error in calculating change list');
            });

        },


        /**
         * It shows the error message
         */
        showErrorMessage: function(message) {
            var self = this;
            self.disableAllButtons();
            $(self.formWidget.formTemplateHtml.find('form')
                .find('.alert-box')[0]).html(message).show();

        },


        /**
         * Fetches policies from grid
         * @returns {Array}
         */
        getPolicies: function () {
            var self = this, policies, policyList = [];
            policies = self.gridView.getPolicies(self.collection);
            _.each(policies, function (policy) {
                if (!policy.isStatic) {
                    policyList.push(policy);
                }
            });

            return policyList;
        },

        /**
         * Returns the change list required for save action
         */
        getChangeList: function () {
            var self = this, changeList = [], policies;
            policies = self.gridView.getPolicies(self.collection);
            _.each(policies, function (policy) {
                if (!policy.isStatic && policy['change-list']) {
                    changeList.push(policy['change-list']);
                }
            });
            return changeList;
        },

        /**
         * Handles save button click
         */
        onSaveClick: function () {
            var self = this;
            self.savePolicies();
        },

        /**
         * It call save on policies
         */
        savePolicies: function () {
            var self = this, policies, changeListToFetch = [];
            // check if the calculate change list exist or not
            self.displayProgressBar(self.context.getMessage("save_title"),
                self.context.getMessage("save_progress_display"), false, false, true);
            policies = self.gridView.getPolicies(self.collection);
            _.each(policies, function (policy) {
                if (!policy.isStatic && _.isUndefined(policy['change-list'])) {
                    changeListToFetch.push(policy['app-access-details']);
                }
            });

            if (changeListToFetch.length === 0) {
                self.performSaveAction();
            } else {
                self.getAllChangeList(changeListToFetch,
                    $.proxy(self.performSaveAction, self), true);
            }

        },

        /**
         * It call save on policies
         */
        performSaveAction: function () {
            var self = this, policiesToSave;
            policiesToSave = self.getChangeList();

            if (policiesToSave.length < 1) {
                // no policies to save, check if publish to call
                if (self.isLaunchedFromPublish) {
                    self.startPublishing();
                } else {
                    self.saveCallBack();
                }
                return;

            }

            self.handleSaveNotification();
            self.service.savePolicies(self.uuid, policiesToSave, self, function () {
            }, function (response) {
                var message;
                self.progressBarOverlay.destroy();
                console.log('Error in saving policy');
                self.isLaunchedFromPublish = false;
                // show error dialog - Error in saving policy Too
                if (response && response.responseText) {
                    message = self.context.getMessage(response.responseText);
                }
                if (!message) {
                    message = self.context.getMessage("rule_grid_save_failed_error");
                }
                self.showErrorMessage(message);
            });
        },

        /**
         * Fetch save complete notifications and on completion call the success callback method
         * @param onSaveComplete
         */
        handleSaveNotification: function () {
            var self = this, taskId = self.uuid;
            self.subscribedNotificationObj = self.subscribeNotifications(taskId, function () {
                // remove all changelist once saved
                self.removeChangeList();
                setTimeout(function () {
                    if (self.isLaunchedFromPublish) {
                        self.startPublishing();
                    } else {
                        self.saveCallBack();
                    }
                }, 2000);

            }, function () {
                self.isLaunchedFromPublish = false;
                self.progressBarOverlay.destroy();
                console.log('Error in calculating diff');
                // show error dialog - Error in saving policy Too
                self.showErrorMessage(self.context.getMessage("rule_grid_save_failed_error"));
            });
        },


        /**
         * It handles save callback
         * @param data
         */
        saveCallBack: function () {
            var self = this;

            if (self.progressBarOverlay) {
                self.progressBarOverlay.destroy();
            }
            // disable save
            self.$el.find('#saveButton').addClass('disabled');
            self.$el.find('#saveButton').attr("disabled", "disabled");

            // Instead of disabling save, closing the view itself
            self.overlay.destroy();
        },

        /**
         * Handles Update action
         */
        updatePolicies: function () {
            var self = this;
            self.update = true;
            self.publishUpdate();
        },

        /**
         * Handles publish action
         */
        publishPolicies: function () {
            var self = this;
            self.update = false;
            self.publishUpdate();
        },

        /**
         * Perform publish update on the policies rendered
         */
        publishUpdate: function () {
            var self = this;


            if (self.$el.find('#saveButton').hasClass('disabled')) {
                // already saved, start publishing
                self.displayProgressBar('Loading', 'Please Wait...', false, false);
                self.startPublishing();
            } else {
                self.isLaunchedFromPublish = true;
                self.savePolicies();// this call save action on success of which publish will be called.

            }

        },

        /**
         * Starts Publish/Update action
         */
        startPublishing: function () {
            var self = this, policies, policyIds = [];
            policies = self.getPolicies();

            _.each(policies, function (pd) {
                policyIds.push(pd.id);
            });

            self.service.publishAndUpdate(policyIds, self.update, self.publishJobCallBack, function () {
                console.log('Error in calling publish/update');
                self.isLaunchedFromPublish = false;
                if (self.progressBarOverlay) {
                    self.progressBarOverlay.destroy();
                }
            }, self);
        },

        /**
         * On getting the job id, triggering job chaining
         * @param data
         */
        publishJobCallBack: function (data) {
            var self = this, jobView, idArray, activity = self.activity;
            jobView = new JobDetailedView();
            idArray = data['monitorable-task-instances']['monitorable-task-instance-managed-object'];
            if (self.input.UUID) {
                self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, idArray[idArray.length - 1]);
                self.activity.finish();
            }
            if (self.progressBarOverlay) {
                self.progressBarOverlay.destroy();
            }
            self.overlay.destroy();
            jobView.showPublishMultiJobDetailsScreen({
                job: idArray,
                activity: activity
            });

        },


        /**
         * In case of block application, it calculate diff and then launch compare view
         * @param e
         */
        calculateDiffAndLaunchCompare: function (e) {
            var self = this, policyId, appAccessMO, policy;
            policyId = Number($(e.target).attr('data-policy-obj'));
            policy = self.collection.get(policyId);

            if (_.isUndefined(policy.get('change-list'))) {
                // calculate diff.
                // on success, launch compare view
                appAccessMO = policy.get('app-access-details');

                //show progress bar
                self.displayProgressBar(self.context.getMessage("calculating-difference"),
                    self.context.getMessage("calculating_difference_progress_display"), false, false, true);

                self.getAllChangeList(appAccessMO, $.proxy(self.showSummaryPage, self, policyId), false);

            } else {
                // directly launch compare view

                self.displayProgressBar('Loading', 'Please Wait...', false, false);
                self.showSummaryPage(policyId);
            }

        },

        /**
         * Formatting of application names for fetching policies
         * @param array
         * @param prefix
         * @returns {string}
         */
        getStringFromArray: function (array, prefix) {
            var stg = "";
            _.each(array, function (element) {
                stg += element.name + ",";
            });
            if (array.length > 0) {
                stg = stg.substring(0, stg.length - 1);
                return stg;
            }
            return "All " + prefix;
        },

        /**
         * For input - ECM query fetch
         * @param sourceName
         * @param sourceValues
         * @returns {string}
         */
        getSourceValuesString: function (sourceName, sourceValues) {
            var returnSrcValues = "";
            if (sourceValues.length === 0) {
                if (sourceName === "user") {
                    returnSrcValues = "All Users";
                } else if (sourceName === "application") {
                    returnSrcValues = "All Applications";
                } else if (sourceName === "source_ip") {
                    returnSrcValues = "All Source IPs";
                } else if (sourceName === "destination_ip") {
                    returnSrcValues = "All Destination IPs";
                }
            } else {
                returnSrcValues = sourceValues;
            }
            return returnSrcValues;
        },

        /**
         * Disable all buttons if no policies available
         *
         */
        disableAllButtons: function () {
            var self = this;
            if (!self.input.UUID) {
                //disable save button
                self.$el.find('#saveButton').attr("disabled", "disabled");
                self.$el.find('#saveButton').attr('class', 'slipstream-primary-button disabled');

                // disable publish button
                self.$el.find('#publishButton').attr("disabled", "disabled");
                self.$el.find('#publishButton').attr('class', 'slipstream-primary-button disabled');
            }

            // disable update button
            self.$el.find('#updateButton').attr("disabled", "disabled");
            self.$el.find('#updateButton').attr("class", 'slipstream-primary-button disabled');
        },

      /**
       * register the events from collection.
       */
      registerCollectionEvents: function() {
        var me = this, policyCollection = me.collection;

        //on fetch complete of the collection add the
        // changelist back to the collection
        policyCollection.on('fetchComplete', function (){
          var policyIdChangeListMap = me.policyIdChangeListMap;
          if (!_.isEmpty(policyIdChangeListMap)) {
            _.each(policyIdChangeListMap, function(changeList, policyId) {
              var policy = policyCollection.get(policyId);
              if (!_.isEmpty(policy)) {
                policy.set('change-list', changeList);
              }
            });
          }
        });
      },

        /**
         * It builds the policy grid
         */
        buildPolicyGrid: function () {

            var self = this, gridConf, conf, gridContainer, gridHeight;
            self.collection = new Collection();
            self.registerCollectionEvents();

            // get grid configuration
            gridConf = new GridConf(self.context, self.collection, PolicyConstants, !_.isUndefined(self.input.UUID));
            conf = gridConf.getPolicyGridConfiguration();

            // handles total rows on grid
            conf.footer.getTotalRows = $.proxy(function () {
                var totalRows = self.collection.length;
                return totalRows === 0 ? totalRows : totalRows - 3;
            }, self);

            //Here 140 is grid header/footer height substracted from the grid container height
            gridContainer = self.$el.find('.app-secure-block-grid').empty();
            gridHeight = $(gridContainer).height() - 140;
            conf['height'] = gridHeight + 'px';

            self.policyConstants = PolicyConstants;

            // create view
            self.gridView = new PolicyView({
                context: self.context,
                activity: self.activity,
                el: gridContainer,
                policyManagementConstants: PolicyConstants,
                collection: self.collection,
                conf: conf,
                actionEvents: []
            });

            // build grid (calls render)
            self.gridView.gridWidget = new GridWidget({
                container: self.gridView.el,
                elements: conf,
                actionEvents: null,
                cellTooltip: $.proxy(self.gridView.cellTooltip, self.gridView)
            });

            // assign grid widget object when the grid is created
            $.when(self.gridView.gridWidget.build()).done(function (response) {
                self.gridView.gridWidgetObject = response;
                self.gridView.$el.bind('unlockPolicyEvent', $.proxy(self.onUnlockPolicyEvent, self));
            });

        },

        /**
         * It show delete error in case the policy is deleted
         */
        showPolicyDeletedError: function () {
            var self = this, confirmationDialogWidget, conf, errorMessage;
            if (self.input.UUID) {
                errorMessage = self.context.getMessage('policy_delete_error');
            } else {
                errorMessage = self.context.getMessage('policy_delete_error_block')
            }
            conf = {
                title: "Error",
                question: errorMessage,
                yesButtonLabel: self.context.getMessage('ok'),
                yesButtonTrigger: 'yesEventTriggered',
                kind: 'error'
            };

            confirmationDialogWidget = new ConfirmationDialogWidget(conf);

            // On confirm trigger handler
            confirmationDialogWidget.vent.on('yesEventTriggered', function () {
                // destroy the dialog
                confirmationDialogWidget.destroy();
                self.errorDialogWidget = null;
                self.removeChangeList();
            });
            self.errorDialogWidget = confirmationDialogWidget;

            // creates the dialog
            confirmationDialogWidget.build();
        },

        /**
         * Handles success callback
         * @param jsonRoot
         * @param jsonObj
         * @param data
         */
        onPoliciesSuccess: function (jsonRoot, jsonObj, changesPath, data) {
            var self = this, filterText = '', searchTokens = [], totalCount, filterOptions;

            if (jsonRoot === 'calculate-policies') {
                totalCount = data[jsonRoot][jsonObj] && data[jsonRoot][jsonObj].length;
            } else {
                totalCount = data[jsonRoot].total;
            }

            if (totalCount > 0) {
                //iterate through the changelist in the raw JSON, and add them as Policy model
                _.each(data[jsonRoot][jsonObj], function (policy) {
                    searchTokens.push('(id eq ' + policy['policy-id'] + ')');

                });
                // update filter query
                filterText += "(" + searchTokens.join(' or ') + ")";

                // bind fetch complete callback, add the changelist info to the model
                self.collection.bind('beforeFetchComplete', function () {
                    var isPolicyDeleted = false;
                    _.each(data[jsonRoot][jsonObj], function (policyDetails) {
                        var policyFromModel = self.collection.get(policyDetails['policy-id']);
                        if (policyFromModel) {
                            policyFromModel.set(changesPath, policyDetails);
                        } else {
                            isPolicyDeleted = true;
                            self.collection.unbind('beforeFetchComplete');
                            return true;
                        }
                    });

                    // destroy loading overlay
                    if (self.progressBarOverlay) {
                        self.progressBarOverlay.destroy();
                    }

                    if (isPolicyDeleted && !self.errorDialogWidget) {
                        self.disableAllButtons();
                        // in case summary page is up, don't show the error, just remove the change list
                        if (!self.summaryPage) {
                            self.showPolicyDeletedError();
                        } else {
                            self.removeChangeList();
                        }
                    }

                });

                // fetch the policies MO
                filterOptions = {
                    FILTER: filterText
                };
                self.collection.fetch({url: self.collection.url(), filterSearchSortOptions: filterOptions});
            } else {
                filterOptions = {
                    FILTER: '(id eq -1)'
                };
                self.collection.fetch({url: self.collection.url(), filterSearchSortOptions: filterOptions});
                self.disableAllButtons();
                self.progressBarOverlay.destroy();
            }
            // set filter options
            self.gridView.filterSearchSortOptions = filterOptions;
        },


        /**
         * Handles policies fetch failure
         */
        onPoliciesFailure: function () {
            var self = this;
            self.showErrorMessage(self.context.getMessage('policies_fetch_error'));
            self.progressBarOverlay.destroy();
        },


        /**
         * It fetches changelist by UUID
         */
        fetchPoliciesByUUID: function (id, successCallBack) {
            var self = this, JSON_ROOT, JSON_OBJ, path, onSuccess;
            JSON_ROOT = 'rule-analysis-result';
            JSON_OBJ = 'fw-policy-change-list';
            path = 'change-list';

            if (successCallBack) {
                onSuccess = $.proxy(successCallBack, self, JSON_ROOT, JSON_OBJ, path);
            } else {
                onSuccess = $.proxy(self.onPoliciesSuccess, self, JSON_ROOT, JSON_OBJ, path);
            }

            self.service.getPolicyCLByUUID(id, onSuccess,
                $.proxy(self.onPoliciesFailure, self));

        },


        /**
         * It fetches policies data from ECM
         */
        fetchPoliciesFromECM: function () {
            var self = this, JSON_ROOT, JSON_OBJ, path;
            JSON_ROOT = 'calculate-policies';
            JSON_OBJ = 'app-access-policy-details';
            path = 'app-access-details';

            self.service.getPolicies(self.getStringFromArray(self.selectedApplications, "Applications"),
                self.input.startTime, self.input.endTime, self.input.sourceName, self.input.sourceValues,
                self.input.deviceIds || "",
                self.input.lookupEventApptrack === true ? true : false,
                $.proxy(self.onPoliciesSuccess, self, JSON_ROOT, JSON_OBJ, path),
                $.proxy(self.onPoliciesFailure, self));
        },

        /**
         * Add Dymanic View configiurations
         * @param ecmLaunch
         * @returns {{}}
         */
        addDynamicConfiguration: function (ecmLaunch) {
            var self = this,
                sourceValuesString,
                applicationString,
                conf = {};


            if (ecmLaunch) {
                sourceValuesString = self.getSourceValuesString(self.input.sourceName, self.input.sourceValues);
                applicationString = self.getStringFromArray(self.selectedApplications, "Applications");
                conf.blockMessage = self.input.blockMessage || self.context.getMessage("block_message", [sourceValuesString, applicationString]);
                conf.block_help_message = self.input.blockHelpMessage || self.context.getMessage("block_help_message");
                conf['more_link'] = self.context.getMessage("more_link");
                conf['ua-help-identifier'] = self.context.getHelpKey("NETWORK_USER_APPLICATION_BLOCKING");

            } else {
                conf.blockMessage = self.context.getMessage("analysis_message");
                conf.block_help_message = self.context.getMessage("analysis_help_message");
            }

            return conf;
        },


        /**
         * Handles the render callback
         * @returns {BlockApplicationView}
         */
        render: function () {
            var self = this,
                conf, formConf, elements, toBePaddedHeight;

            // get dynamic info
            conf = self.addDynamicConfiguration(_.isEmpty(self.input.UUID));

            formConf = new BlockViewFormConf(self.context);
            elements = formConf.getValues({
                title: self.input.blockHeader,
                "blockMessage": conf.blockMessage,
                hasSaveButton: !self.input.UUID,
                hasPublishButton: !self.input.UUID,
                help: {
                    "content": conf["block_help_message"],
                    "ua-help-text": conf["more_link"],
                    "ua-help-identifier": conf["ua-help-identifier"]
                }});

            // construct the form layout for publish screen
            self.formWidget = new FormWidget({
                "elements": elements,
                "container": self.el
            });
            self.formWidget.build();

            //After building the form make sure that form sections have height which will make the overlay to take max height
            //Here the height is the total of all the sections other than grid sections and header/footer etc
            //It need to be substracted from overlay height
            toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(130);
            this.$el.find('.app-secure-block-grid').css('height', toBePaddedHeight + 'px');

            //build grid
            self.buildPolicyGrid();

            if (self.input.UUID) {
                // fetch policies from uuid (start analysis tool)
                self.fetchPoliciesByUUID(self.input.UUID);
            } else {
                self.fetchPoliciesFromECM();

            }

            // need to be updated for block application as well

            self.uuid = Slipstream.SDK.Utils.url_safe_uuid();
            return self;
        },

        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        onCancel: function (event) {
            event.preventDefault();
            this.overlay.destroy();
        },

        /**
         * Unsubscribe grid notifications on close
         */
        close: function() {
            var self = this;
            self.gridView.close();
        },

        /**
         * Handle unlock policy action
         * @param e
         * @param selectedRows
         * @param policyId
         */
        onUnlockPolicyEvent: function(e, selectedRows, policyId) {
            var self = this;

            var confirmDialogConf = {
                title: self.context.getMessage('action_unlock_policy_confirm_title'),
                question: self.context.getMessage('action_unlock_policy_confirm_question'),
                onYesEvent: $.proxy(self.unlockPolicy, self, policyId),
                xIcon: false,
                kind: 'warning',
                yesButtonLabel: self.context.getMessage('yes'),
                noButtonLabel: self.context.getMessage('no'),
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered'
            };
            // yes button callbacl
            self.confirmationDialogWidget = new ConfirmationDialogWidget(confirmDialogConf);

            self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                confirmDialogConf.onYesEvent();
            });

            self.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                self.confirmationDialogWidget.destroy();
            });
            // create confirmation dialog
            self.confirmationDialogWidget.build();
        },

        /**
         * Handle unlock policy
         * @param policyId
         */
        unlockPolicy: function(policyId) {
            var self = this, unlockProgressBar;
            // destroy the confirmation dialog
            self.confirmationDialogWidget.destroy();

            // create progress bar form
            unlockProgressBar = new ProgressBarForm({
                statusText: self.context.getMessage("action_unlock_policy_progress_text"),
                title: self.context.getMessage("action_unlock_policy_progress_title"),
                hasPercentRate: false
            });

            // create progress bar overlay
            self.unlockProgressBarOverlay = new OverlayWidget({
                view: unlockProgressBar,
                type: 'small',
                showScrollbar: false
            });
            self.unlockProgressBarOverlay.build();

            var onUnlockPolicySuccess = function() {
                console.log("Unlock policy success");
                self.unlockProgressBarOverlay.destroy();
            };
            var onUnlockPolicyError = function() {
                console.log("Unlock policy failed");
                self.unlockProgressBarOverlay.destroy();
            };

            $.ajax({
                type: 'POST',
                url: PolicyConstants.POLICY_URL + policyId + "/unlock",
                success: onUnlockPolicySuccess,
                error: onUnlockPolicyError
            });
        }
    });
    return BlockApplicationView;
});
