/**
 * A Backbone Collection for interfaces per policy.
 *
 * @module interfaceCollection
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  './interfacesPerPolicyModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceCollection, InterfaceModel, PolicyManagementConstants) {

  
  var InterfaceCollection = SpaceCollection.extend({
    model: InterfaceModel,

    url: function(filter) {        
        return this.url;
    },

    initialize: function (options) {
        this.url = options.url;
        SpaceCollection.prototype.initialize.call(this, {
            jsonRoot: 'interfaces.interface',
            accept: "application/vnd.juniper.sd.policy-management.nat.interfaces+json;version=1;q=0.01",
          //  accept: 'application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1'
        });
    }

  });

  return InterfaceCollection;
});

