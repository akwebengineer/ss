/**
 * Model for getting time span widget
 * 
 * @module timeSpanModel
 * @author Slipstream Developers <athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(['../../../../ui-common/js/models/spaceModel.js'], function(SpaceModel) {

    var TimeSpanModel = SpaceModel.extend({
        urlRoot: '/api/juniper/ecm/log-scoop/time-aggregate',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'response.result',
                contentType: 'application/json'
            });
        }
    });

    return TimeSpanModel;
});









