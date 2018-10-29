/**
 * A module that works with UTM web filters.
 *
 * @module WebFilteringActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/webFilteringGridConfiguration.js',
    './models/webFilteringModel.js',
    './models/webFilteringCollection.js',
    './views/webFilteringWizardView.js',
    './views/webFilteringModifyView.js',
    './views/webFilteringDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, ModifyView, DetailView) {
    /**
     * Constructs a WebFilteringActivity.
     */
    var WebFilteringActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
               "create": {
                   view: View,
                   rbacCapabilities: ["createWebFiltering"]
               },
               "edit": {
                   view: ModifyView,
                   rbacCapabilities: ["modifyWebFiltering"]
               },
               "clone": {
                   view: ModifyView,
                   rbacCapabilities: ["createWebFiltering"]
               },
               "delete": {
                   rbacCapabilities: ["deleteWebFiltering"]
               },
               "showUnused": {},
               "findUsage": {},
               "deleteUnused": {
                   rbacCapabilities: ["deleteWebFiltering"]
               },
               "assignToDomain": {
                   rbacCapabilities: ["AssignWebFilteringProfileToDomainCap"]
               },
               "showDetailView": {
                   view: DetailView
               },
               "clearAllSelections": {}
            };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); // Use collection to augment grid conf
    };

    WebFilteringActivity.prototype = Object.create(GridActivity.prototype);
    WebFilteringActivity.prototype.constructor = WebFilteringActivity;

    return WebFilteringActivity;
});
