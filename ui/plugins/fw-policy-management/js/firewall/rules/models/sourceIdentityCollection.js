/**
 * Collection for getting Source Identity
 * 
 * @module SourceIdentityCollection
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './sourceIdentityModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * SourceIdentityCollection definition.
     */
    var SourceIdentityCollection = SpaceCollection.extend({
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
                jsonRoot: 'SrcIdentityList.srcIdentities',
                accept: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8'
            });
        }
  });

  return SourceIdentityCollection;
});