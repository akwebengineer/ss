/**
 * Model for address replace
 * 
 * @module AddressReplaceModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AddressReplaceModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/address-management/addresses/replace',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.address-management.addresses.replaces+json;version=2;q=0.02",
                "contentType": "application/vnd.juniper.sd.address-management.addresses.replace-request+json;version=2;charset=UTF-8"
            });
        }
    });

    return AddressReplaceModel;
});