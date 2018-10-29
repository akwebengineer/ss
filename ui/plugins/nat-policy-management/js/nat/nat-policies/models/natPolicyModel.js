/**
 * A Backbone model representing nat-policy (/api/juniper/sd/policy-management/nat/policies).
 *
 * @module NatPolicyModel
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel, NatPolicyManagementConstants) {
    /**
     * NatPolicyModel definition.
     */
    var NatPolicyModel = SpaceModel.extend({

        urlRoot: NatPolicyManagementConstants.POLICY_URL,
        policyManagementConstants: NatPolicyManagementConstants
        
    });

    return NatPolicyModel;
});