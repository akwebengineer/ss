/**
 * Collection for getting addresses
 *
 * @module ZonesCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './zonesModel.js',
    '../../../../../fw-policy-management/js/firewall/rules/constants/fwRuleGridConstants.js'
], function(Backbone, SpaceCollection, Model, PolicyManagementConstants) {
    /**
     * ZonesCollection definition.
     */
    var ZonesCollection = SpaceCollection.extend({
        model: Model,
        urlRoot: "",
        isGlobalRule: false,

        url: function() {
            this.url = this.urlRoot + "?isGlobalRule=" + this.isGlobalRule;
            return this.url;
        },

        initialize: function (options) {
            this.urlRoot = options.urlRoot;
            this.url = this.url();
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'Zones.zone',
                accept: options.acceptHeader
            });
        },

        setGlobalRule: function(isGlobal) {
            if (isGlobal !== undefined) {
                isGlobalRule= isGlobal;
                this.url = this.urlRoot + "?isGlobalRule=" + isGlobalRule;
            }
        }
  });

  return ZonesCollection;
});