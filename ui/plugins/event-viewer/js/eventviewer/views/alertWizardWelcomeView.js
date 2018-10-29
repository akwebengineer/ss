/**
 * A view implementing welcome form workflow for create Alert wizard.
 *
 *  @module EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
    'backbone',
    'text!../templates/evWelcome.html'
], function(Backbone, welcomeViewTpl){
    var WelcomeView = Backbone.View.extend({

        initialize: function() {
          this.context = this.options.context;

          return this;
        },
        getTitle : function() {
            return this.options.title;
        },
        getDescription: function(){
            return '';
        },
        render: function(){
            var welcome_data = {
                welcome_text: this.context.getMessage('ev_create_alert_welcome_text'),
                welcome_purpose: this.context.getMessage('ev_create_alert_welcome_purpose'),
                welcome_usage: ""
            };
            this.$el.html(Slipstream.SDK.Renderer.render(welcomeViewTpl, welcome_data));
            return this;
        },
        getSummary: function() {
            return this.generateSummary(' Review the options entered. Select Finish to complete the process');
        }
    });
    return WelcomeView;
});