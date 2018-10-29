/**
 * A module that creates VM templates for virtual devices
 *
 * @module virtualDeviceTemplatesActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/virtualDeviceTemplatesGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a VirtualDeviceTemplatesActivity.
     */
    var VirtualDeviceTemplatesActivity = function() {
	this.gridConf = GridConfiguration;
    }

    VirtualDeviceTemplatesActivity.prototype = new GridActivity();

    return VirtualDeviceTemplatesActivity;
});
