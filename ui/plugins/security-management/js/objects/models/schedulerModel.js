
/** 
 * A Backbone model representing scheduler (/api/juniper/sd/scheduler-management/schedulers).
 *
 * @module schedulerModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /** 
     * schedulerModel definition.
    */
    var schedulerModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/scheduler-management/schedulers',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'scheduler',
                accept: 'application/vnd.juniper.sd.scheduler-management.scheduler+json;version=1',
                contentType: 'application/vnd.juniper.sd.scheduler-management.scheduler+json;version=1;charset=UTF-8'
            });
        }
    });

    return schedulerModel;
});