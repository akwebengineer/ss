/**
 * A module that works with Security Intelligence Spotlight Secure Connectors
 *
 * @module secintelConnectorActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/secintelConnectorGridConfiguration.js'
], function(GridActivity, GridConfiguration) {
    /**
     * Constructs a ConnectorActivity.
     */
    var ConnectorActivity = function() {
        this.capabilities = {
                "delete": {}
        };
        this.gridConf = GridConfiguration;
    };

    ConnectorActivity.prototype = new GridActivity();

    return ConnectorActivity;
});
