/**
 * Module that implements the IPSPolicyDeviceActivity
 *
 * @module IPSPolicyDeviceActivity
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../base-policy-management/js/policy-management/devices/basePolicyDeviceActivity.js',
    './conf/ipsPolicyDeviceGridConfiguration.js', 
    './views/ipsPolicyDeviceGridView.js',
    './constants/ipsPolicyDeviceConstants.js',
    './controller/ipsPolicyDeviceRuleController.js'
], function(BasePolicyDeviceActivity, GridConfiguration, IPSPolicyDeviceGridView, IPSPolicyDeviceConstants, IPSPolicyDeviceRulesController) {
    /**
     * Construct a IPSPolicyDeviceActivity
     */

    var IPSPolicyDeviceActivity = function() {
        BasePolicyDeviceActivity.call(this);
        this.controller = IPSPolicyDeviceRulesController;

        this.getView = function () {
            var gridConf = new GridConfiguration(this.getContext(),IPSPolicyDeviceConstants);
            this.view = new IPSPolicyDeviceGridView({
                conf: gridConf.getDeviceGridConfiguration(),
                context: this.getContext()
            });
            return this.view;
        };
    };

    IPSPolicyDeviceActivity.prototype = Object.create(BasePolicyDeviceActivity.prototype);
    IPSPolicyDeviceActivity.prototype.constructor = IPSPolicyDeviceActivity;

    return IPSPolicyDeviceActivity;
});