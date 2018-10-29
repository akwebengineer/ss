/**
 * Module that renders the welcome view
 *
 * @module Welcome View for UTM policy
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'text!../../../../sd-common/js/templates/utmWelcome.html'
], function(Backbone, welcomeViewTpl){
    var WelcomeView = Backbone.View.extend({

        initialize: function() {
          this.context = this.options.context;
          return this;
        },

        getTitle : function() {
            return this.options.title;
        },

        render: function(){
            var welcome_data = {
                welcome_text: this.context.getMessage('utm_policy_welcome_text'),
                welcome_purpose: this.context.getMessage('utm_policy_welcome_purpose'),
                welcome_usage: this.context.getMessage('utm_policy_welcome_usage')
            };
            this.$el.html(Slipstream.SDK.Renderer.render(welcomeViewTpl, welcome_data));
            return this;
        }
    });
    return WelcomeView;
});