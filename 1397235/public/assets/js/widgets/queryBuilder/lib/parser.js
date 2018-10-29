/**
 * A module that generates & instantiates the peg parser with the required grammar based on application configuration
 * The values provided in configuration are injected in Grammar using the mustache template
 *
 * @module QueryBuilderParser
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['pegjs',
    'lib/template_renderer/template_renderer',
    'text!widgets/queryBuilder/grammar/baseGrammar.pegjs',
    'widgets/queryBuilder/lib/parserEvents',
    'widgets/queryBuilder/util/queryBuilderUtil'
], function (peg, render_template, baseGrammar, ParserEvents, QueryBuilderUtil) {
    /** @lends Parser */
    var Parser = function (conf) {

        var appConfig = conf.appConfig;
        var vent = conf.vent;
        var reqres = conf.reqres;

        var generatedParser;

        var parseOptions = {
            dependency: {
                vent: vent
            }
        };

        var initialize = function () {
            generateParser();

            new ParserEvents({
                vent: vent,
                reqres: reqres
            });
        };

        /**
         * Generates a parser using the provided grammar
         */
        var generateParser = function () {
            var queryBuilderUtil = new QueryBuilderUtil();
            var grammarFromTemplate = render_template(baseGrammar, queryBuilderUtil.dataForGrammarTemplate(appConfig));
            generatedParser = peg.generate(grammarFromTemplate);
            // generatedParser = peg.generate(grammarFromTemplate,{trace:true});
        };

        /**
         * This method uses the generated parser & validates the query.
         * @param {string} queryString- query that needs to parsed against the grammar rules.
         * @returns {Object} parser object containing the model created by parser.
         */
        this.parse = function (queryString) {
            var parseObj = {};
            try {
                var parseResult = generatedParser.parse(queryString, parseOptions);
                parseObj = {
                    model: parseResult
                };
            } catch (ex) {
                parseObj = {
                    model: {},
                    error: ex
                };
            }

            // trigger that is used to cache the parsed object provided by grammar
            vent.trigger("parser.parsedObj", {'parsedObj': parseObj});
        };

        initialize();
    };

    return Parser;

});