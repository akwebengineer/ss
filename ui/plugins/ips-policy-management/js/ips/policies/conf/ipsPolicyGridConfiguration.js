/**
 * A configuration object with the parameters required to build a Grid widget for ips policies
 *
 * @module ipsConfiguration
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../templates/ipsPolicy.html',
        '../../../../../base-policy-management/js/policy-management/policies/conf/basePolicyGridConfiguration.js'
    ], function (policyTemplate,BasePolicyGridConfiguration) {
            var ipsConfiguration = function (context,collection,policyManagementConstants) {
        this.initialize(context,collection,policyManagementConstants);
    }

    _.extend(ipsConfiguration.prototype, BasePolicyGridConfiguration.prototype, {

        tableId: 'ips_policies',
        gridTitleString: "ips_policyGrid_title",
        policyTemplate : policyTemplate,
        gridTitleHelp:"ips_policyGrid_title_help",
        gridUAHelp: "IPS_POLICY_CREATING",

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
                        title: context.getMessage('ips_policy_delete_title'),
                        question: context.getMessage('ips_policy_delete_msg')
                    }
                };
            return confirmationDialog;
        },
        //Overriding Context menus to remove 'Update Source ID option' as its not applicable for IPS
        getContextMenu: function () {
          var me = this, context = this.context, collection = this.collection;
          var policyContextMenuItems = BasePolicyGridConfiguration.prototype.getContextMenu.apply(me);
          ipsPolicyContextMenuItems = policyContextMenuItems;
          var ipsPolicyCustomContextMenuItems= _.reject(policyContextMenuItems.custom, function(el) { 
            return (el.key === "refreshDevicesEvent" || el.key === "comparePolicyEvent") ; 
          });

          ipsPolicyContextMenuItems.custom = ipsPolicyCustomContextMenuItems;
          return ipsPolicyContextMenuItems;
        }     
    });

    return ipsConfiguration;
});