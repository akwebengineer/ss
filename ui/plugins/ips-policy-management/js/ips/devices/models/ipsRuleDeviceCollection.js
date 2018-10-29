/**
 * A Backbone Collection to be used by the Rule grids for rules model - from Device Page
 *
 * @module ruleCollection
 * @author vinamra
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/models/ipsRuleCollection.js',
  '../constants/ipsPolicyDeviceConstants.js'
], function (RuleCollection, PolicyManagementConstants) {
  /**
   * IPSRules Collection definition.
   */
  var IPSRuleDeviceCollection = RuleCollection.extend({

    policyManagementConstants: PolicyManagementConstants,

    hasSaveCommnets : function(){
      return false;
    }

  });

  return IPSRuleDeviceCollection;
});