/**
 * A Backbone model representing policy-profile collection (/api/juniper/sd/fwpolicy-management/policy-profiles/).
 *
 * @module PolicyProfileCollection
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    './policyProfileModel.js',
    '../../rules/constants/fwRuleGridConstants.js'
], function (
    SpaceCollection,
    PolicyProfileModel,
    FWRuleGridConstants
) {
    /** 
     * PolicyProfileCollection definition.
     */
    var PolicyProfileCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = FWRuleGridConstants.POLICY_PROFILES;

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },        
        model: PolicyProfileModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'policy-profiles.policy-profile',
                accept: 'application/vnd.juniper.sd.fwpolicy-management.policy-profiles+json;q=0.01;version=1'
            });
        }
    });

    return PolicyProfileCollection;
});
