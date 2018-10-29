/**
 * A configuration object with the parameters required to build a Grid widget for devices having NAT policies
 *
 * @module NATPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../../nat-policies/templates/natPolicy.html',
        '../../../../../base-policy-management/js/policy-management/devices/conf/basePolicyDeviceGridConfiguration.js'
    ], function (policyTemplate, BasePolicyDeviceGridConfiguration) {

    var NATPolicyDeviceGridConfiguration = function (context,policyManagementConstants) {
        this.initialize(context, policyManagementConstants);
    }

    _.extend(NATPolicyDeviceGridConfiguration.prototype, BasePolicyDeviceGridConfiguration.prototype, {
        tableId: 'nat_devices_policies_grid',
        gridTitleString: "nat_deviceGrid_title",
        gridTitleHelpContentString: "nat_deviceGrid_title_tooltip",
        gridUAHelp: "NAT_POLICY_DEVICE_USING",
        linkToRules : function (cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(policyTemplate, {"policyId": rowObject.id, "cellValue": cellValue});
        }
    });

    return NATPolicyDeviceGridConfiguration;
});