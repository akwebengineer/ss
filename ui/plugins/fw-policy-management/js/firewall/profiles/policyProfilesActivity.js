/**
 * Module that implements the PolicyProfilesActivity
 *
 * @module PolicyProfilesActivity
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/policyProfilesGridConf.js',
    './views/policyProfileView.js', 
    './models/policyProfileCollection.js',
    './models/policyProfileModel.js',
    './views/policyProfileDetailedView.js'
], function(
    GridActivity, PolicyProfileGridConfiguration, PolicyProfileView, PolicyProfileCollection,
    PolicyProfileModel,PolicyProfileDetailedView) {
    /**
     * Construct a PolicyProfilesActivity
     */
    var PolicyProfilesActivity = function() {
        this.capabilities = {
            "create": {
                view: PolicyProfileView,
                rbacCapabilities: ["policyProfileCreation"]
            },
            "edit": {
                view: PolicyProfileView,
                rbacCapabilities: ["ModifyPolicyProfile"]
            },
            "clone": {
                view: PolicyProfileView,
                rbacCapabilities: ["policyProfileCreation"]
            },
            "delete": {
                rbacCapabilities: ["DeletePolicyProfile"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignPolicyProfileToDomainCap"]
            },
            "showDetailView": {
                view: PolicyProfileDetailedView      
            }
        };

        this.gridConf = PolicyProfileGridConfiguration;
        this.model = PolicyProfileModel;
        this.collection = new PolicyProfileCollection();
    }

    PolicyProfilesActivity.prototype = new GridActivity();

    return PolicyProfilesActivity;
});