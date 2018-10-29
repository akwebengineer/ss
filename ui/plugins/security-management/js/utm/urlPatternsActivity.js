/**
 * A module that works with UTM url patterns.
 *
 * @module UrlPatternsActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/urlPatternsGridConfiguration.js',
    './models/urlPatternModel.js',
    './models/urlPatternsCollection.js',
    './views/urlPatternView.js',
    './views/urlPatternDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, DetailView) {
    /**
     * Constructs a UrlPatternsActivity.
     */
    
    var UrlPatternsActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createURLPattern"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyURLPattern"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createURLPattern"]
            },
            "delete": {
                rbacCapabilities: ["deleteURLPattern"]
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused": {
                rbacCapabilities: ["deleteURLPattern"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignUrlPatternToDomainCap"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); 
    }

    UrlPatternsActivity.prototype = Object.create(GridActivity.prototype);
    UrlPatternsActivity.prototype.constructor = UrlPatternsActivity;

    return UrlPatternsActivity;
});
