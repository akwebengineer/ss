/**
* Reports model
* Model for getting reports
* 
* @module ReportsModel
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var ReportsModel = SpaceModel.extend({
        urlRoot: '/api/juniper/seci/report-management/report-templates',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: "application/vnd.juniper.seci.report-management.report-template+json;version=1",                   
                contentType: "application/vnd.juniper.seci.report-management.report-template+json;version=1;charset=UTF-8",
                jsonRoot: "report-template"
            });
        }
    });

    return ReportsModel;
});