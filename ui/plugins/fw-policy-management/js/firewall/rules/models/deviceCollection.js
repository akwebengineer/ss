/**
 * Collection for getting Devices
 * 
 * @module DeviceCollection
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './deviceModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * DeviceCollection definition.
     */
    var DeviceCollection = SpaceCollection.extend({
        model: Model,
        url: function() {
            return this.url;
        },
        // url: function(filter) {
        //     var baseUrl = "/api/juniper/sd/policy-management/firewall/policies/33219/src-identities";
        //     return baseUrl;
        // },

        initialize: function (options) {
            this.url = options.url;
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'devices.device',
                accept: 'application/vnd.juniper.sd.policy-management.devices+json;version=2;q=0.02'
            });
        }
  });

  return DeviceCollection;
});