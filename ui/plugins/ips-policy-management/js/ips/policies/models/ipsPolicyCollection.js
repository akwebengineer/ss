/**
 * Collection for getting addresses 
 * 
 * @module IPSPolicyCollection
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyCollection.js',
    './ipsPolicyModel.js',
    '../../common/constants/ipsPolicyManagementConstants.js'
], function(Backbone, BaseCollection, Model,IPSPolicyManagementConstants) {
    /**
     * IPSPolicyCollection definition.
     */
    var IPSPolicyCollection = BaseCollection.extend({
        model: Model,
        policyManagementConstants : IPSPolicyManagementConstants
    });

  return IPSPolicyCollection;
});
