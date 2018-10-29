define([
    '../basePoliciesActivity.js',
    '../../../../../fw-policy-management/js/firewall/policies/constants/fwPolicyManagementConstants.js',
    '../../../../../ui-common/js/gridActivity.js',
    '../../export/exportPolicyActivity.js',
    '../../assign-devices/assignDevicesActivity.js',
    '../../manage-version/manageVersionActivity.js',
    '../../compare-policy/comparePolicyActivity.js',
    '../../rulename-template/ruleNameTemplateBuilderActivity.js',
    '../../custom-column/customColumnBuilderActivity.js',
    '../../assign-devices/models/assignDevicesModel.js',
    '../views/basePolicyView.js'
], function (Activity, Constants, GridActivity, ExportActivity, AssignDevicesActivity, ManageVersionActivity, ComparePolicyActivity, RuleNameTemplateBuilderActivity, CustomColumnBuilderActivity, AssignDeviceModel, PoliciesView) {

    describe('Base Policy Activity UT', function () {
        var activity;

        describe('Object Creation', function () {

            after(function () {
                activity.context = new Slipstream.SDK.ActivityContext();
                activity.context.startActivity = function () {
                };

                activity.collection = {
                    get: function () {
                    },
                    getAllPolicyIds: function () {
                    }
                };

                activity.gridConfiguration = function () {
                    return {
                        getPolicyGridConfiguration: function () {
                            return {
                                footer: {}
                            }
                        }
                    }
                };
                activity.setContentView = function () {
                };

            });

            it('Checks if the activity object is created properly', function () {
                var modelStub = sinon.stub(Activity.prototype, 'getNewModelInstance');

                activity = new Activity({
                    policyManagementConstants: Constants
                });
                modelStub.restore();

                activity.events = {};

                activity.should.exist;
                activity.should.be.instanceof(GridActivity);
                activity.policyManagementConstants.should.exist;
            });

            it('Checks the capabilities are defined properly: create', function () {
                _.isEqual(activity.capabilities.create.rbacCapabilities, Constants.CREATE_CAPABILITY).should.be.equal(true);
            });

            it('Checks the capabilities are defined properly: edit', function () {
                _.isEqual(activity.capabilities.edit.rbacCapabilities, Constants.MODIFY_CAPABILITY).should.be.equal(true);
            });

            it('Checks the capabilities are defined properly: delete', function () {
                _.isEqual(activity.capabilities.delete.rbacCapabilities, Constants.DELETE_CAPABILITY).should.be.equal(true);
            });

            it('Checks the capabilities are defined properly: clone', function () {
                _.isEqual(activity.capabilities.clone.rbacCapabilities, Constants.CREATE_CAPABILITY).should.be.equal(true);
            });

            it('Checks the capabilities are defined properly: Assign to domain', function () {
                _.isEqual(activity.capabilities.assignToDomain.rbacCapabilities, Constants.ASSIGN_TO_DOMAIN_CAPABILITY).should.be.equal(true);
            });
        });

        describe('Events', function () {
            var eventStub, elBindSpy, constants;
            before(function () {
                constants = activity.policyManagementConstants;


                activity.view = {
                    $el: {
                        bind: function () {
                        }
                    }
                };
                eventStub = sinon.stub(GridActivity.prototype, 'bindEvents');
                elBindSpy = sinon.spy(activity.view.$el, 'bind');

                activity.bindEvents();
            });

            after(function () {
                eventStub.restore();
                elBindSpy.restore();
            });

            it('Check if the un-assign device event is bind properly', function () {
                activity.events.unassignDeviceEvent.name.should.be.equal(constants.UN_ASSIGN_DEVICE_EVENT);
                _.isEqual(activity.events.unassignDeviceEvent.capabilities, constants.ASSIGN_DEVICE_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith(constants.UN_ASSIGN_DEVICE_EVENT).should.be.equal(true);
            });

            it('Check if the assign device event is bind properly', function () {
                activity.events.assignDevicesEvent.name.should.be.equal(constants.ASSIGN_DEVICE_EVENT);
                _.isEqual(activity.events.assignDevicesEvent.capabilities, constants.ASSIGN_DEVICE_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith(constants.ASSIGN_DEVICE_EVENT).should.be.equal(true);
            });

            it('Check if the unlock policy event is bind properly', function () {
                activity.events.unlockPolicyEvent.name.should.be.equal('unlockPolicyEvent');
                _.isEqual(activity.events.unlockPolicyEvent.capabilities, constants.UNLOCK_POLICY_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith('unlockPolicyEvent').should.be.equal(true);
            });

            it('Check if the publish event is bind properly', function () {
                activity.events.publishEvent.name.should.be.equal('publishAction');
                _.isEqual(activity.events.publishEvent.capabilities, constants.PUBLISH_POLICY_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("publishAction").should.be.equal(true);
            });


            it('Check if the update event is bind properly', function () {
                activity.events.updatePolicyEvent.name.should.be.equal('updateAction');
                _.isEqual(activity.events.updatePolicyEvent.capabilities, constants.UPDATE_DEVICE_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("updateAction").should.be.equal(true);
            });


            it('Check if the compare event is bind properly', function () {
                activity.events.comparePolicyEvent.name.should.be.equal('comparePolicyEvent');
                _.isEqual(activity.events.comparePolicyEvent.capabilities, constants.MANAGE_POLICY_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("comparePolicyEvent").should.be.equal(true);
            });

            it('Check if the rollback event is bind properly', function () {
                activity.events.manageRollbackEvent.name.should.be.equal('manageRollbackEvent');
                _.isEqual(activity.events.manageRollbackEvent.capabilities, constants.MANAGE_POLICY_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("manageRollbackEvent").should.be.equal(true);
            });


            it('Check if the export policy event is bind properly', function () {
                activity.events.ruleNameTemplateBuilderEvent.name.should.be.equal('ruleNameTemplateBuilderAction');
                _.isEqual(activity.events.ruleNameTemplateBuilderEvent.capabilities, constants.RULE_NAME_TEMPLATE_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("ruleNameTemplateBuilderAction").should.be.equal(true);
            });


            it('Check if the custom column builder event is bind properly', function () {
                activity.events.customColumnBuilderEvent.name.should.be.equal('customColumnBuilderAction');
                _.isEqual(activity.events.customColumnBuilderEvent.capabilities, constants.CUSTOM_COLUMN_MANAGE_CAPABILITY).should.be.equal(true);

                elBindSpy.calledWith("customColumnBuilderAction").should.be.equal(true);
            });

        });

        describe('Event action:', function () {

            var rows = [
                {id: 123}
            ];
            beforeEach(function () {
                activity.view.gridWidget = {getSelectedRows: function () {
                    return rows;
                }};

            });

            it('Checks publish event', function () {
                var stub, stub2, selectedPolicies = 'fakeSelections', intent;

                stub = sinon.stub(activity, 'getSelectedPolicies', function () {
                    return selectedPolicies;
                });

                stub2 = sinon.stub(activity.context, 'startActivity');

                activity.onPublishEvent();

                stub.args[0][0][0].id.should.be.equal(123);
                stub2.called.should.be.equal(true);

                intent = stub2.args[0][0];
                intent.action.should.be.equal('slipstream.SDK.Intent.action.ACTION_PUBLISH');

                intent.extras.selectedPolicies.should.be.equal(selectedPolicies);
                intent.data['mime_type'].should.be.equal('vnd.juniper.net.service.fw.publish');

                stub.restore();

                stub2.restore();
            });

            it('Checks update event', function () {
                var stub, stub2, selectedPolicies = 'fakeSelections', intent;

                stub = sinon.stub(activity, 'getSelectedPolicies', function () {
                    return selectedPolicies;
                });

                stub2 = sinon.stub(activity.context, 'startActivity');

                activity.onUpdatePolicyEvent();

                stub.args[0][0][0].id.should.be.equal(123);
                stub2.called.should.be.equal(true);

                intent = stub2.args[0][0];
                intent.action.should.be.equal('slipstream.SDK.Intent.action.ACTION_UPDATE');

                intent.extras.selectedPolicies.should.be.equal(selectedPolicies);
                intent.data['mime_type'].should.be.equal(activity.policyManagementConstants.UPDATE_MIME_TYPE);

                stub.restore();

                stub2.restore();
            });


            it('Checks unlock policy event', function () {
                var stub, conf;

                stub = sinon.stub(activity, 'createConfirmationDialog');

                activity.onUnlockPolicyEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.kind.should.be.equal('warning');

                stub.restore();

            });

            it('Checks unassign device event', function () {
                var stub, conf;

                stub = sinon.stub(activity, 'createConfirmationDialog');

                activity.onUnassignDeviceEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.kind.should.be.equal('warning');

                stub.restore();

            });

            it('Checks if the export event action is defined properly', function () {


                var stub, conf, args = 'fakeArgs', selections = ['fakeSelection'];

                stub = sinon.stub(ExportActivity, 'exportPolicyOverlayLaunch');

                activity.view = {
                    gridWidget: {
                        getSelectedRows: function () {
                            return selections;
                        }
                    }
                };

                activity.onExportPolicyEvent(args);

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.params.selectedPolicies.should.be.equal(selections);
                conf.params.fileType.should.be.equal(args);
                conf.params.policyManagementConstants.should.be.equal(activity.policyManagementConstants);

                stub.restore();

            });

            it('Checks if the rule name builder template action is defined properly', function () {

                activity.getRuleNameTemplateJSON = function () {
                };
                activity.getRuleNameConstantStringLength = function () {
                };

                var stub, conf, selections = ['fakeSelection'], stub2, stub3;


                stub = sinon.stub(RuleNameTemplateBuilderActivity, 'launchOverlay');

                stub2 = sinon.stub(activity, 'getRuleNameTemplateJSON', function () {
                    return '"fakeString"';
                });


                stub3 = sinon.stub(activity, 'getRuleNameConstantStringLength', function () {
                    return 123;
                });


                activity.onRuleNameTemplateBuilderEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.activity.should.be.equal(activity);
                conf.params.serviceType.should.be.equal(activity.policyManagementConstants.SERVICE_TYPE);
                conf.params.url.should.be.equal(activity.policyManagementConstants.RULE_NAME_TEMPLATE_URL);
                conf.params.ruletemplateNames.should.be.equal('fakeString');
                conf.params.constantLength.should.be.equal(123);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });

            it('Checks if the custom column builder action is defined properly', function () {


                var stub, conf;

                stub = sinon.stub(CustomColumnBuilderActivity, 'launchOverlay');


                activity.onCustomColumnBuilderEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.activity.should.be.equal(activity);
                conf.params.url.should.be.equal(activity.policyManagementConstants.CUSTOM_COLUMN_URL);

                stub.restore();

            });

            it('Checks if the manage rollback action is defined properly', function () {

                var stub, conf, selections = ['fakeSelection'], stub2, stub3;


                stub = sinon.stub(ManageVersionActivity, 'launchOverlay');

                stub2 = sinon.stub(activity, 'getNewModelInstance', function () {
                    var fakeClass = function () {
                    };
                    return fakeClass;
                });


                stub3 = sinon.stub(activity.collection, 'get', function () {
                    return 'fakePolicy';
                });


                activity.onManageRollbackEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.activity.should.be.equal(activity);
                conf.policy.should.be.equal('fakePolicy');
                conf.params.id.should.be.equal(activity.view.gridWidget.getSelectedRows()[0].id);

                conf.params.selectedRow.should.be.equal(activity.view.gridWidget.getSelectedRows()[0]);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });

            it('Checks if the compare policy action is defined properly', function () {

                var stub, conf, selections = ['fakeSelection'], stub2, stub3;


                stub = sinon.stub(ComparePolicyActivity, 'launchOverlay');

                stub2 = sinon.stub(activity, 'getNewModelInstance', function () {
                    var fakeClass = function () {
                    };
                    return fakeClass;
                });


                stub3 = sinon.stub(activity.collection, 'get', function () {
                });


                activity.onComparePolicyEvent();

                stub.called.should.be.equal(true);

                conf = stub.args[0][0];
                conf.activity.should.be.equal(activity);
                conf.obj.should.be.equal(activity.view.gridWidget.getSelectedRows()[0]);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });

        });

        describe('Delete Objects', function () {

            it('Checks the delete object url', function () {

                var url, expectedUrl;

                expectedUrl = activity.policyManagementConstants.POLICY_URL + activity.policyManagementConstants.POLICY_DELETE;

                url = activity.getDeleteObjectsUrl();

                url.should.be.equal(expectedUrl);

            });

            it('Checks the delete object context type', function () {

                var data, expected;

                expected = activity.policyManagementConstants.POLICY_DELETE_CONTENT_TYPE;

                data = activity.getDeleteObjectContentType();

                data.should.be.equal(expected);

            });
            it('Checks delete object id list', function () {
                var list, data;

                list = [
                    {id: 123},
                    {id: 1234}
                ];

                data = activity.getDeleteIDListObject(list);

                _.isEqual(data['id-list']['ids'], list).should.be.equal(true);
            });
        });

        describe('Disable actions', function () {

            it('Checks if the edit action is disabled or not', function () {
                var returnVal, stub, stub2, stub3, stub4, stub5, list = [
                        {id: 123}
                    ],
                    isGroupSelected = true, isPredefinedSelected = true,
                    isDifferntDomain = true, isPolicyLocked = true;

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return [];
                });

                stub2 = sinon.stub(activity, 'isGroupSelected', function () {
                    return isGroupSelected;
                });

                stub3 = sinon.stub(activity, 'isPredefinedObject', function () {
                    return isPredefinedSelected;
                });

                stub4 = sinon.stub(activity, 'isDifferentDomain', function () {
                    return isDifferntDomain;
                });

                stub5 = sinon.stub(activity, 'isPolicyLocked', function () {
                    return isPolicyLocked;
                });

                // no rows
                returnVal = activity.isDisabledEdit();
                returnVal.should.be.equal(true);

                isGroupSelected = true;
                returnVal = activity.isDisabledEdit('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = true;
                returnVal = activity.isDisabledEdit('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = true;
                returnVal = activity.isDisabledEdit('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = true;
                returnVal = activity.isDisabledEdit('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = false;
                returnVal = activity.isDisabledEdit('', list);
                returnVal.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();

            });


            it('Checks if the assign to domain action is disabled or not', function () {
                var returnVal, stub, stub2, stub3, stub4, stub5, list = [
                        {id: 123}
                    ],
                    isGlobalSelected = true, isPredefinedSelected = true,
                    isDifferntDomain = true, isPolicyLocked = true;

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return [];
                });

                stub2 = sinon.stub(activity, 'isGlobalPolicy', function () {
                    return isGlobalSelected;
                });

                stub3 = sinon.stub(activity, 'isPredefinedObject', function () {
                    return isPredefinedSelected;
                });

                stub4 = sinon.stub(activity, 'isDifferentDomain', function () {
                    return isDifferntDomain;
                });

                stub5 = sinon.stub(activity, 'isPolicyLocked', function () {
                    return isPolicyLocked;
                });

                // no rows
                returnVal = activity.isDisabledAssignToDomain('', []);
                returnVal.should.be.equal(true);

                isGlobalSelected = true;
                isPredefinedSelected = false;
                returnVal = activity.isDisabledAssignToDomain('', list);
                returnVal.should.be.equal(true);

                isGlobalSelected = false;
                isPredefinedSelected = true;
                returnVal = activity.isDisabledAssignToDomain('', list);
                returnVal.should.be.equal(true);

                isGlobalSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = true;
                returnVal = activity.isDisabledAssignToDomain('', list);
                returnVal.should.be.equal(true);

                isGlobalSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = true;
                returnVal = activity.isDisabledAssignToDomain('', list);
                returnVal.should.be.equal(true);

                isGlobalSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = false;
                returnVal = activity.isDisabledAssignToDomain('', list);
                returnVal.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();

            });


            it('Checks if the delete action is disabled or not', function () {
                var returnVal, stub, stub2, stub3, stub4, stub5, stub6, list = [
                        {id: 123}
                    ],
                    isGlobalSelected = true, isPredefinedSelected = true,
                    isDifferntDomain = true, isPolicyLocked = true, isGroupSelected = true;

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return [];
                });

                stub2 = sinon.stub(activity, 'isGroupSelected', function () {
                    return isGroupSelected;
                });

                stub3 = sinon.stub(activity, 'isPredefinedObject', function () {
                    return isPredefinedSelected;
                });

                stub4 = sinon.stub(activity, 'isDifferentDomain', function () {
                    return isDifferntDomain;
                });

                stub5 = sinon.stub(activity, 'isPolicyLocked', function () {
                    return isPolicyLocked;
                });

                stub6 = sinon.stub(activity, 'isGlobalPolicy', function () {
                    return isGlobalSelected;
                });

                // no rows
                returnVal = activity.isDisabledDelete('', []);
                returnVal.should.be.equal(true);

                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = true;
                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = true;
                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = true;
                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = false;
                isGlobalSelected = true;
                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isPredefinedSelected = false;
                isDifferntDomain = false;
                isPolicyLocked = false;
                isGlobalSelected = false;
                returnVal = activity.isDisabledDelete('', list);
                returnVal.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();

            });


            it('Checks if the publish action is disabled or not', function () {
                var returnVal, stub, stub2, stub3, stub4, stub5, list = [
                        {id: 123}
                    ],
                    isDraftPolicy = false, isGroupSelected = false,
                    isDifferntDomain = false;

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return [];
                });

                stub2 = sinon.stub(activity, 'isDraftPolicy', function () {
                    return isDraftPolicy;
                });

                stub3 = sinon.stub(activity, 'isDifferentDomain', function () {
                    return isDifferntDomain;
                });

                stub4 = sinon.stub(activity, 'isGroupSelected', function () {
                    return isGroupSelected;
                });

                // no rows
                returnVal = activity.isDisabledPublishButton([]);
                returnVal.should.be.equal(true);


                isDraftPolicy = true;
                returnVal = activity.isDisabledPublishButton(list);
                returnVal.should.be.equal(true);

                isDraftPolicy = false;
                isGroupSelected = true;
                returnVal = activity.isDisabledPublishButton(list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isDifferntDomain = true;
                returnVal = activity.isDisabledPublishButton(list);
                returnVal.should.be.equal(true);

                isDifferntDomain = false;
                returnVal = activity.isDisabledPublishButton(list);
                returnVal.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

            });

            it('Checks if the update action is disabled or not', function () {
                var returnVal, stub, stub2, stub3, stub4, stub5, list = [
                        {id: 123}
                    ],
                    isDraftPolicy = false, isGroupSelected = false,
                    isDifferntDomain = false;

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return [];
                });

                stub2 = sinon.stub(activity, 'isDraftPolicy', function () {
                    return isDraftPolicy;
                });

                stub3 = sinon.stub(activity, 'isDifferentDomain', function () {
                    return isDifferntDomain;
                });

                stub4 = sinon.stub(activity, 'isGroupSelected', function () {
                    return isGroupSelected;
                });

                // no rows
                returnVal = activity.isDisabledUpdateButton([]);
                returnVal.should.be.equal(true);

                isDraftPolicy = true;
                returnVal = activity.isDisabledUpdateButton(list);
                returnVal.should.be.equal(true);

                isDraftPolicy = false;
                isGroupSelected = true;
                returnVal = activity.isDisabledUpdateButton(list);
                returnVal.should.be.equal(true);

                isGroupSelected = false;
                isDifferntDomain = true;
                returnVal = activity.isDisabledUpdateButton(list);
                returnVal.should.be.equal(true);

                isDifferntDomain = false;
                returnVal = activity.isDisabledUpdateButton(list);
                returnVal.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

            });

            it('Checks if the delete button is disabled or not', function () {
                var stub, selections = ['fakeSelections'];

                stub = sinon.stub(activity, 'isDisabledDelete');

                activity.isDisabledDeleteButton();
                stub.called.should.be.equal(false);

                activity.isDisabledDeleteButton(selections);
                stub.called.should.be.equal(true);
                (stub.args[0][0] === null).should.be.equal(true);
                _.isEqual(stub.args[0][1], selections).should.be.equal(true);

                stub.restore();

            });


            it('Checks if the edit button is disabled or not', function () {
                var stub, selections = ['fakeSelections'];

                stub = sinon.stub(activity, 'isDisabledEdit');


                activity.isDisabledEditButton(selections);
                stub.called.should.be.equal(true);
                (stub.args[0][0] === null).should.be.equal(true);
                _.isEqual(stub.args[0][1], selections).should.be.equal(true);


                stub.restore();
            });

        });

        describe('Policies/Selections', function () {

            it('Checks if the policy is from different domain', function () {


                var stub, val, isDifferentDomain, selections = [
                    {
                        isDifferentDomainPolicy: function () {
                            return isDifferentDomain;
                        }
                    }
                ];

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return selections;
                });

                isDifferentDomain = true;
                val = activity.isDifferentDomain(selections);
                val.should.be.equal(isDifferentDomain);

                isDifferentDomain = false;
                val = activity.isDifferentDomain(selections);
                val.should.be.equal(isDifferentDomain);

                stub.restore();
            });


            it('Checks if the policy is locked', function () {


                var stub, val, isPolicyLocked, selections = [
                    {
                        isPolicyLocked: function () {
                            return isPolicyLocked;
                        }
                    }
                ];

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return selections;
                });

                isPolicyLocked = true;
                val = activity.isPolicyLocked(selections);
                val.should.be.equal(isPolicyLocked);

                isPolicyLocked = false;
                val = activity.isPolicyLocked(selections);
                val.should.be.equal(isPolicyLocked);

                stub.restore();
            });


            it('Checks if the policy is in draft state', function () {


                var stub, val, isDraftPolicy, selections = [
                    {
                        isDraftPolicy: function () {
                            return isDraftPolicy;
                        }
                    }
                ];

                isDraftPolicy = true;
                val = activity.isDraftPolicy(selections);
                val.should.be.equal(isDraftPolicy);

                isDraftPolicy = false;
                val = activity.isDraftPolicy(selections);
                val.should.be.equal(isDraftPolicy);

            });

            it('Checks if the policy is global', function () {


                var stub, val, isGlobalPolicy, selections = [
                    {
                        isGlobalPolicy: function () {
                            return isGlobalPolicy;
                        }
                    }
                ];

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                });

                isGlobalPolicy = true;
                val = activity.isGlobalPolicy(selections);
                val.should.be.equal(isGlobalPolicy);

                isGlobalPolicy = false;
                val = activity.isGlobalPolicy(selections);
                val.should.be.equal(isGlobalPolicy);

                stub.restore();
            });

            it('Checks if the group is selected', function () {


                var stub, val, isGroupSelected, selections = [
                    {
                        isPredefinedGroupSelected: function () {
                            return isGroupSelected;
                        }
                    }
                ];

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                });

                isGroupSelected = true;
                val = activity.isGroupSelected([]);
                val.should.be.equal(false);

                isGroupSelected = false;
                val = activity.isGroupSelected(selections);
                val.should.be.equal(isGroupSelected);

                isGroupSelected = true;
                val = activity.isGroupSelected(selections);
                val.should.be.equal(isGroupSelected);

                stub.restore();
            });


            it('Checks if the clone is disabled', function () {


                var stub, val, isGlobalPolicy, selections = [];

                stub = sinon.stub(activity, 'getRecordsFromPolicyCollection', function () {
                    return selections;
                });

                val = activity.isDisabledClone('', []);
                val.should.be.equal(true);


                selections = [
                    {
                        isGlobalPolicy: function () {
                            return isGlobalPolicy;
                        }
                    }
                ];

                isGlobalPolicy = true;
                val = activity.isDisabledClone('', []);
                val.should.be.equal(isGlobalPolicy);


                isGlobalPolicy = false;
                val = activity.isDisabledClone('', []);
                val.should.be.equal(isGlobalPolicy);

                stub.restore();
            });

            it('Checks the button status', function () {
                var success, stub1, stub2, stub3, stub4,
                    editButtonStatus, deleteButtonStatus, publishButtonStatus, updateButtonStatus;

                stub1 = sinon.stub(activity, 'isDisabledEditButton', function () {
                    return editButtonStatus;
                });

                stub2 = sinon.stub(activity, 'isDisabledDeleteButton', function () {
                    return deleteButtonStatus;
                });

                stub3 = sinon.stub(activity, 'isDisabledPublishButton', function () {
                    return publishButtonStatus;
                });

                stub4 = sinon.stub(activity, 'isDisabledUpdateButton', function () {
                    return updateButtonStatus;
                });


                success = function (buttonStatus) {
                    buttonStatus.edit.should.be.equal(!editButtonStatus);
                    buttonStatus.delete.should.be.equal(!deleteButtonStatus);
                    buttonStatus.publishEvent.should.be.equal(!publishButtonStatus);
                    buttonStatus.updatePolicyEvent.should.be.equal(!updateButtonStatus);
                };

                editButtonStatus = true;
                deleteButtonStatus = true;
                publishButtonStatus = true;
                updateButtonStatus = true;

                activity.setButtonStatus({
                    selectedRows: ['fakeRows']
                }, success);


                editButtonStatus = false;
                deleteButtonStatus = false;
                publishButtonStatus = false;
                updateButtonStatus = false;

                activity.setButtonStatus({
                    selectedRows: ['fakeRows']
                }, success);


                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

            });

            it('Checks if the row ids are returned properly', function () {

                var stub, ids, fakeFunc;

                ids = [1, 123, 12345];

                stub = sinon.stub(activity.collection, 'getAllPolicyIds', function () {
                    return ids;
                });

                fakeFunc = function (args) {
                    _.isEqual(ids, args).should.be.equal(true);
                };
                activity.getRowIds(fakeFunc);

                stub.restore();
            });

            it('Checks if the records from policy collection is returned properly', function () {
                var records, stub, stub2, selections, data;

                records = activity.getRecordsFromPolicyCollection([]);

                records.length.should.be.equal(0);

                selections = [
                    { id: 123},
                    {id: 1234},
                    {id: 12345}
                ];


                stub = sinon.stub(activity, 'getSelectedPolicies', function () {
                    return selections;
                });

                stub2 = sinon.stub(activity.collection, 'get', function (id) {
                    if (id === 1234) {
                        return;
                    }
                    return selections;
                });

                records = activity.getRecordsFromPolicyCollection(selections);

                records.length.should.be.equal(2);


                stub.restore();
                stub2.restore();

            });

            it('Checks if the selected policies are returned properly', function () {
                var records, selections;

                records = activity.getSelectedPolicies([]);

                records.length.should.be.equal(0);

                selections = [
                    { id: 123},
                    {id: -1},
                    {id: 12345}
                ];


                records = activity.getSelectedPolicies(selections);

                records.length.should.be.equal(2);

            });
        });

        describe('Devices', function () {


            it('Check Assign device event', function () {
                var stub, stub2, stub3, stub4, handler, fakeModel;

                var fakeModel = {
                    set: function () {

                    },
                    fetch: function () {
                    }
                };

                stub = sinon.stub(activity, 'getNewModelInstance', function () {
                    return fakeModel;
                });

                stub2 = sinon.stub(AssignDevicesActivity, 'launchOverlay');
                stub3 = sinon.stub(activity.getNewModelInstance(), 'set');
                stub4 = sinon.spy(activity.getNewModelInstance(), 'fetch');

                activity.onAssignDevicesEvent();

                stub3.called.should.be.equal(true);
                stub3.args[0][0].should.be.equal('id');
                stub3.args[0][1].should.be.equal(activity.view.gridWidget.getSelectedRows()[0].id);

                stub4.called.should.be.equal(true);

                //check success
                handler = stub4.args[0][0].success;
                handler.call(activity);
                stub2.called.should.be.equal(true);
                stub2.args[0][0].activity.should.be.equal(activity);
                stub2.args[0][0].model.should.be.equal(fakeModel);
                stub2.args[0][0].policyManagementConstants.should.be.equal(activity.policyManagementConstants);

                //check success
                handler = stub4.args[0][0].success;
                handler.call(activity);
                stub2.called.should.be.equal(true);
                stub2.args[0][0].activity.should.be.equal(activity);
                stub2.args[0][0].model.should.be.equal(fakeModel);
                stub2.args[0][0].policyManagementConstants.should.be.equal(activity.policyManagementConstants);

                handler = stub4.args[0][0].error;
                handler.call(activity);
                // nothing to test, no functionalit defined

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

            });

            it('Checks unassign device action: success (Single device)', function (done) {

                var stub, stub2, response;

                response = {
                    'devices': {
                        'device': {
                            id: 789
                        }
                    }
                };

                stub = sinon.stub(activity, 'closeConfirmationDialog');
                stub2 = sinon.stub(activity, 'unassignDeviceCall');

                $.mockjax.clear();
                $.mockjax({
                    url: activity.policyManagementConstants.getDevicesForPolicyURLRoot(123),
                    responseText: response,
                    status: 200,
                    response: function (settings, done2) {

                        done2();
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        stub2.args[0][0].should.include('789');
                        stub2.args[0][1].should.be.equal(123);

                        done();

                        stub.restore();
                        stub2.restore();

                    }
                });

                activity.unassignDevice();
            });

            it('Checks unassign device action: success (Multiple devices)', function (done) {

                var stub, stub2, response;

                response = {
                    'devices': {
                        'device': [
                            {
                                id: 789
                            },
                            {
                                id: 6789
                            }
                        ]
                    }
                };

                stub = sinon.stub(activity, 'closeConfirmationDialog');
                stub2 = sinon.stub(activity, 'unassignDeviceCall');

                $.mockjax.clear();
                $.mockjax({
                    url: activity.policyManagementConstants.getDevicesForPolicyURLRoot(123),
                    responseText: response,
                    response: function (settings, done2) {

                        done2();
                        stub.called.should.be.equal(true);
                        stub2.called.should.be.equal(true);
                        stub2.args[0][0].should.include('789');
                        stub2.args[0][0].should.include('6789');
                        stub2.args[0][1].should.be.equal(123);

                        done();

                        stub.restore();
                        stub2.restore();

                    }
                });

                activity.unassignDevice();
            });

            it('Checks unassign device action: error', function (done) {

                var stub;

                stub = sinon.stub(activity, 'closeConfirmationDialog');

                $.mockjax.clear();
                $.mockjax({
                    url: activity.policyManagementConstants.getDevicesForPolicyURLRoot(123),
                    responseText: {},
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        // nothing to test, no functionality defined
                        stub.restore();

                        done();
                    }
                });

                activity.unassignDevice();

                stub.called.should.be.equal(true);

            });

            it('Checks unassign device success handler', function () {

                var stub, stub2, stub3, deviceList;
                deviceList = ['789', '6789'];

                stub = sinon.stub(AssignDeviceModel.prototype, 'initialize');
                stub2 = sinon.stub(Backbone.Model.prototype, 'save');

                activity.unassignDeviceCall(deviceList, 123);

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);

                stub.args[0][0].assignDevicesURLRoot.should.be.equal(activity.policyManagementConstants.getAssignDevicesURLRoot(123));
                stub.args[0][0].assignDevicesContentType.should.be.equal(activity.policyManagementConstants.POLICY_ASSIGN_DEV_CONTENT_HEADER);

                _.isEmpty(stub2.args[0][0]['add-list']).should.be.equal(true);
                stub2.args[0][0]['delete-list'].device.length.should.be.equal(deviceList.length);

                stub3 = sinon.spy(activity.progressBarOverlay, 'destroy');
                stub2.args[0][1].success.should.exist;
                stub2.args[0][1].success();
                stub3.called.should.be.equal(true);

                stub2.args[0][1].error.should.exist;
                stub2.args[0][1].error();
                stub3.calledTwice.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();


            });
        });


        describe('Views/Intents', function () {

            var selections = [
                {id: 123},
                {id: 1234},
                {id: 12345}
            ], obj = {
                _search: 'fakeSearch',
                objectId: 'fakeId',
                view: null,
                selectedRows: selections
            };

            before(function () {
                activity.intent = {
                    getExtras: function () {
                        return obj;
                    }
                };
            });

            it('Check if the polices view is called properly', function () {
                var stub;

                stub = sinon.stub(GridActivity.prototype, 'onListIntent');

                activity.launchPoliciesView(123);

                activity.filter.should.be.equal('id = 123');
                stub.called.should.be.equal(true);
                activity.searchPolicy.should.be.equal('fakeSearch');

                stub.restore();
            });

            it('Check if the extra params are returned properly', function () {

                var extras = activity.getExtraParams();
                extras.should.be.equal(obj);
            });

            it('Check if the list intent is called properly', function () {
                var stub;

                stub = sinon.stub(GridActivity.prototype, 'onListIntent');

                obj.view = null;
                activity.onListIntent();
                stub.called.should.be.equal(true);

                stub.restore();


                stub = sinon.stub(activity, 'launchRulesView');

                obj.view = 'rules';
                activity.onListIntent();
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('fakeId');

                stub.restore();


                stub = sinon.stub(activity, 'launchPoliciesView');

                obj.view = 'policies';
                activity.onListIntent();
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('fakeId');

                stub.restore();
            });

            it('Checks if the rules view is launched properly: error', function (done) {
                var policyObj = {
                    id: 123
                };

                $.mockjax.clear();

                $.mockjax({
                    url: activity.policyManagementConstants.POLICY_URL + 123,
                    type: 'GET',
                    status: 404,
                    responseText: {
                        'policy': policyObj
                    },
                    response: function (settings, done2) {
                        var stub = sinon.stub(activity.context, 'startActivity');
                        done2();

                        stub.called.should.be.equal(true);
                        stub.args[0][0].data['mime_type'].should.be.
                            equal(activity.policyManagementConstants.POLICY_MIME_TYPE);
                        stub.restore();
                    }
                });

                $.mockjax({
                    url: activity.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS,
                    type: 'GET',
                    status: 404,
                    responseText: {
                    },
                    response: function (settings, done2) {
                        done2();
                        done();
                    }
                });

                activity.launchRulesView(123);

            });

            it('Checks if the rules view is launched properly: success, custom column defined', function (done) {
                var policyObj = {
                    id: 123
                }, customColData = [
                    {name: 'data1'},
                    {name: 'data2'}
                ];

                $.mockjax.clear();

                $.mockjax({
                    url: activity.policyManagementConstants.POLICY_URL + 123,
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'policy': policyObj
                    },
                    response: function (settings, done2) {
                        done2();
                    }
                });

                $.mockjax({
                    url: activity.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS,
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'custom-columns': {
                            'custom-column': customColData
                        }
                    },
                    response: function (settings, done2) {
                        var stub;
                        stub = sinon.stub(activity, 'setContentView');
                        done2();
                        _.isEqual(activity.customColumns, customColData).should.be.equal(true);
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });

                activity.launchRulesView(123);

            });

            it('Checks if the rules view is launched properly: success, custom column not defined', function (done) {
                var policyObj = {
                    id: 123
                }, customColData = [
                    {name: 'data1'},
                    {name: 'data2'}
                ];

                $.mockjax.clear();

                $.mockjax({
                    url: activity.policyManagementConstants.POLICY_URL + 123,
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'policy': policyObj
                    },
                    response: function (settings, done2) {
                        done2();
                        done();
                    }
                });

                activity.policyManagementConstants.GET_ALL_CUSTOM_COLUMNS = undefined;

                activity.launchRulesView(123);

            });

            it('Check if the selected rows are returned properly', function () {
                var selected = activity.getSelectedRows();
                _.isEqual(selected, selections).should.be.equal(true);
            });

            it('Checks if the view is returned properly: if view not defined', function () {
                var view;

                view = activity.getView();

                view.should.exist;
                view.should.be.equal(activity.view);

            });


            it('Checks if the view is returned properly: if view not defined', function () {
                var stub, stub2, stub3, stub4, view, handler, length;

                activity.view = null;
                activity.policiesView = PoliciesView;

                stub = sinon.stub(activity, 'setContextMenuItemStatus');
                stub2 = sinon.stub(activity, 'addSelectAllCallback');
                stub3 = sinon.stub(activity, 'bindEvents');
                stub4 = sinon.stub(PoliciesView.prototype, 'initialize',
                    function () {
                        this.conf = arguments[0].conf;
                        handler = this.conf.footer.getTotalRows;
                    });

                view = activity.getView();

                view.should.exist;

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

                activity.collection.length = 0;
                length = handler.call(activity);
                length.should.be.equal(0);

                activity.collection.length = 4;

                length = handler.call(activity);
                length.should.be.equal(1);


            });

        });

        describe('Unlock action', function () {

            var rows = [
                {id: 123}
            ];
            before(function () {
                activity.view = {};
                activity.view.gridWidget = {getSelectedRows: function () {
                    return rows;
                }};

            });

            it('Checks if the unlock policy is called properly: Success', function (done) {

                var stub, stub2;
                stub = sinon.stub(activity, 'closeConfirmationDialog');

                $.mockjax.clear();
                $.mockjax({
                    type: 'POST',
                    url: activity.policyManagementConstants.POLICY_URL + "1234/unlock",
                    status: 200,
                    response: function (settings, done2) {
                        var spy = sinon.stub(activity.progressBarOverlay, 'destroy');
                        done2();
                        stub.called.should.be.equal(true);
                        spy.called.should.be.equal(true);
                        done();

                        stub.restore();
                        spy.restore();
                    }
                });

                activity.unlockPolicy(1234);
            });

            it('Checks if the unlock policy is called properly: Error', function (done) {

                var stub, stub2;
                stub = sinon.stub(activity, 'closeConfirmationDialog');

                $.mockjax.clear();
                $.mockjax({
                    type: 'POST',
                    url: activity.policyManagementConstants.POLICY_URL + "123/unlock",
                    status: 404,
                    response: function (settings, done2) {
                        var spy = sinon.stub(activity.progressBarOverlay, 'destroy');
                        done2();
                        stub.called.should.be.equal(true);
                        spy.called.should.be.equal(true);
                        done();

                        stub.restore();
                        spy.restore();
                    }
                });

                activity.unlockPolicy();
            });
        });

    });
});