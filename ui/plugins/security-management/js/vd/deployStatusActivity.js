/**
 * A module that works with deployment status.
 *
 * @module DeployStatusActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/deployStatusGridConfiguration.js',
    './views/deployStatusView.js',
], function(GridActivity, GridConfiguration, View) {
    /**
     * Constructs a DeployStatusActivity.
     */
    var DeployStatusActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            list: {
                view: View
            }
        };

        this.gridConf = GridConfiguration;
    }

    DeployStatusActivity.prototype = Object.create(GridActivity.prototype);
    DeployStatusActivity.prototype.constructor = DeployStatusActivity;

    return DeployStatusActivity;
});
