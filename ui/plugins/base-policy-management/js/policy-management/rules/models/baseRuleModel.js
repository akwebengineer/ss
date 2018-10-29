/**
 * Model for rule
 *
 * @module RuleModel
 * @author mbetala
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../ui-common/js/models/spaceModel.js',
  '../util/ruleGridConstants.js'
], function (BaseModel, RuleGridConstants) {

  var RuleModel = BaseModel.extend({
    idAttribute: RuleGridConstants.JSON_ID,

    setRuleDisableState: function(disable) {
      var me = this;
      if (disable === true) {
        me.set({
          disabled: true
        });
      } else if (disable === false) {
        me.set({
          disabled: false
        });
      }
    },
    getRuleLevel : function () {
      var me = this;
      return me.get('rule-level');
    },
    getRuleGroupId : function () {
      var me = this;
      return me.get('rule-group-id');
    },
    isRule : function () {
      return this.get("rule-type") === "RULE";
    },

    isPredefined: function() {
      var me = this;
      return me.get("is-predefined") === true;
    },

    isLastItemInParentGroup: function () {
      var me = this;
      return me.get("is-last-item") === true;
    },

    isFirstItemInParentGroup: function () {
      var me = this;
      return me.get("is-first-item") === true;
    },

    isRuleGroup: function() {
      return this.get("rule-type") === "RULEGROUP";
    },
    isExpanded: function() {
      return this.get("expanded") === "true" || this.get("expanded") === true;
    },
    hasCustomParentRuleGroup: function() {
      //if the rule has level 2 that means its a rule under a custom rule group
      return this.get('rule-level') >= 2;
    },
    setRulePage :function(page){
      var me = this;
      me.set("pageNum", page, { silent: true });
    },
    setRowNumber :function(rowNum){
      var me = this;
      me.set("rowNum", rowNum, { silent: true });
    }
  });

  return RuleModel;
});