/**
 * Model for signature database upload
 * 
 * @module SignatureDatabaseUploadModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var SignatureDatabaseUploadModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/ips-management/offline-ips-sig-upload',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.ips-management.upload-idp-signature-request+json;version=1;charset=UTF-8"
            });
        }
    });

    return SignatureDatabaseUploadModel;
});