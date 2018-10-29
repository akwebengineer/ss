define([
    '../../views/importConfigWizardView.js',
    '../../../jobs/JobDetailedView.js'
], function (View, JobDetailedView) {

    describe('Import Config Wizard View UT', function () {
        var view;
        before(function () {
            var context = new Slipstream.SDK.ActivityContext()
            view = new View({
                activity: {
                    getContext: function () {
                        return context;
                    },
                    setResult: function () {
                    },
                    finish: function () {
                    },
                    overlay: {
                        destroy: function () {
                        }
                    }
                }, type: 'rollback',
                service: 'firewall'
            });
        });
        describe('Basic functionality:: Rollback', function () {


            it('Checks if the view object is created with initialized called ', function () {
                view.should.exist;
                view.apiConfiguration['IMPORT'].api.should.be.equal("import");
                view.apiConfiguration['IMPORT'].type.should.be.equal("policy-import-management");

                view.apiConfiguration['IMPORT_DEVICE_CHANGE'].api.should.be.equal("import");
                view.apiConfiguration['IMPORT_DEVICE_CHANGE'].type.should.be.equal("policy-import-management");

                view.apiConfiguration['FWROLLBACK'].api.should.be.equal("firewall/rollback");
                view.apiConfiguration['FWROLLBACK'].type.should.be.equal("fw-rollback-management");

                view.apiConfiguration['NATROLLBACK'].api.should.be.equal("nat/rollback");
                view.apiConfiguration['NATROLLBACK'].type.should.be.equal("nat-rollback-management");

                view.apiConfiguration['IPSROLLBACK'].api.should.be.equal("ips/rollback");
                view.apiConfiguration['IPSROLLBACK'].type.should.be.equal("ips-rollback-management");


                view.dataObject.isInitiated.should.be.equal(false);

                view.progress.should.exist;
                view.wizard.should.exist;
                view.pages.should.exist;

                view.pages.length.should.be.equal(2);

            });

            it('Checks the render', function () {
                view.dataObject.lastScreen = null;
                view.render();
                view.dataObject.lastScreen.should.be.equal(0);
            });

            it('Checks the init method', function () {
                var stub = sinon.stub(view, 'initiateImport');
                view.dataObject.selectedRecord = {
                    id: 1234,
                    "service-id": 123
                };
                view.init();
                view.dataObject.params.id.should.be.equal(1234);
                view.dataObject.params.type.should.be.equal(view.contextType);
                view.dataObject.params["service-id"].should.be.equal(123);
                stub.calledWith(view.dataObject.params).should.be.equal(true);
                stub.restore();
            });

            it('Checks the close functionality', function () {
                var stub, stub2;
                stub = sinon.stub(view.pages[0].view, 'close');
                stub2 = sinon.stub(view.pages[1].view, 'close');
                view.close();

                stub.called.should.be.equal(true);
                stub.restore();

                stub2.called.should.be.equal(true);
                stub2.restore();
            });

        });

        describe('Wizard functionality', function () {
            var stub, stub2, stub3;
            beforeEach(function () {
                stub = sinon.stub(view.activity, 'setResult');
                stub2 = sinon.stub(view.activity, 'finish');
                stub3 = sinon.stub(view.activity.overlay, 'destroy');
            });

            afterEach(function () {

                stub.restore();
                stub2.restore();
                stub3.restore();
            });

            it('Checks if the wizard save trigger the import', function () {
                var stub = sinon.stub(view, 'triggerImport');

                view.onWizardSave();
                stub.called.should.be.equal(true);

                stub.restore();
            });


            it('Checks if the wizard close destroys the overlay', function () {

                view.onWizardClose();
                stub.called.should.be.equal(true);
                stub.calledWith(Slipstream.SDK.BaseActivity.RESULT_CANCELLED).should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);

            });


            it('Checks if the wizard done destroys the overlay', function () {

                view.onWizardDone();
                stub.called.should.be.equal(true);
                stub.calledWith(Slipstream.SDK.BaseActivity.RESULT_CANCELLED).should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);

            });
        });

        describe('Import action:', function () {
            var stub, stub2, stub3, stub4;

            beforeEach(function() {

                stub = sinon.stub(view, 'showMask');
                stub2 = sinon.stub(view, 'removeMask');
                stub3 = sinon.stub(view.wizard, 'build');
                stub4 = sinon.stub(view, 'getOverlayContainer', function () {
                    return view.$el;
                });
            });

            afterEach(function() {
                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
            });

            it('Checks if import action is initialized properly (Import success)', function (done) {
                var options;


                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/initiate-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {},
                    response: function (settings, done2) {
                        $.parseJSON(settings.data)['device-import-context'].id.should.be.equal(options.id);
                        view.dataObject.isInitiated.should.be.equal(false);
                        $.parseJSON(settings.data)['device-import-context']['import-oob-changes'].should.be.equal(false);
                        stub.called.should.be.equal(true);
                        done2();
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        done();

                    }
                });
                options = {
                    type: 'IMPORT',
                    id: 123
                };

                view.initiateImport(options);

            });

            it('Checks if import zip action is initialized properly (Import success)', function (done) {
                var options, api = view.apiConfig.api;
                view.apiConfig.api = 'import-zip';
                view.apiConfig.serviceType = 'firewall';

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/firewall/import-zip/initiate-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {},
                    response: function (settings, done2) {
                        stub.called.should.be.equal(true);
                        done2();
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        view.apiConfig.api = api;
                        done();

                    }
                });
                options = {
                    type: 'IMPORT_ZIP',
                    id: 123
                };

                view.initiateImport(options);

            });


            it('Checks if import action is initialized properly (Device change success)', function (done) {
                var options;


                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/initiate-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {},
                    response: function (settings, done2) {
                        $.parseJSON(settings.data)['device-import-context'].id.should.be.equal(options.id);
                        $.parseJSON(settings.data)['device-import-context']['import-oob-changes'].should.be.equal(true);
                        stub.calledWith(view.progressBar).should.be.equal(true);
                        done2();
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        done();
                    }
                });
                options = {
                    type: 'IMPORT_DEVICE_CHANGE',
                    id: 123
                };

                view.initiateImport(options);
            });


            it('Checks if import action is initialized properly (Rollback success)', function (done) {
                var options;

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/initiate-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {},
                    response: function (settings, done2) {
                        $.parseJSON(settings.data)["rollback-context"]['service-id'].should.be.equal(options['service-id']);
                        $.parseJSON(settings.data)['rollback-context']['version-id'].should.be.equal(options.id);
                        stub.calledWith(view.progressBar).should.be.equal(true);
                        done2();
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        done();
                    }
                });
                options = {
                    'service-id': 'fakeId',
                    id: 123
                };

                view.initiateImport(options);
            });


            it('Checks if import action is initialized properly (error)', function (done) {
                var options, stub2, stub3, stub4;
                stub2 = sinon.stub(view.progressBar, 'destroy');
                stub3 = sinon.stub(view.wizard, 'destroy');
                stub4 = sinon.stub(view, 'onWizardClose');

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/initiate-import?*',
                    "type": 'post',
                    status: 404,
                    responseText: {},
                    response: function (settings, done2) {
                        done2();
                        // nothing to test> no functionality defined
                        stub3.called.should.be.equal(true);
                        stub4.called.should.be.equal(true);
                        view.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                        done();
                        stub2.restore();
                        stub3.restore();
                        stub4.restore();
                    }
                });
                options = {
                    type: 'IMPORT',
                    id: 123
                };

                view.initiateImport(options);
            });


            it('Checks if the import is triggered properly: Success', function (done) {

                var clock, stubJob = sinon.stub(view, 'showJobDetails');

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/trigger-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {
                        'monitorable-task-instance-managed-object': 'fakeData'
                    },
                    response: function (settings, done2) {
                        clock = sinon.useFakeTimers();
                        done2();
                        clock.tick(20000);
                        stubJob.called.should.be.equal(true);
                        stubJob.args[0][0].should.be.equal('fakeData');
                        done();
                        stubJob.restore();
                        clock.restore();
                    }
                });

                view.triggerImport();
            });

            it('Checks if the import zip is triggered properly: Success', function (done) {

                var clock, stubJob = sinon.stub(view, 'showJobDetails');
                var api = view.apiConfig.api;
                view.apiConfig.api = 'import-zip';
                view.apiConfig.serviceType = 'firewall';

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/firewall/import-zip/trigger-import?*',
                    "type": 'post',
                    status: 200,
                    responseText: {
                        'monitorable-task-instance-managed-object': 'fakeData'
                    },
                    response: function (settings, done2) {
                        clock = sinon.useFakeTimers();
                        done2();
                        clock.tick(20000);
                        stubJob.called.should.be.equal(true);
                        stubJob.args[0][0].should.be.equal('fakeData');
                        view.apiConfig.api = api;
                        done();

                        stubJob.restore();
                        clock.restore();
                    }
                });

                view.triggerImport();
            });

            it('Checks if the import is triggered properly: Error', function (done) {

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + view.apiConfig.api + '/trigger-import?*',
                    "type": 'post',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        // nothing to test. no functionality defined
                        done();
                    }
                });

                view.triggerImport();
            });


            it('Checks if the Job details launches the job window properly', function() {
                var stub, stub2;
                view.activity.intent = {};
                view.activity.intent.action = "sd.intent.action.ACTION_ROLLBACK";
                view.activity.buildOverlay = function(){};
                stub = sinon.stub(view.activity.overlay, 'destroy');
                stub2 = sinon.stub(JobDetailedView.prototype, 'showImportJobWindow');

                view.showJobDetails({activity: view.activity});

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);

                stub.restore();
                stub2.restore();

            });


        });

        describe('Mask and overlay', function() {

            before(function() {
                view.activity.overlay.getOverlayContainer= function() {
                    return view.$el;
                }
            });
            it('Check show mask calls on overlay container properly', function() {

                view.showMask($('<div/>'));
                (view.$el.find(".slipstream-indicator-background").length > 0).should.be.equal(true);
            });

            it('Check remove mask calls on overlay container properly', function() {

                view.removeMask();
                (view.$el.find(".slipstream-indicator-background").length > 0).should.be.equal(false);
            });

        });


        describe('Basic functionality:: Import', function () {
            before(function () {
                var context = new Slipstream.SDK.ActivityContext()
                view = new View({
                    activity: {
                        getContext: function () {
                            return context;
                        }
                    }, type: 'IMPORT'
                });
            });

            it('Checks if the view object is created with initialized called ', function () {
                view.should.exist;
            });


            it('Checks the init method', function () {
                var stub = sinon.stub(view, 'initiateImport');
                view.dataObject.selectedRecord = {
                    id: 1234
                };
                view.init();
                (view.dataObject.params["service-id"] === undefined).should.be.equal(true);
                stub.restore();
            });

        });
    });

});
