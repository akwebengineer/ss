/**
 * Model for canceling scheduled download job
 * 
 * @module SignatureDatabaseCancelScheduledDownloadJob
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var SignatureDatabaseCancelScheduledDownloadJob = SpaceModel.extend({
        urlRoot: '/api/space/job-management/cancel-jobs',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.net.juniper.space.job-management.jobs+json;version=3;q=0.03",
                "contentType": "application/vnd.net.juniper.space.job-management.cancel-jobs-request+json;version=3;charset=UTF-8"
            });
        }
    });

    return SignatureDatabaseCancelScheduledDownloadJob;
});
