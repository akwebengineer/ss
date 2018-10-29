/**
 * The launch create firewall policy page
 *
 * @module User Firewall Update View
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
     '../conf/updateFormConfiguration.js',
     '../../../../../ui-common/js/common/utils/SmUtil.js',
     '../conf/updateGridConf.js',
     'widgets/grid/gridWidget',
     'widgets/overlay/overlayWidget',
     'widgets/confirmationDialog/confirmationDialogWidget',
     './deployConfigurationFormView.js',
     'widgets/progressBar/progressBarWidget',
     '../../constants/userFirewallConstants.js',
    '../../common/utils/userFwUtil.js',
    'widgets/confirmationDialog/confirmationDialogWidget'
],  function (Backbone,
        Syphon,
        FormWidget,
        UpdateFormConfiguration,
        SmUtil,
        UpdateGridConf,
        GridWidget,
        OverlayWidget,
        ConfirmationDialog,
        DeployConfigurationFormView,
        ProgressBarWidget,
        UserFwConstants,
        UserFwUtil,
        ConfirmationDialogWidget) {

    var UpdateFormView = Backbone.View.extend({

            /**
             *   add event for
             *   closing,
             *   deploy,
             *   viewConfiguration.
             */
            events: {
                'click #btnDeploy': 'deploy',
                'click #linkDeployCancel': 'closeOverlay',
                "click .deviceViewConfiguration": "deviceViewConfiguration"
            },
            /**
             *  Initialize all the view require params
             *
             */
            initialize: function () {

                this.activity = this.options.activity;
                this.objType = this.options.selectedDevices.objType;
                this.context = this.activity.context;
                this.objId = this.options.selectedDevices.objId;
                this.initialialCheck = true;
                this.userFwUtil = new UserFwUtil();
            },

            /**
             *  Fetches the Overlay title base on the Object Type.
             *  returns title string
             */
            getDeployOverlayTitle: function(){
                if(this.objType == "ACTIVE_DIRECTORY"){
                    return  this.context.getMessage("update_active_directory_title");
                }else{
                    return this.context.getMessage("update_access_profile_title");
                }
            },

            /**
             *  Fetches the Overlay title base on the Object Type.
             *  returns title string
             */
            getDeployOverlayTitleHelp: function() {
                if(this.objType == "ACTIVE_DIRECTORY"){
                    return {
                                "content": this.context.getMessage("update_active_directory_title_help"),
                                "ua-help-text": this.context.getMessage('more_link'),
                                "ua-help-identifier": this.context.getHelpKey("DEPLOYING_THE_ACTIVE_DIRECTORY_PROFILE_TO_SRX_SERIES_DEVICES")
                           };

                } else {
                    return {
                                "content": this.context.getMessage("update_access_profile_title_help"),
                                "ua-help-text": this.context.getMessage('more_link'),
                                "ua-help-identifier": this.context.getHelpKey("DEPLOYING_THE_ACCESS_PROFILE_TO_SRX_SERIES_DEVICES")
                           };
                }
            },

             /**
             *  Fetches the Overlay title base on the Object Type.
             *  returns title string
             */
            getWarningMessage: function(){
                if(this.objType == "ACTIVE_DIRECTORY"){
                    return  this.context.getMessage("update_active_directory_warning");
                }else{
                    return this.context.getMessage("update_access_profile_warning");
                }
            },



            /**
             *  Renders the form view in a overlay.
             *  returns this object
             */
            render: function () {

                var option = {
                        title : this.getDeployOverlayTitle(),
                        titleHelp: this.getDeployOverlayTitleHelp(),
                        headingText : "<span><div class='icon_error'></div> " + this.getWarningMessage() + "</span>",
                        objType: this.options.selectedDevices.objType
                    },
                    updateFormConf = new UpdateFormConfiguration(this.context),
                    elements = updateFormConf.getValues(option);

                // construct the form layout for publish screen
                this.formWidget = new FormWidget({
                    "elements" : elements,
                    "container" : this.el
                });
                this.formWidget.build();

                var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(174);
                this.$el.find('.updatecommongrid').css('height',  toBePaddedHeight+ 'px');

                this.createUpdateDeviceGrid();

                return this;
            },

            /**
             *   Deploy Object
             *   @params e event(mouse, keyboard)
             */
            deploy: function (e) {
                var options = {
                    title: this.context.getMessage('update_confirmation_title'),
                    question: '',
                    event: e
                };
                if(this.objType == "ACTIVE_DIRECTORY"){
                    options.question = this.context.getMessage('update_active_directory_warning');
                } else{
                    options.question = this.context.getMessage('update_access_profile_warning');
                }
                if(this.isUpdateValid()){
                  this.createConfirmationDialog(options);
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
             * [isUpdateValid check for mandate fields before publish/update]
             * @return {Boolean} [description]
             */
            isUpdateValid: function(){
              var self=this,selectedDevicesIDs = self.getSelectedDevices();
                if( selectedDevicesIDs.length === 0) {
                  self.formWidget.showFormError(self.context.getMessage("sd.publish.devicegrid.error"));
                  return false;
                }
                return true;
            },

            /**
             * Returns the selected devices
             */
            getSelectedDevices : function () {
              var me = this, selections = me.gridWidget.getSelectedRows(true),
                allRowIds = selections['allRowIds'];
              return _.isEmpty(allRowIds) ? selections['selectedRowIds'] : allRowIds;
            },

             getDeployURL: function(){
                return UserFwConstants[this.objType].DEPLOY_URL.replace('{0}',this.objId);
            },
            getDeployAccept: function(){
                return UserFwConstants[this.objType].DEPLOY_ACCEPT;
            },

            getDeployContentType: function(){
                return UserFwConstants[this.objType].DEPLOY_CONTENT_TYPE;
            },

            /**
             *   final submit after confirmation launch the Job details overlay
             *   @param option object
             */
            finalSubmit: function(option){
                var self = this,
                    jsonData,
                    selectedDevicesIDs = self.getSelectedDevices();

                jsonData = {
                    "deploy-request":{
                      "device-ids": {
                        "device-id": selectedDevicesIDs
                    }
                  }
                };
                $.ajax({
                    url: self.getDeployURL(),
                    type: 'POST',
                    dataType:"json",
                    data: JSON.stringify(jsonData),
                    headers:{
                        'accept': self.getDeployAccept(),
                        'content-type': self.getDeployContentType()
                    },
                    success: function(data) {
                        option.event.preventDefault();
                        self.closeOverlay(option.event);

                        var jsonJobId = data['task']['id'];
                        self.userFwUtil.showJobInformation(jsonJobId, self.context);
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
             *   User Firewall Device grid construction
             */
            createUpdateDeviceGrid: function(){
                var me = this,
                    configs = new UpdateGridConf(me.context, me),
                    gridContainer = me.$el.find('.updatecommongrid').empty(),
                    warning = me.$el.find('.updatecommongridwarning').empty(),
                    option= {}, table, gridTable, gridConfig, gridHeight;

                option.objType = this.objType;
                option.objId = this.objId;
                option.activity = me;
                gridConfig = configs.getUpdateDevicesGridConfig(option);
                //Here 180 is grid header/footer height substracted from the grid container height
                gridHeight =  $(gridContainer).height() - 180;
                gridConfig['height'] = gridHeight + 'px';

                me.gridWidget = new GridWidget({
                    container: gridContainer,

                    elements: gridConfig
                });

                me.gridWidget.build();

                gridTable = me.$el.find("#update_affected_device_grid");
                me.gridTable = gridTable;
                table = me.$el.find("#update_affected_device_grid")[0];
            },
            /*
             * this is triggered once the grid ajax is completed.
             * check for devices if no devices assigned for selected Object then disable display the error message
             * and disable the update button
             */
            onGridDataLoadCheckForDevices: function(data){
              var me = this;
              if(me.initialialCheck){
                if(data.length<1){
                  me.formWidget.showFormError(me.context.getMessage("sd.update.userfw.nodevice.error"));
                  me.$el.find('#errorDivPublishWarning').css({'color':'#eb2125', 'border-color' : '#eb2125'});
                  if(me.$el.find('#btnDeploy')){
                    me.$el.find('#btnDeploy').addClass("disabled");
                    me.$el.find('#btnDeploy').attr('disabled','disabled');
                  }
                } else{
                  me.initialialCheck = false;
                }
              }

            },
           /**
            *   triggered on click of view configuration action
            */
            deviceViewConfiguration: function(selectedDevice){
                var options= {},
                    self = this,
                    selectedDevices = [selectedDevice];
                if (selectedDevices.length>0){
                    options={
                        deviceId: selectedDevices[0]['id'],
                        deviceName: selectedDevices[0]['name'],
                        objectId: selectedDevices[0]['objectId']
                    };
                    self.getDeployConfig(options);
                }
            },
            getDeployConfig:function(options){
                var self = this;
                self.overlay = new OverlayWidget({
                    view: new DeployConfigurationFormView({
                                   activity: self,
                                   title: self.context.getMessage('device_view_configuration_title')+' '+options.deviceName,
                                   objId: this.objId,
                                   objType: this.objType,
                                   deviceId: options.deviceId
                               }),
                    type: "large",
                    showScrollbar: true
                });
                self.overlay.build();
                self.buildProgressBar();
           },

           buildProgressBar: function(){
           var self = this;
           self.progressBar = new ProgressBarWidget({
                                "container": self.overlay.getOverlayContainer(),
                                "hasPercentRate": false,
                                "statusText": self.context.getMessage('device_view_configuration_progress_message')
                           }).build();
           },

            /**
             *   destroy the overlay
             *   @params event(mouse, keyboard)
             */
            closeOverlay: function (event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            }


    });

    return UpdateFormView;
});
