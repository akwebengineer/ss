define([
    'widgets/overlay/overlayWidget',
    '../views/ruleChangeView.js',
    '../views/ruleCompareView.js',
    '../views/policyCompareDialog.js',
    '../views/policyDiffView.js'
], function(OverlayWidget, RuleChangeView, RuleCompareView, PolicyCompareDialog, PolicyDiffView) {
      var LogsToPoliciesSwitcher = function(options) {
      this.context = options.context;
      this.activity = options.context.module;
  };
  $.extend(LogsToPoliciesSwitcher.prototype, {
      processEventLog : function(policyVersionDetails, refView) {
        var me = this;
        me.refView = refView;
        me.showRuleChangeView(policyVersionDetails);
      },

      closerForOverlay : function(overlayObj, btnName) {
        overlayObj.getOverlay().$el.find('#'+(btnName ? btnName : 'close')).on('click', function(e) {
          e.preventDefault();
          overlayObj.destroy();
        });
      },

      showRuleChangeView : function(policyVersionDetails) {
          var me = this,
          ruleChangedOverlay = new OverlayWidget({
              view: new RuleChangeView(),
              type: 'xsmall'
          }).build();
          me.closerForOverlay(ruleChangedOverlay);

          ruleChangedOverlay.getOverlay().$el.find('#comparerule').on('click', function(e) {
              e.preventDefault();
              ruleChangedOverlay.destroy();
              me.showRuleCompareView(policyVersionDetails);
          });

          ruleChangedOverlay.getOverlay().$el.find('#currentrule').on('click', function(e) {
              e.preventDefault();
              me.showCurrentRule(policyVersionDetails);
              ruleChangedOverlay.destroy();
          });
      },

      showCurrentRule : function(response) {
          var me = this, filters, filterStr, policyType = response['policy-version-details']['policy-type'].toLowerCase();
          filters = 'RuleName = ' + response['policy-version-details']['rule-name'];

          switch(policyType) {
              case 'firewall':
                  filters += false === response['policy-version-details']['is-global'] ? ' and SrcZone = ' + response['policy-version-details']['from-zone'] + ' and DstZone = ' + response['policy-version-details']['to-zone'] : '';
                  break;
              case 'nat':
                  if(response['policy-version-details']['nat-type'] === 'Source NAT') {
                      filters += ' and dcNatRuleType = STATIC, SOURCE';
                  }
                  else if(response['policy-version-details']['nat-type'] === 'Destination NAT') {
                      filters += ' and dcNatRuleType = STATIC, DESTINATION';
                  }
                  else if(response['policy-version-details']['nat-type'] === 'Static NAT') {
                      filters += ' and dcNatRuleType = STATIC';
                  }
                  break;
              default: break;
          }

          filterStr = filters.replace("(", "").trim().replace(")","").trim().replace(/eq/g,"=").replace(/'/g, "");
          filterTokens = filterStr.split("and");
          me.refView.gridWidgetObject.search(filterTokens);
      },

      showRuleCompareView : function(responsePolicyVersionDetails) {
          var me = this,
          onSuccessGetRuleDiff = function(response, status) {
              overlayWidgetRuleCompare = new OverlayWidget({
                view : new RuleCompareView({
                  diffxml : response['policy-version-details']['diff-text'],
                  activity : me.activity,
                  context : me.context,
                  policyDetails : response['policy-version-details']
                }),
                type : 'xlarge',
              }).build();
              me.closerForOverlay(overlayWidgetRuleCompare);

              overlayWidgetRuleCompare.getOverlay().$el.find('#currentrule').on('click', function(e) {
                e.preventDefault();
                me.showCurrentRule(response);
                overlayWidgetRuleCompare.destroy();
              });
          },
          onErrorGetRuleDiff = function(response, status) {
              console.log(response);
          };
          me.getRuleDiff(responsePolicyVersionDetails, onSuccessGetRuleDiff, onErrorGetRuleDiff);
      },

      getRuleDiff : function(requestObj, onSuccess, onError) {
          var policyType = requestObj['policy-version-details']['policy-type'];
          requestObj['policy-version-details'].date = new Date(requestObj['policy-version-details']['date']).toString();
          $.ajax({
              url : '/api/juniper/sd/policy-management/' + policyType.toLowerCase() + '/rule-version-handler/process-rule-diff?rule-version-uuid=' + Slipstream.SDK.Utils.url_safe_uuid(),
              headers : {
                  "Accept" : "application/vnd.jssdk.sd.process-rule-dif-response+json;version=1;q=0.01",
                  "Content-Type" : "application/vnd.jssdk.sd.process-rule-dif-request+json;version=1;charset=UTF-8"
              },
              method: "POST",
              data: JSON.stringify(requestObj),
              success: function(response, status) {
                  onSuccess(response);
              },
              error: function(response, status) {
                  onError(response);
              },
              complete: function(response, status) {
              }
          });
      }
  });

  return LogsToPoliciesSwitcher;

});