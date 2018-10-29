
/**
 * Model for device 
 *
 * @module Devices  Model
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([ '../../../../ui-common/js/models/spaceModel.js' ], function(SpaceModel) {

  var DevicesModel = SpaceModel.extend({
    urlRoot : '/api/juniper/sd/device-management/devices/',
    idAttribute : "id",
    initialize : function() {
      SpaceModel.prototype.initialize.call(this, {
        "accept" : "application/vnd.juniper.sd.device-management.device+json;version=1;q=0.01"
      });
    }

  });

  return DevicesModel;
});