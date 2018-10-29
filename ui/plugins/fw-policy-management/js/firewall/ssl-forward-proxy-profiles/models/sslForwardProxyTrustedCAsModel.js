/**
 * Model for getting SslForwardProxyTrustedCAs
 * 
 * @module SslForwardProxyTrustedCAsModel
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../constants/sslFpConstants.js'
], function (SpaceModel, SslFpConstants) {

    var SslForwardProxyTrustedCAsModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
         urlRoot: '/api/juniper/sd/device-management/{deviceID}/trusted-cas',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": SslFpConstants.TRUSTED_CAS_ACCEPT_HEADER
            });
        }
    });

    return SslForwardProxyTrustedCAsModel;
});
