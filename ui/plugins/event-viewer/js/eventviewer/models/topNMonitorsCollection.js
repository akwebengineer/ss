/**
 * Collection for TopNMonitors
 *
 * @module MonitorsView[EventViewer]
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/spaceCollection.js', './topNMonitorsModel.js'
], function(
    SpaceCollection, MonitorsModel
) {
    /**
     * TopNMonitors Collection definition.
    */
    var TopNMonitorsCollection = SpaceCollection.extend({
        model: MonitorsModel,
        url: '/api/juniper/ecm/log-scoop/aggregate',
        comparator: function(a, b) {
            a = a.get("rank");
            b = b.get("rank");
            return a > b ? 1 : a < b ? -1 : 0;
        },        
        initialize: function() {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'response.result',
                contentType: 'application/json'
            });
        }
    });

    return TopNMonitorsCollection;
});