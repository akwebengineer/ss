/*
 IPS Policy templates Rules Grid Custom Context menu
 extends IPS Rule Context Menu Configuration
 */
define([
  '../constants/ipsTemplateRuleGridConstants.js',
  '../../rules/conf/ipsRulesContextMenu.js'
],function(IPSRuleGridConstants, IpsRulesContextMenu){

  var IpsPolicyTemplatesRulesContextMenu = function(context, ruleCollection, policyObj) {
    var me = this;
    policyManagementConstants = IPSRuleGridConstants;
    me.initialize(context, ruleCollection, policyManagementConstants);
    me.policyObj = policyObj;
  };
  _.extend(IpsPolicyTemplatesRulesContextMenu.prototype, IpsRulesContextMenu.prototype, {

    getContextMenuItems: function (state) {
      var me = this, ruleCollection = me.ruleCollection, context = me.context,ipsPolicyTemplateContextMenuItems;
      var ipsRuleContextMenuItems = IpsRulesContextMenu.prototype.getContextMenuItems.apply(me, [state]);
      //For PREDEFINED IPS Policy Templates Rules only copy should be there in context menu.
      if(me.policyObj['definition-type'] == 'PREDEFINED'){
        ipsPolicyTemplateContextMenuItems= _.filter(ipsRuleContextMenuItems, function(el) { return el.key === "copyRule"; });
      }else
      {
        ipsPolicyTemplateContextMenuItems= _.reject(ipsRuleContextMenuItems, function(el) { return el.key === "eventsGenerated"; });
      }
      return ipsPolicyTemplateContextMenuItems;
    }
  });
  return IpsPolicyTemplatesRulesContextMenu;
});

