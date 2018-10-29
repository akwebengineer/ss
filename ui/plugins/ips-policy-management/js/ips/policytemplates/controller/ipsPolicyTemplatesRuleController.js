/*
 * IpsPolicyTemplatesRule rule grid controller
 */
define([
  'widgets/overlay/overlayWidget',
  '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
  '../constants/ipsTemplateRuleGridConstants.js',
  '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js',
  '../models/ipsPolicyTemplatesRuleCollection.js',
  '../../rules/views/ipsRulesView.js',
  '../../rules/controller/ipsRulesController.js',
  '../views/ipsPolicyTemplatesRuleGridView.js'
],function(OverlayWidget, BaseController, PolicyManagementConstants, ZonesCollection, RuleCollection,
           IPSRulesView,IpsRulesController,IpsPolicyTemplatesRulesView){

  var IpsPolicyTemplatesRuleController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, IpsPolicyTemplatesRulesView);
  }

  _.extend(IpsPolicyTemplatesRuleController.prototype, IpsRulesController.prototype, {

    ENABLE_LOCKING: false,

    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
      var me = this, policy = me.policyObj,  policyID = policy.id;
      BaseController.prototype.initialize.apply(this, arguments);
      me.zonesCollection = new ZonesCollection({urlRoot: PolicyManagementConstants.POLICY_URL + policyID + "/zones"});
    },

    getPolicyObject : function(data){
      return data && data["policy-template"] && data["policy-template"]["id"]? data["policy-template"] : undefined;
    },

    checkEditors : function(editRow, currentRule) {
       var self = this, ipsRuleType = "";

       if(!$.isEmptyObject(currentRule)){
          ipsRuleType = currentRule.get("ipsType");
        }
        if (ipsRuleType == PolicyManagementConstants.EXEMPT) {
             self.removeEditor(editRow,"notification");
             self.removeEditor(editRow,"ipaction");
             self.removeEditor(editRow,"additional");
             self.removeEditor(editRow,"action-data.action");
        }       
    },
    
      saveAsPolicyYesButtonCallback : function(){
        var self = this;
        var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE,
                      {
                          mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
                      }
                );
                intent.putExtras({id: self.policyObj.id, mode:"SAVE_AS", cuid:self.cuid});
                self.view.context.startActivityForResult(intent);
      },
  });
  return IpsPolicyTemplatesRuleController;
});