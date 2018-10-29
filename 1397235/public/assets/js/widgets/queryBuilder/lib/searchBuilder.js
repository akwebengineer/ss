/**
 * A module that binds SearchBuilder. Trigger search callback on every keyDown or only on enter key.
 *
 * @module SearchBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    "lib/template_renderer/template_renderer",
    'text!widgets/queryBuilder/templates/searchAction.html'
], /** @lends SearchBuilder */
function (render_template, searchAction) {

    /**
     * SearchBuilder constructor
     *
     * @constructor
     * @class SearchBuilder - build search feature.
     * @returns {Object} Current SearchBuilder's object: this
     */
    var SearchBuilder = function () {

        /**
         * Builds the SearchBuilder
         * @returns {Object} Current "this" of the class
         */


        /**
         * Build search feature
         * @param {jQuery Object} $container - container to add template
         * @param {Object} columnConf - current column configuration
         * @param {Object} callback - from actionBarWidget _invokeHandlers
         * @param {Object} data includes callback key and search value
         */
        this.buildSearch = function($container, columnConf, callback, data){
            var isSearchOnEnter = columnConf.searchOnEnter == false ? false : true;
            $container.append(render_template(searchAction));
            bindSearch($container.find(".filter_container"), isSearchOnEnter, callback, data);
        };

        /**
         * Bind all search events - $searchInput show or hide, and trigger search callback on ONLY enter key or every key
         * @param {jQuery Object} $search
         * @param {Boolean} isSearchOnEnter - if searchOnEnter is enabled
         * @param {Object} callback - from actionBarWidget _invokeHandlers
         * @param {Object} search data includes callback key and search value
         * @inner
         */
        var bindSearch = function($search, isSearchOnEnter, callback, data){
            var $searchInput = $search.find('input'),
                searchTimeout,
                searchIndicatorTime = 500;

            var triggerSearchCallback = function(e){
                data.search = $searchInput.val();
                callback(data.key, e.originalEvent, data);
            };

            //Bind search icon to show or hide $searchInput
            $search.find(".search_icon").on('click.fndtn.search', function(e){
                var inputValue = $searchInput.val();
                if (inputValue) {
                    $searchInput.focus();
                    triggerSearchCallback(e);
                } else {
                    if ($search.hasClass("collapse_search")) {
                        $search.removeClass("collapse_search");
                        $searchInput.focus();
                    } else {
                        $search.addClass("collapse_search");
                    }
                }
            });

            $searchInput.on('keydown', function (e) {
                if (e.which == 13) { //on Enter (13), prevent form from triggering submitting
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            //Trigger search callback on ONLY enter key or every key
            $searchInput.on('keyup.fndtn.inputSearch',function(e) {
                if (!isSearchOnEnter || e.which == 13){
                    clearTimeout(searchTimeout);

                    searchTimeout = setTimeout(function () {
                        triggerSearchCallback(e);
                    }, searchIndicatorTime);
                }
            });
        };
    };

    return SearchBuilder;
});