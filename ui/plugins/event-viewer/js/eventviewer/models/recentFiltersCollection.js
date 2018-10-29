/**
 * A Backbone collection representing all Recent Filters (/api/juniper/seci/filter-management/filters/all-filters)
 *
 * @module recentFiltersCollection
 * @author Slipstream Developers  <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(['../../../../ui-common/js/models/spaceCollection.js',  './recentFiltersModel.js'
       ], function (SpaceCollection, Model) {
    /**
     *  RecentFiltersCollection definition.
     */
    var RecentFiltersCollection = SpaceCollection.extend({
        url: '/api/juniper/seci/filter-management/preferred-filters-by-user?limit=3&recent-used-only=true',
        model: Model,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'event-filters.event-filter',
                accept: 'application/vnd.juniper.seci.filter-management.event-filter-refs+json;version=1;q=0.01'
            });
        }
    });

    return RecentFiltersCollection;
});
