/**
 * A Backbone model representing firewall Hits Per Device collection
 * @module FWHitsPerDeviceCollection
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  '../constants/fwRuleGridConstants.js'
], function (SpaceCollection, PolicyManagementConstants) {
    /**
     * HitsPerDeviceCollection definition.
     */
    var HitsPerDeviceCollection = SpaceCollection.extend({
        urlRoot: undefined,
        policyId: undefined,
        ruleId: undefined,

        initialize: function(policyId, ruleId, cuid) {

            this.policyId = policyId;
            this.ruleId = ruleId;
            this.urlRoot = PolicyManagementConstants.POLICY_URL;
            this.cuid = cuid;

            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'hitCountForDevice.hitCount',
                accept: PolicyManagementConstants.RULE_ACCEPT_HEADER,
                contentType: PolicyManagementConstants.RULE_CONTENT_HEADER
            });
        },

        sync: function (method, model, options) {
            switch (method) { // method = update | delete | read | create | patch
                case "read":
                    options.url = this.urlRoot + this.policyId +  
                        PolicyManagementConstants.RULE_DRAFT + "/" + this.ruleId + 
                        PolicyManagementConstants.DEVICE_HIT_COUNT + "?cuid="+this.cuid;
                    if (options.filter) {
                        options.url += "&_search=" + options.filter;
                    }
                break;
            }
            return SpaceCollection.prototype.sync.call(this, method, model, options);
        }
    });

    return HitsPerDeviceCollection;
});
