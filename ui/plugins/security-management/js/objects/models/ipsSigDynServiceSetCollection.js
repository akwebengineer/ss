/**
 * created by wasima on 7/17/15
 * Collection for getting IPS Signatures 
 *
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js'
], function(Backbone, SpaceCollection) {
    /**
     * AppsigCollection defination.
     */
    var IpsSigDynServiceSetCollection = SpaceCollection.extend({
        //model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/ips-signature-management/ips-signature-services";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ips-sig-services.ips-sig-service',
                accept: 'application/vnd.juniper.sd.ips-signature-management.ips-sig-services+json;version=1;q=0.01'
            });
        }
  });

  return IpsSigDynServiceSetCollection;
});
