/** 
 * A Backbone collection representing selected devices device-interfaces (/api/juniper/sd/device-management/device-interfaces).
 *
 * @module DeviceInterfacesCollection
 * @author Stanley <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './deviceInterfacesModel.js'
], function (
    SpaceCollection,
    DeviceModel
) {
    /** 
     * DeviceInterfacesCollection definition.
     */
    var DeviceInterfacesCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/device-management/device-interfaces',
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
                type: 'post',
                jsonRoot: 'interfaces.interface',
                accept: 'application/vnd.juniper.sd.device-management.device-interfaces-response+json;q="0.01";version="1"',
                contentType: 'application/vnd.juniper.sd.device-management.id-list+json;version=1;charset=UTF-8'
            });
        }
    });

    return DeviceInterfacesCollection;
});
