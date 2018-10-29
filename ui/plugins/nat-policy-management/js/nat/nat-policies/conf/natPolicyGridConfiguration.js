/**
 * A configuration object with the parameters required to build a Grid widget for nat policies
 *
 * @module natConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../templates/natPolicy.html',
        '../../../../../base-policy-management/js/policy-management/policies/conf/basePolicyGridConfiguration.js'
    ], function (policyTemplate,BasePolicyGridConfiguration) {

    var natPolicyGridConfiguration = function (context,collection,policyManagementConstants) {
        this.initialize(context,collection,policyManagementConstants);
    };

    _.extend(natPolicyGridConfiguration.prototype, BasePolicyGridConfiguration.prototype, {

        tableId: 'nat_policies_grid',
        gridTitleString: "nat_policyGrid_title",
        policyTemplate : policyTemplate,
        gridTitleHelp : "nat_policyGrid_title_help",
        gridUAHelp: "NAT_POLICY_CREATING",

        formatRuleCountCell : function(cellValue, options, rowObject) {
          var me = this;
          if (me.isGroupNode(rowObject)) {
            return "";
          }
          return Slipstream.SDK.Renderer.render(me.policyTemplate, {"policyId": rowObject.id,
              "cellValue": cellValue?cellValue:0,
              "id":"ruleLink"});
        },

        getConfirmationDialog : function() {
            var context = this.context;
            var confirmationDialog = {
                    "delete": {
                        title: context.getMessage('nat_policy_delete_title'),
                        question: context.getMessage('nat_policy_delete_msg')
                    }
                };
            return confirmationDialog;
        },

        getContextMenu : function() {
          var context = this.context,me = this,
              contextMenu = BasePolicyGridConfiguration.prototype.getContextMenu.call(this);
          contextMenu.custom.splice(5, 0,                 {
            "label": context.getMessage('nat_policy_configure_rule_sets'),
            "key": "configureRuleSetsEvent",
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length == 1) {
                var policy = me.collection.get(selectedItems[0]["id"]);
                return policy.isPolicyLocked() || policy.isDifferentDomainPolicy();
              }
              return true;
            },me)
          });

          return contextMenu;

        }
    });

    return natPolicyGridConfiguration;
});
