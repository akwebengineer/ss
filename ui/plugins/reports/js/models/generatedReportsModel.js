/**
* Generated Reports Model
* Model for getting Generated Reports
* 
* @module GeneratedReports
* @author Shini <shinig@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var GeneratedReportsModel = SpaceModel.extend({
        urlRoot: '/api/juniper/seci/report-management/generated-reports',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "contentType": "application/vnd.juniper.sd.bulk-delete+json;version=1;charset=UTF-8"
            });
        }
    });

    return GeneratedReportsModel;
});