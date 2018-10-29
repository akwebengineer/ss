/**
 * Collection for getting devices 
 * 
 * @module natpoolsCollection
 * @author mdamodhar
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './natPoolsModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function(Backbone, SpaceCollection, Model,NATPolicyManagementConstants) {
    /**
     * natpoolsCollection definition.
     */
    var natpoolsCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = NATPolicyManagementConstants.NAT_POOLS_URL;

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
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'nat-pools.nat-pool',
                accept: NATPolicyManagementConstants.NAT_POOLS_ACCEPT_HEADER
            });
            
        }
  });

  return natpoolsCollection;
});
