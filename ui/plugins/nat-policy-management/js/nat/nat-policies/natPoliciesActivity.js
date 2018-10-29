/**
 * A module that implements a GridActivity for NAT Policies
 *
 * @module NatPoliciesActivity
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  '../../../../base-policy-management/js/policy-management/policies/basePoliciesActivity.js',
  './conf/natPolicyGridConfiguration.js',
  './models/natPolicyModel.js',
  './models/natPolicyCollection.js',
  './views/natPoliciesView.js',
  './views/natPolicyFormView.js',
  '../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
  './views/configureRuleSetsView.js',
  'text!../../../../base-policy-management/js/policy-management/rulename-template/constants/natRuleNameTemplate.json',
  './models/natRuleSetsModel.js',
  '../rules/controller/natRulesController.js'
], function (BasePoliciesActivity,GridConfiguration,Model,Collection,NatPoliciesView,NatPolicyFormView,
             PolicyManagementConstants,ConfigureRuleSetsView,NatRuleNameTemplateJson,
             NatRuleSetsModel, NATRulesController) {
  /**
   * Constructs a NatPoliciesActivity.
   */
  var NatPoliciesActivity = function () {
    BasePoliciesActivity.call(this, {policyManagementConstants: PolicyManagementConstants});
    this.collection = new Collection();
  };

  NatPoliciesActivity.prototype = Object.create(BasePoliciesActivity.prototype);
  NatPoliciesActivity.prototype.constructor = NatPoliciesActivity;


  _.extend(NatPoliciesActivity.prototype, BasePoliciesActivity.prototype, {

    controller: NATRulesController,
    gridConfiguration: GridConfiguration,
    policiesView: NatPoliciesView,
    createPolicyView: NatPolicyFormView,


    getNewModelInstance: function() {
      return new Model();
    },

    getNewCollectionInstance : function(){
      return new Collection();
    },

    getRuleNameTemplateJSON: function () {
      return NatRuleNameTemplateJson;
    },

    getRuleNameConstantStringLength: function () {
      return 31;
    },



    /**
     * @overridden from gridActivity
     * Bind the assign event to the grid context menu
     */
    bindEvents: function() {
      BasePoliciesActivity.prototype.bindEvents.call(this);
      this.bindConfigureRuleSetsEvent();
    },


    bindConfigureRuleSetsEvent: function() {
      this.events.configureRuleSetsEvent = {
        name: "configureRuleSetsEvent",
        capabilities: this.policyManagementConstants.MODIFY_CAPABILITY
      };
      this.view.$el.bind(this.events.configureRuleSetsEvent.name, $.proxy(this.onConfigureRuleSetsEvent, this));

    },

    onConfigureRuleSetsEvent: function() {
      var self = this,
          policyId = self.view.gridWidget.getSelectedRows()[0].id,
          extras = self.getIntent().getExtras();
      extras.size = 'wide';
      var ruleSetsModel = new NatRuleSetsModel();
      ruleSetsModel.url= self.policyManagementConstants.getRuleSetsUrl(policyId);
      ruleSetsModel.fetch({
        success: function (collection, response, options) {
          var view= new ConfigureRuleSetsView({
            activity: self,
            model:collection,
            policyId:policyId
          });
          self.buildOverlay(view, extras);
        },
        error: function (collection, response, options) {
          console.log('NAT RuleSets model not fetched');
        }
      });
    }

  });
  return NatPoliciesActivity;
});
