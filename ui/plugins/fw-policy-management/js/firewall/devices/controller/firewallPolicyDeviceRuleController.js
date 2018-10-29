/*
 Firewall rule grid controller
 */
define([
  '../../rules/controller/fwRulesController.js',
  '../constants/firewallPolicyDeviceConstants.js',
  '../models/firewallRuleDeviceCollection.js',
  '../views/firewallRulesDeviceView.js' 
],function(FirewallRulesController, PolicyManagementConstants,
  RuleCollection, FirewallRulesView){

  var FWRuleDeviceController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, FirewallRulesView);
  };

  _.extend(FWRuleDeviceController.prototype, FirewallRulesController.prototype, {

    ENABLE_LOCKING: false,

    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
      var me = this, policy = me.policyObj,  policyID = policy.id;
      FirewallRulesController.prototype.initialize.apply(this, arguments);
      //this.reloadHitCount();
    },

    //need to override inorder to avoid call to check for copied rules as this view is read only
    checkCopiedRules:function(){
    },


    //need to override inorder to avoid call to load the device object which is not required
    reloadPolicyObject: function(){}

  });

  return FWRuleDeviceController;
});