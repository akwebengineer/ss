/**
 * A module that add events to the grid
 *
 * @module gridEvents
 * @author Eva Wang <iwang@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], function () {
    var GridEvents = function (conf) {

        /**
         * gridEvents constructor
         *
         * @constructor
         * @class gridEvents - Add events to the grid
         *
         * @param {Object} conf - User configuration object
         * @returns {Object} Current gridEvents's object: this
         */

        var sortingHeaders;

        var cacheContainers = function ($gridWidget) {
            if (_.isUndefined(sortingHeaders)) {
                sortingHeaders = $gridWidget.find('.ui-jqgrid-hdiv .ui-jqgrid-sortable.orderable');
            }
        };

        /**
         * Bind row mouseleave and mouseenter events
         * mouseleave event triggers slipstreamGrid.row:mouseleave
         * mouseenter event triggers slipstreamGrid.row:mouseenter
         * @param {Object} $gridTable
         */
        this.triggerHoverRow = function ($gridTable) {
            $gridTable
                .on("mouseenter", ".jqgrow", function () {
                    $gridTable.trigger("slipstreamGrid.row:mouseenter", this);
                })
                .on("mouseleave", ".jqgrow", function () {
                    $gridTable.trigger("slipstreamGrid.row:mouseleave", this);
                });
        };

        /**
         * Binds slipstream.Grid.row expand and collapse events to toggle a row and persist in the row is expanded
         * @param {Object} $gridTable - jQuery object with the grid table
         * @param {Object} updateExpandedRowIds - callback that allows to update the hash table that contains the rows that were expanded
         * @param {Object} instances - object with the instance of other classes required to complete the interaction on row exapanded like the gridFormatter and the tooltipBuilder
         */
        this.bindOnCollapseExpandRow = function ($gridTable, updateExpandedRowIds, instances) {
            $gridTable
                .on("slipstreamGrid.row:expanded", function (event, row) {
                    instances.gridFormatter.toggleRow(row, $gridTable, instances.tooltipBuilder);
                    updateExpandedRowIds(row.id, true);
                })
                .on("slipstreamGrid.row:collapsed", function (event, row) {
                    updateExpandedRowIds(row.id, false);
                });
        };

        /**
         * Bind click event on the grid header to disable sorting while a
         * data load request is processing
         * @param {Object} $gridWidget
         */
        this.bindClickSorting = function ($gridWidget) {
            cacheContainers($gridWidget);
            sortingHeaders.bind('click.sorting',function(e){
                e.stopPropagation();
            });
        };

        /**
         * Unbind click event on the grid header to enable sorting after
         * data load request is complete
         * @param {Object} $gridWidget
         */
        this.unbindClickSorting = function ($gridWidget) {
            cacheContainers($gridWidget);
            sortingHeaders.unbind('click.sorting');
        };

        /**
         * Binds slipstream.Grid collection data events to trigger the collection callback
         * @param {Object} $gridTable - jQuery object with the grid table
         * @param {Function} addPageRows method
         */
        this.bindLoadCollectionData = function ($gridTable, addPageRows) {
            $gridTable.bind("slipstreamGrid.loadCollectionData", function (e, options) {
                var callback = options.callback || addPageRows,
                    pageSize = options.pageSize;
                conf.elements.getPageData && conf.elements.getPageData(callback, options.pages, options.search, options.pageSize);
            });
        };
    };

    return GridEvents;
});