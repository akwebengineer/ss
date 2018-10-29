/**
 * A view to manage ips policy page
 *
 * @module IpsPoliciesView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyGridView.js'
], function (BasePolicyGridView) {

    var IpsPoliciesView = BasePolicyGridView.extend({
        getMimeType : function() {
            return 'vnd.juniper.net.ips.policies';
        },
        getDeviceMimetype : function() {
            return 'vnd.juniper.net.ips.policies.devices';
        },

        /**
         * Returns the SID for the policy
         * @returns {string} sid
         */
        getSID: function() {
            return 'juniper.net:ips-policy-management:ips-policy-grid';
        }
    });

    return IpsPoliciesView;
});