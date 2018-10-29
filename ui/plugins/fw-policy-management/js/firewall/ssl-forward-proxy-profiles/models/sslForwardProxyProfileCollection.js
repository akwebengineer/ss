/**
 * Collection for getting ssl-forward-proxy-profiles 
 * 
 * @module SslForwardProxyProfileCollection
 * @author nadeem@juniper.net
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './sslForwardProxyProfileModel.js',
    '../constants/sslFpConstants.js'
], function(Backbone, SpaceCollection, Model, SslFpConstants) {
    /**
     * SslForwardProxyProfileCollection definition.
     */
    var SslForwardProxyProfileCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = SslFpConstants.SSL_FP_FETCH_URL;

            if (Array.isArray(filter)) {
                // Multiple filters support
                var tmpUrl = baseUrl + "?filter=(";

                for (var i=0; i<filter.length; i++) {
                    tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                    if (i !== filter.length-1) {
                        tmpUrl += " and ";
                    }
                }
                tmpUrl += ")";

                return tmpUrl;
            } else if (filter) {
                // single filter
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: SslFpConstants.SSL_FP_JSON_ROOT,
                accept: SslFpConstants.SSL_FP_FETCH_ACCEPT_HEADER
            });
            
        }
  });

  return SslForwardProxyProfileCollection;
});
