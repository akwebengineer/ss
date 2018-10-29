/**
 * Model for address CSV import
 * 
 * @module AddressImportModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AddressImportModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/address-management/addresses/import-address-csv',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.import-csv-file+json;version=1;charset=UTF-8"
            });
        }
    });

    return AddressImportModel;
});