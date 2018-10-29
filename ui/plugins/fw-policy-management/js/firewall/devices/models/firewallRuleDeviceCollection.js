/**
 * A Backbone Collection to be used by the Rule grids for rules model - from Device Page
 *
 * @module ruleCollection
 * @author vinamra
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/models/fwRuleCollection.js',
  '../constants/firewallPolicyDeviceConstants.js'
], function (RuleCollection, PolicyManagementConstants) {
  /**
   * FirewallRules Collection definition.
   */
  var FWRuleDeviceCollection = RuleCollection.extend({

    policyManagementConstants: PolicyManagementConstants,

    hasSaveCommnets : function(){
      return false;
    }

  });

  return FWRuleDeviceCollection;
});