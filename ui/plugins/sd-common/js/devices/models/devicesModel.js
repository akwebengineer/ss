/**
 * Model for getting devices
 *
 * @module Devices Model
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DevicesModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/device-management/devices',
        idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {

                "accept": "application/vnd.juniper.sd.device-management.devices+json;q=0.01;version=1",
                "contentType": "application/vnd.juniper.sd.device-management.devices+json;version=1;charset=UTF-8",
                "jsonRoot": "devices"
            });
        }

    });

    return DevicesModel;
});
