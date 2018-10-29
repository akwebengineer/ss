/**
 * A module that works with anti-virus profile.
 *
 * @module AntivirusActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/antivirusGridConfiguration.js',
    './models/antiVirusModel.js',
    './models/antiVirusCollection.js',
    './views/antiVirusWizardView.js',
    './views/antiVirusModifyView.js',
    './views/antiVirusDetailView.js'
], function(GridActivity, GridConfiguration,Model, Collection, View, ModifyView, DetailView) {
    /**
     * Constructs a AntivirusActivity.
     */
    var AntivirusActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createAntiVirus"]
            },
            "edit": {
                view: ModifyView,
                rbacCapabilities: ["modifyAntiVirus"]
            },
            "clone": {
                view: ModifyView,
                rbacCapabilities: ["createAntiVirus"]
            },
            "delete": {
                rbacCapabilities: ["deleteAntiVirus"]
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused":{
                rbacCapabilities: ["deleteAntiVirus"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignAntiVirusProfileToDomainCap"]
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

    AntivirusActivity.prototype = Object.create(GridActivity.prototype);
    AntivirusActivity.prototype.constructor = AntivirusActivity;

    return AntivirusActivity;
});
