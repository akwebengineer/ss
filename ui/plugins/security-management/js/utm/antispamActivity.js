/**
 * A module that works with Anti-Spam Profiles.
 *
 * @module UTMAntiSpamActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/antispamGridConfiguration.js',
    './models/antispamModel.js',
    './models/antispamCollection.js',
    './views/antispamView.js',
    './views/antispamDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, DetailView) {
    /**
     * Constructs a UTMAntiSpamActivity.
     */
    var ProfilesActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createAntiSpam"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyAntiSpam"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createAntiSpam"]
            },
            "delete": {
                rbacCapabilities: ["deleteAntiSpam"]
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused":{
                rbacCapabilities: ["deleteAntiSpam"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignAntiSpamProfileToDomainCap"]
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

    ProfilesActivity.prototype = Object.create(GridActivity.prototype);
    ProfilesActivity.prototype.constructor = ProfilesActivity;

    return ProfilesActivity;
});