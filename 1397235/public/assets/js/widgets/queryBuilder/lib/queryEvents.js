/**
 * A module that listen to all the events that the PEG parsers triggers
 *
 * @module QueryEvents
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['../util/constants'], /** @lends QueryEvents */
function (CONSTANTS) {

    var QueryEvents = function (conf) {

        var vent = conf.vent;
        var eventCallback = conf.eventCallback;


        var registerEvents = function () {

            allQueryEvents();
        };

        var initialize = function () {

            registerEvents();
        };

        var allQueryEvents = function () {

            vent.on("query.validity", function (queryObj) {
                switch (queryObj.state) {
                    case CONSTANTS.validity.valid:
                        vent.trigger("query.validity.valid", queryObj);
                        break;
                    case CONSTANTS.validity.invalid:
                        vent.trigger("query.validity.invalid", queryObj);
                        break;
                }
            });

            // vent.on("query.autocomplete.state", function (resolvedState) {
            // action for autocomplete
            // });

            vent.on("query.message", function (message) {
                eventCallback("query.message", undefined, message);
            });

            vent.on("query.validity.valid", function (queryObj) {
                eventCallback("query.valid", undefined, queryObj);
            });

            vent.on("query.validity.invalid", function (queryObj) {
                eventCallback("query.invalid", undefined, queryObj);
            });

            vent.on("query.executeQuery", function (queryObj) {
                eventCallback("query.executeQuery", undefined, queryObj);
            });

            vent.on("query.emptyQuery", function (queryObj) {
                eventCallback("query.emptyQuery", undefined, queryObj);
            });
        };

        initialize();

    };
    return QueryEvents;
});
