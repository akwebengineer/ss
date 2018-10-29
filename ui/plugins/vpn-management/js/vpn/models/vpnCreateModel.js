/** 
 * A Backbone model representing a vpn (/api/juniper/sd/vpn-management/vpn-create).
 * @module VpnCreateModel
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

/**
 * TBD THIS IS A FAKE URL until have time to see which actual api is called
 */
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /** 
     * VpnCreateModel defination.
     */
    var VpnCreateModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/',

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
                jsonRoot: 'vpn-create',
                accept: 'application/vnd.juniper.sd.vpn-management.vpn-create+json;version=1',
                contentType: 'application/vnd.juniper.sd.vpn-management.vpn-create+json;version=1;charset=UTF-8'
            });
        }
    });

    return VpnCreateModel;
});
