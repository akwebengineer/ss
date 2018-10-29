
/**
 * A Backbone model for probing device (/api/juniper/sd/ips-management/probe-idp-device/{full-probe}).
 *
 * @module DeviceProbeModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * DeviceProbeModel definition.
    */
    var DeviceProbeModel = SpaceModel.extend({
        url: function() {
            var baseUrl = "/api/juniper/sd/ips-management/probe-idp-device/";

            if (this.isFullProbe) {
                baseUrl += "true";
            }else{
                baseUrl += "false";
            }
            return baseUrl;
        },
        initialize: function(options) {
            this.isFullProbe = options.isFullProbe;
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01'
            });
        }
    });

    return DeviceProbeModel;
});
