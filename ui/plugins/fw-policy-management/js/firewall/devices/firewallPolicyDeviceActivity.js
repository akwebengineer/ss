/**
 * Module that implements the FirewallPolicyDeviceActivity
 *
 * @module FirewallPolicyDeviceActivity
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../base-policy-management/js/policy-management/devices/basePolicyDeviceActivity.js',
    './conf/firewallPolicyDeviceGridConfiguration.js',
    './views/firewallPolicyDeviceGridView.js',
    './constants/firewallPolicyDeviceConstants.js',
    './controller/firewallPolicyDeviceRuleController.js'
], function(BasePolicyDeviceActivity, GridConfiguration, FWPolicyDeviceGridView, FWPolicyDeviceConstants, FirewallPolicyDeviceRulesController) {
    /**
     * Construct a FirewallPolicyDeviceActivity
     */

    var FirewallPolicyDeviceActivity = function() {
        BasePolicyDeviceActivity.call(this);
        this.controller = FirewallPolicyDeviceRulesController;

        this.getView = function () {
            var gridConf = new GridConfiguration(this.getContext(),FWPolicyDeviceConstants);
            this.view = new FWPolicyDeviceGridView({
                conf: gridConf.getDeviceGridConfiguration(),
                context: this.getContext(),
                activity: this
            });
            return this.view;
        };
    };

    FirewallPolicyDeviceActivity.prototype = Object.create(BasePolicyDeviceActivity.prototype);
    FirewallPolicyDeviceActivity.prototype.constructor = FirewallPolicyDeviceActivity;

    return FirewallPolicyDeviceActivity;
});