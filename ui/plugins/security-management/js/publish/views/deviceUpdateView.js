/**
 * The launch Update device ILP page
 *
 * @module DeviceUpdate View
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/deviceUpdateFormConf.js',
    '../models/deviceUpdateModel.js',
    '../../jobs/JobDetailedView.js',
    'widgets/scheduleRecurrence/scheduleRecurrenceWidget',
    '../models/sdDeviceModel.js',
    '../models/sdDeviceCollection.js',
    '../../../../sd-common/js/common/utils/TimeKeeper.js',
    './../../../../sd-common/js/publish/constants/publishConstants.js'
],  function (Backbone, 
        Syphon, 
        FormWidget, 
        OverlayWidget, 
        DeviceUpdateConf,
        DeviceUpdateModel,
        JobDetailedView,
        ScheduleRecurrenceWidget,
        DeviceModel,
        DeviceCollection,
        TimeKeeper,
        PublishConstants) {

    var DeviceUpdateFormView = Backbone.View.extend({
    
        /**
         *   add event for 
         *   closing, 
         *   update
         */
        events: {
            'click #btnUpdate': 'submit',
            'click #linkUpdateCancel': 'closeOverlay'
        },
        'model': new DeviceUpdateModel(),

        buildSchedulerWidget: function(){

            var self = this, id = 'device_update_schedule', scheduleSection = self.$el.find('#'+id);
            self.scheduleRecurrenceWidget = new ScheduleRecurrenceWidget( {
            "container": scheduleSection,
            'isFormSection' : true
          },self.context );
          self.scheduleRecurrenceWidget.build( );
          
          this.$el.find( '#'+id ).parent( ).css( 'width','75%' );
          this.$el.find( '#recurrence_id' ).hide( );
      },
      /**
       * Auto Select the check boxes which were last selected by user
       */
      setServiceCheckboxSelection : function () {
        var self = this, selectedServiceTypes = self.selectedServiceTypes;
        
        if($.isArray(selectedServiceTypes)) {
          $.each(selectedServiceTypes, function (index, serviceType){
            if('POLICY' === serviceType){
              checkbox = self.$el.find("#firewallPolicy");
              checkbox.prop('checked', true);
            }
            if('IPSPOLICY' === serviceType){
              checkbox = self.$el.find("#ipsPolicy");
              checkbox.prop('checked', true);
            }
            if('NAT' === serviceType){
              checkbox = self.$el.find("#nat");
              checkbox.prop('checked', true);
            }
            if('VPN' === serviceType){
              checkbox = self.$el.find("#vpn");
              checkbox.prop('checked', true);
            }
          });
        }
      },
      setEnablePolicyRematchCheckbox : function () {
        var self = this;
        if(self.enablePolicyRematch) {
          self.$el.find("#checkbox_enable_policy_rematch").prop('checked', true);
        }
      },
      USER_PREF_SERVICE_SELECTION_KEY : "sm:update:update_device_service_type",
      USER_PREF_ENABLE_POLICY_REMATCH_KEY : "sm:update:enable_policy_rematch",
        /**
         *  Initialize all the view require params
         */
        initialize: function () {
            var self = this,
            onError,
            onFetch,
            sdDeviceList;

            self.activity = self.options.activity;
            self.context = self.activity.context;
            self.selectedDevices = [];
            /**
             * [if update all SD devices]
             * [fetch all the SD devices and then assing it to the selectedDevices]
             */
            if(self.options.isUpdateAllSdDevices){
                onError = function(){
                    console.log('failed for fetch all SD devices.');
                }; 
                onFetch = function(){
                    sdDeviceList = self.deviceCollection.models;
                    $(sdDeviceList).each(function (i) {
                        self.selectedDevices.push(sdDeviceList[i].attributes.id);
                    });

                };
                self.deviceCollection = new DeviceCollection();
                self.deviceCollection.fetch({
                    url :self.deviceCollection.url({property:"managementStatus", modifier:"eq", value: "SD Changed"}),
                    success: onFetch,
                    error: onError
                });
            }else{
                self.selectedDevices = self.options.selectedDevices
            }
            self.model = new DeviceUpdateModel();
            
            // fetch the global update options
            self.model.fetch();
        },

        /**
         *  Renders the form view in a overlay.
         *  returns this object
         */
        render: function () {
            var self = this, options = self.model.attributes, updateFormConf = new DeviceUpdateConf(self.context);

            // true only for update device
            options.isUpdateDevice = true;
            
            // build the device update form
            self.formWidget = new FormWidget({
                "elements" : updateFormConf.getValues(options),
                "container" : self.el
            });
            self.formWidget.build();
            self.selectedServiceTypes = Slipstream.reqres.request("ui:preferences:get", self.USER_PREF_SERVICE_SELECTION_KEY);
            self.enablePolicyRematch = Slipstream.reqres.request("ui:preferences:get", self.USER_PREF_ENABLE_POLICY_REMATCH_KEY);
            self.setServiceCheckboxSelection();
            self.setEnablePolicyRematchCheckbox();

            //initialize scheduler
            self.buildSchedulerWidget();

            return self;
        },
        /**
         *  final submit on update click
         *  @param event [mouse click event] object
         */
        submit: function(event){

            var self = this,
                properties = Syphon.serialize(self),
                jsonData, 
                serviceTypes = [],
                scheduleAtDate = self.scheduleRecurrenceWidget.getScheduleStartTime(),scheduleAt;
            if(!self.scheduleRecurrenceWidget.isValid()){
              return;
            }
            if(scheduleAtDate){
              scheduleAt = "schedule=(at("+scheduleAtDate.getSeconds()+" "+scheduleAtDate.getMinutes()+" "+scheduleAtDate.getHours()+" "+scheduleAtDate.getDate()+" "+(scheduleAtDate.getMonth()+1)+" ? "+scheduleAtDate.getFullYear()+")) ";
            }  

            // push all the selected service type.
            if(properties['firewallPolicy'] === true){
                serviceTypes.push(PublishConstants.POLICY);
            }
            if(properties['ipsPolicy'] === true){
                serviceTypes.push(PublishConstants.IPSPOLICY);
            }
            if(properties['nat'] === true){
                serviceTypes.push(PublishConstants.NAT);
            }
            if(properties['vpn'] === true){
                serviceTypes.push(PublishConstants.VPN);
            }
            if(serviceTypes.length === 0){
              self.formWidget.showFormError(self.context.getMessage('service_selction_mandatory'));
              return false;
            }
            // building the required Json format for Update
            jsonData = {
                "update-devices": {
                    "sd-ids": {
                        "id": self.selectedDevices
                    },
                    "service-types": {
                        "service-type": serviceTypes
                    },
                    "update-options": {
                        "enable-policy-rematch-srx-only": properties['checkbox_enable_policy_rematch'],
                        "preserve-session-sc-os": properties['checkbox_preserve_session_scOS']
                    }
                }
            };

            $.ajax({
                url: PublishConstants.DEVICE_UPDATE_URL + (scheduleAtDate?'?'+scheduleAt:''),
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(jsonData),
                headers:{
                    'accept': PublishConstants.DEVICE_UPDATE_ACCEPT_HEADER,
                    'content-type': PublishConstants.DEVICE_UPDATE_CONTENT_TYPE_HEADER,
                    "x-date": TimeKeeper.getXDate( )
                },
                success: function(data, status){
                    self.closeOverlay(event);

                    var jsonJobIds = data['task'],
                    /*
                     * launches the Job Details overlay  
                     */
                    jobView = new JobDetailedView();
                    jobView.showDeviceUpdateJobDetailsScreen({
                      job : jsonJobIds,
                      activity : self.activity
                    });
                }
            });
            
            //Set the User preference of service selection
            Slipstream.SDK.Preferences.save(self.USER_PREF_SERVICE_SELECTION_KEY, serviceTypes);
            Slipstream.SDK.Preferences.save(self.USER_PREF_ENABLE_POLICY_REMATCH_KEY, properties['checkbox_enable_policy_rematch']);
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

    return DeviceUpdateFormView;
});
