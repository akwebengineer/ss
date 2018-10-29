define([
  'widgets/overlay/overlayWidget',
  '../views/ruleGroupView.js',
  '../views/moveToRuleGroupView.js',
  '../util/ruleGridConstants.js',
  '../views/highlightRuleView.js',
  '../../../../../ui-common/js/common/utils/SmUtil.js'
],function(OverlayWidget, RuleGroupView, MoveToRuleGroupView, CommonPolicyConstants, HighlightRuleView, SMUtil){
  var RulesContextMenu = function(context, ruleCollection, policyManagementConstants) {};

  _.extend(RulesContextMenu.prototype, {

    ruleCollection: undefined,
    context: undefined,
    policyManagementConstants: undefined,


    initialize: function(context, ruleCollection, policyManagementConstants) {
      var me = this;
      me.context = context;
      me.ruleCollection = ruleCollection;
      me.policyManagementConstants = policyManagementConstants;
    },

    shouldDisableAddRule: function() {
      var me = this,  state = me.state;
      return state.isPredefinedSelected ||
          !state.isSingleSelection ||
          !state.isPolicyEditable();
    },

    shouldDisableCreateRuleGroup: function() {
      var me = this, state = me.state;

      return state.isPredefinedSelected ||
          state.isEmptySelection ||
          state.isRuleGroupSelected ||
          !state.isSelectionUnderSameParent ||
          state.hasCustomParentRuleGroup ||
          !state.isPolicyEditable();
    },

    shouldDisableMoveToRuleGroup : function() {
      var me = this, state = me.state;

      return state.isPredefinedSelected ||
          state.isEmptySelection ||
          state.isRuleGroupSelected ||
          !state.isPolicyEditable();
    },

    getContextMenuItems: function(state){
      var me = this, ruleCollection = me.ruleCollection, context = me.context, contextMenu =[];

      //state is set here to find when to enable/disable buttons. This state is coming from view.
      me.state = state;

      contextMenu = [{
        "label": context.getMessage("rulesGrid_contextMenu_copy"),
        "key": "copyRule",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "scope": me,
        "lockRequired": false,
        "handler": me.copyRuleHandler,
        "isDisabled": $.proxy(function(eventName, selectedItems) {
          return state.isPredefinedSelected || state.isEmptySelection;
        },me)
      }, {
        "label": context.getMessage("rulesGrid_contextMenu_cut_rules"),
        "key": "cutRules",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "handler": me.cutRuleHandler,
        "lockRequired": true,
        "scope": me,
        "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isPredefinedSelected ||
                state.isEmptySelection || !state.isPolicyEditable();
        },me)
      }, {
        "label": context.getMessage("rulesGrid_contextMenu_paste"),
        "key": "PASTE_RULE",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "hasSubMenu": true,
        "items" :[{
          "label": context.getMessage("rulesGrid_contextMenu_paste_rules_before"),
          "key": "PASTE_RULE_BEFORE",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "handler": me.pasteRuleHandler,
          "lockRequired": true,
          "scope": me,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return !me.ruleCollection.hasCopiedRules || !state.isSingleSelection ||
                !state.isPolicyEditable() || state.isEmptySelection || state.isPredefinedSelected;
          },me)
        }, {
          "label": context.getMessage("rulesGrid_contextMenu_paste_rules_after"),
          "key": "PASTE_RULE_AFTER",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": me.pasteRuleHandler,
          "lockRequired": true,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return !me.ruleCollection.hasCopiedRules || !state.isSingleSelection ||
                !state.isPolicyEditable() || state.isEmptySelection || state.isPredefinedSelected;
          },me)
        }, {
          "label": context.getMessage("rulesGrid_contextMenu_paste_rules_inplace"),
          "key": "PASTE_RULE_INPLACE",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": me.pasteInPlaceRuleHandler,
          "lockRequired": true,
          "isDisabled": $.proxy(me.shouldDisablePasteInPlace, me)
        }]
      }, {
        "label": context.getMessage("clone_rule"),
        "key": "cloneRule",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "handler": me.cloneRuleHandler,
        "lockRequired": true,
        "scope": me,
        "isDisabled": $.proxy(function(eventName, selectedItems) {
          return state.isRuleGroupSelected || !state.isSingleSelection ||
              !state.isPolicyEditable();

        },me)
      }, {
        "label": context.getMessage("enable_rule"),
        "key": "enableRule",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "handler": me.enableDisableRuleHandler,
        "lockRequired": true,
        "scope": me,
        "isDisabled": $.proxy(function(eventName, selectedItems) {
           var enableStatus = true;
            if(state.isPredefinedSelected || state.isEmptySelection || !state.isPolicyEditable())
              return enableStatus;
              
            /* loop through the records-selectedRules to set 
            the enable or disable mode for the enable button in context menu*/
            $.each(state.selectedRules, function (i,ruleObj) {
              if(ruleObj.get('disabled')) {
               enableStatus = false;
                return enableStatus; 
              }
              
            });
            return enableStatus;
        },me)
      }, {
        "label": context.getMessage("disable_rule"),
        "key": "disableRule",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "handler": me.enableDisableRuleHandler,
        "lockRequired": true,
        "scope": me,
        "isDisabled": $.proxy(function(eventName, selectedItems) {
            var disableStatus = true;
            if(state.isPredefinedSelected || state.isEmptySelection || !state.isPolicyEditable())
              return disableStatus;
              
            /* loop through the records-selectedRules to set 
            the enable or disable mode for the disable button in context menu*/
            $.each(state.selectedRules, function (i,ruleObj) {
              if(!ruleObj.get('disabled')) {
                disableStatus = false;
                return disableStatus; 
              }
            });
            return disableStatus;
          },me)
      }, {
        "label": context.getMessage("rulesGrid_contextMenu_move_rule"),
        "key": "MOVE_RULE",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "hasSubMenu": true,
        "items" :[{
          "label": context.getMessage("rulesGrid_contextMenu_move_rule_top"),
          "key": "MOVE_RULE_TOP",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "handler" : me.moveRulesHandler,
          "lockRequired": true,
          "scope": me,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isPredefinedSelected || !state.isSingleSelection ||
                state.isFirstItemSelected || !state.isPolicyEditable();
          },me)
        }, {
          "label": context.getMessage("rulesGrid_contextMenu_move_rule_up"),
          "key": "MOVE_RULE_UP",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "handler" : me.moveRulesHandler,
          "lockRequired": true,
          "scope": me,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isPredefinedSelected || !state.isSingleSelection ||
                state.isFirstItemSelected || !state.isPolicyEditable();
          },me)
        }, {
          "label": context.getMessage("rulesGrid_contextMenu_move_rule_down"),
          "key": "MOVE_RULE_DOWN",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "handler" : me.moveRulesHandler,
          "lockRequired": true,
          "scope": me,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isPredefinedSelected || !state.isSingleSelection ||
                state.isLastItemSelected || !state.isPolicyEditable();
          },me)
        }, {
          "label": context.getMessage("rulesGrid_contextMenu_move_rule_bottom"),
          "key": "MOVE_RULE_BOTTOM",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "handler" : me.moveRulesHandler,
          "lockRequired": true,
          "scope": me,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isPredefinedSelected || !state.isSingleSelection ||
                state.isLastItemSelected || !state.isPolicyEditable();
          },me)
        }]
      }, {
        "label": context.getMessage("rulesGrid_contextMenu_rule_group"),
        "key": "RULE_GROUP",
        "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
        "hasSubMenu": true,
        "items" :[{
          "label": context.getMessage("createRuleGroup"),
          "key": "createRuleGroup",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "lockRequired": true,
          "scope": me,
          "handler": me.createRuleGroupHandler,
          "isDisabled": $.proxy(me.shouldDisableCreateRuleGroup, me)
        }, {
          "label": context.getMessage("moveToRuleGroup"),
          "key": "moveToRuleGroup",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "lockRequired": true,
          "scope": me,
          "handler": me.moveToRuleGroupHandler,
          "isDisabled": $.proxy(me.shouldDisableMoveToRuleGroup, me)
        }, {
          "label": context.getMessage("modifyRuleGroup"),
          "key": "modifyRuleGroup",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "lockRequired": true,
          "scope": me,
          "handler": me.modifyRuleGroupHandler,

          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isEmptySelection ||
                !state.isSingleSelection ||
                !state.isRuleGroupSelected ||
                state.isPredefinedSelected ||
                !state.isPolicyEditable();
          },me)
        }, {
          "label": context.getMessage("ungroupRule"),
          "key": "ungroupRule",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "handler": me.ungroupRuleHandler,
          "lockRequired": true,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isEmptySelection ||
                state.isRuleGroupSelected ||
                !state.isSelectionUnderSameParent ||
                !state.hasCustomParentRuleGroup ||
                !state.isPolicyEditable();
          },me)
        }, {
          "label": context.getMessage("ungroupRuleGroup"),
          "key": "ungroupRuleGroup",
          "capabilities": [me.policyManagementConstants.CAPABILITY_MODIFY],
          "scope": me,
          "lockRequired": true,
          "handler": me.ungroupRuleHandler,
          "isDisabled": $.proxy(function(eventName, selectedItems) {
            return state.isEmptySelection ||
                !state.isSingleSelection ||
                !state.isRuleGroupSelected ||
                state.isPredefinedSelected ||
                !state.isPolicyEditable();
          },me)
        }]
      }, {
        "label": context.getMessage("show_events_generated"),
        "key": context.getMessage('events_generated'),
        "capabilities": [me.policyManagementConstants.CAPABILITY_READ],
        "lockRequired": false,
        "scope": me,
        "handler": me.showEventsHandler,
        "isDisabled" : $.proxy(function(eventName, selectedItems) {
            var me = this, state =  me.state;
            return !state.isSingleSelection || state.isRuleGroupSelected || state.isDirty;
        },me)
      }, {
        "label": context.getMessage("rulesGrid_contextMenu_clear_selections"),
        "key": "clearSelections",
        "capabilities": [me.policyManagementConstants.CAPABILITY_READ],
        "lockRequired": false,
        "scope": me,
        "handler" : function(eventName,selectedItems){
          var me = this, selectedRowIds = selectedItems.selectedRowIds;
          me.ruleCollection.trigger("clearSelection", selectedRowIds);
        },
        "isDisabled" : $.proxy(function(eventName, selectedItems) {
          return false;
        },me)
      }];
      if(new SMUtil().isDebugMode()){
        $.merge(contextMenu, [{
          "label": "Debug",
          "key": "debugGrid",
          "hasSubMenu": true,
          "items" :[{
              "label": "Reload Grid",
              "key": "reloadRuleGrid",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
              "label": "Log Scroll Position",
              "key": "logScrollPosition",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
              "label": "Selected Collection Rule",
              "key": "collectionRule",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
              "label": "Selected Grid Rule",
              "key": "gridRule",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
              "label": "Rule Collection",
              "key": "gridCollection",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
              "label": "Grid Viewport",
              "key": "gridViewPort",
              "lockRequired": false,
              "scope": me,
              "isDisabled" : $.proxy(function(eventName, selectedItems) {
                  return false;
              },me)
          },{
                "label": "Highlight row",
                "key": "highlightRow",
                "lockRequired": true,
                "scope": me,
                "handler": me.highlightRuleHandler,
                "isDisabled": $.proxy(function(eventName, selectedItems) {
                    return false;
                },me)
          }]
        }]);

      }
        return contextMenu;
    },

      /**
       * handles creation of rule group
       * @param eventName
       * @param selectedItems
       */
    createRuleGroupHandler: function (eventName, selectedItems) {
        if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRows)) {
            return;
        }
        var me = this, createRuleGroupView = new RuleGroupView({
                'addRuleGroup':function (name, description) {
                    me.ruleCollection.addRuleGroup(name, description, selectedItems.selectedRowIds);
                },
                'close': function (e) {
                    ruleGroupOverlay.destroy();
                    e && e.preventDefault();
                },
                'type': 'create',
                'selections': selectedItems,
                'context': me.context
            }),
            ruleGroupOverlay = new OverlayWidget({
                view: createRuleGroupView,
                type: 'medium',
                showScrollbar: true
            });

        ruleGroupOverlay.build();
    },

      /**
       * Handles move to rule group functionality
       * @param eventName
       * @param selectedItems
       */
    moveToRuleGroupHandler: function (eventName, selectedItems) {
        if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
            return;
        }
        var me = this, rule = me.ruleCollection.get(selectedItems.selectedRowIds[0]),
            isGlobalRuleSelected = rule.get("global-rule"),
            moveToRuleGroupView = new MoveToRuleGroupView({
                'moveRulesToGroup': function(selectedItems, ruleGroupId) {
                    me.ruleCollection.moveRulesOnStore(selectedItems.selectedRowIds,
                        ruleGroupId, CommonPolicyConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);
                },
                'close': function (e) {
                    moveToRuleGroupOverlay.destroy();
                    e && e.preventDefault();
                },
                'selections': selectedItems,
                'policyId': me.ruleCollection.policyID,
                'context': me.context,
                'policyManagementConstants': me.policyManagementConstants,
                'ruleCollection': me.ruleCollection,
                'isGlobalRuleSelected': isGlobalRuleSelected
            }),
            moveToRuleGroupOverlay = new OverlayWidget({
                view: moveToRuleGroupView,
                type: 'medium',
                showScrollbar: true
            });
        moveToRuleGroupOverlay.build();
    },

      /**
       * Handles modify rule group.
       * @param eventName
       * @param selectedItems
       */
    modifyRuleGroupHandler: function (eventName, selectedItems) {

        var me =  this, ruleGroupOverlay, modifyRuleGroupView = new RuleGroupView({
            'modifyRuleGroup':function (name, description) {
                me.ruleCollection.modifyRuleGroup(selectedItems.selectedRowIds[0], name, description);
            },
            'close': function (e) {
                ruleGroupOverlay.destroy();
                e && e.preventDefault();
            },
            'type': 'modify',
            'selections': selectedItems,
            'ruleCollection': me.ruleCollection,
            'context': me.context
        });

        ruleGroupOverlay = new OverlayWidget({
            view: modifyRuleGroupView,
            type: 'medium',
            showScrollbar: true
        });

        ruleGroupOverlay.build();
    },

      /**
       * Handler for highlighting rule
       * @param eventName
       * @param selectedItems
       */
    highlightRuleHandler: function (eventName, selectedItems) {
        var me = this, highlightRuleView, highlightRuleOverlay;

          if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRows)) {
              return;
          }
          highlightRuleView = new HighlightRuleView({
                  'highlightRule':function (ruleId) {
                      me.ruleCollection.highlightRule("highlightRule",{ruleIds:[ruleId], isRowEditable:false});
                  },
                  'close': function (e) {
                      highlightRuleOverlay.destroy();
                      e && e.preventDefault();
                  },
                  'context': me.context
              });
        highlightRuleOverlay = new OverlayWidget({
                  view: highlightRuleView,
                  type: 'xsmall'
              });

          highlightRuleOverlay.build();
      },

    moveRulesHandler: function(eventName, selectedItems) {
      if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
        return;
      }
      var me = this, direction = CommonPolicyConstants.DIRECTION_MAP[eventName],
          ruleId = selectedItems.selectedRowIds[0],
          ruleCollection = me.ruleCollection;
      ruleCollection.moveRule(ruleId, direction);
    },
    pasteRuleHandler: function (eventName, selectedItems) {
      if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
        return;
      }
      var me = this,
          referenceRuleID = selectedItems.selectedRowIds[0],
          direction = CommonPolicyConstants.DIRECTION_MAP[eventName];

      me.ruleCollection.pasteRules(referenceRuleID, direction);
    },
    copyRuleHandler: function (eventName, selectedItems) {
      if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
        return;
      }
      var me = this, ruleIDs = selectedItems.selectedRowIds;

      me.ruleCollection.copyRules(ruleIDs);
    },
    cutRuleHandler: function (eventName, selectedItems) {
      if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
        return;
      }
      var me = this,
          ruleIDs = selectedItems.selectedRowIds;

      me.ruleCollection.cutRules(ruleIDs);
    },
    // need to use model to get the 'enabled' flag for this
    enableDisableRuleHandler: function(eventName, selectedItems) {
      var me = this, ruleCollection = me.ruleCollection,
          ruleIDs = selectedItems.selectedRowIds,
          disable = eventName === 'disableRule'? true : false;

      ruleCollection.enableDisableRules(ruleIDs, disable);
    },

    cloneRuleHandler: function(eventName, selectedItems) {
      if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
        return;
      }
      var me = this, ruleCollection = me.ruleCollection,
          ruleId = selectedItems.selectedRowIds[0];

      ruleCollection.cloneRule(ruleId);
    },

    ungroupRuleHandler: function(eventName, selectedItems) {
        var me = this, ruleCollection = me.ruleCollection,
            ruleIDs = selectedItems.selectedRowIds;

        ruleCollection.ungroupRules(ruleIDs);
    },

    showEventsHandler: function(eventName, selectedItems) {
        var me = this, ruleCollection = me.ruleCollection,
            ruleIDs = selectedItems.selectedRowIds;

        ruleCollection.showEvents(ruleIDs);
    },

      /**
       * Handles export on rule grid
       * @param eventName 'exportRulesToPDF'
       * @param selectedItems Selections not to be used
       * @param rulesView Rules Grid view
       */
     exportRulesHandler: function(eventName, selectedItems, rulesView) {
        var me = this;
        rulesView.$el.trigger('exportRulesToPDF');

    }
  });
  return RulesContextMenu;
});