/**
 * Collection for getting security intelligence profiles
 *
 * @module SecintelProfileCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './secintelProfileModel.js'
], function(SpaceCollection, Model) {
    /**
     * SecintelProfileCollection defination.
     */
    var SecintelProfileCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/secintel-management/secintel-profiles";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'secintel-profiles.secintel-profile',
                accept: 'application/vnd.juniper.sd.secintel-management.secintel-profiles+json;version=1;q=0.01'
            });
        }
  });

  return SecintelProfileCollection;
});