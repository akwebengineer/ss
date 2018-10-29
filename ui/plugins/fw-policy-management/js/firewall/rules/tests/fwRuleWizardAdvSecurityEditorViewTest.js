/**
 * Firewall rule wizard advance Security Editor view
 *
 * @module fwRuleWizardAdvSecurityEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardAdvSecurityEditorView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleGridAdvSecurityEditorView.js'
],function(FwRuleWizardAdvSecurityEditorView, RuleModel,RuleGridAdvSecurityView) {
    describe("RW Rule create advance security editor view tests", function () {
    var getMessage, fwRuleWizardAdvSecurityEditorView,
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
        newData= {"firewall-rule":{"name":"fwRuleName", "description": "fwRuleDiscription","ips-enabled":{},"app-fw-policy":{},"rule-group-type":"CUSTOM","utm-policy":{},"rule-profile":{"profile-type":"INHERITED","user-defined-profile":{},"custom-profile":{"web-redirect":false,"tcp-syn-check":false,"infranet-redirect":"NONE","destination-address-translation":"NONE","redirect":"NONE","web-redirect-to-https":false,"authentication-type":"NONE","service-offload":false,"tcp-seq-check":false}},"ips-enabled":false,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"version":0,"rule-type":"RULE","vpn-tunnel-refs":{},"disabled":false,"hit-count-details":{},"edit-version":0,"scheduler":{},"services":{"service-reference":[{"id":163840,"domain-id":1,"name":"Any","is-group":false}]},"action":"DENY","sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"source-zone":{},"ssl-forward-proxy-profile":{},"threat-policy":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"is-leaf":true,"expanded":false,"serial-number":0,"is-predefined":false,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false}};

    //executes once
    before(function () {
        ruleModel = new RuleModel(newData["firewall-rule"]);
        var viewParams = {
            context: context,
            policyObj: policyObj,
            model: ruleModel,
            cuid: CUID
        };
        fwRuleWizardAdvSecurityEditorView = new FwRuleWizardAdvSecurityEditorView(viewParams);
        fwRuleWizardAdvSecurityEditorView.actionDropdown = {setValue: function(){}};
        fwRuleWizardAdvSecurityEditorView.vpnTunnelDropDown = {setValue: function(){}};
        getMessage = sinon.stub(context, 'getMessage', function(val){return val;})

    });

    after(function () {
        getMessage.restore();
    });



        describe("FW rule Create advance security editor view initialize check", function () {

            it("view should exist", function () {
                fwRuleWizardAdvSecurityEditorView.should.exist;
            });

        });
        describe("FW rule Create advance security editor view render check", function () {
            var setWizardDefaults,bindDropdownEvents, createRemoteDropDown;
            beforeEach(function () {
               // createRemoteDropDown = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'createRemoteDropDown');
                setWizardDefaults = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'setWizardDefaults');
                bindDropdownEvents = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'bindDropdownEvents');
            });

            afterEach(function () {
                setWizardDefaults.restore();
                bindDropdownEvents.restore();
            });
            it("render check", function () {
                fwRuleWizardAdvSecurityEditorView.render();
                setWizardDefaults.called.should.be.equal(true);
                bindDropdownEvents.called.should.be.equal(true);
            });

        });
        describe("FW rule Create advance security editor view edit closeOverlay check", function () {
            var set;
            beforeEach(function () {
                set = sinon.stub(fwRuleWizardAdvSecurityEditorView.model, 'set');
            });

            afterEach(function () {
                set.restore();
            });
            it("closeOverlay check", function () {
                fwRuleWizardAdvSecurityEditorView.closeOverlay();
                set.called.should.be.equal(true);
                set.args[0][0].should.be.equal("action");
            });

        });
        describe("FW rule Create advance security editor view formatVpnRemoteResultSelection check", function () {
            formatVpnRemoteResult
            var set, formatVpnRemoteResult;
            beforeEach(function () {
                set = sinon.stub(fwRuleWizardAdvSecurityEditorView.model, 'set');
                formatVpnRemoteResult = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'formatVpnRemoteResult');
            });

            afterEach(function () {
                set.restore();
                formatVpnRemoteResult.restore();
            });
            it("formatVpnRemoteResultSelection check", function () {
                fwRuleWizardAdvSecurityEditorView.formatVpnRemoteResultSelection({name:"test"});
                set.called.should.be.equal(true);
                set.args[0][0]['vpn-tunnel-refs'].name.should.be.equal("test");
                formatVpnRemoteResult.called.should.be.equal(true);
                formatVpnRemoteResult.args[0][0].name.should.be.equal("test");

            });

        });

        describe("FW rule Create advance security editor view edit formatVpnRemoteResult check", function () {

            it("formatVpnRemoteResult check", function () {
                fwRuleWizardAdvSecurityEditorView.formatVpnRemoteResult({});
            });
            it("formatVpnRemoteResult check", function () {
                fwRuleWizardAdvSecurityEditorView.formatVpnRemoteResult({id:12312,name:"name", "is-managed": true});
            });
            it("formatVpnRemoteResult check", function () {
                fwRuleWizardAdvSecurityEditorView.formatVpnRemoteResult({id:12312,name:"name", "is-managed": false});
            });

        });
        describe("FW rule Create advance security editor view edit Complete check", function () {
            var closeOverlay;
            beforeEach(function () {
                closeOverlay = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'closeOverlay', function(){
                    return true;
                });
            });

            afterEach(function () {
                closeOverlay.restore();
            });
            it("edit completed check", function () {
                fwRuleWizardAdvSecurityEditorView.editCompleted();
                closeOverlay.called.should.be.equal(true);
            });

        });
        describe("FW rule Create advance security editor view edit bindDropdownEvents utmDropdown check", function () {
            var onutm, onssl, onips, ontmp, setAction;
            beforeEach(function () {
                onutm = sinon.stub(fwRuleWizardAdvSecurityEditorView.utmDropdown.conf.$container, 'on', function (text, option) {
                    window.value = 'off';
                    option();
                });
                onssl = sinon.stub(fwRuleWizardAdvSecurityEditorView.sslProxiesDropdown.conf.$container, 'on', function (text, option) {
                    window.value = 'off';
                    option();
                });
                onips = sinon.stub(fwRuleWizardAdvSecurityEditorView.ipsDropdown.conf.$container, 'on', function (text, option) {
                    window.value = 'off';
                    option();
                });
                ontmp = sinon.stub(fwRuleWizardAdvSecurityEditorView.tmpPoliciesDropdown.conf.$container, 'on', function (text, option) {
                    window.value = 'off';
                    option();
                });
                setAction = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'setAction');
            });

            afterEach(function () {
                onutm.restore();
                onssl.restore();
                ontmp.restore();
                setAction.restore();
                delete  window.value;
            });
            it("bindDropdownEvents check", function () {
                fwRuleWizardAdvSecurityEditorView.bindDropdownEvents();
                onutm.called.should.be.equal(true);
                onutm.args[0][0].should.be.equal('change');
                setAction.called.should.be.equal(true);
            });

        });

        describe("FW rule Create advance security editor view setWizardDefaults check", function () {
            var disableAdvancedSecurity, actionDropdownSetValue,vpnTunnelDropDownSetValue;
            beforeEach(function () {
                disableAdvancedSecurity = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'disableAdvancedSecurity');
                actionDropdownSetValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'setValue');
                vpnTunnelDropDownSetValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.vpnTunnelDropDown, 'setValue');
            });

            afterEach(function () {
                disableAdvancedSecurity.restore();
                actionDropdownSetValue.restore();
                vpnTunnelDropDownSetValue.restore();

            });
            it("setWizardDefaults", function () {
                fwRuleWizardAdvSecurityEditorView.setWizardDefaults();
                disableAdvancedSecurity.called.should.be.equal(true);
                actionDropdownSetValue.called.should.be.equal(true);
                vpnTunnelDropDownSetValue.called.should.be.equal(true);

            });

        });
        describe("FW rule Create advance security editor view setAction check", function () {
            var getValue, setValue;
            beforeEach(function () {
                getValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'getValue', function(){
                    return false;
                });
                setValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'setValue');
            });

            afterEach(function () {
                getValue.restore();
                setValue.restore();
            });
            it("setAction", function () {
                fwRuleWizardAdvSecurityEditorView.setAction();
            });

        });


        describe("FW rule Create advance security editor view disableAdvancedSecurity check", function () {
            var find;
            beforeEach(function(){
                find = sinon.stub(fwRuleWizardAdvSecurityEditorView.$el, 'find', function(){ return { prop: function(){} } });
            });
            afterEach(function(){
                find.restore();
            });
            it("disableAdvancedSecurity disabled : true", function () {
                fwRuleWizardAdvSecurityEditorView.disableAdvancedSecurity(true);
                find.called.should.be.equal(true);
            });
            it("disableAdvancedSecurity disabled : false", function () {
                fwRuleWizardAdvSecurityEditorView.disableAdvancedSecurity(false);
                find.called.should.be.equal(true);
            });
        });

        describe("FW rule Create advance security editor view getSummary check", function () {

            it("getSummary with return value check", function () {
                fwRuleWizardAdvSecurityEditorView.model.attributes.action = "TUNNEL";
                fwRuleWizardAdvSecurityEditorView.model.attributes["ips-enabled"] = true;
                var summary = fwRuleWizardAdvSecurityEditorView.getSummary();
                summary[0].label.should.be.equal('advanced_security');
                /* summary[1].label.should.be.equal(context.getMessage('name'));
                 summary[2].label.should.be.equal(context.getMessage('description'));
                 summary[1].value.should.be.equal('fwRuleName');
                 summary[2].value.should.be.equal('fwRuleDiscription');*/
            });
            it("getSummary with return value check", function () {
                fwRuleWizardAdvSecurityEditorView.model.attributes["app-fw-policy"] = false;
                fwRuleWizardAdvSecurityEditorView.model.attributes["ssl-forward-proxy-profile"] = false;
                fwRuleWizardAdvSecurityEditorView.model.attributes["threat-policy"] = false;
                fwRuleWizardAdvSecurityEditorView.model.attributes["utm-policy"] = false;
                fwRuleWizardAdvSecurityEditorView.model.attributes["ips-enabled"] = false;
                var summary = fwRuleWizardAdvSecurityEditorView.getSummary();
                summary[0].label.should.be.equal('advanced_security');
                /* summary[1].label.should.be.equal(context.getMessage('name'));
                 summary[2].label.should.be.equal(context.getMessage('description'));
                 summary[1].value.should.be.equal('fwRuleName');
                 summary[2].value.should.be.equal('fwRuleDiscription');*/
            });

        });
        describe("FW rule Create advance security editor view getTitle check", function () {

            it("getTitle", function () {
                 fwRuleWizardAdvSecurityEditorView.getTitle().should.be.equal('advanced_security');
            });

        });

        describe("FW rule Create advance security editor view beforePageChange check: false", function () {
            var getValue, vpnTunnelDropDownGetValue;
            beforeEach(function () {
                getValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'getValue', function(){
                    return "TUNNEL";
                });
                vpnTunnelDropDownGetValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.vpnTunnelDropDown, 'getValue', function(){
                    return false;
                });
            });

            afterEach(function () {
                getValue.restore();
                vpnTunnelDropDownGetValue.restore();
            });
            it("setAction", function () {
                fwRuleWizardAdvSecurityEditorView.beforePageChange();
            });

        });
        describe("FW rule Create advance security editor view beforePageChange check: true", function () {

            var getValue, setValue, vpnTunnelDropDownGetValue, updateModelData;
            beforeEach(function () {
                getValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'getValue', function(){
                    return "TUNNEL";
                });
                vpnTunnelDropDownGetValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.vpnTunnelDropDown, 'getValue', function(){
                    return true;
                });
                setValue = sinon.stub(fwRuleWizardAdvSecurityEditorView.actionDropdown, 'setValue');
                updateModelData = sinon.stub(fwRuleWizardAdvSecurityEditorView, 'updateModelData');
            });

            afterEach(function () {
                getValue.restore();
                setValue.restore();
                vpnTunnelDropDownGetValue.restore();
                updateModelData.restore();
            });
            it("beforePageChange", function () {
                fwRuleWizardAdvSecurityEditorView.beforePageChange();
            });

        });

        describe("FW rule Create advance security editor view onSelection check: true", function () {

            it("beforePageChange: utm", function () {
                fwRuleWizardAdvSecurityEditorView.onSelection({currentTarget:{id:"utm", value:"off"}});
            });
            it("beforePageChange : wizard_action", function () {
                fwRuleWizardAdvSecurityEditorView.onSelection({currentTarget:{id:"wizard_action", value:"off"}});
            });
            it("beforePageChange : wizard_action and TUNNEL", function () {
                fwRuleWizardAdvSecurityEditorView.onSelection({currentTarget:{id:"wizard_action", value:"TUNNEL"}});
            });
            it("beforePageChange : vpn_tunnel", function () {
               fwRuleWizardAdvSecurityEditorView["vpnTunnelCollection"] = {"findWhere" : function(){return {toJSON: function(){}};}};
                fwRuleWizardAdvSecurityEditorView.onSelection({currentTarget:{id:"vpn_tunnel", value:"off"}});
            });

        });
        describe("FW rule Create advance security editor view actionDropdownOnChange check", function () {

            it.skip("actionDropdownOnChange selected value TUNNEL", function () {
                fwRuleWizardAdvSecurityEditorView.actionDropdownOnChange([{currentTagret:{value:"TUNNEL"}}]);
            });
            it.skip("actionDropdownOnChange non tunnel selection", function () {
                fwRuleWizardAdvSecurityEditorView.actionDropdownOnChange([{currentTagret:{value:""}}]);
            });


        });

    });
});
