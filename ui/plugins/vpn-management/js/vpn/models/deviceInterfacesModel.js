/** 
 * A Backbone model representing selected devices interfaces (/api/juniper/sd/device-management/device-interfaces).
 *
 * @module DeviceInterfacesModel
 * @author Stanley <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015


Example: body

Body:


{
"device-interface-request":{
"id":[
"131080",
"131083"
],
"excludeTunnelInterface":"true"
}
}




 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (
    SpaceModel
) {
    /** 
     * DeviceModel definition.
     */
    var DeviceInterfacesModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/device-management/device-interfaces',

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
                jsonRoot: 'device-interfaces-response',
                contentType: 'application/vnd.juniper.sd.device-management.id-list+json;version=1;charset=UTF-8',
                accept: 'application/vnd.juniper.sd.device-management.device-interfaces-response+json;q="0.01";version="1"'
            });
        }
    });

    return DeviceInterfacesModel;
});
