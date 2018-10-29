/**
 * A Backbone Collection for zones per policy.
 *
 * @module zoneCollection
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  './zoneSetPerPolicyModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceCollection, ZoneModel, PolicyManagementConstants) {

  
  var ZoneCollection = SpaceCollection.extend({
    model: ZoneModel,

    url: function(filter) {        
        return this.url;
    },

    initialize: function (options) {
        this.url = options.url;
        SpaceCollection.prototype.initialize.call(this, {
            jsonRoot: 'zones.zone',
            accept: "application/vnd.juniper.sd.policy-management.nat.zones+json;version=1;q=0.01",
          //  accept: 'application/vnd.juniper.sd.utm-management.security-device-refs+json;version=1'
        });
    }

  });

  return ZoneCollection;
});

