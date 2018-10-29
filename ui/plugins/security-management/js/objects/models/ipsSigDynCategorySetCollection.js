/**
 * created by dkumara on 7/29/15
 * Collection for getting IPS Signatures Category
 * 
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js'
], function(Backbone, SpaceCollection) {
    /**
     * IPSSigCategoryCollection defination.
     */
    var IPSSigCategoryCollection = SpaceCollection.extend({
        url: function(filter) {
            return "/api/juniper/sd/ips-signature-management/ips-signature-categories";
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ips-sig-categories.ips-sig-category',
                accept: 'application/vnd.juniper.sd.ips-signature-management.ips-sig-categories+json;q=0.01;version=1'
            });     
        }
  });

  return IPSSigCategoryCollection;
});