/**
 * A Backbone model representing policy-profile (/api/juniper/sd/fwpolicy-management/policy-profiles/).
 *
 * @module PolicyProfileModel
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../rules/constants/fwRuleGridConstants.js'
], function (SpaceModel, FWRuleGridConstants) {
    /**
     * PolicyProfileModel definition.
     */
    var PolicyProfileModel = SpaceModel.extend({

        defaults: {
            "access-profile": "",
            "authentication-type": "NONE",
            "infranet-redirect": "NONE",
            "destination-address-translation": "NONE",
            "redirect": "NONE"
        },

        urlRoot: FWRuleGridConstants.POLICY_PROFILES,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'policy-profile',
                accept: 'application/vnd.juniper.sd.fwpolicy-management.policy-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.fwpolicy-management.policy-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return PolicyProfileModel;
});