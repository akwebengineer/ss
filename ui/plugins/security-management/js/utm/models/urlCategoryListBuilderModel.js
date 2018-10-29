/**
 * Model for listBuilder operation
 * 
 * @module UrlCategoryListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var UrlCategoryListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/utm-management/url-category-lists/item-selector/',
        availableUrl: '/available-url-category-list',
        selectedUrl: '/selected-url-category-list',
        availableAccept: "application/vnd.juniper.sd.utm-management.url-category-list-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.utm-management.url-category-list-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.utm-management.item-selector.select-url-category-list+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.utm-management.item-selector.de-select-url-category-list+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-url-category-ids',
        selectedAllUrl: '/selected-url-category-ids',
        availableAllAccept: 'application/vnd.juniper.sd.utm-management.url-category-list-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.utm-management.url-category-list-ids+json;version=1;q=0.01'

    });

    return UrlCategoryListBuilderModel;
});