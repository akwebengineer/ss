define([
    '../../views/activeDirectoryView.js',
    '../../models/activeDirectoryModel.js'
], function (View, Model) {

    describe('Active Directory Wizard View UT', function () {
        var view,  getMessage, setResult, finish, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();
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
        after(function(){
            getMessage.restore();
            setResult.restore();
            finish.restore();
        });


        it('Checks if the view object is created with initialized called ', function () {
            view.should.exist;
        });

        it('Checks the render', function () {
            view.render();
        });

        describe('Basic functionality', function () {

            it('Checks the render', function () {
                var pages = view.getWizardPages();
                pages[0].title.should.be.equal('active_directory_general_title');
                pages[1].title.should.be.equal('active_directory_domain_settings');
                pages[2].title.should.be.equal('user_firewall_assign_device');

            });
        });

        describe('Basic functionality', function () {
            var conf = {};
            it('Checks the updateWizardConf create', function () {
                view.formMode = view.MODE_CREATE;
                view.updateWizardConf(conf);
                conf.title.should.be.equal('active_directory_create_title');
                conf.titleHelp.content.should.be.equal('active_directory_create_wizard_tooltip');
                conf.titleHelp["ua-help-text"].should.be.equal('more_link');

            });

            it('Checks the updateWizardConf modify', function () {
                view.formMode = view.MODE_EDIT;
                view.updateWizardConf(conf);
                conf.title.should.be.equal('active_directory_edit_title');
                conf.titleHelp.content.should.be.equal('active_directory_edit_wizard_tooltip');
                conf.titleHelp["ua-help-text"].should.be.equal('more_link');

            });


        });
        describe('Basic functionality', function () {
           var  options,success;
            before(function(){
                options = {success:function(){}};
                success = sinon.stub(options, 'success');
            });
            after(function(){
                success.restore();
            });
            it('Checks the saveSuccessCallBack create', function () {
                view.formMode = view.MODE_CREATE;
                view.saveSuccessCallBack(options, new Model());
                success.called.should.be.equal(true);
                getMessage.called.should.be.equal(true);
                success.args[0][0].should.be.equal('active_directory_create_success');
            });

            it('Checks the saveSuccessCallBack modify', function () {
                view.formMode = view.MODE_EDIT;
                view.saveSuccessCallBack(options,new Model());
                success.called.should.be.equal(true);
                getMessage.called.should.be.equal(true);
                success.args[1][0].should.be.equal('active_directory_edit_success');

            });


        });

    });

})
;
