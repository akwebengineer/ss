/**
 * Created by svaibhav on 09/08/15.
 */

/**
 * A module that works with update of device.
 *
 * @module Publish
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([ './views/deviceUpdateView.js', '../sdBaseActivity.js' ],
         function(DeviceUpdateView, SDDeviceActivity) {
  /**
   * Constructs an Device Update Activity.
   */
  var DeviceUpdateActivity = function() {
    SDDeviceActivity.call(this);
    this.onStart = function() {
      var self = this;
       extras = this.intent.getExtras();
       model = extras.model;
       data =  extras.data;
        var view = new DeviceUpdateView({
          activity : self,
          selectedDevices :  data.sdDeviceIds,
          model : model,
          isUpdateAllSdDevices: (this.getIntent().data['mime_type'] === 'vnd.juniper.net.sd.device.updateAllSdChangedDevices')? true : false
        });

        this.buildOverlay(view, {size: 'medium'});
    };
  };
  DeviceUpdateActivity.prototype = new Slipstream.SDK.Activity();
  return DeviceUpdateActivity;
});
