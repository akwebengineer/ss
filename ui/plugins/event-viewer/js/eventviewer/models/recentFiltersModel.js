/**
 * Model for getting Recent Filters
 * 
 * @module recentFiltersModel
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * recentFiltersModel definition.
    */
    var RecentFiltersModel = SpaceModel.extend({

        urlRoot: '/api/juniper/seci/filter-management/preferred-filters-by-user?limit=3&recent-used-only=true',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'event-filters.event-filter',
                accept: 'application/vnd.juniper.seci.filter-management.event-filter-refs+json;version=1;q=0.01'              
            });
        }
    });

    return RecentFiltersModel;
});









