/**
 * Module that implements the vpnModifyIntoPageView.
 * @module vpnModifyIntoPageView
 * @author Srinivasan Sriramulu <ssriram@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'text!../../../../sd-common/js/templates/modifyVpnTemplate.html'
], function(Backbone, introTemplate){
    var vpnModifyIntoPageView = Backbone.View.extend({

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
                welcome_text: this.context.getMessage('modify_vpn_web_filtering_welcome_purpose'),
                welcome_purpose1: this.context.getMessage('modify_vpn_list'),
                welcome_purpose11: this.context.getMessage('modify_vpn_wizard_general_settings'),
                welcome_purpose12: this.context.getMessage('modify_vpn_wizard_device_association'),
                welcome_purpose13: this.context.getMessage('modify_vpn_wizard_tunnel_route_settings'),
                welcome_purpose14: this.context.getMessage('modify_vpn_wizard_device_endpoint_settings'),
                welcome_purpose15: this.context.getMessage('modify_vpn_wizard_tunnel_settings')
            };
            this.$el.html(Slipstream.SDK.Renderer.render(introTemplate, welcome_data));
            return this;
        }
    });
    return vpnModifyIntoPageView;
});

