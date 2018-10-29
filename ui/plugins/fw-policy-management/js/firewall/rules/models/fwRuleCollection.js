/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection
 * @author mbetala
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleCollection.js',
  './fwRuleModel.js',
  '../constants/fwRuleGridConstants.js'
], function (BaseCollection, RuleModel, PolicyManagementConstants) {

  /**
   * FirewallRules Collection definition.
   */
  var RuleCollection = BaseCollection.extend({
    model: RuleModel,

    policyManagementConstants: PolicyManagementConstants,
    /**
     *
     * @param selectedRuleID
     * @param direction
     */
    addRule: function(selectedRuleID, direction) {
      var me = this, ruleAddInfo = {
            ruleAddInfo: {
              direction: direction,
              type: "ZONE",
              referenceRuleID: selectedRuleID
            }
          },
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "createAction"
          }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_ADD,
            success: function (model, response, options) {
              me.setCollectionDirty(true);
              console.log(arguments);
              me.highlightRule("afterCreateRule",{ruleIds : [model["firewall-rule"][me.policyManagementConstants.JSON_ID]], isRowEditable: true});
            },
            error: function (model, response, options) {
              //UtilityClass.showErrorDialogue(firewallPolicyObject.name, actionObject.action, response, self);
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(ruleAddInfo), options);
    },

    reloadHitCount: function() {
      var me = this,
      actionObject = {
        successCounter: 0,
        errorCounter: 0,
        totalNumber: 1,
        action: "reloadHitCount"
      }, options = {
        url: me.url() + me.policyManagementConstants.RELOAD_HIT_COUNT,
        success: function (model, response, options) {
          me.trigger('refresh-page', {}, true, true);
        },
        error: function (model, response, options) {
          //UtilityClass.showErrorDialogue(firewallPolicyObject.name, actionObject.action, response, self);
          ++(actionObject.errorCounter);
        }
      };
      me.sync("create", new me.model(""), options);
    },

    getNewRule: function(){
      var me = this;
      $.ajax({
        url: me.url() + me.policyManagementConstants.NEW + "?cuid=" + me.cuid,
        type: 'GET',
        headers: {
          Accept: me.policyManagementConstants.RULE_ACCEPT_HEADER
        },
        success: function (data) {
          console.log(arguments);
          var model = new RuleModel(data["firewall-rule"]);
          me.trigger("newRuleFetched", model) ;
        },
        error: function () {
          console.log("call to fetch policy in base rule collection failed");
        }
      });
    },

    saveNewRule:function(data){
      var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "saveNewRule"
          }, options = {
          url: me.url() + me.policyManagementConstants.RULE_DRAFT,
          success: function (model, response, options) {
            me.setCollectionDirty(true);
            me.highlightRule("afterCreateRule",{ruleIds: [model["firewall-rule"]["id"]], isRowEditable: false});
          },
          error: function (model, response, options) {
            //UtilityClass.showErrorDialogue(firewallPolicyObject.name, actionObject.action, response, self);
            ++(actionObject.errorCounter);
          }
        };
        me.sync("create", new me.model({"firewall-rule":data}), options);
    },

    showEvents: function(ruleIds) {
      var me = this, 
          rule = me.get(ruleIds),
          srcZone = rule.get('source-zone').zone,
          destZone = rule.get('destination-zone').zone;

      var ruleName = rule.get('name');
      //Appending (global) if rules are global
      ruleName = rule.get('global-rule') ? ruleName+"(global)" : ruleName;

      //Filter Creation for policy name and event category
      var filterObj  =  {
        and : [{
              filter : {
                key: "policy-name",
                operator: "EQUALS",
                value: ruleName
            }
          },{
              filter : {
                key: "event-category",
                operator: "EQUALS",
                value: "firewall"
            }
          }
        ]
      };

      return BaseCollection.prototype.showEvents.call(this, {
        srcZone: srcZone,
        destZone: destZone,
        filterObj: filterObj
      });
    }
  });

  return RuleCollection;
});

