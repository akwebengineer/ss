/**
 * Model for listBuilder operation
 * 
 * @module UrlPatternListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var UrlPatternListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/utm-management/url-patterns/item-selector/',
        availableUrl: '/available-url-patterns',
        selectedUrl: '/selected-url-patterns',
        availableAccept: "application/vnd.juniper.sd.utm-management.url-patterns-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.utm-management.url-patterns-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.utm-management.item-selector.select-url-patternst+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.utm-management.item-selector.de-select-url-patterns+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-url-pattern-ids',
        selectedAllUrl: '/selected-url-pattern-ids',
        availableAllAccept: 'application/vnd.juniper.sd.utm-management.url-patterns-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.utm-management.url-patterns-ids+json;version=1;q=0.01'

    });

    return UrlPatternListBuilderModel;
});