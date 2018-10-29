/** 
 * A Backbone model representing a extranet-device (/api/juniper/sd/vpn-management/extranet-devices/<id>).
 *
 * @module ExtranetDeviceModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /** 
     * ExtranetDeviceModel defination.
     */
    var ExtranetDeviceModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/extranet-devices',

        /** 
         * Derrived class constructor method
         * Provide following while deriving a model from base model:
         * jsonRoot: for wrapping model's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         * contentType: content-type in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'extranet-device',
                accept: 'application/vnd.juniper.sd.vpn-management.extranet-device+json;version=1',
                contentType: 'application/vnd.juniper.sd.vpn-management.extranet-device+json;version=1;charset=UTF-8'
            });
        }
    });

    return ExtranetDeviceModel;
});