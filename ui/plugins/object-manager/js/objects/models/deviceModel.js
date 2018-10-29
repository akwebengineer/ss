/**
 * Model for getting or updating a specific device
 * 
 * @module DeviceModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DeviceModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/device-management/devices',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'device',
                accept: 'application/vnd.juniper.sd.device-management.device+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.device-management.device+json;version=1;charset=UTF-8'
            });
        }
    });

    return DeviceModel;
});