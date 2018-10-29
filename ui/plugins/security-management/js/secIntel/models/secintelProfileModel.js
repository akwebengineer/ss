
/**
 * A Backbone model representing security intelligence profile (/api/juniper/sd/secintel-management/secintel-profiles/).
 *
 * @module SecintelProfileModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * SecintelProfileModel definition.
    */
    var SecintelProfileModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/secintel-management/secintel-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'secintel-profile',
                accept: 'application/vnd.juniper.sd.secintel-management.secintel-profile+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.secintel-management.secintel-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return SecintelProfileModel;
});
