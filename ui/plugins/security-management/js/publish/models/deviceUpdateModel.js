/**
 * Model for device update
 *
 * @module Devices Update Model
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([ '../../../../ui-common/js/models/spaceModel.js' ], function(SpaceModel) {

  var DevicesUpdateModel = SpaceModel.extend({
    urlRoot : '/api/juniper/sd/device-management/global-update-options',
    idAttribute : "id",
    initialize : function() {
      SpaceModel.prototype.initialize.call(this, {

        "accept" : "application/vnd.juniper.sd.device-management.device-update-options+json;version=1;q=0.01",
        "jsonRoot" : "update-options"
      });
    }

  });

  return DevicesUpdateModel;
});