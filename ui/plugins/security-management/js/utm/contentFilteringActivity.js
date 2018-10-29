/**
 * A module that works with UTM content filters.
 *
 * @module ContentFilteringActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/contentFilteringGridConfiguration.js',
    './models/contentFilteringModel.js',
    './models/contentFilteringCollection.js',
    './views/contentFilteringWizardView.js',
    './views/contentFilteringModifyView.js',
    './views/contentFilteringDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, CreateView, ModifyView, DetailView) {
    /**
     * Constructs a ContentFilteringActivity.
     */
    var ContentFilteringActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
               view: CreateView,
               rbacCapabilities: ["createContentFiltering"]
           },
           "edit": {
               view: ModifyView,
               rbacCapabilities: ["modifyContentFiltering"]
           },
           "clone": {
               view: ModifyView,
               rbacCapabilities: ["createContentFiltering"]
           },
           "delete": {
               rbacCapabilities: ["deleteContentFiltering"]
           },
           "showUnused": {},
           "findUsage": {},
           "deleteUnused":{
               rbacCapabilities: ["deleteContentFiltering"]
           },
           "assignToDomain": {
               rbacCapabilities: ["AssignContentFilteringProfileToDomainCap"]
           },
           "showDetailView": {
               view: DetailView
           },
           "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); // Use collection to augment grid conf
    }

    ContentFilteringActivity.prototype = Object.create(GridActivity.prototype);
    ContentFilteringActivity.prototype.constructor = ContentFilteringActivity;


    return ContentFilteringActivity;
});