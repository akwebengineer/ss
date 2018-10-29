/**
 * A module that creates a base widget and provides some common functionality to be inherited by a Slipstream widget when common options among widgets like event registration are required
 * The configuration object includes the events (hash with key/name of an event and its callback/handler(s))
 *
 * @module BaseWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([], /** @lends BaseWidget*/ function () {

    var BaseWidget = function (conf) {
        /**
         * BaseWidget constructor
         *
         * @constructor
         * @class BaseWidget- Builds a baseWidget widget from a configuration object.
         * @param {Object} conf - It has the events parameter.
         * @param {Object} conf.events - defines handlers that will be invoked when the click event on an action is triggered
         * @returns {Object} Current BaseWidget's object: this
         */

        var self = this,
            eventsHash;

        /**
         * Sets the eventsHash that will have as a key, the name of the event, and as a value, the callback to be called when the event is triggered
         * @inner
         */
        var setEventsHash = function () {
            eventsHash = $.extend(true, {}, conf.events);
        };

        /**
         * Initializes the base widget
         * @inner
         */
        var init = function () {
            setEventsHash();
        }();

        /**
         * Invoke the event handlers by using the hash built from the events configuration and/or the _bindEvents method
         * @param {Object} key - key of the action
         * @param {Object} event - event generated when the action is triggered
         * @param {Object} eventData - data associated with the event
         * @inner
         */
        this._invokeHandlers = function (key, event, eventData) {
            if (eventsHash[key] && _.isArray(eventsHash[key].handler)) {
                var handlers = eventsHash[key].handler;
                handlers.forEach(function (handler) {
                    if (_.isFunction(handler)) {
                        handler.apply(self, [event, eventData]);
                    } else {
                        console.log("each handler should be a function");
                    }
                });
            } else {
                if (_.isUndefined(eventsHash[key])) {
                    console.log("the " + key + " event was not registered");
                } else {
                    throw new Error("the handler property should be available for the " + key + " event and it should be an array");
                }
            }
        };

        /**
         * Register a handler(s) for the event(s) provided in the input parameter (updatedEventsHash)
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be invoked when the action is clicked. handler should be represented as an array, so multiple callbacks to the same event can be added.
         */
        this._bindEvents = function (updatedEventsHash) {
            for (var key in updatedEventsHash) {
                var eventAction = eventsHash[key],
                    newEventAction = updatedEventsHash[key];
                if (!_.isUndefined(newEventAction)) {
                    if (_.isUndefined(eventAction)) {
                        eventsHash[key] = newEventAction;
                    } else if (_.isArray(newEventAction.handler)) {
                        eventsHash[key].handler = eventAction.handler.concat(newEventAction.handler);
                    }
                }
            }
        };

        /**
         * Unregister a handler(s) for the event(s) provided in the input parameter (updatedEventsHash)
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be unregistered so handler is not invoked when the event is triggered. handler should be represented as an array, so multiple callbacks to the same event can be unregistered.
         */
        this._unbindEvents = function (updatedEventsHash) {
            var hasArrayHandler = function (keyHandler, key) {
                return keyHandler[key] && _.isArray(keyHandler[key].handler);
            };
            for (var key in updatedEventsHash) {
                if (hasArrayHandler(eventsHash, key) && hasArrayHandler(updatedEventsHash, key)) {
                    updatedEventsHash[key].handler.forEach(function (handler) {
                        var handlers = eventsHash[key].handler,
                            handlerIndex = handlers.indexOf(handler);
                        handlers.splice(handlerIndex, 1);
                    });
                    !eventsHash[key].handler.length && delete eventsHash[key];
                }
            }
        };

        /**
         * Provides the current registered events, including the ones added with _bindEvents or removed with _unbindEvents
         */
        this._getRegisteredEvents = function () {
            return eventsHash;
        };

    };

    return BaseWidget;
});