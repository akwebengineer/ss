/**
 * UT for Base Profile wizard view
 *
 * @module accessProfileWizardViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../baseUserFwWizardView.js',
    '../../accessprofile/models/accessProfileModel.js'
], function (View, Model ) {

    var view,  getMessage, setResult, finish, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();
    describe('Base Profile Wizard view UT', function () {

        before(function () {

            activity.context = context;
            activity.getIntent=function(){
                return {action:'slipstream.intent.action.ACTION_CREATE'};
            };
            activity.overlay={
                destroy: function(){

                },
                destroyAll: function(){

                }
            };
            view = new View({
                activity: activity,
                context: context,
                model:new Model()
            });

            setResult = sinon.stub(activity, 'setResult', function (value) {
                return value;
            });
            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });
            finish = sinon.stub(activity, 'finish');

        });

        after(function () {
            getMessage.restore();
            setResult.restore();
            finish.restore();
        });

        it('Checks if the Base Profile Wizard view object is created properly', function () {
            view.should.exist;
        });
        it('Checks if the Base Profile Wizard view object is created properly', function () {
            activity.getIntent=function(){
                return {action:'slipstream.intent.action.ACTION_EDIT'};
            };
            view = new View({
                activity: activity,
                context: context,
                model:new Model()
            });

            view.should.exist;
        });
        describe('Base Profile Wizard view UT', function () {
            var build;
            before(function () {
                build = sinon.stub(view.wizard, 'build');
            });

            after(function () {
                build.restore();
            });
            it('Checks if the Base Profile Wizard view Render', function () {
                view.render();
                build.called.should.be.equal(true);
            });

        });
        describe('Base Profile createJobOverlay view UT', function () {
            var showJobInformation;
            before(function () {
                showJobInformation = sinon.stub(view.userFwUtil, 'showJobInformation');
            });

            after(function () {
                showJobInformation.restore();
            });
            it('Checks if the Base Profile Wizard view Render', function () {
                view.model.set({"job-id": 123});
                view.createJobOverlay(view.model);
                showJobInformation.called.should.be.equal(true);
            });

        });
        describe('Base Profile Wizard view UT', function () {
            var overlayDestroy;
            before(function () {
                overlayDestroy = sinon.stub(view, 'overlayDestroy');
            });

            after(function () {
                overlayDestroy.restore();
            });

            it('Checks if the Base Profile Wizard view wizardOnDone', function () {
                view.wizardOnDone();
                setResult.called.should.be.equal(true);
                setResult.args[0][setResult.args[0].length-1].should.be.equal(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                finish.called.should.be.equal(true);
                overlayDestroy.called.should.be.equal(true);
            });

        });
        describe('Base Profile Wizard view UT', function () {
            var destroy;
            before(function () {
                destroy = sinon.stub(view.activity.overlay, 'destroy');
            });

            after(function () {
                destroy.restore();
            });

            it('Checks if the Base Profile Wizard view overlayDestroy', function () {
                view.overlayDestroy();
                destroy.called.should.be.equal(true);
            });

        });
        describe('Base Profile Wizard view UT', function () {
            var destroy;
            before(function () {
                destroy = sinon.stub(view.activity.overlay, 'destroyAll');
            });

            after(function () {
                destroy.restore();
            });

            it('Checks if the Base Profile Wizard view overlayDestroyAll', function () {
                view.overlayDestroyAll();
                destroy.called.should.be.equal(true);
            });

        });

        describe('Base Profile Wizard view UT saveModel ', function () {
            var save;
            before(function () {
                save = sinon.stub(view.model, 'save');
            });

            after(function () {
                save.restore();
            });
            it('Checks create', function () {
                view.formMode = view.MODE_CREATE;
                view.saveModel({
                    success: function(value, test){
                        return value;
                    },
                    error: function(value, test){
                        return value;
                    }
                });
                save.called.should.be.equal(true);
                save.args[0][1].success({
                    jsonRoot: "test",
                    get: function(value){
                        return value;
                    },
                    toJSON: function(){
                        return {
                            test:{}
                        };
                    }
                });
                save.args[0][1].error(null, {responseText:'{"title":"test", "message": "test"}' });
                setResult.called.should.be.equal(true);
                finish.called.should.be.equal(true);
            });
            it('Checks edit 0 ', function () {
                view.formMode = view.MODE_EDIT;

                view.saveModel({
                    success: function(value, test){
                        return value;
                    },
                    error: function(value, test){
                        return value;
                    }
                });
                save.called.should.be.equal(true);
                save.args[0][1].success({
                    jsonRoot: "test",
                    get: function(value){
                        return {id:3};
                    },
                    toJSON: function(){
                        return {
                            test:{}
                        };
                    }
                });
                save.args[0][1].error(null, {responseText:'{ "message": "test"}'});
                setResult.called.should.be.equal(true);
                finish.called.should.be.equal(true);
            });
            it('Checks edit 1 ', function () {
                view.formMode = view.MODE_EDIT;
                view.saveModel({
                    error: function(value, test){
                        return value;
                    }
                });

                save.args[0][1].error(null, {responseText:'TEST'});
                setResult.called.should.be.equal(true);
                finish.called.should.be.equal(true);
            });
        });
    });
});
