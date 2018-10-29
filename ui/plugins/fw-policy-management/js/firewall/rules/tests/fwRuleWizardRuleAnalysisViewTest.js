
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardRuleAnalysisView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardRuleAnalysisView, RuleModel) {
    describe("FW rule Create Wizard unit-tests", function () {

        var fwRuleWizardRuleAnalysisView,
            ruleModel,
            context = new Slipstream.SDK.ActivityContext(),
            CUID = 'MTRkNjI5NzctNmJkMS00ODdhLWE4NTEtMmU0MGM0NTliY2M0',
            policyObj = {
                "created-by-user-name": "super",
                "created-time": 1461174353456,
                "description": "",
                "domain-id": 2,
                "edit-version": 4,
                "id": 1671169,
                "last-modified-by-user-name": "super",
                "last-modified-time": 1461175308807,
                "name": "p2",
                "policy-order": 0,
                "policy-position": "DEVICE",
                "policy-profile": {},

                "policy-state": "FINAL",
                "policy-type": "DEVICE",
                "publish-state": "NOT_PUBLISHED",
                "uri": "/api/juniper/sd/policy-management/firewall/policies/1671169",
                "version": 8
            },
            newData= {"firewall-rule":{"name":"fwRuleName","run-analysis": true, "description": "fwRuleDiscription","app-fw-policy":{},"rule-group-type":"CUSTOM","utm-policy":{},"rule-profile":{"profile-type":"INHERITED","user-defined-profile":{},"custom-profile":{"web-redirect":false,"tcp-syn-check":false,"infranet-redirect":"NONE","destination-address-translation":"NONE","redirect":"NONE","web-redirect-to-https":false,"authentication-type":"NONE","service-offload":false,"tcp-seq-check":false}},"ips-enabled":false,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"version":0,"rule-type":"RULE","vpn-tunnel-refs":{},"disabled":false,"hit-count-details":{},"edit-version":0,"scheduler":{},"services":{"service-reference":[{"id":163840,"domain-id":1,"name":"Any","is-group":false}]},"action":"DENY","sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"is-leaf":true,"expanded":false,"serial-number":0,"is-predefined":false,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false}};

        //executes once
        before(function () {
            ruleModel = new RuleModel(newData["firewall-rule"]);
            var viewParams = {
                context: context,
                policyObj: policyObj,
                model: ruleModel,
                cuid: CUID
            };
            fwRuleWizardRuleAnalysisView = new FwRuleWizardRuleAnalysisView(viewParams);
        });

        after(function () {
        });

        describe("RW Rule create RuleAnalysis view tests", function () {

            describe("FW rule Create general view initialize check", function () {

                it("view should exist", function () {
                    fwRuleWizardRuleAnalysisView.should.exist;
                });

                it("initialize arguments check", function () {
                    fwRuleWizardRuleAnalysisView.should.exist;
                    fwRuleWizardRuleAnalysisView.policyObj.id.should.be.equal(1671169);
                    typeof fwRuleWizardRuleAnalysisView.context.should.be.instanceof(Slipstream.SDK.ActivityContext);
                });
            });
            describe("FW rule Create RuleAnalysis view render check", function () {

                it("view should exist", function () {
                    fwRuleWizardRuleAnalysisView.render();
                    fwRuleWizardRuleAnalysisView.form.should.exist;
                });

            });

            describe("FW rule Create RuleAnalysis view beforePageChange check with invalid form", function () {
                var isValidInput;
                beforeEach(function () {
                    isValidInput = sinon.stub(fwRuleWizardRuleAnalysisView.form, 'isValidInput', function(){
                        return false;
                    });
                });

                afterEach(function () {
                    isValidInput.restore();
                });
                it("beforePageChange", function () {
                    var value = fwRuleWizardRuleAnalysisView.beforePageChange();
                    value.should.be.equal(true);
                    fwRuleWizardRuleAnalysisView.model.get("run-analysis").should.be.equal(true);
                });

            });
            describe("FW rule Create RuleAnalysis view beforePageChange check with invalid form", function () {
                var find;
                beforeEach(function () {
                    find = sinon.stub(fwRuleWizardRuleAnalysisView.$el, 'find', function(){
                        return {is: function(){return false;}};
                });
            });

            afterEach(function () {
                find.restore();
            });
            it("beforePageChange", function () {
                var value = fwRuleWizardRuleAnalysisView.beforePageChange();
                value.should.be.equal(true);
                fwRuleWizardRuleAnalysisView.model.get("run-analysis").should.be.equal(false);
            });

        });
            describe("FW rule Create RuleAnalysis view getSummary check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getSummary with return value check", function () {
                    var summary = fwRuleWizardRuleAnalysisView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_analysis');
                });

            });
            describe("FW rule Create RuleAnalysis view getTitle check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getTitle", function () {
                    fwRuleWizardRuleAnalysisView.getTitle();
                   getMessage.args[0][0].should.be.equal('auto_rule_placement');
                });

            });

        });
    });
});
