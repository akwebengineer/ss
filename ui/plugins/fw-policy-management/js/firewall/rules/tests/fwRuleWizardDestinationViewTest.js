
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardDestinationView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardDestinationView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardDestinationView, RuleModel) {
    describe("FW rule Create Wizard unit-tests", function () {

        var fwRuleWizardDestinationView,
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
            fwRuleWizardDestinationView = new FwRuleWizardDestinationView(viewParams);
            fwRuleWizardDestinationView["profileOverlay"] = {destroy:function(){}};
            fwRuleWizardDestinationView.destinationZoneDropdown = {getValue: function(){}};
        });

        after(function () {
        });

        describe("RW Rule create Destination view tests", function () {

            describe("FW rule Create Destination view initialize check", function () {

                it("view should exist", function () {
                    fwRuleWizardDestinationView.should.exist;
                });

                it("initialize arguments check", function () {
                    fwRuleWizardDestinationView.should.exist;
                    fwRuleWizardDestinationView.policyObj.id.should.be.equal(1671169);
                    typeof fwRuleWizardDestinationView.context.should.be.instanceof(Slipstream.SDK.ActivityContext);
                });
            });
            describe("FW rule Create Destination view render check", function () {
                var getZones, setDefaultFormValues;
                beforeEach(function () {
                    getZones = sinon.stub(fwRuleWizardDestinationView, 'getZones');
                    setDefaultFormValues = sinon.stub(fwRuleWizardDestinationView, 'setDefaultFormValues');
                });

                afterEach(function () {
                    getZones.restore();
                    setDefaultFormValues.restore();
                });
                it("view should exist", function () {
                    fwRuleWizardDestinationView.render();
                    fwRuleWizardDestinationView.form.should.exist;
                    getZones.called.should.be.equal(true);
                    setDefaultFormValues.called.should.be.equal(true);
                });

            });

            describe("FW rule Create Destination view actionDropdownOnChange check", function () {
                var getValue, findWhere, set;
                beforeEach(function () {
                    getValue = sinon.stub(fwRuleWizardDestinationView.destinationZoneDropdown, 'getValue', function(){
                        return ["test", "test1"];
                    });
                    findWhere = sinon.stub(fwRuleWizardDestinationView.zonesCollection, 'findWhere', function() {
                        return {toJSON: function()
                        {
                            return {name: "testZone"};
                        }
                        }
                    });
                    set = sinon.stub(fwRuleWizardDestinationView.model, 'set');
                });

                afterEach(function () {
                    getValue.restore();
                    set.restore();
                    findWhere.restore();

                });
                it("actionDropdownOnChange : true", function () {
                    fwRuleWizardDestinationView.actionDropdownOnChange();
                    getValue.called.should.be.equal(true);
                    set.called.should.be.equal(true);
                    findWhere.called.should.be.equal(true);
                });

            });

            describe("FW rule Create Destination view setDefaultFormValues check", function () {
                var updateAddressValuesOnView, updateServiceValuesOnView;
                beforeEach(function () {
                    updateAddressValuesOnView = sinon.stub(fwRuleWizardDestinationView, 'updateAddressValuesOnView');
                    updateServiceValuesOnView = sinon.stub(fwRuleWizardDestinationView, 'updateServiceValuesOnView');
                });

                afterEach(function () {
                    updateAddressValuesOnView.restore();
                    updateServiceValuesOnView.restore();
                });
                it("setDefaultFormValues : true", function () {
                    fwRuleWizardDestinationView.setDefaultFormValues();
                    updateAddressValuesOnView.called.should.be.equal(true);
                    updateServiceValuesOnView.called.should.be.equal(true);
                });

            });

           /* describe("FW rule Create Destination view showAddressOverlay check", function () {

                it("showAddressOverlay: true", function () {
                    fwRuleWizardDestinationView.showAddressOverlay();
                });

            });

            describe("FW rule Create Destination view showServicesOverlay check", function () {

                it("showServicesOverlay: true", function () {
                    fwRuleWizardDestinationView.showServicesOverlay();
                });

            });

            describe("FW rule Create Destination view closeServiceOverlay check", function () {
                var destroy;
                beforeEach(function () {
                    destroy = sinon.stub(fwRuleWizardDestinationView.serviceOverlay, 'destroy');
                });

                afterEach(function () {
                    destroy.restore();
                });
                it("closeServiceOverlay : true", function () {
                    fwRuleWizardDestinationView.closeServiceOverlay("test", {preventDefault: function(){}});
                    destroy.called.should.be.equal(true);
                });

            });

            describe("FW rule Create Destination view closeAddressOverlay check", function () {
                var destroy;
                beforeEach(function () {
                    destroy = sinon.stub(fwRuleWizardDestinationView.addressOverlay, 'destroy');
                });

                afterEach(function () {
                    destroy.restore();
                });
                it("closeServiceOverlay : true", function () {
                    fwRuleWizardDestinationView.closeAddressOverlay("test", {preventDefault: function(){}});
                    destroy.called.should.be.equal(true);
                });

            });*/
            describe("FW rule Create Destination view getTitle check", function () {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getTitle", function () {
                    fwRuleWizardDestinationView.getTitle();
                    getMessage.args[0][0].should.be.equal('fw_rule_wizard_address_message');
                });

            });

            describe("FW rule Create Destination view updateServiceValuesOnView check", function () {

                it("updateServiceValuesOnView : if check", function () {
                    fwRuleWizardDestinationView.updateServiceValuesOnView();
                });
                it("updateServiceValuesOnView : else check", function () {
                    fwRuleWizardDestinationView.model.attributes.services["service-reference"]= {name: "test"};
                    fwRuleWizardDestinationView.updateServiceValuesOnView();
                });

            });
            describe("FW rule Create Destination view updateAddressValuesOnView check", function () {

                it("updateAddressValuesOnView : if check", function () {
                    fwRuleWizardDestinationView.updateAddressValuesOnView();
                });
                it("updateAddressValuesOnView : else check", function () {
                    fwRuleWizardDestinationView.model.attributes["destination-address"]={"addresses" :{"address-reference":{"service-reference": {name: "test"}}}};
                    fwRuleWizardDestinationView.model.attributes["destination-address"]["exclude-list"] = true;

                    fwRuleWizardDestinationView.updateAddressValuesOnView();
                });

            });
            describe("FW rule Create Destination view getSummary check", function () {
                var summary, getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });
                it("getSummary 1: true", function () {
                    fwRuleWizardDestinationView.getSummary();
                    getMessage.called.should.be.equal(true);
                    getMessage.args[0][0].should.be.equal("identify_traffic_dest");
                    getMessage.args[1][0].should.be.equal("zone");
                    getMessage.args[2][0].should.be.equal("exclude");
                    getMessage.args[3][0].should.be.equal("address");
                });

                it("getSummary 2: true", function () {
                    fwRuleWizardDestinationView.model.attributes["original-dest-zones"] = [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}];
                    fwRuleWizardDestinationView.model.attributes["destination-zone"] = {"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]};
                    fwRuleWizardDestinationView.model.attributes["destination-address"] = {"addresses":{"address-reference":[{name:"test"}, {name:"test1"}]}};
                    fwRuleWizardDestinationView.model.attributes["services"] = {"service-reference": [{name:"test"}, {name:"test1"}]};
                    fwRuleWizardDestinationView.getSummary();
                    getMessage.called.should.be.equal(true);
                    getMessage.args[0][0].should.be.equal("identify_traffic_dest");
                    getMessage.args[1][0].should.be.equal("zone");
                    getMessage.args[2][0].should.be.equal("address");
                    getMessage.args[3][0].should.be.equal("service");
                });
                it("getSummary 3: true", function () {
                    fwRuleWizardDestinationView.model.attributes["original-dest-zones"] = [{name: 'testZone', "zone-type": ""}, {name:"testZone1", "zone-type": ""}];
                    fwRuleWizardDestinationView.model.attributes["destination-zone"] = {"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]};
                    fwRuleWizardDestinationView.model.attributes["destination-address"] = {"addresses":{"address-reference":[{name:"test"}, {name:"test1"}]}};
                    fwRuleWizardDestinationView.model.attributes["services"] = {"service-reference": [{name:"test"}, {name:"test1"}]};
                    fwRuleWizardDestinationView.getSummary();
                    getMessage.called.should.be.equal(true);
                    getMessage.args[0][0].should.be.equal("identify_traffic_dest");
                    getMessage.args[1][0].should.be.equal("zone");
                    getMessage.args[2][0].should.be.equal("address");
                    getMessage.args[3][0].should.be.equal("service");
                });

            });

            describe("FW rule Create Destination view getZones success check", function () {
                var fetch, add, addData, setValue;
                beforeEach(function () {
                    fetch = sinon.stub(fwRuleWizardDestinationView.zonesCollection, 'fetch', function(options){
                        options.success ({}, {Zones:{"zone" : [{name: 'testZone', "zone-type": "ZONESET"}, {name:"testZone1", "zone-type": "ZONESET"}]}}, {});

                    });
                    add = sinon.stub(fwRuleWizardDestinationView.zonesCollection, 'add');
                    addData = sinon.stub(fwRuleWizardDestinationView.destinationZoneDropdown, 'addData');
                    setValue = sinon.stub(fwRuleWizardDestinationView.destinationZoneDropdown, 'setValue');

                });

                afterEach(function () {
                    fetch.restore();
                    add.restore();
                    addData.restore();
                    setValue.restore();
                });
                it("getZones: true", function () {
                    fwRuleWizardDestinationView.getZones();
                    fetch.called.should.be.equal(true);
                    add.called.should.be.equal(true);
                    addData.called.should.be.equal(true);
                    setValue.called.should.be.equal(true);
                });

            });
            describe("FW rule Create Destination view getZones failure check", function () {
                var fetch;
                beforeEach(function () {
                    fetch = sinon.stub(fwRuleWizardDestinationView.zonesCollection, 'fetch', function(options){
                        options.error ();

                    });
                    add = sinon.stub(fwRuleWizardDestinationView.zonesCollection, 'add');
                    addData = sinon.stub(fwRuleWizardDestinationView.destinationZoneDropdown, 'addData');
                    setValue = sinon.stub(fwRuleWizardDestinationView.destinationZoneDropdown, 'setValue');

                });

                afterEach(function () {
                    fetch.restore();
                    add.restore();
                    addData.restore();
                    setValue.restore();
                });
                it("getZones: true", function () {
                    fwRuleWizardDestinationView.getZones();
                    fetch.called.should.be.equal(true);
                    add.called.should.be.equal(false);
                    addData.called.should.be.equal(false);
                    setValue.called.should.be.equal(false);
                });

            });

        });

    });
});
