/**
 * A Backbone model representing firewall rule group collection
 * @module FirewallRuleGroupCollection
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js'
], function (
    SpaceCollection
    ) {
  /**
   * FirewallRuleGroupCollection definition.
   */
  var RuleGroupCollection = SpaceCollection.extend({
    urlRoot: undefined,
    policyId: undefined,

    initialize: function(policyId, PolicyManagementConstants, cuid) {

      this.policyId = policyId;
      this.urlRoot = PolicyManagementConstants.POLICY_URL;
      this.cuid = cuid;
      SpaceCollection.prototype.initialize.call(this, {
        jsonRoot: 'ruleCollection.rules',
        accept: PolicyManagementConstants.RULE_ACCEPT_HEADER,
        contentType: PolicyManagementConstants.RULE_CONTENT_HEADER
      });
    },

    sync: function (method, model, options) {
      switch (method) { // method = update | delete | read | create | patch
        case "read":
          options.url = this.urlRoot + this.policyId +  "/draft/rulegroups?cuid=" + this.cuid;
          break;
      }
      return SpaceCollection.prototype.sync.call(this, method, model, options);
    }
  });

  return RuleGroupCollection;
});
