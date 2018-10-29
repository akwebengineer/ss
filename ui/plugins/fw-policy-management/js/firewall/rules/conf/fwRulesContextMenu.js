/*
 Firewall Rule Grid Custom Context menu
 extends Base Context Menu Configuration
 */
define([
  '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js',
  '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js',
  '../constants/fwRuleGridConstants.js'
],function(BaseContextMenu, CommonPolicyConstants, PolicyManagementConstants){

  var FirewallRulesContextMenu = function(context, ruleCollection, policyConstants) {
    var me = this;
    policyConstants = policyConstants || PolicyManagementConstants;
    me.initialize(context, ruleCollection, policyConstants);
  };
  _.extend(FirewallRulesContextMenu.prototype, BaseContextMenu.prototype, {


    areRulesUnderSamePredefinedGroup: function (rules) {
      var me = this, returnValue = [];
      $.each(rules, function(i, rule) {
        returnValue.push(rule.isGlobalRule());
      });
      return _.uniq(returnValue).length === 1;
    },

    shouldDisableMoveToRuleGroup : function() {
      var me = this, state =  me.state,
          rules = state.selectedRules,
          returnValue = BaseContextMenu.prototype.shouldDisableMoveToRuleGroup.apply(me);

      return returnValue || !me.areRulesUnderSamePredefinedGroup(rules);
    },

    shouldDisableCreateRuleGroup: function() {
      var me = this, state =  me.state,
          rules = state.selectedRules,
          returnValue = BaseContextMenu.prototype.shouldDisableCreateRuleGroup.apply(me);

      return returnValue || !me.areRulesUnderSamePredefinedGroup(rules);
    },

    shouldDisablePasteInPlace: function(eventName, selectedItems) {
      var me = this, state = me.state;
      if (selectedItems) {
        return !me.ruleCollection.hasCopiedRules || !state.isSingleSelection ||
                !state.isPolicyEditable() || state.isEmptySelection ||
                !state.isRuleGroupSelected || selectedItems.length != 1 ||
                me.ruleCollection.length > 2;
      } else {
        return true;
      }
    },

    pasteInPlaceRuleHandler: function (eventName, selectedItems) {
      var me = this,
          ruleName = selectedItems.selectedRows[0].name[0];
      me.ruleCollection.pasteInPlaceRule(ruleName);
    },

    //returns the combined array of base custom menu and firewall specific custom menu
    getContextMenuItems: function (state) {
      var me = this, ruleCollection = me.ruleCollection, context = me.context, contextMenu;
      var baseContext = BaseContextMenu.prototype.getContextMenuItems.apply(me, [state]);

      contextMenu = $.merge([
        { //user should bind custom key events
          "label": context.getMessage("addRuleBefore"),
          "key": "addBefore",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], CommonPolicyConstants.DIRECTION_MAP.MOVE_RULE_UP);
          },
          "isDisabled": $.proxy(me.shouldDisableAddRule, me)
        }, {
          "label": context.getMessage("addRuleAfter"),
          "key": "addAfter",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], CommonPolicyConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
          },
          "isDisabled": $.proxy(me.shouldDisableAddRule, me)
        }
      ], baseContext);

        // Add option to export at the end of the menu options
        contextMenu = $.merge(contextMenu, [{ //user should bind custom key events
            "label": context.getMessage("rulesGrid_contextMenu_export_to_pdf"),
            "key": "exportPDF",
            "capabilities": [me.policyManagementConstants.EXPORT_POLICY_CAPABILITY],
            "scope": me,
            "handler": me.exportRulesHandler,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
                return false;
            },me)
        }]);

      return contextMenu;
    }
  });
  return FirewallRulesContextMenu;
});

