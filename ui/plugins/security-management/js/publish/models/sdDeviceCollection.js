/**
 * Collection for getting SD Devices
 * 
 * @module sdDeviceCollection
 * @author vinayms@juniper.net
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './sdDeviceModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * sdDeviceCollection definition.
     */
    var sdDeviceCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/device-management/devices/";

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
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'devices.device',
                accept: 'application/vnd.juniper.sd.device-management.devices+json;version=2;q=0.02'
            });
            
        }
  });

  return sdDeviceCollection;
});
