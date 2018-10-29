/**
 * The device configuration view page
 *
 * @module deviceConfigurationFormView
 * @author Vinay <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../../../sd-common/js/publish/conf/deviceViewConfigurationFormConf.js',
    './../../../../sd-common/js/publish/views/xmlcliConfigurationView.js',
    'widgets/tabContainer/tabContainerWidget',
    './../../../../sd-common/js/publish/views/deviceConfigurationTabView.js',
    'text!../../../../sd-common/js/publish/templates/deviceConfigurationLegend.html',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    './../../../../sd-common/js/publish/constants/previewConfgConstants.js',
    '../../../../ui-common/js/common/utils/SmUtil.js',
    'text!../../../../sd-common/js/publish/templates/deviceConfigurationWarning.html',
], function (Backbone,
        Syphon,
        FormWidget,
        DeviceViewConfigurationFormConf,
        XmlCliView,
        TabContainerWidget,
        ViewConfTabView,
        LegendTemplate, RestApiConstants,
        SmSSEEventSubscriber,
        PreviewConfgConstants,
        SmUtil,
        DeviceWarnigTpl) {

    var previewConfigurationFormView = Backbone.View.extend({
        /**
         *   add event for closing the vew conf overlay.
         */
        events: {
            'click #deviceConfOk': 'closeOverlay'
        },
        /**
         *  Initialize all the view require params
         */
        initialize: function () {
            var self = this;
            self.activity = self.options.activity;
            self.viewConfJobId = self.options.jobId;
            self.deviceDisplayName = self.options.title;
            self.deviceIPForFilter = self.options.deviceIP;
            self.deviceMoId = self.options.devicemodid;
            self.context = self.activity.context;
            self.smSSEEventSubscriber = new SmSSEEventSubscriber();
            self.tabView = false;
        },

        initializeRequiredContainers: function(){
            var me = this;
            me.tabContainer =  me.$el.find('.configurationtabview').empty();
        },
        /**
         *  Renders the form view in a overlay.
         *  builds the tab layout view
         *  returns this object
         */
        render: function () {
            var me = this,
                deviceViewConfigurationFormConf = new DeviceViewConfigurationFormConf(this.context);
            me.headerText='';
            // construct the Device conf view form
            me.formWidget = new FormWidget({
                "elements": deviceViewConfigurationFormConf.getValues({'title': me.deviceDisplayName, 'headerText' : me.headerText}),
                "container": this.el
            });
            me.formWidget.build();
            this.$el.addClass('security-management');
            me.initializeRequiredContainers();
            // safe check for notification 
            me.getConfigJobResult(me.viewConfJobId);
            // Subscribe  for notification with respective JobID
            me.subscribeNotifications();
            return this;
        },
        showErrorWarningMsg: function(warningMsg, isError){

            this.$el.find('.deviceWarningMsg').empty().html(Slipstream.SDK.Renderer.render(DeviceWarnigTpl, {warningMsg:warningMsg}));
            if(isError){
                this.$el.find('#errorDivPublishWarning').css({'color':'#eb2125', 'border-color' : '#eb2125'});;
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
                'uri' : ['/api/space/job-management/jobs/'+ self.viewConfJobId ],
                'autoRefresh' : true,
                'callback' : function () {
                    if(self.jobStatusAjax){
                        self.jobStatusAjax.abort('multiple calls');
                    }
                    self.getConfigJobResult(self.viewConfJobId);
                }
            };
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },
        /**
         *  get the preview job response with warning and error msg tto dispay
         *  @params jobId string
         */
        getConfigJobResult:function(jobId){
            var self = this,
                deviceResult,
                warningMessages,
                errorMessage,
                warningMsg="",
                fromJobDetails = self.deviceIPForFilter ? true : false;

            self.jobStatusAjax = $.ajax({
                url: new SmUtil().buildDynamicURL(PreviewConfgConstants.PREVIEW_CONF_DEVICE_LIST_URL, [jobId]) + (fromJobDetails ? "?filter=(securityDeviceId+eq+'"+self.deviceIPForFilter+"')" : ''),
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': PreviewConfgConstants.PREVIEW_CONF_DEVICE_LIST_ACCEPT_HEADER
                },
                success: function(data, status){
                    var i,
                    deviceResult = data['device-results']['device-result'], warningBold = '<b>Warning :</b>';
                    if($.isArray(deviceResult)){
                        deviceResult = deviceResult[0];
                    }

                    if(data['device-results'][RestApiConstants.TOTAL_PROPERTY]>0){

                        errorMessage = deviceResult['error-message'];

                        self.selectedSecurityDeviceId = deviceResult['security-device-id'];

                        if(fromJobDetails){
                            $.proxy(self.constructTabContainerAndUpdateCliXml(jobId), self);
                        } else{
                            if(errorMessage && deviceResult['status'] === 'FAILED'){
                                warningMsg += errorMessage;
                            } else if (deviceResult['warning-messages']){

                                warningMessages = deviceResult['warning-messages']['warning-message'];
                                if(Object.prototype.toString.call( warningMessages ) === '[object Array]'){

                                    for( i in warningMessages){
                                        if(warningMessages.hasOwnProperty(i)){
                                            // line break if multiple warnings.
                                            warningMsg += warningBold + warningMessages[i] + (i!==0 ? '<br/><br/>' : '');
                                        }
                                    }

                                } else if (warningMessages){
                                    warningMsg += warningBold + warningMessages;
                                }
                            }
                            // update tab container on success and on failure just display the error message, clear progress bar
                            if(deviceResult['status'] === 'SUCCESS'){
                                // do not display the Form error if no warning messages to display
                                if(warningMsg){
                                    self.showErrorWarningMsg(warningMsg, false);
                                }
                                $.proxy(self.constructTabContainerAndUpdateCliXml(jobId), self);

                            }else if (deviceResult['status'] === 'FAILED'){
                               self.destroyProgressBar();
                               self.showErrorWarningMsg(warningMsg, true);


                            }
                        }
                    }
                }
            });
       },
       /**
        *   Ledger display for XML and CLI configuration
        *   will be used in XMLCliConfigurationView.js also
        *
        *   returns string HTML
        */
        getConfigurationLegend : function(){
            var templateConf = {
                added: this.context.getMessage("device_view_configuration_added"),
                deleted: this.context.getMessage("device_view_configuration_deleted"),
                modified: this.context.getMessage("device_view_configuration_modified"),
                comments: this.context.getMessage("device_view_configuration_comments")
            };
            return Slipstream.SDK.Renderer.render(LegendTemplate, templateConf);
        },
       /**
        *   update iFrame src with latest job, after success or failure (once job completes)
        *   @params self object
        */
        constructTabContainerAndUpdateCliXml: function(){
            var self = this;
             // construct the tab container and render in to the device conf form region
            if(!self.tabView){

                self.tabView = new ViewConfTabView({
                    'context':self.context,
                    'tabContainer': self.tabContainer,
                    'activity': self,
                    viewConfJobId: self.viewConfJobId,
                    deviceMoId: this.deviceMoId
                });
                 console.log(self.tabView);
            }
            // CLI configuration fetch
            $.ajax({
                url: self.tabView.tabs[0].content.confViewUrl,
                type: 'GET',
                dataType:"json",
                complete: function(data){

                    //update the CLI container with the HTML response
                    var confViewContainer = self.$el.find('.configurationtabcliview').empty();
                    // also include the Configuration Legend while displaying the response
                    confViewContainer.append(self.getConfigurationLegend()+'</br>'+data.responseText);
                    self.destroyProgressBar();
                    self.tabContainer.show();
                    self.unSubscribeNotification();
                }
            });
        },
        /**
         * [unSubscribeNotification]
         */
         unSubscribeNotification: function(){
            // unsubscribe Notification for job details
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
        },

        /**
         *  Destroy/Hide progress bar
         *
         */
        destroyProgressBar: function(){
            this.activity.progressBar.destroy();
        },
        close: function(){
            this.activity.scheduleConfigJobTriggered = false;
            this.destroyProgressBar();
            this.unSubscribeNotification();
        },
        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        closeOverlay: function (event) {
            event.preventDefault();
            event.isPropagationStopped();
           
            this.activity.overlay.destroy();
        }

    });

    return previewConfigurationFormView;
});
