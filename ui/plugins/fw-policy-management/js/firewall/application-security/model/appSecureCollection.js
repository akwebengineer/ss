/**
 * Collection for getting Appsecure collection
 * 
 * @module AppSecureCollection
 * @author Ramesh Aviligonda <ramesha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './AppSecureModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * AddressCollection definition.
     */
    var appSecureCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter, connective) {
            var baseUrl = "/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies";

            if (Array.isArray(filter)) {
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
                jsonRoot: 'app-fw-policies.app-fw-policy',
                accept: 'application/vnd.juniper.sd.app-fw-policy-management.app-fw-policies+json;version=1;q=0.01',
                contentType: "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;charset=UTF-8"
            });
            
        }
  });

  return appSecureCollection;
});
