/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
define([
    '../controller/baseRuleController.js',
    '../util/ruleGridConstants.js',
    '../util/lockManager.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
    'widgets/grid/gridWidget'
], function (Controller, Constants, LockManager, FwCollection, view, GridWidget) {


    describe('Base Rule Controller UT:', function () {

        var baseController, context,
            policy = {id: 123}, CUID = '', rulesView, domainPolicyStub, viewInitializeStub;

        before(function () {
            context = new Slipstream.SDK.ActivityContext();

            baseController = new Controller();
            baseController.ENABLE_LOCKING = true;
            baseController.setContext({
                policyObj: policy,
                context: context,
                cuid: CUID
            });

            baseController.activity = {};
            baseController.createRuleHandler = function () {
            };
            domainPolicyStub = sinon.stub(FwCollection.prototype, 'isSameDomainPolicy');
            viewInitializeStub = sinon.stub(view.prototype, 'initialize');


            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });
        });
        after(function () {

            domainPolicyStub.restore();
            viewInitializeStub.restore();
            $.mockjax.clear();
        });

        describe('Base Rule Controller basic test:', function () {
            var lockStub;
            before(function () {
                sinon.stub(baseController, 'bindModelEvents');
                sinon.stub(baseController, 'bindGridEvents');
                sinon.stub(baseController, 'reloadPage');
                lockStub = sinon.stub(LockManager.prototype, 'setup');
                sinon.stub(baseController, 'checkCopiedRules');
                sinon.stub(FwCollection.prototype, 'fetch');
            });

            after(function () {
                baseController.bindModelEvents.restore();
                baseController.bindGridEvents.restore();
                baseController.reloadPage.restore();
                lockStub.restore();
                baseController.checkCopiedRules.restore();
                FwCollection.prototype.fetch.restore();
            });


            it('Checks if the controller object is initialized properly (View, collection, constants are initialized properly)', function () {
                baseController.initialize(Constants, FwCollection, view);
                baseController.view.gridWidgetObject = {
                    getSelectedRows: function () {
                    }
                };
                baseController.ruleCollection.should.exist;
                baseController.view.should.exist;
                baseController.policyManagementConstants.should.exist;
            });


            it('Checks if the lock manager object is initialized properly with correct params', function () {
                baseController.lockManager.should.exist;
                lockStub.called.should.be.equal(true);
                var options = lockStub.args[0][0];
                options.policyManagementConstants.should.be.equal(baseController.policyManagementConstants);
                options.view.should.be.equal(baseController.view);
                options.cuid.should.be.equal(baseController.cuid);
            });

        });

        describe('Checks the basic functionality: ', function () {
            it('Check if the "checkCopiedRules" calls the collection properly', function () {
                var stub = sinon.stub(baseController.ruleCollection, 'checkCopiedRules');
                baseController.checkCopiedRules();
                stub.called.should.be.equal(true);
                stub.restore();
            });

            describe('Checks if the model events are bind properly: ', function () {
//                ).bind("closeRuleWizard",function(e, flag){
//                        self.overlay.destroy();
//                        self.reloadPage();
//                        return false;

                it('Check if on collection refresh-page event calls the controller functionality properly', function () {
                    var stub = sinon.stub(baseController, 'handleRefreshPage');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('refresh-page');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Check if on collection load-filtered event calls the controller functionality properly', function () {
                    var stub = sinon.stub(baseController, 'reloadPage');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('load-filtered');
                    stub.called.should.be.equal(true);
                    stub.args[0][0].should.be.equal(true);
                    stub.restore();
                });

                it('Check if on collection afterCreateRule event calls the controller functionality properly', function () {
                    var stub = sinon.stub(baseController, 'handleAfterCreateRule');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('afterCreateRule');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Check if on collection highlightRule event calls the controller functionality properly', function () {
                    var stub = sinon.stub(baseController, 'handleHighlightRow');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('highlightRule');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Check if on collection rule-collection-dirty event calls the controller functionality properly', function () {
                    var stub = sinon.stub(baseController, 'policyStatusMsgChangeHandler');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('rule-collection-dirty');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Check if on collection fetchComplete event calls the controller functionality properly', function () {

                    var stub = sinon.stub(baseController.ruleCollection, 'once'),
                        stub2 = sinon.stub(baseController, 'policyStatusMsgChangeHandler');
                    baseController.bindModelEvents();
                    stub.args[0][1].call(baseController);
                    stub2.called.should.be.equal(true);
                    stub.restore();
                    stub2.restore();
                });

                it('Check if on collection closeRuleWizard event calls the controller functionality properly', function () {
                    var stub, stub2;
                    stub = sinon.stub(baseController, 'reloadPage');
                    baseController.overlay = {
                        destroy: function () {
                        }
                    };
                    stub2 = sinon.stub(baseController.overlay, 'destroy');
                    baseController.bindModelEvents();
                    baseController.ruleCollection.trigger('closeRuleWizard');
                    stub.called.should.be.equal(true);
                    stub2.called.should.be.equal(true);
                    stub.restore();
                    stub2.restore();
                    baseController.overlay = null;
                });

                it('checks if the confirmation dialog widget event destroys the dialog properly on yes/no event', function () {

                    baseController.createConfirmationDialog({}, function () {
                    }, function () {
                    });
                    baseController.confirmationDialogWidget.vent.trigger('noEventTriggered');
                    $.isEmptyObject(baseController.confirmationDialogWidget).should.be.equal(true);

                    baseController.createConfirmationDialog({}, function () {
                    }, function () {
                    });
                    baseController.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                    $.isEmptyObject(baseController.confirmationDialogWidget).should.be.equal(true);
                });

                it('Checks if firing the grid activity events triggers correct event on the rule grid', function () {
                    var stub;
                    stub = sinon.stub(baseController.view.$el, 'triggerHandler');
                    baseController.fireGridActivityEvent();
                    stub.calledWith('rule-grid-activity-event').should.be.equal(true);
                    stub.restore();
                });


            });

            describe('Check create event handler', function () {


                var lockStub, createStub, handler;

                beforeEach(function () {
                    createStub = sinon.stub(baseController, 'createRuleHandler');
                    lockStub = sinon.stub(baseController.lockManager, 'lockPolicy');

                });

                afterEach(function () {
                    createStub.restore();
                    lockStub.restore();
                });


                it('Checks if the create handler is registered properly if create event is not defined', function () {
                    baseController.actionEvents = {
                    };
                    baseController.registerCreateEventHandler();
                    lockStub.called.should.be.equal(false);
                    createStub.called.should.be.equal(false);
                });

                it('Checks if the create handler is registered properly if create event is defined', function () {
                    baseController.actionEvents = {
                        createEvent: {
                            name: 'create'
                        }
                    }

                    $.isEmptyObject(baseController.lockManager.selfPolicyLockObject).should.be.equal(true);
                    baseController.registerCreateEventHandler();

                    baseController.view.$el.trigger('create');
                    createStub.called.should.be.equal(false);
                    lockStub.called.should.be.equal(true);
                });

                it('Checks if the create handler is registered properly if create event is defined, if lock is disabled', function () {
                    baseController.actionEvents = {
                        createEvent: {
                            name: 'create'
                        }
                    };

                    $.isEmptyObject(baseController.lockManager).should.be.equal(false);
                    baseController.ENABLE_LOCKING = false;
                    baseController.registerCreateEventHandler();

                    baseController.view.$el.trigger('create');
                    createStub.called.should.be.equal(true);
                    lockStub.called.should.be.equal(false);
                });

                it('Checks if the create handler is registered properly if create event is defined, if lock is enabled', function () {
                    baseController.actionEvents = {
                        createEvent: {
                            name: 'create'
                        }
                    };
                    $.isEmptyObject(baseController.lockManager).should.be.equal(false);
                    baseController.ENABLE_LOCKING = true;
                    $.isEmptyObject(baseController.lockManager.selfPolicyLockObject).should.be.equal(true);
                    baseController.registerCreateEventHandler();

                    baseController.view.$el.trigger('create');
                    createStub.called.should.be.equal(false);
                    lockStub.called.should.be.equal(true);
                });

                it('Checks if calloback is called properly if create event is defined, if lock is enabled (Status: success)', function () {
                    var handler, response = 'fakeResponse', status = 'success';
                    baseController.actionEvents = {
                        createEvent: {
                            name: 'create'
                        }
                    };
                    baseController.ENABLE_LOCKING = true;
                    lockStub.restore();

                    lockStub = sinon.stub(baseController.lockManager, 'lockPolicy', function (callback) {
                        handler = callback;
                    })

                    baseController.registerCreateEventHandler();

                    baseController.view.$el.trigger('create');
                    handler.call(baseController, response, status);
                    createStub.called.should.be.equal(true);
                });


                it('Checks if callback is called properly if create event is defined, if lock is enabled (Status: success)', function () {
                    var handler, response = 'fakeResponse', status = 'error', triggerStub;
                    baseController.actionEvents = {
                        createEvent: {
                            name: 'create'
                        }
                    };
                    baseController.ENABLE_LOCKING = true;
                    lockStub.restore();

                    lockStub = sinon.stub(baseController.lockManager, 'lockPolicy', function (callback) {
                        handler = callback;
                    })

                    baseController.registerCreateEventHandler();

                    baseController.view.$el.trigger('create');
                    triggerStub = sinon.stub(baseController.view.$el, 'trigger');

                    handler.call(baseController, response, status);
                    createStub.called.should.be.equal(false);
                    triggerStub.called.should.be.equal(true);
                    triggerStub.args[0][0].should.be.equal('policy-read-only-error');
                    triggerStub.restore();
                });


            });


            describe('Checks if the grid events are bind properly: ', function () {
                before(function () {
                    baseController.actionEvents = {
                        updatePublishedRules: {
                            name: 'updatepublished'
                        },

                        deleteEvent: {
                            name: 'delete'
                        },
                        publishRules: {
                            name: 'publish'
                        },
                        updateEvent: {
                            name: 'update'
                        },
                        expandAllRules: {
                            name: 'expandAllRules'
                        },
                        collapseAllRules: {
                            name: 'collapseAllRules'
                        },
                        saveRules: {
                            name: 'saveRules'
                        },

                        discardRules: {
                            name: 'discardRules'
                        },
                        expandAllRules: {
                            name: 'expandAllRules'
                        },
                        expandAllRules: {
                            name: 'expandAllRules'
                        }
                    }
                    baseController.bindGridEvents();
                });

                it('Checks if the delete event is registered properly', function () {
                    $.isEmptyObject(baseController.actionEvents.deleteEvent).should.be.equal(false);
                });


                it('Checks if the delete event callback is calls action on collection properly', function () {
                    var spy, handler, gridObject, stub, gridObject = {
                        deletedRows: [
                            {id: 123},
                            {id: 1234}
                        ]
                    };

                    spy = sinon.spy(baseController.view.$el, 'bind');
                    stub = sinon.stub(baseController.ruleCollection, 'deleteRule');
                    baseController.registerDeleteEventHandler();
                    handler = spy.args[0][1];

                    handler.call(baseController, 'delete', gridObject);
                    stub.called.should.be.equal(true);
                    stub.args[0][0].should.include(123);
                    stub.args[0][0].should.include(1234);

                    stub.restore();
                    spy.restore();
                });


                it('Checks if the publish event is registered properly', function () {
                    $.isEmptyObject(baseController.actionEvents.publishRules).should.be.equal(false);
                });


                it('Checks if the publish event callback is calls intent activity properly', function () {
                    var spy, handler, stub, intentHandler, triggerSpy;

                    spy = sinon.spy(baseController.view.$el, 'bind');
                    stub = sinon.stub(baseController.context, 'startActivityForResult');
                    baseController.registerPublishRuleHandler();
                    handler = spy.args[0][1];

                    handler.call(baseController);
                    stub.called.should.be.equal(true);


                    handler = stub.args[0][1];
                    triggerSpy = sinon.spy(baseController.view.$el, 'trigger');
                    handler.call(baseController, Slipstream.SDK.BaseActivity.RESULT_OK);
                    triggerSpy.args[0][0].should.be.equal('publish-policy');

                    triggerSpy.restore();
                    stub.restore();
                    spy.restore();
                });


                it('Checks if the update published event is registered properly', function () {
                    $.isEmptyObject(baseController.actionEvents.updatePublishedRules).should.be.equal(false);
                });

                it('Checks if the update published event callback is calls intent activity properly', function () {
                    var spy, handler, stub, intentHandler, triggerSpy;

                    spy = sinon.spy(baseController.view.$el, 'bind');
                    stub = sinon.stub(baseController.context, 'startActivityForResult');
                    baseController.registerPublishUpdateRuleHandler();
                    handler = spy.args[0][1];

                    handler.call(baseController);
                    stub.called.should.be.equal(true);


                    handler = stub.args[0][1];
                    triggerSpy = sinon.spy(baseController.view.$el, 'trigger');
                    handler.call(baseController, Slipstream.SDK.BaseActivity.RESULT_OK);
                    triggerSpy.args[0][0].should.be.equal('update-policy');

                    triggerSpy.restore();
                    stub.restore();
                    spy.restore();
                });


                it('Checks if the edit event is called properly', function () {
                    var stub = sinon.stub(baseController, 'editRuleHandler');
                    baseController.view.$el.trigger('update');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Checks if the expand all event is called properly', function () {
                    var stub = sinon.stub(baseController.ruleCollection, 'expandAllRules');
                    baseController.view.$el.trigger('expandAllRules');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Checks if the collapse all event is called properly', function () {
                    var stub = sinon.stub(baseController.ruleCollection, 'collapseAllRules');
                    baseController.view.$el.trigger('collapseAllRules');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Checks if the save rule event is called properly', function () {
                    var stub = sinon.stub(baseController, 'handleSaveButton');
                    baseController.view.$el.trigger('saveRules');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Checks if the discard rule event is called properly', function () {
                    var stub = sinon.stub(baseController, 'handleDiscardButton');
                    baseController.view.$el.trigger('discardRules');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Checks if the edit on grid rowis called properly', function () {
                    var stub = sinon.stub(baseController, 'handleRowDataEdit');
                    baseController.view.$el.trigger('gridRowOnEditMode');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });


                it('Checks if grid row selection event is bind properly, ', function () {
                    var selectedRows = [
                        {id: 123},
                        {id: 1234}
                    ], stub, stub2;
                    stub = sinon.stub(baseController, 'getSelectedRows', function () {
                        return selectedRows;
                    });
                    stub2 = sinon.stub(baseController.view, 'updateSelectionState');
                    baseController.view.$el.trigger('gridOnRowSelection');
                    stub2.called.should.be.equal(true);
                    stub2.calledWith(selectedRows).should.be.equal(true);

                    stub2.restore();
                    stub.restore();
                });

                it('Checks if the tree grid node expand callback called properly', function () {
                    var stub = sinon.stub(baseController, 'ruleGroupExpandCollapseHandler');
                    baseController.view.$el.trigger('treegridnodeexpand');
                    stub.called.should.be.equal(true);
                    stub.args[0][1].should.be.equal('expand');
                    stub.restore();
                });


                it('Checks if the policy modified callback called properly', function () {
                    var stub = sinon.stub(baseController, 'policyModifiedNotificationHandler');
                    baseController.view.$el.trigger('policy-modified');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Checks if the grid table empty notification reset collection state properly', function () {
                    baseController.view.$el.trigger('gridTableEmpty');
                    baseController.ruleCollection.resetCollection.should.be.equal(true);
                });

                it('Checks if the policy readonly callback called properly', function () {
                    var stub = sinon.stub(baseController, 'policyReadOnlyHandler');
                    baseController.view.$el.trigger('policy-read-only');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Checks if the policy reload page callback called properly', function () {
                    var stub = sinon.stub(baseController, 'reloadPage');
                    baseController.view.$el.trigger('reloadRuleGrid');
                    stub.called.should.be.equal(true);
                    stub.restore();
                });

                it('Checks if the gridOnPageRequest callback called the correct page properly', function () {
                    var stub = sinon.stub(baseController.ruleCollection, 'fetch'), page = 1, args;
                    baseController.view.$el.trigger('gridOnPageRequest', [
                        {pageRequest: page}
                    ]);
                    stub.called.should.be.equal(true);
                    args = stub.args[0][0];
                    args.rows.should.be.equal(baseController.policyManagementConstants.DEFAULT_PAGE_SIZE);
                    args.scrollForward.should.be.equal(true);
                    args.page.should.be.equal(page);
                    stub.restore();

                });

                it('Checks if the gridOnPageRequest callback returns if already scrolling', function () {
                    baseController.isScrolling = true;
                    baseController.pageRequested = 1;
                    var stub = sinon.stub(baseController.ruleCollection, 'fetch'), page = 1, args;
                    baseController.view.$el.trigger('gridOnPageRequest', [
                        {pageRequest: page}
                    ]);
                    stub.restore();

                });


                it('Checks if events are bind properly (Debug mode, no callback defined), ', function () {
                    var stub = sinon.stub(baseController.ruleCollection, 'get', function () {
                        return {
                            toJSON: function () {
                            }
                        };
                    });
                    baseController.view.gridWidgetObject = {
                        getViewportRows: function () {
                        },

                        getScrollPosition: function () {
                            return 123;
                        }
                    }


                    baseController.view.$el.trigger('gridViewPort');
                    baseController.view.$el.trigger('gridCollection');
                    baseController.view.$el.trigger('gridRule', [
                        {selectedRows: [
                            {id: 123}
                        ]}
                    ]);
                    baseController.view.$el.trigger('logScrollPosition');
                    baseController.view.$el.trigger('collectionRule', [
                        {selectedRowIds: [123, 1234]}
                    ]);
                    baseController.editRuleHandler();
                    stub.restore();
                });


            });

            describe ('Selections: ', function() {
                it('Checks the deselecting of rules: Selected rules defined', function () {
                    var selectedRules = [
                        {id: 123},
                        {id: 1234}
                    ], stub, ruleIds = [1, 123], stub2;
                    stub = sinon.stub(baseController, 'getSelectedRows', function () {
                        return selectedRules;
                    });

                    stub2 = sinon.stub(baseController, 'toggleSelections');

                    baseController.deSelectRules(ruleIds);
                    stub2.calledWith(_.intersection(ruleIds, _.pluck(selectedRules, 'id'))).should.be.equal(true);

                    stub.restore();
                    stub2.restore();
                });

                it('Checks the deselecting of rules: Selected rules not defined', function () {
                    var stub, ruleIds = [1, 123], stub2;
                    stub = sinon.stub(baseController, 'getSelectedRows', function () {
                        return null;
                    });

                    stub2 = sinon.stub(baseController, 'toggleSelections');

                    baseController.deSelectRules(ruleIds);
                    stub2.calledWith(_.intersection(ruleIds, [])).should.be.equal(true);

                    stub.restore();
                    stub2.restore();
                });

                it('Checks the handleBeforePolicySave calls collection and view loading events properly', function () {
                    var stub, ruleIds = [1, 123];
                    stub = sinon.stub(baseController.ruleCollection, 'setSavePolicyInProgress');
                    baseController.handleBeforePolicySave();
                    stub.calledWith(true).should.be.equal(true);
                    stub.restore();
                });

                it('Checks if the grid table is called with clear data on calling empty rule grid', function () {
                    var stub, key;
                    stub = sinon.stub(baseController.view, 'getGridTable', function () {
                        var returnObj = [{
                            grid: {
                                bDiv: {
                                    scrollTop : 100
                                }
                            }
                        }];
                        returnObj.jqGrid= function (params) {
                            key = params;
                        };

                        return returnObj;
                    });
                    baseController.emptyGridRows();
                    stub.called.should.be.equal(true);
                    key.should.be.equal('clearGridData');
                    stub.restore();
                });

                it('Check if on getSelectedRows return rows from gridobject', function () {
                    var results, stub, selectedRows = [
                        {id: 123}
                    ];

                    baseController.view.gridWidgetObject = {
                        getSelectedRows: function () {
                        }
                    };

                    stub = sinon.stub(baseController.view.gridWidgetObject, 'getSelectedRows', function () {
                        return selectedRows;
                    });

                    results = baseController.getSelectedRows();
                    results.should.be.equal(selectedRows);

                    stub.restore();
                });


                it('Check if collapseRuleGroup is called properly', function () {
                    var stub = sinon.stub(baseController, 'ruleGroupExpandCollapseHandler'), rule = {id: 123};
                    baseController.collapseRuleGroup(null, rule);
                    stub.calledWith(rule).should.be.equal(true);
                    stub.args[0][1].should.be.equal('collapse');

                    stub.restore();
                });


                it('Check if set policy read only is called properly', function () {
                    var stub = sinon.stub(baseController.ruleCollection, 'setPolicyReadOnly'), isPolicyReadOnly = true, stub2;

                    stub2 = sinon.stub(baseController.view.$el, 'trigger');
                    baseController.policyReadOnlyHandler(isPolicyReadOnly);
                    stub.calledWith(isPolicyReadOnly).should.be.equal(true);
                    stub2.calledWith('policy-status-msg-change').should.be.equal(true);

                    stub.restore();
                    stub2.restore();
                });

            });
        });


        describe('Check buttons action: ', function () {
            it('Check if concurrent edit passes gracefully if locking is enabled', function () {
                baseController.ENABLE_LOCKING = true;
                var stub = sinon.stub(baseController, 'createConfirmationDialog');

                baseController.handleConcurrentEdit();
                stub.called.should.be.equal(false);

                stub.restore();
            });


            it('Check if concurrent edit throws the error properly if locking is disabled', function () {
                baseController.ENABLE_LOCKING = false;
                var stub = sinon.stub(baseController, 'createConfirmationDialog'), conf;

                baseController.handleConcurrentEdit();
                stub.called.should.be.equal(true);
                conf = stub.args[0][0];
                conf.kind.should.be.equal('warning');

                stub.restore();

            });


            it('Check if discard button click throws the error properly', function () {
                var stub = sinon.stub(baseController, 'createConfirmationDialog'), conf;
                baseController.handleDiscardButton();
                stub.called.should.be.equal(true);
                conf = stub.args[0][0];
                conf.kind.should.be.equal('warning');

                stub.restore();

            });


            it('Check if save policy is not called if the rule collection is not dirty', function () {

                var stub = sinon.stub(baseController.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                }), stub2;
                stub2 = sinon.stub(baseController.ruleCollection, 'savePolicy');
                baseController.handleSaveButton();
                stub2.called.should.be.equal(false);

                stub.restore();
                stub2.restore();

            });

            it('Check if save policy is called if the rule collection is dirty  and save comments are disabled', function () {

                var stub = sinon.stub(baseController.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                }), stub2, stub3;
                stub2 = sinon.stub(baseController.ruleCollection, 'savePolicy');
                stub3 = sinon.stub(baseController.ruleCollection, 'isSaveCommentsEnabled', function () {
                    return false;
                });
                baseController.handleSaveButton();
                stub2.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });


            it('Check if save policy overlay is shown if the rule collection is dirty  and save comments are enabled', function () {

                var stub = sinon.stub(baseController.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                }), stub2, stub3;
                stub2 = sinon.stub(baseController.ruleCollection, 'savePolicy');
                stub3 = sinon.stub(baseController.ruleCollection, 'isSaveCommentsEnabled', function () {
                    return true;
                });
                baseController.handleSaveButton();
                stub2.called.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });

            it('Handles callback on Error dialog NO button', function () {
                var handler, stub, stub2, policy = {'edit-version': 1234, id: 123},
                    stub3 = sinon.stub(baseController.view.$el, 'trigger');
                stub = sinon.stub(baseController.ruleCollection, 'resetStore');
                stub2 = sinon.stub(baseController.ruleCollection, 'trigger');
                baseController.saveAsPolicyNoButtonCallback(policy);
                stub.called.should.be.equal(true);
                handler = stub.args[0][0];
                handler.call(baseController);
                baseController.ruleCollection.policy.id.should.be.equal(policy.id);
                stub2.called.should.be.equal(true);
                stub2.calledWith('refresh-page').should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });


            it('Checks if the store reset is called on yes button action of discard rules', function () {
                baseController.ENABLE_LOCKING = true;
                var stub = sinon.stub(baseController, 'removeAllSelections'),
                    stub2 = sinon.stub(baseController.ruleCollection, 'resetStore'), handler,
                    stub3 = sinon.stub(baseController, 'afterResetStoreOnDiscard');
                baseController.discardPolicyYesButtonCallback();
                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                handler = stub2.args[0][0];
                handler.call(baseController);
                stub3.called.should.be.equal(true);
                stub.restore();
                stub2.restore();
                stub3.restore();

            });

            it('Checks if the discard on store refreshes view and collection- correct notifications are triggered', function () {
                var stub1, stub2, stub3, stub4, stub5, stub6;
                stub1 = sinon.stub(baseController, 'removeAllSelections');
                stub2 = sinon.stub(baseController.view.$el, 'trigger');
                stub3 = sinon.stub(baseController, 'policyStatusMsgChangeHandler');
                stub4 = sinon.stub(baseController.ruleCollection, 'trigger');
                stub5 = sinon.stub(baseController.ruleCollection, 'once');
                stub6 = sinon.stub(baseController.ruleCollection, 'handleFilter');
                baseController.view.filterApplied = 'dummyFilter';

                baseController.afterResetStoreOnDiscard();
                stub1.called.should.be.equal(true);
                stub2.calledWith('after-discard-policy').should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.calledWith('refresh-page').should.be.equal(true);

                // check if the filter is applied on it
                stub5.called.should.be.equal(true);
                stub5.args[0][0].should.be.equal('fetchComplete');
                stub5.args[0][1]();
                stub6.called.should.be.equal(true);
                stub6.args[0][0].should.be.equal(baseController.view.filterApplied);


                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();

            });

            it('Checks with expand and collapse rule group is called properly on the collection', function () {
                var stub = sinon.stub(baseController.ruleCollection, 'expandCollapseRuleGroup');
                baseController.ruleGroupExpandCollapseHandler();
                stub.called.should.be.equal(true);
                stub.restore();
            });


            it('Checks if after creation on rule, row is highlighted with correct data', function () {
                var stub, stub2, stub3, data = {isRowEditable: true,
                    rowData: {
                        "rule-row-info": {
                            rowId: 123}}};

                stub = sinon.stub(baseController, 'handleRuleGridLoadComplete');
                stub2 = sinon.stub(baseController, 'handleHighlightRow');
                stub3 = sinon.stub(baseController, 'policyStatusMsgChangeHandler');

                baseController.handleAfterCreateRule(data);
                stub.called.should.be.equal(true);
                stub.args[0][0]['editRuleId'].should.be.equal(123);
                stub2.calledWith(data).should.be.equal(true);
                stub3.called.should.be.equal(true);
                data = {};
                stub.restore();
                stub = sinon.stub(baseController, 'handleRuleGridLoadComplete');

                baseController.handleAfterCreateRule(data);
                stub.called.should.be.equal(false);


                stub.restore();
                stub2.restore();
                stub3.restore();
            });

            it('Checks if the row is highlighted properly and the collection parameters are correct', function () {
                var stub, stub2, data, totalCount = 100, pageNumber = 2, rowNumber = 51;
                data = {
                    rowData: {
                        "rule-row-info": {
                            totalCount: totalCount,
                            pageNumber: pageNumber,
                            rowNumber: rowNumber
                        }
                    },
                    ruleIds: [1, 12, 123, 1234],
                    isRowEditable: true
                };

                stub = sinon.stub(baseController.ruleCollection, 'fetch');

                stub2 = sinon.stub(baseController, 'getViewPortPageNumbers', function () {
                });
                baseController.handleHighlightRow(data);
                stub.called.should.be.equal(true);
                stub.args[0][0].reset.should.be.equal(true);
                stub.args[0][0].noSpinner.should.be.equal(false);
                stub.args[0][0].rowNumber.should.be.equal(rowNumber);
                stub.args[0][0].rowPageNumber.should.be.equal(pageNumber);
                stub.args[0][0].isRowEditable.should.be.equal(data.isRowEditable);
                stub.args[0][0].highLightRowsCount.should.be.equal(data.ruleIds.length);
                stub.args[0][0].rows.should.be.equal(baseController.policyManagementConstants.DEFAULT_PAGE_SIZE);
                stub.args[0][0].changeViewport.should.be.equal(false);
                stub.args[0][0].page.should.be.equal(pageNumber);

                stub2.restore();

                stub2 = sinon.stub(baseController, 'getViewPortPageNumbers', function () {
                });


                var stub3 = sinon.stub(baseController.view.$el, 'find', function() {
                    return [{id: 123}, {id: 1234}]
                }), stub4 = sinon.stub(baseController.ruleCollection, 'get', function() {
                    return {
                        get: function() {
                            return 123;
                        }
                    }
                });

                baseController.handleHighlightRow(data);
                stub.args[1][0].page.should.be.equal(2);
                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
            });

            it('Checks if the row is highlighted properly and the collection parameters are correct if the navigation is from Block Application', function () {
                var stub, stub2, data, totalCount = 100, pageNumber = 2, rowNumber = 51;
                data = {
                    rowData: {
                        "rule-row-info": {
                            totalCount: totalCount,
                            pageNumber: pageNumber,
                            rowNumber: rowNumber
                        }
                    },
                    ruleIds: [1, 12, 123, 1234],
                    isRowEditable: true,
                    onNavigation: true
                };

                stub = sinon.stub(baseController.ruleCollection, 'fetch');

                stub2 = sinon.stub(baseController, 'getViewPortPageNumbers', function () {
                });
                baseController.handleHighlightRow(data);
                stub.called.should.be.equal(true);
                stub.args[0][0].reset.should.be.equal(true);
                stub.args[0][0].noSpinner.should.be.equal(false);
                stub.args[0][0].rowNumber.should.be.equal(rowNumber);
                stub.args[0][0].rowPageNumber.should.be.equal(pageNumber);
                stub.args[0][0].isRowEditable.should.be.equal(data.isRowEditable);
                stub.args[0][0].highLightRowsCount.should.be.equal(data.ruleIds.length);
                stub.args[0][0].rows.should.be.equal(baseController.policyManagementConstants.DEFAULT_PAGE_SIZE);
                stub.args[0][0].changeViewport.should.be.equal(true);
                stub.args[0][0].page.should.be.equal(pageNumber);

                stub2.restore();

                stub2 = sinon.stub(baseController, 'getViewPortPageNumbers', function () {
                });


                var stub3 = sinon.stub(baseController.view.$el, 'find', function() {
                    return [{id: 123}, {id: 1234}]
                }), stub4 = sinon.stub(baseController.ruleCollection, 'get', function() {
                    return {
                        get: function() {
                            return 123;
                        }
                    }
                });

                baseController.handleHighlightRow(data);
                stub.args[1][0].page.should.be.equal(2);
                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
            });


        });

        describe('Check policy modified actions:', function () {

            it('Checks if the policy modified notification is triggered properly', function () {
                var stub1 = sinon.stub(baseController.ruleCollection, 'isSavePolicyInProgress', function () {
                    return false;
                }), stub2 = sinon.stub(baseController, 'triggerPolicyModifiedHandler');

                baseController.policyModifiedNotificationHandler();
                stub2.called.should.be.equal(true);
                stub1.restore();
                stub2.restore();
            });

            it('Checks if the policy modified notification is triggered properly : Delay if policy is in save progress', function () {
                var stub1 = sinon.stub(baseController.ruleCollection, 'isSavePolicyInProgress', function () {
                    return true;
                }), stub2 = sinon.stub(_, 'delay');

                baseController.policyModifiedNotificationHandler();
                stub2.called.should.be.equal(true);
                stub1.restore();
                stub2.restore();
            });
            it('Checks if the policy object is returned properly', function () {
                var policy, policyObj = {id: 123};
                policy = baseController.getPolicyObject();
                (policy === undefined).should.be.equal(true);
                policy = baseController.getPolicyObject({policy: policyObj});
                policy.should.be.equal(policyObj);

            });

            it('Checks if the policy modified handler get the correct policy from the collection ', function () {
                var stub1, stub2, stub3, handler, policyObj = {id: 123};

                stub1 = sinon.stub(baseController.ruleCollection, 'getPolicy');
                baseController.triggerPolicyModifiedHandler();
                handler = stub1.args[0][0];
                stub2 = sinon.stub(baseController, 'policyModifiedHandler');
                stub3 = sinon.stub(baseController, 'policyStatusMsgChangeHandler');
                handler.call(baseController, {policy: policyObj});
                stub2.calledWith(policyObj).should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub1.restore();
                stub2.restore();
                stub3.restore();

            });
            it('Checks if the policy deleted dialog is shown if the policy modification notification is sent on the null object', function () {
                var spy, params;
                baseController.view.context = baseController.context;
                spy = sinon.spy(baseController, 'createConfirmationDialog');
                baseController.policyModifiedHandler();
                spy.called.should.be.equal(true);
                params = spy.args[0][0];
                params.kind.should.be.equal('error');
                spy.restore();
            });

            it('Checks if the user is directed to Policy page in case the policy deleted notification received', function () {
                var stub, action;
                baseController.policyManagementConstants.POLICY_MIME_TYPE = 'FAKE_MIME';
                stub = sinon.stub(baseController.view.context, 'startActivityForResult');
                baseController.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                stub.called.should.be.equal(true);
                action = stub.args[0][0]['data']['mime_type'];
                action.should.be.equal(baseController.policyManagementConstants.POLICY_MIME_TYPE);
                stub.restore();

            });

            it('Checks that lock manager handles the notification of policy modified if lock is enabled', function () {
                var stub = sinon.stub(baseController.lockManager, 'policyModifiedHandler');
                baseController.ENABLE_LOCKING = true;
                baseController.policyModifiedHandler({});
                stub.called.should.be.equal(true);
                stub.restore();
            });
            it('Checks if the concurrent edit pop up is shown in case the rule collection is dirty if the policy modified notification recieved when locking is disabled', function () {

                var stub = sinon.stub(baseController, 'handleConcurrentEdit'), policy = {'edit-version': 123}, stub2;
                stub2 = sinon.stub(baseController.view.$el, 'trigger');
                baseController.ENABLE_LOCKING = false;
                baseController.ruleCollection.isDirty = true;
                baseController.policyModifiedHandler(policy);
                stub.called.should.be.equal(true);
                stub.calledWith(policy).should.be.equal(true);
                stub.restore();
                stub2.calledWith('close-overlays').should.be.equal(true);
                stub2.restore();
            });

            it('Checks if the error pop up is shown in case the rule collection is not dirty if the policy modified notification recieved when locking is disabled (to reload the policy)', function () {

                var stub = sinon.spy(baseController, 'createConfirmationDialog'), policy = {'edit-version': 123, id: 123},
                    stub2 = sinon.stub(baseController.view.$el, 'trigger');
                baseController.ENABLE_LOCKING = false;
                baseController.ruleCollection.isDirty = false;
                baseController.policyModifiedHandler(policy);
                stub.called.should.be.equal(true);
                stub.args[0][0].kind.should.be.equal('warning');
                stub.restore();
                stub2.restore()
            });

            it('Check if the reload rules are done in case the user click on confirmation of error dialog when policy is modified', function () {
                var handler, stub, stub2, policy = {'edit-version': 123, id: 123},
                    stub3 = sinon.stub(baseController.view.$el, 'trigger');
                ;
                stub = sinon.stub(baseController.ruleCollection, 'resetStore');
                stub2 = sinon.stub(baseController.ruleCollection, 'trigger');
                baseController.confirmationDialogWidget.vent.trigger('yesEventTriggered');
                stub.called.should.be.equal(true);
                handler = stub.args[0][0];
                handler.call(baseController);
                baseController.ruleCollection.policy.id.should.be.equal(policy.id);
                stub2.called.should.be.equal(true);
                stub2.calledWith('refresh-page').should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });
        });

        describe('Check overlay actions', function () {
            it('Checks if the overlays are closed proeprly and it call close on views as well', function () {
                var count = 0, closeHandler = function () {
                    count++;
                };
                baseController.overlay = {
                    destroy: function () {

                    }
                };
                baseController.view.cellOverlayViews = [
                    {
                        options: {
                            close: closeHandler
                        }
                    },
                    {
                        options: {
                            close: closeHandler
                        }
                    }
                ];
                baseController.closeOverlays();
                count.should.be.equal(baseController.view.cellOverlayViews.length);
            });

            it('Checks if the confirmation dialogs are created properly', function () {
                baseController.createConfirmationDialog();
            });
        });


        describe('Check Policy Status Message:', function () {

            it('Checks if the policy edit message is called properly with locking enabled', function () {
                var stub = sinon.stub(baseController.lockManager, 'policyStatusMessageGenerator');
                baseController.ENABLE_LOCKING = true;
                baseController.policyStatusMsgChangeHandler();
                stub.called.should.be.equal(true);
                stub.restore();
            });


            it('Checks if the policy edit message is called properly with locking disabled', function () {
                var stub = sinon.stub(baseController, 'policyStatusMessageGenerator');
                baseController.ENABLE_LOCKING = false;
                baseController.policyStatusMsgChangeHandler();
                stub.called.should.be.equal(true);
                stub.restore();
            });

            it('Checks if the permissions/capability are properly defined', function () {
                if (!Slipstream.SDK.RBACResolver) {
                    Slipstream.SDK.RBACResolver = function () {
                    };
                    Slipstream.SDK.RBACResolver.prototype.verifyAccess = function () {
                    };
                }

                var spy = sinon.spy(Slipstream.SDK.RBACResolver.prototype, 'verifyAccess');
                baseController.checkPermission('abc');
                spy.called.should.be.equal(true);

                spy.restore();
            });

            it('Check if the correct policy save message is set', function () {
                var stub, stub2;

                stub = sinon.stub(baseController.ruleCollection, 'getPolicyEditMessage');
                if (!Slipstream.SDK.AuthenticationResolver) {
                    Slipstream.SDK.AuthenticationResolver = function () {
                    };
                    Slipstream.SDK.AuthenticationResolver.prototype.getUserName = function () {
                    };
                }
                stub2 = sinon.stub(Slipstream.SDK.AuthenticationResolver.prototype, 'getUserName', function () {
                    return 'fakeUser2';
                });

                baseController.policyStatusMessageGenerator();

                baseController.policyStatusMessageGenerator('fakeUser', true);
                stub2.restore();

                stub2 = sinon.stub(Slipstream.SDK.AuthenticationResolver.prototype, 'getUserName', function () {
                    return 'fakeUser';
                });
                baseController.policyStatusMessageGenerator('fakeUser', true);

                stub.restore();
                stub2.restore();
            });

        });

        describe('Check rules, page, selections', function () {

            it('Check if the remove selection gracefully returns if the array is empty', function () {
                var stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [];
                });
                var stub2 = sinon.stub(baseController, 'toggleSelections');
                baseController.removeAllSelections();
                stub2.called.should.be.equal(false);

                stub.restore();
                stub2.restore();

            });

            it('Check if the remove selection calls toggle on selection returns if the array is not empty', function () {
                var stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [
                        {id: 123},
                        {id: 1234}
                    ];
                });
                var stub2 = sinon.stub(baseController, 'toggleSelections');
                baseController.removeAllSelections();
                stub2.called.should.be.equal(true);
                stub2.args[0][1].should.be.equal('unselected');
                stub2.args[0][0].should.include(123);
                stub2.args[0][0].should.include(1234);

                stub.restore();
                stub2.restore();

            });

            it('Check if the remove selection on view gracefully returns if the array is empty', function () {
                baseController.view.gridWidgetObject = {
                    toggleRowSelection: function () {
                    }
                };
                var stub2 = sinon.stub(baseController.view.gridWidgetObject, 'toggleRowSelection');
                baseController.toggleSelections();
                stub2.called.should.be.equal(false);
                stub2.restore();

            });

            it('Check if the remove selection calls toggle on selection returns if the array is not empty', function () {
                var stub2 = sinon.stub(baseController.view.gridWidgetObject, 'toggleRowSelection'), selection = [123, 1234], status = 'toggle';
                baseController.toggleSelections(selection, status);
                stub2.called.should.be.equal(true);
                stub2.args[0][0].should.include(123);
                stub2.args[0][1].should.be.equal(status);
                stub2.restore();

            });

            it('Should set proper offsets for the rule grid while fetching the scroll position', function () {
                var stub, stub2, rowIndex, isLastPage, scrollValue;
                rowIndex = 1, isLastPage = true;
                stub = sinon.stub(baseController.view, 'getGridTable', function () {
                    return [
                        {grid: {prevRowHeight: 10}, rows: [
                            {offsetHeight: 10},
                            {offsetHeight: 10}
                        ]}
                    ]
                });
                stub2 = sinon.stub(baseController, 'getRelativePageIndex', function () {
                    return 2;
                });
                scrollValue = baseController.getScrollPositionForRow(rowIndex, isLastPage);
                scrollValue.should.be.equal(10);

                rowIndex = 51;

                scrollValue = baseController.getScrollPositionForRow(rowIndex, isLastPage);
                scrollValue.should.be.equal(10);
                stub.restore();
                stub2.restore();
            });

            it('Checks if the relative page index is returned properly', function () {
                var rowIndex, isLastPage, pageValue, pageSize = baseController.policyManagementConstants.DEFAULT_PAGE_SIZE;
                rowIndex = 1, isLastPage = true;
                pageValue = baseController.getRelativePageIndex(rowIndex, isLastPage);
                pageValue.should.be.equal(rowIndex % pageSize);

                rowIndex = 0;
                pageValue = baseController.getRelativePageIndex(rowIndex, isLastPage);
                pageValue.should.be.equal(rowIndex);

                rowIndex = pageSize * 2;
                pageValue = baseController.getRelativePageIndex(rowIndex, false);
                pageValue.should.be.equal(pageSize);

                rowIndex = pageSize + 1;
                pageValue = baseController.getRelativePageIndex(rowIndex, isLastPage);
                pageValue.should.be.equal(pageSize + rowIndex % pageSize);

                rowIndex = pageSize;
                pageValue = baseController.getRelativePageIndex(rowIndex, isLastPage);
                pageValue.should.be.equal(pageSize);
            });

            it('Checks if the reload page calls the collection fetch with correct parameters', function () {
                var stub, stub2;

                stub = sinon.stub(baseController.ruleCollection, 'fetch');
                stub2 = sinon.stub(baseController, 'getViewPortPageNumbers', function () {
                    return ['fakePage'];
                });
                baseController.reloadPage();

                stub.called.should.be.equal(true);
                stub.args[0][0].rows.should.be.equal(baseController.policyManagementConstants.DEFAULT_PAGE_SIZE);
                stub.args[0][0].reset.should.be.equal(true);
                stub.args[0][0].page.should.be.equal('fakePage');

                stub.restore();
                stub2.restore();
            });

            it('Check if the correct page number is returned for the view port', function () {
                var stub, stub2, stub3, selectedRules, pages;
                selectedRules = [
                    {id: 1},
                    {id: 2}
                ];
                baseController.view.gridWidgetObject = {
                    getViewportRows: function () {
                        return selectedRules;
                    },
                    removeEditModeOnRow: function () {
                    },
                    addEditModeOnRow: function () {
                    }
                };


                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return selectedRules;
                });

                stub2 = sinon.stub(baseController, 'isRowInEditMode', function () {
                    return true;
                });

                stub3 = sinon.stub(baseController.ruleCollection, 'get', function (id) {
                    return {
                        id: id,
                        pageNum: id,
                        get: function () {
                            return id;
                        }
                    }
                });
                pages = baseController.getViewPortPageNumbers();
                pages.length.should.be.equal(2);

                stub.restore();
                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return null;
                });

                baseController.view.gridWidgetObject = {
                    getViewportRows: function () {
                        return [];
                    },
                    removeEditModeOnRow: function () {
                    },
                    addEditModeOnRow: function () {
                    }
                };
                pages = baseController.getViewPortPageNumbers();
                pages.length.should.be.equal(0);


                stub.restore();
                stub2.restore();
                stub3.restore();
            });

            it('Checks if the refresh page calls grid load complete event and calls reload on page properly', function () {
                var stub, stub2, stub3, action = {'fakeEvent': 'fakeActions'};

                stub = sinon.stub(baseController, 'handleRuleGridLoadComplete');
                stub2 = sinon.stub(baseController, 'reloadPage');
                stub3 = sinon.stub(baseController, 'policyStatusMsgChangeHandler');
                baseController.handleRefreshPage();
                stub.called.should.be.equal(false);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);

                baseController.handleRefreshPage(action);
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal(action);

                stub.restore();
                stub2.restore();
                stub3.restore();
            });

            it('Checks if the rule grid load complete updates the view properly. Also check its event handler', function () {
                var stub, stub2, action = {'fakeEvent': 'fakeActions'};
                baseController.view.gridWidgetObject = {
                    addEditModeOnRow: function () {
                    }
                };
                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return null;
                });

                stub2 = sinon.stub(baseController, 'toggleSelections');
                baseController.handleRuleGridLoadComplete();
                $(baseController.view.$el).trigger('rulegridreloadcomplete');
                stub2.called.should.be.equal(false);
                stub.restore();

                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [
                        {id: 123},
                        {id: 1234}
                    ];
                });
                baseController.handleRuleGridLoadComplete();
                $(baseController.view.$el).trigger('rulegridreloadcomplete');
                stub2.called.should.be.equal(false);

                baseController.handleRuleGridLoadComplete(action);
                $(baseController.view.$el).trigger('rulegridreloadcomplete');
                stub2.calledTwice.should.be.equal(true);
                stub2.args[0][0].should.include(123);
                stub2.args[0][0].should.include(1234);
                stub2.args[0][1].should.be.equal('unselected');
                $.isEmptyObject(stub2.args[1][1]).should.be.equal(true);

                action = {'fakeEvent': 'fakeActions', editRuleId: 12345};
                stub2.restore();
                stub2 = sinon.stub(baseController, 'toggleSelections');

                baseController.handleRuleGridLoadComplete(action);
                $(baseController.view.$el).trigger('rulegridreloadcomplete');
                stub2.calledTwice.should.be.equal(true);
                stub2.args[0][0].should.include(123);
                stub2.args[0][0].should.include(1234);
                stub2.args[0][1].should.be.equal('unselected');
                stub2.args[1][1].should.be.equal('selected');
                stub2.args[1][0].should.include(12345);

                stub.restore();
                stub2.restore();

            });

            it('Checks if tho selection is updated properly for the unsaved rules', function () {
                var stub, stub2, ruleMap;

                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [];
                });


                stub2 = sinon.stub(baseController, 'toggleSelections');

                baseController.updateSelectionForUnsavedRules();
                stub2.called.should.be.equal(false);

                ruleMap = {
                    '123': 'new123',
                    '1234': 'new1234'
                };
                baseController.updateSelectionForUnsavedRules(ruleMap);
                stub2.called.should.be.equal(false);


                stub.restore();
                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [
                        {}
                    ];
                });

                baseController.updateSelectionForUnsavedRules(ruleMap);
                stub2.called.should.be.equal(false);


                stub.restore();
                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [
                        {id: '123'},
                        {id: '1234'}
                    ];
                });

                baseController.updateSelectionForUnsavedRules(ruleMap);
                stub2.called.should.be.equal(true);
                stub2.args[0][0].should.include('123');
                stub2.args[0][0].should.include('1234');
                stub2.args[0][1].should.be.equal('unselected');

                stub.restore();
                stub2.restore();

            });

            it('Checks if it correctly remove the edit mode on the row', function () {
                var stub, stub2, stub3;
                baseController.view.gridWidgetObject = {
                    removeEditModeOnRow: function () {
                    }
                };


                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return null;
                });

                stub2 = sinon.stub(baseController, 'isRowInEditMode', function () {
                    return true;
                });

                stub3 = sinon.stub(baseController.view.gridWidgetObject, 'removeEditModeOnRow');
                baseController.removeEditMode();
                stub3.called.should.be.equal(false);

                stub.restore();
                stub = sinon.stub(baseController, 'getSelectedRows', function () {
                    return [
                        {id: 123},
                        {id: 1234}
                    ];
                });
                baseController.removeEditMode();
                stub3.args[0][0].should.be.equal(123);
                stub3.args[1][0].should.be.equal(1234);

                stub.restore();
                stub2.restore();
                stub3.restore();
            });


            it('Checks if the row is in edit mode is returned properly from the view', function () {
                // return, just checking the class
                baseController.isRowInEditMode();
            });


        });


        describe('Check Policy save scenarios:', function () {
            it('Checks if the policy save success is called properly on success', function () {
                var stub = sinon.stub(baseController, 'handlePolicySaveFailed'),
                    stub2 = sinon.stub(baseController, 'handlePolicySaveSuccess'),
                    stub3 = sinon.stub($(baseController.view.$el), 'trigger'), errorKey = '', ruleMap = {id: 123};

                baseController.handlePolicySaved(errorKey, null, ruleMap);

                stub.called.should.be.equal(false);
                stub2.calledWith(ruleMap).should.be.equal(true);
                stub2.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });

            it('Checks if the policy save failed is called properly on any other error', function () {
                var stub = sinon.stub(baseController, 'handlePolicySaveFailed'),
                    stub2 = sinon.stub(baseController, 'handlePolicySaveSuccess'),
                    stub3 = sinon.stub($(baseController.view.$el), 'trigger'), errorKey = 'error';

                baseController.handlePolicySaved(errorKey);

                stub.called.should.be.equal(true);
                stub.calledWith(errorKey).should.be.equal(true);
                stub2.called.should.be.equal(false);

                stub.restore();
                stub2.restore();
                stub3.restore();

            });
            it('Checks if the success on save is called properly', function () {
                var stub = sinon.stub(baseController, 'updateSelectionForUnsavedRules'),
                    stub2 = sinon.stub(baseController, 'removeEditMode'),
                    stub3 = sinon.stub(baseController.view.$el, 'trigger'),
                    stub4 = sinon.stub(baseController, 'policyStatusMsgChangeHandler'),
                    stub5 = sinon.stub(baseController, 'reloadPage'), ruleIdMap = 'fakeRuleId';

                baseController.handlePolicySaveSuccess(ruleIdMap);

                stub.called.should.be.equal(true);
                stub.calledWith(ruleIdMap).should.be.equal(true);
                stub3.calledWith('after-save-policy').should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
            });

            it('Checks if the policy save failed is called properly on validation error', function () {
                var stub = sinon.stub(baseController, 'createConfirmationDialog'),
                    stub2 = sinon.stub(baseController, 'fireGridActivityEvent'),
                    stub4 = sinon.stub(baseController, 'policyStatusMsgChangeHandler'),
                    stub5 = sinon.stub(baseController, 'reloadPage'), errorKey = '';

                baseController.handlePolicySaveFailed(errorKey);

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);


                stub.restore();
                stub2.restore();
                stub4.restore();
                stub5.restore();

            });

            it('Checks if the policy save failed is called properly on internal failure', function () {
                var stub = sinon.stub(baseController, 'createConfirmationDialog'),
                    stub2 = sinon.stub(baseController, 'fireGridActivityEvent'),
                    stub4 = sinon.stub(baseController, 'policyStatusMsgChangeHandler'),
                    stub5 = sinon.stub(baseController, 'reloadPage'), errorKey = baseController.policyManagementConstants.SAVE_FAILED_FOR_VALIDATION_ERRORS;

                baseController.handlePolicySaveFailed(errorKey);

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);


                stub.restore();
                stub2.restore();
                stub4.restore();
                stub5.restore();

            });

            it('Checks if the failure on save is called properly if it is due to any other error', function () {
                var stub = sinon.stub(baseController, 'createConfirmationDialog'),
                    stub2 = sinon.stub(baseController, 'fireGridActivityEvent'),
                    stub4 = sinon.stub(baseController, 'policyStatusMsgChangeHandler'),
                    stub5 = sinon.stub(baseController, 'reloadPage'), errorKey = baseController.policyManagementConstants.SAVE_FAILED_DUE_TO_SOME_INTERNAL_FAILURE;

                baseController.handlePolicySaveFailed(errorKey);

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);


                stub.restore();
                stub2.restore();
                stub4.restore();
                stub5.restore();
            });


            it('Checks if the failure on save is called properly if it is due to concurrent edit', function () {
                var stub = sinon.stub(baseController, 'handleConcurrentEdit'), errorKey = baseController.policyManagementConstants.SAVE_FAILED_DUE_TO_CONCURRENT_EDIT;

                baseController.handlePolicySaveFailed(errorKey);

                stub.called.should.be.equal(true);


                stub.restore();
            });


        });

        describe('Check policy fetch scenarios: ', function () {

            var stub, stub2, stub3, stub4, stub5, stub6, stub7, stub8, stub9, stub10, stub13,scrollPosition = 2, scrollForwardParam = true, stub11, stub12;


            before(function () {
                baseController.view.gridWidgetObject = {
                    getScrollPosition: function () {
                        return 2;
                    },
                    addPageRows: function () {
                    },
                    setScrollPosition: function () {
                    }
                }
                var selectedRules = [
                    {id: 123},
                    {id: 1234}
                ];
                stub = sinon.stub(baseController.view.$el, 'addClass');
                stub2 = sinon.stub($(baseController.view.$el), 'trigger');
                stub3 = sinon.stub(baseController, 'getSelectedRows', function () {
                    return selectedRules;
                });
                stub4 = sinon.stub(baseController.view.$el, 'removeClass');
                stub5 = sinon.stub(baseController, 'emptyGridRows');
                stub6 = sinon.stub(baseController.view, 'addTreeViewRendering');
                stub7 = sinon.stub(baseController.view, 'formatRulesGrid');
                stub8 = sinon.stub(baseController, 'fireGridActivityEvent');
                stub9 = sinon.stub(baseController.view.gridWidgetObject, 'setScrollPosition');
                stub10 = sinon.stub(baseController, 'getScrollPositionForRow');
                stub13 = sinon.stub(baseController, 'toggleSelections');
                stub11 = sinon.stub(baseController, 'getRelativePageIndex', function () {
                    return 0;
                });
                stub12 = sinon.stub(baseController.view, 'getGridTable', function () {
                    return [
                        {
                            rows: [
                                {
                                    addClass: function () {
                                    }
                                }
                            ]
                        }
                    ]
                });


            });

            after(function () {
                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();
                stub7.restore();
                stub8.restore();
                stub9.restore();
                stub10.restore();
                stub11.restore();
                stub12.restore();
                stub13.restore();
            });
            it('Confirms if the loading is shown at the start of fetch', function () {
                baseController.handleFetchStart(null, null, {noSpinner: false});
                stub.calledWith("view-min-height").should.be.equal(true);
            });

            it('Confirms fetch complete functionality', function () {
                var data = [
                    {rules: [
                        {id: 123}
                    ]},
                    {rules: [
                        {id: 1234}
                    ]}
                ];
                baseController.isScrolling = true;
                baseController.pageRequested = 1;
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: scrollForwardParam, rowNumber: 123, reset: true});
                baseController.isScrolling = true;
                baseController.pageRequested = 2;
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: scrollForwardParam, rowNumber: 123, reset: true});

                baseController.isScrolling = false;
                baseController.pageRequested = 1;
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: scrollForwardParam, rowNumber: 123, reset: true});
                stub4.calledWith("view-min-height").should.be.equal(true);
                stub5.called.should.be.equal(true);
                baseController.ruleCollection.resetCollection.should.be.equal(false);
                stub6.called.should.be.equal(true);
                stub7.called.should.be.equal(true);
                stub8.called.should.be.equal(true);
                stub10.args[0][0].should.be.equal(123);
                scrollForwardParam = false;
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: scrollForwardParam, rowNumber: 123, highLightRowsCount: 1});
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: scrollForwardParam, rowNumber: 123, showFirst: true});
                baseController.pageRequested = 3;
                data = [
                    {pageNum:2,
                        rules: [
                            {id: 123}
                        ]},
                    {pageNum:3,rules: [
                        {id: 1234}
                    ]}

                ];
                baseController.isScrolling = true;
                baseController.handleFetchComplete(data, 10, {changeViewport: true, scrollForward: true,
                    rowNumber: 123, showFirst: true});

            });
        });
    });

});
