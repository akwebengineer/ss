/**
 * Model for getting sslForwardProxyProfiles
 * 
 * @module SslForwardProxyProfileModel
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../constants/sslFpConstants.js'
], function (SpaceModel, SslFpConstants) {

    var SslForwardProxyProfileModel = SpaceModel.extend({
        urlRoot: SslFpConstants.SSL_FP_FETCH_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": SslFpConstants.PROFILE_FETCH_ACCEPT_HEADER,
                "contentType": SslFpConstants.PROFILE_FETCH_CONTENT_TYPE_HEADER,
                "jsonRoot": "ssl-forward-proxy-profile"
            });
        }
    });

    return SslForwardProxyProfileModel;
});
