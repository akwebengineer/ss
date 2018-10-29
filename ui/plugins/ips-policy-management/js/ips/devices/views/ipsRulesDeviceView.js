/**
 * A view to manage IPS policy rules
 *
 * @module RulesView
 * @author vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/views/ipsRulesView.js',
  '../conf/ipsRuleDeviceGridConfiguration.js',
  'text!../../../../../base-policy-management/js/policy-management/devices/templates/deviceRuleGridTopSection.html',
  '../constants/ipsPolicyDeviceConstants.js'
], function (IPSRulesView, IPSRuleGridConf, DeviceRuleGridTopSectionTemplate, PolicyManagementConstants) {

  var IPSRuleDeviceView = IPSRulesView.extend({

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
      me.ipsRuleGridConf = new IPSRuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj);
      return me.ipsRuleGridConf.getConfiguration();
    },

    getGridTable: function() {
      return this.$el.find("#ipsDeviceRuleGrid");
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

  return IPSRuleDeviceView;
});