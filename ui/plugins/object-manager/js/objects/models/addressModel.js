/**
 * Model for getting addresses
 * 
 * @module AddressModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AddressModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/address-management/addresses',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.address-management.address+json;version=1",
                "contentType": "application/vnd.juniper.sd.address-management.address+json;version=1;charset=UTF-8",
                "jsonRoot": "address"
            });
        }
    });

    return AddressModel;
});