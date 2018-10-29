/**
 * Collection for getting addresses 
 * 
 * @module NATPolicyCollection
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyCollection.js',
    './natPolicyModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function(Backbone, BaseCollection, Model,NATPolicyManagementConstants) {
    /**
     * NATPolicyCollection definition.
     */
    var NATPolicyCollection = BaseCollection.extend({
        model: Model,
        policyManagementConstants : NATPolicyManagementConstants
    });

  return NATPolicyCollection;
});
