/**
 * A view that renders a Login widget
 *
 * @module LoginView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/login/loginWidget',
    'widgets/login/tests/models/loginModel',
    'mockjax'
], function(Backbone, LoginWidget, LoginModel, mockjax){
    var LoginView = Backbone.View.extend({

        model: new LoginModel(),

        initialize: function () {
            this.options.fullPage && this.$el.closest("body").height("100%");
            this.mockApiResponse();
        },

        render: function () {
            var self = this;
            this.loginWidget =  new LoginWidget(_.extend(this.getInitialConfiguration(), {
                content: {
                    title: "Juniper Web Device Manager",
                    subtitle: "SRX320",
                    version: "Version 123.ABC",
                    copyrightYear: "2015",
                    note: "Best viewed in 1280x1024 resolution. Supported browsers are IE 11, Firefox 56 and Chrome 61."
                },
                submitCredentials: _.bind(self.submitCredentials, self)
            }));
            this.loginWidget.build();
            this.loginWidget.getFormWidgetInstance().showFormInfo("This device is being used by <i>root</i>. Please, refrain from using it.");
            return this;
        },

        getInitialConfiguration: function () {
            var initialConfiguration = {};
            if (this.options.el) {
                initialConfiguration.container = this.el
            }
            if (_.isBoolean(this.options.fullPage)) {
                initialConfiguration.fullPage = this.options.fullPage
            }
            return initialConfiguration;
        },

        submitCredentials: function(username, password, onSubmitCredentials){
            var self = this;
            this.model.set('user', username);
            this.model.set('password', password);
            this.model.save(null, {
                error: function (data) {
                    console.log('error in login: ', JSON.stringify(data));
                    onSubmitCredentials(false);
                },
                success: function (data) {
                    console.log('success in login: ', JSON.stringify(data));
                    onSubmitCredentials(true);
                    self.$el.empty().append('User credentials are valid');
                }
            });
        },

        /* mocks REST API response for login to the app */
        mockApiResponse: function(){
            $.mockjax({
                url: '/slipstream/api/login',
                dataType: 'json',
                type: 'post',
                responseTime: 2000,
                response: function(settings) {
                    var header = $.parseJSON( settings.data );
                    var username = header.user,
                        password = header.password;
                    if (username=='miriam'&&password=='vilitanga'){
                        this.responseText = {success: true};
                    } else {
                        this.error = 404;
                    }
                }
            });
        }
    });

    return LoginView;
});