/**
 * Model for rule
 *
 * @module RuleModel
 * @author mdevabhaktuni
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleModel.js',
  '../constants/natRuleGridConstants.js'
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
    getNatType : function () {
      var me = this;
      return me.get("nat-type");
    },    
    getTranslationType : function () {
      var me = this,
      translatedPacket = me.get('translated-packet');
      if(translatedPacket) {
        return translatedPacket['translated-traffic-match-type'];
      }
      return null;
    },
    getTranslatedPacket : function () {
      var me = this;
      return me.get('translated-packet');
    },
    getTranslationAddress : function () {
      var me = this,
      translatedPacket = me.get('translated-packet');
      if(translatedPacket) {
        return translatedPacket['translated-address'];
      }
      return null;
    },
    getTranslationNatPool : function () {
      var me = this,
      translatedPacket = me.get('translated-packet');
      if(translatedPacket) {
        return translatedPacket['pool-addresses'];
      }
      return null;
    },
    getSourceAddress : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['src-address']['address-reference'];
      }
      return null;
    },
    getDestinationAddress : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['dst-address']['address-reference'];
      }
      return null;
    },
    getServiceData : function() {
      var me = this,
      natServices = me.get('services');
      if(natServices) {
        return natServices['service-reference'];
      }
      return null;
    },
    getServiceSourcePortSets : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['src-port-sets']['reference'];
      }
      return null;
    },
    getServiceDestinationPortSets : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['dst-port-sets']['reference'];
      }
      return null;
    },
    getServiceProtocolData : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['protocol']['protocol-data'];
      }
      return null;
    },
    getServices : function () {
      var me = this;
      return me.get('services');
    },
    getOriginalPacket : function () {
      var me = this;
      return me.get('original-packet');
    },
    getServiceDestinationPorts : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['dst-ports'];
      }
      return null;
    },
    getServiceSourcePorts : function() {
      var me = this,
      originalPacket = me.get('original-packet');
      if(originalPacket) {
        return originalPacket['src-ports'];
      }
      return null;
    }
  });

  return RuleModel;
});