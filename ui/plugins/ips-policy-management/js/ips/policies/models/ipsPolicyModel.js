/**
 * A Backbone model representing ips-policy (/api/juniper/sd/policy-management/ips/policies).
 *
 * @module IpsPolicyModel
 * @author vinamra jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/models/basePolicyModel.js',
    '../../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js'
], function (SpaceModel, IpsPolicyManagementConstants) {
    /**
     * IpsPolicyModel definition.
     */
    var IpsPolicyModel = SpaceModel.extend({

        urlRoot: IpsPolicyManagementConstants.POLICY_URL,
        policyManagementConstants: IpsPolicyManagementConstants

    });

    return IpsPolicyModel;
});