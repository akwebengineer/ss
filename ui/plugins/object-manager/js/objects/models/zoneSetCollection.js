/** 
 * A Backbone collection for zone-sets
 *
 * @module ZoneSetCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './zoneSetModel.js'
], function(SpaceCollection, Model) {

    var ZoneSetCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/zoneset-management/zone-sets";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'zone-sets.zone-set',
                accept: 'application/vnd.juniper.sd.zoneset-management.zone-set-refs+json;version=1;q=0.01'
            });
        }
    });

    return ZoneSetCollection;
});