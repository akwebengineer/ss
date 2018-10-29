define([
    '../../views/ImportConfigAPIs.js',
    '../../../../../ui-common/js/sse/smSSEEventSubscriber.js'
], function (API, SmSSEEventSubscriber) {
    describe('Import Config APIs UT', function () {
        var apiObj, wizardActivity;

        before(function () {
            wizardActivity = {
                apiConfig: {
                    api: 'fakeAPI'
                },
                removeMask: function () {
                }
            };
        });
        describe('Basic functionality', function () {
            before(function () {
                apiObj = new API(wizardActivity);
            });

            it('Checks if the API object exists', function () {
                apiObj.should.exist;
            });

        });

        describe('Managed Services', function () {
            var currentPage;
            before(function () {
                currentPage = {
                    progressBar: {destroy: function () {
                    }},
                    importConfigServicesGrid: {
                        getSelectedRows: function () {
                            return [
                                {MOID: 'fakeID'}
                            ]
                        }
                    },
                    dataObject: {
                        services: [
                            {MOID: 'fakeID1'},
                            {MOID: 'fakeID'}
                        ]
                    }
                };


            });

            it('Checks  if the selected services data is posted properly: Success ', function (done) {
                var stub = sinon.stub(apiObj, 'calculateConflicts');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/managed-services?*',
                    "type": 'post',
                    status: 200,
                    response: function (settings, done2) {
                        var services = $.parseJSON(settings.data)['managed-services']['service-summary'];
                        services.length.should.be.equal(2);
                        services[0].MOID.should.be.equal('fakeID1');
                        services[1]['is-selected'].should.be.equal(true);
                        services[1].MOID.should.be.equal('fakeID');
                        done2();
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });

                apiObj.postManagedServices(currentPage);
            });

            it('Checks  if the selected services data is posted properly: Error ', function (done) {
                var stub = sinon.stub(currentPage.progressBar, 'destroy'),
                    stub2 = sinon.stub(wizardActivity, 'removeMask');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/managed-services?*',
                    "type": 'post',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        done();
                        stub.restore();
                        stub2.restore();
                    }
                });

                apiObj.postManagedServices(currentPage);
            })
        });

        describe('Conflicts', function () {
            var stub, currentPage;
            before(function () {
                stub = sinon.stub(apiObj, 'subscribeNotifications');
                currentPage = {
                    dataObject: {
                        uuid: 'UUID'
                    },
                    progressBar: {destroy: function () {
                    }},
                    importConfigOCRGrid: {
                        reloadGrid: function () {
                        }
                    },
                    wizardView: {
                        wizard: {
                            nextPage: function () {
                            }
                        }
                    }
                };
            });

            after(function () {
                stub.restore();
            });
            it('Checks if the conflicts are posted properly: Success', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/calculate-conflicts?*',
                    "type": 'post',
                    status: 200,
                    response: function () {
                        done();
                        // nothing to test.. no functionality defined
                    }
                });
                apiObj.calculateConflicts(currentPage);
            });


            it('Checks if the conflicts are posted properly: Error', function (done) {

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/calculate-conflicts?*',
                    "type": 'post',
                    status: 404,
                    response: function () {
                        done();
                        // nothing to test.. no functionality defined
                    }
                });
                apiObj.calculateConflicts(currentPage);
            });

            it('Checks if the conflicts are retrieved properly: Success - Conflict defined', function (done) {
                var stub = sinon.stub(currentPage.progressBar, 'destroy'),
                    stub2 = sinon.stub(wizardActivity, 'removeMask'),
                    stub3 = sinon.stub(currentPage.importConfigOCRGrid, 'reloadGrid');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/object-conflicts?*',
                    "type": 'get',
                    status: 200,
                    responseText: {
                        "object-conflicts": {
                            "object-conflict": [
                                {}
                            ]
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        done();
                        stub.restore();
                        stub2.restore();
                        stub3.restore();
                    }
                });
                apiObj.getConflicts(currentPage);
            });


            it('Checks if the conflicts are retrieved properly: Success - No Conflict defined', function (done) {
                var stub = sinon.stub(apiObj, 'getGenerateSummaryReport');
                currentPage.page = "ocr";
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/object-conflicts?*',
                    "type": 'get',
                    status: 200,
                    responseText: {
                        "object-conflicts": {
                            "object-conflict": [
                            ]
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });
                apiObj.getConflicts(currentPage);
            });

            it('Checks if the conflicts are retrieved properly: Success - Page not defined, no conflicts', function (done) {
                var stub = sinon.stub(currentPage.progressBar, 'destroy'),
                    stub2 = sinon.stub(wizardActivity, 'removeMask'),
                    stub3 = sinon.stub(currentPage.wizardView.wizard, 'nextPage');
                currentPage.page = null;
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/object-conflicts?*',
                    "type": 'get',
                    status: 200,
                    responseText: {
                        "object-conflicts": {
                            "object-conflict": [
                            ]
                        }
                    },
                    response: function (settings, done2) {

                        done2();
                        currentPage.dataObject.readyForNext.should.be.equal(true);
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        done();
                        stub.restore();
                        stub2.restore();
                        stub3.restore();
                    }
                });
                apiObj.getConflicts(currentPage);

            });


            it('Checks if the conflicts are retrieved properly: Error', function (done) {
                var stub = sinon.stub(currentPage.progressBar, 'destroy'),
                    stub2 = sinon.stub(wizardActivity, 'removeMask');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/object-conflicts?*',
                    "type": 'get',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        done();
                        stub.restore();
                        stub2.restore();
                    }
                });
                apiObj.getConflicts(currentPage);

            });
        });

        describe('Summary Report', function () {
            var stub, stub2, currentPage;
            before(function () {
                stub = sinon.stub(apiObj, 'unSubscribeNotification');
                stub2 = sinon.stub(apiObj, 'subscribeNotifications');
                currentPage = {
                    dataObject: {
                        uuid: 'UUID'
                    },
                    progressBar: {destroy: function () {
                    },
                        setStatusText: function () {
                        },
                        updateTimer: function () {
                        }},
                    importConfigOCRGrid: {
                        reloadGrid: function () {
                        }
                    },
                    wizardView: {
                        wizard: {
                            nextPage: function () {
                            },
                            gotoPage: function () {
                            }
                        },
                        $el: {
                            find: function() {
                                return {
                                    off: function() {
                                        return {
                                            on: function () {

                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                };
            });

            after(function () {
                stub.restore();
                stub2.restore();
            });

            it('Checks if the summary report is retrieved properly: Success', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/fakeAPI/generate-summary?*',
                    "type": 'post',
                    status: 200,
                    responseText: {},
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. not defined
                        done();
                    }
                });

                apiObj.getGenerateSummaryReport(currentPage);
                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub2.calledWith(currentPage).should.be.equal(true);
            });

            it('Checks if the summary report is retrieved properly: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/fakeAPI/generate-summary?*',
                    "type": 'post',
                    status: 404,
                    responseText: {},
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. not defined
                        done();
                    }
                });
                apiObj.getGenerateSummaryReport(currentPage);
            });


            it('Checks if summary info is retrieved properly: Success', function (done) {
                var stub11 = sinon.stub(currentPage.wizardView.wizard, 'gotoPage');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/fakeAPI/summary?*',
                    "type": 'get',
                    status: 200,
                    responseText: {'summary-reports': {
                        'summary-report': [
                            {
                                name: 'fakeName',
                                'report': 'fakeReport'
                            }
                        ]
                    }},
                    response: function (settings, done2) {
                        done2();

                        currentPage.completed.should.be.equal(true);
                        $.isEmptyObject(currentPage.dataObject.ocrSummaries).should.be.equal(false);
                        stub11.called.should.be.equal(true);
                        stub11.calledWith(2).should.be.equal(true);

                        done();
                        stub11.restore();
                    }
                });
                apiObj.getSummaryInfo(currentPage);
            });


            it('Checks if summary info is retrieved properly: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/fakeAPI/summary?*',
                    "type": 'get',
                    status: 404,
                    responseText: {},
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. not defined
                        done();
                    }
                });
                apiObj.getSummaryInfo(currentPage);
            });

        });

        describe('Notifications', function () {
            var stub, stub2, currentPage, subscriptions = ['fakeSubscriptions'];
            before(function () {
                stub = sinon.stub(SmSSEEventSubscriber.prototype, 'startSubscription', function () {
                    return subscriptions;
                });
                stub2 = sinon.stub(SmSSEEventSubscriber.prototype, 'stopSubscription');
                currentPage = {
                    dataObject: {
                        uuid: 'UUID'
                    },
                    progressBar: {destroy: function () {
                    },
                        setStatusText: function () {
                        },
                        updateTimer: function () {
                        },
                        clearProgressTimerout: function () {
                        }},
                    importConfigOCRGrid: {
                        reloadGrid: function () {
                        }
                    },
                    wizardView: {
                        wizard: {
                            nextPage: function () {
                            },
                            gotoPage: function () {
                            }
                        },
                        $el: {
                            find: function() {
                                return {
                                    off: function() {
                                        return {
                                            on: function () {

                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                };
            });

            after(function () {
                stub.restore();
                stub2.restore();
            });


            it('Checks if the notifications are subscribed properly', function () {
                var events = apiObj.subscribeNotifications(currentPage);
                events.should.be.equal(subscriptions);
                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(false);

                // on calling again, it subscribe and then subscribe again
                apiObj.subscribeNotifications(currentPage);
                stub2.calledOnce.should.be.equal(true);

                currentPage.unSubscribeNotificationOnClose();
                stub2.calledTwice.should.be.equal(true);
            });

            it('Checks if the notifications are unsubscribed properly', function () {
                apiObj.unSubscribeNotification();
                stub2.calledThrice.should.be.equal(true);
            });


            it('Checks the progress notification status: Success: Current step: Calculating Conflicts', function (done) {
                apiObj.currentPage = currentPage;
                apiObj.self = apiObj;
                apiObj.activity = wizardActivity;

                var checkStub, checkStub2, checkStub3;

                checkStub = sinon.stub(currentPage.progressBar, 'destroy');
                checkStub2 = sinon.stub(wizardActivity, 'removeMask');
                checkStub3 = sinon.stub(currentPage.wizardView.wizard, 'nextPage');


                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/*',
                    "type": 'get',
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 100,
                            'current-step': 'Calculating Conflicts'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        checkStub.called.should.be.equal(true);
                        checkStub2.called.should.be.equal(true);
                        checkStub3.called.should.be.equal(true);
                        currentPage.dataObject.readyForNext.should.be.equal(true);

                        done();

                        checkStub.restore();
                        checkStub2.restore();
                        checkStub3.restore();
                    }
                });
                apiObj.checkProgressNotificationStatus();
            });

            it('Checks the progress notification status: Success: Current step: Calculating Conflicts on OCR page', function (done) {
                var checkStub;

                checkStub = sinon.stub(apiObj, 'getConflicts');
                currentPage.page = 'ocr';

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/*',
                    "type": 'get',
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 100,
                            'current-step': 'Calculating Conflicts'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        checkStub.called.should.be.equal(true);
                        checkStub.calledWith(currentPage).should.be.equal(true);
                        done();

                        checkStub.restore();
                    }
                });
                apiObj.checkProgressNotificationStatus();
            });



            it('Checks the progress notification status: Success: Current step: Generating reports', function (done) {
                var checkStub;

                checkStub = sinon.stub(apiObj, 'getSummaryInfo');
                currentPage.page = 'ocr';

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/*',
                    "type": 'get',
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 100,
                            'current-step': 'Generating Reports'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        checkStub.called.should.be.equal(true);
                        checkStub.calledWith(currentPage).should.be.equal(true);
                        done();

                        checkStub.restore();
                    }
                });
                apiObj.checkProgressNotificationStatus();
            });


            it('Checks the progress notification status: Error', function (done) {
                var checkStub, checkStub2;

                checkStub = sinon.stub(currentPage.progressBar, 'destroy');
                checkStub2 = sinon.stub(wizardActivity, 'removeMask');

                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/*',
                    "type": 'get',
                    status: 404,
                    responseText: {
                    },
                    response: function (settings, done2) {
                        done2();
                        checkStub.called.should.be.equal(true);
                        checkStub2.called.should.be.equal(true);

                        done();

                        checkStub.restore();
                        checkStub2.restore();
                    }
                });
                apiObj.checkProgressNotificationStatus();
            });


            it('Checks if the download link click calls its action properly', function() {

                var checkStub, checkStub2;

                checkStub = sinon.stub(apiObj, 'displayProgressBar');
                checkStub2 = sinon.stub(apiObj, 'generateSummaryReport');

                apiObj.onSummaryDownloadClick('dummy1', 'dummy2');

                checkStub.called.should.be.equal(true);
                checkStub2.called.should.be.equal(true);

                checkStub.restore();
                checkStub2.restore();

            });

            it('Checks if the progress bar is created properly', function() {
                apiObj. displayProgressBar({
                    getMessage: function(key) {
                        return key;
                    }
                });

                apiObj.progressBar.should.exists;

            });

            it('Checks if the download link is created properly', function() {


                var link = apiObj.getDownloadHTMLText('dummy1', 'dummy2');
                var expected = "<a href='/api/juniper/sd/policy-management/import/download-summary?uuid=" + "dummy2" +
                    "' download='SummaryReport.zip'>" + "dummy1" +"</a>";
                link.should.be.equal(expected);

            });

            it('Checks if the progress notification is set properly', function(){
                var checkStub, checkStub2;

                checkStub = sinon.stub(apiObj, 'unSubscribeNotification');
                checkStub2 = sinon.stub(apiObj, 'summaryReportHandler');
                ;
                apiObj.generateSummaryReport('dummy1');
                checkStub.called.should.be.equal(true);
                stub.args[2][1].call(apiObj);

                checkStub2.called.should.be.equal(true);

                checkStub.restore();
                checkStub2.restore();
            });


            it('Checks  if the progress notification is set properly: Success ', function (done) {
                var stub1 = sinon.stub(apiObj, 'unSubscribeNotification');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/generate-report?uuid=dummy1',
                    "type": 'post',
                    status: 200,
                    response: function (settings, done2) {
                        stub1.called.should.be.equal(true);
                        done2();
                        done();
                        stub1.restore();
                    }
                });

                apiObj.generateSummaryReport('dummy1');
            });

            it('Checks  if the progress notification is set properly: Error ', function (done) {
                var stub1 = sinon.stub(apiObj, 'unSubscribeNotification');
                var stub2 = sinon.stub(apiObj.progressBarOverlay, 'destroy');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/' + wizardActivity.apiConfig.api + '/generate-report?uuid=dummy1',
                    "type": 'post',
                    status: 404,
                    response: function (settings, done2) {
                        stub1.called.should.be.equal(true);
                        done2();
                        stub2.called.should.be.equal(true);
                        done();
                        stub1.restore();
                        stub2.restore();
                    }
                });

                apiObj.generateSummaryReport('dummy1');
            });




            it('Checks  if the summary is downloaded properly: Error ', function (done) {
                var stub1 = sinon.stub(apiObj, 'unSubscribeNotification');
                var stub2 = sinon.stub(apiObj.progressBarOverlay, 'destroy');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/$dummy1',
                    "type": 'get',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        stub1.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        done();
                        stub1.restore();
                        stub2.restore();
                    }
                });

                apiObj.summaryReportHandler('dummy1');
            });


            it('Checks  if the summary is downloaded properly: Success No response', function (done) {
                var stub1 = sinon.stub(apiObj.progressBar._progressBar, 'setProgressBar');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/$dummy1',
                    "type": 'get',
                    status: 200,
                    responseText: {

                    },
                    response: function (settings, done2) {
                        done2();
                        stub1.called.should.be.equal(true);
                        stub1.args[0][0].should.be.equal(0);
                        done();
                        stub1.restore();
                    }
                });

                apiObj.summaryReportHandler('dummy1');
            });


            it('Checks  if the summary is downloaded properly: Success - Not complete', function (done) {
                var stub1 = sinon.stub(apiObj.progressBar._progressBar, 'setProgressBar'),
                    stub2 = sinon.stub(apiObj.progressBar._progressBar, 'setStatusText');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/$dummy1',
                    "type": 'get',
                    status: 200,
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 50,
                            'current-step': 'step1'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub1.called.should.be.equal(true);
                        stub1.args[0][0].should.be.equal(0.5);

                        stub2.called.should.be.equal(true);
                        stub2.args[0][0].should.be.equal('step1');

                        done();
                        stub1.restore();
                        stub2.restore();
                    }
                });

                apiObj.summaryReportHandler('dummy1');
            });


            it('Checks  if the summary is downloaded properly: Success - complete', function (done) {
                var stub1 = sinon.stub(apiObj.progressBar._progressBar, 'setProgressBar'),
                    stub2 = sinon.stub(apiObj.progressBar._progressBar, 'setStatusText'),
                    stub3 = sinon.stub(apiObj, 'unSubscribeNotification');

                apiObj.downloadButton = {
                    parent: function() {
                        return {
                            html: function() {

                            }
                        }
                    }
                }
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/task-progress/$dummy1',
                    "type": 'get',
                    status: 200,
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 100,
                            'current-step': 'step2',
                            'task-id': '$dummy1'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub1.called.should.be.equal(true);
                        stub1.args[0][0].should.be.equal(1);

                        stub2.called.should.be.equal(true);
                        stub2.args[0][0].should.be.equal('step2');

                        stub3.called.should.be.equal(true);

                        done();
                        stub1.restore();
                        stub2.restore();

                        stub3.restore();
                    }
                });

                apiObj.summaryReportHandler('dummy1');
            });

        });
    });

});
