/**
 * A module that listen to all the events that the PEG parsers triggers
 *
 * @module ParserEvents
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([], /** @lends ParserEvents */
function () {

    /**
     * ParserEvents constructor
     *
     * @constructor
     * @class ParserEvents - module that listen to all the events that PEG.js parser triggers
     *
     * @param {Object} conf - The configuration object
     *
     * @returns {Object} Current ParserEvents' object
     */

    var ParserEvents = function (conf) {

        var self = this;

        var vent = conf.vent;
        var reqres = conf.reqres;

        var latestParsedObject;
        var latestLastFieldTermObj;

        var initialize = function () {
            allParserEvents();
            setParserDataHandlers();
        };

        // Register all the parser / grammar related event handlers
        // This will keep cache the latest parsed information 
        var allParserEvents = function () {

            // Object contains the details for last field term, provided by parser
            vent.on("parser.lastFieldTermObj", function (lastFieldTermObj) {
                latestLastFieldTermObj = lastFieldTermObj;
            });
            
            // Handler for the event that grammar triggers along with object
            // Object contains the details for expression validity, errors & model
            vent.on("parser.parsedObj", function (parsedObj) {
                latestParsedObject = parsedObj;
            });
        };

        // This will register handlers to provide back the cached information
        var setParserDataHandlers = function () {
            reqres.setHandlers({
                "parser.parsedObj": self.provideParsedObj,
                "parser.lastFieldTermObj": self.provideLastFieldTerm
            });
        };

        this.provideParsedObj = function () {
            return latestParsedObject;
        };
        
        this.provideLastFieldTerm = function () {
            return latestLastFieldTermObj;
        };

        initialize();

    };
    return ParserEvents;
});