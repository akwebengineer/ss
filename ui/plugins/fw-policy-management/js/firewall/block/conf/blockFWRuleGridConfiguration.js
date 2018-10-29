/**
 * Rule Grid configuration for Summary page in Block Workflow
 * @module FWBlockRuleGridConfiguration extends FWRuleGridConfiguration
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
*/
define(["../../rules/conf/fwRulesGridConfiguration.js"], function(FWRuleGridConfiguration){

    var FWBlockRuleGridConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
    	var me=this;
        me.initialize(context, ruleCollection, policyManagementConstants, policyObj);
    };
	_.extend(FWBlockRuleGridConfiguration.prototype, FWRuleGridConfiguration.prototype, {
		"showNavigationControls": true
	});
    return FWBlockRuleGridConfiguration;
});