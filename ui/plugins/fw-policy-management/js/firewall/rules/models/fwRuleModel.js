/**
 * Model for rule
 *
 * @module RuleModel
 * @author mbetala
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleModel.js',
  '../constants/fwRuleGridConstants.js'
], function (BaseModel, PolicyManagementConstants) {

  var RuleModel = BaseModel.extend({
    initialize: function () {
      // initialize base object
      BaseModel.prototype.initialize.call(this, {
        // jsonRoot: 'firewall-policy',
        accept: PolicyManagementConstants.RULE_ACCEPT_HEADER,
        contentType: PolicyManagementConstants.RULE_CONTENT_HEADER
      });
    },

    isGlobalRule: function() {
      return this.get('global-rule') === true;
    },
    getSourceAddress : function () {
      return this.get('source-address');
    },
    getDestinationAddress : function () {
      return this.get('destination-address');
    },
    getSourceAddressRefs : function () {
      return this.get('source-address') ['addresses']['address-reference'];
    },
    getDestinationAddressRefs : function () {
      return this.get('destination-address') ['addresses']['address-reference'];
    },
    isSourceNegateAddress : function () {
      return this.get('source-address')['exclude-list'];
    },
    isDestinationNegateAddress : function () {
      return this.get('destination-address')['exclude-list'];
    },
    getService : function () {
      return this.get('services');
    },
    getServiceRefs : function () {
      return this.get('services')['service-reference'];
    },
    getSourceZone : function () {
      return this.get('source-zone')
    },
    getDestinationZone : function () {
      return this.get('destination-zone')
    },
    getSourceZoneItems : function () {
      return this.get('source-zone')['zone'];
    },
    getDestinationZoneItems : function () {
      return this.get('destination-zone')['zone'];
    }

  });

  return RuleModel;
});