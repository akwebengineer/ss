
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardSourceView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardSourceView, RuleModel) {
    describe("FW rule Create Wizard unit-tests", function () {

        var ruleModelStub, fwRuleWizardSourceView,
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
            newData= {"firewall-rule":{"name":"fwRuleName", "description": "fwRuleDiscription","app-fw-policy":{},"rule-group-type":"CUSTOM","utm-policy":{},"rule-profile":{"profile-type":"INHERITED","user-defined-profile":{},"custom-profile":{"web-redirect":false,"tcp-syn-check":false,"infranet-redirect":"NONE","source-address-translation":"NONE","redirect":"NONE","web-redirect-to-https":false,"authentication-type":"NONE","service-offload":false,"tcp-seq-check":false}},"ips-enabled":false,"source-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"version":0,"rule-type":"RULE","vpn-tunnel-refs":{},"disabled":false,"hit-count-details":{},"edit-version":0,"scheduler":{},"services":{"service-reference":[{"id":163840,"domain-id":1,"name":"Any","is-group":false}]},"action":"DENY","sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"source-zone":{},"source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[{"id":131072,"domain-id":1,"name":"Any","address-type":"ANY"}]}},"is-leaf":true,"expanded":false,"serial-number":0,"is-predefined":false,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false}};

        //executes once
        before(function () {
            ruleModel = new RuleModel(newData["firewall-rule"]);
            var viewParams = {
                context: context,
                policyObj: policyObj,
                model: ruleModel,
                cuid: CUID
            };
            ruleModelStub = sinon.stub(ruleModel, 'on', function(text, option){option();});
            fwRuleWizardSourceView = new FwRuleWizardSourceView(viewParams);
            fwRuleWizardSourceView["profileOverlay"] = {destroy:function(){}};
            fwRuleWizardSourceView.sourceZoneDropdown = {getValue: function(){}};
        });

        after(function () {
            ruleModelStub.restore();
        });

        describe("RW Rule create Source view tests", function () {

            describe("FW rule Create Source view initialize check", function () {

                it("view should exist", function () {
                    fwRuleWizardSourceView.should.exist;
                });

                it("initialize arguments check", function () {
                    fwRuleWizardSourceView.should.exist;
                    fwRuleWizardSourceView.policyObj.id.should.be.equal(1671169);
                    typeof fwRuleWizardSourceView.context.should.be.instanceof(Slipstream.SDK.ActivityContext);
                });
            });
            describe("FW rule Create Source view render check", function () {
                var getZones, setDefaultFormValues;
                beforeEach(function () {
                    getZones = sinon.stub(fwRuleWizardSourceView, 'getZones');
                    setDefaultFormValues = sinon.stub(fwRuleWizardSourceView, 'setDefaultFormValues');
                });

                afterEach(function () {
                    getZones.restore();
                    setDefaultFormValues.restore();
                });
                it("view should exist", function () {
                    fwRuleWizardSourceView.render();
                    fwRuleWizardSourceView.form.should.exist;
                    getZones.called.should.be.equal(true);
                    setDefaultFormValues.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Destination view actionDropdownOnChange check", function () {
                var getValue, findWhere, set;
                beforeEach(function () {
                    getValue = sinon.stub(fwRuleWizardSourceView.sourceZoneDropdown, 'getValue', function(){
                        return ["test", "test1"];
                    });
                    findWhere = sinon.stub(fwRuleWizardSourceView.zonesCollection, 'findWhere', function() {
                        return {toJSON: function()
                        {
                            return {name: "testZone"};
                        }
                        }
                    });
                    set = sinon.stub(fwRuleWizardSourceView.model, 'set');
                });

                afterEach(function () {
                    getValue.restore();
                    set.restore();
                    findWhere.restore();

                });
                it("actionDropdownOnChange : true", function () {
                    fwRuleWizardSourceView.actionDropdownOnChange();
                    getValue.called.should.be.equal(true);
                    set.called.should.be.equal(true);
                    findWhere.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Source view setDefaultFormValues check", function () {
                var updateAddressValuesOnView, updateSourceIdentityOnView;
                beforeEach(function () {
                    updateAddressValuesOnView = sinon.stub(fwRuleWizardSourceView, 'updateAddressValuesOnView');
                    updateSourceIdentityOnView = sinon.stub(fwRuleWizardSourceView, 'updateSourceIdentityOnView');
                });

                afterEach(function () {
                    updateAddressValuesOnView.restore();
                    updateSourceIdentityOnView.restore();
                });
                it("setDefaultFormValues : true", function () {
                    fwRuleWizardSourceView.setDefaultFormValues();
                    updateAddressValuesOnView.called.should.be.equal(true);
                    updateSourceIdentityOnView.called.should.be.equal(true);
                });

            });

            /*describe("FW rule Create Source view showAddressOverlay check", function () {

                it("showAddressOverlay: true", function () {
                    fwRuleWizardSourceView.showAddressOverlay();
                });

            });

            describe("FW rule Create Source view showSourceIdentityOverlay check", function () {

                it("showServicesOverlay: true", function () {
                    fwRuleWizardSourceView.showSourceIdentityOverlay();
                });

            });

            describe("FW rule Create Source view closeSourceIdentityOverlay check", function () {
                var destroy;
                beforeEach(function () {
                    destroy = sinon.stub(fwRuleWizardSourceView.sourceIdentityOverlay, 'destroy');
                });

                afterEach(function () {
                    destroy.restore();
                });
                it("closeSourceIdentityOverlay : true", function () {
                    fwRuleWizardSourceView.closeSourceIdentityOverlay("test", {preventDefault: function(){}});
                    destroy.called.should.be.equal(true);
                });

            });

            describe("FW rule Create Source view closeAddressOverlay check", function () {
                var destroy;
                beforeEach(function () {
                    destroy = sinon.stub(fwRuleWizardSourceView.addressOverlay, 'destroy');
                });

                afterEach(function () {
                    destroy.restore();
                });
                it("closeServiceOverlay : true", function () {
                    fwRuleWizardSourceView.closeAddressOverlay("test", {preventDefault: function(){}});
                    destroy.called.should.be.equal(true);
                });

            });*/
            describe("FW rule Create Source view getTitle check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getTitle", function () {
                    fwRuleWizardSourceView.getTitle();
                    getMessage.args[0][0].should.be.equal('fw_rule_wizard_address_message');
                });

            });

            describe("FW rule Create Source view updateSourceIdentityOnView check", function () {

                it("updateServiceValuesOnView : if check", function () {
                    fwRuleWizardSourceView.model.attributes.sourceidentities["sourceidentity"]= {name: "test"};
                    fwRuleWizardSourceView.updateSourceIdentityOnView();
                });
                it("updateServiceValuesOnView : else check", function () {
                    fwRuleWizardSourceView.model.attributes.sourceidentities["sourceidentity"]= [{name: "test"}, {name: "test1"}];
                    fwRuleWizardSourceView.updateSourceIdentityOnView();
                });

            });
            describe("FW rule Create Source view updateAddressValuesOnView check", function () {

                it("updateAddressValuesOnView : if check", function () {
                    fwRuleWizardSourceView.updateAddressValuesOnView();
                });
                it("updateAddressValuesOnView : else check", function () {
                    fwRuleWizardSourceView.model.attributes["source-address"]={"addresses" :{"address-reference":{"service-reference": {name: "test"}}}};
                    fwRuleWizardSourceView.model.attributes["source-address"]["exclude-list"] = true;
                    fwRuleWizardSourceView.updateAddressValuesOnView();
                });

            });
            describe("FW rule Create Source view getSummary check", function () {
                var summary, getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });
                it("getSummary: true", function () {
                    summary = fwRuleWizardSourceView.getSummary();
                    getMessage.called.should.be.equal(true);
                    summary[0].value.should.be.equal(" ");
                    summary[1].value.should.be.equal("");
                    getMessage.args[0][0].should.be.equal("identify_traffic_source");
                    getMessage.args[1][0].should.be.equal("zone");
                    getMessage.args[2][0].should.be.equal("exclude");

                });

                it("getSummary: true", function () {
                    fwRuleWizardSourceView.model.attributes["original-source-zones"] = [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}];
                    fwRuleWizardSourceView.model.attributes["source-zone"] = {"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]};
                    fwRuleWizardSourceView.model.attributes["source-address"] = {"addresses":{"address-reference":[{name:"test"}, {name:"test1"}]}};
                    fwRuleWizardSourceView.model.attributes["services"] = {"service-reference": [{name:"test"}, {name:"test1"}]};
                    summary = fwRuleWizardSourceView.getSummary();
                    getMessage.called.should.be.equal(true);
                    summary[0].value.should.be.equal(" ");
                    summary[1].value.should.be.equal("testZone <span>(+1)</span>");
                    summary[2].value.should.be.equal("test <span>(+1)</span>");
                    getMessage.args[0][0].should.be.equal("identify_traffic_source");
                    getMessage.args[1][0].should.be.equal("zone");
                    getMessage.args[2][0].should.be.equal("address");
                    getMessage.args[3][0].should.be.equal("source_identity");

                });

            });

            describe("FW rule Create Source view getZones success check with zone-type =ZONESET", function () {
                var fetch;
                beforeEach(function () {
                    fetch = sinon.stub(fwRuleWizardSourceView.zonesCollection, 'fetch', function(options){
                        options.success ({}, {Zones:{"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]}}, {});

                    });
                });

                afterEach(function () {
                    fetch.restore();
                });
                it("getZones: true", function () {
                    fwRuleWizardSourceView.model.attributes["original-source-zones"] = [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}];
                    fwRuleWizardSourceView.getZones();
                    fetch.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Source view getZones success check with zone-type !=ZONESET", function () {
                var fetch;
                beforeEach(function () {
                    fetch = sinon.stub(fwRuleWizardSourceView.zonesCollection, 'fetch', function(options){
                        options.success ({}, {Zones:{"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]}}, {});

                    });
                });

                afterEach(function () {
                    fetch.restore();
                });
                it("getZones: true", function () {
                    fwRuleWizardSourceView.model.attributes["original-source-zones"] = [{name: 'testZone', "zone-type": ""}, {name:"testZone1", "zone-type": ""}];
                    fwRuleWizardSourceView.getZones();
                    fetch.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Source view getZones failure check", function () {
                var fetch;
                beforeEach(function () {
                    fetch = sinon.stub(fwRuleWizardSourceView.zonesCollection, 'fetch', function(options){
                        options.error ();

                    });
                });

                afterEach(function () {
                    fetch.restore();
                });
                it("getZones: true", function () {
                    fwRuleWizardSourceView.getZones();
                });

            });

        });

    });
});
