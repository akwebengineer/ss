/**
 * Model for DNS look-up
 * 
 * @module AddressDnsModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AddressDnsModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/address-management/addresses/dns-lookUp',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.address-management.address.dnsLookUp+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.address-management.address.dnsLookUp+json;version=1;charset=UTF-8",
                "jsonRoot": "resolve-dns"
            });
        }
    });

    return AddressDnsModel;
});