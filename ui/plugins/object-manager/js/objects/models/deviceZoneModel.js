/**
 * Model for getting common zones in specific devices in SD
 * 
 * @module DeviceZoneModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DeviceZoneModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/zoneset-management/device-zones',
        initialize: function (option) {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.device-management.zones+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.device-management.id-list+json;version=2;charset=UTF-8",
                "jsonRoot": "device-info-request"
            });
        }
    });

    return DeviceZoneModel;
});
