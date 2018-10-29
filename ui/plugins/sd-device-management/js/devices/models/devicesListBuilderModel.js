/**
 * Model for listBuilder operation
 * @module DevicesListBuilderModel
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {
	var DevicesListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/device-management/item-selector/',
        availableUrl: '/available-devices',
        selectedUrl: '/selected-devices',
        availableAccept: "application/vnd.juniper.sd.device-management.devices+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.device-management.devices+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.device-management.item-selector.select-devices+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.device-management.item-selector.de-select-devices+json;version=1;charset=UTF-8",
        availableAllUrl: '/available-devices-ids',
        availableAllAccept: 'application/vnd.juniper.sd.device-management.devices-ids+json;version=1;q=0.01',
        selectedAllUrl: '/selected-devices-ids',
        selectAllAccept: 'application/vnd.juniper.sd.device-management.devices-ids+json;version=1;q=0.01'
    });

	return DevicesListBuilderModel;
});