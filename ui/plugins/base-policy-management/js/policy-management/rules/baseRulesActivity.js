/**
 * A module that implements a Slipstream Activity for Firewall Policy Rules
 *
 * @module BaseRulesActivity
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    './controller/baseRuleController.js',
  './util/ruleGridConstants.js'
], function ( BaseRulesController, RuleGridConstants) {
    /**
     * Constructs a BaseRulesActivity.
     */

    var BaseRulesActivity = function () {
        this.policyManagementConstants = RuleGridConstants;
        this.controller = BaseRulesController;
        Slipstream.SDK.Activity.call(this);


        this.onStart = function () {
            switch (this.getIntent().action) {
                case Slipstream.SDK.Intent.action.ACTION_LIST:
                    this.onListIntent();
                    break;
                default:
                    this.onListIntent();
            }
        };

        this.onListIntent = function () {
            var self = this;
            self.policyId = self.getIntent().getExtras().data;
            self.launchWizard = self.getIntent().getExtras().launchWizard;
            self.context = self.context;
            self.cuid = self.getIntent().getExtras().cuid;

            //load the policy object using the policyId passed from the policy view
            //TODO add code to handle the filter being passed from the globalsearch
            $.ajax({
                url: self.policyManagementConstants.POLICY_URL + self.policyId,
                type: 'GET',
                headers: {
                Accept: self.policyManagementConstants.POLICY_ACCEPT_HEADER
                },
                success: function (data) {
                    self.policyObj = data["policy"];
                    var controller = new self.controller({context:self.context, policyObj:self.policyObj, launchWizard:self.launchWizard, cuid:self.cuid});
                    self.setContentView(controller.view);
                },
                error: function () {
                    console.log("call to fetch policy in base rules activity failed");
                }
            });
        };
    };

    BaseRulesActivity.prototype = new Slipstream.SDK.Activity();

    return BaseRulesActivity;
});