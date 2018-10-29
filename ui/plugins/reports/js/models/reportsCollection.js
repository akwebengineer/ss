/**
 * A Backbone collection representing Reports (/api/juniper/seci/report-management/report-templates)
 *
 * @module Reports
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(['../../../ui-common/js/models/spaceCollection.js',  './reportsModel.js'
       ], function (SpaceCollection, ReportsModel) {
    /**
     *  ReportsCollection definition.
     */
    var ReportsCollection = SpaceCollection.extend({
        url: '/api/juniper/seci/report-management/report-templates',
        model: ReportsModel,
        url: function() {
            var baseUrl = "/api/juniper/seci/report-management/report-templates";
            return baseUrl;
        },
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: "report-templates.report-template",
                accept: "application/vnd.juniper.seci.report-management.report-templates+json;version=1"
            });
        }
    });

    return ReportsCollection;
});
