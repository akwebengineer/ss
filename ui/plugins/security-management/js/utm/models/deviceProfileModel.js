
/**
 * A Backbone model representing utm device profile (/api/juniper/sd/utm-management/anti-spam-profiles/).
 *
 * @module DeviceProfile
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * DeviceProfile definition.
    */
    var DeviceProfile = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/utm-device-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'utm-device-profile',
                accept: 'application/vnd.juniper.sd.utm-management.utm-device-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.utm-device-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return DeviceProfile;
});