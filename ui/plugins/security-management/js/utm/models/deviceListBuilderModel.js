/**
 * Model for listBuilder operation
 * 
 * @module DeviceListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var DeviceListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/utm-management/utm-device-profiles/devices/item-selector/',
        availableUrl: '/available-devices',
        selectedUrl: '/selected-devices',
        availableAccept: "application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.utm-management.utm-device-profiles.item-selector.select-devices+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.utm-management.utm-device-profiles.item-selector.de-select-devices+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-device-ids',
        selectedAllUrl: '/selected-device-ids',
        availableAllAccept: 'application/vnd.juniper.sd.utm-management.security-device-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.utm-management.security-device-ids+json;version=1;q=0.01',

        getAvailableUrl: function() {
            return this.urlRoot + this.availableUrl + "?profile-id=" + this.profileId;
        },

        getAvailableAllUrl: function() {
            return this.urlRoot + this.availableAllUrl + "?profile-id=" + this.profileId;
        },

        setProfileId: function(profileId) {
            this.profileId = profileId || "-1";
        }
    });

    return DeviceListBuilderModel;
});