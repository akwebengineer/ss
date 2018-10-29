define([
    '../../views/basePolicyView.js',
    '../../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../../../../fw-policy-management/js/firewall/policies/models/fwPolicyCollection.js',
    'backbone.syphon',
    '../../../policy-sequence/views/policySequenceView.js',
    '../../../../../../fw-policy-management/js/firewall/policies/conf/firewallPolicyFormConfiguration.js',
    '../../../../../../sd-common/js/common/deviceNameFormatter.js',
    '../../../assign-devices/widgets/assignDevicesListBuilder.js'
], function (View, SSE, Collection, Syphon, PolicySequence, FirewallPolicyFormConfiguration, DeviceNameFormatter, BaseListBuilder) {

    describe('Base Policy View UT', function () {
        var view, context, activity, intent, mode = 'SAVE_AS';
        before(function () {
            context = new Slipstream.SDK.ActivityContext();
            activity = new Slipstream.SDK.Activity();

            intent = sinon.stub(activity, 'getIntent', function () {
                return  {
                    getExtras: function () {
                        return {
                            id: 123,
                            mode: mode,
                            cuid: 'CUID'
                        }
                    }
                }
            });

            activity.cuid = 'CUID';

            context.getMessage = function (key) {
                return key;
            };

            context.getHelpKey = function () {
            }

            context.startActivityForResult = function () {
            }

        });

        after(function () {
            intent.restore();
        });
        describe('Basic functionality', function () {

            after(function () {
                view.collection = new Collection();
                view.policyManagementConstants = view.collection.policyManagementConstants;

                view.model = {
                    get: function () {
                    },
                    save: function () {
                    },
                    id: 123,
                    attributes: {}
                };

                view.activity.overlay = {
                    destroy: function () {
                    }
                }
            });
            it('Checks if the view object is created successfully', function () {
                var stub;

                stub = sinon.stub(View.prototype, 'initializeHandler');

                mode = 'SAVE_AS';
                view = new View({
                    context: context,
                    activity: activity
                });

                mode = 'PROMOTE_TO_GROUP';
                view = new View({
                    context: context,
                    activity: activity
                });

                view.should.exist;
                stub.called.should.be.equal(true);
                stub.restore();
            });


        });

        describe('Notifications:', function () {
            it('Checks notification subscription', function () {
                var stub, handler, expected, stub2, clock;
                stub = sinon.stub(SSE.prototype, 'startSubscription');
                stub2 = sinon.stub(view, 'getProgressUpdate');
                expected = view.policyManagementConstants.TASK_PROGRESS_URL +
                    '$CUID';
                view.subscribeNotifications();


                stub.called.should.be.equal(true);
                stub.args[0][0].toString().should.be.equal(expected);
                handler = stub.args[0][1];

                handler.call(view);

                stub2.called.should.be.equal(true);
                stub.restore();
                stub2.restore();
            });


            it('Checks the close action', function () {
                var stub;

                stub = sinon.stub(view, 'unSubscribeNotifications');


                view.close();
                stub.called.should.be.equal(true);

                stub.restore();
            });


            it('Checks stop notification', function () {
                var stub;

                stub = sinon.stub(view.smSSEEventSubscriber, 'stopSubscription');

                view.unSubscribeNotifications();

                stub.called.should.be.equal(true);
                (view.smSSEEventSubscriber === null).should.be.equal(true);
                (view.sseEventSubscriptions === null).should.be.equal(true);

                stub.restore();

            });

        });

        describe('Policy Sequence', function () {


            it('Checks the policy sequence order set is done properly', function () {
                var seq = 123, order = 12;
                view.setPolicySequenceOrder(seq, order);
                view.policyRecordSeq.should.be.equal(seq);
                view.policyRecordOrder.should.be.equal(order);
            });

            it('Checks if the policy sequence form is launched properly: Create mode', function () {
                var stub, stub1, stub2, stub3, stub4, stub5, policy = {
                    id: 123
                }, currentDomain = 1;


                window.Juniper = window.Juniper || {
                    sm: {
                        CURRENT_DOMAIN_ID: 1
                    }
                };

                stub = sinon.stub(Syphon, 'serialize', function () {
                    return policy;
                });

                stub1 = sinon.stub(view.model, 'get', function () {
                });

                stub2 = sinon.stub(PolicySequence.prototype, 'initialize');
                stub3 = sinon.stub(PolicySequence.prototype, 'render');
                stub4 = sinon.stub(view, 'buildOverlay');

                window.Juniper.sm.DomainProvider = window.Juniper.sm.DomainProvider || {
                    getCurrentDomain: function() {
                        return currentDomain;
                    }
                }


                view.selectPolicySequence();

                stub2.args[0][0].policyRecord['sequence-number'].should.be.equal(view.policyRecordSeq);
                stub2.args[0][0].policyRecord['policy-order'].should.be.equal(view.policyRecordOrder);
                stub2.args[0][0].collection.should.be.equal(view.collection);

                stub.restore();
                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();


            });

            it('Checks if the policy sequence form is launched properly: Edit mode', function () {
                var stub, stub1, stub2, stub3, stub4, stub5, policy = {
                    id: 123
                };

                view.formMode = view.MODE_EDIT;

                window.Juniper = window.Juniper || {
                    sm: {
                        CURRENT_DOMAIN_ID: 1
                    }
                };

                stub = sinon.stub(Syphon, 'serialize', function () {
                    return policy;
                });

                stub1 = sinon.stub(view.model, 'get', function () {
                    return 1;
                });

                stub2 = sinon.stub(PolicySequence.prototype, 'initialize');
                stub3 = sinon.stub(PolicySequence.prototype, 'render');
                stub4 = sinon.stub(view, 'buildOverlay');

                view.selectPolicySequence();

                stub2.args[0][0].policyRecord['sequence-number'].should.be.equal(view.policyRecordSeq);
                stub2.args[0][0].policyRecord['policy-order'].should.be.equal(view.policyRecordOrder);
                stub2.args[0][0].collection.should.be.equal(view.collection);

                stub.restore();
                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
            });

        });

        describe('Policy Save/Save As/Clone', function () {
            before(function () {
                view.context = context;
                view.activity.getIntent = function () {
                    return {
                        getExtras: function () {
                            return{
                                id: 123
                            }
                        }
                    }
                };
            });

            after(function () {
            });

            it('Checks the save as policy action: SUccess', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    url: view.policyManagementConstants.POLICY_URL + "123/draft/save-as?cuid=*",
                    type: 'POST',
                    status: 200,
                    responseText: {
                    },
                    response: function (settings, done2) {
                        var stub = sinon.stub(view, 'destroyOverlay'),
                            stub2 = sinon.stub(context, 'startActivityForResult'),
                            stub3 = sinon.stub(view, 'notify');
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
                view.saveAsPolicy({});
            });

            it('Checks the save as policy action: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    url: view.policyManagementConstants.POLICY_URL + "123/draft/save-as?cuid=*",
                    type: 'POST',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. no action defined
                        done();
                    }
                });
                view.saveAsPolicy();
            });


            it('Checks the clone policy action: Success', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    url: view.policyManagementConstants.CLONE_POLICY_URL + "*",
                    type: 'POST',
                    status: 200,
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. no action defined
                        done();

                    }
                });
                view.clonePolicy({});
            });

            it('Checks the save as policy action: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    url: view.policyManagementConstants.CLONE_POLICY_URL + "*",
                    type: 'POST',
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        // nothing to do.. no action defined
                        done();
                    }
                });
                view.clonePolicy({});
            });

            it('Checks save policy action, mode: Save as', function () {
                var stub1, stub2, stub3, stub4, stub5;
                stub1 = sinon.stub(view, 'validateForm', function () {
                    return true;
                });

                stub2 = sinon.stub(view, 'isTextareaValid', function () {
                    return true;
                });

                stub3 = sinon.stub(view, 'bindModelEvents');

                stub4 = sinon.stub(view, 'getFormData', function () {
                    return {
                        'policy-type': 'DEVICE'
                    };
                });

                stub5 = sinon.stub(view, 'saveAsPolicy');

                view.formMode = view.MODE_SAVE_AS;

                view.$el.bind('fakeEvent', $.proxy(view.savePolicy, view));
                view.$el.trigger('fakeEvent');

                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();


            });

            it('Checks save policy action, mode: promote to group', function () {
                var stub1, stub2, stub3, stub4, stub5;

                view.promoteToGroupPolicy = function () {
                };
                stub1 = sinon.stub(view, 'validateForm', function () {
                    return true;
                });

                stub2 = sinon.stub(view, 'isTextareaValid', function () {
                    return true;
                });

                stub3 = sinon.stub(view, 'bindModelEvents');

                stub4 = sinon.stub(view, 'getFormData', function () {
                    return {
                    };
                });

                stub5 = sinon.stub(view, 'promoteToGroupPolicy');

                view.formMode = view.MODE_PROMOTE_TO_GROUP;

                view.$el.bind('fakeEvent', $.proxy(view.savePolicy, view));
                view.$el.trigger('fakeEvent');

                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();


            });

            it('Checks save policy action, mode: clone', function () {
                var stub1, stub2, stub3, stub4, stub5, stub6;

                stub1 = sinon.stub(view, 'validateForm', function () {
                    return true;
                });

                stub2 = sinon.stub(view, 'isTextareaValid', function () {
                    return true;
                });

                stub3 = sinon.stub(view, 'bindModelEvents');

                stub4 = sinon.stub(view, 'getFormData', function () {
                    return {
                    };
                });

                stub5 = sinon.stub(view, 'clonePolicy');
                stub6 = sinon.stub(view, 'showProgressWindow');

                view.formMode = view.MODE_CLONE;

                view.$el.bind('fakeEvent', $.proxy(view.savePolicy, view));
                view.$el.trigger('fakeEvent');

                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);
                stub6.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();


            });

            it('Checks save policy action, mode: create', function () {
                var stub1, stub2, stub3, stub4, stub5, stub6, handler;

                stub1 = sinon.stub(view, 'validateForm', function () {
                    return true;
                });

                stub2 = sinon.stub(view, 'isTextareaValid', function () {
                    return true;
                });

                stub3 = sinon.stub(view, 'bindModelEvents');

                stub4 = sinon.stub(view, 'getFormData', function () {
                    return {
                    };
                });

                stub5 = sinon.stub(view.model, 'save');
                stub6 = sinon.stub(view, 'getOverlayContainer', function () {
                    return view.$el;
                });

                view.formMode = view.MODE_CREATE;

                view.$el.bind('fakeEvent', $.proxy(view.savePolicy, view));
                view.$el.trigger('fakeEvent');

                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);
                stub6.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();

                // for form mode create
                handler = stub5.args[0][1].success;

                stub1 = sinon.stub(view, 'assignDevices');

                handler.call(view, view.model);

                stub1.called.should.be.equal(true);
                stub1.args[0][1].should.be.equal(view.model.id);
                stub1.restore();

                // other modes
                view.formMode = view.MODE_CREATE_GROUP;
                stub1 = sinon.stub(view, 'destroyOverlay');

                handler.call(view, view.model);

                stub1.called.should.be.equal(true);
                stub1.restore();


            });

        });

        describe('Form/Rendering', function () {
            var policyPosition, policyType, modelGetStub, policyOrder = 'fakeOrder',
                policySeq = 'fakeSeq';

            before(function () {
                modelGetStub = sinon.stub(view.model, 'get', function (key) {
                    if (key === 'policy-position') {
                        return policyPosition;
                    }

                    if (key === 'policy-type') {
                        return policyType;
                    }

                    if (key === 'sequence-number') {
                        return policySeq;
                    }

                    if (key === 'policy-order') {
                        return policyOrder;
                    }
                });
            });

            after(function () {
                modelGetStub.restore();
            });


            it('Check the rendering', function () {

                var stub, stub2, stub3, stub4, stub5;

                stub = sinon.stub(view, 'getFormConfiguration', function () {
                    return new FirewallPolicyFormConfiguration(view.context);
                });

                stub2 = sinon.stub(view, 'populateFormData', function () {
                });

                stub3 = sinon.stub(view, 'subscribeNotifications');
                view.formMode = view.MODE_CLONE;
                view.addSubsidiaryFunctions = function () {
                };

                policyType = 'DEVICE';
                view.render();
                stub3.called.should.be.equal(true);


                view.formMode = view.MODE_PROMOTE_TO_GROUP;
                view.render();


                policyType = 'GLOBAL';
                policyPosition = 'PRE';
                view.formMode = view.MODE_EDIT;
                view.render();

                policyType = 'GLOBAL';
                policyPosition = 'POST';
                view.formMode = view.MODE_SAVE_AS;
                view.render();


                stub4 = sinon.stub(view, 'addDevicesListBuilder');
                stub5 = sinon.stub(view, 'policyTypeChangeHandler');

                view.formMode = view.MODE_CREATE;
                view.render();

                view.policyModel = {
                    get: function () {
                        return 123;
                    }
                };
                view.formMode = view.MODE_CREATE;
                view.render();


                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();

                // adding functionality wiyth no UT. only class change and ui building
                view.policyTypeChangeHandler('GROUP');
                view.policyTypeChangeHandler('');
                $(view.deviceDropDown.conf.$container).trigger('change');
            });

            it('Checks remote results formatting', function () {
                var data = 'fakeData', stub;
                stub = sinon.stub(DeviceNameFormatter.prototype, 'formatDeviceName');

                view.formatRemoteResult(data);

                stub.calledWith(data).should.be.equal(true);
                stub.restore();
            });

            it('Checks remote results selection formatting', function () {
                var data = {
                    name: 'fakeName'
                }, result;

                result = view.formatRemoteResultSelection(data);

                result.should.be.equal('fakeName');
            });

            it('Checks policy position change handler', function () {
                var data = 'fakeData', stub;
                stub = sinon.stub(view, 'setPolicySequenceOrder');

                view.policyPositionChangeHandler(data);

                stub.called.should.be.equal(true);
                stub.restore();
            });

            it('Checks the list building', function () {
                // no UT.
                $.mockjax.clear();
                $.mockjax({
                    url: '/api/juniper/sd/policy-management/firewall/policies/0/item-selector/*',
                    type: 'POST',
                    responseText: {}
                });

                $.mockjax({
                    url: '/api/juniper/sd/policy-management/firewall/policies/0/item-selector/*',
                    type: 'DELETE',
                    responseText: {}
                });

                $.mockjax({
                    url: '/api/juniper/sd/policy-management/firewall/policies/0/item-selector/*',
                    type: 'GET',
                    responseText: {"devices": {"device": [
                        {"domain-id": 2, "device-type": "ROOT", "software-release": "12.3X48-D15.4", "device-name": "DC-SRX1400-1", "device-ip": "10.206.32.245", "serial-number": "BH3213AJ0049", "id": 491530, "name": "DC-SRX1400-1", "display-name": "DC-SRX1400-1", "connection-status": "down", "domain-name": "Global", "management-status": "MANAGED", "device-family": "junos-es", "platform": "SRX1400", "configuration-status": "In Sync", "cluster": false, "root-device-name": "DC-SRX1400-1", "lsys-count": 0, "uri": "/api/juniper/sd/policy-management/firewall/policies/0/item-selector/691041/available-devices/491530", "href": "/api/juniper/sd/device-management/devices/491530"},
                        {"domain-id": 2, "device-type": "ROOT", "software-release": "12.1X47-D10", "device-name": "scale-6133", "device-ip": "10.206.32.248", "serial-number": "JN11198B8AGB", "id": 491523, "name": "scale-6133", "display-name": "scale-6133", "connection-status": "down", "domain-name": "Global", "management-status": "MANAGED", "device-family": "junos-es", "platform": "SRX5600", "configuration-status": "In Sync", "cluster": false, "root-device-name": "scale-6133", "lsys-count": 0, "uri": "/api/juniper/sd/policy-management/firewall/policies/0/item-selector/691041/available-devices/491523", "href": "/api/juniper/sd/device-management/devices/491523"},
                        {"domain-id": 2, "device-type": "ROOT", "software-release": "12.1X47-D10.4", "device-name": "srx3400-mtc-1", "device-ip": "10.207.97.153", "serial-number": "1a078852bfda", "id": 131083, "name": "srx3400-mtc-1", "display-name": "srx3400-mtc-1", "connection-status": "up", "domain-name": "Global", "management-status": "MANAGED", "device-family": "junos-es", "platform": "FIREFLY-PERIMETER", "configuration-status": "In Sync", "cluster": false, "root-device-name": "srx3400-mtc-1", "lsys-count": 0, "uri": "/api/juniper/sd/policy-management/firewall/policies/0/item-selector/691041/available-devices/131083", "href": "/api/juniper/sd/device-management/devices/131083"}
                    ],
                        "uri": "/api/juniper/sd/policy-management/firewall/policies/0/item-selector/691041/available-devices",
                        "total": 3
                    }
                    }

                });

                var stub = sinon.spy(BaseListBuilder.prototype, 'build');

                view.addDevicesListBuilder();

                stub.called.should.be.equal(true);
                stub.args[0][0].call(view);

                stub.restore();

            });

            it('Checks if the form data is populated properly: Clone', function () {
                var stub = sinon.stub(view, 'setPolicySequenceOrder'), stub2;

                stub2 = sinon.stub(view, 'populateData')
                view.formMode = view.MODE_CLONE;

                view.populateFormData();

                stub.called.should.be.equal(true);
                (stub.args[0][0] === null).should.be.equal(true);
                (stub.args[0][1] === null).should.be.equal(true);

                stub.restore();
                stub2.called.should.be.equal(true);

                stub2.restore();
            });

            it('Checks if the form data is populated properly: Not Clone', function () {
                var stub = sinon.stub(view, 'setPolicySequenceOrder'), stub2;

                stub2 = sinon.stub(view, 'populateData');
                delete view.formMode;

                view.populateFormData();

                stub.called.should.be.equal(true);
                (stub.args[0][0] === policySeq).should.be.equal(true);
                (stub.args[0][1] === policyOrder).should.be.equal(true);

                stub.restore();
                stub2.called.should.be.equal(true);

                stub2.restore();
            });

            it('Checks radio button action: Policy Type', function () {
                var button = view.$el.find('input[type=radio][name=policy-type]'),
                    stub = sinon.stub(view, 'policyTypeChangeHandler');

                button.trigger('click');
                stub.called.should.be.equal(true);

                stub.restore();

            });

            it('Checks radio button action: Policy position', function () {
                var button = view.$el.find('input[type=radio][name=policy-position]'),
                    stub = sinon.stub(view, 'policyPositionChangeHandler');

                button.trigger('click');
                stub.called.should.be.equal(true);

                stub.restore();

            });

        });

        describe('Overlays', function () {
            it('Checks if the overlay is build properly', function () {
                var stub = sinon.stub(view.overlay, 'build');

                view.buildOverlay();

                stub.called.should.be.equal(true);

                stub.restore();
            });

            it('Checks if the overlay is closed properly', function () {
                var stub = sinon.stub(view, 'destroyOverlay');

                view.closeOverlay({
                    preventDefault: function () {
                    }
                });

                stub.called.should.be.equal(true);

                stub.restore();
            });

            it('Checks if the overlay is destroyed properly', function () {
                var stub = sinon.stub(view.devicesListBuilder, 'destroy'),
                    stub2 = sinon.stub(view.progressBar, 'destroy'),
                    stub3 = sinon.stub(view.activity.overlay, 'destroy');

                view.destroyOverlay();

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
            });
        });

        describe('ProgressBar', function () {
            it('Checks if the progress window is created properly', function () {
                view.showProgressWindow();

                view.cloneProgressBar.should.exist;
                view.cloneProgressBarOverlay.should.exist;
            });


            it('Checks if the progress update is handled properly: Success : 0', function (done) {
                $.mockjax.clear();
                var stub = sinon.stub(view.cloneProgressBar._progressBar, 'setProgressBar');

                $.mockjax({
                    url: view.policyManagementConstants.TASK_PROGRESS_URL + '*',
                    type: 'GET',
                    status: 200,
                    responseText: {
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.calledWith(0).should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });

                view.getProgressUpdate();
            });

            it('Checks if the progress update is handled properly: Success < 100', function (done) {
                $.mockjax.clear();
                var stub = sinon.stub(view.cloneProgressBar._progressBar, 'setProgressBar'),
                    stub2 = sinon.stub(view.cloneProgressBar._progressBar, 'setStatusText');

                $.mockjax({
                    url: view.policyManagementConstants.TASK_PROGRESS_URL + '*',
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 70,
                            'current-step': 'fakeStep'
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.calledWith(0.7).should.be.equal(true);
                        stub2.calledWith('fakeStep').should.be.equal(true);
                        done();
                        stub.restore();
                        stub2.restore();
                    }
                });

                view.getProgressUpdate();
            });


            it('Checks if the progress update is handled properly: Success = 100', function (done) {
                $.mockjax.clear();
                var stub = sinon.stub(view.cloneProgressBar._progressBar, 'hideTimeRemaining'),
                    stub2 = sinon.stub(view.cloneProgressBar._progressBar, 'setStatusText'),
                    stub3 = sinon.stub(view.cloneProgressBarOverlay, 'destroy'),
                    stub4 = sinon.stub(view, 'destroyOverlay'),
                    stub5 = sinon.stub(view, 'notify');

                $.mockjax({
                    url: view.policyManagementConstants.TASK_PROGRESS_URL + '*',
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'task-progress-response': {
                            'percentage-complete': 100
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        stub3.called.should.be.equal(true);
                        stub4.called.should.be.equal(true);
                        stub5.called.should.be.equal(true);
                        stub2.calledWith('Complete').should.be.equal(true);
                        stub5.args[0][0].should.be.equal('success');
                        done();
                        stub.restore();
                        stub2.restore();
                        stub3.restore();
                        stub4.restore();
                        stub5.restore();
                    }
                });

                view.getProgressUpdate();
            });

            it('Checks if the progress update is handled properly: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    url: view.policyManagementConstants.TASK_PROGRESS_URL + '*',
                    type: 'GET',
                    status: 404,
                    responseText: {
                    },
                    response: function (settings, done2) {
                        done2();
                        // nothing to test, no functionality defined
                        done();
                    }
                });

                view.screenId = '$fakeId';
                view.getProgressUpdate();
            });

        });

        describe('Devices', function () {

            it('Check if the devices without policies are hidden properly', function () {
                var stub = sinon.stub(view.devicesListBuilder, 'getAvailableUrlParameter', function () {
                        return {};
                    }),
                    stub2 = sinon.stub(view.devicesListBuilder, 'searchAvailableItems');

                view.$el.find("#showDevicesWithoutPolicy").attr("checked", true);
                view.showDevicesWithoutPolicy();
                stub2.called.should.be.equal(true);

                stub2.args[0][0]["hide-assigned-devices"].should.be.equal(true);

                stub2.restore();
                stub.restore();
            });

            it('Check if the devices without policies are shown properly', function () {
                var stub = sinon.stub(view.devicesListBuilder, 'getAvailableUrlParameter', function () {
                        return {};
                    }),
                    stub2 = sinon.stub(view.devicesListBuilder, 'searchAvailableItems');
                ;

                view.$el.find("#showDevicesWithoutPolicy").attr("checked", false);
                view.showDevicesWithoutPolicy();
                stub2.called.should.be.equal(true);

                stub2.args[0][0]["hide-assigned-devices"].should.be.equal(false);


                stub2.restore();
                stub.restore();
            });


            it('Checks if the assigning of devices to the policy is done properly: Policy Type: DEVICE', function () {
                var stub, stub2, stub3, stub4, stub5, handler;

                // no selections, devices
                stub = sinon.stub(view, 'destroyOverlay');

                view.assignDevices({'policy-type': 'DEVICE'}, 123);

                stub.called.should.be.equal(true);

                stub2 = sinon.stub(view.deviceDropDown, 'getValue', function () {
                    return 1234;
                });
                stub3 = sinon.stub(view, 'bindModelEvents');
                stub4 = sinon.stub(Backbone.Model.prototype, 'save');
                stub5 = sinon.stub(view, 'notify');

                view.assignDevices({'policy-type': 'DEVICE'}, 123);

                stub4.args[0][0]['add-list'].device[0].id.should.be.equal(1234);
                _.isEmpty(stub4.args[0][0]['delete-list']).should.be.equal(true);

                handler = stub4.args[0][1].success.call(view);
                stub.called.should.be.equal(true);

                handler = stub4.args[0][1].error.call(view);
                stub.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub5.args[0][0].should.be.equal('error');

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
            });

            it('Checks if the assigning of devices to the policy is done properly: Policy Type: Group', function () {
                // no selections, devices
                var stub = sinon.stub(view, 'destroyOverlay'),
                    stub2 = sinon.stub(view.devicesListBuilder.listBuilderModel, 'getSelectedAllIds'),
                    stub3 = sinon.stub(view.devicesListBuilder, 'getAllIds', function() {
                        return null;
                    });
                view.assignDevices({'policy-type': 'GROUP'}, 123);
                stub2.args[0][0].call(view);

                stub.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });


        });

    });

});



