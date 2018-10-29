
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleOptionsEditorView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../constants/fwRuleGridConstants.js'
],function(FwRuleOptionsEditorView, RuleModel, PolicyManagementConstants) {
    var fwRuleOptionsEditorView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            'policyObj': {},
            'save': {},
            'close': {},
            'context': context,
            'columnName': 'destination-address.addresses.address-reference',
            "model" : new RuleModel({"scheduler": {name:"test"}, set: function(){},get: function(){}, clone: function(){}})
        };
        fwRuleOptionsEditorView = new FwRuleOptionsEditorView(viewParams);
        fwRuleOptionsEditorView.cloneModel = {get: function(){},set: function(){},on: function(key, option){}};
    });

    after(function () {
    });

    describe("RW Rule create Option editor view tests", function () {

        describe("FW rule Create Option editor view initialize check", function () {

            it("initialize check", function () {
                fwRuleOptionsEditorView.should.exist;
            });

        });

        /*describe("FW rule Create Option editor view Render check", function () {
         var setupViewValues, clone;
         beforeEach(function () {
         //fwRuleOptionsEditorView.model = {get: function(){}, clone: function(){}}
         setupViewValues = sinon.stub(fwRuleOptionsEditorView, 'setupViewValues');
         clone = sinon.stub(fwRuleOptionsEditorView.model, 'clone', function(){
         return {get: function(){},set: function(){},on: function(key, option){
         option();
         }}
         });
         });

         afterEach(function () {
         setupViewValues.restore();
         clone.restore();
         });
         it("render check", function () {
         fwRuleOptionsEditorView.render();
         setupViewValues.called.should.be.equal(true);
         clone.called.should.be.equal(true);
         });

         });*/
        describe("FW rule Create Option editor view setDefaultFormValues check", function () {
            var setupViewValues;
            beforeEach(function () {
                setupViewValues = sinon.stub(fwRuleOptionsEditorView, 'setupViewValues');
            });

            afterEach(function () {
                setupViewValues.restore();
            });
            it("setDefaultFormValues check", function () {
                fwRuleOptionsEditorView.setDefaultFormValues();
                setupViewValues.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view createRemoteDropDown check", function () {

            it("formatRemoteResult check", function () {
                var schedulerUrlParams = {
                    acceptHeader : PolicyManagementConstants.SCHEDULER_ACCEPT_HEADER,
                    url : PolicyManagementConstants.SCHEDULER_URL,
                    jsonRoot : "schedulers.scheduler",
                    jsonRecordParam : "schedulers",
                    templateResult : this.formatRemoteResult,
                    templateSelection:this.formatSchedulerRemoteResultSelection
                };
                var val =fwRuleOptionsEditorView.createRemoteDropDown('rulescheduler',fwRuleOptionsEditorView.schedulerChangeHandler,schedulerUrlParams);
            });

        });
        describe("FW rule Create Option editor view formatRemoteResult check", function () {

            it("formatRemoteResult check", function () {
                var val =fwRuleOptionsEditorView.formatRemoteResult({name: 'test'});
                val.should.be.equal('test');
            });

        });

        describe("FW rule Create Option editor view formatSchedulerRemoteResultSelection check", function () {

            it("formatSchedulerRemoteResultSelection check", function () {
                var val = fwRuleOptionsEditorView.formatSchedulerRemoteResultSelection({name:'test'});
                val.should.be.equal('test');
            });

        });

        describe("FW rule Create Option editor view schedulerChangeHandler check", function () {
            var set;
            beforeEach(function () {
                set = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'set');
            });

            afterEach(function () {
                set.restore();
            });
            it("schedulerChangeHandler with no scope", function () {
                fwRuleOptionsEditorView.schedulerChangeHandler("test");
                set.called.should.be.equal(false);
            });
            it("schedulerChangeHandler empty check", function () {
                fwRuleOptionsEditorView.schedulerChangeHandler("", fwRuleOptionsEditorView);
                set.called.should.be.equal(true);
            });

        });



        describe("FW rule Create Option editor view updateProfileValuesOnView check", function () {
            var setupViewValues, editCompleted, set;
            beforeEach(function () {
                setupViewValues = sinon.stub(fwRuleOptionsEditorView, 'setupViewValues');
                editCompleted = sinon.stub(fwRuleOptionsEditorView, 'editCompleted');
                set = sinon.stub(fwRuleOptionsEditorView.model, 'set');

            });

            afterEach(function () {
                setupViewValues.restore();
                editCompleted.restore();
                set.restore();
            });
            it("updateProfileValuesOnView check", function () {
                fwRuleOptionsEditorView.updateProfileValuesOnView();
                setupViewValues.called.should.be.equal(true);
                editCompleted.called.should.be.equal(true);
                set.called.should.be.equal(true);
            });

        });

        describe("FW rule Create Option editor view profileOverlay.destroy check", function () {
            var destroy;
            beforeEach(function () {
                fwRuleOptionsEditorView.profileOverlay = { destroy : function(){}};
                destroy = sinon.stub(fwRuleOptionsEditorView.profileOverlay, 'destroy');
            });

            afterEach(function () {
                destroy.restore();
            });
            it("setDefaultFormValues check", function () {
                fwRuleOptionsEditorView.closeProfileOverlay({preventDefault: function(){}});
                destroy.called.should.be.equal(true);
            });

        });

        describe("FW rule Create Option editor view showSchedulerOverlay check", function () {
            var startActivityForResult, setValue, set;
            beforeEach(function () {
                fwRuleOptionsEditorView.schedulerDropdown = {setValue: function(){}};
                setValue = sinon.stub(fwRuleOptionsEditorView.schedulerDropdown, 'setValue');
                set = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'set');
                startActivityForResult = sinon.stub(fwRuleOptionsEditorView.context, 'startActivityForResult', function(intent, option){
                    option({}, {id: 123, name: 'test'});
                });
            });

            afterEach(function () {
                startActivityForResult.restore();
                set.restore();
                setValue.restore();
            });
            it("showSchedulerOverlay check", function () {
                fwRuleOptionsEditorView.showSchedulerOverlay();
                startActivityForResult.called.should.be.equal(true);
                set.called.should.be.equal(true);
                setValue.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view setCellViewValues check", function () {
            var get;
            beforeEach(function () {
                fwRuleOptionsEditorView.options = {ruleCollection: {get: function(){}}};
                get = sinon.stub(fwRuleOptionsEditorView.options.ruleCollection, 'get');
            });

            afterEach(function () {
                get.restore();
            });
            it("setCellViewValues check", function () {
                fwRuleOptionsEditorView.setCellViewValues({originalRowData: {}});
                get.called.should.be.equal(true);
            });

        });

        describe("FW rule Create Option editor view setupViewValues check", function () {
            var get, find;
            beforeEach(function () {
                get = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'get', function(){return {'profile-type': ""}});
                find = sinon.stub(fwRuleOptionsEditorView.$el, 'find',function(){return {text: function(){}}} );
            });

            afterEach(function () {
                get.restore();
                find.restore();
            });
            it("setupViewValues check NONE", function () {
                fwRuleOptionsEditorView.setupViewValues();
                get.called.should.be.equal(true);
                find.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view setupViewValues check", function () {
            var get, find;
            beforeEach(function () {
                get = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'get', function(){return {'profile-type':"INHERITED"}});
                find = sinon.stub(fwRuleOptionsEditorView.$el, 'find',function(){return {text: function(){}}} );
            });

            afterEach(function () {
                get.restore();
                find.restore();
            });
            it("setupViewValues check INHERITED", function () {
                fwRuleOptionsEditorView.setupViewValues();
                get.called.should.be.equal(true);
                find.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view setupViewValues check", function () {
            var get, find;
            beforeEach(function () {
                get = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'get', function(){return {'profile-type':"USER_DEFINED", "user-defined-profile": {name: 'test'}}});
                find = sinon.stub(fwRuleOptionsEditorView.$el, 'find',function(){return {text: function(){}}} );
            });

            afterEach(function () {
                get.restore();
                find.restore();
            });
            it("setupViewValues check USER_DEFINED", function () {
                fwRuleOptionsEditorView.setupViewValues();
                get.called.should.be.equal(true);
                find.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view setupViewValues check", function () {
            var get, find;
            beforeEach(function () {
                get = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'get', function(){return {'profile-type':"CUSTOM"}});
                find = sinon.stub(fwRuleOptionsEditorView.$el, 'find',function(){return {text: function(){}}} );
            });

            afterEach(function () {
                get.restore();
                find.restore();
            });
            it("setupViewValues check CUSTOM", function () {
                fwRuleOptionsEditorView.setupViewValues();
                get.called.should.be.equal(true);
                find.called.should.be.equal(true);
            });

        });
        describe("FW rule Create Option editor view showProfileOverlay check", function () {
            var get;
            beforeEach(function () {
                get = sinon.stub(fwRuleOptionsEditorView.cloneModel, 'get', function(){return {'profile-type':"CUSTOM"}});
            });

            afterEach(function () {
                get.restore();
            });
            it("showProfileOverlay check", function () {
                fwRuleOptionsEditorView.showProfileOverlay();
                get.called.should.be.equal(true);
            });

        });

    });
});
