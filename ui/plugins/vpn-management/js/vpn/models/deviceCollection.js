/** 
 * A Backbone collection representing all devices (/api/juniper/sd/device-management/devices/).
 *
 * @module DeviceCollection
 * @author Stanley <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './deviceModel.js'
], function (
    SpaceCollection,
    DeviceModel
) {
    /** 
     * DeviceCollection definition.
     */
    var DeviceCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/device-management/devices',
        model: DeviceModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'devices.device',
                accept: 'application/vnd.juniper.sd.device-management.devices+json;q=0.01;version=1'
            });
        }
    });

    return DeviceCollection;
});
