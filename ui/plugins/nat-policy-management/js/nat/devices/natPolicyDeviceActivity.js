/**
 * Module that implements the NATPolicyDeviceActivity
 *
 * @module NATPolicyDeviceActivity
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../base-policy-management/js/policy-management/devices/basePolicyDeviceActivity.js',
    './conf/natPolicyDeviceGridConfiguration.js', 
    './views/natPolicyDeviceGridView.js',
    './constants/natPolicyDeviceConstants.js',
    './controller/natPolicyDeviceRuleController.js'
], function(BasePolicyDeviceActivity, GridConfiguration, NATPolicyDeviceGridView, NATPolicyDeviceConstants, NATPolicyDeviceRulesController) {
    /**
     * Construct a NATPolicyDeviceActivity
     */

    var NATPolicyDeviceActivity = function() {
        BasePolicyDeviceActivity.call(this);
        this.controller = NATPolicyDeviceRulesController;

        this.getView = function () {
            var gridConf = new GridConfiguration(this.getContext(),NATPolicyDeviceConstants);
            this.view = new NATPolicyDeviceGridView({
                conf: gridConf.getDeviceGridConfiguration(),
                context: this.getContext()
            });
            return this.view;
        };
    };

    NATPolicyDeviceActivity.prototype = Object.create(BasePolicyDeviceActivity.prototype);
    NATPolicyDeviceActivity.prototype.constructor = NATPolicyDeviceActivity;

    return NATPolicyDeviceActivity;
});