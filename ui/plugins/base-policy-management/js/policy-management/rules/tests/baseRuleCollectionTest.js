/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleCollection.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../../../../../ui-common/js/models/spaceCollection.js'
], function (FwRuleCollection,
             RuleModel,BaseCollection) {


    describe("Base rule collection unit-tests", function() {

        var ruleCollection,stub, context = new Slipstream.SDK.ActivityContext(), policy = {id:2097156}, CUID = 'MTRkNjI5NzctNmJkMS00ODdhLWE4NTEtMmU0MGM0NTliY2M0', ruleData, ruleGroup,refreshOptions;
        //executes once
        before(function(){
            window.Juniper={sm:{CURRENT_DOMAIN_ID:"2"}};
//            Juniper['sm']['CURRENT_DOMAIN_ID'] = '2';
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });

            ruleCollection = new FwRuleCollection(CUID, policy, context);
            var ruleData1 = new RuleModel({"app-fw-policy":{},"rule-group-type":"ZONE","utm-policy":{},"rule-profile":{"profile-type":"CUSTOM"},"rule-order":0,"ips-enabled":false,"policy-id":2097156,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"version":0,"rule-type":"RULEGROUP","vpn-tunnel-refs":{},"disabled":false,"id":2097158,"hit-count-details":{"id":0,"level":"ZERO","total-hit-count":0,"hit-count":0,"last-reset-time-stamp":0,"hit-percent":0.0,"last-hit-time-stamp":0,"first-hit-time-stamp":0},"edit-version":0,"scheduler":{},"services":{},"sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"name":"Zone","source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"is-leaf":false,"expanded":true,"serial-number":1,"rule-level":0,"is-predefined":true,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false});
            ruleData2 = new RuleModel({"app-fw-policy":{},"rule-group-type":"ZONE","utm-policy":{},"rule-profile":{"profile-type":"CUSTOM"},"rule-order":0,"ips-enabled":false,"policy-id":2097156,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"version":0,"rule-type":"RULE","vpn-tunnel-refs":{},"disabled":false,"id":2097159,"hit-count-details":{"id":0,"level":"ZERO","total-hit-count":0,"hit-count":0,"last-reset-time-stamp":0,"hit-percent":0.0,"last-hit-time-stamp":0,"first-hit-time-stamp":0},"edit-version":0,"scheduler":{},"services":{},"sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"name":"Zone","source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"is-leaf":false,"expanded":true,"serial-number":1,"rule-level":0,"is-predefined":true,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false});
            var ruleData3 = new RuleModel({"app-fw-policy":{},"rule-group-type":"ZONE","utm-policy":{},"rule-profile":{"profile-type":"CUSTOM"},"rule-order":0,"ips-enabled":false,"policy-id":2097156,"destination-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"version":0,"rule-type":"RULEGROUP","vpn-tunnel-refs":{},"disabled":false,"id":2097160,"hit-count-details":{"id":0,"level":"ZERO","total-hit-count":0,"hit-count":0,"last-reset-time-stamp":0,"hit-percent":0.0,"last-hit-time-stamp":0,"first-hit-time-stamp":0},"edit-version":0,"scheduler":{},"services":{},"sec-intel-policy":{},"custom-column-data":"","sourceidentities":{},"destination-zone":{},"name":"Zone","source-zone":{},"ssl-forward-proxy-profile":{},"source-address":{"exclude-list":false,"addresses":{"address-reference":[]}},"is-leaf":false,"expanded":true,"serial-number":1,"rule-level":0,"is-predefined":true,"count":0,"error-level":-1,"global-rule":false,"is-first-item":false,"is-last-item":false});
            ruleData = ruleData1;
            ruleCollection.add(ruleData1);
            ruleCollection.add(ruleData2);
            ruleCollection.add(ruleData3);

            ruleGroup = new RuleModel({
                "app-fw-policy":{},
                "rule-group-type":"CUSTOM",
                "utm-policy":{},
                "rule-profile":{
                    "profile-type":"CUSTOM"
                },
                "rule-order":1,
                "ips-enabled":false,
                "policy-id":262153,
                "destination-address":{
                    "exclude-list":false,
                    "addresses":{
                        "address-reference":[]
                    }
                },
                "version":0,
                "rule-type":"RULEGROUP",
                "vpn-tunnel-refs":{},
                "disabled":false,
                "id":-7,
                "hit-count-details":{},
                "edit-version":0,
                "rule-group-id":262156,
                "scheduler":{},
                "services":{},
                "sec-intel-policy":{},
                "custom-column-data":"",
                "description":"",
                "sourceidentities":{},
                "destination-zone":{},
                "name":"testG1",
                "source-zone":{},
                "ssl-forward-proxy-profile":{},
                "source-address":{
                    "exclude-list":false,
                    "addresses":{
                        "address-reference":[]
                    }
                },
                "is-leaf":false,
                "expanded":false,
                "serial-number":0,
                "is-predefined":false,
                "count":0,
                "error-level":-1,
                "global-rule":false,
                "is-first-item":false,
                "is-last-item":false
            });
            var ruleGroup1 = new RuleModel({
                "app-fw-policy":{},
                "rule-group-type":"CUSTOM",
                "utm-policy":{},
                "rule-profile":{
                    "profile-type":"CUSTOM"
                },
                "rule-order":1,
                "ips-enabled":false,
                "policy-id":262153,
                "destination-address":{
                    "exclude-list":false,
                    "addresses":{
                        "address-reference":[]
                    }
                },
                "version":0,
                "rule-type":"RULEGROUP",
                "vpn-tunnel-refs":{},
                "disabled":false,
                "id":-7,
                "hit-count-details":{},
                "edit-version":0,
                "rule-group-id":262157,
                "scheduler":{},
                "services":{},
                "sec-intel-policy":{},
                "custom-column-data":"",
                "description":"",
                "sourceidentities":{},
                "destination-zone":{},
                "name":"testG1",
                "source-zone":{},
                "ssl-forward-proxy-profile":{},
                "source-address":{
                    "exclude-list":false,
                    "addresses":{
                        "address-reference":[]
                    }
                },
                "is-leaf":false,
                "expanded":false,
                "serial-number":0,
                "is-predefined":false,
                "count":0,
                "error-level":-1,
                "global-rule":false,
                "is-first-item":false,
                "is-last-item":false
            });
            ruleCollection.add(ruleGroup);
            //   console.log("fw policy rule collection unit tests: before");
        });




        after(function () {
           delete  window.Juniper;
        });

        describe("Collection tests", function() {

            describe("FW rule BaseCollection  instantiation", function() {

                it("collection should exist", function() {

                    ruleCollection.should.exist;
                    $.mockjax.clear();
                });
            });

            describe(" url", function() {

                it("url should exist", function() {
                    ruleCollection.url().should.be.equal(ruleCollection.policyManagementConstants.POLICY_URL + policy.id);
                });
            });
            describe("setCollectionDirty", function() {

                it("setCollectionDirty : true", function() {
                    var setCollectionDirty = ruleCollection.setCollectionDirty(true);
                    ruleCollection.isDirty.should.be.equal(true);
                });

                it("setCollectionDirty : false", function() {
                    var setCollectionDirty =  ruleCollection.setCollectionDirty(false);
                    ruleCollection.isDirty.should.be.equal(false);
                });
            });

            describe("isCollectionDirty", function() {

                it("isCollectionDirty  : false", function() {
                    ruleCollection.isDirty = true;
                    var isCollectionDirty = ruleCollection.isCollectionDirty();
                    isCollectionDirty.should.be.equal(true);
                });

                it("isCollectionDirty : false", function() {
                    ruleCollection.isDirty = false;
                    var isCollectionDirty =  ruleCollection.isCollectionDirty();
                    isCollectionDirty.should.be.equal(false);
                });

            });

            describe("isGroupPolicy", function() {

                it("isGroupPolicy  policy-type should be GROUP: true", function() {
                    ruleCollection.policy = {'policy-type' : 'GROUP'};
                    var isGroupPolicy = ruleCollection.isGroupPolicy();
                    isGroupPolicy.should.be.equal(true);
                });
                it("isGroupPolicy policy-type should be be DEVICE_POLICY: true", function() {
                    ruleCollection.policy = {'policy-type' : 'DEVICE_POLICY'};
                    var isGroupPolicy = ruleCollection.isGroupPolicy();
                    isGroupPolicy.should.be.equal(false);
                });

                it("isGroupPolicy policy-type should  not be be GROUP: false", function() {
                    ruleCollection.policy = undefined;
                    var isGroupPolicy = ruleCollection.isGroupPolicy();
                    isGroupPolicy.should.be.equal(false);
                });
            });
            // juniper undefined error..

            describe("isSameDomainPolicy", function() {

                 it("isGroupPolicy  domain-id should be CURRENT_DOMAIN_ID: true", function() {
                     var currentDomain = 1232;
                 	ruleCollection.policy = {'domain-id' : currentDomain};
                    window.Juniper.sm.DomainProvider = window.Juniper.sm.DomainProvider || {
                        isCurrentDomain: function(domainId) {
                            return currentDomain === domainId;
                        }
                    };
              		var isSameDomainPolicy = ruleCollection.isSameDomainPolicy();
                    isSameDomainPolicy.should.be.equal(true);
                });

                 it("isGroupPolicy domain-id should  not be be CURRENT_DOMAIN_ID: false", function() {
                 	ruleCollection.policy = {'domain-id' : ""};
                 	var isSameDomainPolicy =  ruleCollection.isSameDomainPolicy();
                   	isSameDomainPolicy.should.be.equal(false);
                });
            });


            describe("isSavePolicyInProgress", function() {

                it("isSavePolicyInProgress: true", function() {
                    ruleCollection.setSavePolicyInProgress(true);
                    ruleCollection.isSavePolicyInProgress().should.be.equal(true);
                });

                it("isSavePolicyInProgress : false", function() {
                    ruleCollection.setSavePolicyInProgress(false);
                    ruleCollection.isSavePolicyInProgress().should.be.equal(false);
                });
            });

            describe("isPolicyReadOnly", function() {

                it("isPolicyReadOnly : true", function() {
                    ruleCollection.setPolicyReadOnly(true);
                    ruleCollection.isPolicyReadOnly().should.be.equal(true);
                });
                // juniper undefined error..
                //  it("isPolicyReadOnly : false", function() {
                //  	ruleCollection.setPolicyReadOnly(false);
                //    	ruleCollection.isPolicyReadOnly().should.be.equal(false);
                // });
            });

            describe("isSaveCommentsEnabled", function() {

                it("isSaveCommentsEnabled : false", function() {
                    ruleCollection.setSaveCommentsEnabled(false);
                    ruleCollection.isSaveCommentsEnabled().should.be.equal(false);
                });

                it("isSaveCommentsEnabled : true", function() {
                    ruleCollection.isSaveCommentsEnabledFlag = true;
                    ruleCollection.setSaveCommentsEnabled(true);
                    ruleCollection.isSaveCommentsEnabled().should.be.equal(true);
                });

            });


            describe("updatePolicyVersion", function() {

                it("updatePolicyVersion : Version Updated", function() {
                    ruleCollection.policy = {'edit-version' : ''};
                    ruleCollection.updatePolicyVersion(2);
                    ruleCollection.policy['edit-version'].should.be.equal(2);
                });

            });

            describe("getPolicyEditMessage", function() {
                var getMessage;
                beforeEach(function () {
                    getMessage = sinon.stub(context, 'getMessage');
                });

                afterEach(function () {
                    getMessage.restore();
                });

                it("getPolicyEditMessage with isCurrentlyEditingPolicy true: "+context.getMessage('ruleGrid_currently_editing_msg'), function() {
                    ruleCollection.getPolicyEditMessage(true);

                    getMessage.args[0][0].should.be.equal('ruleGrid_currently_editing_msg');
                });
                it("getPolicyEditMessage with last-modified-time true: "+context.getMessage('ruleGrid_editing_done_msg'), function() {
                    ruleCollection.policy["last-modified-time"] = new Date().getTime() - 800;
                    ruleCollection.getPolicyEditMessage(false);
                    getMessage.args[0][0].should.be.equal('ruleGrid_editing_done_msg');
                });
                it("getPolicyEditMessage with last-modified-time : "+context.getMessage('ruleGrid_edited_minutes_msg'), function() {
                    ruleCollection.policy["last-modified-time"] = new Date().getTime() - 70000;
                    ruleCollection.getPolicyEditMessage(false);
                    getMessage.args[0][0].should.be.equal('ruleGrid_edited_minutes_msg');
                    //getMessage.args[0][1].should.be.equal([Math.ceil((600000)/1000)]);
                    getMessage.args[0][1].should.be.instanceof(Array);
                    (getMessage.args[0][1].length > 0).should.be.equal(true);
                    getMessage.args[0][1][0].should.be.equal(2);
                });
                it("getPolicyEditMessage with last-modified-time : "+context.getMessage('ruleGrid_edited_hours_msg'), function() {
                    ruleCollection.policy["last-modified-time"] = new Date().getTime() - (70000*60);
                    ruleCollection.getPolicyEditMessage(false);
                    getMessage.args[0][0].should.be.equal('ruleGrid_edited_hours_msg');
                    //getMessage.args[0][1].should.be.equal([Math.ceil((600000)/1000)]);
                    getMessage.args[0][1].should.be.instanceof(Array);
                    (getMessage.args[0][1].length > 0).should.be.equal(true);
                    getMessage.args[0][1][0].should.be.equal(2);
                });
                it("getPolicyEditMessage with last-modified-time : "+context.getMessage('ruleGrid_edited_msg'), function() {
                    ruleCollection.policy["last-modified-time"] = new Date().getTime() - (70000*60*24);
                    ruleCollection.getPolicyEditMessage(false);
                    getMessage.args[0][0].should.be.equal('ruleGrid_edited_msg');
                    //getMessage.args[0][1].should.be.equal([Math.ceil((50000)/1000)]);
                    getMessage.args[0][1].should.be.instanceof(Array);
                    (getMessage.args[0][1].length > 0).should.be.equal(true);
                    getMessage.args[0][1][0].should.be.equal(2);
                });
                it("getPolicyEditMessage with Collection Dirty: "+context.getMessage('ruleGrid_currently_editing_msg'), function() {
                    ruleCollection.isDirty = true;
                    ruleCollection.getPolicyEditMessage(false);
                    getMessage.args[0][0].should.be.equal('ruleGrid_currently_editing_msg');
                });

            });
            //TypeError: Cannot read property 'trigger' of null
            describe("sync", function() {

                var apply;
                beforeEach(function () {
                    apply = sinon.stub(BaseCollection.prototype.sync, 'apply');
                });

                afterEach(function () {
                    BaseCollection.prototype.sync.apply.restore();
                });


                it("sync with out question mark in url check: true", function() {
                    var URL = ruleCollection.policyManagementConstants.POLICY_URL +policy.id+'/draft/rules';
                    /*$.mockjax({
                        url: URL+'?cuid='+CUID,
                        type: 'POST',
                        responseText: true
                    });*/
                    ruleCollection.sync('create', ruleData, {url:URL});
                    apply.called.should.be.equal(true);
                });
                it("sync with question mark in url check: true", function() {
                    var URL = ruleCollection.policyManagementConstants.POLICY_URL +policy.id+'/draft/rules?paging=(start%20eq%200,%20limit%20eq%2050)';
                   /* $.mockjax({
                        url: URL+'&cuid='+CUID,
                        type: 'POST',
                        responseText: true
                    });*/
                    ruleCollection.sync('create', ruleData, {url:URL});
                    apply.called.should.be.equal(true);
                });

            });

            describe("parse", function() {

                it("parse with json root", function() {
                    var parse = ruleCollection.parse({ruleCollection:{rules:{id:123}}});
                    parse.id.should.be.equal(123);

                });
                it("parse with out json root", function() {
                    ruleCollection.jsonRoot = "";
                    var parse = ruleCollection.parse({ruleCollection:{rules:{id:123}}});
                    parse.ruleCollection.rules.id.should.be.equal(123);
                });

            });
            describe("deleteRule Success Handler", function() {
                var updateRuleToStore, ruleIds = [123,456];
                beforeEach(function () {
                    updateRuleToStore = sinon.stub(ruleCollection, 'updateRuleToStore');
                });

                afterEach(function () {
                    ruleCollection.updateRuleToStore.restore();
                });

                it("deleteRule with id list updateRuleToStore Trigger check", function() {
                    ruleCollection.deleteRule(ruleIds);
                    updateRuleToStore.called.should.be.equal(true);
                });
                it("deleteRule with id list updateRuleToStore arguments (deletedRules, 'deleteAction')", function() {
                    ruleCollection.deleteRule(ruleIds);
                    var params = updateRuleToStore.args[0];

                    params[1].should.be.equal('deleteAction');
                    params[0]['modify-rules']['deleted-rules']['deleted-rule'].should.be.instanceof(Array);
                    (params[0]['modify-rules']['deleted-rules']['deleted-rule'].length > 0).should.be.equal(true);
                    params[0]['modify-rules']['deleted-rules']['deleted-rule'][0].should.be.equal(ruleIds[0]);
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                });

            });
            describe("deleteRule Error Handler", function() {
                var updateRuleToStore;
                beforeEach(function () {
                    updateRuleToStore = sinon.stub(ruleCollection, 'updateRuleToStore');
                    ruleCollection.setCollectionDirty(false);
                });

                afterEach(function () {
                    ruleCollection.updateRuleToStore.restore();
                });

                it("deleteRule with id list", function() {
                    ruleCollection.deleteRule([123456]);
                    updateRuleToStore.called.should.be.equal(true);
                    ruleCollection.isCollectionDirty().should.be.equal(false);
                });

            });
            describe("updateRuleToStore Success Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.updateRuleToStore(ruleData,{}, 12345);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.updateRuleToStore(ruleData,{}, 12345);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_MODIFY);
                });
                it("updateRuleToStore with id list --> refresh-page trigger check", function() {
                    ruleCollection.updateRuleToStore(ruleData,{}, 12345);
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                    trigger.called.should.be.equal(true);
                });
                it("updateRuleToStore with id list --> refresh-page trigger arguments ('refresh-page',editRuleIdObj, false,false, true)", function() {
                    ruleCollection.updateRuleToStore(ruleData,{}, 12345);
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                    params[1].editRuleId.should.be.equal(12345);
                    params[2].should.be.equal(false);
                    params[3].should.be.equal(false);
                    params[4].should.be.equal(true);

                });

            });
            describe("updateRuleToStore Error Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                    ruleCollection.setCollectionDirty(false);
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });

                it("updateRuleToStore with id list", function() {
                    ruleCollection.updateRuleToStore(ruleData,{}, 12345);
                    trigger.called.should.be.equal(false);
                    ruleCollection.isCollectionDirty().should.be.equal(false);
                });

            });
            describe("search", function() {

                it("search", function() {
                    ruleCollection.search("test");
                });

            });
            describe("expandCollapseRuleGroup  Success Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"expand");
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"expand");
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    params[2].url.should.be.equal(ruleCollection.policyManagementConstants.POLICY_URL + ruleCollection.policyID + ruleCollection.policyManagementConstants.RULE_DRAFT + "/2097158/expand");
                });
                it("expandCollapseRuleGroup expand --> check for refresh-page triggered", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"expand");
                    trigger.called.should.be.equal(true);

                });
                it("expandCollapseRuleGroup expand --> check for refresh-page arguments ('refresh-page')", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"expand");
                    trigger.args[0][0].should.be.equal('refresh-page');

                });
                it("expandCollapseRuleGroup collapse --> check for refresh-page triggered", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"collapse");
                    trigger.called.should.be.equal(true);

                });
                it("expandCollapseRuleGroup collapse --> check for refresh-page arguments ('refresh-page')", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"collapse");
                    trigger.args[0][0].should.be.equal('refresh-page');

                });

            });
            describe("expandCollapseRuleGroup  Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("expandCollapseRuleGroup expand", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"expand");
                    trigger.called.should.be.equal(false);
                });
                it("expandCollapseRuleGroup collapse", function() {
                    ruleCollection.expandCollapseRuleGroup(ruleData,"collapse");
                    trigger.called.should.be.equal(false);
                });

            });
            describe("expandAllRules Success Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.expandAllRules();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.expandAllRules();
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_EXPANDALL);
                });
                it("expandCollapseRuleGroup --> check for trigger refresh-page", function() {
                    ruleCollection.expandAllRules();
                    trigger.called.should.be.equal(true);
                });
                it("expandCollapseRuleGroup --> check for trigger arguments ('refresh-page',{}, true)", function() {
                    ruleCollection.expandAllRules();
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                    params[2].should.be.equal(true);
                });

            });
            describe("expandAllRules Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("expandCollapseRuleGroup ", function() {
                    ruleCollection.expandAllRules();
                    trigger.called.should.be.equal(false);
                });

            });
            describe("collapseAllRules Success Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.collapseAllRules();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.collapseAllRules();
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_COLLAPSEALL);
                });
                it("collapseAllRules  --> check for trigger refresh-page", function() {
                    ruleCollection.collapseAllRules();
                    trigger.called.should.be.equal(true);
                });
                it("collapseAllRules --> check for trigger arguments ('refresh-page',{}, true)", function() {
                    ruleCollection.collapseAllRules();
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                    params[2].should.be.equal(true);
                });

            });
            describe("collapseAllRules Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("collapseAllRules ", function() {
                    ruleCollection.collapseAllRules();
                    trigger.called.should.be.equal(false);
                });

            });
            describe("savePolicy Success Handler with success true", function() {
                var  trigger, date = new Date().getTime();
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        ruleCollection.trigger.restore();
                        trigger = sinon.stub(ruleCollection, 'trigger');
                        options.success({saveResult:{resultMap:{},success: true, currentVersion:3, lastModifiedTime:date, saveMessageFailureInfo:{key: 'testKey', parameters: "testParameters"}}});
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.savePolicy("test with comments");
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.savePolicy("test with comments");
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.DRAFT_SAVE_POLICY);
                });
                it("savePolicy with saveComments with success case --> check trigger after-policy-save", function() {
                    ruleCollection.savePolicy("test with comments");
                    trigger.called.should.be.equal(true);
                });

                it("savePolicy with saveComments with success case --> check trigger arguments('after-policy-save', errorkey, params, ruleIdMap);", function() {
                    ruleCollection.savePolicy("test with comments");
                    var params = trigger.args[0];
                    params[0].should.be.equal('after-policy-save');
                    params[1].should.be.equal('');
                    params[2].should.be.equal('');
                });

                it("savePolicy with out saveComments with success case", function() {
                    ruleCollection.savePolicy();
                    ruleCollection.isCollectionDirty().should.be.equal(false);
                    ruleCollection.policy["edit-version"].should.be.equal(3);
                    ruleCollection.policy["last-modified-time"].should.be.equal(date);
                    ruleCollection.isSavePolicyInProgress().should.be.equal(false);
                });

            });
            describe("savePolicy Success Handler with success false", function() {
                var  trigger, date = new Date().getTime();
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        ruleCollection.trigger.restore();
                        trigger = sinon.stub(ruleCollection, 'trigger');
                        options.success({saveResult:{resultMap:{},success: false, currentVersion:3, lastModifiedTime:date, saveMessageFailureInfo:{key: 'testKey', parameters: "testParameters"}}});
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });

                it("savePolicy with saveComments with success case --> check trigger after-policy-save", function() {
                    ruleCollection.savePolicy("test with comments");
                    trigger.called.should.be.equal(true);
                });

                it("savePolicy with saveComments with success case --> check trigger arguments('after-policy-save', errorkey, params, ruleIdMap);", function() {
                    ruleCollection.savePolicy("test with comments");
                    var params = trigger.args[0];
                    params[0].should.be.equal('after-policy-save');
                    params[1].should.be.equal('testKey');
                    params[2].should.be.equal('testParameters');
                });

                it("savePolicy with out saveComments with success case", function() {
                    ruleCollection.setCollectionDirty(true);
                    ruleCollection.setSavePolicyInProgress(true);
                    ruleCollection.savePolicy();
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                    ruleCollection.isSavePolicyInProgress().should.be.equal(false);
                });


            });
            describe("savePolicy Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        ruleCollection.trigger.restore();
                        trigger = sinon.stub(ruleCollection, 'trigger');
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });

                it("savePolicy with saveComments with success case", function() {
                    ruleCollection.savePolicy("test with comments");
                    trigger.called.should.be.equal(false);
                });

            });
            describe("modifyRule Success Handler", function() {
                var  trigger, date = new Date().getTime();
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        ruleCollection.trigger.restore();
                        trigger = sinon.stub(ruleCollection, 'trigger');
                        options.success({saveResult:{resultMap:{},success: false, currentVersion:3, lastModifiedTime:date, saveMessageFailureInfo:{key: 'testKey', parameters: "testParameters"}}});
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.modifyRule(ruleData);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.modifyRule(ruleData);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_MODIFY);
                });
                it("modifyRule success case --> check trigger refresh-page", function() {
                    ruleCollection.modifyRule(ruleData);
                    trigger.called.should.be.equal(true);
                });

                it("modifyRule success case with rule type as ruleGroup--> check trigger arguments('refresh-page', refreshOptions);", function() {
                    ruleCollection.modifyRule(ruleData);
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                    (_.isEmpty(params[1].dnd)).should.be.equal(true);
                });
                it("modifyRule success case with rule type as not group--> check trigger arguments('refresh-page', refreshOptions); wit rulegroup as undefined", function() {
                    ruleCollection.modifyRule(ruleData2);
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                    params[1].editRuleId.should.be.equal(2097159);
                });
            });
            describe("modifyRule Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        ruleCollection.trigger.restore();
                        trigger = sinon.stub(ruleCollection, 'trigger');
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });

                it("modifyRule error case", function() {
                    ruleCollection.modifyRule(ruleData);
                    trigger.called.should.be.equal(false);
                });

            });

            describe("getMoveRuleReferenceRuleID", function() {

                it("getMoveRuleReferenceRuleID up with reference ID  equal to rule ID", function() {

                    ruleCollection.getMoveRuleReferenceRuleID(ruleGroup, "Up");
                });
                it("getMoveRuleReferenceRuleID down with reference ID  equal to rule ID", function() {
                    ruleCollection.getMoveRuleReferenceRuleID(ruleGroup, "Down");
                });
                it("getMoveRuleReferenceRuleID no direction specified with reference ID  equal to rule ID", function() {
                    ruleCollection.getMoveRuleReferenceRuleID(ruleGroup);
                });

                it("getMoveRuleReferenceRuleID up with reference ID not equal to rule ID", function() {

                    ruleCollection.getMoveRuleReferenceRuleID(ruleData, "Up");
                });
                it("getMoveRuleReferenceRuleID down with reference ID not equal to rule ID", function() {
                    ruleCollection.getMoveRuleReferenceRuleID(ruleData, "Down");
                });
                it("getMoveRuleReferenceRuleID no direction specified with reference ID not equal to rule ID", function() {
                    ruleCollection.getMoveRuleReferenceRuleID(ruleData);
                });

            });
            describe("addRuleGroup Success Handler1", function() {
                var  moveRulesOnStore;
                beforeEach(function () {
                    moveRulesOnStore = sinon.stub(ruleCollection, 'moveRulesOnStore');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response = {
                            "firewall-rule":{
                                "app-fw-policy":{},
                                "rule-group-type":"CUSTOM",
                                "utm-policy":{},
                                "rule-profile":{
                                    "profile-type":"CUSTOM"
                                },
                                "rule-order":1,
                                "ips-enabled":false,
                                "policy-id":262153,
                                "destination-address":{
                                    "exclude-list":false,
                                    "addresses":{
                                        "address-reference":[]
                                    }
                                },
                                "version":0,
                                "rule-type":"RULEGROUP",
                                "vpn-tunnel-refs":{},
                                "disabled":false,
                                "id":-7,
                                "hit-count-details":{},
                                "edit-version":0,
                                "rule-group-id":262156,
                                "scheduler":{},
                                "services":{},
                                "sec-intel-policy":{},
                                "custom-column-data":"",
                                "description":"",
                                "sourceidentities":{},
                                "destination-zone":{},
                                "name":"testG1",
                                "source-zone":{},
                                "ssl-forward-proxy-profile":{},
                                "source-address":{
                                    "exclude-list":false,
                                    "addresses":{
                                        "address-reference":[]
                                    }
                                },
                                "is-leaf":false,
                                "expanded":false,
                                "serial-number":0,
                                "is-predefined":false,
                                "count":0,
                                "error-level":-1,
                                "global-rule":false,
                                "is-first-item":false,
                                "is-last-item":false
                            }
                        }, true);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.moveRulesOnStore.restore();
                });

                it("addRuleGroup success case --> check for collection dirty", function() {
                    ruleCollection.addRuleGroup(ruleData, "", [2097159]);
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                });

                it("addRuleGroup success case with rule type as ruleGroup--> check trigger arguments('refresh-page', refreshOptions)l;", function() {
                    ruleCollection.addRuleGroup(ruleData, "", [2097159]);
                    moveRulesOnStore.called.should.be.equal(true);
                    var params = moveRulesOnStore.args[0];
                    params[0].should.be.instanceof(Array);
                    (params[0].length > 0).should.be.equal(true);
                    params[0][0].should.be.equal(2097159);
                });
            });
            describe("addRuleGroup Success Handler2", function() {
                var  moveRulesOnStore;
                beforeEach(function () {
                    moveRulesOnStore = sinon.stub(ruleCollection, 'moveRulesOnStore');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success({
                            "firewall-rule":{
                                "app-fw-policy":{},
                                "rule-group-type":"CUSTOM",
                                "utm-policy":{},
                                "rule-profile":{
                                    "profile-type":"CUSTOM"
                                },
                                "rule-order":1,
                                "ips-enabled":false,
                                "policy-id":262153,
                                "destination-address":{
                                    "exclude-list":false,
                                    "addresses":{
                                        "address-reference":[]
                                    }
                                },
                                "version":0,
                                "rule-type":"RULE",
                                "vpn-tunnel-refs":{},
                                "disabled":false,
                                "id":-7,
                                "hit-count-details":{},
                                "edit-version":0,
                                "rule-group-id":262156,
                                "scheduler":{},
                                "services":{},
                                "sec-intel-policy":{},
                                "custom-column-data":"",
                                "description":"",
                                "sourceidentities":{},
                                "destination-zone":{},
                                "name":"testG1",
                                "source-zone":{},
                                "ssl-forward-proxy-profile":{},
                                "source-address":{
                                    "exclude-list":false,
                                    "addresses":{
                                        "address-reference":[]
                                    }
                                },
                                "is-leaf":false,
                                "expanded":false,
                                "serial-number":0,
                                "is-predefined":false,
                                "count":0,
                                "error-level":-1,
                                "global-rule":false,
                                "is-first-item":false,
                                "is-last-item":false
                            }
                        }, true);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.moveRulesOnStore.restore();
                });

                it("addRuleGroup success case with rule type as not group--> check trigger arguments('refresh-page', refreshOptions); wit rulegroup as undefined", function() {
                    ruleCollection.addRuleGroup(ruleData2, "", [2097159]);
                    moveRulesOnStore.called.should.be.equal(false);

                });
            });
            describe("addRuleGroup Error Handler", function() {
                var  moveRulesOnStore;
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(false);
                    moveRulesOnStore = sinon.stub(ruleCollection, 'moveRulesOnStore');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.moveRulesOnStore.restore();
                });

                it("addRuleGroup error case", function() {
                    ruleCollection.addRuleGroup(ruleData,"",[]);
                    ruleCollection.isCollectionDirty().should.be.equal(false);
                    moveRulesOnStore.called.should.be.equal(false);
                });

            });

            describe("modifyRuleGroup Success Handler", function() {
                var  modifyRule;
                beforeEach(function () {
                    modifyRule = sinon.stub(ruleCollection, 'modifyRule');
                });

                afterEach(function () {
                    ruleCollection.modifyRule.restore();
                });

                it("modifyRuleGroup success case --> check modifyRule called", function() {
                    ruleCollection.modifyRuleGroup(ruleData2, "test", "description");
                    modifyRule.called.should.be.equal(true);

                });
                it("modifyRuleGroup success case --> check modifyRule arguments(rule)", function() {
                    ruleCollection.modifyRuleGroup(ruleData2, "test", "description");
                    var params = modifyRule.args[0];
                    params[0].attributes.name.should.be.equal("test");
                    params[0].attributes.description.should.be.equal("description");
                });
            });

            describe("moveRule Success Handler", function() {
                var  moveRulesOnStore;
                beforeEach(function () {
                    moveRulesOnStore = sinon.stub(ruleCollection, 'moveRulesOnStore');
                });

                afterEach(function () {
                    ruleCollection.moveRulesOnStore.restore();
                });

                it("moveRule check for moveRulesOnStore called", function() {
                    ruleCollection.moveRule(2097159,"testGroupModify");
                    moveRulesOnStore.called.should.be.equal(true);
                });

                it("moveRule check for moveRulesOnStore with direction UP arguments ([ruleId], ruleGroupID, direction, referenceRuleID, actionObject)", function() {
                    ruleCollection.moveRule(2097159,"Up");
                    var params = moveRulesOnStore.args[0];
                    params[0].should.be.instanceof(Array);
                    (params[0].length > 0).should.be.equal(true);
                    params[0][0].should.be.equal(2097159);
                    params[2].should.be.equal("Up");
                    params[3].should.be.equal(2097158);
                    params[4].action.should.be.equal("moveRuleAction");
                });
                it("moveRule check for moveRulesOnStore with direction DOWN arguments ([ruleId], ruleGroupID, direction, referenceRuleID, actionObject)", function() {
                    ruleCollection.moveRule(2097159,"Down");
                    var params = moveRulesOnStore.args[0];
                    params[0].should.be.instanceof(Array);
                    (params[0].length > 0).should.be.equal(true);
                    params[0][0].should.be.equal(2097159);
                    params[2].should.be.equal("Down");
                    params[3].should.be.equal(2097160);
                    params[4].action.should.be.equal("moveRuleAction");
                });


            });
            describe("moveRulesOnStore Success Handler", function() {
                var  trigger, setCollectionDirty;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                    ruleCollection.setCollectionDirty.restore();
                });
                it("sync called check", function() {
                    ruleCollection.moveRulesOnStore([2097160], 123);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.moveRulesOnStore([2097160], 123);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_MOVE);
                });

                it("moveRulesOnStore success case --> check trigger refresh-page: true", function() {
                    ruleCollection.moveRulesOnStore([2097160], 123);
                    ruleCollection.isCollectionDirty().should.be.equal(true);
                    trigger.called.should.be.equal(true);
                });
                it("moveRulesOnStore success case --> check trigger refresh-page: false", function() {
                    ruleCollection.moveRulesOnStore([2097160], undefined);
                    trigger.called.should.be.equal(false);
                });

                it("moveRulesOnStore success case --> check trigger arguments('refresh-page');", function() {
                    ruleCollection.moveRulesOnStore([2097160], 123);
                    var params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                });
            });
            describe("moveRulesOnStore Error Handler", function() {
                var  trigger;
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(false);
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("moveRulesOnStore error case --> check trigger refresh-page: false", function() {
                    ruleCollection.moveRulesOnStore([2097160], 123);
                    ruleCollection.isCollectionDirty().should.be.equal(false);
                    trigger.called.should.be.equal(false);
                });
            });

            describe("moveRulesOnStore Success Handler", function() {
                beforeEach(function () {
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                });
                it("sync called check", function() {
                    ruleCollection.copyRules([2097159]);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.copyRules([2097159]);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_COPY);
                });

                it("copyRules success case --> check hasCopiedRules: true", function() {
                    ruleCollection.copyRules([2097159]);
                    ruleCollection.hasCopiedRules.should.be.equal(true);
                });

            });
            describe("copyRules Error Handler", function() {
                beforeEach(function () {
                    ruleCollection.hasCopiedRules = false;
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                });
                it("copyRules error case --> check hasCopiedRules: false", function() {
                    ruleCollection.copyRules([2097159]);
                    ruleCollection.hasCopiedRules.should.be.equal(false);
                });
            });
            describe("enableDisableRules Success Handler", function() {
                var trigger, response = {ruleIdList: { ruleIDs: [2097159]}};
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.enableDisableRules([2097159], true);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.enableDisableRules([2097159], true);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_DISABLE);
                });

                it("enableDisableRules success case --> check trigger: true", function() {
                    ruleCollection.enableDisableRules([2097159], true);
                    trigger.called.should.be.equal(true);
                });
                it("enableDisableRules success case --> check trigger arguments(refresh-page)", function() {
                    ruleCollection.enableDisableRules([2097159], false);
                    var params = trigger.args[2];
                    params[0].should.be.equal('refresh-page');
                });

            });
            describe("enableDisableRules Success Handler", function() {
                var trigger, response = {ruleIdList: { ruleIDs: 2097159}};
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });

                it("enableDisableRules success case with response object of only rule id--> check trigger: true", function () {
                    ruleCollection.enableDisableRules([2097159], true);
                    trigger.called.should.be.equal(true);
                });
                it("enableDisableRules success case --> check trigger arguments(refresh-page)", function () {
                    ruleCollection.enableDisableRules([2097159], false);
                    console.log(trigger.args);
                    var params = trigger.args[2];
                    params[0].should.be.equal('refresh-page');
                });
            });

            describe("enableDisableRules Success Handler with response  with response object of only rule id ", function() {
                var trigger, response = {ruleIdList: { ruleIDs: undefined}};
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("enableDisableRules success case --> check trigger arguments(refresh-page)", function() {
                    ruleCollection.enableDisableRules(undefined, true);
                    trigger.called.should.be.equal(false);
                });

            });
            describe("enableDisableRules Error Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("enableDisableRules error case --> check hasCopiedRules: false", function() {
                    ruleCollection.enableDisableRules([2097159], true);
                    trigger.called.should.be.equal(false);
                });
            });

            describe("cloneRule Success Handler", function() {
                var highlightRule, response = {ruleCollection: {
                    rules: [
                        {id: 12345}
                    ]
                }
                };
                beforeEach(function () {
                    highlightRule = sinon.stub(ruleCollection, 'highlightRule');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.highlightRule.restore();
                });
                it("sync called check", function() {
                    ruleCollection.cloneRule(2097159);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.cloneRule(2097159);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT + "/2097159" + ruleCollection.policyManagementConstants.RULE_DRAFT_CLONE);
                });
                it("cloneRule success case --> check trigger called", function() {
                    ruleCollection.cloneRule(2097159);
                    highlightRule.called.should.be.equal(true);
                });
                it("cloneRule success case --> check trigger arguments(refresh-page)", function() {
                    ruleCollection.cloneRule(2097159);
                    var params = highlightRule.args[0];
                    params[0].should.be.equal('afterCreateRule');
                });

            });
            describe("cloneRule Error Handler", function() {
                var highlightRule;
                beforeEach(function () {
                    highlightRule = sinon.stub(ruleCollection, 'highlightRule');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.highlightRule.restore();
                });
                it("cloneRule error case --> check hasCopiedRules: false", function() {
                    ruleCollection.cloneRule(2097159);
                    highlightRule.called.should.be.equal(false);
                });
            });

            describe("pasteRules Success Handler", function() {
                var highlightRule, response = {"paste-response":{"success":false,"pastedRuleIds":[-1],"ruleResponseList":[{"messages":[{"key":"NAME_CHANGED_DURING_PASTE","parameters":["r1-1","r1-3"]}]}]}};
                beforeEach(function () {
                    highlightRule = sinon.stub(ruleCollection, 'highlightRule');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.highlightRule.restore();
                });
                it("sync called check", function() {
                    ruleCollection.pasteRules([2097159], "Up");
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.pasteRules([2097159], "Up");
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_PASTE);
                });
                it("pasteRules success case UP--> check trigger called", function() {
                    ruleCollection.pasteRules([2097159], "Up");
                    highlightRule.called.should.be.equal(true);
                });
                it("pasteRules success case UP--> check trigger arguments(afterCreateRule)", function() {
                    ruleCollection.pasteRules([2097159], "Up");
                    var params = highlightRule.args[0];
                    params[0].should.be.equal('afterCreateRule');
                });
                it("pasteRules success case Down--> check trigger called", function() {
                    ruleCollection.pasteRules([2097159], "Down");
                    highlightRule.called.should.be.equal(true);
                });
                it("pasteRules success case Down --> check trigger arguments(afterCreateRule)", function() {
                    ruleCollection.pasteRules([2097159], "Down");
                    var params = highlightRule.args[0];
                    params[0].should.be.equal('afterCreateRule');
                });

            });
            describe("pasteRules Success Handler with empty response", function() {
                var highlightRule, response = {"paste-response":{}};
                beforeEach(function () {
                    highlightRule = sinon.stub(ruleCollection, 'highlightRule');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.highlightRule.restore();
                });

                it("pasteRules success case Down--> check trigger called: true", function() {
                    ruleCollection.pasteRules([2097159], "Down");
                    highlightRule.called.should.be.equal(true);
                });

            });
            describe("pasteRules Error Handler", function() {
                var highlightRule, editLockErrorMsg;
                beforeEach(function () {
                    highlightRule = sinon.stub(ruleCollection, 'highlightRule');
                    editLockErrorMsg = sinon.stub(ruleCollection, 'editLockErrorMsg');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error(ruleData);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.highlightRule.restore();
                    ruleCollection.editLockErrorMsg.restore();
                });
                it("pasteRules error case --> check hasCopiedRules: false and editLockErroMsg : true", function() {
                    ruleCollection.pasteRules([2097159], "Up");
                    highlightRule.called.should.be.equal(false);
                    editLockErrorMsg.called.should.be.equal(true);
                    var params = editLockErrorMsg.args[0];
                    typeof params[0].should.be.instanceof(RuleModel);
                    params[1].policyID.should.be.equal(ruleCollection.policyID);

                });
            });
            describe("editLockErrorMsg", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                });

                afterEach(function () {
                    ruleCollection.trigger.restore();
                });
                it("editLockErrorMsg without model: trigger called: false", function() {
                    ruleCollection.editLockErrorMsg(null, ruleCollection);
                    trigger.called.should.be.equal(false);
                });
                it("editLockErrorMsg with model: trigger called: false", function() {
                    ruleCollection.editLockErrorMsg(ruleData, ruleCollection);
                    trigger.called.should.be.equal(false);
                });
                it("editLockErrorMsg with POLICY_EDIT_LOCK_NOT_AVAILABLE: trigger called: true", function() {
                    ruleData.responseText = ruleCollection.policyManagementConstants.POLICY_EDIT_LOCK_NOT_AVAILABLE
                    ruleCollection.editLockErrorMsg(ruleData,ruleCollection);
                    trigger.called.should.be.equal(true);

                });
                it("editLockErrorMsg with POLICY_EDIT_LOCK_NOT_AVAILABLE: triger arguments check", function() {
                    ruleData.responseText = ruleCollection.policyManagementConstants.POLICY_EDIT_LOCK_NOT_AVAILABLE
                    ruleCollection.editLockErrorMsg(ruleData,ruleCollection);
                    var params = trigger.args[0];
                    params[0].should.be.equal("policy-edit-lock-not-available")

                });

            });
            describe("pasteInPlaceRule Success Handler", function() {
                var trigger,processPasteResponse, setCollectionDirty, response = {"paste-response":{"success":true,"pastedRuleIds":[-1],"ruleResponseList":[{"messages":[{"key":"NAME_CHANGED_DURING_PASTE","parameters":["r1-1","r1-3"]}]}]}};
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    processPasteResponse = sinon.stub(ruleCollection, 'processPasteResponse');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success(response);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.processPasteResponse.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.pasteInPlaceRule("testRule");
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.pasteInPlaceRule("testRule");
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_PASTE);
                });
                it("pasteInPlaceRule with rule name check for processPasteResponse, setCollectionDirty and trigger called", function() {
                    ruleCollection.pasteInPlaceRule("testRule");
                    processPasteResponse.called.should.be.equal(true);
                    setCollectionDirty.called.should.be.equal(true);
                    trigger.called.should.be.equal(true);
                });
                it("pasteInPlaceRule with rule name: check for arguments of processPasteResponse, setCollectionDirty and trigger", function() {
                    ruleCollection.pasteInPlaceRule("testRule");
                    var params = processPasteResponse.args[0];
                    params[0]["paste-response"].success.should.be.equal(true);
                    params = setCollectionDirty.args[0];
                    params[0].should.be.equal(true);
                    params = trigger.args[0];
                    params[0].should.be.equal("refresh-page");
                });
                it("pasteInPlaceRule with out  rule name", function() {
                    ruleCollection.pasteInPlaceRule();
                    processPasteResponse.called.should.be.equal(true);
                    setCollectionDirty.called.should.be.equal(true);
                });

            });
            describe("pasteInPlaceRule Error Handler", function() {
                var editLockErrorMsg, processPasteResponse, setCollectionDirty;
                beforeEach(function () {
                    editLockErrorMsg = sinon.stub(ruleCollection, 'editLockErrorMsg');
                    processPasteResponse = sinon.stub(ruleCollection, 'processPasteResponse');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error(ruleData);
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.processPasteResponse.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.editLockErrorMsg.restore();
                });
                it("pasteInPlaceRule error case", function() {
                    ruleCollection.pasteInPlaceRule("testRule");
                    processPasteResponse.called.should.be.equal(false);
                    setCollectionDirty.called.should.be.equal(false);
                    editLockErrorMsg.called.should.be.equal(true);
                    var params = editLockErrorMsg.args[0];
                    typeof params[0].should.be.instanceof(RuleModel);
                    params[1].policyID.should.be.equal(ruleCollection.policyID);
                });
            });

            describe("cloneRule Success Handler", function() {
                var ruleIds = [2097158, 2097159,2097160], trigger, setCollectionDirty;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("trigger called check", function() {
                    ruleCollection.cutRules(ruleIds);
                    trigger.called.should.be.equal(true);
                });
                it("trigger arguments check", function() {
                    ruleCollection.cutRules(ruleIds);
                    var params = trigger.args[0];
                    params[0].should.be.equal('clearSelection');
                    params[1].should.be.instanceof(Array);
                    (params[1].length > 0).should.be.equal(true);
                    params[1][0].should.be.equal(ruleIds[0]);

                });
                it("sync called check", function() {
                    ruleCollection.cutRules(ruleIds);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.cutRules(ruleIds);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_CUT);
                });
                it("cutRules success case --> check setCollectionDirty and trigger called", function() {
                    ruleCollection.cutRules(ruleIds);
                    ruleCollection.hasCopiedRules.should.be.equal(true);
                    setCollectionDirty.called.should.be.equal(true);
                    trigger.called.should.be.equal(true);
                });
                it("cutRules success case --> check trigger arguments(refresh-page) and setCollectionDirty(true)", function() {
                    ruleCollection.cutRules(ruleIds);
                    var params = setCollectionDirty.args[0];
                    params[0].should.be.equal(true);
                    params = trigger.args[0];
                    // params[0].should.be.equal('refresh-page');
                });

            });
            describe("cutRules Error Handler", function() {
                var ruleIds = [2097158, 2097159,2097160], trigger, setCollectionDirty;
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(false);
                    ruleCollection.hasCopiedRules = false;
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("cutRules error case --> check setCollectionDirty and hasCopiedRules : false", function() {
                    ruleCollection.cutRules(ruleIds);
                    setCollectionDirty.called.should.be.equal(false);
                    ruleCollection.hasCopiedRules.should.be.equal(false);
                });
            });

            describe("ungroupRules Success Handler", function() {
                var ruleIds = [2097158, 2097159,2097160], trigger, setCollectionDirty;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.ungroupRules(ruleIds);
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.ungroupRules(ruleIds);
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_UNGROUP);
                });
                it("ungroupRules success case --> check setCollectionDirty and trigger called", function() {
                    ruleCollection.ungroupRules(ruleIds);
                    setCollectionDirty.called.should.be.equal(true);
                    trigger.called.should.be.equal(true);
                });
                it("ungroupRules success case --> check trigger arguments(refresh-page) and setCollectionDirty(true)", function() {
                    ruleCollection.ungroupRules(ruleIds);
                    var params = setCollectionDirty.args[0];
                    params[0].should.be.equal(true);
                    params = trigger.args[0];
                    params[0].should.be.equal('refresh-page');
                });

            });
            describe("ungroupRules Error Handler", function() {
                var ruleIds = [2097158, 2097159,2097160], trigger, setCollectionDirty;
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(false);
                    ruleCollection.hasCopiedRules = false;
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("cutRules error case --> check setCollectionDirty and hasCopiedRules : false", function() {
                    ruleCollection.ungroupRules(ruleIds);
                    setCollectionDirty.called.should.be.equal(false);
                    trigger.called.should.be.equal(false);
                });
            });

            describe("ungroupRules Success Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.handleFilter();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.handleFilter();
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_FILTER);
                });
                it("ungroupRules success case --> check setCollectionDirty and trigger called", function() {
                    ruleCollection.handleFilter();
                    trigger.called.should.be.equal(true);
                });
                it("ungroupRules success case --> check trigger arguments(refresh-page) and setCollectionDirty(true)", function() {
                    ruleCollection.handleFilter();
                    var params = trigger.args[0];
                    params[0].should.be.equal('load-filtered');
                });

            });
            describe("handleFilter Error Handler", function() {
                var trigger, setCollectionDirty;
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(false);
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                    ruleCollection.trigger.restore();
                });
                it("handleFilter error case --> check setCollectionDirty and trigger: false", function() {
                    ruleCollection.handleFilter();
                    setCollectionDirty.called.should.be.equal(false);
                    trigger.called.should.be.equal(false);
                });
            });
            describe("ungroupRules Success Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.trigger.restore();
                });
                it("sync called check", function() {
                    ruleCollection.handleFilter();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.handleFilter();
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_FILTER);
                });
                it("ungroupRules success case --> check setCollectionDirty and trigger called", function() {
                    ruleCollection.handleFilter();
                    trigger.called.should.be.equal(true);
                });
                it("ungroupRules success case --> check trigger arguments(refresh-page) and setCollectionDirty(true)", function() {
                    ruleCollection.handleFilter();
                    var params = trigger.args[0];
                    params[0].should.be.equal('load-filtered');
                });

            });

            describe("resetStore Success Handler", function() {
                var setCollectionDirty, callBack = function(){};
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(true);
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                });
                it("sync called check", function() {
                    ruleCollection.resetStore();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.resetStore();
                    var params = stub.args[0];
                    params[0].should.be.equal('create');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT_RESET_STORE);
                });
                it("resetStore Success case --> check setCollectionDirty: false", function() {
                    ruleCollection.handleFilter();
                    setCollectionDirty.called.should.be.equal(false);
                });
                it("resetStore Success case --> check setCollectionDirty arguments", function() {
                    ruleCollection.resetStore(callBack);
                    var params = setCollectionDirty.args[0];
                    params[0].should.be.equal(false);
                });
            });
            describe("resetStore Error Handler", function() {
                var  setCollectionDirty, callBack = function(){};
                beforeEach(function () {
                    ruleCollection.setCollectionDirty(true);
                    setCollectionDirty = sinon.stub(ruleCollection, 'setCollectionDirty');
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                    ruleCollection.setCollectionDirty.restore();
                });
                it("handleFilter error case --> check setCollectionDirty and trigger: false", function() {
                    ruleCollection.resetStore(callBack);
                    setCollectionDirty.called.should.be.equal(false);
                });
            });
            describe("checkCopiedRules Success Handler", function() {
                beforeEach(function () {
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.success({Boolean: true});
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                });
                it("sync called check", function() {
                    ruleCollection.checkCopiedRules();
                    stub.called.should.be.equal(true);
                });
                it("sync arguments check", function() {
                    ruleCollection.checkCopiedRules();
                    var params = stub.args[0];
                    params[0].should.be.equal('read');
                    typeof params[1].should.be.instanceof(RuleModel);
                    params[2].url.should.be.equal(ruleCollection.policyManagementConstants.POLICY_URL + ruleCollection.policyManagementConstants.RULE_DRAFT_COPIED);
                });
                it("checkCopiedRules Success case --> check hasCopiedRules: true", function() {
                    ruleCollection.checkCopiedRules();
                    ruleCollection.hasCopiedRules.should.be.equal(true);
                });

            });
            describe("checkCopiedRules Error Handler", function() {
                beforeEach(function () {
                    stub = sinon.stub(ruleCollection, 'sync', function (mode, model, options) {
                        options.error();
                    });
                });

                afterEach(function () {
                    ruleCollection.sync.restore();
                });
                it("checkCopiedRules error case --> check setCollectionDirty and trigger: false", function() {
                    ruleCollection.checkCopiedRules();
                });
            });

            describe("buildZoneFilter", function() {

                it("buildZoneFilter source", function() {
                    ruleCollection.buildZoneFilter(['zonevalue'],"source",{and:[]});
                });
                it("buildZoneFilter destintation", function() {
                    ruleCollection.buildZoneFilter(['zonevalue'],"destination",{and:[]});
                });

            });
            describe("fetchZonesByIDs", function() {

                it("fetchZonesByIDs ", function(done) {
                    $.mockjax({
                        url: '/api/juniper/sd/zoneset-management/zone-sets?filter=(id+eq+123+or+id+eq+456)',
                        type: 'GET',
                        status: 200,
                        responseText: true,
                        response: function(settings, done2){
                            done2();
                            $.mockjax.clear();
                            done();
                        }
                    });
                   ruleCollection.fetchZonesByIDs([123, 456]);
                });

            });

            describe("getPolicy", function() {

                beforeEach(function () {
                    ruleCollection.callBack = function(data){ };
                    ruleCollection['policy']['id'] = ruleCollection.policyID;
                    stub = sinon.stub(ruleCollection, 'callBack');
                });

                afterEach(function () {
                    ruleCollection.callBack.restore();
                    $.mockjax.clear();
                });

                it("getPolicy success handler", function(done) {

                    $.mockjax({
                        url: ruleCollection.policyManagementConstants.POLICY_URL + ruleCollection.policyID,
                        type: 'GET',
                        status: 200,
                        responseText: {test:true},
                        response : function (settings, done2) {
                            done2();
                            stub.called.should.be.equal(true);
                            done();
                        }
                    });
                    ruleCollection.getPolicy(ruleCollection.callBack);


                });

                it("getPolicy error handler", function(done) {
                    $.mockjax({
                        url: ruleCollection.policyManagementConstants.POLICY_URL + ruleCollection.policyID,
                        type: 'GET',
                        status: 500,
                        responseText: {test:true},
                        response : function (settings, done2) {
                            done2();
                            stub.called.should.be.equal(true);
                            done();
                        }
                    });
                    ruleCollection.getPolicy(ruleCollection.callBack);

                });

            });

            describe("highlightRule Handler", function() {
                var trigger;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                });

                afterEach(function () {
                    ruleCollection.trigger.restore();
                    $.mockjax.clear();
                });
                it("highlightRule success handler", function(done) {
                    var data =  {ruleIds:[123]}, eventName = "afterCreateRule";
                    $.mockjax({
                        url: ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT + "/" + 123 +ruleCollection.policyManagementConstants.RULE_PAGE_NUMBER + "?paging=(limit eq " + ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE + ")&cuid=" + ruleCollection.cuid,
                        type: 'GET',
                        headers: {
                            Accept: ruleCollection.policyManagementConstants.RULE_ACCEPT_HEADER
                        },
                        status: 200,
                        response : function (settings, done2) {
                            done2();
                            trigger.called.should.be.equal(true);
                            trigger.args[0][0].should.be.equal("afterCreateRule");
                           trigger.args[0][1]['ruleIds'][0].should.be.equal(123);
                            done();
                        }
                    });
                    ruleCollection.highlightRule(eventName,data);
                });
                it("highlightRule error handler", function(done) {
                    var data =  {ruleIds:[123]}, eventName = "afterCreateRule";
                    $.mockjax({
                        url: ruleCollection.url() + ruleCollection.policyManagementConstants.RULE_DRAFT + "/123" +  ruleCollection.policyManagementConstants.RULE_PAGE_NUMBER + "?paging=(limit eq " + ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE + ")&cuid=" + ruleCollection.cuid,
                        type: 'GET',
                        headers: {
                            Accept: ruleCollection.policyManagementConstants.RULE_ACCEPT_HEADER
                        },
                        status: 500,
                        response : function (settings, done2) {
                            done2();
                            trigger.called.should.be.equal(false);
                            done();
                        }
                    });
                    ruleCollection.highlightRule(eventName,data);
                });

            });

            describe("fetchSaveCommentSettings Handler", function() {

                beforeEach(function () {
                    stub = sinon.stub(ruleCollection, 'setSaveCommentsEnabled');
                });

                afterEach(function () {
                    ruleCollection.setSaveCommentsEnabled.restore();
                    $.mockjax.clear();
                });
                it("fetchSaveCommentSettings success handler", function(done) {
                    $.mockjax({
                        url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                        type: 'GET',
                        responseText: {test:true},
                        status:200,
                        response : function (settings, done2) {
                            done2();
                            stub.called.should.be.equal(true);
                            console.log(stub.args[0]);
                            stub.args[0][0].test.should.be.equal(true);
                            done();
                        }
                    });
                    ruleCollection.fetchSaveCommentSettings();
                });
                it("fetchSaveCommentSettings error handler", function(done) {
                    $.mockjax({
                        url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                        type: 'GET',
                        status: 404,
                        response : function (settings, done2) {
                            done2();
                            stub.called.should.be.equal(false);
                            done();
                        }
                    });
                    ruleCollection.fetchSaveCommentSettings();
                });

            });
            describe("showEvents", function() {
                var startActivity;
                beforeEach(function () {
                    startActivity = sinon.stub(ruleCollection.context, 'startActivity');
                });

                afterEach(function () {
                    ruleCollection.context.startActivity.restore();
                });
                it("showEvents ", function() {
                    ruleCollection.showEvents(2097159);
                    startActivity.called.should.be.equal(true);
                });

            });
            describe("constructZoneFilter", function() {
                var buildZoneFilter;

                beforeEach(function () {
                    $.mockjax({
                        url: '/api/juniper/sd/zoneset-management/zone-sets?filter=(id+eq+123)',
                        type: 'GET',
                        status: 200,
                        responseText: {name:"name",'zone-sets':{'zone-set':[{zones:'sdfsdaf,wertwe,xzcvzxcv,hfgjh'},{zones:'123,4356,767,98'}]}}
                    });
                    buildZoneFilter = sinon.stub(ruleCollection, 'buildZoneFilter');
                });

                afterEach(function () {
                    ruleCollection.buildZoneFilter.restore();
                    $.mockjax.clear();
                });

                it("constructZoneFilter ", function() {
                    ruleCollection.constructZoneFilter({name:"name", id : 123}, "source", {and:[]});
                    buildZoneFilter.called.should.be.equal(true);
                });
                it("constructZoneFilter: with 'zone-type' -> ZONESET ", function() {
                    ruleCollection.constructZoneFilter([{name:"name", id : 123,'zone-type':'ZONESET'}], "destination", {and:[]});
                   // buildZoneFilter.called.should.be.equal(true);
                });
                it("constructZoneFilter: zone  undefined-> ZONESET ", function() {
                    ruleCollection.constructZoneFilter([{name:"name",id : 123, 'zone-type':'ZONESET'}, undefined], "", {and:[]});
//                    buildZoneFilter.called.should.be.equal(true);
                });
            });
            describe("fetch", function() {
                var trigger, response;
                beforeEach(function () {
                    trigger = sinon.stub(ruleCollection, 'trigger');
                    stub = sinon.stub(Backbone.Collection.prototype.fetch, 'call', function (mode, options) {
                        options.success(ruleCollection, response);
                    });
                });

                afterEach(function () {
                    Backbone.Collection.prototype.fetch.call.restore();
                    ruleCollection.trigger.restore();
                });
                it("fetch numberOfPages undefined", function() {
                    response  ={ruleCollection:{rules:[{id:2097159},{id:2097158}]}};
                    ruleCollection.fetch({success: {apply: function(){}}});
                    ruleCollection.resetCollection.should.be.equal(false);
                    trigger.called.should.be.equal(true);
                    var params = trigger.args[0];
                    params[0].should.be.equal('fetchStart');
                });

                it("fetch numberOfPages = 2", function() {
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 5;
                    response  ={ruleCollection:{rules:[{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158}]}};
                    ruleCollection.fetch({page: 2, success: {apply: function(){}}});
                    ruleCollection.resetCollection.should.be.equal(false);
                    trigger.called.should.be.equal(true);
                    var params = trigger.args[1];
                    params[0].should.be.equal('fetchComplete');
                    params[1].length.should.be.equal(3);

                });

                it("fetch numberOfPages = 1", function() {
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 5;
                    response  ={ruleCollection:{rules:[{id:2097159},{id:2097158}]}};
                    ruleCollection.fetch({page: 1, success: {apply: function(){}}});
                    ruleCollection.resetCollection.should.be.equal(false);
                    trigger.called.should.be.equal(true);
                    var params = trigger.args[1];
                    params[0].should.be.equal('fetchComplete');
                    params[1].length.should.be.equal(1);
                });

                it("fetch numberOfPages = 3", function() {
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 5;
                    response  ={ruleCollection:{rules:[{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158}]}};
                    ruleCollection.fetch({page: 2, success: {apply: function(){}}});
                    ruleCollection.resetCollection.should.be.equal(false);
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 50;
                    trigger.called.should.be.equal(true);
                    var params = trigger.args[1];
                    params[0].should.be.equal('fetchComplete');
                    params[1].length.should.be.equal(2);
                });

                it("fetch numberOfPages = 2, page = 1", function() {
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 5;
                    response  ={ruleCollection:{rules:[{id:2097159},{id:2097158},{id:2097159},{id:2097158},{id:2097159},{id:2097158}]}};
                    ruleCollection.fetch({page: 1, success: {apply: function(){}}});
                    ruleCollection.resetCollection.should.be.equal(false);
                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 50;
                    trigger.called.should.be.equal(true);
                    var params = trigger.args[1];
                    params[0].should.be.equal('fetchComplete');
                    params[1].length.should.be.equal(2);
                });

//                it("fetch numberOfPages >1", function() {
//                    ruleCollection.fetch({numberOfPages:2, success: {apply: function(){}}});
//                    ruleCollection.resetCollection.should.be.equal(false);
//                });
//                it("fetch DEFAULT_PAGE_SIZE: set to 1", function() {
//                    ruleCollection.policyManagementConstants.DEFAULT_PAGE_SIZE = 1;
//                    ruleCollection.fetch({numberOfPages:2, success: {apply: function(){}}});
//                    ruleCollection.resetCollection.should.be.equal(false);
//                });
//                it("fetch numberOfPages >1", function() {
//                    ruleCollection.fetch({numberOfPages:2});
//                    ruleCollection.resetCollection.should.be.equal(false);
//                });
            });
            describe("processPasteResponse", function() {
                var data1 = {"paste-response":{"success":false,"pastedRuleIds":[-1],"ruleResponseList":[{"messages":[{"key":"NAME_CHANGED_DURING_PASTE","parameters":["r1-1","r1-3"]}]}]}};
                var data2 = {"paste-response":{"success":false,"pastedRuleIds":[-1],"ruleResponseList":[{"messages":[{"key":"ZONES_CHANGED_DURING_PASTE","parameters":["r1-1","r1-3"]}]}]}};
                var data3 = {"paste-response":{"success":false,"pastedRuleIds":[-1],"ruleResponseList":[{"messages":[{"key":"ERROR_MESSAGE","parameters":["r1-1","r1-3"]}]}]}};

                it("processPasteResponse with data1", function() {
                    ruleCollection.processPasteResponse(data1);
                });

                it("processPasteResponse with data2", function() {
                    ruleCollection.processPasteResponse(data2);
                });

                it("processPasteResponse with data3", function() {
                    ruleCollection.processPasteResponse(data3);
                });

            });
        });

    });
});
