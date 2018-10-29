/**
 * Module that implements the IPSDeviceActivity
 *
 * @module IPSDeviceActivity
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/overlay/overlayWidget',
  '../../../../sd-common/js/views/deviceView.js',
  '../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js'
], function (OverlayWidget, DeviceView, PolicyManagementConstants) {
    /**
     * Constructs a IPSDeviceActivity.
     */

    var IPSDeviceActivity = function () {
        Slipstream.SDK.Activity.call(this);

        this.onStart = function () {
            switch (this.getIntent().action) {
                case Slipstream.SDK.Intent.action.ACTION_LIST:
                    this.onListIntent();
                    break;
                default:
                    this.onListIntent();
            }
        };

        this.onListIntent = function () {
            var policyId = this.getExtras().data;
            var view = new DeviceView({
                activity: this,
                params: {
                    devicesForPolicyURLRoot : PolicyManagementConstants.getDevicesForPolicyURLRoot(policyId),
                    devicesForPolicyAcceptHeader : PolicyManagementConstants.POLICY_DEVICESFORPOLICY_ACCEPT_HEADER
                }      
            });
            this.showOverlay(view, 'wide');
        };

        this.showOverlay = function(view, options) {
            this.overlay = new OverlayWidget({
                view: view,
                type: options.size || 'large',
                showScrollbar: true
            });

            this.overlay.build();
        };
    };

    IPSDeviceActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    IPSDeviceActivity.prototype.constructor = IPSDeviceActivity;

    return IPSDeviceActivity;
});