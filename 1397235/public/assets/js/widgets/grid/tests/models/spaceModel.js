/**
 * A Backbone model and collection that uses Space API to get data for a grid
 *
 * @module SpaceModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone'
], function (Backbone) {

    /**
     * Space Model and Collection definition
     */
    var SpaceModel = {
        services: {}
    };

    SpaceModel.services.model = Backbone.Model.extend({});

    SpaceModel.services.collection = Backbone.Collection.extend({
        url: '/api/juniper/sd/service-management/services',
        model: SpaceModel.services.model,

        /**
         * Syncs callback: before any REST call
         * @param {string} method -  read (for GET)
         * @param {Object} collection -  backbone collection being used for call
         * @param {Object} options - internal options being used by Backbone
         */
        sync: function (method, collection, options) {
            // add accept in request headers
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader('Accept', 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01');
            };
            // call backbone's sync method
            return Backbone.sync.apply(this, arguments);
        },

        /**
         * Fetches multiple pages at a time
         * @param {Object} options - internal options being used by Backbone and additional ones defined during collection fetch
         */
        fetch: function (options) {
            var pagingString = this.getPagingString(options.pages, options.pageSize);
            console.log(pagingString);
            options.url = this.url + "?" + pagingString;
            this.abortXhr();
            return this.getFetchXhr(options);
        },

        /**
         * Formats paging string to format fetch call
         * @param {Array} pages -  pages to request
         * @param {string} pageSize -  size of a page (number of rows per page)
         */
        getPagingString: function (pages, pageSize) {
            var firstPage = pages[0],
                start = (firstPage - 1) * pageSize,
                limit = pages.length * pageSize;
            return "paging=(start eq " + start + ", limit eq " + limit + ")";
        },

        /**
         * Aborts the older xhr request if new one is send and the older is not
         */
        abortXhr: function () {
            if (this.fetchXhr) {
                var readyState = this.fetchXhr.readyState;
                if (readyState > 0 && readyState < 4) {
                    this.fetchXhr.abort();
                }
            }
        },

        /**
         * Return fetch Xhr
         * @param {Object} options - internal options being used by Backbone
         */
        getFetchXhr: function (options) {
            var self = this;
            return Backbone.Collection.prototype.fetch.call(self, options);
        }

    });

    return SpaceModel;
});