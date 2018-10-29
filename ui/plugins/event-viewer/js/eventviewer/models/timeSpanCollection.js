/**
 * @author Slipstream Developers  <athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(['../../../../ui-common/js/models/spaceCollection.js',  './timeSpanModel.js'
       ], function (SpaceCollection, TimeSpanModel) {
    
    var TimeSpanCollection = SpaceCollection.extend({
        url: '/api/juniper/ecm/log-scoop/time-aggregate',
        model: TimeSpanModel,

        initialize: function() {
            SpaceCollection.prototype.initialize.call(this, {
                "jsonRoot": 'response.result',
                "contentType":"application/json"
            });
        }

    });

    return TimeSpanCollection;
});
