/**
 * A module that implements a Slipstream Activity for Application Firewall Policy Rules
 *
 * @module AppFwRulesActivity
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  '../../../../../base-policy-management/js/policy-management/rules/baseRulesActivity.js',
    '../AppFwConstants.js',
    './controller/AppFwRuleController.js'
], function (BaseRulesActivity, AppFwRuleConstants, AppFwRuleController) {
    /**
     * Constructs a AppFwRulesActivity.
     */

    var AppFwRulesActivity = function () {
        BaseRulesActivity.call(this);
        this.policyManagementConstants = AppFwRuleConstants;
        this.controller = AppFwRuleController;

        this.onListIntent = function () {
            var self = this;
            self.policyId = self.getIntent().getExtras().data;
            self.context = self.context;
            self.cuid = self.getIntent().getExtras().cuid;

            $.ajax({
                url: self.policyManagementConstants.POLICY_GET_URL + self.policyId,
                type: 'GET',
                headers: {
                Accept: self.policyManagementConstants.POLICY_ACCEPT_HEADER
                },
                success: function (data) {
                    self.policyObj = data["app-fw-policy"];
                    var controller = new self.controller({context:self.context, policyObj:self.policyObj, cuid : self.cuid});
                    self.setContentView(controller.view);
                },
                error: function () {
                    console.log("call to fetch policy in appfirewall rules activity failed");
                }
            });
        };
    };

    AppFwRulesActivity.prototype = Object.create(BaseRulesActivity.prototype);
    AppFwRulesActivity.prototype.constructor = AppFwRulesActivity;

    return AppFwRulesActivity;
});