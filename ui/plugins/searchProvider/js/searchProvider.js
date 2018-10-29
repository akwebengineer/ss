/** 
 * A module that implements a Slipstream Search Provider that
 * uses the Space global search service.
 *
 * @module Slipstream/SearchProvider
 * @copyright Juniper Networks, Inc. 2014
 */
define(['underscore'], function() {
    var SEARCH_URL = '/api/space/search/query';
    var FACETS_URL = '/api/space/search/facets';
    var SD_APPNAME = "SD";
    var SEARCH_ACCEPT =  'application/vnd.net.juniper.space.search.query-response+json;version=1';
    var FACETS_ACCEPT = 'application/vnd.net.juniper.space.search.facets+json;version=1';
    var DEFAULT_PAGE_SIZE = 10;

    /**
     * Merge the results from the query and facets APIs
     *
     * @param {String} query - The search query that produced the result set.
     * @param {Object} resultsData - The set of results data for the query.
     * @param {Object} facetsData - The set of facet data for the query.
     * @return An object representing the merged resultsData and facetsData.
     */
    function mergeResults(query, resultsData, facetsData) {
        var results = {
            totalResults: 0,
            query: query
        };
        
        if (resultsData && resultsData.response) {
            results.totalResults = resultsData.response.total;
            results.results = resultsData.response.results.result;
        }
        
        if (facetsData && facetsData.facets) {
            results.facets = facetsData.facets.facet;
        }

        return results;
    }

    function SearchProvider() {
        Slipstream.SDK.SearchProvider.call(this);
        
        this.onCreate = function() {
    	    console.log("creating a search provider");
        };
        
        this.onStart = function() {
	    	console.log("starting a search provider");
	    }
    }

    SearchProvider.prototype = Object.create(Slipstream.SDK.SearchProvider.prototype);
    SearchProvider.prototype.constructor = SearchProvider;

    SearchProvider.prototype.query = function(query, options) {
        // Execute the query and facets requests

        var page = options.page.index || 1;
        var pageSize = options.page.size || DEFAULT_PAGE_SIZE;
        var start = (page - 1) * pageSize;
        var facetFilter = options.facets ? buildFacetFilter(options.facets): "All";

        var queryPromise = $.ajax({
            url: SEARCH_URL,
            headers: {
                Accept: SEARCH_ACCEPT
            },
            data: {
                qstr: query, 
                appname: SD_APPNAME,
                facet: facetFilter,
                page: page,       
                start: start,
                limit: pageSize
            }
        });

        var facetsPromise;

        if (!options.facets) { 
            // No facet filter is supplied, so run the facet query
            facetsPromise = $.ajax({
                url: FACETS_URL,
                headers: {
                    Accept: FACETS_ACCEPT
                },
                data: {
                    qstr: query,
                    appname: SD_APPNAME
                }
            });    
        }

        /**
         * When both the facets and query reqquests have completed, call the
         * appropriate client callback method, if provided.
         */
        $.when(queryPromise, facetsPromise)
            .done(function(queryArgs, facetArgs) {
                var results = mergeResults(query, queryArgs[0], facetsPromise && facetArgs[0]);

                if (options.success) {
                    options.success(results);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("query failed: " + textStatus + ", " + errorThrown);

                if (options.fail) {
                    options.fail(textStatus + ", " + errorThrown);
                }
            });

        /**
         * Build the facet filter to be used in a query
         *
         * @param {Array} facets - an array of facet names
         * @returns a URI encoded, comma separated string of facet names
         */
        function buildFacetFilter(facets) {
            var facetFilter = "";

            _.each(facets, function(facetName) {
                facetFilter += ((facetFilter.length ? "," : "") + facetName);
            });

            return facetFilter;
        }
    }

    return SearchProvider;
});