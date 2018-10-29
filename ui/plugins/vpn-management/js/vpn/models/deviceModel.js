/** 
 * A Backbone model representing a device (/api/juniper/sd/device-management/devices/<device>).
 *
 * @module DeviceModel
 * @author Stanley <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (
    SpaceModel
) {
    /** 
     * DeviceModel definition.
     */
    var DeviceModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/device-management/devices',

        /** 
         * Derrived class constructor method
         * Provide following while deriving a model from base model:
         * jsonRoot: for wrapping model's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         * contentType: content-type in request header in ReST call
         */

        initialize: function () {
            // initialize base object properly
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'device',
                accept: 'application/vnd.juniper.sd.device-management.device+json;version=1',
                contentType: 'application/vnd.juniper.sd.device-management.device+json;version=1;charset=UTF-8'
            });
        }
    });

    return DeviceModel;
});
