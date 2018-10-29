/**
 * Model for listBuilder operation
 * 
 * @module ZoneListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var ZoneListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/zoneset-management/zone-sets/zones/item-selector/',
        availableUrl: '/available-zones',
        selectedUrl: '/selected-zones',
        availableAccept: "application/vnd.juniper.sd.zoneset-management.zones+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.zoneset-management.zones+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.zoneset-management.item-selector.select-zones+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.zoneset-management.item-selector.de-select-zones+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-zone-ids',
        selectedAllUrl: '/selected-zone-ids',
        availableAllAccept: 'application/vnd.juniper.sd.zoneset-management.zone-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.zoneset-management.zone-ids+json;version=1;q=0.01'

    });

    return ZoneListBuilderModel;
});