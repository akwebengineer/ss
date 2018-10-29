/**
 * A module that works with UTM policies.
 *
 * @module UTMPolicyActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/policyGridConfiguration.js',
    './models/policyModel.js',
    './models/policyCollection.js',
    './views/policyWizardView.js',
    './views/policyModifyView.js',
    './views/policyDetailView.js'
], function(GridActivity, GridConfiguration,Model, Collection, CreateView, ModifyView, DetailView) {
    /**
     * Constructs a UTMPolicyActivity.
     */
    var PolicyActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: CreateView,
                rbacCapabilities: ["createUTM"]
            },
            "delete": {
                rbacCapabilities: ["deleteUTM"]
            },
            "edit": {
                view: ModifyView,
                rbacCapabilities: ["modifyUTM"]
            },
            "clone": {
                view: ModifyView,
                rbacCapabilities: ["createUTM"]
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused":{
                rbacCapabilities: ["deleteUTM"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignUTMPolicyToDomainCap"]
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

    PolicyActivity.prototype = Object.create(GridActivity.prototype);
    PolicyActivity.prototype.constructor = PolicyActivity;

    return PolicyActivity;
});
