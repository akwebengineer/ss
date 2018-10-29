/*
 IPS Rule Grid Custom Context menu
 extends Base Context Menu Configuration
 */
define([
  '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js',
  '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js',
  '../constants/ipsRuleGridConstants.js'
],function(BaseContextMenu, CommonPolicyConstants, IPSRuleGridConstants){

  var IPSRulesContextMenu = function(context, ruleCollection, policyManagementConstants) {
    var me = this;
    policyManagementConstants = policyManagementConstants || IPSRuleGridConstants;
    me.initialize(context, ruleCollection, policyManagementConstants);
  };
  _.extend(IPSRulesContextMenu.prototype, BaseContextMenu.prototype, {

    shouldDisablePasteInPlace: function() {
      var me = this, state = me.state;
      return !me.ruleCollection.hasCopiedRules || !state.isSingleSelection ||
              !state.isPolicyEditable() ||
              me.ruleCollection.length > 0;
    },

    pasteInPlaceRuleHandler: function (eventName, selectedItems) {
      var me = this, ruleName;
      me.ruleCollection.pasteInPlaceRule(ruleName);
    },

    //returns the combined array of base custom menu and nat specific custom menu
    getContextMenuItems: function (state) {
      var me = this, ruleCollection = me.ruleCollection, context = me.context;
      var baseContext =  BaseContextMenu.prototype.getContextMenuItems.apply(me, [state]);

      return $.merge([{
         "label": context.getMessage("addRuleBefore"),
         "key": "ADD_RULE_BEFORE",
         "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
         "hasSubMenu": true,
         "items" :[{
             "label": context.getMessage("addIPSRule"),
             "key": "ADD_IPS_BEFORE",
             "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
             "scope": me,
             "handler": function (eventName, selected) {
               //console.log(me);
               if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
                 return;
               }
             ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], IPSRuleGridConstants.DIRECTION_MAP.MOVE_RULE_UP, IPSRuleGridConstants.IPS_TYPE_DEFAULT);
             },
           "isDisabled": $.proxy(me.shouldDisableAddRule, me)
           }, {
             "label": context.getMessage("addExemptRule"),
             "key": "ADD_EXEMPT_BEFORE",
             "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
             "scope": me,
             "handler": function (eventName, selected) {
               if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
                 return;
               }
             ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], IPSRuleGridConstants.DIRECTION_MAP.MOVE_RULE_UP, IPSRuleGridConstants.IPS_TYPE_EXEMPT);
             },
           "isDisabled": $.proxy(me.shouldDisableAddRule, me)
           }]
       },
       {
         "label": context.getMessage("addRuleAfter"),
         "key": "ADD_RULE_AFTER",
         "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
         "hasSubMenu": true,
         "items" :[{
             "label": context.getMessage("addIPSRule"),
             "key": "ADD_IPS_AFTER",
             "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
             "scope": me,
             "handler": function (eventName, selected) {
               if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
                 return;
               }
             ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], IPSRuleGridConstants.DIRECTION_MAP.MOVE_RULE_DOWN, IPSRuleGridConstants.IPS_TYPE_DEFAULT);
             },
           "isDisabled": $.proxy(me.shouldDisableAddRule, me)
           },  {
             "label": context.getMessage("addExemptRule"),
             "key": "ADD_EXEMPT_AFTER",
             "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
             "scope": me,
             "handler": function (eventName, selected) {
               if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
                 return;
               }
             ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], IPSRuleGridConstants.DIRECTION_MAP.MOVE_RULE_DOWN, IPSRuleGridConstants.IPS_TYPE_EXEMPT);
             },
           "isDisabled": $.proxy(me.shouldDisableAddRule, me)
           }]
       }],baseContext);
    }
  });
  return IPSRulesContextMenu;
});

