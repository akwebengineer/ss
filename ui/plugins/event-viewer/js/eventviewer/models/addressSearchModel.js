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

    var AddressSearchModel = SpaceModel.extend({
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
                "jsonRoot": "addresses"
            });
        }
    });

    return AddressSearchModel;
});