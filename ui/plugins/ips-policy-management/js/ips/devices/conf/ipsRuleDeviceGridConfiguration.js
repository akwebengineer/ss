/**
 * A configuration object with the parameters required to build a Grid widget for devices having IPS policies
 *
 * @module IPSPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([  
        '../../rules/conf/ipsRulesGridConfiguration.js'
    ], function (IPSRulesConfiguration) {

    var IPSRuleDeviceGridConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
        this.initialize(context, ruleCollection, policyManagementConstants, policyObj);
    }

    _.extend(IPSRuleDeviceGridConfiguration.prototype, IPSRulesConfiguration.prototype, {
        //defined by each grid
        tableId: 'ipsDeviceRuleGrid'
    });

    return IPSRuleDeviceGridConfiguration;
});