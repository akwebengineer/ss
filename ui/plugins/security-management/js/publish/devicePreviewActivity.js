/**
 * Created by svaibhav on 09/08/15.
 */

/**
 * A module that works with update of device.
 * 
 * @module Publish
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([ './views/devicePreviewConfigurationView.js', 
         '../sdBaseActivity.js', 
         '../publish/models/deviceUpdateModel.js',
         '../../../ui-common/js/common/intentActions.js',
         './models/sdDeviceModel.js', 
         './views/deviceConfigurationFormView.js',
         'widgets/overlay/overlayWidget',
         'widgets/progressBar/progressBarWidget' ], 
    function(DevicePreviewView, SDDeviceActivity, Model, IntentActions, DeviceModel, DeviceConfigView, OverlayWidget, ProgressBarWidget) {
  /**
   * Constructs an Device Update Activity.
   */
  var DevicePreviewActivity = function() {
    SDDeviceActivity.call(this);
    this.model = Model;

    this.onStart = function() {
            console.log("Started Preview Activity");
            switch(this.getIntent().action) {
                case "slipstream.intent.action.ACTION_PREVIEW":
                    this.onPreviewConfigIntent();
                    break;

                case IntentActions.ACTION_VIEW_DEVICECHANGE:
                    this.onViewDeviceChangeIntent();
                    break;
            }
    };


    this.onPreviewConfigIntent = function() {
      var self = this;
       extras = this.intent.getExtras();
       model = extras.model || new self.model();
       data = extras.data;
        var view = new DevicePreviewView({
          activity : self,
          selectedDevices : data.sdDeviceIds[0],
          model : model
        });

        this.buildOverlay(view, {size: 'medium'});
    };

    this.onViewDeviceChangeIntent = function() {
                var self = this, deviceId = null,deviceName = null, extras, model,data;
                 extras = this.intent.getExtras();
                 model = extras.model || new self.model();
                 data = extras.data;
                self.deviceModel = new DeviceModel();
                self.deviceModel.set('id', data.sdDeviceIds[0]);
                self.deviceModel.fetch({
                success: function (collection, response, options) {

             // bulding the required Json format for View Device Change
                deviceId = data.sdDeviceIds[0];
                deviceName = self.deviceModel.attributes.device? self.deviceModel.attributes.device.name :"Device";
                 if(deviceId!==null){
                  $.ajax({
                      url: '/api/juniper/sd/device-management/view-device-change/'+deviceId,
                      type: 'GET',
                      headers:{
                          'accept': "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01"
                         },
                      success: function(data, status){
                          //self.closeOverlay(event);

                          var jsonJobIds = data.task, jobId;

                          // TODO: remove this once multi preview is completed
                          if(Object.prototype.toString.call( jsonJobIds ) === '[object Array]'){
                              jobId = jsonJobIds[0].id;
                          } else {
                              jobId = jsonJobIds.id;
                          }
                          /*
                           * launches the Job Details overlay
                           */
                          if(jobId){
                              self.overlay = new OverlayWidget({
                                  view: new DeviceConfigView({activity: self, jobId: jobId, title: 'View configuration for '+deviceName}),
                                  type: "medium",
                                  showScrollbar: true
                              });
                              self.overlay.build();
                              // build the progressBar widget, by setting the overlay container to the progressBar container.
                              self.progressBar = new ProgressBarWidget({
                                   "container": self.overlay.getOverlayContainer(), // as per new progressbar changes get the overlay container and assign to the progressbar
                                   "hasPercentRate": false,
                                   "inOverlay" : true,
                                   "statusText": self.context.getMessage('device_view_configuration_progress_message')
                              }).build();
                                }
                            }
                        });
                     }
                        
                    },
                    error: function (collection, response, options) {
                        console.log('device details not fetched');
                    }
                });

                   

        };

  };
  DevicePreviewActivity.prototype = new Slipstream.SDK.Activity();
  return DevicePreviewActivity;
});
