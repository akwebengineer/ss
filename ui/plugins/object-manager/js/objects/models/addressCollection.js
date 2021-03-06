/**
 * Collection for getting addresses 
 * 
 * @module AddressCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './addressModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * AddressCollection definition.
     */
    var AddressCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter, connective) {
            var baseUrl = "/api/juniper/sd/address-management/addresses";

            if (Array.isArray(filter)) {
                if (filter.length === 0) {
                    return baseUrl;
                }

                connective = connective || "and";
                // Multiple filters support
                var tmpUrl = baseUrl + "?filter=(";

                for (var i=0; i<filter.length; i++) {
                    tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                    if (i !== filter.length-1) {
                        tmpUrl += " "+ connective +" ";
                    }
                }
                tmpUrl += ")";

                return tmpUrl;
            } else if (Object.prototype.toString.call(filter) === "[object String]") {
                return baseUrl + "?filter=(" + filter + ")";
            } else if (filter) {
                // single filter
                return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'addresses.address',
                accept: 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
            });
            
        }
  });

  return AddressCollection;
});
