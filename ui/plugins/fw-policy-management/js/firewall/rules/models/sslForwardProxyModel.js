/**
 * A Backbone model representing ssl-forward-proxy 
 *
 * @module SslForwardProxyModel
 * @author skesarwani
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * SslForwardProxyModel definition.
     */
    var SslForwardProxyModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/ssl-forward-proxy-profile-management/ssl-forward-proxy-profiles',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'ssl-forward-proxy-profile',
                accept: 'application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profiles+json;version=2;q=0.02'
            });
        }
    });

    return SslForwardProxyModel;
});