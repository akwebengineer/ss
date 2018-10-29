
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleSourceIdentityEditorView.js',
    '../models/sourceIdentityModel.js'
],function(FwRuleSourceIdentityEditorView, SourceIdentityModel) {
    var fwRuleSourceIdentityEditorView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            'policyObj': {},
            'save': {},
            'close': function(){},
            'context': context,
            ruleCollection:{modifyRule: function(){}},
            'model': new SourceIdentityModel()
        };
        fwRuleSourceIdentityEditorView = new FwRuleSourceIdentityEditorView(viewParams);
    });

    after(function () {
    });
    describe("RW Rule Source Identity Editor view tests", function () {

        describe("FW rule Source Identity Editor view initialize check", function () {

            it("initialize check", function () {
                fwRuleSourceIdentityEditorView.should.exist;
            });

        });
        describe("FW rule Source Identity Editor view", function () {

            it("formatDataForAPICall check", function () {
                fwRuleSourceIdentityEditorView.formatDataForAPICall({name: "test"});
            });

        });

        describe("FW rule Source Identity Editor view", function () {

            var getSourceIdentities;
            beforeEach(function () {
                getSourceIdentities = sinon.stub(fwRuleSourceIdentityEditorView, 'getSourceIdentities', function(){return [{name:"test"}]});
            });

            afterEach(function () {
                getSourceIdentities.restore();
            });
            it("getSelectedIds as array check", function () {
                var value = fwRuleSourceIdentityEditorView.getSelectedIds();
                getSourceIdentities.called.should.be.equal(true);
            });

        });
        describe("FW rule Source Identity Editor view", function () {

            var getSourceIdentities;
            beforeEach(function () {
                getSourceIdentities = sinon.stub(fwRuleSourceIdentityEditorView, 'getSourceIdentities', function(){return {name:"test"}});
            });

            afterEach(function () {
                getSourceIdentities.restore();
            });
            it("getSelectedIds as obj check", function () {
                fwRuleSourceIdentityEditorView.getSelectedIds();
                getSourceIdentities.called.should.be.equal(true);
            });

        });
        describe("FW rule Source Identity Editor view", function () {

            it("getSourceIdentities check", function () {
                fwRuleSourceIdentityEditorView.model.attributes["sourceidentities"] = {"sourceidentity":{name: "test"}};
                var value = fwRuleSourceIdentityEditorView.getSourceIdentities();
                value.name.should.be.equal("test");
            });

        });

        describe("FW rule Source Identity Editor view", function () {

            var set;
            beforeEach(function () {
                set = sinon.stub(fwRuleSourceIdentityEditorView.model, 'set');
            });

            afterEach(function () {
                set.restore();
            });
            it("setSourceIdentity check", function () {
                fwRuleSourceIdentityEditorView.setSourceIdentity();
                set.called.should.be.equal(true);
                set.args[0][0].should.be.equal('sourceidentities');
            });

        });
        describe("FW rule Source Identity Editor view", function () {
            var destroy;
            beforeEach(function () {
                fwRuleSourceIdentityEditorView.sourceIdentityFormOverlay = {setProgressBar: function(){},updateTimer: function(){},destroy: function(){}};
                destroy = sinon.stub(fwRuleSourceIdentityEditorView.sourceIdentityFormOverlay, 'destroy');
            });

            afterEach(function () {
                destroy.restore();
            });

            it("closeSourceIdentityFormOverlay check", function () {
                fwRuleSourceIdentityEditorView.closeSourceIdentityFormOverlay({preventDefault:function(){}});
                destroy.called.should.be.equal(true);
            });

        });
        describe("FW rule Source Identity Editor view", function () {
            var updateNewValueInList,closeSourceIdentityFormOverlay, get;
            beforeEach(function () {
                updateNewValueInList = sinon.stub(fwRuleSourceIdentityEditorView, 'updateNewValueInList');
                closeSourceIdentityFormOverlay = sinon.stub(fwRuleSourceIdentityEditorView, 'closeSourceIdentityFormOverlay');
                get = sinon.stub(fwRuleSourceIdentityEditorView.sourceIdentityModel, 'get', function(){return {name:"test"}});
            });

            afterEach(function () {
                updateNewValueInList.restore();
                closeSourceIdentityFormOverlay.restore();
                get.restore();
            });

            it("updateSourceIdentity check", function () {
                fwRuleSourceIdentityEditorView.updateSourceIdentity(true);
                updateNewValueInList.called.should.be.equal(true);
                closeSourceIdentityFormOverlay.called.should.be.equal(true);
                get.called.should.be.equal(true);
                assert(get.calledWith("srcIdentity"));
            });

        });
        describe("FW rule Source Identity Editor view", function () {

            it("addNewSrcId check", function () {
                fwRuleSourceIdentityEditorView.addNewSrcId();
                fwRuleSourceIdentityEditorView.sourceIdentityFormOverlay.should.exist;
            });

        });
        describe("FW rule Source Identity Editor view", function () {

            it("updateFormValuesForEditor check", function () {
               // fwRuleSourceIdentityEditorView['editorFormElements']['addNewButtonElementID']='add-new-button';
                fwRuleSourceIdentityEditorView.updateFormValuesForEditor();
            });

        });
        describe("FW rule Source Identity Editor view", function () {
            var getSelectedItems, formatDataForAPICall, setSourceIdentity;
            beforeEach(function () {

                fwRuleSourceIdentityEditorView.listBuilder = {getSelectedItems: function(){}};

                getSelectedItems = sinon.stub(fwRuleSourceIdentityEditorView.listBuilder, 'getSelectedItems', function(option){
                    option({"SrcIdentityList":{"srcIdentities":{}}});
                });
                formatDataForAPICall = sinon.stub(fwRuleSourceIdentityEditorView, 'formatDataForAPICall');
                setSourceIdentity = sinon.stub(fwRuleSourceIdentityEditorView, 'setSourceIdentity');
            });

            afterEach(function () {
                getSelectedItems.restore();
                setSourceIdentity.restore();
                formatDataForAPICall.restore();
            });
            it("updateModel check", function () {
                fwRuleSourceIdentityEditorView.updateModel();
                getSelectedItems.called.should.be.equal(true);
                setSourceIdentity.called.should.be.equal(true);
                formatDataForAPICall.called.should.be.equal(true);
            });

        });
        describe("FW rule Source Identity Editor view", function () {
            // listBuilder.getSelectedItems
            var getSelectedItems, formatDataForAPICall, setSourceIdentity;
            beforeEach(function () {

                fwRuleSourceIdentityEditorView.listBuilder = {getSelectedItems: function(){}};

                getSelectedItems = sinon.stub(fwRuleSourceIdentityEditorView.listBuilder, 'getSelectedItems', function(option){
                    option({"SrcIdentityList":{"srcIdentities":[]}});
                });
                setSourceIdentity = sinon.stub(fwRuleSourceIdentityEditorView, 'setSourceIdentity');
            });

            afterEach(function () {
                getSelectedItems.restore();
                setSourceIdentity.restore();
            });
            it("updateModel check", function () {
                fwRuleSourceIdentityEditorView.updateModel();
                getSelectedItems.called.should.be.equal(true);
                setSourceIdentity.called.should.be.equal(true);
                assert(setSourceIdentity.calledWith(""));
            });

        });

    });
});
