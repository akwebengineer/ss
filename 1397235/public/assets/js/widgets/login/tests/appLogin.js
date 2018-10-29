/**
 * A view that uses a configuration object to render a login widget
 *
 * @module LoginAppView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/login/tests/view/loginView',
    'text!widgets/login/tests/templates/loginExample.html',
], function (Backbone, LoginView, example) {
    var LoginAppView = Backbone.View.extend({

        events: {
            'click .full_view a': function () {this.renderView("full")},
            'click .overlay_view a': function () {this.renderView("overlay")},
            'click .inline_view a': function () {this.renderView("inline")},
            // 'click .custom_view a': renderCustomView, //to be implemented by SPOG-3407
        },

        initialize: function () {
            this.addContent();
            !this.options.pluginView && this.render();
        },

        renderView: function (viewTye) {
            var loginConfiguration;
            switch (viewTye) {
                case "full":
                    loginConfiguration = {
                        "el": ".test_login_demo",
                        "fullPage": true
                    };
                    this.$loginOptions.hide();
                    this.$loginDemo.removeClass("inline-login").empty();
                    break;
                case "overlay":
                    //no updates required for now since overlay can use default values in the view
                    break;
                case "inline":
                    loginConfiguration = {
                        "el": ".test_login_demo",
                        "fullPage": false
                    };
                    this.$loginDemo.addClass("inline-login");
                    break;
            }
            new LoginView(loginConfiguration).render();
        },

        addContent: function () {
            this.$el.append(example);
            this.$loginOptions = this.$el.find(".test_login_options");
            this.$loginDemo = this.$el.find(".test_login_demo");
        }

    });

    return LoginAppView;
});