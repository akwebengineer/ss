/**
 * created by wasima on 7/17/15
 * Collection for getting IPS Signatures 
 * 
 * @module IPS Signatures
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './ipsSigModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * IPSsigCollection defination.
     */
    var IPSSigCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/ips-signature-management/ips-signatures";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ips-signatures.ips-signature',
                accept: 'application/vnd.juniper.sd.ips-signature-management.ips-signatures+json;version=1;q=0.01'
                        
            });     
            
        }
  });

  return IPSSigCollection;
});