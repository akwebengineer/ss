/**
 * A module that works with Security Intelligence profiles.
 *
 * @module secintelProfileActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/secintelProfileGridConfiguration.js',
    './models/secintelProfileModel.js',
], function(GridActivity, GridConfiguration,Model) {
    /**
     * Constructs a ProfileActivity.
     */
    var ProfileActivity = function() {
        this.capabilities = {
                "delete": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
    };

    ProfileActivity.prototype = new GridActivity();

    return ProfileActivity;
});
