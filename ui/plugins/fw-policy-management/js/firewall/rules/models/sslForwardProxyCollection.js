/**
 * A Backbone model representing ssl-proxy collection (/api/juniper/sd/utm-management/utm-policies).
 *
 * @module SslForwardProxyCollection
 * @author skesarwani
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    './sslForwardProxyModel.js'
], function (
    SpaceCollection,
    SslForwardProxyModel
) {
    /** 
     * SslForwardProxyCollection definition.
     */
    var SslForwardProxyCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/ssl-forward-proxy-profile-management/ssl-forward-proxy-profiles',
        model: SslForwardProxyModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ssl-forward-proxy-profiles.ssl-forward-proxy-profile',
                accept: 'application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profiles+json;version=2;q=0.02'
            });
        }
    });

    return SslForwardProxyCollection;
});