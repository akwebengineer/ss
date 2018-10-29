/**
 * A custom view that uses the loginWidget to generate a custom login page
 *
 * @module Custom Login View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/login/loginWidget',
    'text!widgets/login/tests/templates/loginCustomPage.html',
], function(Backbone, LoginWidget, LoginCustomPage){
    var CustomLoginView = Marionette.ItemView.extend({
        initialize: function () {
            this.context = this.options.context;
            this.$el = $(this.el);
        },

        render: function () {
            this.$el.append(LoginCustomPage);
            this.loginWidget = new LoginWidget({
                submitCredentials: this.options.submitCredentials,
                container: this.$el.find(".login_container"),
                content: {
                    title: this.context.getMessage("login_title"),
                    model: this.context.getMessage("login_model"),
                    version: this.context.getMessage("login_version"),
                    copyright: this.context.getMessage("login_copyright")
                },
                fullPage: false
            }).build();
            
            return this;
        },
        
        close: function() {
            this.$el.find(".login_custom_test_page").removeClass('login_custom_test_page');
            this.loginWidget.destroy();
        }
    });

    return CustomLoginView;
});