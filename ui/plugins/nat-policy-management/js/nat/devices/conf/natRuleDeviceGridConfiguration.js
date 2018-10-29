/**
 * A configuration object with the parameters required to build a Grid widget for devices having NAT policies
 *
 * @module NATPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([  
        '../../rules/conf/natRulesGridConfiguration.js'
    ], function (NATRulesConfiguration) {

    var NATRuleDeviceGridConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
      this.initialize(context, ruleCollection, policyManagementConstants, policyObj);
    }

    _.extend(NATRuleDeviceGridConfiguration.prototype, NATRulesConfiguration.prototype, {
        //defined by each grid
        tableId: 'natDeviceRuleGrid',
        getAddressDndConfig : function () {
          return undefined;
        },
        getServiceDndConfig : function () {
          return undefined;
        },
        getTranslatedPacketDestinationDndConfig : function () {
          return undefined;
        },
        getTranslatedPacketSourceDndConfig : function  () {
          return undefined;
        }
    });

    return NATRuleDeviceGridConfiguration;
});