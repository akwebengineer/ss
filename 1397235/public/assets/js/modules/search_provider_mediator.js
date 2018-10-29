/** 
 * A module that implements a mediator for interacting with a search provider
 *
 * @module Slipstream/SearchProviderMediator
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(function() {
    Slipstream.module("SearchProviderMediator", /** @namespace Slipstream.SearchProviderMediator */ function(SearchProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var searchProvidersByIndex = {};

        function doQuery(query, options) {
            var resultSets = {};
            var success = options.success;

            if (Object.keys(searchProvidersByIndex).length == 0) {
                console.log("A search cannot be performed, no search providers have been registered");

                if (options.error) {
                    options.error("no registered search providers");  
                }

                return;
            }

            // Federate the query over all defined search providers
            for (var searchIndex in searchProvidersByIndex) {
                var modded_options = $.extend({}, options);

                modded_options.success = (function() {
                    return function(resultSet) {
                        resultSets[searchIndex] = resultSet;

                        // Once all defined search providers have responded, send the result sets back to the caller
                        if (Object.keys(resultSets).length == Object.keys(searchProvidersByIndex).length) {
                            success({
                              resultSets: resultSets,
                              query: query
                          });
                        }
                    }
                })(searchIndex);

                var searchProvider = searchProvidersByIndex[searchIndex];
                searchProvider.query(query, modded_options);
            };
        }

        function onProviderLoad(providerModule, provider) {
            searchProvidersByIndex[provider.uri.path()] = providerModule;
        }

        SearchProviderMediator.addInitializer(function() {
             /** 
              * Search Provider discovered event
              *
              * @event search_provider:discovered
              * @type {Object}
              * @property {Object} provider - The search provider that's been discovered
              */
             Slipstream.vent.on("search_provider:discovered", function(provider) {
                 console.log("got search_provider:discovered event", JSON.stringify(provider));

                 if (provider.module instanceof Slipstream.SDK.SearchProvider) {
                      onProviderLoad(provider.module, provider);
                 }
                 else {
                   var options = {context: provider.context, type: Slipstream.SDK.SearchProvider, onLoad: onProviderLoad};

                   Slipstream.commands.execute("provider:load", provider, options);
                 }
             });

             /** 
              * Search Provider query request
              *
              * @event search_provider:query
              * @type {Object}
              * @param {String} query - The query string to be executed.
              * @param {Object} options - An options hash to control query execution (optional).
              */
             Slipstream.commands.setHandler("search_provider:search", function(query, options) {
                 console.log("got search_provider:query request for query=", JSON.stringify(query));
                 doQuery(query, options);
             });
         });
    });

    return Slipstream.SearchProviderMediator;
});