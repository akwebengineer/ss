/**
 * A view to manage firewall policy page
 *
 * @module PoliciesView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyGridView.js'
], function (BasePolicyGridView) {

    var FirewallPoliciesView = BasePolicyGridView.extend({
        getMimeType : function() {
            return 'vnd.juniper.net.firewall.policies';
        },
        getDeviceMimetype : function() {
            return 'vnd.juniper.net.firewall.policies.devices';
        },
        /**
         * Returns the SID for the policy
         * @returns {string} sid
         */
        getSID: function() {
            return 'juniper.net:fw-policy-management:firewall-policies-grid';
        }
    });

    return FirewallPoliciesView;
});

