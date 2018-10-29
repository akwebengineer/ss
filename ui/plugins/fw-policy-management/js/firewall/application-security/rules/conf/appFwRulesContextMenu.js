/*
 App Firewall Rule Grid Custom Context menu
 extends Base Context Menu Configuration
 */
define([
  '../../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js',
  '../../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js',
  '../../AppFwConstants.js'
],function(BaseContextMenu, CommonPolicyConstants, PolicyManagementConstants){

  var AppFirewallRulesContextMenu = function(context, ruleCollection, policyConstants) {
    var me = this;
    policyConstants = policyConstants || PolicyManagementConstants;
    me.initialize(context, ruleCollection, policyConstants);
  };
  _.extend(AppFirewallRulesContextMenu.prototype, BaseContextMenu.prototype, {
    //returns the combined array of base custom menu and firewall specific custom menu
    getContextMenuItems: function (state) {
      var i, me = this, ruleCollection = me.ruleCollection, context = me.context, defaultContext = [],
          baseContext = BaseContextMenu.prototype.getContextMenuItems.apply(me, [state]);
      for(i in baseContext){
        if(baseContext[i].key !== "eventsGenerated"){
          defaultContext[defaultContext.length] = baseContext[i];
        }
      }

      return $.merge([
        { //user should bind custom key events
          "label": context.getMessage("addRuleBefore"),
          "key": "addBefore",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            //console.log(me);
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
      ], defaultContext);
    }
  });
  return AppFirewallRulesContextMenu;
});

