/**
 * Collection for getting addresses 
 * 
 * @module PortSetsCollection
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './portSetsModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function(Backbone, SpaceCollection, Model,NATPolicyManagementConstants) {
    /**
     * PortSetsCollection definition.
     */
    var PortSetsCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = NATPolicyManagementConstants.PORT_SETS_URL;

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
                jsonRoot: 'port-sets.port-set',
                accept: NATPolicyManagementConstants.PORT_SETS_ACCEPT_HEADER
            });
            
        }
  });

  return PortSetsCollection;
});
