/**
 * Collection for getting routinginstances 
 * 
 * @module routingCollection
 * @author mdamodhar
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './routingInstanceModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * routingCollection definition.
     */
    var routingCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/device-management/devices/"+this.id+"/routing-instances";

            if (Array.isArray(filter)) {
                // Multiple filters support
                var tmpUrl = baseUrl + "?filter=(";

                for (var i=0; i<filter.length; i++) {
                    tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                    if (i !== filter.length-1) {
                        tmpUrl += " and ";
                    }
                }
                tmpUrl += ")";

                return tmpUrl;
            } else if (filter) {
                // single filter
                return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function (options) {
            this.id = options.id;
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'routing-instances.routing-instance',
                accept: "application/vnd.juniper.sd.device-management.routing-instances+json;q=0.01;version=1"
            });
            
        }
  });

  return routingCollection;
});
