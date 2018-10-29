/**
 * A view to manage nat policy page
 *
 * @module NatPoliciesView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyGridView.js'
], function (BasePolicyGridView) {

    var NatPoliciesView = BasePolicyGridView.extend({
        getMimeType : function() {
            return 'vnd.juniper.net.nat.policies';
        },
        getDeviceMimetype : function() {
            return 'vnd.juniper.net.nat.policies.devices';
        },

        /**
         * Returns the SID for the policy
         * @returns {string} sid
         */
        getSID: function() {
            return 'juniper.net:nat-policy-management:nat-policy-grid';
        }
    });

    return NatPoliciesView;
});
