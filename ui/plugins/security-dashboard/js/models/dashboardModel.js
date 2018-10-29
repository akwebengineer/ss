/**
 * A module that implements a BackboneJS model for SD dashboards
 *
 * @module DashboardModel
 * @author Kyle Huang <kyleh@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    './spaceModel.js'
], function (SpaceModel) {

    /**
     * DashboardModel definition
     * returns a singleton instance of the Dashboard Model, which is potentially used
     * concurrently by multiple views
     */
    var DashboardModel = (function () {
        var promise = null;
        var DashboardModelObject = SpaceModel.extend({
            urlRoot: '/api/juniper/ecm/dashboard-management/dashboards',
            idAttribute: 'moid',
            initialize: function () {
                SpaceModel.prototype.initialize.call(this, {
                    jsonRoot: 'dashboarddefinitions',
                    accept: 'application/vnd.juniper.seci.dashboard-management+json;version=1;',
                    contentType: 'application/vnd.juniper.seci.dashboard-management+json;q=0.01;version=1'
                });
            },
            fetch: function (response) {
                // promise helps sync multiple view instances trying to fetch
                // at the same time
                if (promise == null) {
                    promise = SpaceModel.prototype.fetch.apply(this, arguments);
                }
                return promise;
            },
            parse: function (response) {
                return SpaceModel.prototype.parse.apply(this, arguments);
            }
        });
        var instance;
        return {
            getInstance: function () {
                if (instance == null) {
                    instance = new DashboardModelObject();
                    instance.constructor = null;
                }
                return instance;
            }
        }
    })();

    return DashboardModel;

});
