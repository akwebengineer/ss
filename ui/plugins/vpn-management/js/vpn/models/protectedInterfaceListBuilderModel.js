/**
 * Model for listBuilder operation
 * 
 * @module ProtectedInterfaceListBuilderModel
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var ProtectedInterfaceListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/vpn-management/vpn-ui/item-selector/',
        availableUrl: '/available-interfaces',
        selectedUrl: '/selected-interfaces',
        availableAccept: "application/vnd.juniper.sd.vpn-management.interface-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.vpn-management.interface-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.interface-names+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.interface-names+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-interface-names',
        selectedAllUrl: '/selected-interface-names',
        availableAllAccept: 'application/vnd.juniper.sd.vpn-management.interface-names+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.vpn-management.interface-names+json;version=1;q=0.01',
        selectUrl: '/select',
        deselectUrl: '/deselect',

        isGetSelectedItemsFromStoreAsync: false
    });

    return ProtectedInterfaceListBuilderModel;
});
