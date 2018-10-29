/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection
 * @author mamata
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/models/ipsRuleCollection.js',
  '../../rules/models/ipsRuleModel.js',
  '../constants/ipsTemplateRuleGridConstants.js'
], function (IpsRuleCollection, RuleModel, PolicyManagementConstants) {

  /**
   * IPSRules Collection definition.
   */
  var RuleCollection = IpsRuleCollection.extend({
    model: RuleModel,

    policyManagementConstants: PolicyManagementConstants

  });

  return RuleCollection;
});

