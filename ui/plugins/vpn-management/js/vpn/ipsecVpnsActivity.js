/**
 * Module that implements the IpsecVpnsActivity.
 *
 * @module IpsecVpnsActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/ipsecVpnsGridConf.js',
    './models/ipsecVpnModel.js',
    './models/vpnProfileModel.js',
    './views/vpnCreateWizardView.js',
    './views/ipsecVpnGridExtendView.js'
], function(GridActivity, GridConfiguration, Model, VpnProfileModel, View, IpsecVpnGridExtendView) {
    /**
     * Constructs a IpsecVpnActivity.
     */
    var IpsecVpnActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities : ['VPN.create']
            }
           // "findUsage": {}
        };
        this.gridConf = GridConfiguration;
        var getSearchParamsFromExtras = function(extras) {
         // link responsed from backend has space ahead
        var filter = extras[" filter"] || extras["filter"];
        if (!_.isEmpty(filter)) {
            return filter.split("'")[1];
        }
        return undefined;
    };
        // need to set activity as this object, required for publish action
        this.getView = function() {
            conf = new this.gridConf(this.getContext());
            var searchParams = getSearchParamsFromExtras(this.getIntent().getExtras());
            this.view = new IpsecVpnGridExtendView({
                context: this.getContext(),
                conf: conf.getValues(),
                actionEvents: this.events,
                search: searchParams ? [searchParams] : undefined,
                activity: this
            });
            this.addSelectAllCallback(this.view.conf);
            this.bindEvents();
            this.subscribeNotifications();
            return this.view;
        };

        this.model = Model;
        this.vpnmodel = VpnProfileModel;

    };
    //IpsecVpnActivity.prototype = new GridActivity();
    IpsecVpnActivity.prototype = Object.create(GridActivity.prototype);
    IpsecVpnActivity.prototype.constructor = IpsecVpnActivity;
    return IpsecVpnActivity;
});
