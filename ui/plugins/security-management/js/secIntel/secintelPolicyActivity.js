/**
 * A module that works with Security Intelligence policies.
 *
 * @module secintelPolicyActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/secintelPolicyGridConfiguration.js',
    './models/secIntelPolicyModel.js',
    './models/secIntelPolicyCollection.js',
    './views/secintelPolicyView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View) {
    /**
     * Constructs a PolicyActivity.
     */
    var PolicyActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View
            },
            "delete": {},
            "findUsage": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
    };

    PolicyActivity.prototype = Object.create(GridActivity.prototype);
    PolicyActivity.prototype.constructor = PolicyActivity;

    return PolicyActivity;
});
