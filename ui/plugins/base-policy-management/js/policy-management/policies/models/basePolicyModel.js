/**
 * A Backbone model representing policies.
 *
 * @module BasePolicyModel
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceModel.js',
  '../../constants/basePolicyManagementConstants.js'
], function (SpaceModel, BasePolicyManagementConstants) {
  /**
   * BasePolicyModel definition.
   */
  var BasePolicyModel = SpaceModel.extend({

    policyManagementConstants: undefined,

    initialize: function () {
      var me = this;
      SpaceModel.prototype.initialize.call(this, {
        jsonRoot: 'policy',
        accept: me.policyManagementConstants.POLICY_ACCEPT_HEADER,
        contentType: me.policyManagementConstants.POLICY_CONTENT_HEADER
      });
    },

    isGlobalPolicy : function() {
      var me = this;
      return me.get("policy-type") === BasePolicyManagementConstants.GLOBAL;
    },

    isDraftPolicy : function() {
      var me = this;
      return "DRAFT" === me.get("policy-state");
    },

    isPredefinedGroupSelected : function() {
      var me = this;
      return me.get("isStatic");
    },

    isPolicyLocked : function() {
      var me = this;
      return me.get("locked-for-edit");
    },

    isDifferentDomainPolicy: function() {
      var me = this;
      return Juniper.sm.DomainProvider.isNotCurrentDomain(me.get('domain-id'));
    },

    isPreGroupPolicy : function() {
      var me=this;
      return me.get("policy-order") < 0;
    },

    isPostGroupPolicy : function() {
      var me=this;
      return me.get("policy-order") > 0;
    },

    isDevicePolicy : function() {
      var me=this;
      return me.get("policy-type") === BasePolicyManagementConstants.DEVICE;
    },
    isPolicyFullyPublished : function(){
        return this.get("publish-state") === BasePolicyManagementConstants.POLICY_FULLY_PUBLISHED;
    },
    isPolicyNotPublished : function () {
        return this.get("publish-state") === BasePolicyManagementConstants.POLICY_NOT_PUBLISHED;
    },
    isEmptyPolicy : function () {
        var policyRuleCount = this.get("rule-count")
        return (policyRuleCount === undefined || policyRuleCount === 0 );
    }
  });

  return BasePolicyModel;
});
