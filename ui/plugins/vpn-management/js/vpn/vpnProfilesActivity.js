define([
    '../../../ui-common/js/gridActivity.js',
    './conf/vpnProfilesGridConf.js',
    './views/vpnProfilesView.js',
    './views/vpnProfileView.js',
    './models/vpnProfileCollection.js',
    './models/vpnProfileModel.js',
], function(
    GridActivity, VPNProfileGridConfiguration,  VPNProfilesView, VPNProfileView, VPNProfileCollection, VPNProfileModel) {
    /**
     * Construct a VPNProfilesctivity
     */
    var VPNProfilesActivity = function() {
        this.capabilities = {
            "create": {
                view: VPNProfileView,
                rbacCapabilities: ["VPNProfile.create"]
            },
            "edit": {
                view: VPNProfileView,
                 rbacCapabilities: ["VPNProfile.update"]
            },
	        "showDetailView": {
                view: VPNProfileView,
                rbacCapabilities: ["VPNProfile.read"]
            },
            "clone": {
                view: VPNProfileView,
                rbacCapabilities: ["VPNProfile.create"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignVPNProfileToDomainCap"]
            },
            "findUsage": {
                rbacCapabilities: ["VPNProfile.read"]
            },
            "delete": {
                rbacCapabilities: ["VPNProfile.delete"]
            }
        };

        this.gridConf = VPNProfileGridConfiguration;
        this.model = VPNProfileModel;
        this.collection = new VPNProfileCollection();
        this.onDestroy = function() {
            console.log('VpnProfilesActivity destroyed');
        }
    }

    VPNProfilesActivity.prototype = new GridActivity();
    // SDK.Activity.prototype = Object.create(VPNProfilesActivity.prototype);
    // SDK.Activity.prototype.constructor = SDK.Activity;
    return VPNProfilesActivity;
});

