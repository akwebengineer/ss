/**
 * Model for saving download configuration
 * 
 * @module SignatureDatabaseSaveDownloadConfigModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js',
    '../common/utils/TimeKeeper.js'
], function (SpaceModel, TimeKeeper) {

    var SignatureDatabaseSaveDownloadConfigModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/ips-management/save-download-config',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "x-date": TimeKeeper.getXDate(),
                "accept": "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.ips-management.save-idp-download-para-request+json;version=1;charset=UTF-8"
            });
        }
    });

    return SignatureDatabaseSaveDownloadConfigModel;
});
