/**
 * A Backbone model representing firewall-policy (/api/juniper/sd/fwpolicy-management/firewall-policies/).
 *
 * @module FirewallPolicyModel
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyModel.js',
    '../constants/fwPolicyManagementConstants.js'
], function (SpaceModel, FirewallPolicyManagementConstants) {
    /**
     * FirewallPolicyModel definition.
     */
    var FirewallPolicyModel = SpaceModel.extend({

        urlRoot: FirewallPolicyManagementConstants.POLICY_URL,
        policyManagementConstants: FirewallPolicyManagementConstants

    });

    return FirewallPolicyModel;
});
