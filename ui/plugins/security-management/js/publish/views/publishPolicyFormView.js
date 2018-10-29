/**
 * The launch create firewall policy page
 *
 * @module FirewallPolicyFormView
 * @author Vinay <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/publishPolicyFormConfiguration.js',
    '../conf/publishGridConf.js',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    './deviceConfigurationFormView.js',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../jobs/JobDetailedView.js',
    'widgets/progressBar/progressBarWidget',
    'widgets/scheduleRecurrence/scheduleRecurrenceWidget',
    '../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../../sd-common/js/common/utils/TimeKeeper.js',
    './../../../../sd-common/js/publish/constants/publishConstants.js',
    '../../../../ui-common/js/common/utils/SmUtil.js',
    '../../../../ui-common/js/common/utils/SmProgressBar.js',
    '../../../../fw-policy-management/js/firewall/policies/models/firewallPolicyModel.js'
],  function (Backbone,
        Syphon,
        FormWidget,
        PublishPolicyFormConfiguration,
        Configs,
        GridWidget,
        OverlayWidget,
        DeviceConfigurationView,
        ConfirmationDialog,
        JobDetailedView,
        ProgressBarWidget,
        ScheduleRecurrenceWidget,
        SmSSEEventSubscriber,
        TimeKeeper,
        PublishConstants,
        SmUtil,
        SmProgressBar,
        FirewallPolicyModel) {

    var PolicyPolicyFormView = Backbone.View.extend({
        /**
         *   add event for
         *   closing,
         *   publish,
         *   publish&update,
         *   viewConfiguration the publish overlay.
         */
        events: {
            'click #btnPublish': 'publishPolicy',
            'click #btnPublishUpdate': 'publishUpdatePolicy',
            'click #linkPublishCancel': 'closeOverlay',
            "click .deviceViewConfiguration": "deviceViewConfiguration"
        },
        /**
         *  Initialize all the view require params
         *
         */
        initialize: function () {
           
            this.activity = this.options.activity;
            this.serviceType = this.options.serviceType;
            this.selectedPolicies = this.options.selectedPolicies;
            this.context = this.activity.context;
            this.UUID = this.getUUId();
            this.scheduleConfigJobTriggered = false;
            this.isUpdate = this.options.isUpdate;
            this.publishRequiredColumnString = "Required";

            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
            this.initialialCheck = true;

            /**
             *  initialize service URL and publish content-type
             *  based on the service type selected
             */
            if(this.serviceType === 'vpn'){
                this.initializeDefaultVPNValues();
            } else{
                this.initializeDefaultPolicyValues();
            }

            this.hasPublishRequire = false;
        },
        /**
         * [fetchPublishRequire description]
         * @return {[type]} [description]
         */
        fetchPublishRequire: function(){
          var self = this, url = '';
          if(self.serviceType === 'vpn' || self.hasPublishRequire === true){
            return;
          }
          url = PublishConstants.PUBLISH_MANDATORY_SELECT_URI.replace('{service_type}', self.serviceType) + '?publish_policy_uuid='+ self.UUID+'&'+ self.policies;
          
          $.ajax({
                url: url,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': PublishConstants.PUBLISH_MANDATORY_SELECT_ACCEPT_HEADER
                },
                success: function(data){
                  if(data['id-list'] && data['id-list']['ids'].length>0){
                    //Set the default selections in the grid
                    self.publishRequiredDefaultSelections = data['id-list']['ids'];
                    self.gridWidget.toggleRowSelection(self.publishRequiredDefaultSelections, 'selected');
                    self.hasPublishRequire = true;
                  }
                }
             });
        },
        /**
         *  initialize all VPN related values
         */
        initializeDefaultVPNValues: function(){
            this.serviceTypeUrl = 'vpn-management';
            this.publishContentType = 'vpn-management';
            this.policyIdKey = 'vpnId=';
        },
        /**
         *  initialize all other policy related values
         */
        initializeDefaultPolicyValues: function(){
            this.serviceTypeUrl = 'policy-management/'+this.serviceType;
            this.publishContentType = 'fwpolicy-provisioning';
            this.policyIdKey = 'policyId=';
        },
        /**
         *  generate Unique Id for each Publish action.
         *  returns unique identifier String
         */
        getUUId : function() {
            return Slipstream.SDK.Utils.url_safe_uuid();
        },
        /**
         *  Fetches the Overlay title base on the Update or Publish.
         *  returns title string
         */
        getPublishUpdateOverlayTitle: function(){
            if(this.isUpdate){
                return  this.context.getMessage("update_"+this.serviceType+"_policy_title");
            }else{
                return this.context.getMessage("publish_"+this.serviceType+"_policy_title");
            }
        },
        /**
         *  Fetches the Overlay title base on the Update or Publish.
         *  returns title string
         */
        getPublishUpdateOverlayTitleHelp: function() {
            
            if (this.isUpdate) {
                return {
                            "content": this.context.getMessage("update_policy_title_help"),
                            "ua-help-text": this.context.getMessage('more_link'),
                            "ua-help-identifier": this.context.getHelpKey("POLICY_UPDATING")
                       };  
                
            } else {
                return {
                            "content": this.context.getMessage("publish_policy_title_help"),
                            "ua-help-text": this.context.getMessage('more_link'),
                            "ua-help-identifier": this.context.getHelpKey("POLICY_PUBLISHING")
                       };  
            }
        },

        /**
         *  Renders the form view in a overlay.
         *  returns this object
         */
        render: function () {

            var option = {
                    title : this.getPublishUpdateOverlayTitle(),
                    titleHelp: this.getPublishUpdateOverlayTitleHelp(),
                    headingText : this.isUpdate === true ?  this.context.getMessage('publish_update_warning_message') : this.context.getMessage('publish_warning_message'),
                    isUpdate: this.isUpdate,
                    serviceType: this.serviceType
                },
                publishFormConf = new PublishPolicyFormConfiguration(this.context),
                elements = publishFormConf.getValues(option);

            // construct the form layout for publish screen
            this.formWidget = new FormWidget({
                "elements" : elements,
                "container" : this.el
            });
            this.formWidget.build();
            //After building the form make sure that form sections have height which will make the overlay to take max height
            //Here the height is the total of all the sections other than grid sections and header/footer etc etc  which need to be substracted from 
            //overlay height
            var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(174);
            this.$el.find('.publishcommongrid').css('height',  toBePaddedHeight+ 'px');

            // build the Publish device grid
            this.createPublishDeviceGrid();

            this.buildSchedulerWidget();

            return this;
        },
        buildSchedulerWidget: function(){

            var self = this, id = 'publish_update_schedule', scheduleSection = self.$el.find('#'+id);
            self.scheduleRecurrenceWidget = new ScheduleRecurrenceWidget( {
            "container": scheduleSection,
            'isFormSection' : true,
            /*values: {
                // set time 10min ahead..
                scheduleStartTime: new Date(new Date().getTime() + 300000) 
            },*/
            disableRecurrenceSection: true
          },self.context );
          self.scheduleRecurrenceWidget.build( );
          self.$el.find( '#'+id ).parent( ).css( 'width','75%' );
          self.$el.find( '#recurrence_id' ).hide( );
      },
        /**
         *   policy Device grid construction
         */
        createPublishDeviceGrid: function(){
            var me = this, 
                configs = new Configs(me.context, me),
                gridContainer = me.$el.find('.publishcommongrid').empty(),
                warning = me.$el.find('.publishcommongridwarning').empty(),
                i, policies="", option= {}, table, gridTable, gridConfig, gridHeight;

            //build the policy Id's string for fetching the related devices
            for(i in me.selectedPolicies){
                if(me.selectedPolicies.hasOwnProperty(i)){
                    policies+= ((i>0)?"&":"") + me.policyIdKey + ((me.selectedPolicies[i].id == undefined )?me.selectedPolicies[i]:me.selectedPolicies[i].id);
                }
            }
            me.policies = policies;
            option.policyIds = policies;
            option.uuId = this.UUID;
            option.serviceType = this.serviceType;
            option.activity = me;
            gridConfig = configs.getPublishDevicesGridConfig(option);
            //Here 180 is grid header/footer height substracted from the grid container height
            gridHeight =  $(gridContainer).height() - 180;
            gridConfig['height'] = gridHeight + 'px';
            // policy Device grid construction
            me.gridWidget = new GridWidget({
                container: gridContainer,
                actionEvents : {schedule: "schedule"},
                elements: gridConfig
            });
            
            me.gridWidget.build();
            me.$el.bind("gridOnSelectAll", function(e, status){
              console.log("gridOnSelectAll status: " + status);
              if(status === false){
                me.gridWidget.toggleRowSelection(me.publishRequiredDefaultSelections, 'selected');
              }
            });
            
            
            if(me.serviceType === 'firewall'){
                // get the status of the global policy publish,
                // based on the response display header text.
                me.getGlobalPolicyPublishedStatus();
            }

            gridTable = me.$el.find("#publish_affected_device_grid");
            me.gridTable = gridTable;
            table = me.$el.find("#publish_affected_device_grid")[0];
            if(me.serviceType !== 'vpn') {
            //Override this jqgrid provided callback so that we can decide when to block selection changes
              table.p.beforeSelectRow = function (rowId, evt) {
                var status = gridTable.jqGrid('getCell', rowId,'republishRequired'), isCheckboxClicked = $(evt.target).is('input[type="checkbox"][class="cbox"]');
                if(status !== me.publishRequiredColumnString && isCheckboxClicked) {
                  return true;
                }
                return false;
              };
              gridTable.on('gridLoaded', $.proxy(me.onGridDataLoad, me));
            }
            //subscribe for device grid notification
            // supress notification or do not listen to notification
           // me.subscribeNotifications(); 
        },
        /*
         * this is triggere once the grid ajax is completed.            
         * check for devices if no devices assigned for selected policy then disable display the error message 
         * and disable the publish update buttons
         */
        onGridDataLoadCheckForDevices: function(data){
          var me = this;
          me.fetchPublishRequire();
          if(me.initialialCheck){
            if(data.length<1){
              me.formWidget.showFormError(me.context.getMessage("sd.publish.nodevice.error"));
              me.$el.find('#errorDivPublishWarning').css({'color':'#eb2125', 'border-color' : '#eb2125'}); 
              if(me.$el.find('#btnPublishUpdate')){
                me.$el.find('#btnPublishUpdate').addClass("disabled"); 
                me.$el.find('#btnPublishUpdate').attr('disabled','disabled');
              }
              if(me.$el.find('#btnPublish')){
                me.$el.find('#btnPublish').addClass("disabled"); 
                me.$el.find('#btnPublish').attr('disabled','disabled');
              }
            } else{
              me.initialialCheck = false;
            }
          }
          
        },
        /**
         * On reload of grid data make the system selected devices as disabled and selection non changeable 
         */
        onGridDataLoad : function() {
          var me = this, i, l, gridTable = me.gridTable, ids = gridTable.jqGrid('getDataIDs'), rowId, row, checkBox, status;
          for (i = 0, l = ids.length; i < l; i++) {
            rowId = ids[i];
            row = gridTable.jqGrid('getGridRowById', rowId);
            status = gridTable.jqGrid('getCell', rowId, 'republishRequired');
            if (status === me.publishRequiredColumnString) {
              checkBox = $(row).find('input[type="checkbox"][class="cbox"]');
              //me.gridWidget.toggleRowSelection([rowId], 'selected');
              //Row disable is not needed; This disables cell clicks, and more in multi value items cells
//              gridTable.find("#" + rowId).attr("class", "rowDisabled");
//              gridTable.find("#" + rowId).attr("class", "ui-state-disabled");
              checkBox.attr("disabled", true);
              //checkBox.prop("checked", true);
            }
          }
        },
         /**
         * [subscribeNotifications]
         * @return {SmSSEEventSubscriber obj} [ will subscribe for notifcation with job id]
         * triggers the getConfigJobResult as notication call back
         */
         subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this, sseEventHandler, notificationSubscriptionConfig = {
                'uri' : ['/api/juniper/sd/device-management/devices' ],
                'autoRefresh' : true,
                'callback' : function () {
                    self.gridWidget.reloadGrid();
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
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
        },
        /**
         *  get the status of the global policy publish
         *  @params warning(container) object
         *
         */
        getGlobalPolicyPublishedStatus:function(){
            var me = this, formWidget = me.formWidget;
            $.ajax({
                url: PublishConstants.GLOBAL_POLICY_PUBLISH_URL,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': PublishConstants.GLOBAL_POLICY_PUBLISH_ACCEPT_HEADER
                },
                success: function(data){
                  var prePostPolicies = data.policies.policy, preWarning = false, postWarning = false, policyEachObj, policyPubishState, policyRuleCount, policyObj;
                  $.each(data.policies.policy, function(obj){
                    policyEachObj = prePostPolicies[obj];

                    policyEachObj = new FirewallPolicyModel(policyEachObj);
                    if(!(policyEachObj.isPolicyFullyPublished() || (policyEachObj.isPolicyNotPublished() && policyEachObj.isEmptyPolicy()))){
                          if(policyEachObj.isPreGroupPolicy()){
                              preWarning = true;
                          }else if(policyEachObj.isPostGroupPolicy()){
                               postWarning = true;
                          }
                      }
                  });
                  if(preWarning && postWarning){
                    formWidget.showFormError(me.context.getMessage('publish_update_pre_post_warning'));
                  } else if(preWarning){
                    formWidget.showFormError(me.context.getMessage('publish_update_pre_warning'));
                  } else if(postWarning){
                    formWidget.showFormError(me.context.getMessage('publish_update_post_warning'));
                  }
                 
               }
             });
        },
        /**
         *   schedule the job for view configuration of each device, it return the jobId,
         *   based on that id fetch the XML and CLI configurations
         *   @param options Object, contains config, JSON data
         */
       scheduleConfigJob:function(options){
            var self = this;

            $.ajax({
                url: new SmUtil().buildDynamicURL(PublishConstants.SCHEDULE_CONF_JOB_URL, [self.serviceTypeUrl, options.deviceId]),
                data: options.postData,
                type: 'POST',
                dataType:"json",
                headers:{
                    'accept': PublishConstants.SCHEDULE_CONF_JOB_ACCEPT_HEADER,
                    'content-type': PublishConstants.SCHEDULE_CONF_JOB_CONTENT_TYPE_HEADER
                },
                success: function(data){
                    var jobId = data["task"].id;
                    console.log("jobId: "+jobId);
                    if(jobId){

                        self.overlay = new OverlayWidget({
                            view: new DeviceConfigurationView({
                                activity: self, jobId: jobId,
                                title: self.context.getMessage('device_view_configuration_title')+' '+options.deviceName
                            }),
                            //type: "x-large",
                            type: "large",
                            showScrollbar: true
                        });
                        self.overlay.build();
                        // build the progressBar widget, by setting the overlay container to the progressBar container.
                        // as per new progressbar changes get the overlay container and assign to the progressbar
                        self.progressBar = new ProgressBarWidget({
                             "container": self.overlay.getOverlayContainer(),
                             "hasPercentRate": false,
                             "statusText": self.context.getMessage('device_view_configuration_progress_message')
                        }).build();
                    }
                }
            });
       },
       
       /**
        *   triggered on click of view configuration action
        */
        deviceViewConfiguration: function(selectedDevice){
            var options= {},
                self = this,
                services = this.selectedPolicies,
                selectedDevices = [selectedDevice],
                deviceId = selectedDevices[0]['id'],
                deviceName = selectedDevices[0]['name'],
                serviceIDs = selectedDevices[0]['serviceIDs'].split(","),
                // build the JSON data for scheduler API
                jsonData = {
                    "preview":{
                        "policy-ids":{
                            "policy-id": serviceIDs 
                        }
                    }
                };
            // build the config for fetching the preview configuration JobId
            if (selectedDevices.length>0){
                options={
                    postData: JSON.stringify(jsonData),
                    deviceId: deviceId,
                    deviceName: deviceName
                };
                // check if the scheduler is triggered, this is to avoid 2 overlay opening if the double click on view link
                 if(!self.scheduleConfigJobTriggered){
                    self.scheduleConfigJobTriggered = true;
                    self.scheduleConfigJob(options);
                 }
            }
        },

        /**
         *  Create a confirmation dialog with basic settings
         *  Need to specify title, question, and event handle functions in "option"
         *  @params option Object
         */
        createConfirmationDialog: function(option) {

            var self = this;
            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('yes'),
                noButtonLabel: self.context.getMessage('no'),
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                noButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                xIcon: true
            });

            this.bindEvents(option);
            this.confirmationDialogWidget.build();
        },
        /**
         *  bind the confirmation overlay yes and no events
         *  @params option Object
         */
        bindEvents: function(option) {
            var self = this;
            self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (self.finalSubmit) {
                    self.finalSubmit(option);
                }
            });

            self.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                if (option.noEvent) {
                    option.noEvent();
                }
            });

        },
        /**
         * [isPublishUpdateValid check for mandate fields before publish/update]
         * @return {Boolean} [description]
         */
        isPublishUpdateValid: function(){
          var self=this,selectedDevicesIDs = self.getSelectedDevices(),
                scheduleAtDate = self.scheduleRecurrenceWidget.getScheduleStartTime(),scheduleAt;
            if(!self.scheduleRecurrenceWidget.isValid()){
              return false;
            }
            if( selectedDevicesIDs.length === 0 && !self.hasPublishRequire && self.serviceType !== 'vpn') {
              self.formWidget.showFormError(self.context.getMessage("sd.publish.devicegrid.error"));
              return false;
            }
            return true;
        },
        /**
         *   final submit after confirmation launch the Job details overlay
         *   @param option object
         */
        finalSubmit: function(option){
            var self = this, 
                jsonData,
                selectedDevicesIDs = self.getSelectedDevices(),
                scheduleAtDate = self.scheduleRecurrenceWidget.getScheduleStartTime(),scheduleAt;

            if(scheduleAtDate){
              scheduleAt = "schedule=(at("+scheduleAtDate.getSeconds()+" "+scheduleAtDate.getMinutes()+" "+scheduleAtDate.getHours()+" "+scheduleAtDate.getDate()+" "+(scheduleAtDate.getMonth()+1)+" ? "+scheduleAtDate.getFullYear()+")) ";
            }  
            jsonData = {
                "publish":{
                  "publish-uuid" : self.UUID,
                  "delete-oldest-snapshot": self.options.deleteOldestSnapshot,
                  "update" : option.update,
                  "device-ids": selectedDevicesIDs
                }
            };
            if(self.serviceType === 'vpn'){
              self.smProgressBar =  new SmProgressBar({
                "container": this.activity.overlay.getOverlayContainer(),
                "hasPercentRate": false,
                "isSpinner" : true,
                "statusText": "Processing",
                "handleMask": true
              });
              self.smProgressBar.build();
            }

            $.ajax({
                url: new SmUtil().buildDynamicURL(PublishConstants.PUBLISH_URL, [self.serviceTypeUrl])+ (scheduleAtDate?'?'+scheduleAt:''),
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(jsonData),
                headers:{
                    "x-date": TimeKeeper.getXDate( ),
                    'accept': PublishConstants.PUBLISH_ACCEPT_HEADER,
                    'content-type': new SmUtil().buildDynamicURL( PublishConstants.PUBLISH_CONTENT_TYPE_HEADER, [self.publishContentType])
                },
                success: function(data) {
                    option.event.preventDefault();
                    self.closeOverlay(option.event);

                    var jsonJobIds = data['monitorable-task-instances']['monitorable-task-instance-managed-object'];
                    /*
                     * launches the Job Details overlay
                     */
                    var jobView = new JobDetailedView();
                    console.log(jsonJobIds);
                    jobView.showPublishMultiJobDetailsScreen({
                      job : jsonJobIds.length > 1 ? jsonJobIds : jsonJobIds[0],
                      activity : self.activity
                    });
                },
                // handing the server failure.
                error: function(model) {

                    self.confirmationDialogWidget = new ConfirmationDialog({
                        title: self.context.getMessage('concurrent_error_title'),
                        question: model.error().statusText,
                        yesButtonLabel: self.context.getMessage('ok'),
                        yesButtonCallback: function() {
                            self.confirmationDialogWidget.destroy();
                        },
                        yesButtonTrigger: 'yesEventTriggered',
                        xIcon: true
                    }).build();

                    console.log(model.error().statusText);
                }
            });
        },
        /**
         * Returns the selected devices
         */
        getSelectedDevices : function () {
          var me = this, selections = me.gridWidget.getSelectedRows(true),
            allRowIds = selections['allRowIds'];
          return _.isEmpty(allRowIds) ? selections['selectedRowIds'] : allRowIds;
        },
        /**
         *   Publish policy
         *   @params e event(mouse, keyboard)
         */
        publishPolicy: function (e) {
            var options = {
               title: this.context.getMessage('publish_update_confirmation_title'),
                question: this.context.getMessage('publish_update_confirmation_message'),
                event: e,
                update: false
            };
            if(this.isPublishUpdateValid()){
              this.finalSubmit(options);
            }
        },
        /**
         *   Publish and Update 
         *   @params e event(mouse, keyboard)
         */
        publishUpdatePolicy: function (e) {
          if(this.isPublishUpdateValid()){
            this.checkWarningMsgBeforePublishUpdate(e);
          }
        },
        /**
         *   Check for for warning message before publish and update
         *   @params e event(mouse, keyboard)
         */
         checkWarningMsgBeforePublishUpdate: function(e){

            var self = this, i, securityDevicesIDs =[], jsonData, securityDevices = this.gridWidget.getAllVisibleRows(), options;
            for(i in securityDevices){
                if(securityDevices.hasOwnProperty(i)){
                    securityDevicesIDs.push(securityDevices[i].id);
                }
            }
            jsonData  = {
                "id-list": {
                    "ids": securityDevicesIDs
                    }
                } ;
            $.ajax({
                url: PublishConstants.PUBLISH_DEVICE_CC_STATE_URL,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(jsonData),
                headers:{
                    'accept': PublishConstants.PUBLISH_DEVICE_CC_STATE_ACCEPT_HEADER,
                    'content-type': PublishConstants.PUBLISH_DEVICE_CC_STATE_CONTENT_TYPE_HEADER
                },
                success: function(data){
                    if(data['device-cc-status-warning-required'].status) {
                        options = {
                            title: self.context.getMessage('publish_update_confirmation'),
                            question: self.context.getMessage("publish_update_confirmation_custom_msg"),
                            event: e,
                            update: true
                        };
                    }else {
                        options = {
                            title: self.context.getMessage('publish_update_confirmation'),
                            question: ((self.serviceType === 'vpn')?self.context.getMessage('publish_update_vpn_confirmation_all_msg'):self.context.getMessage('publish_update_confirmation_all_msg')),
                            event: e,
                            update: true
                        };
                    }

                    self.createConfirmationDialog(options);
                }
            });
         },
        /**
         *  clear cache from the server based on the UUID
         *  @params uuid string
         */
        clearCache:function(uuid){
            $.ajax({
                url: new SmUtil().buildDynamicURL(PublishConstants.PUBLISH_CACHE_URL, [this.serviceTypeUrl, uuid]),
                type: 'DELETE'
            });
       },
       close: function(){
        if(this.smProgressBar){
          this.smProgressBar.destroy();
        }
        if(this.currentView && this.currentView.clearCache){
          this.currentView.clearCache(this.currentView.UUID);
        }else {
          this.clearCache(this.UUID);
        }
       },
        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        closeOverlay: function (event) {
            //this.unSubscribeNotification();
            event.preventDefault();
            this.activity.overlay.destroy();
        }

    });

    return PolicyPolicyFormView;
});
