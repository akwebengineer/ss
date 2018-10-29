/*
 IPS rule grid controller
 */
define([
  '../../rules/controller/ipsRulesController.js',
  '../constants/ipsPolicyDeviceConstants.js',
  '../models/ipsRuleDeviceCollection.js',
  '../views/ipsRulesDeviceView.js' 
],function(IPSRulesController, PolicyManagementConstants,
  RuleCollection, IPSRulesView){

  var IPSRuleDeviceController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, IPSRulesView);
  };

  _.extend(IPSRuleDeviceController.prototype, IPSRulesController.prototype, {

    ENABLE_LOCKING: false,

    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
      var me = this, policy = me.policyObj,  policyID = policy.id;
      IPSRulesController.prototype.initialize.apply(this, arguments);
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

  return IPSRuleDeviceController;
});