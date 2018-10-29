/**
 * A Backbone model representing event-filter (/api/juniper/seci/filter-management/filters/).
 *
 * @module EventViewer
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
     '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * EventFilterModel definition.
     */
    var EventFilterModel = SpaceModel.extend({

        urlRoot: '/api/juniper/seci/filter-management/filters/',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'event-filter',
                accept: 'application/vnd.juniper.seci.filter-management.event-filter+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.seci.filter-management.event-filter+json;version=1;charset=UTF-8'
            });
        }
    });

    return EventFilterModel;
});
