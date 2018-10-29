/**
 * A Backbone model representing scheduler collection
 * @module SchedulerCollection
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './schedulerModel.js'
], function (
    SpaceCollection,
    SchedulerModel
) {
    /**
     * SchedulerCollection definition.
     */
    var SchedulerCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/scheduler-management/schedulers";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        model: SchedulerModel,

        /**
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'schedulers.scheduler',
                accept: 'application/vnd.juniper.sd.scheduler-management.schedulers+json;version=1',
            });
        }
    });

    return SchedulerCollection;
});

