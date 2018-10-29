define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(SpaceModel) {
    /** 
     * ExtranetDeviceModel defination.
     */
    var VPNProfileModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/vpn-management/vpn-profiles',

        /** 
         * Derrived class constructor method
         * Provide following while deriving a model from base model:
         * jsonRoot: for wrapping model's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         * contentType: content-type in request header in ReST call
         */
        initialize: function() {
            // inialize base object properly
            SpaceModel.prototype.initialize.call(this,{
                "jsonRoot": 'vpn-profile',
                "accept": 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;version=1',
                "contentType": 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return VPNProfileModel;
});