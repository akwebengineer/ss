/**
 * Model for rule
 *
 * @module RuleModel
 * @author mamata
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleModel.js',
  '../constants/ipsRuleGridConstants.js'
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

    /**
     * TODO: Temporaryfix. Remove when backend fixes return type for ips-type
     *
     * @param {Object} response - JS object from ReST call
     */
    parse: function(response) {
      if (response && response["ips-type"] === "0") {
        response["ipsType"] = "IPS";
      } else if(response && response["ips-type"] === "1"){
        response["ipsType"] = "Exempt";
      }else if(response && response["ips-type"]){
        response["ipsType"] = response["ips-type"];
      }
      return response;
    }
  });

  return RuleModel;
});