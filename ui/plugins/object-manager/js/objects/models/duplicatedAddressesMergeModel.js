/**
 * Model for merging duplicated address groups
 * 
 * @module DuplicatedAddressesMergeModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DuplicatedAddressesMergeModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/address-management/addresses/merge',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.juniper.sd.address-management.addresses.merges+json;version=2;q=0.02',
                contentType: 'application/vnd.juniper.sd.address-management.addresses.merge-request+json;version=2;charset=UTF-8'
            });
        }
    });

    return DuplicatedAddressesMergeModel;
});