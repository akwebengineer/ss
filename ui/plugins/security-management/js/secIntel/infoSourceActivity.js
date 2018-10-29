/**
 * A module that works with information source management.
 *
 * @module InfoSourceActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/infoSourceGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a InfoSourceActivity.
     */
    var InfoSourceActivity = function() {
        this.capabilities = {
                "delete": {}
        };
        this.gridConf = GridConfiguration;
    }

    InfoSourceActivity.prototype = new GridActivity();

    return InfoSourceActivity;
});
