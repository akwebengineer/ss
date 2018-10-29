/**
 * A view to manage IPS policy - Device page
 *
 * @module DevicesView
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../base-policy-management/js/policy-management/devices/views/basePolicyDeviceGridView.js'
], function (BasePolicyDeviceGridView) {

    var IPSPolicyDeviceView = BasePolicyDeviceGridView.extend({
        getMimeType : function() {
            return 'vnd.juniper.net.ips.devices';
        }
    });

    return IPSPolicyDeviceView;
});
