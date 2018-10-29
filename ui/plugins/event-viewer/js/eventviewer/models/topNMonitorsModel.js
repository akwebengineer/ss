/**
 * Model for TopNMonitors
 *
 * @module MonitorsView[EventViewer]
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * TopNMonitors Model definition.
    */
    var TopNMonitorsModel = SpaceModel.extend({
        defaults:{
            "rank": 0
        },
        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'response.result',
                contentType: 'application/json'
            });
        }
    });
    return TopNMonitorsModel;
});