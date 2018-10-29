define([
    '../policyImportActivity.js',
    '../../../../../fw-policy-management/js/firewall/policies/constants/fwPolicyManagementConstants.js',
], function (Activity,Constants) {

    describe('Import policy Activity UT', function () {

        it('Checks if the activity object is created properly', function () {
            var policyOptions = {
            activity : new Slipstream.SDK.Activity()
        };
        policyOptions.activity.context = new Slipstream.SDK.ActivityContext();
         Activity.ImportPolicyActivityOverlay({
            activity: policyOptions.activity,
            params : {
              policyManagementConstants:Constants
            }
          }
        );
            Activity.should.exist;
        });
    });
});