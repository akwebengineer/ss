define([
  'widgets/form/formWidget',
  '../conf/ruleCompareFormConfig.js',
  'widgets/overlay/overlayWidget',
  '../../eventviewer/views/policyDiffView.js',
  '../../../../fw-policy-management/js/firewall/policies/constants/fwPolicyManagementConstants.js',
  '../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
  '../../eventviewer/policyjump/LogsToPoliciesSwitcher.js'
], function(FormWidget, FormConfig, OverlayWidget, ComparePolicyView, FirewallPolicyConstants, NATPolicyConstants, LogsToPoliciesSwitcher) {

  var RuleCompareView = Backbone.View.extend({
    events : {
      "click #comparepolicy" : "doPolicyCompare"
    },

    initialize : function(options) {
        var me = this;
        me.diffXml = options.diffxml;
        me.activity = options.activity;
        me.context = options.context;
        me.params = options.params;
        me.selectedObj = options.obj;
        me.policyDetails = options.policyDetails;
    },

    render : function() {
        var me = this, formWidget = new FormWidget({
          container : me.el,
          elements : new FormConfig(me.context).getValues()
        }).build();
        me.$el.find('.section_content').append(me.diffXml);
        //
        if(me.policyDetails["design-version"] === -1){//in case of rule delete
          me.$el.find("#comparepolicy").prop("disabled", true).addClass("disabled");
          me.$el.find("#currentrule").prop("disabled", true).addClass("disabled");
        }
        //
        return me;
    },

    doPolicyCompare : function(e) {
      var me = this, policyId = me.policyDetails['policy-id'].split(':')[1],
      type = me.policyDetails['policy-type'] == 'NAT' ? 'nat' : 'fw',
      comparePolicyView,
      params = {
        id : policyId,
        record1 : {
          'snapshot-version' : me.policyDetails['device-version'] 
        },
        record2 : {
          'snapshot-version' : me.policyDetails['design-version'] 
        },
        selectedRow : {
          'name' : me.policyDetails['policy-name'],
          'id' : policyId
        }
      };

      if (me.policyDetails['policy-type'].toLowerCase() === 'firewall') {
        params.policyManagementConstants = FirewallPolicyConstants;
      }
      else if (me.policyDetails['policy-type'].toLowerCase() === 'nat') {
        params.policyManagementConstants = NATPolicyConstants;
      }

      comparePolicyView = new ComparePolicyView({
        parentView : me.activity,
        params : params
      });
      
      comparePolicyView.doCompare();
    }
  });

  return RuleCompareView;
});