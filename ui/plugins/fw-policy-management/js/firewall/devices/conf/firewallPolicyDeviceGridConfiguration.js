/**
 * A configuration object with the parameters required to build a Grid widget for devices having firewall policies
 *
 * @module firewallPolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../../policies/templates/firewallPolicy.html',  
        '../../../../../base-policy-management/js/policy-management/devices/conf/basePolicyDeviceGridConfiguration.js',
    '../../../../../ui-common/js/common/utils/SmUtil.js'
    ], function (policyTemplate, BasePolicyDeviceGridConfiguration, SMUtil) {

    var fwPolicyDeviceGridConfiguration = function (context,policyManagementConstants) {
        this.initialize(context, policyManagementConstants);
    };

    _.extend(fwPolicyDeviceGridConfiguration.prototype, BasePolicyDeviceGridConfiguration.prototype, {
        tableId: 'fw_devices_policies_grid',
        gridTitleString: "fw_deviceGrid_title",
        gridTitleHelpContentString: "fw_deviceGrid_title_tooltip",
        gridUAHelp: "FIREWALL_POLICY_DEVICE_MAIN_PAGE_FIELDS",
        singleselect: true,
        linkToRules : function (cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(policyTemplate, {"policyId": rowObject.id, "cellValue": cellValue});
        },

        //Features can override the same to return their desired buttons
        getActionButtons : function() {
            var customButtons = [], actionButtons;

            // add this button only if in debug mode
            // This will launch the view to check the TMP change list
            if (new SMUtil().isDebugMode()) {
                customButtons = [
                    {
                        "button_type": true,
                        "label": 'Changes',
                        "key": "changeList",
                        "disabledStatus": true,
                        "secondary": true
                    }
                ];
            }

            actionButtons = {
                "defaultButtons": { // overwrite default CRUD grid buttons
                },
                "customButtons": customButtons,
                "actionStatusCallback":  function (selectedRows, updateStatusSuccess) {
                    updateStatusSuccess({
                        "changeList": selectedRows.numberOfSelectedRows === 1 ? true : false
                    });
                }
            };
            return actionButtons;
        }
    });

    return fwPolicyDeviceGridConfiguration;
});