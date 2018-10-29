/**
 * Model for listBuilder operation
 * 
 * @module ServiceListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js',
    '../models/serviceModel.js'
], function (BaseModel, Model) {
    var model = new Model(),
        onError = function() {
            console.log('Failed to fetch service');
        };

    var ServiceListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/service-management/item-selector/',
        availableUrl: '/available-services',
        selectedUrl: '/selected-services',
        availableAccept: "application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.service-management.item-selector.select-services+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.service-management.item-selector.de-select-services+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-services-ids',
        selectedAllUrl: '/selected-services-ids',
        availableAllAccept: 'application/vnd.juniper.sd.service-management.services-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.service-management.services-ids+json;version=1;q=0.01',

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

    return ServiceListBuilderModel;
});