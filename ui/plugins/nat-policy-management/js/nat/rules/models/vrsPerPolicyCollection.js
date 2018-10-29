/**
 * A Backbone Collection for routing instances per policy.
 *
 * @module vrsCollection
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  './vrsPerPolicyModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceCollection, VRModel, PolicyManagementConstants) {

  
  var VRsCollection = SpaceCollection.extend({
    model: VRModel,

    url: function(filter) {        
        return this.url;
    },

    initialize: function (options) {
        this.url = options.url;
        SpaceCollection.prototype.initialize.call(this, {
            jsonRoot: 'virtual-routers.virtual-router',
            accept: "application/vnd.juniper.sd.policy-management.nat.virtual-routers+json;version=1;q=0.01",
          //  accept: 'application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1'
        });
    }

  });

  return VRsCollection;
});

