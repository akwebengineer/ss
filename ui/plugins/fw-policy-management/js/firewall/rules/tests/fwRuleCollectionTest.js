/**
 * Test for rFw Rule Collection
 *
 * @author tgarg@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleCollection.js'
], function (FwRuleCollection, BaseCollection) {


    describe("FW policy rule unit-tests", function () {

        var fwRuleCollectionObj, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });
            fwRuleCollectionObj = new FwRuleCollection("cuid", "1234", context);
            //   console.log("fw policy rule collection unit tests: before");
        });

        after(function() {
            $.mockjax.clear();
        });

        describe("FW add rule test", function () {
            var stub;

            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync');
            });

            afterEach(function () {
                stub.restore();
            });

            it('check add new rule -> check sync called with create', function () {

                fwRuleCollectionObj.addRule(123, 'Up');
                stub.called.should.be.equal(true);
                var params = stub.args[0];
                params[0].should.be.equal("create");
            });

            it('check add new rule "Up" -> check rule reference', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                var ruleInfo, params = stub.args[0];
                params[1].should.be.instanceof(fwRuleCollectionObj.model);
                ruleInfo = params[1].get('ruleAddInfo');
                ruleInfo.direction.should.be.equal(fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
            });


            it('check add new rule "Top" -> check rule reference', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_TOP);
                var ruleInfo, params = stub.args[0];
                ruleInfo = params[1].get('ruleAddInfo');
                ruleInfo.direction.should.be.equal(fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_TOP);
            });


            it('check add new rule "Bottom" -> check rule reference', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);
                var ruleInfo, params = stub.args[0];
                ruleInfo = params[1].get('ruleAddInfo');
                ruleInfo.direction.should.be.equal(fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);
            });


            it('check add new rule "Down" -> check rule reference', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                var ruleInfo, params = stub.args[0];
                params[1].should.be.instanceof(fwRuleCollectionObj.model);
                ruleInfo = params[1].get('ruleAddInfo');
                ruleInfo.direction.should.be.equal(fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
            });

            it('check add new rule -> check rule reference (direction and reference defined)', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                var ruleInfo, params = stub.args[0];
                ruleInfo = params[1].get('ruleAddInfo');
                ruleInfo.direction.should.not.be.equal(null);
                ruleInfo.direction.should.not.be.equal(undefined);
                (parseInt(ruleInfo.referenceRuleID, 10) > 0).should.be.equal(true);
            });

        });
        describe("FW add rule success handler", function () {
            var stub, ruleId = 123, highlightStub;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, model, options) {
                    options.success({
                        'firewall-rule': {
                            id: ruleId
                        }
                    });
                });
            });

            afterEach(function () {
                stub.restore();
            });

            it('check add new rule -> check success handler, collection is set dirty', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                fwRuleCollectionObj.isCollectionDirty().should.be.equal(true);
            });

            before(function () {
                highlightStub = sinon.stub(fwRuleCollectionObj, 'highlightRule');
            });
            after(function () {
                highlightStub.restore();
            });
            it('check add new rule -> check success handler (rule is highlighted properly)', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                highlightStub.called.should.be.equal(true);
            });

            it('check add new rule -> check success handler highlight rule arguments (afterCreateRule, id, isRowEditable)', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                var params = highlightStub.args[0];

                params[0].should.be.equal('afterCreateRule');
                params[1].ruleIds.should.be.instanceof(Array);
                (params[1].ruleIds.length > 0).should.be.equal(true);
                params[1].ruleIds[0].should.be.equal(ruleId);
                params[1].isRowEditable.should.be.equal(true);
            });
        });


        describe("FW add rule error handler", function () {
            var stub, errorSpy;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, moldel, options) {
                    errorSpy = sinon.spy(options, 'error');
                    options.error();
                });
            });

            afterEach(function () {
                stub.restore();
                errorSpy.restore();
            });

            it('check add new rule -> check error handler called', function () {
                fwRuleCollectionObj.addRule(123, fwRuleCollectionObj.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                errorSpy.calledOnce.should.be.equal(true);
            });
        });


        describe("FW reload hit count test", function () {

            var stub;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync');
            });

            afterEach(function () {
                stub.restore();
            });

            it('reload hit count called', function () {

                fwRuleCollectionObj.reloadHitCount();
                stub.called.should.be.equal(true);
                var params = stub.args[0];
                params[0].should.be.equal("create");
                params[1].should.be.instanceof(fwRuleCollectionObj.model);
            });

            it('reload hit count -> check url is valid', function () {

                fwRuleCollectionObj.reloadHitCount();
                var params = stub.args[0];
                params[2].url.should.be.equal(fwRuleCollectionObj.url() + fwRuleCollectionObj.policyManagementConstants.RELOAD_HIT_COUNT);
            });
            // no test defined here
        });

        describe("FW reload hit count -> check success handler", function () {

            var stub, triggerSpy;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, model, options) {
                    options.success();
                });

                triggerSpy = sinon.spy(fwRuleCollectionObj, 'trigger');
            });

            afterEach(function () {
                stub.restore();
                triggerSpy.restore();
            });


            it('trigger is called with refresh page', function () {

                fwRuleCollectionObj.reloadHitCount();
                triggerSpy.called.should.be.equal(true);
                var params = triggerSpy.args[0];
                params[0].should.be.equal('refresh-page');
            });

        });

        describe("FW reload hit count -> check error handler ", function () {

            var stub, errorSpy;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, model, options) {
                    errorSpy = sinon.spy(options, 'error');
                    options.error();
                });
            });

            afterEach(function () {
                stub.restore();
                errorSpy.restore();
            });

            it('Error handler called', function () {

                fwRuleCollectionObj.reloadHitCount();
                errorSpy.called.should.be.equal(true);
            });
        });


        describe("FW save new rule test", function () {
            var stub;

            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync');
            });

            afterEach(function () {
                stub.restore();
            });

            it('check save new rule -> check sync called with create', function () {

                fwRuleCollectionObj.saveNewRule(null);
                stub.called.should.be.equal(true);
                var params = stub.args[0];
                params[0].should.be.equal("create");
            });


            it('check add new rule -> check model data defined properly', function () {
                fwRuleCollectionObj.saveNewRule({id: 123});
                var ruleInfo, params = stub.args[0];
                ruleInfo = params[1].get('firewall-rule');
                ruleInfo.should.not.be.equal(null);
                ruleInfo.should.not.be.equal(undefined);
                (ruleInfo.id > 0).should.be.equal(true);
            });

        });
        describe("FW save new rule success handler", function () {
            var stub, highlightStub, ruleId = 123;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, model, options) {
                    options.success({
                        'firewall-rule': {
                            id: ruleId
                        }
                    });
                });
            });

            afterEach(function () {
                stub.restore();
            });

            it('check save new rule -> check success handler, collection is set dirty', function () {
                fwRuleCollectionObj.saveNewRule(null);
                fwRuleCollectionObj.isCollectionDirty().should.be.equal(true);
            });

            before(function () {
                highlightStub = sinon.stub(fwRuleCollectionObj, 'highlightRule');
            });
            after(function () {
                highlightStub.restore();
            });
            it('check save new rule -> check success handler (rule is highlighted properly)', function () {
                fwRuleCollectionObj.saveNewRule(null);
                highlightStub.called.should.be.equal(true);
            });

            it('check save new rule -> check success handler highlight rule arguments (afterCreateRule, id, isRowEditable), response rule id equals to data id', function () {
                fwRuleCollectionObj.saveNewRule(null);
                var params = highlightStub.args[0];

                params[0].should.be.equal('afterCreateRule');
                params[1].ruleIds.should.be.instanceof(Array);
                (params[1].ruleIds.length === 1).should.be.equal(true);
                params[1].ruleIds[0].should.be.equal(ruleId);
                params[1].isRowEditable.should.be.equal(false);
            });
        });


        describe("FW save new rule error handler", function () {
            var stub, errorSpy;
            beforeEach(function () {
                stub = sinon.stub(fwRuleCollectionObj, 'sync', function (mode, moldel, options) {
                    errorSpy = sinon.spy(options, 'error');
                    options.error();
                });
            });

            afterEach(function () {
                stub.restore();
                errorSpy.restore();
            });

            it('check save new rule -> check error handler called', function () {
                fwRuleCollectionObj.saveNewRule(null);
                errorSpy.calledOnce.should.be.equal(true);
            });
        });

        describe("FW show events test", function () {
            var stub, getStub, srcZone = 'srcZone', destZone = 'destZone', ruleName = 'abc';

            beforeEach(function () {
                getStub = sinon.stub(fwRuleCollectionObj, 'get', function () {


                    return new fwRuleCollectionObj.model({
                        'source-zone': {
                            zone: srcZone
                        },
                        'destination-zone': {
                            zone: 'destZone'
                        },
                        name: ruleName
                    });

                });
                stub = sinon.stub(BaseCollection.prototype, 'showEvents');
            });


            afterEach(function () {
                stub.restore();
                getStub.restore();
            });


            it('check show event called -> rule defined properly, not -1', function () {

                fwRuleCollectionObj.showEvents(123);
                getStub.called.should.be.equal(true);
                var ruleId = getStub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                (parseInt(ruleId, 10) > 0).should.be.equal(true);
            });

            it('check super show event called with proper params', function () {
                fwRuleCollectionObj.showEvents(null);
                stub.called.should.be.equal(true);
                var params = stub.args[0][0];
                params.srcZone.should.be.equal(srcZone);
                params.destZone.should.be.equal(destZone);
            });


        });

        describe("FW show events test, global rule", function () {
            var stub, getStub, srcZone = 'srcZone', destZone = 'destZone', ruleName = 'abc';

            beforeEach(function () {
                getStub = sinon.stub(fwRuleCollectionObj, 'get', function () {


                    return new fwRuleCollectionObj.model({
                        'source-zone': {
                            zone: srcZone
                        },
                        'destination-zone': {
                            zone: 'destZone'
                        },
                        name: ruleName,
                        'global-rule': true
                    });

                });
                stub = sinon.stub(BaseCollection.prototype, 'showEvents');
            });


            afterEach(function () {
                stub.restore();
                getStub.restore();
            });


            it('check super show event called with proper params', function () {
                fwRuleCollectionObj.showEvents(null);
                stub.called.should.be.equal(true);
                var params = stub.args[0][0];
                params.srcZone.should.be.equal(srcZone);
                params.destZone.should.be.equal(destZone);
            });
        });



        describe('FW get new rule tests', function () {

            it('getNewRule -> check error handler', function (done) {
                if (console.log.restore) {
                    console.log.restore();
                }
                var consoleSpy = sinon.spy(console, 'log');
                $.mockjax.clear();
                $.mockjax({

                    url: fwRuleCollectionObj.url() + fwRuleCollectionObj.policyManagementConstants.NEW + "?cuid=" + fwRuleCollectionObj.cuid,
                    type: 'GET',
                    headers: {
                        Accept: fwRuleCollectionObj.policyManagementConstants.RULE_ACCEPT_HEADER
                    },
                    responseText: "error",
                    status: 404,
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        consoleSpy.restore();
                    }
                });
                fwRuleCollectionObj.getNewRule();
//                this need to be defined properly once error handler are defined
            });

            it('getNewRule -> check success handler called on ajax response, check trigger is called with params newRuleFetched and rule model', function (done) {
                var triggerStub, ruleId = 123;
                triggerStub = sinon.stub(fwRuleCollectionObj, 'trigger');
                $.mockjax.clear();
                $.mockjax({

                    url: fwRuleCollectionObj.url() + fwRuleCollectionObj.policyManagementConstants.NEW + "?cuid=" + fwRuleCollectionObj.cuid,
                    type: 'GET',
                    headers: {
                        Accept: fwRuleCollectionObj.policyManagementConstants.RULE_ACCEPT_HEADER
                    },
                    responseText: {'firewall-rule': { id: ruleId}},
                    status: 200,
                    response: function (settings, done2) {
                        done2();
                        triggerStub.calledOnce.should.be.equal(true);
                        var params = triggerStub.args[0];
                        params[0].should.be.equal('newRuleFetched');
                        params[1].get('id').should.be.equal(ruleId);
                        done();
                        $.mockjax.clear();
                        triggerStub.restore();
                    }
                });
                fwRuleCollectionObj.getNewRule();
            });


        });


    });


});
