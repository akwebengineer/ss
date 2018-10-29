/**
 * A Backbone Collection to be used by the App firewall rule grid.
 */

define([
    '../../../../../../base-policy-management/js/policy-management/rules/models/baseRuleCollection.js',
    './AppFwRuleModel.js',
    '../../AppFwConstants.js'
], function (BaseCollection, AppFwRuleModel, AppFwConstants) {

    /**
     * Application Firewall Rules Collection definition.
     */
    var AppFwRuleCollection = BaseCollection.extend({
        model: AppFwRuleModel,

        policyManagementConstants: AppFwConstants,


      addNewRule: function(newRule, successCallback, errorCallback) {
        var me = this, options = {
          url: me.url() +  AppFwConstants.RULE_DRAFT,
          success: successCallback,
          error: errorCallback
        };
        me.sync("create", newRule, options);
      },

        /**
         *
         * @param selectedRuleID
         * @param direction
         * TODO : define implementation and verify
         */
        addRule: function (selectedRuleID, direction) {
            var me = this, ruleAddInfo = {
                    ruleAddInfo: {
                        direction: direction,
                        referenceRuleID: selectedRuleID
                    }
                },
                actionObject = {
                    successCounter: 0,
                    errorCounter: 0,
                    totalNumber: 1,
                    action: "createAction"
                }, options = {
                    url: me.url() + AppFwConstants.RULE_DRAFT_ADD,
                    success: function () {
                        me.setCollectionDirty(true);
                        console.log(arguments);
                        me.trigger('refresh-page', {
                        });
                    },
                    error: function () {
                        ++(actionObject.errorCounter);
                    }
                };
            me.sync("create", new me.model(ruleAddInfo), options);
        },
        /**
         * [modifyRuleGroup @overriden]
         * @param  {[string]} ruleId      [description]
         * @param  {[string]} name        [description]
         * @param  {[string]} description [description]
         *
         * reason to override update jsonRoot for rule group modify
         */
        modifyRuleGroup: function(ruleId, name, description) {
            var me = this,
                rule = me.get(ruleId);

            rule.set("name", name);
            rule.jsonRoot = "app-fw-rule";
            rule.set("description", description);
            me.modifyRule(rule);
            me.setCollectionDirty(true);
            me.trigger("ruleGroupModified");
        },

        /**
         * Handling modify rule action
         * @param ruleData
         * @param successCallback
         * @param errorCallback
         */
        modifyRule: function (ruleData, successCallback, errorCallback) {

            var me = this, ruleObject = {
                "modify-changelist-request": {
                    "modified-rules": ruleData
                }
            }, options = {
                url: me.url() + me.policyManagementConstants.RULE_DRAFT_MODIFY,
                success: successCallback,
                error: errorCallback
            };
            me.sync("create", new me.model(ruleObject), options);
        },

        /**
         * Handling delete rule action
         * @param ruleIDs
         */
        deleteRule: function(ruleIDs) {
            var me = this,
                deletedRules = {
                    "modify-changelist-request": {
                        "deleted-rules": {
                            "deleted-rule": ruleIDs
                        }
                    }
                };
            me.updateRuleToStore(deletedRules, "deleteAction");
        },

        hasSaveCommnets : function(){
          return false;
        }

    });

    return AppFwRuleCollection;
});

