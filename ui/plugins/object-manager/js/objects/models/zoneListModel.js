/**
 * Model for all the zones available in all the devices in SD
 * 
 * @module ZoneListModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var ZoneListModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/zoneset-management/zone-sets/zones',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.zoneset-management.zones+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.zoneset-management.zones+json;version=1;charset=UTF-8",
                "jsonRoot": "zone-list"
            });
        }
    });

    return ZoneListModel;
});