/**
 * Test file for Block Application View.
 * @module
 * @name BlockApplicationViewTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["../../views/blockApplicationView.js",
        '../../../../../../base-policy-management/js/policy-management/policies/views/basePolicyGridView.js',
        '../../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
        '../../../../../../security-management/js/jobs/JobDetailedView.js'],
    function (BlockApplicationView, PolicyView, SSE, JobView) {

        describe('Block Application View UT', function () {
            var view, context, activity, initialInput = {
                selectedApplications: 'selectedApplications',
                blockHeader: 'dummy block header',
                startTime: 'dummyStart',
                endTime: 'dummyEnd',
                sourceName: 'dummySource',
                sourceValues: 'dummyValues'
            };
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                activity = new Slipstream.SDK.Activity();


                activity.cuid = 'CUID';
                activity.context = context;

                context.getMessage = function (key) {
                    return key;
                };

                context.getHelpKey = function () {
                };

                context.startActivityForResult = function () {
                };

                view = new BlockApplicationView(initialInput, activity);
            });

            after(function () {
            });

            describe('Initialization and render', function () {
                var stub, stub2, stub3, stub4, stub5, stub6;
                beforeEach(function () {
                    stub = sinon.stub(view, 'getStringFromArray');
                    stub2 = sinon.stub(view, 'buildPolicyGrid');
                    stub4 = sinon.stub(view, 'fetchPoliciesByUUID');
                    stub5 = sinon.stub(view, 'fetchPoliciesFromECM');
                    stub6 = sinon.stub(view, 'getSourceValuesString');
                });

                afterEach(function () {
                    stub.restore();
                    stub2.restore();
                    stub4.restore();
                    stub5.restore();
                    stub6.restore();
                });

                it('Checks if the view object is created properly', function () {

                    view.should.exist;
                    view.input.should.be.equal(initialInput);
                    view.activity.should.be.equal(activity);
                    view.selectedApplications.should.be.equal(initialInput.selectedApplications);
                    view.service.should.exist;
                    view.context.should.be.equal(context);
                    view.blockHeader.should.be.equal(initialInput.blockHeader);
                });

                it('Calls the render properly : TMP launch', function () {
                    view.input.UUID = 'dummyUUID';
                    view.render();

                    view.formWidget.should.exist;
                    stub2.called.should.be.equal(true);
                    stub4.called.should.be.equal(true);
                    stub5.called.should.be.equal(false);

                    _.isUndefined(view.uuid).should.be.equal(false);

                });

                it('Calls the render properly : ECM launch', function () {
                    view.input.UUID = undefined;
                    view.render();

                    view.formWidget.should.exist;
                    stub2.called.should.be.equal(true);
                    stub4.called.should.be.equal(false);
                    stub5.called.should.be.equal(true);

                    _.isUndefined(view.uuid).should.be.equal(false);

                });

                it('Checks if the progress bar is created properly', function () {
                    view.displayProgressBar('dummyTitle', 'statusText', false, false, true);
                    view.progressBar.should.exist;
                    view.progressBarOverlay.should.exist;
                    view.progressBar.conf.title.should.be.equal('dummyTitle');
                    view.progressBar.conf.statusText.should.be.equal('statusText');
                    view.progressBar.conf.hasPercentRate.should.be.equal(true);
                });

                it('Checks if the progress bar is created properly', function () {
                    view.displayProgressBar('dummyTitle', 'statusText', true, true, true);
                    view.progressBar.should.exist;
                    view.progressBarOverlay.should.exist;
                    view.progressBar.conf.title.should.be.equal('dummyTitle');
                    view.progressBar.conf.statusText.should.be.equal('statusText');
                    view.progressBar.conf.hasPercentRate.should.be.equal(true);
                });

                it('Checks if the cancel on overlay is defined properly', function () {
                    view.overlay = {
                        destroy: function () {
                        }
                    };

                    var destroystub = sinon.stub(view.overlay, 'destroy');

                    view.onCancel({
                        preventDefault: function () {
                        }
                    });

                    destroystub.called.should.be.equal(true);

                    destroystub.restore();


                });
            });

            describe('Grid  widgets rendering', function () {
                var stub, stub2, stub3;

                before(function () {
                    stub = sinon.stub(PolicyView.prototype, 'subscribeNotifications');
                    stub2 = sinon.stub(PolicyView.prototype, 'bindModelEvents');
                    stub3 = sinon.stub(SSE.prototype, 'stopSubscription');
                });

                after(function () {
                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                });


                it('Checks if the policy grid is created properly', function () {
                    view.buildPolicyGrid();
                    view.disableAllButtons();

                    view.collection.should.exist;
                    view.gridView.should.exist;
                    view.gridView.gridWidget.should.exist;
                    view.gridView.gridWidgetObject.should.exist;

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                });

                it('Checks if the total rows are defined properly', function () {
                    var totalRows = view.gridView.gridWidgetObject.conf.elements.footer.getTotalRows();

                    totalRows.should.be.equal(0);

                    view.collection.length = 5;

                    totalRows = view.gridView.gridWidgetObject.conf.elements.footer.getTotalRows();
                    totalRows.should.be.equal(2);

                    view.collection.length = 0;
                });


                it('Checks if the source name is returned properly', function () {
                    var val;

                    val = view.getStringFromArray([], 'dummyPre');
                    val.should.be.equal('All dummyPre');


                    val = view.getStringFromArray([
                        {
                            name: 'dummy1'
                        },
                        {
                            name: 'dummy2'
                        }
                    ], 'dummyPre');
                    val.should.be.equal('dummy1,dummy2');
                });

                it('Checks if the source value is returned properly', function () {
                    var val;

                    val = view.getSourceValuesString('user', '');
                    val.should.be.equal('All Users');

                    val = view.getSourceValuesString('application', '');
                    val.should.be.equal('All Applications');

                    val = view.getSourceValuesString('source_ip', '');
                    val.should.be.equal('All Source IPs');

                    val = view.getSourceValuesString('destination_ip', '');
                    val.should.be.equal('All Destination IPs');

                    val = view.getSourceValuesString('user', 'dummyVal');
                    val.should.be.equal('dummyVal');

                    val = view.getSourceValuesString('user123', '');
                    val.should.be.equal('');

                    val = view.getStringFromArray([
                        {
                            name: 'dummy1'
                        },
                        {
                            name: 'dummy2'
                        }
                    ], 'dummyPre');
                    val.should.be.equal('dummy1,dummy2');
                });

            });

            describe('Policies fetch', function () {
                var stub1, stub2, stub3, stub4;
                beforeEach(function () {
                    stub1 = sinon.stub(view.service, 'getPolicies');
                    stub4 = sinon.stub(view.service, 'getPolicyCLByUUID');
                    stub2 = sinon.stub(view, 'getStringFromArray', function () {
                        return 'dummyApp';
                    });
                    stub3 = sinon.stub(view, 'onPoliciesSuccess');
                });

                afterEach(function () {
                    stub1.restore();
                    stub2.restore();
                    stub3.restore();
                    stub4.restore();
                });

                it('Checks if the policy fetch fom ecm passes correct paramters', function () {
                    view.fetchPoliciesFromECM();
                    stub1.called.should.be.equal(true);
                    stub1.args[0][0].should.be.equal('dummyApp');
                    stub1.args[0][1].should.be.equal(view.input.startTime);
                    stub1.args[0][2].should.be.equal(view.input.endTime);
                    stub1.args[0][3].should.be.equal(view.input.sourceName);
                    stub1.args[0][4].should.be.equal(view.input.sourceValues);
                    stub1.args[0][5].should.be.equal("");
                    stub1.args[0][6].should.be.equal(false);
                    stub1.args[0][7]();

                    stub3.called.should.be.equal(true);
                    stub3.args[0][0].should.be.equal('calculate-policies');
                    stub3.args[0][1].should.be.equal('app-access-policy-details');
                    stub3.args[0][2].should.be.equal('app-access-details');

                });

                it('Checks if the policy fetch by UUID passes correct paramters with callback', function () {
                    view.fetchPoliciesByUUID('dummyId');
                    stub4.called.should.be.equal(true);
                    stub4.args[0][0].should.be.equal('dummyId');
                    stub4.args[0][1]();


                    stub3.called.should.be.equal(true);
                    stub3.args[0][0].should.be.equal('rule-analysis-result');
                    stub3.args[0][1].should.be.equal('fw-policy-change-list');
                    stub3.args[0][2].should.be.equal('change-list');

                    view.fetchPoliciesByUUID('dummyId', function () {
                    });
                    stub4.calledTwice.should.be.equal(true);


                });
            });

            describe('It calls policies fetch success/failure', function () {
                var stub, stub2, stub3;

                beforeEach(function () {
                    stub = sinon.stub(view.collection, 'fetch');
                    stub2 = sinon.stub(view, 'disableAllButtons');
                    stub3 = sinon.stub(view.progressBarOverlay, 'destroy');
                });

                afterEach(function () {
                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                });

                it('Checks policies fetch success, no result', function () {

                    var data = {
                        root: {
                            total: 0
                        }
                    };
                    view.onPoliciesSuccess('root', 'obj', 'path', data);
                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                    stub.args[0][0].url.should.be.equal(view.collection.url());
                    stub.args[0][0].filterSearchSortOptions.FILTER.should.be.equal('(id eq -1)');


                    view.onPoliciesSuccess('calculate-policies', 'obj', 'path', {
                        'calculate-policies': {
                            'obj': [],
                            total: 0
                        }
                    });

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                    view.onPoliciesSuccess('calculate-policies', 'obj', 'path', {
                        'calculate-policies': {
                            total: 0
                        }
                    });

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                    stub.args[0][0].url.should.be.equal(view.collection.url());
                    stub.args[0][0].filterSearchSortOptions.FILTER.should.be.equal('(id eq -1)');

                });


                it('Checks policies fetch success, with result', function () {

                    var stubShowError, data = {
                        root: {
                            total: 1,
                            obj: [
                                {
                                    'policy-id': 123
                                },
                                {
                                    'policy-id': 1234
                                }
                            ]
                        }
                    };
                    view.onPoliciesSuccess('root', 'obj', 'path', data);
                    stub.called.should.be.equal(true);

                    stub.args[0][0].url.should.be.equal(view.collection.url());
                    stub.args[0][0].filterSearchSortOptions.FILTER.should.be.equal('((id eq 123) or (id eq 1234))');

                    view.collection.add(new view.collection.model({
                        id: 123
                    }));
                    view.collection.add(new view.collection.model({
                        id: 1234
                    }));

                    view.collection.trigger('beforeFetchComplete');
                    stub3.called.should.be.equal(true);

                    view.collection.remove(1234);
                    stubShowError = sinon.stub(view, 'showPolicyDeletedError');

                    view.collection.trigger('beforeFetchComplete');
                    stubShowError.called.should.be.equal(true);
                    stubShowError.restore();
                });


                it ('Checks if the error dialog is created on policy delete', function() {
                    var stub = sinon.stub(view, 'removeChangeList');
                    view.showPolicyDeletedError();
                    view.errorDialogWidget.should.exists;
                    view.errorDialogWidget = null;
                    view.input.UUID = 'xyz';
                    view.showPolicyDeletedError();
                    view.errorDialogWidget.should.exists;
                    view.input.UUID = undefined;

                    view.errorDialogWidget.vent.trigger('yesEventTriggered');
                    (view.errorDialogWidget === null).should.be.equal(true);
                    stub.called.should.be.equal(true);
                    stub.restore();
                });



                it('Checks policies failure', function () {

                    view.onPoliciesFailure();
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                });

            });

            describe('Save Action', function () {

                it('checks if the save policy is called on save button click', function () {
                    var stub = sinon.stub(view, 'savePolicies');
                    view.onSaveClick();
                    stub.called.should.be.equal(true);
                    stub.restore();

                });


                it('checks if the save on policy is called when changelist is available', function () {
                    var stub = sinon.stub(view, 'displayProgressBar'),
                        stub3 = sinon.stub(view, 'performSaveAction');
                    var stub2 = sinon.stub(view.gridView, 'getPolicies', function () {
                        return [
                            {
                                'change-list': 'dummyList',
                                'app-access-details': 'dummyDetails',
                                'policy-id': 123
                            }
                        ]
                    });
                    view.savePolicies();
                    stub.called.should.be.equal(true);

                    stub3.called.should.be.equal(true);
                    stub.restore();
                    stub2.restore();

                    stub3.restore();

                });

                it('checks if the save on policy is called when changelist is not available', function () {
                    var stub = sinon.stub(view, 'displayProgressBar'),
                        stub3 = sinon.stub(view, 'getAllChangeList'),
                        stub4 = sinon.stub(view, 'performSaveAction');
                    var stub2 = sinon.stub(view.gridView, 'getPolicies', function () {
                        return [
                            {
                                'app-access-details': 'dummyDetails',
                                'policy-id': 123
                            }
                        ]
                    });
                    view.savePolicies();
                    stub.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);
                    stub3.args[0][0].should.include('dummyDetails');
                    stub3.args[0][2].should.be.equal(true);
                    stub3.args[0][1]();
                    stub4.called.should.be.equal(true);

                    stub.restore();
                    stub2.restore();

                    stub3.restore();
                    stub4.restore();

                });


                it('checks if the save api on policy is called properly', function () {
                    var stub = sinon.stub(view, 'handleSaveNotification'),
                        stub4 = sinon.stub(view.progressBarOverlay, 'destroy'),
                        stub3 = sinon.stub(view.service, 'savePolicies'),
                        stub5 = sinon.stub(view, 'showErrorMessage');
                    var stub2 = sinon.stub(view, 'getChangeList', function () {
                        return [
                            {
                                'app-access-details': 'dummyDetails',
                                'policy-id': 123
                            }
                        ]
                    });
                    view.uuid = 'dummyUUID';
                    view.performSaveAction();
                    stub.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);
                    stub3.args[0][0].should.include('dummyUUID');
                    stub3.args[0][1][0]['app-access-details'].should.be.equal('dummyDetails');
                    stub3.args[0][4]();
                    stub4.called.should.be.equal(true);
                    view.isLaunchedFromPublish.should.be.equal(false);
                    stub5.args[0][0].should.be.equal('rule_grid_save_failed_error');

                    stub3.args[0][4]({});
                    // no response text
                    stub4.called.should.be.equal(true);
                    view.isLaunchedFromPublish.should.be.equal(false);
                    stub5.args[1][0].should.be.equal('rule_grid_save_failed_error');

                    stub3.args[0][4]({
                        responseText: 'dummyMessage'
                    });
                    // no response text
                    stub5.args[2][0].should.be.equal('dummyMessage');

                    stub.restore();
                    stub2.restore();

                    stub3.restore();
                    stub4.restore();
                    stub5.restore();

                });


                it('checks if the save api on policy is called properly if no change list: When launched from save', function () {
                    var stub = sinon.stub(view, 'saveCallBack'),
                        stub2 = sinon.stub(view, 'getChangeList', function () {
                            return [
                            ]
                        });

                    view.isLaunchedFromPublish = false;

                    view.performSaveAction();
                    stub.called.should.be.equal(true);

                    stub.restore();
                    stub2.restore();

                });

                it('checks if the save api on policy is called properly if no change list: When launched from publish', function () {
                    var stub = sinon.stub(view, 'startPublishing'),
                        stub2 = sinon.stub(view, 'getChangeList', function () {
                            return [
                            ]
                        });

                    view.isLaunchedFromPublish = true;

                    view.performSaveAction();
                    stub.called.should.be.equal(true);

                    stub.restore();
                    stub2.restore();

                });

                it('Checks save callback action', function () {
                    var stub = sinon.stub(view.progressBarOverlay, 'destroy'),
                        stub2 = sinon.stub(view.overlay, 'destroy');
                    view.saveCallBack();
                    stub.called.should.be.equal(true);
                    view.$el.find('#saveButton').hasClass('disabled').should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub.restore();
                    stub2.restore();

                });
            });

            describe('Publish/Update', function () {

                it('Check publish button action', function () {
                    var stub = sinon.stub(view, 'publishUpdate');

                    view.publishPolicies();

                    stub.called.should.be.equal(true);
                    view.update.should.be.equal(false);

                    stub.restore();
                });

                it('Check update button action', function () {
                    var stub = sinon.stub(view, 'publishUpdate');

                    view.updatePolicies();

                    stub.called.should.be.equal(true);
                    view.update.should.be.equal(true);

                    stub.restore();
                });


                it('Check publish update start: disabled save', function () {
                    var stub = sinon.stub(view, 'displayProgressBar'),
                        stub2 = sinon.stub(view, 'startPublishing');

                    view.publishUpdate();

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);

                    stub.restore();
                    stub2.restore();
                });

                it('Check publish update start: enabled save', function () {
                    var stub = sinon.stub(view, 'savePolicies');

                    view.$el.find('#saveButton').removeClass('disabled');

                    view.publishUpdate();

                    stub.called.should.be.equal(true);
                    view.isLaunchedFromPublish.should.be.equal(true);

                    stub.restore();
                });


                it('Checks publish job api is called properly ', function () {
                    var stub, stub2, stub3, stub4, stub5;

                    stub = sinon.stub(view, 'getPolicies', function () {
                        return [
                            {id: 123}
                        ];
                    });

                    stub2 = sinon.stub(view.service, 'publishAndUpdate');
                    stub3 = sinon.stub(view, 'publishJobCallBack');
                    stub4 = sinon.stub(view.progressBarOverlay, 'destroy');

                    view.startPublishing();

                    stub2.called.should.be.equal(true);

                    stub2.args[0][0][0].should.be.equal(123);
                    stub2.args[0][1].should.be.equal(view.update);
                    stub2.args[0][2]();

                    stub3.called.should.be.equal(true);

                    stub2.args[0][3]();
                    stub4.called.should.be.equal(true);



                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                    stub4.restore();
                });

                it('Checks if the publish, update job view is launched properly', function () {


                    var stub = sinon.stub(JobView.prototype, 'showPublishMultiJobDetailsScreen'),
                        stub2 = sinon.stub(view.progressBarOverlay, 'destroy'),
                        stub3 = sinon.stub(view.overlay, 'destroy'),
                        data = {
                            'monitorable-task-instances': {
                                'monitorable-task-instance-managed-object': 'dummyData'
                            }
                        };

                    view.publishJobCallBack(data);

                    stub.args[0][0].job.should.be.equal('dummyData');
                    stub.args[0][0].activity.should.be.equal(view.activity);

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                });

                it('Checks if the publish, update job view is launched properly', function () {


                    var stub = sinon.stub(JobView.prototype, 'showPublishMultiJobDetailsScreen'),
                        stub2 = sinon.stub(view.progressBarOverlay, 'destroy'),
                        stub3 = sinon.stub(view.overlay, 'destroy'),
                        stub4 = sinon.stub(view.activity, 'setResult'),
                        stub5 = sinon.stub(view.activity, 'finish'),
                        data = {
                            'monitorable-task-instances': {
                                'monitorable-task-instance-managed-object': 'dummyData'
                            }
                        };

                    view.input.uuid = 'dummy';
                    view.publishJobCallBack(data);
                    view.input.uuid = undefined;


                    stub.args[0][0].job.should.be.equal('dummyData');
                    stub.args[0][0].activity.should.be.equal(view.activity);

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);
                    stub4.called.should.be.equal(false);

                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                    stub4.restore();
                    stub5.restore();
                });

            });

            describe('Change list', function () {
                var stub, stub2;
                before(function () {
                    stub = sinon.stub(view.gridView, 'getPolicies', function () {
                        return [
                            {
                                isStatic: true,
                                'change-list': 'dummyList1',
                                id: 123
                            },
                            {
                                isStatic: false,
                                'change-list': 'dummyList2',
                                id: 1234
                            }
                        ]
                    });

                    stub2 = sinon.stub(view.service, 'calculateChangeList');
                });

                after(function () {
                    stub.restore();
                    stub2.restore();
                });


                it('Checks if the change list is returned properly', function () {
                    var changeList = view.getChangeList();
                    changeList.should.not.include('dummyList1');
                    changeList.should.include('dummyList2');
                });


                it('Checks if the policies are returned properly', function () {
                    view.changeListDBId = 'dummyId';
                    var policies = view.getPolicies(), stub, param = view.changeListDBId;
                    stub = sinon.stub(view.service, 'deleteChangeList');
                    view.removeChangeList();
                    policies.length.should.be.equal(1);
                    policies[0].id.should.be.equal(1234);
                    stub.called.should.be.equal(true);
                    stub.args[0][0].should.be.equal(param);
                    stub.restore();
                });


                it('Checks if the policies are returned properly', function () {
                    var policies = view.getPolicies();
                    view.removeChangeList();
                    policies.length.should.be.equal(1);
                    policies[0].id.should.be.equal(1234);
                });


            });

            describe('Notifications', function () {
                var stub, stub2, stub3, stub4, stub5, stub6;
                beforeEach(function () {
                    stub = sinon.stub(SSE.prototype, 'startSubscription');
                    stub2 = sinon.stub(SSE.prototype, 'stopSubscription');
                    stub4 = sinon.stub(view.progressBar._progressBar, 'setStatusText');
                    stub5 = sinon.stub(view.progressBar._progressBar, 'hideTimeRemaining');
                    stub6 = sinon.stub(view.progressBar._progressBar, 'setProgressBar');

                });

                afterEach(function () {
                    stub.restore();
                    stub2.restore();
                    stub4.restore();
                    stub5.restore();
                    stub6.restore();


                });

                it('Checks notifications are subscribed properly', function () {
                    stub3 = sinon.stub(view, 'getProgressUpdate');
                    view.subscribeNotifications('$fakeId');

                    stub.called.should.be.equal(true);
                    stub.args[0][0].should.include('/api/juniper/sd/task-progress/$fakeId');
                    stub.args[0][1]();
                    stub3.called.should.be.equal(true);


                    view.subscribeNotifications('fakeId');
                    stub.args[1][0].should.include('/api/juniper/sd/task-progress/$fakeId');
                    stub3.restore();
                });

                it('Checks notifications are unsubscribed properly', function () {
                    view.unSubscribeNotification();
                    stub2.called.should.be.equal(true);
                });

                it('Handles progress update success complete', function (done) {
                    view.subscribedNotificationObj = {};
                    $.mockjax.clear();

                    $.mockjax({
                        url: '/api/juniper/sd/task-progress/$fakeId',
                        type: 'GET',
                        status: 200,
                        responseText: {
                            'task-progress-response': {
                                'percentage-complete': 100,
                                'current-step': 'dummyStep'
                            }
                        },
                        response: function (settings, done2) {
                            done2();
                            stub4.called.should.be.equal(true);
                            stub5.called.should.be.equal(true);
                            stub6.called.should.be.equal(true);
                            stub4.args[0][0].should.be.equal('dummyStep');
                            stub6.args[0][0].should.be.equal(1);
                            stub2.called.should.be.equal(true);
                            done();

                        }
                    });

                    view.getProgressUpdate('$fakeId', function () {
                    }, function () {
                    })

                });


                it('Handles progress update success partial complete', function (done) {
                    view.uuid = 'fakeId';
                    $.mockjax.clear();

                    $.mockjax({
                        url: '/api/juniper/sd/task-progress/$fakeId',
                        type: 'GET',
                        status: 200,
                        responseText: {
                            'task-progress-response': {
                                'percentage-complete': 10
                            }
                        },
                        response: function (settings, done2) {
                            done2();
                            stub4.called.should.be.equal(true);
                            stub6.called.should.be.equal(true);
                            stub6.args[0][0].should.be.equal(.1);
                            done();

                        }
                    });

                    view.getProgressUpdate('fakeId')

                });

                it('Handles progress update success : no response', function (done) {
                    view.uuid = 'fakeId';
                    $.mockjax.clear();

                    $.mockjax({
                        url: '/api/juniper/sd/task-progress/$fakeId',
                        type: 'GET',
                        status: 200,
                        responseText: {

                        },
                        response: function (settings, done2) {
                            done2();
                            stub6.called.should.be.equal(true);
                            stub6.args[0][0].should.be.equal(0);
                            done();

                        }
                    });

                    view.getProgressUpdate('fakeId')

                });

                it('Handles progress update error', function (done) {
                    screen.uuid = 'fakeId';
                    $.mockjax.clear();

                    $.mockjax({
                        url: '/api/juniper/sd/task-progress/$fakeId',
                        type: 'GET',
                        status: 404,
                        response: function (settings, done2) {
                            done2();
                            done();

                        }
                    });

                    view.getProgressUpdate('fakeId', function () {
                    }, function () {
                        stub6.called.should.be.equal(false);
                    });

                });

                it('Checks if the grid notifications are closed on overlay close', function() {
                   var stub = sinon.stub(view.gridView, 'close');
                    view.close();
                    stub.called.should.be.equal(true);
                    stub.restore();
                });
            });

            describe('Change list actions', function () {
                var stub, stub2, stub3, stub4, stub5, stub6, stub7, stub8;

                beforeEach(function () {
                    stub = sinon.stub(view, 'subscribeNotifications');
                    stub2 = sinon.stub(view.progressBarOverlay, 'destroy');
                    stub3 = sinon.stub(view, 'removeChangeList');
                    stub4 = sinon.stub(view, 'startPublishing');
                    stub5 = sinon.stub(view, 'saveCallBack');
                    stub6 = sinon.stub(view.service, 'calculateChangeList');
                    stub7 = sinon.stub(view, 'fetchPoliciesByUUID');
                    stub8 = sinon.stub(view.collection, 'get', function () {
                        return {
                            set: function () {
                            }
                        }
                    });

                });

                afterEach(function () {
                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                    stub4.restore();
                    stub5.restore();
                    stub6.restore();
                    stub7.restore();
                    stub8.restore();

                });

                it('Checks save notifications', function () {
                    view.handleSaveNotification();
                    stub.called.should.be.equal(true);
                    stub.args[0][0].should.be.equal(view.uuid);

                    //check failure
                    stub.args[0][2]();
                    view.isLaunchedFromPublish.should.be.equal(false);
                    stub2.called.should.be.equal(true);

                    //check success  launched from save

                    view.isLaunchedFromPublish = false;
                    var clock = sinon.useFakeTimers();
                    stub.args[0][1]();
                    clock.tick(2000);
                    stub3.called.should.be.equal(true);
                    stub5.called.should.be.equal(true);
                    clock.restore();

                    view.isLaunchedFromPublish = true;

                    clock = sinon.useFakeTimers();
                    stub.args[0][1]();
                    clock.tick(2000);
                    stub4.called.should.be.equal(true);
                    clock.restore();
                });

                it('Checks if the change list are fetched properly', function () {
                    var appAccessDetails = 'dummyDetails', fakeResponse;

                    fakeResponse = {
                        'calculate-changelist-response': {
                            value: 'dummyVal'
                        }
                    };
                    view.getAllChangeList(appAccessDetails, function () {
                    }, function () {
                    });

                    stub6.called.should.be.equal(true);
                    stub6.args[0][0]['calculate-changelist-request']
                        ['app-access-policies']['app-access-policy-details'].should.be.equal(appAccessDetails);

                    // check failure
                    stub6.args[0][2]();
                    stub2.called.should.be.equal(true);

                    stub6.args[0][2]({});
                    stub2.called.should.be.equal(true);

                    //failure
                    stub6.args[0][3]();
                    stub2.called.should.be.equal(true);

                    // check failure on notification
                    stub.args[0][2]();
                    stub2.called.should.be.equal(true);

                    //check success on notification
                    stub.args[0][1]();
                    stub7.called.should.be.equal(true);

                    //check change list fetch success
                    var clock = sinon.useFakeTimers();

                    stub7.args[0][1]('fakeroot', 'fakeObj', 'fakePath', {
                        'fakeroot': {
                            total: 1,
                            'fakeObj': [
                                {
                                    'policy-id': 1234
                                }
                            ]
                        }
                    });
                    stub8.called.should.be.equal(true);
                    stub8.args[0][0].should.be.equal(1234);
                    clock.tick(2000);
                    clock.restore();
                });

            });

            describe('Summary launch', function () {
                var stub, stub2, stub3, stub4, changeList;
                beforeEach(function () {
                    stub = sinon.stub(view, 'displayProgressBar');
                    stub2 = sinon.stub(view, 'showSummaryPage');
                    stub3 = sinon.stub(view, 'getAllChangeList');

                });

                afterEach(function () {
                    stub.restore();
                    stub2.restore();
                    stub3.restore();
                    stub4.restore();
                });

                it('Checks if the diff view is launched properly: with change list', function () {
                    stub4 = sinon.stub(view.collection, 'get', function () {
                        return {
                            get: function (key) {
                                if (key === 'change-list')
                                    return 'dummyList';
                            }
                        };
                    });
                    view.$el.bind('testEvent', $.proxy(view.calculateDiffAndLaunchCompare, view));
                    $(view.$el).attr('data-policy-obj', '1234');
                    view.$el.trigger('testEvent');

                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub2.args[0][0].should.be.equal(1234);

                });


                it('Checks if the diff view is launched properly: no change list', function () {
                    stub4 = sinon.stub(view.collection, 'get', function () {
                        return {
                            get: function (key) {
                                if (key === 'change-list')
                                    return undefined;

                                return 'dummyAppDetails';
                            }
                        };
                    });
                    view.$el.bind('testEvent', $.proxy(view.calculateDiffAndLaunchCompare, view));
                    $(view.$el).attr('data-policy-obj', '1234');
                    view.$el.trigger('testEvent');

                    stub.called.should.be.equal(true);
                    stub3.called.should.be.equal(true);

                    stub3.args[0][0].should.be.equal('dummyAppDetails');
                    view.progressBar.close();
                });
            });


            describe('Unlock action', function () {


                it('Checks if the unlock policy is called properly: Success', function (done) {

                    view.onUnlockPolicyEvent('unlock', {}, 1234);

                    $.mockjax.clear();
                    $.mockjax({
                        type: 'POST',
                        url: view.policyConstants.POLICY_URL + "1234/unlock",
                        status: 200,
                        response: function (settings, done2) {
                            var spy = sinon.stub(view.unlockProgressBarOverlay, 'destroy');
                            done2();
                            spy.called.should.be.equal(true);
                            done();
                            spy.restore();
                        }
                    });

                    view.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                });

                it('Checks if the unlock policy is called properly: Error', function (done) {

                    view.onUnlockPolicyEvent('unlock', {}, 1234);

                    $.mockjax.clear();
                    $.mockjax({
                        type: 'POST',
                        url: view.policyConstants.POLICY_URL + "1234/unlock",
                        status: 404,
                        response: function (settings, done2) {
                            var spy = sinon.stub(view.unlockProgressBarOverlay, 'destroy');
                            done2();
                            spy.called.should.be.equal(true);
                            done();
                            spy.restore();
                        }
                    });

                    view.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                });


                it('Checks if the unlock policy cancel on confirmation', function () {

                    view.onUnlockPolicyEvent('unlock', {}, 1234);
                    var stub = sinon.stub(view.confirmationDialogWidget, 'destroy');
                    view.confirmationDialogWidget.vent.trigger('noEventTriggered');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });
            });

        });

    });
