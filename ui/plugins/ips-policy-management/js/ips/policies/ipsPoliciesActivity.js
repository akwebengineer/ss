/**
 * A module that implements a GridActivity for IPS Policies
 *
 * @module IpsPoliciesActivity
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  '../../../../base-policy-management/js/policy-management/policies/basePoliciesActivity.js',
  './conf/ipsPolicyGridConfiguration.js',
  './models/ipsPolicyModel.js',
  './models/ipsPolicyCollection.js',
  './views/ipsPoliciesView.js',
  './views/ipsPolicyFormView.js',
  'text!../../../../base-policy-management/js/policy-management/rulename-template/constants/ipsRuleNameTemplate.json',
  '../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js',
  '../rules/controller/ipsRulesController.js'
], function (BasePoliciesActivity, GridConfiguration, Model, Collection,
             IpsPoliciesView, IpsPolicyFormView,IpsRuleNameTemplateJson,PolicyManagementConstants,
             IPSRulesController) {
  /**
   * Constructs a IpsPoliciesActivity.
   */
  var IpsPoliciesActivity = function () {
    BasePoliciesActivity.call(this, {policyManagementConstants: PolicyManagementConstants});
    this.collection = new Collection();
  };

  IpsPoliciesActivity.prototype = Object.create(BasePoliciesActivity.prototype);
  IpsPoliciesActivity.prototype.constructor = IpsPoliciesActivity;


  _.extend(IpsPoliciesActivity.prototype, BasePoliciesActivity.prototype, {

    controller: IPSRulesController,
    gridConfiguration: GridConfiguration,
    policiesView: IpsPoliciesView,
    createPolicyView: IpsPolicyFormView,


    getNewModelInstance: function() {
      return new Model();
    },

    getNewCollectionInstance : function(){
      return new Collection();
    },

    isDisabledEdit: function(eventName, selectedRows) {
      var me = this, isDisableEdit = BasePoliciesActivity.prototype.isDisabledEdit.call(me, eventName, selectedRows);
      if (isDisableEdit) {
        return isDisableEdit;
      }
      selectedRows = me.getRecordsFromPolicyCollection(selectedRows);

      return _.isEmpty(selectedRows);
    },


    getRuleNameTemplateJSON: function () {
      return IpsRuleNameTemplateJson;
    },

    getRuleNameConstantStringLength: function () {
      return 63;
    }

  });

  return IpsPoliciesActivity;
});
