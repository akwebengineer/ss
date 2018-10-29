
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardRuleOptionsEditorView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardRuleOptionsEditorView, RuleModel) {
    describe("FW rule Create Wizard unit-tests", function () {

        var fwRuleWizardRuleOptionsEditorView,
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
            newData= {"firewall-rule":{"name":"fwRuleName", "description": "fwRuleDiscription","app-fw-policy":{},"rule-group-type":"CUSTOM","utm-policy":{},"rule-profile":{"profile-type":"INHERITED","user-defined-profile":{},"custom-profile":{"web-redirect":false,"tcp-syn-check":false,"infranet-redirect":"NONE","destination-address-translation":"NONE","redirect":"NONE","web-redirect-to-https":false,"authentication-type":"NONE","service-offload":false,"tcp-seq-check":false}},"ips-enabled":false,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"version":0,"rule-type":"RULE","vpn-tunnel-refs":{},"disabled":false,"hit-count-details":{},"edit-version":0,"scheduler":{},"services":{"service-reference":[{"id":163840,"domain-id":1,"name":"Any","is-group":false}]},"action":"DENY","sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"is-leaf":true,"expanded":false,"serial-number":0,"is-predefined":false,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false}};

        //executes once
        before(function () {
            ruleModel = new RuleModel(newData["firewall-rule"]);
            var viewParams = {
                context: context,
                policyObj: policyObj,
                model: ruleModel,
                cuid: CUID
            };
            fwRuleWizardRuleOptionsEditorView = new FwRuleWizardRuleOptionsEditorView(viewParams);
            fwRuleWizardRuleOptionsEditorView["profileOverlay"] = {destroy:function(){}};
        });

        after(function () {
        });

        describe("RW Rule create Options Editor view tests", function () {

            describe("FW rule Create Options Editor view initialize check", function () {

                it("view should exist", function () {
                    fwRuleWizardRuleOptionsEditorView.should.exist;
                });

                it("initialize arguments check", function () {
                    fwRuleWizardRuleOptionsEditorView.should.exist;
                    fwRuleWizardRuleOptionsEditorView.policyObj.id.should.be.equal(1671169);
                    typeof fwRuleWizardRuleOptionsEditorView.context.should.be.instanceof(Slipstream.SDK.ActivityContext);
                });
            });
            describe("FW rule Create Options Editor view render check", function () {

                it("view should exist", function () {
                    fwRuleWizardRuleOptionsEditorView.render();
                    fwRuleWizardRuleOptionsEditorView.form.should.exist;
                });

            });
            describe("FW rule Create Options Editor view editCompleted check", function () {
                var closeOverlay;
                beforeEach(function () {
                    closeOverlay = sinon.stub(fwRuleWizardRuleOptionsEditorView, 'closeOverlay');
                });

                afterEach(function () {
                    closeOverlay.restore();
                });
                it("editCompleted check", function () {
                    fwRuleWizardRuleOptionsEditorView.editCompleted();
                    closeOverlay.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Options Editor view beforePageChange check", function () {
                var updateProfileValuesOnView;
                beforeEach(function () {
                    updateProfileValuesOnView = sinon.stub(fwRuleWizardRuleOptionsEditorView, 'updateProfileValuesOnView');
                });

                afterEach(function () {
                    updateProfileValuesOnView.restore();
                });
                it("beforePageChange", function () {
                    var value = fwRuleWizardRuleOptionsEditorView.beforePageChange();
                    value.should.be.equal(true);
                    updateProfileValuesOnView.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Options Editor view getSummary check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getSummary with return value check with profile-type empty", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": ""};
                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    summary[1].value.should.be.equal('None');
                    summary[0].value.should.be.equal(' ');
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                });
                it("getSummary with return value check with profile-type INHERITED", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": "INHERITED"};
                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('Inherited from policy');
                });
                it("getSummary with return value check with profile-type USER_DEFINED", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": "USER_DEFINED", "name": "test"};
                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('test');
                });
                it("getSummary with return value check with profile-type CUSTOM", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": "CUSTOM"};
                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('Custom');
                });
                it("getSummary with return value check with profile-type CUSTOM", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": "CUSTOM"};
                    fwRuleWizardRuleOptionsEditorView.model.attributes['scheduler'] = {"name": "test"};
                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                    getMessage.args[2][0].should.be.equal('scheduler');
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('Custom');
                    summary[2].value.should.be.equal('test');
                });
                it("getSummary with return value check with profile-type CUSTOM", function () {
                    fwRuleWizardRuleOptionsEditorView.model.attributes['rule-profile'] = {"profile-type": "CUSTOM"};
                    delete fwRuleWizardRuleOptionsEditorView.model.attributes['scheduler'];

                    var summary = fwRuleWizardRuleOptionsEditorView.getSummary();
                    getMessage.args[0][0].should.be.equal('rule_options');
                    getMessage.args[1][0].should.be.equal('profile');
                    getMessage.args[2][0].should.be.equal('scheduler');
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('Custom');
                    summary[2].value.should.be.equal('');
                });

            });
            describe("FW rule Create Options Editor view getTitle check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getTitle", function () {
                    fwRuleWizardRuleOptionsEditorView.getTitle();
                    getMessage.args[0][0].should.be.equal('rule_options');
                });

            });
            describe("FW rule Create Options Editor view closeProfileOverlay check", function () {
                var destroy,preventDefault, event = {preventDefault: function(){}};

                beforeEach(function () {
                    destroy = sinon.stub(fwRuleWizardRuleOptionsEditorView.profileOverlay, 'destroy');
                    preventDefault = sinon.stub(event, 'preventDefault');
                });

                afterEach(function () {
                    destroy.restore();
                    preventDefault.restore();
                });

                it("closeProfileOverlay", function () {
                    fwRuleWizardRuleOptionsEditorView.closeProfileOverlay({}, event);
                    destroy.called.should.be.equal(true);
                    preventDefault.called.should.be.equal(true);
                });

            });

        });
    });
});
