/**
 * Model for Devices
 * @module DeviceModel
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['./spaceModel.js'], function(SpaceModel){
	var DeviceModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/device-management/devices',
        idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": "application/vnd.juniper.sd.device-management.devices-extended+json;q=0.01;version=2",
               "jsonRoot": "devices.devices"
            });
        }
	});
	return DeviceModel;
});