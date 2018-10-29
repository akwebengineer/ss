/**
 * A module that works with device profile.
 *
 * @module DeviceActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/deviceGridConfiguration.js',
    './models/deviceProfileModel.js',
    './models/deviceProfileCollection.js',
    './views/deviceProfileView.js',
    './views/deviceProfileDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, DetailView) {
    /**
     * Constructs a DeviceActivity.
     */
    var DeviceActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createUTMDeviceProfile"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyUTMDeviceProfile"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createUTMDeviceProfile"]
            },
            "delete": {
                rbacCapabilities: ["deleteUTMDeviceProfile"]
            },
            "showUnused": {},
            "deleteUnused":{
                rbacCapabilities: ["deleteUTMDeviceProfile"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignUTMDeviceProfileToDomainCap"]
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

    DeviceActivity.prototype = Object.create(GridActivity.prototype);
    DeviceActivity.prototype.constructor = DeviceActivity;

    return DeviceActivity;
});
