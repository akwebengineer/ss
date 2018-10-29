/**
 * Collection for getting policies
 *
 * @module FirewallPolicyCollection
 * @author Mammata<mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
   '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyCollection.js',
    './firewallPolicyModel.js',
    '../constants/fwPolicyManagementConstants.js'
], function(Backbone, BaseCollection, Model, FirewallPolicyManagementConstants) {
    /**
     * FWPolicyCollection definition.
     */
    var FWPolicyCollection = BaseCollection.extend({
        model: Model,
        policyManagementConstants : FirewallPolicyManagementConstants
    });
  return FWPolicyCollection;
});
