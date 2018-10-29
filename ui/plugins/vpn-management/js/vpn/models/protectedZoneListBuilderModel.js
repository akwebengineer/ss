/**
 * Model for listBuilder operation
 * 
 * @module ProtectedZoneListBuilderModel
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var ProtectedZoneListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/vpn-management/vpn-ui/item-selector/',
        availableUrl: '/available-zones',
        selectedUrl: '/selected-zones',
        availableAccept: "application/vnd.juniper.sd.vpn-management.zone-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.vpn-management.zone-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.zone-names+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.zone-names+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-zone-names',
        selectedAllUrl: '/selected-zone-names',
        availableAllAccept: 'application/vnd.juniper.sd.vpn-management.zone-names+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.vpn-management.zone-names+json;version=1;q=0.01',
        selectUrl: '/select',
        deselectUrl: '/deselect',

        isGetSelectedItemsFromStoreAsync: false
    });

    return ProtectedZoneListBuilderModel;
});
