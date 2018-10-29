/**
 * Model for creating reports
 *
 * @module CreateReports - EventViewer
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var ReportsModel = SpaceModel.extend({
        defaults: {
            "def-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/seci/report-management/report-templates',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": 'application/vnd.juniper.seci.report-management.report-template+json;q="0.01";version="1"',
               "contentType": 'application/vnd.juniper.seci.report-management.report-template+json;version=1;charset=UTF-8',
               "jsonRoot": "report-template"
            });
        }
    });

    return ReportsModel;
});
