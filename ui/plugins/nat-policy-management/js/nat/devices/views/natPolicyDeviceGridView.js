/**
 * A view to manage NAT policy - Device page
 *
 * @module DevicesView
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../base-policy-management/js/policy-management/devices/views/basePolicyDeviceGridView.js'
], function (BasePolicyDeviceGridView) {

    var NATPolicyDeviceView = BasePolicyDeviceGridView.extend({
        getMimeType : function() {
            return 'vnd.juniper.net.nat.devices';
        }
    });

    return NATPolicyDeviceView;
});
