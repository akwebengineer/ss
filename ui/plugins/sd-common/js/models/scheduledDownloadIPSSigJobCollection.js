/** 
 * A Backbone collection for scheduled IPS/APP signature download jobs
 *
 * @module ScheduledDownloadIPSSigJobCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../ui-common/js/models/spaceCollection.js'
], function(SpaceCollection) {

    var ScheduledDownloadIPSSigJobCollection = SpaceCollection.extend({
        url: function() {
            var baseUrl = "/api/space/job-management/jobs";
            return baseUrl + "?filter=(job-type+contains+%27Download+IPS/Application+Signatures%27+and+mo-state+contains+%27SCHEDULED%27)";
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'jobs.job',
                accept: 'application/vnd.net.juniper.space.job-management.jobs+json;q="0.03";version="3"'
            });
        }
    });

    return ScheduledDownloadIPSSigJobCollection;
});
