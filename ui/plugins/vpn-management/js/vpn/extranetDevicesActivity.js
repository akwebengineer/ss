/**
 * A module that works with extranet Devices.
 *
 * @module ExtranetDevicesActivity
 * @author ramesha@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/extranetDevicesGridConf.js',
    './models/extranetDeviceModel.js',
    './models/extranetDevicesCollection.js',
    './views/extranetDeviceView.js'
], function(GridActivity,GridConfiguration,Model,Collection, View) {
    /**
     * Constructs a ExtranetDevicesActivity.
     */
    var ExtranetDevicesActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities:['createExtranetDeviceCap']
            },
            "edit": {
                view: View,
                rbacCapabilities:['modifyExtranetDeviceCap']
            },
            "delete": {
              rbacCapabilities:['deleteExtranetDeviceCap']
            }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
        this.bindEvents = function() {
        GridActivity.prototype.bindEvents.call(this);
        };
    }

    ExtranetDevicesActivity.prototype = Object.create(GridActivity.prototype);
    ExtranetDevicesActivity.prototype.constructor = ExtranetDevicesActivity;

    return ExtranetDevicesActivity;
});
