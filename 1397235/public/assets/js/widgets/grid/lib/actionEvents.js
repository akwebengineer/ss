/**
 * A module that register handlers for grid events using callback instead of the jQuery events mechanism
 *
 * @module ActionEvents
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([], /** @lends ActionEvents*/
function () {

    var ActionEvents = function (gridContext, errorMessages) {
        /**
         * ActionEvents constructor
         *
         * @constructor
         * @class ActionEvents- Register handlers for the grid events generated from both user defined grid actions and grid widget default events (for example, gridOnRowSelection)
         * @param {Object} gridContext - Current grid context (this)
         * @param {Object} errorMessages - Error messages defined for the grid
         * @returns {Object} Current ActionEvents's object: this
         */

        var $gridTable;

        /**
         * Initializes the ActionEvents class by setting the $gridTable variable and registering the events defined on the gridContext.conf.events property
         */
        this.init = function (gridTable) {
            $gridTable = gridTable;
            registerEvents(gridContext.conf.events);
        };

        /**
         * Register events generated from both user defined grid actions and grid widget default events. The events are binded using jQuery. The handler of an event invokes the callback defined in gridContext.conf.events. In this way, the user of the widget does not need to have jQuery to get its callback invoked when the event is triggered.
         * @param {Object} keysHash - object with a key/value pair. key represents the event key and the value is an Object with the handler and capabilities properties. handler is a required property and it represents the callback that will be invoked when the action is clicked. handler should be represented as an array, so multiple callbacks to the same event can be added. capabilities is an Array of string and allows to disable an action if the user does not have the corresponding capabilities. Support for capabilities is checked before the events get triggered.
         * @inner
         */
        var registerEvents = function (keysHash) {
            var resizeEventPrefix = "slipstreamGrid.resized",
                registerEvent = function (key) {
                    var eventName = keysHash[key].name || key;
                    gridContext.conf.container.unbind(eventName).bind(eventName, function (event, eventData) {
                        gridContext._invokeHandlers(key, event.originalEvent, eventData);
                    });
                };
            for (var key in keysHash) {
                _.isObject(keysHash[key]) && _.isArray(keysHash[key].handler) && registerEvent(key);
            }
        };

        /**
         * Register handlers for the actions provided in the input parameter
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be invoked when the action is clicked. handler should be represented as an array, so multiple callbacks to the same event can be added.
         */
        gridContext.bindEvents = function (updatedEventsHash) {
            if ($gridTable) {
                gridContext._bindEvents(updatedEventsHash);
                registerEvents(updatedEventsHash);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Unregister handlers for the actions provided in the input parameter
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be unregistered so handler is not invoked when the event is triggered. handler should be represented as an array, so multiple callbacks to the same event can be unregistered.
         */
        gridContext.unbindEvents = function (updatedEventsHash) {
            if ($gridTable) {
                gridContext._unbindEvents(updatedEventsHash);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

    };

    return ActionEvents;
});