/**
 * A view to manage firewall policy rules
 *
 * @module RulesView
 * @author vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/views/fwRulesView.js',
  '../conf/firewallRuleDeviceGridConfiguration.js',
  'text!../../../../../base-policy-management/js/policy-management/devices/templates/deviceRuleGridTopSection.html',
  '../constants/firewallPolicyDeviceConstants.js'
], function (FirewallRulesView, FirewallRuleGridConf, DeviceRuleGridTopSectionTemplate, PolicyManagementConstants) {

  var FWRuleDeviceView = FirewallRulesView.extend({

    /**
     * Override Rule grid top section.
     */
    appendRulesGridTopSection: function () {
        var me = this, topSection;
        topSection = Slipstream.SDK.Renderer.render(DeviceRuleGridTopSectionTemplate, {policyName: me.policyObj.name});
        me.$el.append(topSection);
    },

    getRuleGridConfiguration: function() {
      var me = this;
      me.fwRuleGridConf = new FirewallRuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj);
      return me.fwRuleGridConf.getConfiguration();
    },

    getGridTable: function() {
      return this.$el.find("#firewallDeviceRuleGrid");
    },

    /**
    * Returns true if the Rules ILP has action buttons.
    * Sub classes can override if actions buttons are to be hidden
    * @returns {boolean}
    */
    hasRuleGridActionButtons: function(){
        return false;
    },
    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridSaveButton: function(){
        return false;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridDiscardButton: function(){
        return false;
    },
    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridPublishUpdateButtons: function(){
        return false;
    },

    hasRuleGridEditors: function(){
        return false;
    },

    hasRuleGridContextMenu: function(){
      return false;
    },

    getRuleGridQuickFilters: function() {
      return false;
    }
  });

  return FWRuleDeviceView;
});