/**
 * Collection for getting Application Signatures 
 * 
 * @module Application Signatures
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './appsigModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * AppsigCollection defination.
     */
    var AppSigCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/app-sig-management/app-sigs";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'app-sigs.app-sig',
                accept: 'application/vnd.juniper.sd.app-sig-management.app-sig-refs+json;q=0.01;version=1'
                        
            });     
            
        }
  });

  return AppSigCollection;
});