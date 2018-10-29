/**
* Logo model
* Model for upload logo functionality.
* 
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../ui-common/js/models/spaceModel.js'
], function(SpaceModel) {
    var LogoModel = SpaceModel.extend({
        defaults: {
            "definition-type": "CUSTOM"
        },
        urlRoot: '/api/juniper/seci/report-management/report-logo',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.juniper.seci.report-management+json;q="1";version="1"',
                contentType: "application/vnd.juniper.seci.report-management.report-logo+json;version=1;charset=UTF-8",
                jsonRoot: "report-logo",
                processData: false,
                cache: false,
                contentType: false
            });
            this.set('fileName', this.attributes.fileName);
        },
        parse: function (data) {
            if (_.isObject(data.results)) {
                return data.results;
            } else {
                return data;
            }
        }
    });

    return LogoModel;
});