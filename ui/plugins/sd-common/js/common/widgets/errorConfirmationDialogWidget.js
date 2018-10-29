/** 
 * ErrorConfirmation Dialog Widget extending the ConfirmationDialogWidget
 * @module ConfirmationDialogWidget
 * @author Damodahar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (ConfirmationDialog) {
   var errorConfirmationDialogWidget = function(config) {
        var conf = config || {};
        var self = this;
        this.confirmationDialogWidget = new ConfirmationDialog({
            title: conf.title,
            question: conf.question,
            yesButtonLabel: conf.yesButtonLabel,
            yesButtonTrigger: 'yesEventTriggered',
            xIcon: false
        });
        this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
            if (conf.yesEvent) {
                conf.yesEvent();
            }
        });
        this.build = function() {
            this.confirmationDialogWidget.build();
            return this;
        };
        this.destroy = function() {
            this.confirmationDialogWidget.destroy();
            return this;
        }    
    };
    return errorConfirmationDialogWidget;
});
