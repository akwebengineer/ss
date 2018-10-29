/**
 * Model for listBuilder operation
 * @module DevicesListBuilderModel
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../../sd-common/js/devices/models/devicesListBuilderModel.js'
], function (DevicesListBuilderModel) {
    var UseFWDeviceListBuilderModel = DevicesListBuilderModel.extend({
        baseUrl: '/api/juniper/sd/active-directory-management/devices/item-selector/'
    });

    return UseFWDeviceListBuilderModel;
});