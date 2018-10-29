/*
 NAt Rule Grid Custom Context menu
 extends Base Context Menu Configuration
 */
define([
  '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js',
  '../constants/natRuleGridConstants.js'
],function(BaseContextMenu, NatRuleGridConstants){

  var NatRulesContextMenu = function(context, ruleCollection, policyManagementConstants) {
    var me = this;
    me.initialize(context, ruleCollection, policyManagementConstants);
  };
  _.extend(NatRulesContextMenu.prototype, BaseContextMenu.prototype, {

    /**
     * static and destination rules are not allowed in Group policy
     *
     * @returns {RulesContextMenu.state.isPredefinedSelected|*|boolean}
     */
    shouldDisableAddDestinationStaticRule: function() {
      var me = this, ruleCollection = me.ruleCollection;
      return me.shouldDisableAddRule() ||
          ruleCollection.isGroupPolicy();
    },

    shouldDisablePasteInPlace: function() {
      var me = this, state = me.state;
      return !me.ruleCollection.hasCopiedRules || !state.isSingleSelection ||
              !state.isPolicyEditable() ||
              me.ruleCollection.length > 0;
    },

    pasteInPlaceRuleHandler: function (eventName, selectedItems) {
      var me = this;
      me.ruleCollection.pasteInPlaceRule();
    },

    //returns the combined array of base custom menu and nat specific custom menu
    getContextMenuItems: function (state) {
      var me = this, ruleCollection = me.ruleCollection, context = me.context, contextMenu;
      var baseContext = BaseContextMenu.prototype.getContextMenuItems.apply(me, [state]);

      contextMenu = $.merge([{
        "label": context.getMessage("addRuleBefore"),
        "key": "ADD_RULE_BEFORE",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "hasSubMenu": true,
        "items" :[{
          "label": context.getMessage("source_rule"),
          "key": "ADD_SOURCE_BEFORE",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_UP, NatRuleGridConstants.NAT_TYPE_SOURCE);
          },
          "isDisabled": $.proxy(me.shouldDisableAddRule, me)
        }, {
          "label": context.getMessage("static_rule"),
          "key": "ADD_STATIC_BEFORE",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_UP, NatRuleGridConstants.NAT_TYPE_STATIC);
          },
          "isDisabled": $.proxy(me.shouldDisableAddDestinationStaticRule, me)
        }, {
          "label": context.getMessage("destination_rule"),
          "key": "ADD_DESTINATION_BEFORE",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_UP, NatRuleGridConstants.NAT_TYPE_DESTINATION);
          },
          "isDisabled": $.proxy(me.shouldDisableAddDestinationStaticRule, me)
        }]
      },
       {
        "label": context.getMessage("addRuleAfter"),
        "key": "ADD_RULE_AFTER",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "hasSubMenu": true,
        "items" :[{
          "label": context.getMessage("source_rule"),
          "key": "ADD_SOURCE_AFTER",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_DOWN, NatRuleGridConstants.NAT_TYPE_SOURCE);
          },
          "isDisabled": $.proxy(me.shouldDisableAddRule, me)
        }, {
          "label": context.getMessage("static_rule"),
          "key": "ADD_STATIC_AFTER",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_DOWN, NatRuleGridConstants.NAT_TYPE_STATIC);
          },
          "isDisabled": $.proxy(me.shouldDisableAddDestinationStaticRule, me)
        },  {
          "label": context.getMessage("destination_rule"),
          "key": "ADD_DESTINATION_AFTER",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": function (eventName, selected) {
            if ($.isEmptyObject(selected) || !$.isArray(selected.selectedRows) || $.isEmptyObject(eventName)) {
              return;
            }
            ruleCollection.addRule(selected.selectedRows[0][me.policyManagementConstants.JSON_ID], NatRuleGridConstants.DIRECTION_MAP.MOVE_RULE_DOWN, NatRuleGridConstants.NAT_TYPE_DESTINATION);
          },
          "isDisabled": $.proxy(me.shouldDisableAddDestinationStaticRule, me)
        }]
      }], baseContext);


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
  return NatRulesContextMenu;
});

