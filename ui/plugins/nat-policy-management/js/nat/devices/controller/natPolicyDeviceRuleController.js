/*
 NAT rule grid controller
 */
define([
  '../../rules/controller/natRulesController.js',
  '../constants/natPolicyDeviceConstants.js',
  '../models/natRuleDeviceCollection.js',
  '../views/natRulesDeviceView.js' 
],function(NATRuleController, PolicyManagementConstants,
  RuleCollection, NATRulesView){

  var NATRuleDeviceController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, NATRulesView);
  };

  _.extend(NATRuleDeviceController.prototype, NATRuleController.prototype, {

    ENABLE_LOCKING: false,

    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
      var me = this, policy = me.policyObj,  policyID = policy.id;
      NATRuleController.prototype.initialize.apply(this, arguments);
      //this.reloadHitCount();
    },

    //need to override inorder to avoid call to check for copied rules as this view is read only
    checkCopiedRules:function(){
    },
    //need to override inorder to avoid call to load the device object whihc is not required
    reloadPolicyObject: function(){},
    //need to override to do nothing
    setActionEventsCapabilities: function() {}
  });

  return NATRuleDeviceController;
});