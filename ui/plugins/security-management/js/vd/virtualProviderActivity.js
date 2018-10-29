/**
 * A module that works with virtual providers.
 *
 * @module VirtualProviderActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/virtualProviderGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a VirtualProviderActivity.
     */
    var VirtualProviderActivity = function() {
	this.gridConf = GridConfiguration;
    }

    VirtualProviderActivity.prototype = new GridActivity();

    return VirtualProviderActivity;
});
