/**
 * A module that works with VM image uploading.
 *
 * @module VMImageActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/vmImageGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a VMImageActivity.
     */
    var VMImageActivity = function() {
	this.gridConf = GridConfiguration;
    }

    VMImageActivity.prototype = new GridActivity();

    return VMImageActivity;
});
