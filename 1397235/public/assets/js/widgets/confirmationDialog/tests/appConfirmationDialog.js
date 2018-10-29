/**
 * Confirmation Dialog widget Test Application is a sample application that utilizes the Confirmation Dialog widget.
 *
 * @module ConfirmationDialogAppView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define(['backbone',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'text!widgets/confirmationDialog/tests/templates/confirmationDialogExample.html',
    'es6!widgets/confirmationDialog/react/tests/view/confirmationDialogReactView',
    'widgets/confirmationDialog/conf/configurationSample'
], function (Backbone, ConfirmationDialogWidget, example, ConfirmationDialogReactView, configurationSample) {
    var ConfirmationDialogAppView = Backbone.View.extend({
        events: {
            'click #simpleConfirmationDialog': 'openSimpleConfirmationDialog',
            'click #simpleConfirmationDialogReact': 'openSimpleConfirmationDialogReact'
        },
        initialize: function () {
            this.$el.append(example);
        },
        openSimpleConfirmationDialog: function () {
            var self = this;

            // use either the callback or the trigger. Here both are used only as an example
            var yesButtonCallback = function(doNotShowAgain) {
                console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                self.confirmationDialogWidget.destroy();
            };

            var noButtonCallback = function() {
                console.log('No button callback called');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                self.confirmationDialogWidget.destroy();
            };

            var cancelLinkCallback = function() {
                console.log('Cancel link callback called');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                self.confirmationDialogWidget.destroy();
            };

            var conf = _.extend({
                yesButtonCallback: yesButtonCallback,
                noButtonCallback: noButtonCallback,
                cancelLinkCallback: cancelLinkCallback,
            }, configurationSample.simpleConfirmationDialog);

            this.confirmationDialogWidget = new ConfirmationDialogWidget(conf);

            this.bindEvents();

            !this.options.pluginView && this.render();
        },

        openSimpleConfirmationDialogReact: function() {
            new ConfirmationDialogReactView().render();
        },
        bindEvents: function() {
            var self = this;
            // use either the callback or the trigger. Here both are used only as an example
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function(doNotShowAgain) {
                console.log('Yes button event triggered with do not show checkbox', doNotShowAgain? 'selected': 'unselected');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                // self.confirmationDialogWidget.destroy();
            });

            this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                console.log('No button event triggered');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                // self.confirmationDialogWidget.destroy();
            });

            this.confirmationDialogWidget.vent.on('cancelEventTriggered', function() {
                console.log('Cancel event triggered');

                // you can do other things here such as open a progress view overlay

                // remember to destroy the dialog once done
                // self.confirmationDialogWidget.destroy();
            });
        },

        render: function () {

            this.confirmationDialogWidget.build();

            return this;
        }
    });

    return ConfirmationDialogAppView;
});