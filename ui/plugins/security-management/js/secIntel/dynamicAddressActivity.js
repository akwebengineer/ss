/**
 * A module that works with dynamic address groups.
 *
 * @module dynamicAddressActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/dynamicAddressGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a DynamicAddressActivity.
     */
    var DynamicAddressActivity = function() {
        this.capabilities = {
                "delete": {}
        };
        this.gridConf = GridConfiguration;
    }

    DynamicAddressActivity.prototype = new GridActivity();

    return DynamicAddressActivity;
});
