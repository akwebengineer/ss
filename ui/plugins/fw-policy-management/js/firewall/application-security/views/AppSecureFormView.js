/**
 * View to create a AppSecure Policy
 *
 */
define([
    'widgets/form/formWidget',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/AppSecureFormConf.js',
   '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
   '../../../../../ui-common/js/common/widgets/progressBarForm.js',
   'widgets/overlay/overlayWidget',
   '../AppFwConstants.js'
], function (FormWidget, ResourceView, AppSecureFormConfiguration, SmSSEEventSubscriber, ProgressBarForm, OverlayWidget, AppFwConstants) {

    var AppSecureFormView = ResourceView.extend({

        // events to be handled
        events: {
            'click #app_secure_profile_save': "submit",
            'click #app_secure_profile_cancel': "cancel",
            'validTextarea #app-secure-profile-form': 'validateForm'
        },


        /**
         * Initialize resource view
         * @param options
         */
        initialize: function (options) {
            var me = this;
            ResourceView.prototype.initialize.call(me, options);

            me.activity = options.activity;
            me.context = options.activity.getContext();

            me.successMessageKey = 'app_secure_create_success';
            me.editMessageKey = 'app_secure_edit_success';
            if(me.activity.getExtras().cuid){
                me.screenId = me.activity.getExtras().cuid;
            }else{
                me.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            }
            me.smSSEEventSubscriber = new SmSSEEventSubscriber();
            if(me.formMode === me.MODE_CLONE) {
                me.subscribedNotificationObj = me.subscribeNotifications();
            }

        },

        /**
         * Sets title based on form mode
         * @param formConfiguration
         */
        addDynamicFormConfig: function (formConfiguration) {
            var me = this, dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(me, formConfiguration);
            switch (me.formMode) {
                case me.MODE_EDIT:
                    dynamicProperties.title = me.context.getMessage('appfw_edit');
                    break;
                case me.MODE_CREATE:
                    dynamicProperties.title = me.context.getMessage('appfw_create');
                    break;
                case me.MODE_CLONE:
                    dynamicProperties.title = me.context.getMessage('appfw_clone');
                    break;

            }

            _.extend(formConfiguration, dynamicProperties);
        },

        /**
         * Handles Form rendering
         * @returns {AppSecureFormView}
         */
        render: function () {
            var me = this,
                formConf = new AppSecureFormConfiguration(me.context),
                formElements = formConf.getValues(), jsonData,
                ruleGridElement;

            jsonData = me.model.attributes['app-fw-policy'] || me.model.attributes || {};

            me.addDynamicFormConfig(formElements);

            // construct the conf view form
            me.form = new FormWidget({
                "elements": formElements,
                "container": me.el
            });


            me.form.build();

            // add the base class
            me.$el.addClass("security-management");

            // set the page data based on the json data received from serer on Edit action
            me.setPageData(jsonData);

            return me;
        },
        /**
         * [subscribeNotifications description]
         * @return {object} [sseEventSubscriptions with regestered uri]
         */
        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this,
            screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId,
            sseEventHandler, 
            notificationSubscriptionConfig = {
                'uri' : ['/api/juniper/sd/task-progress/'+ screenID ],
                'autoRefresh' : true,
                'callback' : function () {
                    self.getProgressUpdate();
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
           this.smSSEEventSubscriber.stopSubscription(this.subscribedNotificationObj);
        },
        /**
         * [getProgressUpdate description]
         */
        getProgressUpdate : function() {
             var self = this,
             screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;    
             $.ajax({
                url: '/api/juniper/sd/task-progress/'+ screenID,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02'
                },               
                success: function(data, status) {  
                    var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        if(progress >= 1)
                        {
                            self.cloneProgressBar._progressBar.setStatusText('Complete');
                            self.cloneProgressBar._progressBar.hideTimeRemaining();
                            self.cloneProgressBarOverlay.destroy(); 
                            self.activity.overlay.destroy();
                            if(self.subscribedNotificationObj){
                                self.unSubscribeNotification();
                            }
                        }
                        else {
                           if(self.cloneProgressBar) {
                            self.cloneProgressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                            self.cloneProgressBar._progressBar.setProgressBar(progress);  
                           } 
                        }    
                    } 
                    else 
                        self.cloneProgressBar._progressBar.setProgressBar(progress);          
                },
                error: function() {
                    console.log("Id retrival failed");
                }
            });
        },

        /**
         * Sets data from the model
         * @param jsonData
         * @returns {boolean}
         */
        setPageData: function (jsonData) {
            var me = this, blockAction, defaultRule, defaultRuleAction, defaultRuleBlockAction;

            if ($.isEmptyObject(jsonData)) {
                return false;
            }

            // set basic form details
            me.$el.find('#app-secure-profile-name').val(jsonData.name);
            me.$el.find('#app-secure-profile-description').val(_.unescape(jsonData['description']));
        },

        /**
         * Handles submit action
         * @param event
         */
        submit: function (event) {
            event.preventDefault();
            var me = this, jsonData = {}, blockMessageType, blockMessage, isValid = true, defaultRuleAction, defaultRuleBlockAction;

            // Check if the form  is valid or not
            if (!me.form.isValidInput()) {
                isValid = false;
            }

            if (!isValid) {
                console.log('The form is invalid');
                return;
            }
            if(me.formMode === me.MODE_EDIT){
                jsonData = {
                    'name': me.$el.find('#app-secure-profile-name').val(),
                    'description': _.escape(me.$el.find('#app-secure-profile-description').val())
                };
            }else{
                jsonData = {
                    'name': me.$el.find('#app-secure-profile-name').val(),
                    'description': _.escape(me.$el.find('#app-secure-profile-description').val()),
                    "default-rule": "Action=permit;Block Message=false"
                };
            }


            // bind model events
            me.bindModelEvents();

            me.model.set(jsonData);

            if(me.formMode === me.MODE_CLONE) {
                // cuid check if the object is form save as(cuncurrent edit)
                if(me.activity.getExtras().cuid){
                    me.cloneSaveAsPolicy(jsonData);
                }else{
                    me.clonePolicy(jsonData);
                }
                me.showProgressWindow();      
            } else {
                // save on the model
                me.model.save(null, {
                // handles save option. On success close the overlay
                    success: function (model) {

                        var json = model.toJSON();
                        json = json[model.jsonRoot];

                        // on success, destroy the model
                        me.activity.overlay.destroy();
                    }
                });
            }
        },
        /**
         * [clonePolicy description]
         * @param  {object} params [json data to be posted]
         */
        clonePolicy: function(params) {
            var self = this, dataObj, 
            screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId,
            policyId = self.activity.getIntent().getExtras().id;
            params.id = policyId;
            dataObj = {
              "app-fw-policy" : params
            };


           // {"app-fw-policy":{"name":"test222","description":"asdfsdfsd","default-rule":"Action=permit;Block Message=false"}}
            $.ajax({
                url: AppFwConstants.POLICY_URL+ 'clone/'+ screenID ,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Accept": AppFwConstants.POLICY_ACCEPT_HEADER,
                    "Content-Type": "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;charset=UTF-8"
                },               
                success: function(data, status) {  
                    
                },
                error: function() {
                    console.log("Clone failed");
                }
            });
        },
        /**
         * [cloneSaveAsPolicy description]
         * @param  {object} params [json data to be posted]
         */
        cloneSaveAsPolicy: function(params) {
            var self = this, dataObj, policyId = self.activity.getIntent().getExtras().id;
            params.id = policyId;
            dataObj = {
              "app-fw-policy" : params
            };


           // {"app-fw-policy":{"name":"test222","description":"asdfsdfsd","default-rule":"Action=permit;Block Message=false"}}
            $.ajax({
                url: AppFwConstants.POLICY_URL + policyId+'/draft/save-as?cuid='+ self.screenId ,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Accept": "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;q=0.01",
                    "Content-Type": "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;charset=UTF-8"
                },               
                success: function(data, status) {  
                      self.context.startActivity(new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST',{ mime_type: 'appSecur/json' }));
                },
                error: function() {
                    console.log("Clone failed");
                }
            });
        },
        /**
         * [showProgressWindow used in clone process]
         */
        showProgressWindow : function() {
            var self = this;

            this.cloneProgressBar = new ProgressBarForm({
                title: 'Clone Policy',
                statusText: "Start",
                hasPercentRate: true
            });
           
            this.cloneProgressBarOverlay = new OverlayWidget({
                view: this.cloneProgressBar,
                type: 'small',
                height : "680px",
                showScrollbar: false
            });
            this.cloneProgressBarOverlay.build();

        },

        /**
         * On cancel,  destroy the overlay
         * @param event
         */
        cancel: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        /**
         * Validates form details
         * @param event
         */
        validateForm: function (event) {
            var me = this, el, value = event.target.value, name, allowBlank = true,
                blankErrorText, removeError = false;

            // get target name
            name = event.target.name;

            el = me.$el.find('#app-secure-profile-description');

            if (el) {
                if (value && value.trim()) {
                    if (value.trim().length > 255) {
                        el.closest('.row').addClass('error');
                        el.siblings('.error').show().text(me.context.getMessage("maximum_length_error", [255]));

                    } else {
                        removeError = true;
                    }
                } else if (allowBlank) {
                    removeError = true;
                } else {
                    el.closest('.row').addClass('error');
                    el.siblings('.error').show().text(blankErrorText);
                }

                if (removeError) {
                    el.closest('.row').removeClass('error');
                    el.siblings('.error').hide().text('');
                }
            }
        }
    });
    return AppSecureFormView;
});