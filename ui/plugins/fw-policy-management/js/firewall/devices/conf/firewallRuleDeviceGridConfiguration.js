/**
 * A configuration object with the parameters required to build a Grid widget for devices having firewall policies
 *
 * @module firewallPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/conf/fwRulesGridConfiguration.js'
], function (firewallRulesConfiguration) {

  var fwRuleDeviceGridConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
    this.initialize(context, ruleCollection, policyManagementConstants, policyObj);
  }

  _.extend(fwRuleDeviceGridConfiguration.prototype, firewallRulesConfiguration.prototype, {
    getAddressDndConfig : function () {
      return undefined;
    },
    getServiceDndConfig : function () {
      return undefined;
    },
    getZoneDndConfig : function () {
      return undefined;
    },
    //defined by each grid
    tableId: 'firewallDeviceRuleGrid',

    contextMenu: {
//            "delete": context.getMessage('rulesGrid_contextMenu_delete')          
    }, //required to hide more menu

    isDevicePolicy: function () {
      return true;
    }
  });

  return fwRuleDeviceGridConfiguration;
});