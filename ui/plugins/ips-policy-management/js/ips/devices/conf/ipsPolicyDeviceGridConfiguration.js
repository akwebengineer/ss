/**
 * A configuration object with the parameters required to build a Grid widget for devices having IPS policies
 *
 * @module IPSPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../../policies/templates/ipsPolicy.html',  
        '../../../../../base-policy-management/js/policy-management/devices/conf/basePolicyDeviceGridConfiguration.js'
    ], function (policyTemplate, BasePolicyDeviceGridConfiguration) {

    var IPSPolicyDeviceGridConfiguration = function (context,policyManagementConstants) {
        this.initialize(context, policyManagementConstants);
    }

    _.extend(IPSPolicyDeviceGridConfiguration.prototype, BasePolicyDeviceGridConfiguration.prototype, {
        tableId: 'ips_policies_grid',
        gridTitleString: "ips_deviceGrid_title",
        gridTitleHelpContentString: "ips_deviceGrid_title_tooltip",
        gridUAHelp: "IPS_POLICY_DEVICE_MAIN_PAGE_FIELD",
        linkToRules : function (cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(policyTemplate, {"policyId": rowObject.id, "cellValue": cellValue});
        }
    });

    return IPSPolicyDeviceGridConfiguration;
});