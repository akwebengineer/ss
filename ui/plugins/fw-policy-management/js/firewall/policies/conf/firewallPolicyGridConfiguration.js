/**
 * A configuration object with the parameters required to build a Grid widget for firewall policies
 *
 * @module firewallConfiguration
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../templates/firewallPolicy.html',
  '../constants/fwPolicyManagementConstants.js',
  '../../../../../base-policy-management/js/policy-management/policies/conf/basePolicyGridConfiguration.js'
], function (policyTemplate,FWPolicyManagementConstants,BasePolicyGridConfiguration) {

  var fwPolicyGridConfiguration = function (context,collection,policyManagementConstants) {
    this.initialize(context,collection,policyManagementConstants);
  };

  _.extend(fwPolicyGridConfiguration.prototype, BasePolicyGridConfiguration.prototype, {

    tableId: 'fw_policies_grid',
    gridTitleString: "fw_policyGrid_title",
    policyTemplate : policyTemplate,
    gridTitleHelp:"fw_policyGrid_title_help",
    gridUAHelp: "FIREWALL_POLICY_CREATING",

    getConfirmationDialog : function() {
      var context = this.context;
      var confirmationDialog = {
        "delete": {
          title: context.getMessage('firewall_policy_delete_title'),
          question: context.getMessage('firewall_policy_delete_msg')
        }
      };
      return confirmationDialog;
    },

    formatRuleCountCell : function(cellValue, options, rowObject) {
      var me = this, cellText = "", rbacResolver;

      if (me.isGroupNode(rowObject)) {
        return "";
      }
      if (cellValue && cellValue !== 0) {
        cellText = cellValue;
      } else {
        if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
          rbacResolver = new Slipstream.SDK.RBACResolver();
          var policy = me.collection.get(rowObject["id"]);

          if (rbacResolver.verifyAccess(["ModifyPolicy"]) && !policy.isDifferentDomainPolicy()) {
            cellText = me.context.getMessage("addRule");
          }
        }
      }

      return Slipstream.SDK.Renderer.render(me.policyTemplate, {"policyId": rowObject.id,
        "cellValue": cellText,
        "id":"ruleLink",
        "launchWizard": cellValue && cellValue !== 0 ? false: true});
    },


    //Features can override the same to return their desired menus
    getContextMenu : function() {
      var context = this.context, me = this,
      menuItemEnablehandler = $.proxy(function(eventName, selectedItems) {
        return !Juniper.sm.DomainProvider.isInGlobalDomain();
      },me),
      contextMenu = BasePolicyGridConfiguration.prototype.getContextMenu.call(this);
      contextMenu.custom.splice(5, 0,
          {
            label: context.getMessage('sm.services.custom_column.menu'),
            key: 'customColumnBuilderEvent',
            "isDisabled": menuItemEnablehandler
          },
          {
            "label": context.getMessage('generate_policy_analysis_report'),
            "key":"previewPDFEvent",
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length === 0 || selectedItems.length > 1) {
                return true;
              }
              var policy = me.collection.get(selectedItems[0]["id"]);
              return (!policy.get('rule-count')) || policy.get('rule-count') === 0;
            },me)
          },
          {
            label: context.getMessage('device_refresh'),
            key: 'refreshDevicesEvent',
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length === 0 || selectedItems.length > 1) {
                return true;
              }
              var policy = me.collection.get(selectedItems[0]["id"]);
              return policy.get('device-count') === 0 || policy.isDifferentDomainPolicy();
            },me)
          },
          {
            label: context.getMessage('reset_policy_hits'),
            key: 'resetPolicyHits',
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length === 0 || selectedItems.length > 1) {
                return true;
              }
              var policy = me.collection.get(selectedItems[0]["id"]);
              return policy.get('device-count') === 0 || policy.isDifferentDomainPolicy();
            },me)
          },
          {
            label: context.getMessage('policy_hits'),
            key: 'latestPolicyHits',
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length === 0 || selectedItems.length > 1) {
                return true;
              }
              var policy = me.collection.get(selectedItems[0]["id"]);
              return policy.get('device-count') === 0;
            },me)
          },{
            label: context.getMessage('promote_group_policy'),
            key: 'promote2GroupEvent',
            "scope": me,
            "isDisabled": $.proxy(function(eventName, selectedItems) {
              if (selectedItems.length == 1 && selectedItems[0]["policy-type"] === "DEVICE") {
                var policy = me.collection.get(selectedItems[0]["id"]);
                return policy.isPolicyLocked() || policy.isDifferentDomainPolicy();
              }
              return true;
            },me)
          }
      );
      return contextMenu;
    }
  });

  return fwPolicyGridConfiguration;
});
