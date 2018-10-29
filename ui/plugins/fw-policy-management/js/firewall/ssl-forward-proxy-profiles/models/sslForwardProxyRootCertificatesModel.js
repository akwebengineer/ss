/**
 * Model for getting SslForwardProxyRootCertificates
 * 
 * @module SslForwardProxyRootCertificatesModel
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../constants/sslFpConstants.js'
], function (SpaceModel, SslFpConstants) {

    var SslForwardProxyRootCertificatesModel = SpaceModel.extend({
        urlRoot: SslFpConstants.DEVICE_CERTIFICATES_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                'accept': SslFpConstants.DEVICE_CERTIFICATES_ACCEPT_HEADER,
                'contentType': SslFpConstants.DEVICE_CERTIFICATES_CONTENT_TYPE_HEADER
            });
        }
    });

    return SslForwardProxyRootCertificatesModel;
});
