/** 
 * A module that handles the rendering of notification
 * messages on behalf of plugins.
 *
 * @module
 * @name Slipstream/NotificationMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'text!./templates/notifications/notification_message.html',
    'text!./templates/notifications/notification_close_button.html',
    'toastr'], /** @lends NotificationMediator */ 
    function(notification_message, close_button_template, toastr) {
    	Slipstream.module("NotificationMediator", function(NotificationMediator, Slipstream, Backbone, Marionette, $, _) {

            var timeout = 8000;  // 8 second timeout for notifications
            toastr.options = {
                positionClass: "toast-top",
                closeButton: true,
                timeOut: timeout,
                extendedTimeOut: timeout,  // don't time out while mouseover on toast
                closeHtml: close_button_template,
                showMethod: "slideDown",
                hideMethod: "slideUp"
            };

            NotificationMediator.addInitializer(function() {
                /** 
                 * Notification event
                 *
                 * @event notification:notify
                 * @type {Object}
                 * @property {Object} notification - The notification to be sent.
                 */
        		Slipstream.vent.on("notification:notify", function(notification, timeout) {
                    if (notification.type in toastr && typeof toastr[notification.type] == "function") {
                        var msg = notification.text;
                        var opts = typeof timeout != "undefined" ? {timeOut: timeout} : {};

                        if (isView(msg)) {
                            msg.render();
                            msg = $(msg.el);
                        }
                        msg = $(notification_message).append(msg);
                        toastr[notification.type].call(null, msg, null, opts); 
                    }
                    else {
                        console.log("Invalid notification type '" + notification.type + "' specified");
                    }  

                    /**
                     * Determine if the provided message is a view.
                     * @param {Object} msg - the provided message.
                     * @returns - true if msg is a view, false otherwise.
                     */
                    function isView(msg) {
                        return (!(typeof msg == "string")) && (typeof msg.render == "function");
                    }    
        		});
            });
    	});

        return Slipstream.NotificationMediator;
});