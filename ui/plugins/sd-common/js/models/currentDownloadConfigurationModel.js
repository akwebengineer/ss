
/**
 * A Backbone model for getting current download configuration (/api/juniper/sd/ips-management/current-download-config).
 *
 * @module CurrentDownloadConfigurationMode
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * CurrentDownloadConfigurationModel definition.
    */
    var CurrentDownloadConfigurationModel = SpaceModel.extend({
        url: '/api/juniper/sd/ips-management/current-download-config',
        initialize: function(options) {
            jsonRoot: 'current-download-config',
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.sd.ips-management.idp-download-config-response+json;version=1;q=0.01'
            });
        }
    });

    return CurrentDownloadConfigurationModel;
});
