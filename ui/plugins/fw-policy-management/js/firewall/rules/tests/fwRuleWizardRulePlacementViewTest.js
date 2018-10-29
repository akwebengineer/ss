
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardRulePlacementView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../constants/fwRuleGridConstants.js'
],function(FwRuleWizardRulePlacementView, Model, PolicyManagementConstants) {
    var modelBind, ruleModel = new Model(), fwRuleWizardRulePlacementView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            context: context,
            policyObj: {id:123},
            model: ruleModel,
            cuid: "cuid"
        };
        modelBind = sinon.stub(ruleModel, 'bind');
        fwRuleWizardRulePlacementView = new FwRuleWizardRulePlacementView(viewParams);
        fwRuleWizardRulePlacementView.screenId = "test";
    });

    after(function () {
        modelBind.restore();
    });

    describe("RW Rule create Rule Placement view tests", function () {

        describe("FW rule Create Rule Placement view initialize check", function () {

            it(" initialize check", function () {
                fwRuleWizardRulePlacementView.should.exist;
            });

        });
        describe("FW rule Create Rule Placement view render check", function () {

            var ruleAnalysis, displayAnalysisResult;
            beforeEach(function () {
                ruleAnalysis = sinon.stub(fwRuleWizardRulePlacementView, 'ruleAnalysis');
                displayAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'displayAnalysisResult');
            });

            afterEach(function () {
                ruleAnalysis.restore();
                displayAnalysisResult.restore();
            });
            it(" render check", function () {
                fwRuleWizardRulePlacementView.render();
                ruleAnalysis.called.should.be.equal(true);
                displayAnalysisResult.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view render check", function () {

            var runRuleAnalysis, no_analysis,get;
            beforeEach(function () {
                runRuleAnalysis = sinon.stub(fwRuleWizardRulePlacementView, 'runRuleAnalysis');
                no_analysis = sinon.stub(fwRuleWizardRulePlacementView, 'no_analysis');
                get = sinon.stub(fwRuleWizardRulePlacementView.model, 'get', function(){return true;});
            });

            afterEach(function () {
                runRuleAnalysis.restore();
                no_analysis.restore();
                get.restore();
            });
            it(" render check", function () {
                fwRuleWizardRulePlacementView.ruleAnalysis();
                get.called.should.be.equal(true);
                runRuleAnalysis.called.should.be.equal(true);
                no_analysis.called.should.be.equal(false);
            });
        });
        describe("FW rule Create Rule Placement view ruleAnalysis check", function () {

            var runRuleAnalysis, no_analysis,get;
            beforeEach(function () {
                runRuleAnalysis = sinon.stub(fwRuleWizardRulePlacementView, 'runRuleAnalysis');
                no_analysis = sinon.stub(fwRuleWizardRulePlacementView, 'no_analysis');
                get = sinon.stub(fwRuleWizardRulePlacementView.model, 'get', function(){return false;});
            });

            afterEach(function () {
                runRuleAnalysis.restore();
                no_analysis.restore();
                get.restore();
            });
            it(" ruleAnalysis check", function () {
                fwRuleWizardRulePlacementView.ruleAnalysis();
                get.called.should.be.equal(true);
                runRuleAnalysis.called.should.be.equal(false);
                no_analysis.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view subscribeNotifications check", function () {

            var startSubscription, unSubscribeNotification, checkProgressNotificationStatus;
            beforeEach(function () {
                fwRuleWizardRulePlacementView.sseEventSubscriptions = true;
                startSubscription = sinon.stub(fwRuleWizardRulePlacementView.smSSEEventSubscriber, 'startSubscription');
                unSubscribeNotification = sinon.stub(fwRuleWizardRulePlacementView, 'unSubscribeNotification');
                checkProgressNotificationStatus = sinon.stub(fwRuleWizardRulePlacementView, 'checkProgressNotificationStatus');
            });

            afterEach(function () {
                startSubscription.restore();
                unSubscribeNotification.restore();
                checkProgressNotificationStatus.restore();
            });
            it(" subscribeNotifications check", function () {
                window['Slipstream']['SDK']['Utils']= {url_safe_uuid:function(){return "test"}};
                fwRuleWizardRulePlacementView.subscribeNotifications();
            });
        });
        describe("FW rule Create Rule Placement view unSubscribeNotification check", function () {

            var stopSubscription;
            beforeEach(function () {
                stopSubscription = sinon.stub(fwRuleWizardRulePlacementView.smSSEEventSubscriber, 'stopSubscription');
            });

            afterEach(function () {
                stopSubscription.restore();
            });
            it(" unSubscribeNotification check", function () {
                fwRuleWizardRulePlacementView.sseEventSubscriptions = 'test';
                fwRuleWizardRulePlacementView.unSubscribeNotification();
                stopSubscription.called.should.be.equal(true);
                stopSubscription.args[0][0].should.not.be.equal(null);
            });
        });
        describe("FW rule Create Rule Placement view saveAnalysisResult check", function () {

            var set, resetAnalysisResult;
            beforeEach(function () {
                set = sinon.stub(fwRuleWizardRulePlacementView.model, 'set');
                resetAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'resetAnalysisResult');
            });

            afterEach(function () {
                set.restore();
                resetAnalysisResult.restore();
            });
            it(" saveAnalysisResult check", function () {
                var data = {
                    fwRuleAnalysisResult : {
                        ruleOrder: "ruleOrder",
                        seqNumber: "seqNumber",
                        ruleGroupUUID: "ruleGroupUUID",
                        ruleGroupName: "ruleGroupName",
                        ruleType: "ruleType",
                        direction: "direction",
                        referenceRuleName: "referenceRuleName",
                        referenceRuleSeqNumber: "referenceRuleSeqNumber",
                        minValue: "minValue",
                        maxValue: "maxValue",
                        placementRules: "placementRules",
                        resultFileName: "resultFileName",
                        isRedundant: "isRedundant"
                    }
                };
                fwRuleWizardRulePlacementView.saveAnalysisResult(data);
                set.called.should.be.equal(true);
                resetAnalysisResult.called.should.be.equal(true);
                assert(set.calledWith("rule-order", data.fwRuleAnalysisResult.ruleOrder));
                assert(set.calledWith("seqNum", data.fwRuleAnalysisResult.seqNumber));
                assert(set.calledWith("rule-group-id", data.fwRuleAnalysisResult.ruleGroupUUID));
                assert(set.calledWith("rule-group-name", data.fwRuleAnalysisResult.ruleGroupName));
                assert(set.calledWith("ruleType", data.fwRuleAnalysisResult.ruleType));
                assert(set.calledWith("direction", data.fwRuleAnalysisResult.direction));
                assert(set.calledWith("referenceRuleName", data.fwRuleAnalysisResult.referenceRuleName));
                assert(set.calledWith("referenceRuleSeqNum", data.fwRuleAnalysisResult.referenceRuleSeqNumber));
                assert(set.calledWith('minValue', data.fwRuleAnalysisResult.minValue));
                assert(set.calledWith('maxValue', data.fwRuleAnalysisResult.maxValue));
                assert(set.calledWith("placementRules", data.fwRuleAnalysisResult.placementRules));
                assert(set.calledWith("resultFileName", data.fwRuleAnalysisResult.resultFileName));
                assert(set.calledWith("isRedundant", data.fwRuleAnalysisResult.isRedundant));
            });
        });
        describe("FW rule Create Rule Placement view resetAnalysisResult check", function () {

            var set;
            beforeEach(function () {
                set = sinon.stub(fwRuleWizardRulePlacementView.model, 'set');

            });

            afterEach(function () {
                set.restore();
            });
            it(" resetAnalysisResult check", function () {
                fwRuleWizardRulePlacementView.resetAnalysisResult();
                set.called.should.be.equal(true);
                assert(set.calledWith("rule-order", ""));
                assert(set.calledWith("seqNum", ""));
                assert(set.calledWith("rule-group-id", ""));
                assert(set.calledWith("rule-group-name", ""));
                assert(set.calledWith("ruleType", ""));
                assert(set.calledWith("direction", ""));
                assert(set.calledWith("referenceRuleName", ""));
                assert(set.calledWith("referenceRuleSeqNum", ""));
                assert(set.calledWith('minValue', ""));
                assert(set.calledWith('maxValue', ""));
                assert(set.calledWith("placementRules", ""));
                assert(set.calledWith("resultFileName", ""));
                assert(set.calledWith("isRedundant", ""));
            });
        });
        describe("FW rule Create Rule Placement view showProgressBar check", function () {

            var buildProgressBarOverlay;
            beforeEach(function () {
                buildProgressBarOverlay = sinon.stub(fwRuleWizardRulePlacementView, 'buildProgressBarOverlay');
            });

            afterEach(function () {
                buildProgressBarOverlay.restore();
            });
            it(" showProgressBar check for analysis", function () {
                fwRuleWizardRulePlacementView.showProgressBar("analysis");
                buildProgressBarOverlay.called.should.be.equal(true);
                fwRuleWizardRulePlacementView.progressBarOverlay.should.not.be.equal(null);

            });
            it(" showProgressBar check for no-analysis", function () {
                fwRuleWizardRulePlacementView.showProgressBar("no-analysis");
                buildProgressBarOverlay.called.should.be.equal(true);
                fwRuleWizardRulePlacementView.progressBarOverlay.should.not.be.equal(null);
            });
            it(" showProgressBar check for view-report", function () {
                fwRuleWizardRulePlacementView.showProgressBar("view-report");
                buildProgressBarOverlay.called.should.be.equal(true);
                fwRuleWizardRulePlacementView.progressBarOverlay.should.not.be.equal(null);
            });
        });
        describe("FW rule Create Rule Placement view buildProgressBarOverlay check", function () {

            var build;
            beforeEach(function () {
                build = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'build');
            });

            afterEach(function () {
                build.restore();
            });
            it(" showProgressBar check for analysis", function () {
                fwRuleWizardRulePlacementView.buildProgressBarOverlay();
                build.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view displayErrorAnalysisResult check", function () {
            var getMessage;
            beforeEach(function () {
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
            });

            afterEach(function () {
                getMessage.restore();
            });

            it(" showProgressBar check", function () {
                fwRuleWizardRulePlacementView.model.attributes['run-analysis'] = true;
                fwRuleWizardRulePlacementView.displayErrorAnalysisResult();
                getMessage.called.should.be.equal(true);
                assert(getMessage.calledWith("rule_analysis_error"));
            });
            it(" showProgressBar check", function () {
                fwRuleWizardRulePlacementView.model.attributes['run-analysis'] = false;
                fwRuleWizardRulePlacementView.displayErrorAnalysisResult();
                getMessage.called.should.be.equal(true);
                assert(getMessage.calledWith("rule_placement_suggest_error"));
            });
        });

        describe("FW rule Create Rule Placement view getRedundantRuleString check", function () {
            var getMessage;
            beforeEach(function () {
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
            });

            afterEach(function () {
                getMessage.restore();
            });

            it(" getRedundantRuleString check", function () {
                fwRuleWizardRulePlacementView.model.attributes['referenceRuleSeqNum'] = "referenceRuleSeqNum";
                fwRuleWizardRulePlacementView.model.attributes['referenceRuleName'] = "referenceRuleName";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = true;
                fwRuleWizardRulePlacementView.getRedundantRuleString();
                getMessage.called.should.be.equal(true);
                getMessage.args[0][0].should.be.equal("rule_analysis_redundant");
                getMessage.args[0][1][0].should.be.equal("referenceRuleName");
                getMessage.args[0][1][1].should.be.equal("referenceRuleSeqNum");
            });
            it(" getRedundantRuleString check", function () {
                fwRuleWizardRulePlacementView.model.attributes['referenceRuleSeqNum'] = "referenceRuleSeqNum";
                fwRuleWizardRulePlacementView.model.attributes['referenceRuleName'] = "referenceRuleName";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = false;
                fwRuleWizardRulePlacementView.getRedundantRuleString();
                getMessage.called.should.be.equal(false);
            });
        });

        describe("FW rule Create Rule Placement view getTitle check", function () {

            var getMessage;
            beforeEach(function () {
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
            });

            afterEach(function () {
                getMessage.restore();
            });
            it(" getTitle check", function () {
                fwRuleWizardRulePlacementView.getTitle();
                assert(getMessage.calledWith("auto_rule_placement"));
            });
        });

        /*describe("FW rule Create Rule Placement view showRulePlacementOverlay check", function () {

         var getMessage, buildViewPlacementOverlay;
         beforeEach(function () {
         getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
         buildViewPlacementOverlay = sinon.stub(fwRuleWizardRulePlacementView, 'buildViewPlacementOverlay');
         });

         afterEach(function () {
         getMessage.restore();
         buildViewPlacementOverlay.restore();
         });
         it(" showRulePlacementOverlay check", function () {
         debugger;
         fwRuleWizardRulePlacementView.showRulePlacementOverlay();
         });
         });*/
        describe("FW rule Create Rule Placement view buildViewPlacementOverlay check", function () {

            var  build;
            beforeEach(function () {
                fwRuleWizardRulePlacementView.viewPlacementOverlay = {build: function(){
                }};
                build = sinon.stub(fwRuleWizardRulePlacementView.viewPlacementOverlay, 'build');
            });

            afterEach(function () {
                build.restore();
            });
            it(" buildViewPlacementOverlay check", function () {
                fwRuleWizardRulePlacementView.buildViewPlacementOverlay();
                build.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view getSummary check", function () {

            var getRuleSequenceString;
            beforeEach(function () {
                getRuleSequenceString = sinon.stub(fwRuleWizardRulePlacementView, 'getRuleSequenceString');
            });

            afterEach(function () {
                getRuleSequenceString.restore();
            });
            it(" getSummary check", function () {
                fwRuleWizardRulePlacementView.getSummary();
                getRuleSequenceString.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view getSummary check", function () {

            var getRuleSequenceString;
            beforeEach(function () {
                fwRuleWizardRulePlacementView.model.attributes["run-analysis"] = true;
                fwRuleWizardRulePlacementView.model.attributes["isRedundant"] = true;
                getRuleSequenceString = sinon.stub(fwRuleWizardRulePlacementView, 'getRuleSequenceString');
            });

            afterEach(function () {
                getRuleSequenceString.restore();
            });
            it(" getSummary check", function () {
                fwRuleWizardRulePlacementView.getSummary();
                getRuleSequenceString.called.should.be.equal(true);
            });
        });
        describe("FW rule Create Rule Placement view getRuleSequenceString check", function () {


            var getMessage;
            beforeEach(function () {
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
            });

            afterEach(function () {
                getMessage.restore();
            });

            it(" getRuleSequenceString check with refRuleSeqNum", function () {
                fwRuleWizardRulePlacementView.model.attributes["direction"] = true;
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleName"] = true;
                fwRuleWizardRulePlacementView.getRuleSequenceString(true, 1);
                getMessage.called.should.be.equal(true);
                assert(getMessage.calledWith(true));
                assert(getMessage.calledWith("rule_no"));
                assert(getMessage.calledWith("rule_sequence"));
            });
            it(" getRuleSequenceString check without refRuleSeqNum", function () {
                fwRuleWizardRulePlacementView.model.attributes["direction"] = true;
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleName"] = true;
                fwRuleWizardRulePlacementView.getRuleSequenceString(false, 1);
                assert(getMessage.calledWith(true));
                assert(getMessage.calledWith("ruleGroup"));
                assert(getMessage.calledWith("rule_sequence"));
            });
        });
        describe("FW rule Create Rule Placement view displayAnalysisResult check", function () {
            var getMessage, getRuleSequenceString, getRedundantRuleString;
            beforeEach(function () {
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
                getRuleSequenceString = sinon.stub(fwRuleWizardRulePlacementView, 'getRuleSequenceString');
                getRedundantRuleString = sinon.stub(fwRuleWizardRulePlacementView, 'getRedundantRuleString');
            });

            afterEach(function () {
                getMessage.restore();
                getRuleSequenceString.restore();
                getRedundantRuleString.restore();
            });

            it(" displayAnalysisResult check 1", function () {
                fwRuleWizardRulePlacementView.model.attributes["ruleType"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["rule-group-name"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleSeqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["seqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes['minValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['maxValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = "test";
                fwRuleWizardRulePlacementView.model.attributes["run-analysis"] = false;
                fwRuleWizardRulePlacementView.displayAnalysisResult();
                assert(getRuleSequenceString.calledWith("test", "test"));
                assert(getMessage.calledWith("rule_analysis_not_performed"));
                assert(getMessage.calledWith("no_rule_analysis_desc"));
                getRedundantRuleString.called.should.be.equal(false);
            });
            it(" displayAnalysisResult check 2", function () {
                fwRuleWizardRulePlacementView.model.attributes["ruleType"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["run-analysis"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["rule-group-name"] = "Global";
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleSeqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["seqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes['minValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['maxValue'] = "test1";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = false;
                fwRuleWizardRulePlacementView.displayAnalysisResult();
                assert(getRuleSequenceString.calledWith("test", "test"));
                assert(getMessage.calledWith("results_range_desc"));
                assert(getMessage.calledWith("results_shadowing"));
                getRedundantRuleString.called.should.be.equal(false);
            });
            it(" displayAnalysisResult check 3", function () {
                fwRuleWizardRulePlacementView.model.attributes["ruleType"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["run-analysis"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["rule-group-name"] = "Global";
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleSeqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["seqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes['minValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['maxValue'] = "test1";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = true;
                fwRuleWizardRulePlacementView.displayAnalysisResult();
                assert(getRuleSequenceString.calledWith("test", "test"));
                getMessage.called.should.be.equal(false);
                getRedundantRuleString.called.should.be.equal(true);
            });
            it(" displayAnalysisResult check 4", function () {
                fwRuleWizardRulePlacementView.model.attributes["ruleType"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["run-analysis"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["rule-group-name"] = "Global";
                fwRuleWizardRulePlacementView.model.attributes["referenceRuleSeqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes["seqNum"] = "test";
                fwRuleWizardRulePlacementView.model.attributes['minValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['maxValue'] = "test";
                fwRuleWizardRulePlacementView.model.attributes['isRedundant'] = false;
                fwRuleWizardRulePlacementView.displayAnalysisResult();
                assert(getRuleSequenceString.calledWith("test", "test"));
                assert(getMessage.calledWith("results_no_range_desc"));
                assert(getMessage.calledWith("results_shadowing"));
                getRedundantRuleString.called.should.be.equal(false);
            });
        });
        /* describe("FW rule Create Rule Placement view displayAnalysisResult check", function () {
         var get;
         beforeEach(function () {
         get = sinon.stub(fwRuleWizardRulePlacementView.model, 'get', function(val){return (val !== 'isRedundant');});
         });

         afterEach(function () {
         get.restore();
         });
         it(" displayAnalysisResult check", function () {
         fwRuleWizardRulePlacementView.displayAnalysisResult();
         });
         });
         describe("FW rule Create Rule Placement view displayAnalysisResult with isRedundant check", function () {
         var get;
         beforeEach(function () {
         get = sinon.stub(fwRuleWizardRulePlacementView.model, 'get', function(val){return true;});
         });

         afterEach(function () {
         get.restore();
         });
         it(" displayAnalysisResult check", function () {
         fwRuleWizardRulePlacementView.displayAnalysisResult();
         });
         });*/

        describe("FW rule Create Rule Placement view checkProgressNotificationStatus check", function () {
            var setProgressBar, resetAnalysisResult, displayErrorAnalysisResult, fetchRuleAnalysisData, destroy;
            beforeEach(function () {

                fwRuleWizardRulePlacementView.progressBarOverlay = {setProgressBar: function(){},updateTimer: function(){},destroy: function(){}};
                setProgressBar = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'setProgressBar');
                destroy = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'destroy');
                resetAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'resetAnalysisResult');
                displayErrorAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'displayErrorAnalysisResult');
                fetchRuleAnalysisData = sinon.stub(fwRuleWizardRulePlacementView, 'fetchRuleAnalysisData');
            });

            afterEach(function () {
                setProgressBar.restore();
                resetAnalysisResult.restore();
                displayErrorAnalysisResult.restore();
                fetchRuleAnalysisData.restore();
                destroy.restore();
            });
            it(" checkProgressNotificationStatus check success", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url": PolicyManagementConstants.TASK_PROGRESS_URL + '$' + "test",
                    "type": 'get',
                    "headers" :{
                        "accept": PolicyManagementConstants.TASK_PROGRESS_ACCEPT
                    },
                    responseText: {'task-progress-response':{'percentage-complete':100}},
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        setProgressBar.called.should.be.equal(true);
                        fetchRuleAnalysisData.called.should.be.equal(true);
                        done();
                    }
                });
                fwRuleWizardRulePlacementView.checkProgressNotificationStatus();
            });
            it(" checkProgressNotificationStatus check error", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url": PolicyManagementConstants.TASK_PROGRESS_URL + '$' + "test",
                    "type": 'get',
                    "headers" :{
                        "accept": PolicyManagementConstants.TASK_PROGRESS_ACCEPT
                    },
                    responseText: {'task-progress-response':{'percentage-complete':100}},
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        destroy.called.should.be.equal(true);
                        resetAnalysisResult.called.should.be.equal(true);
                        displayErrorAnalysisResult.called.should.be.equal(true);
                        done();
                    }
                });
                fwRuleWizardRulePlacementView.checkProgressNotificationStatus();
            });
        });

        describe("FW rule Create Rule Placement view no_analysis check", function () {
            var toJSON,showProgressBar, displayErrorAnalysisResult, destroy,saveAnalysisResult,trigger,resetAnalysisResult;
            beforeEach(function () {
                fwRuleWizardRulePlacementView.progressBarOverlay = {setProgressBar: function(){},updateTimer: function(){},destroy: function(){}};
                toJSON = sinon.stub(fwRuleWizardRulePlacementView.model, 'toJSON');
                showProgressBar = sinon.stub(fwRuleWizardRulePlacementView, 'showProgressBar');
                displayErrorAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'displayErrorAnalysisResult');
                destroy = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'destroy');
                saveAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'saveAnalysisResult');
                trigger = sinon.stub(fwRuleWizardRulePlacementView.model, 'trigger');
                resetAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'resetAnalysisResult');
            });

            afterEach(function () {
                toJSON.restore();
                showProgressBar.restore();
                displayErrorAnalysisResult.restore();
                destroy.restore();
                saveAnalysisResult.restore();
                trigger.restore();
                resetAnalysisResult.restore();
            });
            it(" no_analysis success check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url":"/api/juniper/sd/policy-management/firewall/policies/123/draft/rules/no-analysis?cuid=cuid",// PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyId + PolicyManagementConstants.RULE_DRAFT + "/no-analysis?cuid=" + fwRuleWizardRulePlacementView.cuid,
                    "type": 'POST',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER,
                        "content-type": PolicyManagementConstants.RULE_CONTENT_HEADER
                    },
                    data: JSON.stringify({"firewall-rule":fwRuleWizardRulePlacementView.model.toJSON()}),
                    responseText: "true",
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        destroy.called.should.be.equal(true);
                        saveAnalysisResult.called.should.be.equal(true);
                        assert(trigger.calledWith("ruleAnalysisFinished"));
                        done();
                    }
                });
                fwRuleWizardRulePlacementView.no_analysis();
            });
            it(" no_analysis error check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url":"/api/juniper/sd/policy-management/firewall/policies/123/draft/rules/no-analysis?cuid=cuid",// PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyId + PolicyManagementConstants.RULE_DRAFT + "/no-analysis?cuid=" + fwRuleWizardRulePlacementView.cuid,
                    "type": 'POST',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER,
                        "content-type": PolicyManagementConstants.RULE_CONTENT_HEADER
                    },
                    data: JSON.stringify({"firewall-rule":fwRuleWizardRulePlacementView.model.toJSON()}),
                    responseText: "true",
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        destroy.called.should.be.equal(true);
                        resetAnalysisResult.called.should.be.equal(true);
                        displayErrorAnalysisResult.called.should.be.equal(true);
                        done();
                    }
                });
                fwRuleWizardRulePlacementView.no_analysis();
            });
        });


        describe("FW rule Create Rule Placement view fetchRuleAnalysisData check", function () {
            var saveAnalysisResult, unSubscribeNotification,trigger,destroy,displayErrorAnalysisResult,getMessage;
            beforeEach(function () {
                window.Slipstream.SDK.Notification =function(){
                    return {
                        setText: function(){
                            return {
                                setType: function () {
                                    return {
                                        notify: function () {
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                fwRuleWizardRulePlacementView.progressBarOverlay = {setProgressBar: function(){},updateTimer: function(){},destroy: function(){}};
                saveAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'saveAnalysisResult');
                unSubscribeNotification = sinon.stub(fwRuleWizardRulePlacementView, 'unSubscribeNotification');
                trigger = sinon.stub(fwRuleWizardRulePlacementView.model, 'trigger');

                destroy = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'destroy');
                displayErrorAnalysisResult = sinon.stub(fwRuleWizardRulePlacementView, 'displayErrorAnalysisResult');
                getMessage = sinon.stub(fwRuleWizardRulePlacementView.context, 'getMessage');
            });

            afterEach(function () {
                saveAnalysisResult.restore();
                unSubscribeNotification.restore();
                trigger.restore();

                destroy.restore();
                displayErrorAnalysisResult.restore();
                getMessage.restore();
            });
            it(" fetchRuleAnalysisData check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url": PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyObj.id + PolicyManagementConstants.RULE_DRAFT + "/analysis-result?screenId=" + "test",
                    "type": 'GET',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER
                    },
                    responseText: "true",
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.fetchRuleAnalysisData();
            });
            it(" fetchRuleAnalysisData check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    "url": PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyObj.id + PolicyManagementConstants.RULE_DRAFT + "/analysis-result?screenId=" + "test",
                    "type": 'GET',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER
                    },
                    responseText: "true",
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.fetchRuleAnalysisData();
            });
        });

        describe("FW rule Create Rule Placement view runRuleAnalysis check", function () {
            var toJSON,showProgressBar, subscribeNotifications;
            beforeEach(function () {
                toJSON = sinon.stub(fwRuleWizardRulePlacementView.model, 'toJSON');
                showProgressBar = sinon.stub(fwRuleWizardRulePlacementView, 'showProgressBar');
                subscribeNotifications = sinon.stub(fwRuleWizardRulePlacementView, 'subscribeNotifications');
            });

            afterEach(function () {
                toJSON.restore();
                showProgressBar.restore();
                subscribeNotifications.restore();
            });
            it(" runRuleAnalysis check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyObj.id + PolicyManagementConstants.RULE_DRAFT + "/analyse?cuid=" + "cuid" + "&screenId=" +"test",
                    type: 'POST',
                    dataType: "json",
                    data: JSON.stringify({"firewall-rule":fwRuleWizardRulePlacementView.model.toJSON()}),
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER,
                        "content-type": PolicyManagementConstants.RULE_CONTENT_HEADER
                    },
                    responseText: "true",
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.runRuleAnalysis();
            });
            it(" runRuleAnalysis check", function (done) {
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.POLICY_URL + fwRuleWizardRulePlacementView.policyObj.id + PolicyManagementConstants.RULE_DRAFT + "/analyse?cuid=" + "cuid" + "&screenId=" +"test",
                    type: 'POST',
                    dataType: "json",
                    data: JSON.stringify({"firewall-rule":fwRuleWizardRulePlacementView.model.toJSON()}),
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER,
                        "content-type": PolicyManagementConstants.RULE_CONTENT_HEADER
                    },
                    responseText: "true",
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.runRuleAnalysis();
            });
        });

        describe("FW rule Create Rule Placement view viewAnalysisReport check", function () {
            var toJSON,showProgressBar, subscribeNotifications,destroy;
            beforeEach(function () {
                fwRuleWizardRulePlacementView.progressBarOverlay = {setProgressBar: function(){},updateTimer: function(){},destroy: function(){}};
                toJSON = sinon.stub(fwRuleWizardRulePlacementView.model, 'toJSON');
                showProgressBar = sinon.stub(fwRuleWizardRulePlacementView, 'showProgressBar');
                subscribeNotifications = sinon.stub(fwRuleWizardRulePlacementView, 'subscribeNotifications');
                destroy = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'destroy');
            });

            afterEach(function () {
                toJSON.restore();
                showProgressBar.restore();
                subscribeNotifications.restore();
                destroy.restore();
            });
            it(" viewAnalysisReport success check", function (done) {
                fwRuleWizardRulePlacementView.model.attributes.resultFileName = "test";
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.RULE_ANALYSIS_REPORT_URL + fwRuleWizardRulePlacementView.model.get("resultFileName"),
                    type: 'GET',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ANALYSIS_REPORT_ACCEPT_HEADER
                    },
                    responseText: {"preview-report-response":{"file-name": "test"}},
                    responseTime: 1,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.viewAnalysisReport();
            });
            it(" viewAnalysisReport error check", function (done) {
                fwRuleWizardRulePlacementView.model.attributes.resultFileName = "test";
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.RULE_ANALYSIS_REPORT_URL + fwRuleWizardRulePlacementView.model.get("resultFileName"),
                    type: 'GET',
                    "headers" :{
                        "accept": PolicyManagementConstants.RULE_ANALYSIS_REPORT_ACCEPT_HEADER
                    },
                    responseText: {"preview-report-response":{"file-name": "test"}},
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.viewAnalysisReport();
            });

        });
        describe("FW rule Create Rule Placement view viewAnalysisReport check", function () {
            var destroy;
            beforeEach(function () {

                destroy = sinon.stub(fwRuleWizardRulePlacementView.progressBarOverlay, 'destroy');
            });

            afterEach(function () {

                destroy.restore();
            });
            it(" analysisReportDownload success check", function (done) {
                fwRuleWizardRulePlacementView.model.attributes.resultFileName = "test";
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.RULE_ANALYSIS_DOWNLOAD_PDF_URL + "test",
                    type: 'GET',
                    "headers" :{
                        "accept": "application/pdf"
                    },
                    // responseText: {"preview-report-response":{"file-name": "test"}},
                    responseTime: 1,
                    response: function (settings, done2) {
                        //done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.analysisReportDownload({"preview-report-response":{"file-name": "test"}});
            });
            it(" analysisReportDownload error check", function (done) {
                fwRuleWizardRulePlacementView.model.attributes.resultFileName = "test";
                $.mockjax.clear();
                $.mockjax({

                    url: PolicyManagementConstants.RULE_ANALYSIS_DOWNLOAD_PDF_URL + "test",
                    type: 'GET',
                    "headers" :{
                        "accept": "application/pdf"
                    },
                    //responseText: {"preview-report-response":{"file-name": "test"}},
                    status: 500,
                    response: function (settings, done2) {
                        done2();
                        // consoleSpy.calledWith("call to fetch policy in base rule collection failed").should.be.equal(true);
                        done();
                        // consoleSpy.restore();
                    }
                });
                fwRuleWizardRulePlacementView.analysisReportDownload({"preview-report-response":{"file-name": "test"}});
            });



        });

    });
});
