/**
 * Model for variable CSV import
 * 
 * @module VariableImportModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var VariableImportModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/variable-management/variable-definitions/import-variable-csv',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.import-csv-file+json;version=1;charset=UTF-8"
            });
        }
    });

    return VariableImportModel;
});