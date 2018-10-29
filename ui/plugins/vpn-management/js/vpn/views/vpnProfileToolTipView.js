/**
 * Module that implements the vpnImportIntroPageView.
 * @module vpnImportIntroPageView
 * @author Ponraja <ponraja@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'text!../../../../sd-common/js/templates/importWelcome.html'
], function(Backbone, vpnImportIntroPageViewTpl){
    var vpnImportIntroPageView = Backbone.View.extend({

        initialize: function() {
          this.context = this.options.context;

          return this;
        },
        getTitle : function() {
            return this.context.getMessage('import_vpn_web_filtering_Introduction');
        },
        getDescription: function(){
            return '';
        },
        render: function(){
            var welcome_data = {
                welcome_text: this.context.getMessage('import_vpn_web_filtering_welcome_purpose'),
                welcome_text2: this.context.getMessage('import_vpn_web_filtering_welcome_usage'),
                welcome_purpose1: this.context.getMessage('import_vpn_supported'),
                welcome_purpose2: this.context.getMessage('import_vpn_unsupported'),
                welcome_purpose11: this.context.getMessage('import_vpn_policy'),
                welcome_purpose12: this.context.getMessage('import_vpn_route'),
                welcome_purpose13: this.context.getMessage('import_vpn_site_to_site'),
                welcome_purpose14: this.context.getMessage('import_vpn_pre_shared'),
                welcome_purpose15: this.context.getMessage('import_vpn_certificate'),
                welcome_purpose16: this.context.getMessage('import_vpn_single_proxy'),
                welcome_purpose17: this.context.getMessage('import_vpn_multi_proxy'),
                welcome_purpose18: this.context.getMessage('import_vpn_static'),
                welcome_purpose21: this.context.getMessage('import_vpn_unsupport_routing'),
                welcome_purpose22: this.context.getMessage('import_vpn_unsupport_VPN'),
                welcome_purpose23: this.context.getMessage('import_vpn_unsupport_ike_access'),
                welcome_purpose24: this.context.getMessage('import_vpn_unsupport_ike_multiple'),
                welcome_purpose25: this.context.getMessage('import_vpn_unsupport_group'),
                welcome_purpose26: this.context.getMessage('import_vpn_unsupport_ipv'),
                welcome_purpose27: this.context.getMessage('import_vpn_unsupport_remote'),
                welcome_purpose28: this.context.getMessage('import_vpn_unsupport_manual'),
                welcome_purpose29: this.context.getMessage('import_vpn_unsupport_auto'),
                welcome_purpose30: this.context.getMessage('import_vpn_unsupport_lsys'),
                welcome_purpose_end: this.context.getMessage('import_vpn_web_maintained'),
                welcome_usage: this.context.getMessage('utm_antivirus_profile_welcome_usage')
            };
            this.$el.html(Slipstream.SDK.Renderer.render(vpnImportIntroPageViewTpl, welcome_data));
            return this;
        }
    });
    return vpnImportIntroPageView;
});

