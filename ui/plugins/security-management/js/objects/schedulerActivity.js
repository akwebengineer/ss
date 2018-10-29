/**
 * A module that works with schedulers.
 *
 * @module SchedulerActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/schedulerGridConfiguration.js',
    './models/schedulerModel.js',
    './models/schedulerCollection.js',
    'widgets/overlay/overlayWidget',
    './views/schedulersView.js',
    './views/schedulerDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, OverlayWidget, View, DetailView) {
    /**
     * Constructs a SchedulerActivity.
     */
    var SchedulerActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["sdCreateScheduler"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["sdModifyScheduler"]
            },
            "delete": {
                rbacCapabilities: ["sdDeleteScheduler"]
            },
            "findUsage": {},
            "showUnused": {},
            "clone": {
                view: View,
                rbacCapabilities: ["sdCreateScheduler"]
            },
            "assignToDomain": {
                rbacCapabilities: ["sdAssignSchedulerDomainCap"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
    };

    SchedulerActivity.prototype = Object.create(GridActivity.prototype);
    SchedulerActivity.prototype.constructor = SchedulerActivity;

    return SchedulerActivity;
});
