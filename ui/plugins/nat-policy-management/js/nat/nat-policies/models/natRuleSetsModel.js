/**
 * A Backbone model representing NatRuleSetsModel
 *
 * @module NatRuleSetsModel
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel, NatPolicyManagementConstants) {
    /**
     * NatRuleSetsModel definition.
     */
    var NatRuleSetsModel = SpaceModel.extend({
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'policy-rule-set.rule-sets.rule-set',
                accept: NatPolicyManagementConstants.RULE_SETS_ACCEPT_HEADER,
                contentType: NatPolicyManagementConstants.RULE_SETS_CONTENT_TYPE
            });
        }
    });

    return NatRuleSetsModel;
});
