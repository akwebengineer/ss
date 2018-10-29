/**
 *
 *
 * @module PolicyHitstActivity
 * @copyright Juniper Networks, Inc. 2015
 **/
define(
    [
      'backbone',
      'widgets/overlay/overlayWidget',
      './constants/PolicyHitsConstants.js',
      '../../../../security-management/js/jobs/JobDetailedView.js',
      'widgets/confirmationDialog/confirmationDialogWidget',
      '../policies/constants/fwPolicyManagementConstants.js'
    ],

    function (Backbone, OverlayWidget,PolicyHitsConstants,JobDetailedView, ConfirmationDialogWidget, PolicyManagementConstants) {

      var PolicyHitsActivity = {

        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
          new Slipstream.SDK.Notification()
              .setText(message)
              .setType(type)
              .notify();
        },

        overlayLaunch: function(policyOptions){
          var url = "", self = this;
          var selectedPolicy = policyOptions.params.selectedPolicy;
          var context = policyOptions.activity.getContext();
          var policyType = policyOptions.activity.collection.get(selectedPolicy.id).get('policy-type');  //TODO Need to find better option
          var postReqData = {
            "policy-reference" :{
              "policy-id":selectedPolicy.id,
              "policy-type":policyType
            }
          };
          if(policyOptions.params.opType == PolicyManagementConstants.POLICY_LATEST_HITS){
            $.ajax( {
              url: PolicyHitsConstants.POLICY_HITS_URL,
              type: "post",
              dataType: "json",
              headers: {
                'content-type': PolicyHitsConstants.POLICY_HITS_CONTENT_HEADER,
                'accept': PolicyHitsConstants.POLICY_HITS_ACCEPT_HEADER
              },
              data: JSON.stringify(postReqData),

              success: function(data, status) {
                var moid = data["monitorable-task-instance-managed-object"]["moid"];
                var jobid = moid.split(":")[1];
                var jobObj = {"id" : jobid};
                var jobView = new JobDetailedView();
                jobView.showPolicyHitsJobDetailsScreen({
                  job : jobObj,
                  activity : policyOptions.activity
                });
              },
              error: function() {
                console.log("Probe latest policy hits failed");
              }
            } );
          }else if(policyOptions.params.opType == PolicyManagementConstants.RESET_POLICY_HITS){
            var OkButtonCallback = function () {
              confirmationDialogWidget.destroy();
              $.ajax( {
                url: PolicyHitsConstants.RESET_POLICY_HITS_URL,
                type: "post",
                dataType: "json",
                headers: {
                  'content-type': PolicyHitsConstants.POLICY_HITS_CONTENT_HEADER
                },
                data: JSON.stringify(postReqData),
                success: function(data, status) {
                  self.notify('success', context.getMessage('reset_success'));
                },
                error: function() {
                  self.notify('error', context.getMessage('reset_error'));
                }
              } );
            };

            var cancelButtonCallback = function () {
              confirmationDialogWidget.destroy();
            };

            var conf = {
              title: context.getMessage('reset_hits'),
              question: context.getMessage('reset_question'),
              yesButtonLabel: context.getMessage('reset_button'),
              yesButtonCallback: OkButtonCallback,
              noButtonLabel: context.getMessage('cancel'),
              noButtonCallback: cancelButtonCallback,
              kind: 'warning'
            };
            var confirmationDialogWidget = new ConfirmationDialogWidget(conf);
            confirmationDialogWidget.build();
          }
        }
      };
      return PolicyHitsActivity;
    });