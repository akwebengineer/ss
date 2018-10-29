/**
 * A view to manage firewall policy rules
 *
 * @module RulesView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  
  'widgets/grid/gridWidget',
  'widgets/dropDown/dropDownWidget',
  'widgets/tooltip/tooltipWidget',
  '../util/baseContextMenuHandler.js',
  'text!../templates/ruleGridTopSection.html',
  './addressObjectToolTipView.js',
  './serviceObjectToolTipView.js',
  '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
  './customColumnEditorView.js',
    'widgets/spinner/spinnerWidget',
    'lib/template_renderer/template_renderer',
    'text!../templates/ruleGridLoadingBackground.html',
    '../../export/views/exportRulesView.js',
    '../../../../../ui-common/js/util/gridSizeCalculatorSD.js'
], function (GridWidget, DropDownWidget, TooltipWidget, ContextMenuPlugin, GridTopSectionTemplate,
             AddressToolTip, ServiceToolTip, SmSSEEventSubscriber, CustomColumnEditorView, SpinnerWidget, render_template, LoadingBackgroundTemplate,
             ExportView, GridSizeCalculatorSD) {


    var spinnerContainer, spinner;

    /**
     * Creates the spinner widget component
     * @param view
     */
    function createSpinner(view) {
        spinnerContainer = view.$el;

        spinner = new SpinnerWidget({
            "container": spinnerContainer
        });
    };

    /**
     * Shows the spinner
     */
    function showSpinner() {
        // loading background for SpinnerWidget
        if (spinnerContainer.find(".rulegrid-indicator-background").length > 0) {
            spinnerContainer.find(".rulegrid-indicator-background").show();
        } else {
            spinnerContainer.append(render_template(LoadingBackgroundTemplate));
        }
        spinner.build();
    };

    /**
     * Destroys the spinner
     */
    function destroySpinner(){
        spinner.destroy();
        if (spinnerContainer.find(".rulegrid-indicator-background").length > 0) {
            spinnerContainer.find(".rulegrid-indicator-background").hide();
        }
    };

    /**
     * Updates the button status
     * @param view Base rule view instance
     * @param button Button that need to be updated
     * @param isDisabled is the button required to be disabled
     */
    function updateButtonStatus(view, button, isDisabled) {
        var me = view, key, actionStatus = {};
        if (button) {
            if (isDisabled) {
                button.removeClass('disabled').addClass('disabled');
            } else {
                button.removeClass('disabled');
            }
        }
        key = button.get('key');
        actionStatus[key] = !isDisabled;
        me.gridWidgetObject.updateActionStatus(actionStatus);
    };

    /*
     returns the save policy button
     */

    function createSavePolicyBtn(view) {

        var me = view, saveBtnConfig, ruleCollection = me.ruleCollection;

        saveBtnConfig = {
            "button_type": true,
            "label": me.context.getMessage("action_save"),
            "key": me.customActionKeys.SAVE,
            "secondary": true,
            "class": "rulesave",
            "disabledStatus": me.isCustomButtonDisabled(me.customActionKeys.SAVE)//if not set will show it as enabled by default
        };
        ruleCollection.bind('rule-collection-dirty', function () {
            updateButtonStatus(me, me.findSavePolicyBtn(), !ruleCollection.isCollectionDirty());
        });
        ruleCollection.bind('after-policy-save', function (errorKey) {
            var isDisabled = errorKey !== undefined ? !Boolean(errorKey) : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findSavePolicyBtn(), isDisabled);
        });
        view.$el.bind('after-discard-policy', function () {
            updateButtonStatus(me, me.findSavePolicyBtn(), !ruleCollection.isCollectionDirty());
        });

        view.$el.bind('policy-read-only', function (e, isPolicyReadOnly) {
            var isDisabled = isPolicyReadOnly !== undefined ? isPolicyReadOnly : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findSavePolicyBtn(), isDisabled);
        });

        view.$el.bind('policy-validate', function (e, errorKey) {
            var isDisabled = errorKey !== undefined ? Boolean(errorKey) : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findSavePolicyBtn(), isDisabled);
        });

        return saveBtnConfig;
    };

    /*
     returns the discard policy button
     */

    function createDiscardPolicyBtn(view) {
        var me = view, discardBtnConfig, ruleCollection = me.ruleCollection;

        discardBtnConfig = {
            "button_type": true,
            "label": "Discard",
            "key": me.customActionKeys.DISCARD,
            "secondary": true,
            "disabledStatus": me.isCustomButtonDisabled(me.customActionKeys.DISCARD)//if not set will show it as enabled by default
        };

        ruleCollection.bind('rule-collection-dirty', function () {
            updateButtonStatus(me, me.findDiscardPolicyBtn(), !ruleCollection.isCollectionDirty());
        });
        ruleCollection.bind('after-policy-save', function (errorKey) {
            var isDisabled = errorKey !== undefined ? !Boolean(errorKey) : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findDiscardPolicyBtn(), isDisabled);
        });

        view.$el.bind('after-discard-policy', function () {
            updateButtonStatus(me, me.findDiscardPolicyBtn(), !ruleCollection.isCollectionDirty());
        });

        view.$el.bind('policy-read-only', function (e, isPolicyReadOnly) {
            var isDisabled = isPolicyReadOnly !== undefined ? isPolicyReadOnly : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findDiscardPolicyBtn(), isDisabled);
        });

        view.$el.bind('policy-validate', function (e, errorKey) {
            var isDisabled = errorKey !== undefined ? Boolean(errorKey) : !ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findDiscardPolicyBtn(), isDisabled);
        });
        return discardBtnConfig;
    };
    /* create the custom buttons - shared objects menu dropdown,
    pass option values as key and label to the custom buttons */
    function createSharedObjectsMenuDropDown(view){
      var me = view, sharedObjConfig,sharedObjectItemsArr=[];

      $.each(me.objectsViewData, function(index, item) {
          sharedObjectItemsArr[index] = {
            label: 'Show '+ item.text,
            key: item.id
          
          };
      });
      /* config for dropDown menu */
      sharedObjConfig = {

             "menu_type" : true,
             "label": me.context.getMessage("SHAREDOBJECTS"),
             "key": me.customActionKeys.SHAREDOBJECTS,
             "items": sharedObjectItemsArr

       }
       return sharedObjConfig;
    };


    /*
     returns the publish policy button
     */

    function createPublishPolicyBtn(view) {
        var me = view, publishBtnConfig, ruleCollection = me.ruleCollection;

        publishBtnConfig = {
            "button_type": true,
            "label": me.context.getMessage("publish_context_menu_title"),
            "key": me.customActionKeys.PUBLISH,
            "secondary": true,
            "disabledStatus": me.isCustomButtonDisabled(me.customActionKeys.PUBLISH)//if not set will show it as enabled by default
        };

        ruleCollection.bind('rule-collection-dirty', function () {
            updateButtonStatus(me, me.findPublishPolicyBtn(), ruleCollection.isCollectionDirty());
        });
        view.$el.bind('after-discard-policy', function () {
            updateButtonStatus(me, me.findPublishPolicyBtn(), ruleCollection.isCollectionDirty());
        });

        ruleCollection.bind('after-policy-save', function (errorKey) {
            var isDisabled = errorKey !== undefined ? Boolean(errorKey) : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findPublishPolicyBtn(),  isDisabled);
        });

        view.$el.bind('policy-read-only', function (e, isPolicyReadOnly) {
            var isDisabled = isPolicyReadOnly !== undefined ? !isPolicyReadOnly : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findPublishPolicyBtn(), isDisabled);
        });

        view.$el.bind('policy-validate', function (e, errorKey) {
            var isDisabled = errorKey !== undefined ? !Boolean(errorKey) : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findPublishPolicyBtn(), isDisabled);
        });

        view.$el.bind('publish-policy', function () {
            updateButtonStatus(me, me.findPublishPolicyBtn(), true);
        });

        return publishBtnConfig;
    };

    /*
     returns the update policy button
     */

    function createUpdatePolicyBtn(view) {
        var me = view, updateBtnConfig, ruleCollection = me.ruleCollection;

        updateBtnConfig = {
            "button_type": true,
            "label": me.context.getMessage("update_context_menu_title"),
            "key": me.customActionKeys.UPDATE,
            "secondary": true,
            "disabledStatus": me.isCustomButtonDisabled(me.customActionKeys.UPDATE)//if not set will show it as enabled by default
        };

        ruleCollection.bind('rule-collection-dirty', function () {
            updateButtonStatus(me, me.findUpdatePolicyBtn(), ruleCollection.isCollectionDirty());
        });
        view.$el.bind('after-discard-policy', function () {
            updateButtonStatus(me, me.findUpdatePolicyBtn(), ruleCollection.isCollectionDirty());
        });

        ruleCollection.bind('after-policy-save', function (errorKey) {
            var isDisabled = errorKey !== undefined ? Boolean(errorKey) : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findUpdatePolicyBtn(), isDisabled);
        });

        view.$el.bind('policy-read-only', function (e, isPolicyReadOnly) {
            var isDisabled = isPolicyReadOnly !== undefined ? !isPolicyReadOnly : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findUpdatePolicyBtn(), isDisabled);
        });

        view.$el.bind('policy-validate', function (e, errorKey) {
            var isDisabled = errorKey !== undefined ? !Boolean(errorKey) : ruleCollection.isCollectionDirty();
            updateButtonStatus(me, me.findUpdatePolicyBtn(), isDisabled);
        });

        view.$el.bind('publish-policy', function () {
            updateButtonStatus(me, me.findUpdatePolicyBtn(), false);
        });

        view.$el.bind('update-policy', function () {
            updateButtonStatus(me, me.findUpdatePolicyBtn(), true);
        });
        return updateBtnConfig;

    };


  var RulesView = Backbone.View.extend({

    events : {
      "click #savePolicyButton": "handleSavePolicy",
      "click #publishPolicyButton": "handlePublishPolicy"
    },

    getObjectsPanelPreferenceKey : function () {
      return this.policyManagementConstants.USER_PREF_SHARED_OBJECT_SELECTION_KEY;
    },

    closeEditorOverlay: function (columnName, e) {
      this.$el.trigger('closeCellOverlayView', columnName);
      e && e.preventDefault();
    },

    createViews : function () {},

    /**
     * state of the grid selections and grid read/write properties
     */
    initializeState: function() {
      var me = this;
      me.state = {
        selectedRules: [],
        isEmptySelection: true,
        isSingleSelection: false,
        isPredefinedSelected: false,
        isRuleGroupSelected: false,
        isSelectionUnderSameParent: false,
        isLastItemSelected: false,
        isFirstItemSelected: false,
        isDirty: false
      };
      me.state.isPolicyEditable = $.proxy(function () {
        var me = this, ruleCollection = me.ruleCollection;
        return !ruleCollection.isPolicyReadOnly();
      }, me);
    },

    /**
     * method to return the map of rule id to rule
     *
     * @param rules
     * @returns {{}}
     */
    getRuleIdMap: function (rules) {
      var ruleIdMap = {};
      _.each(rules, function (rule) {
        ruleIdMap[rule.get('id')] =  rule;
      });
      return ruleIdMap;
    },

    /**
     * returns the selected rules from collection from selected items.
     * if rule is in collection than it will be used else the rule state will be used.
     *
     * @param selectedItems
     * @returns {Array}
     */
    getSelectedRules: function (selectedItems) {
      var me = this, ruleCollection = me.ruleCollection, state =  me.state,
          existingSelectionsMap  = me.getRuleIdMap(state.selectedRules),
          currentSelectionIds = me.getSelectionIds(selectedItems), selections = [] ;

      _.each(currentSelectionIds, function (selectionId) {
        var rule = ruleCollection.get(selectionId);
        rule = rule? rule : existingSelectionsMap[selectionId];
        if (rule) {
          selections.push(rule);
        }
      });
      return selections;
    },
    /**
     * method to get the state of the current selections
     *
     * @param selectedItems
     * @returns {{}}
     */
    updateSelectionState: function(selectedItems) {
      var me = this, ruleCollection = me.ruleCollection, state = me.state,
          rules = me.getSelectedRules(selectedItems);

      state.selectedRules = rules;
      state.isEmptySelection =  rules.length === 0;
      state.isSingleSelection = rules.length === 1;
      state.isPredefinedSelected = me.isPredefinedSelected(rules);
      state.isRuleGroupSelected = me.isRuleGroupSelected(rules);
      state.isSelectionUnderSameParent = me.isSelectionUnderSameParent(rules);
      state.isLastItemSelected = me.isLastItemSelected(rules);
      state.isFirstItemSelected = me.isFirstItemSelected(rules);
      state.hasCustomParentRuleGroup = me.hasCustomParentRuleGroup(rules);
      state.isDirty = ruleCollection.isCollectionDirty();
      return state;
    },

    isPredefinedSelected: function (rules) {
      var me = this, returnValue = false;
      $.each(rules, function (i, rule) {
        returnValue = returnValue || rule.isPredefined();
      });

      return returnValue;
    },

    isRuleGroupSelected: function (rules) {
      var me = this, returnValue = false;
      $.each(rules, function (i, rule) {
        returnValue = returnValue || rule.isRuleGroup();
      });
      return returnValue;
    },

    isSelectionUnderSameParent: function (rules) {
      var me = this, parentRuleGroupIds = [], returnValue = false;
      $.each(rules, function (i, rule) {
        var parentRuleGroupId = rule.get('rule-group-id');
        parentRuleGroupIds.push(parentRuleGroupId);
      });
      return $.unique(parentRuleGroupIds).length === 1;
    },

    isLastItemSelected: function (rules) {
      var me = this, returnValue = false;
      $.each(rules, function (i, rule) {
        returnValue = returnValue || rule.isLastItemInParentGroup();
      });
      return returnValue;
    },

    isFirstItemSelected: function (rules) {
      var me = this, returnValue = false;
      $.each(rules, function (i, rule) {
        returnValue = returnValue || rule.isFirstItemInParentGroup();
      });
      return returnValue;
    },

    hasCustomParentRuleGroup: function(rules) {
      var me = this, returnValue = false;
      $.each(rules, function (i, rule) {
        returnValue = returnValue || rule.hasCustomParentRuleGroup();
      });
      return returnValue;
    },

    getSelectionIds: function (selectedItems) {
      var currentSelectionIds = [];
      selectedItems = _.isUndefined(selectedItems) ? [] : selectedItems;
      _.each(selectedItems, function (selectedItem) {
        currentSelectionIds.push(parseInt(selectedItem.id));
      });

      return currentSelectionIds;
    },

    initialize: function (options) {
      var extras = options.extras;
      this.customColumns = options.customColumns;
      this.objectsViewData = options.objectsViewData;
      this.context = options.context;
      this.ruleCollection = options.ruleCollection;
      this.policyObj = this.ruleCollection.policy;
      this.policyManagementConstants = options.policyManagementConstants;
      this.cuid = options.cuid;
      this.extras = extras;
      if (extras) {
          this.filter = extras.filter;
      }
      this.cellOverlayViews = this.createViews();
      this.createCustomColumnEditors(this.cellOverlayViews);
      this.actionEvents = this.buildActionEvents();
      this.smSSEEventSubscriber = new SmSSEEventSubscriber();
      this.subscribeNotifications();
      this.handleNavigateAway();
      this.initializeState();
      createSpinner(this);
      this.bindLoadingEvents();
    },

      /**
       * Binds the loading events
       */
      bindLoadingEvents: function() {
          $(this.$el).bind('showloading', $.proxy(showSpinner, this)).
              bind('destroyloading', $.proxy(destroySpinner, this));
      },
     subscribeNotifications : function () {
        //Subscribe to the SSE event
        var self = this;
        var policyId = self.policyObj.id;
        var notificationSubscriptionConfig = {
            'uri' : [self.policyManagementConstants.POLICY_URL+policyId],
            'callback' : function (args) {
              console.log("Notification received for policy rule page -- "+args.uri);
              self.$el.trigger("policy-modified", args);
            }
        };
        var sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self.view);
        self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
        return self.sseEventSubscriptions;
    },

    unSubscribeNotifications: function(){
        this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
        this.smSSEEventSubscriber = null;
        this.sseEventSubscriptions = null;
    },

    handleNavigateAway: function() {

        var self = this;
        this.messageResolver = new Slipstream.SDK.MessageResolver();
        this.customActionKeys = this.getCustomActionKeys();
        this.subscription = this.messageResolver.subscribe('topics://navigateAway/','navigateAway', function(event_data) {
            if (self.ruleCollection.isCollectionDirty()) {
                var msg =  {
                    'message': self.context.getMessage("rules_not_saved_message"),
                    'navAwayQuestion' :  self.context.getMessage("confirm_navigate_away"),
                    'title':  self.context.getMessage("rules_not_saved_title"),
                    'yesButtonCallback' : $.proxy(self.navigateAwayYesCallback,self)
                };
                if (event_data) {
                    event_data.returnValue = msg.message + '&nbsp;&nbsp;' + msg.navAwayQuestion;
                }
                return msg;
            }
            return false;
        });
    },

    getCustomActionKeys : function(){
      return {
            "SAVE" :"saveRules",
            "PUBLISH" :"publishRules",
            "UPDATE" :"updatePublishedRules",
            "DISCARD" : "discardRules",
            "SHAREDOBJECTS" : "SharedObjects"
        };
    },

    navigateAwayYesCallback : function(){
      this.close(); 
    },

    /**
     * gets the rule from the ruleCollection. if not found it will fetch from state.
     *
     * @param ruleId
     * @returns {*}
     */
    getSelectedRuleById: function(ruleId) {
      var me = this, ruleCollection = me.ruleCollection,
          state = me.state, selectedRules = state.selectedRules, rule = ruleCollection.get(ruleId);

      if (rule) {
        return rule;
      }

      //rule is not available in collection lets get it from state.
      _.each(selectedRules, function(selectedRule) {
        if (selectedRule.get('id') === parseInt(ruleId)) {
          rule = selectedRule;
        }
      });
      return rule;
    },
    createCustomColumnEditors : function (cellViews) {
      var me = this;
      if(me.customColumns) {
        $.each(me.customColumns, function (i, item) {
          customColEditorView = new CustomColumnEditorView({
            'policyObj': me.policyObj,
            'close': _.bind(me.closeEditorOverlay, me),
            'context': me.context,
            'columnName': item.name,
            'id' : item.id,
            'pattern' : item.regex,
            'ruleCollection': me.ruleCollection
          });
          cellViews[item.name] = customColEditorView;
        });
      }
      
    },
    appendCustomColumn : function (config) {
      
      var me = this, customCols = [], formatObject = $.proxy(function (cell, cellValue, options, rowObject) {
        $(cell[0]).attr("data-tooltip", "collapsed");
        return cell;
      }, me),  
      formatDescriptionCell = $.proxy(function (cellValue, options, row) {
        var me = this,value = '',
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          customColData,
          rule_type = rule.get("rule-type");
        if (rule_type == "RULE") {
          customColData = rule.get('custom-column-data');
          if (customColData) {
            value = JSON.parse(customColData)[options.colModel.custom_col_id];
          }
        }
        if(_.isEmpty(value)) {
          return "-";
        }
        return value;
      }, me);
      if(me.customColumns) {
        $.each(me.customColumns, function (i, item) {
          customCols[customCols.length] = {
            "index": 'CustomColumnData'+ (i+1),
            "name" : item.name,
            "label":  item.name,
            "custom_col_id" : item.id,
            'cellTooltip' : {
              value : function (cellData, renderTooltip) {
                var tooltip = me.getCustomColumnTooltip(cellData.rowId, item.id);
                if(tooltip) {
                  renderTooltip(tooltip);
                }
              }
            },
            "width": 150,
            "sortable": false,
            "collapseContent": {
                "formatData": formatDescriptionCell,
                "formatCell": formatObject,
                "overlaySize": "small",
                "singleValue" : true
             },
            "searchCell": true
          };
        });
      }
      $.merge(config, customCols);
    },
    /**
     * This method will be overriden by sub classes to provide grid level drag n drop related config
     * @returns {}
     */
    getDragNDropConfig : function () {
      return undefined;
    },
    /**
     * Validate if drag is allowed or not
     * @param draggedItemsData
     * @param $draggedItems
     * @param draggedItemsRowData
     * @param $dragHelper
     * @returns {boolean}
     */
    cellBeforeDrag : function (draggedItemsData,$draggedItems, draggedItemsRowData, $dragHelper) {
      //Check if edit is allowed or not
      return !this.ruleCollection.isPolicyReadOnly();
    },
    /**
     * This is to validate if every rule that is being dropped is allowed for the drop in this location or not
     * @param dropRules
     * @param targetRuleModel
     * @param testRuleGrpDrop
     * @param isTargetRuleGrp
     * @param targetRuleGrpName
     * @returns {{msg: string, isValid: boolean}}
     */
    validateEachDropRule: function (dropRules, targetRuleModel, testRuleGrpDrop, isTargetRuleGrp, targetRuleGrpName) {
      var me = this, isValid = true, msg = '', dropRuleModel;
      $.each(dropRules, function (index, item) {
        dropRuleModel = me.getSelectedRuleById(item.id);
        //Can not drag predefined groups
        if (true === dropRuleModel.isPredefined()) {
          isValid = false;
          msg = me.context.getMessage('rules.dnd.drop_predefined');
          return isValid;
        }
        //isRuleTypeSame;
        //This check is needed only when predefined rules like Global/Zone are present ike in Fw rule
        if (me.isPredefinedRulesPresent() && targetRuleModel.isGlobalRule() !== dropRuleModel.isGlobalRule()) {
          msg = me.context.getMessage('rules.dnd.drop_across_predefined');
          isValid = false;
          return isValid;
        }
        //isTargetInDroppedList
        if (targetRuleModel.get('id') === dropRuleModel.get('id')) {
          msg = me.context.getMessage('rules.dnd.drop_on_itself', [targetRuleModel.get('name')]);
          isValid = false;
          return isValid;
        }
        //disabling drop of a rule group inside another rule group
        if (testRuleGrpDrop === true && isTargetRuleGrp && dropRuleModel.isRuleGroup()) {
          msg = me.context.getMessage('rules.dnd.drop_rulegrp_inside_another_rulegrp', [dropRuleModel.get('name'), targetRuleGrpName]);
          isValid = false;
          return isValid;
        }
      });
      return {msg: msg, isValid: isValid};
    },
    /**
     * Validate rules drop. This is the core method responsible for all rule drop validations
     * @param targetRuleModel
     * @param dropRules
     * @param validateRuleGrpDrop
     * @param validateRuleGrpDrop_RefRuleModel
     * @returns {*}
     */
    validateRuleDragNDrop : function (targetRuleModel, dropRules, validateRuleGrpDrop, validateRuleGrpDrop_RefRuleModel) {
      var me = this, isValid = true, msg = '', targetRuleGrpName, isTargetRuleGrp, errorVal;
      if (validateRuleGrpDrop_RefRuleModel.isRuleGroup() && validateRuleGrpDrop_RefRuleModel.isPredefined() === false) {
        isTargetRuleGrp = true;
        targetRuleGrpName = validateRuleGrpDrop_RefRuleModel.get('name');
      } else if (validateRuleGrpDrop_RefRuleModel.getRuleLevel() > 1) {
        isTargetRuleGrp = true;
        targetRuleGrpName = me.ruleCollection.get(validateRuleGrpDrop_RefRuleModel.getRuleGroupId()).get('name');
      }
      var __ret = me.validateEachDropRule(dropRules, targetRuleModel, validateRuleGrpDrop, isTargetRuleGrp, targetRuleGrpName);
      msg = __ret.msg;
      isValid = __ret.isValid;
      if (isValid === false) {
        errorVal = {isValid: false, errorMessage: msg};
        return errorVal;
      }
      return isValid;
    },
    /**
     * This is the callback which gets called on hoverdrop event of rule row drop
     * @param callbackData
     * @returns {boolean}
     */
    ruleHoverDrop : function (callbackData) {
      return !this.ruleCollection.isPolicyReadOnly();
      /*var me = this, prevRow = callbackData.siblingRows.prevRow, nextRow = callbackData.siblingRows.nextRow,
       validationStatus;
       if(!prevRow) {
       return false;
       }
       if(prevRow['is-predefined'] && nextRow && nextRow['is-predefined']) {
       return false;
       }
       validationStatus = me.validateRuleDragNDrop(prevRow, callbackData.draggableRows);
       if( validationStatus !== true) {
       return false;
       }
       return true;*/
    },
    processRuleDrop: function (prevRowModel, nextRowModel) {
      var dir, refRule, validateRuleGrpDrop = true, validateRuleGrpDrop_RefRule;
      if(_.isEmpty(prevRowModel) && nextRowModel) {
        //This is case for when dropped at the top above everything
        dir = 'Up';
        refRule = nextRowModel;
        //This case drop rule group on rule grp case will never happen
        validateRuleGrpDrop = false;
      } else if (prevRowModel.isRule() === true) {
        //This is case for prev row is rule
        dir = 'Down';
        refRule = prevRowModel;
      } else if (prevRowModel.isPredefined() === true && nextRowModel) {
        dir = 'Up';
        refRule = nextRowModel;
        //This case drop rule group on rule grp case will never happen
        validateRuleGrpDrop = false;
      } else if (prevRowModel.isRuleGroup() === true) {
        if (nextRowModel && nextRowModel.isRule() === true) {
          if (nextRowModel.getRuleGroupId() === prevRowModel.get('id')) {
            //Rule is child of prev rule grp
            //validate with prevRow
            validateRuleGrpDrop_RefRule = prevRowModel;
          } else {
            //This case drop rule group on rule grp case will never happen
            validateRuleGrpDrop = false;
          }
          dir = 'Up';
          refRule = nextRowModel;
        } else {
          //This case drop rule group on rule grp case will never happen
          validateRuleGrpDrop = false;
          dir = 'Down';
          refRule = prevRowModel;
        }
      }
      return {dir: dir, refRule: refRule, validateRuleGrpDrop: validateRuleGrpDrop, validateRuleGrpDrop_RefRule: validateRuleGrpDrop_RefRule};
    },
    /**
     * This method tells if predefined rules like Global/Zone are present in the rule grid or not
     * For FW rules grid this will return true; Else false; Need to be overriden in Fw rule grid
     * @returns {boolean}
     */
    isPredefinedRulesPresent : function () {
      return false;
    },
    /**
     * This is the callback which gets called on afterdrop event of rule row drop
     * @param callbackData
     * @returns {*}
     */
    ruleAfterDrop : function (callbackData) {
      var me = this, prevRow = callbackData.siblingRows.prevRow, prevRowModel,
        nextRow = callbackData.siblingRows.nextRow,
        nextRowModel,
        errorVal, validationStatus;
      if(prevRow) {
        //If prev Row is not defined then dropped will become first row; Drop is above the existing first row
        prevRowModel = me.ruleCollection.get(prevRow.id);
      } else {
        //If fw rule then predefined rules like Global and Zone are present. In that case
        //drop should not be allowed as first row which means the drop row will go beyond Zone predefined row
        if(me.isPredefinedRulesPresent()) {
          errorVal = {isValid: false, errorMessage: me.context.getMessage('rules.dnd.drop_outside_predefined')};
          return errorVal;
        }
      }
      if(nextRow) {
        nextRowModel = me.ruleCollection.get(nextRow.id);
      }
      //This is the case when drop happens in between pre defined rows like Global/Zone rules
      if(me.isPredefinedRulesPresent() && prevRowModel.isPredefined() && nextRow && nextRowModel.isPredefined()) {
        errorVal = {isValid: false, errorMessage: me.context.getMessage('rules.dnd.drop_outside_predefined')};
        return errorVal;
      }
      var ruleIds = [];
      $.each(callbackData.draggableRows, function(index, item){
        ruleIds[ruleIds.length] = item.id;
      });
      var __ret = this.processRuleDrop(prevRowModel, nextRowModel);
      var dir = __ret.dir, refRule = __ret.refRule, validateRuleGrpDrop = __ret.validateRuleGrpDrop,
        validateRuleGrpDrop_RefRule = __ret.validateRuleGrpDrop_RefRule;
      validationStatus = me.validateRuleDragNDrop(refRule, callbackData.draggableRows,
        validateRuleGrpDrop, validateRuleGrpDrop_RefRule || refRule);
      if( validationStatus !== true) {
        return validationStatus;
      }
      me.ruleCollection.moveDroppedRule(ruleIds, refRule.id, dir);
      //Note finally we need to send false so that default work flow of Slipstream grid does not trigger
      return false;
    },

    render: function () {
     
    
     var me = this, cellOverlayView, tooltips;
      this.context.isRowEditable = function(rowId){
        var state =  me.state, rule = me.getSelectedRuleById(rowId);
        return (state.isPolicyEditable() && !_.isEmpty(rule) && !rule.isRuleGroup());
      };

        this.context.onBeforeEdit = function(rowId, rawData, rowData) {
            var returnValue = me.$el.triggerHandler('gridRowBeforeEdit', rowId);
            return returnValue === false ? false : returnValue;
        };

        var ruleGridConfiguration = me.getRuleGridConfiguration(), gridWidget, contextMenuHandler,
          customButtons = ruleGridConfiguration.actionButtons.customButtons, gridSizeCalculator;


        //Add Drag n Drop config
        //We are adding DnD config from here as we intend to set the excution context for Rule DnD to be Rules View
        ruleGridConfiguration['dragNDrop'] = me.getDragNDropConfig();


        //create grid size calculator
        gridSizeCalculator = new GridSizeCalculatorSD(ruleGridConfiguration);

      if(me.hasRuleGridContextMenu()){
        contextMenuHandler = new ContextMenuPlugin({
        context:me.context,
        view: me,
        ruleCollection: me.ruleCollection,
        contextMenu: me.getContextMenu()
        });

        contextMenuHandler.createContextMenu(ruleGridConfiguration);
        $.extend(me.actionEvents, contextMenuHandler.actionEvents);
      }

      // check if to show the top section
      if (me.hasRuleGridTopSection()) {
         me.appendRulesGridTopSection();
      }
      //
      ruleGridConfiguration.filter = {
        searchResult: function (tokens, renderGridData) {
            var searchFilter = me.getSearchFilter(tokens);
            me.ruleCollection.handleFilter(searchFilter);
            // set filter applied on the grid
            if (tokens.length > 0) {
                me.filterApplied = searchFilter;
            } else {
                me.filterApplied = null;
            }
            renderGridData({});
        },
        columnFilter: true,
        showFilter: me.getRuleGridQuickFilters(),
        "noSearchResultMessage": " ",
        optionMenu: {
            "showHideColumnsItem": {},
            "customItems": []
        }
      };
      //
      me.addCustomButtons(customButtons);
      ruleGridConfiguration.actionButtons.customButtons = customButtons;
      //Need this function to set the custom buttons status correct. If not specified shows all the buttons as enabled
      ruleGridConfiguration.actionButtons.actionStatusCallback = $.proxy(me.setCustomActionStatus, me);
      //Add custom column
      me.appendCustomColumn(ruleGridConfiguration.columns);
      me.generateCellTooltips(ruleGridConfiguration);
        if (me.hasRuleGridEditors() ) {
            cellOverlayView = me.cellOverlayViews;
        }

        if (me.hasToolTips()) {
            tooltips =  $.proxy(me.cellTooltip,me);
        }
      gridWidget = new GridWidget({
        container: me.el,
        elements: ruleGridConfiguration,
        actionEvents: me.actionEvents,
        cellOverlayViews: cellOverlayView,
        sid: me.getSID(),
        cellTooltip: tooltips
      });

      me.createGrid(gridWidget, gridSizeCalculator);

      if(me.filter){
        me.ruleCollection.once('fetchComplete', function() {
          var filter = me.filter;
          var filterStr = filter.replace("(", "").trim().replace(")","").trim().replace(/eq/g,"=").replace(/'/g, ""),
              filterTokens = filterStr.split("and");
          me.gridWidgetObject.search(filterTokens);
        });
      }

      // check if to show bottom grid section
      if (me.hasRuleGridBottomSection()) {
          me.appendRulesGridBottomSection();
      }
      return this;
    },

      /**
       * Creates the grid
       * @param gridWidget
       * @param gridSizeCalculator
       */
      createGrid: function(gridWidget, gridSizeCalculator) {
          var me = this;
          $.when(gridWidget.build()).done(function(response) {
              me.gridWidgetObject = response;
              // initialize the container and bind the window/grid resize events
              //gridSizeCalculator.init(me.gridWidgetObject.conf.container);
          });
      },

      iconCellTooltip: function(cellData,tooltipContainer) {
      var me = this;
      console.log("in iconCellTooltip");
      console.log(cellData);
      me.imageSrc = me.policyManagementConstants.IMAGE_LOCATION;
      var policyId = cellData.rawData["policy-id"];
      var ruleId = cellData.rowId;
      // working  -- var cuid = cellData.cellId;
      var cuid = cellData.cellId;
      me.errorLevel = cellData.rawData["error-level"];      
     
      me.img = me.policyManagementConstants.IMAGE_LOCATION + me.policyManagementConstants.validation_icon[me.errorLevel].iconImg;
      me.imgText = me.policyManagementConstants.validation_icon[me.errorLevel].imgText;      

      $.ajax({
        url : me.policyManagementConstants.POLICY_URL + me.policyObj.id + me.policyManagementConstants.RULE_DRAFT +"/"+ ruleId + me.policyManagementConstants.RULE_VALIDATION_TOOLTIP + '?cuid=' + cuid,
        type:'GET',
        beforeSend:function(request){
            request.setRequestHeader('Accept', me.policyManagementConstants.RULE_ACCEPT_HEADER);
        },
        success :function(data){
            console.log('Validation message fetched successully');
            var tooltipMsg = "";
            var finalTooltipMsg = "";
            var messageTypes = data.ValidationMessages.messages;

            // retrieve error, warning, and/or info messages
            for (i = 0; i < messageTypes.length; i++) {
              var messages = messageTypes[i];
              if (messages) {
                var errmsgs = messages.message;
                if (errmsgs.length > 0) {
           //       tooltipMsg += "<span><div class='" + me.img + "'/></div>&nbsp&nbsp" + me.imgText + "</span></br></br>";
                  tooltipMsg += "<span><img src='" + me.img + "'/>&nbsp&nbsp" + me.imgText + "</span></br></br>";

                  for (j = 0; j < errmsgs.length; j++) {
                    var key = errmsgs[j].key;
                    var parameters = errmsgs[j].parameters;
                    if (parameters) {
                      if (parameters.length > 0) 
                        tooltipMsg += '<li>' + me.context.getMessage(key, parameters) + '</li>';
                        //tooltipMsg += me.context.getMessage(key, parameters);
                      else 
                          tooltipMsg += '<li>' + me.context.getMessage(key) + '</li>';
                          //tooltipMsg += me.context.getMessage(key);
                    } else {
                      tooltipMsg += '<li>' + me.context.getMessage(key) + '</li>';
                    }
                  }
                }
              }
            }

            finalTooltipMsg = '<span>' + tooltipMsg + '</span>';
            

             var configurationSample = {
                    "position" : 'bottom',
                    "style" : 'topNavigation'
                };
                
                new TooltipWidget({
                "elements": configurationSample,
                "container": tooltipContainer[0],
                "view": finalTooltipMsg
            }).build();



            //renderTooltip(finalTooltipMsg);
        },
        error: function() {
            console.log('Validation message is not fetched successfully');
            //return "";
            //renderTooltip("testing");
        }
      });
    },

      /**
       * Add custom buttons
       * @param customButtons
       */
    addCustomButtons : function(customButtons){
      var me = this, ruleCollection = me.ruleCollection,
          isSameDomainPolicy = ruleCollection.isSameDomainPolicy();

        if (isSameDomainPolicy) {
            if(me.hasRuleGridSaveButton()){
                customButtons.push(createSavePolicyBtn(me));
            }
            if(me.hasRuleGridDiscardButton()){
                customButtons.push(createDiscardPolicyBtn(me));

            }
            if(me.hasRuleGridPublishUpdateButtons()){
                customButtons.push(createPublishPolicyBtn(me));
                customButtons.push(createUpdatePolicyBtn(me));
            }
             customButtons.push(createSharedObjectsMenuDropDown(me));
        }
    },

    //called when the row goes in edit mode. Need to be specified to show the Save,Publish and Update buttons in correct state
    setCustomActionStatus : function(selectedRows, updateStatusSuccess, updateStatusError){
        var me = this;
        me.updateButtonsActionStatus(!me.ruleCollection.isCollectionDirty(), updateStatusSuccess,selectedRows.selectedRows);
    },


    //set the correct status of custom buttons during the initial rendering
    isCustomButtonDisabled: function(key){
      var self = this, ruleCollection = self.ruleCollection,
          disableSave = !ruleCollection.isCollectionDirty();

        if(disableSave){
          //disable the save button
          if(self.customActionKeys.SAVE === key  || self.customActionKeys.DISCARD == key){
            return true;
          }
          if(self.customActionKeys.PUBLISH === key || self.customActionKeys.UPDATE === key){
            return false;
          }
        }else{
          //enable the save button
          if(self.customActionKeys.SAVE === key  || self.customActionKeys.DISCARD == key){
            return false;
          }
          //disable the publish and update buttons
          if(self.customActionKeys.PUBLISH === key || self.customActionKeys.UPDATE === key){
            return true;
          }
        }
    },

    buildActionEvents: function(){
        this.actionEvents = {
            expandAllRules: {
                name: "expandAllRules",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]
            },
            collapseAllRules: {
                name: "collapseAllRules",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]
            }

        };
        //
        if(this.hasNavigationActionButtons()){
            $.extend(this.actionEvents, {
              "navigateToFirstRule":{
                "name": "navigateToFirstRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]          
              }
            }, {
              "navigateToPreviousRule":{
                "name": "navigateToPreviousRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]          
              }
            }, {
              "navigateToNextRule":{
                "name": "navigateToNextRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]          
              }
            }, {
              "navigateToLastRule":{
                "name": "navigateToLastRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_READ]          
              }
            });
        };
        //
        if(this.hasRuleGridActionButtons()){
            $.extend(this.actionEvents,{
              createEvent: {
                  name: "createRules",
                  capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
              },
              updateEvent: {
                  name: "updateRules",
                  capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
              },
              deleteEvent: {
                  name: "deleteRules",
                  capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
              }
            });
        }

        if(this.hasRuleGridSaveButton()){
            $.extend(this.actionEvents,{
                saveRules: {
                    name: "saveRules",
                    capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
                }
            });
        }

        if(this.hasRuleGridDiscardButton()){
            $.extend(this.actionEvents,{
                discardRules: {
                    name: "discardRules",
                    capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
                }
            });
        }

        if(this.hasRuleGridPublishUpdateButtons()){
          
            $.extend(this.actionEvents,{
                publishRules: {
                    name: "publishRules",
                    capabilities: [this.policyManagementConstants.CAPABILITY_PUBLISH]
                },
                updatePublishedRules: {
                    name: "updatePublishedRules",
                    capabilities: [this.policyManagementConstants.CAPABILITY_UPDATE_DEVICE]
                }
            });
        }
        /* bind Action event for shared object menu options 
          option value :  Address, services  */
        var key = this.sharedObjectsMenuDropDownActionEvents();
        $.extend(this.actionEvents, key);

        return this.actionEvents;
    },
    sharedObjectsMenuDropDownActionEvents : function() {
        var key = {} ;  
        /* loop through the objectsViewData to get the option values for 
        shared objects menu 
        objectsViewData : {ADDRESS, SERVICES} */
        $.each(this.objectsViewData, function(index, item) {
            key[item.id] ={ name: item.id } //  address : {name: 'address'}   
           }); 
        return key;
    },

    close: function() {
        this.ruleCollection.resetStore();
        this.$el.trigger("view-close");
        if (this.subscription) {
            this.messageResolver.unsubscribe(this.subscription);
            this.subscription = null;
            this.messageResolver = null;
        }
        if(this.smSSEEventSubscriber){
            this.unSubscribeNotifications();
        }
    },

    getQuickFilters : function(){
      return [{
          "label":this.context.getMessage("show_invalid_rules"),
          "key":"showInvalidRules"
      }];
    },

    /*
      returns the parameters for the search filter
    */
    getSearchFilter : function(tokens){
        console.log("************tokens***********");
        console.log(tokens);
        var me = this,searchFilter = {"FilterParam":{}}, filter = [];

        if(!$.isEmptyObject(tokens)){
            for(var i = 0; i<tokens.length;i++){
                var token = tokens[i];
                if($.isArray(token)){
                    if(token[0].column === "quickFilter"){
                        searchFilter.FilterParam[token[0].value] = true
                    }else{
                        filter.push(me.formatSearchString(token));
                    }
                }else{
                    if(!me.isOperator(token)){
                        filter.push(token);
                    }
                }
            }
        }

        searchFilter.FilterParam["filters"] = filter;
//        console.log("filter is " + searchFilter);
        return searchFilter;
    },

    isOperator: function(token){
        var operators = ["AND", "OR"];
        if(operators.indexOf(token) !== -1){
            return true;
        }
        return false;
    },

    /* Formats the search string
      can be overridden in child class if needed
    */
    formatSearchString: function(token){
        var me = this, column = token[0].column, filterVal = "";
        for(var i = 0; i<token.length;i++){
            var searchToken = token[i];
            if(!me.isOperator(searchToken))
            filterVal!== "" ? filterVal += ", " + searchToken.value : filterVal = searchToken.value;
        }
      token = column +  ": ( " + filterVal + " )";
      return token;
    },
    generateCellTooltips: function (ruleGridConfiguration) {
    
      var me = this, tooltipHandlers = {};
      $.each(ruleGridConfiguration.columns, function (index, column) {
        var tooltip, renderer;
        if(column.cellTooltip) {
            if(column.cellTooltip.renderer) {
              tooltipHandlers[column.name] = function(cellData, renderTooltip) {
                renderer = new column.cellTooltip.renderer({ObjId:cellData.cellId, callback:renderTooltip});
                renderer.render();
              };
            } else if (column.cellTooltip.value) {
              tooltipHandlers[column.name] = column.cellTooltip.value;
            }
        } else {
          tooltipHandlers[column.name] = function(cellData, renderTooltip) {
            tooltip = me.getColumnTooltip(cellData.rowId, cellData.columnName);

            if(tooltip) {
              renderTooltip(tooltip);
            }
          };
        }
      });
      me.tooltipHandlers = tooltipHandlers;
    },

    

    /**
     *  Returns object tooltip for name, source address, destination address, and service
     */
    cellTooltip: function(cellData, renderTooltip){
     
      var me  = this;
      me.tooltipHandlers[cellData.columnName](cellData, renderTooltip);

    },
    

    getTooltip : function (text) {
      var formattedValue = "<span>";
      if(!text) return "";
      formattedValue += text;
      formattedValue += "</span>";
      return formattedValue;
    },
    getCustomColumnTooltip : function (rowId, columnId) {
      
      var me = this, value= '';
      var ruleModel = me.ruleCollection.get(rowId);
      var customColData = ruleModel.get('custom-column-data');
      if (customColData) {
        value = JSON.parse(customColData)[columnId];
      }
      if(_.isEmpty(value)) {
        value = "";
      }
      return me.getTooltip(value);
    },
    getColumnTooltip : function(rowId,column) {
       
       var me = this, ruleModel = me.ruleCollection.get(rowId), text = ruleModel.get(column);
       if(!ruleModel.get(column)) text = "";
       return me.getTooltip(text);
    },

    

    getIconsColumnPosition: function() {
      var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), iCol,
          l = cm.length;

      for (iCol = 0; iCol < l; iCol++) {
        if (cm[iCol].name === "icons") {
          return iCol;
        }
      }
    },

    getNameColumnPosition: function() {
      var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), iCol,
          l = cm.length;

      for (iCol = 0; iCol < l; iCol++) {
        if (cm[iCol].name === "name") {
          return iCol;
        }
      }
    },

    getNumberTableColumns: function() {
      var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), l = cm.length;
      return l;
    },

    formatRulesGrid: function() {
      var me = this, $this = me.getGridTable(), iCol = me.getTreeColumnPosition(), iconsCol = me.getIconsColumnPosition(), nameCol = me.getNameColumnPosition();
      
      $this.each(function () {
        var $t = this, rows = $t.rows;
        var ruleLevelBefore = 0;
        var ruleTypeBefore = "RULEGROUP";
        $.each(rows, function (index, row) {

          var nameCell = row.cells[iCol], treeClickDiv;
          var iconsCell = row.cells[iconsCol];
          var groupNameCell = row.cells[nameCol], serialNumberCell;

          $(nameCell).css("padding-left", "8px");

          var rowObject = me.ruleCollection.get(row.id);
          if (rowObject) {
            var rule_level = rowObject.get("rule-level");
            var rule_type = rowObject.get("rule-type");

            // set grid line color for rules
            if (rule_type == "RULE" && rule_level == 1) {
              if (rule_level == ruleLevelBefore && rule_type == ruleTypeBefore) {
                // set color for Zone and Global rules
                $(row).css("border-top", "solid #e9e9e9 1px");
              }
            } else if (rule_type == "RULE" && rule_level > 1) {
              if (rule_level == ruleLevelBefore && rule_type == ruleTypeBefore) {
                // set color for all other subgroups
                $(row).css("border-top", "solid #dbdbdb 1px");
              }
            }

            // ********** change grid line size and color according to the visual design spec ********** 
            if (rule_level < ruleLevelBefore ||
                (rule_level == ruleLevelBefore && rule_type != ruleTypeBefore)) {
              $(row).css("border-top", "solid #bbbdc0 1px");

            }
            ruleLevelBefore = rule_level;
            ruleTypeBefore = rule_type;


            // ************* change row background color according to visual design spec ****************
            if (rule_level > 0 &&
                !(rule_level == 1 && rule_type == "RULE")) {
                $(row).addClass("rulegrid-background");
            }

            // ************* align rules/rule groups according to UX design ******************
              // get the hidden checkbox and triangle columns
              var second_col = $(row).children(':first-child').next();

              if (rule_type == "RULE") {

              // align the carat with the expand/collapse arrow
              second_col.css("padding-left", "8px");


              // *********  move vertical bar to right of serial number  *********
              $(nameCell).css("border-right", "1px solid #cccccc");

            }
              // remove right border from all the cases
              second_col.css("border-right", "0px");
          }

          // check for rule group row
          if (nameCell) {
            treeClickDiv = $(nameCell).find("div.treeclick");
            if (treeClickDiv === undefined || treeClickDiv.length === 0) {
              return;
            }
            $(row.cells[5]).addClass('row_draggable');

            // *********** change color of grid line for rule group ****************
            $(row).css("border-top", "solid #c6c4c4 1px");

            // *********** hide name for rule group row **************
            $(groupNameCell).html("");

            // *********** hide checkbox and triangle on Zone and Global group row to move it to the left of the grid ************
            // *********** only hide checkbox for subgroups

           

            var treeParent = treeClickDiv.closest('tr');

            /* remove the class that apply the cell highlight at the rule group level while drag and drop event triggererd */ 
                 
            treeParent.children('td[class*=_droppable]').removeClass();
            // hide checkbox
            if (rule_level == 0) {
              treeParent.children(':first-child').html('');
            }

            // hide triangle
            treeParent.children(':first-child').next().html('');

            $(iconsCell).html('');

            treeParent.addClass('removeRowHover');

          }

        });
      });
    },
    /**
     * Returns true if the Rules ILP also has the top section.
     * Currently used for showing last edit time
     * @returns {boolean}
     */
      hasRuleGridTopSection: function(){
          return true;
      },

      /**
       * Returns true if the Rules ILP also has the bottom section.
       * @returns {boolean}
       */
      hasRuleGridBottomSection: function(){
        return false;
      },

      /**
       * Returns true if the Rules ILP has Rules Editors.
       * @returns {boolean}
       */
      hasRuleGridEditors: function(){
        return true;
      },

       /**
        * Returns true if the Rules ILP has context menu.
        * @returns {boolean}
        */
       hasRuleGridContextMenu: function(){
         return true;
       },
        hasNavigationActionButtons: function(){
          return false;
        },
       /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if actions buttons are to be hidden
        * @returns {boolean}
        */
        hasRuleGridActionButtons: function(){
         var ruleCollection = this.ruleCollection;
            return ruleCollection.isSameDomainPolicy();
        },

        /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if button buttons has to be hidden
        * @returns {boolean}
        */
        hasRuleGridSaveButton: function(){
            return false;
        },


        /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if button buttons has to be hidden
        * @returns {boolean}
        */
        hasRuleGridDiscardButton: function(){
            return false;
        },



        /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if publish and update buttons are to be hidden
        * @returns {boolean}
        */
        hasRuleGridPublishUpdateButtons: function(){
            return false;
        },

       /**
       * Returns true if the Rules Page has tooltips.
       * @returns {boolean}
       */
       hasToolTips: function(){
           return true;
       },

       getRuleGridQuickFilters: function() {
          var filter = {
            quickFilters: this.getQuickFilters()
          };
          return filter;
       },

      /*
       * It appends Rule grid top section.
       */
      appendRulesGridTopSection: function () {
          var me = this, topSection;


          //TODO pass the editMsg text when UX confirms the text to be shown;
          topSection = Slipstream.SDK.Renderer.render(GridTopSectionTemplate,
            {
              policyName: me.policyObj.name + " / " + me.context.getMessage("rules"),
              ruleEditMsg: "",
              save: me.context.getMessage("action_save"),
              publish: me.context.getMessage("publish_context_menu_title")
            });
          me.$el.append(topSection);
      },

      /**
       * No ILP bottom section used.
       * Will be overridden in the child class if required
       */
      appendRulesGridBottomSection: function() {
           return;
      },



    handleSavePolicy : function(){
      console.log("Save policy clicked");
      this.$el.trigger("savePolicy", "");
    },

    handlePublishPolicy : function(){
          console.log("Save policy clicked");
          this.$el.trigger("publishPolicy", "");
    },

    /**
     * gets the position of the tree column from column model
     * @returns {number}
     */
    getTreeColumnPosition: function() {
      var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), iCol,
          l = cm.length;

      for (iCol = 0; iCol < l; iCol++) {
        if (cm[iCol].name === "serial-number") {
          return iCol;
        }
      }
    },

    /**
     * returns the gridTable object
     *
     * @returns {*}
     */
    getGridTable: function() {
      return this.$el.find("#ruleGrid");
    },

    /**
     * method to add tree view rendering to the view if tree configuration is provided
     *
     */
    addTreeViewRendering: function() {
      var me = this, $this = me.getGridTable(), iCol = me.getTreeColumnPosition();
      $this.each(function () {
        var $t = this, rows = $t.rows;
        // var ruleLevelBefore = 0;
        // var ruleTypeBefore = "RULEGROUP";
        $.each(rows, function (index, row) {

          var nameCell = row.cells[iCol], treeClickDiv, treeRowEl;
          var rowObject = me.ruleCollection.get(row.id);
          if(rowObject && rowObject.get("change-type")){
              var changeType = rowObject.get("change-type"),
                  backGroundColor = $(row).css("background-color");
              if(changeType === "ADD"){
                  backGroundColor = "#B6C0AE";
              }else if(changeType === "DELETE"){
                  backGroundColor = "#FADBDB";
              }else if(changeType === "MODIFY"){
                  backGroundColor = "#EEEEEE";
              };
              $(row).css("background-color", backGroundColor);
          }; 
          // check for rule group row
          if (nameCell) {
            treeClickDiv = $(nameCell).find("div.treeclick");
            if (treeClickDiv === undefined || treeClickDiv.length === 0) {
              return;
            }

              // adding click event on the table clumn name data for expand/collapse of the child rows
              treeRowEl= $(nameCell).find("div.rule-group-node");
              treeRowEl.unbind("click");
              treeRowEl.bind("click", function (e) {
              var dataIDs = me.getDataIds($this),
                  dataID = dataIDs[index-1], //putting index to previous node as the table has header but data ID list does not have
                  rowObject = me.ruleCollection.get(dataID),
                  isExpanded = rowObject.isExpanded(),
                  isLeaf = !rowObject.isRuleGroup();

              if (!isLeaf) {
                if (isExpanded) {
                  $(this).trigger('treegridnodecollapse', rowObject);

                } else {
                  $(this).trigger('treegridnodeexpand', rowObject);
                }
              }
              return false;
            });
          }
        });
      });
    },

      getDataIds: function(el) {
          return el.getDataIDs();
      },


      /*
       * Enable/Disable the Save, Publish and Update buttons based on flag if specified or will use the rule collection dirty flag
       */
      updateButtonsActionStatus :function(disableFlag, updateStatusSuccess, selectedRows){
          var me = this, disableSave = disableFlag !== undefined ? disableFlag : !me.ruleCollection.isCollectionDirty(),
              actionStatus= {};
          console.log("disableSave flag " + disableSave);

          var me = this, actionStatus = {};

          actionStatus[me.customActionKeys.SAVE] = !disableSave;
          actionStatus[me.customActionKeys.DISCARD] = !disableSave;
          actionStatus[me.customActionKeys.PUBLISH] = disableSave;
          actionStatus[me.customActionKeys.UPDATE] = disableSave;

          actionStatus["create"] =  !me.ruleCollection.isPolicyReadOnly();
          actionStatus["edit"] = me.isEnableEditButton(selectedRows) && !me.ruleCollection.isPolicyReadOnly();
          actionStatus["delete"] = me.isEnableDeleteButton(selectedRows) && !me.ruleCollection.isPolicyReadOnly();

          actionStatus["expandAllRules"] = actionStatus["collapseAllRules"] = true;

          if (updateStatusSuccess){
              updateStatusSuccess(actionStatus) ;
          } else {
              me.gridWidgetObject.updateActionStatus(actionStatus);
          }
      },


      /*
       returns the save policy button
       */

      findSavePolicyBtn: function () {
          return this.$el.find("#saveRules_button");
      },

      /*
       returns the discard policy button
       */

      findDiscardPolicyBtn: function () {
          return this.$el.find("#discardRules_button");
      },


      /*
       returns the publish policy button
       */

      findPublishPolicyBtn: function () {
          return this.$el.find("#publishRules_button");
      },

      /*
       returns the update policy button
       */

      findUpdatePolicyBtn: function () {
          return this.$el.find("#updatePublishedRules_button");
      },

      /**
       * returns if the edit button need to be enabled or not
       */
      isEnableEditButton : function(selectedRows){
          return this.state.isPredefinedSelected !== true;
      },

      /**
       * returns if the delete button need to be enabled or not
       */
      isEnableDeleteButton : function(selectedRows){
          return this.state.isPredefinedSelected !== true;
      },

      /**
       * Returns the SID for the policy
       * @returns {string} sid
       */
      getSID: function() {
          return;
      },

      /**
       * Launch Export rules to PDF action
       * @param selectedItems
       */
      exportRulesToPDF: function (selectedItems) {
          var self = this, exportView = new ExportView({
              'close': function (e) {
                  exportView.destroy();
                  e && e.preventDefault();
              },
              'context': self.context,
              params: {
                  selectedPolicy: [self.policyObj],
                  fileType: 'PDF_FORMAT',
                  policyManagementConstants:self.policyManagementConstants,
                  filter: self.filterApplied

              }
          })

      }


  });

  return RulesView;
});
