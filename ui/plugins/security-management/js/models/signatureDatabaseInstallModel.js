/**
 * Model for installing signature database
 * 
 * @module SignatureDatabaseInstallModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js',
    '../../../sd-common/js/common/utils/TimeKeeper.js'
], function (SpaceModel, TimeKeeper) {

    var SignatureDatabaseInstallModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/ips-management/install-signature',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "x-date": TimeKeeper.getXDate(),
                "accept": "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.ips-management.install-signature-request+json;version=1;charset=UTF-8"
            });
        }
    });

    return SignatureDatabaseInstallModel;
});
