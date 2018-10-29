/**
 * A module that works with UTM url category.
 *
 * @module UrlCategoryActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/urlCategoryGridConfiguration.js',
    './models/urlCategoryModel.js',
    './models/urlCategoryCollection.js',
    './views/urlCategoryView.js',
    './views/urlCategorySelectionView.js',
    './views/urlCategoryDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, SelectionView, DetailView) {
    /**
     * Constructs a UrlCategoryActivity.
     */
    var UrlCategoryActivity = function() {
        GridActivity.call(this);


    this.getNotificationUrl = function() {
        return ["/api/juniper/sd/utm-management/url-category-lists"]; 
    };

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createURLCategory"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyURLCategory"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createURLCategory"]
            },
            "select": {
                view: SelectionView
            },
            "delete": {
                rbacCapabilities: ["deleteURLCategory"]
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused": {
                rbacCapabilities: ["deleteURLCategory"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignUrlCategoryListToDomainCap"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
    };

    UrlCategoryActivity.prototype = Object.create(GridActivity.prototype);
    UrlCategoryActivity.prototype.constructor = UrlCategoryActivity;
    return UrlCategoryActivity;
});
