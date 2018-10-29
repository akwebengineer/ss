/**
 * created by vinamra
 * Collection for getting IPS Signatures Sets (Templates)
 * 
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    '../../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js'    
], function(Backbone, SpaceCollection, IPSPolicyManagementConstants) {
    /**
     * IPSTemplateCollection defination.
     */
    var IPSTemplateCollection = SpaceCollection.extend({
        url: function(filter) {
            return IPSPolicyManagementConstants.IPS_TEMPLATE_URL
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'ips-sig-sets.ips-sig-set',
                accept: IPSPolicyManagementConstants.IPS_TEMPLATE_ACCEPT_HEADER
            });     
        }
  });

  return IPSTemplateCollection;
});