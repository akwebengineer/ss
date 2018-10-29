/** 
 * A Backbone model representing a zone-set
 *
 * @module ZoneSetModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(SpaceModel) {

    var ZoneSetModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/zoneset-management/zone-sets',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'zone-set',
                accept: 'application/vnd.juniper.sd.zoneset-management.zone-set+json;version=1',
                contentType: 'application/vnd.juniper.sd.zoneset-management.zone-set+json;version=1;charset=UTF-8'
            });
        },

        parse: function(response) {
            response = SpaceModel.prototype.parse.call(this, response);

            // System default value (any) and responses from GET collection will not have the zones property
            response.zones = response.zones || '';

            response.zones = response.zones.split(',').map(function(item) {
                return {label: item, value: item};
            });

            return response;
        },

        toJSON: function() {
            var json = SpaceModel.prototype.toJSON.call(this);

            json[this.jsonRoot].zones = json[this.jsonRoot].zones.map(function(item) { 
                return item.value; 
            }).join(',');

            return json;
        }
    });

    return ZoneSetModel;
});