/**
 * A Backbone Collection to be used by the Rule grids for rules model - from Device Page
 *
 * @module ruleCollection
 * @author vinamra
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/models/natRuleCollection.js',
  '../constants/natPolicyDeviceConstants.js'
], function (RuleCollection, PolicyManagementConstants) {
  /**
   * NATRules Collection definition.
   */
  var NATRuleDeviceCollection = RuleCollection.extend({

    policyManagementConstants: PolicyManagementConstants,

    hasSaveCommnets : function(){
      return false;
    }

  });

  return NATRuleDeviceCollection;
});