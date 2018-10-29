/** 
 * A js utility for common functionality.
 * @module Utils
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([], /** @lends Utils */ function() {
    /**
     * Construct a Utils object
     * @constructor
     * @class Utils
     */
    var Utils = function() {
    };

    /**
     * Uses passed in Slipstream's context to load localized string for requested message ids.
     * 
     * @param {Object} context - The Slipstream's context
     * @param {Array} messageIds - Message Ids for localization
     *
     * @returns {Object} containing localized messages
     */
    Utils.getLocalizedMessages = function(context, messageIds) {
        var messagesObj = {};
        messageIds.forEach(function(messageId) {
            messagesObj[messageId] = context.getMessage(messageId);
        });
        return messagesObj;
    };

    /**
     * Shows notification in the top middle using Slipstream's notification mechanism.
     * 
     * @param {Object} type - Notification type
     * @param {String} message - Notification message
     *
     * @returns none
     */
    Utils.showNotification = function(type, message) {
        var notification =  new Slipstream.SDK.Notification();
        notification.setText(message)
                         .setType(type)
                         .notify();
    }


    return Utils;
});