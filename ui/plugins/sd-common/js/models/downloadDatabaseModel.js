
/**
 * A Backbone model for downloading signature database (/api/juniper/sd/ips-management/active-db).
 *
 * @module DownloadDatabaseModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * DownloadDatabaseModel definition.
    */
    var DownloadDatabaseModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/ips-management/download-idp-signature',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01',
                contentType: "application/vnd.juniper.sd.ips-management.download-idp-signature-request+json;version=1;charset=UTF-8"
            });
        }
    });

    return DownloadDatabaseModel;
});
