/**
 * Model for listBuilder operation
 * 
 * @module AddressListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js',
    '../models/addressModel.js'
], function (BaseModel, Model) {
    var model = new Model(),
        onError = function() {
            console.log('Failed to fetch address');
        };

    var AddressListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/address-management/item-selector/',
        availableUrl: '/available-addresses',
        selectedUrl: '/selected-addresses',
        availableAccept: "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.address-management.item-selector.select-addresses+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.address-management.item-selector.de-select-addresses+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-address-ids',
        selectedAllUrl: '/selected-address-ids',
        availableAllAccept: 'application/vnd.juniper.sd.address-management.address-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.address-management.address-ids+json;version=1;q=0.01',

        fetchById: function(id, onFetch) {
            if (id) {
                model.set('id', id);
                model.fetch({
                    success: onFetch,
                    error: onError
                });
            }
        }
    });

    return AddressListBuilderModel;
});