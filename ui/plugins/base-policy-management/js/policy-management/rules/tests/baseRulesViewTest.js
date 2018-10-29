define([
    '../views/baseRulesView.js',
    '../util/ruleGridConstants.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleCollection.js',
    '../../export/views/exportRulesView.js'
], function (View, PolicyManagementConstants, Collection, ExportView) {

    var baseRulesView, context = new Slipstream.SDK.ActivityContext(),
        policy = {id: 123}, CUID = '', objectsViewData, rulesView, domainPolicyStub, customButtons;
       objectsViewData = [{
                id: 'ADDRESS',
                text: 'Address',
                action: 'slipstream.intent.action.ACTION_LIST_POLICY_RULES',
                mime_type: 'vnd.juniper.net.addresses'
            }, {
                id: 'SERVICE',
                text: 'Service',
                action: '',
                mime_type: ''
            }];
    describe('Base Rules View UT', function () {


        before(function () {
            customButtons = [];
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/123/draft/rules/filter?*',
                type: 'POST',
                responseText: true
            });

            context.getMessage = function (key) {
                return key;
            }

        });

        after(function () {
            $.mockjax.clear();
            domainPolicyStub.restore();
        });

        describe('Basic Functionality Testing', function () {
            var stub1, stub2, stub3;
            before(function () {
                stub1 = sinon.stub(View.prototype, 'buildActionEvents');
                stub2 = sinon.stub(View.prototype, 'subscribeNotifications');
                stub3 = sinon.stub(View.prototype, 'handleNavigateAway');
            });

            it('Creates the view object', function () {

                baseRulesView = new View({
                    context: context,
                    actionEvents: {},
                    objectsViewData : objectsViewData,
                    ruleCollection: new Collection(CUID, policy, context),
                    policyManagementConstants: PolicyManagementConstants,
                    cuid: CUID,
                    extras: {filter: 'filter'}
                });

                baseRulesView.should.exist;
                stub1.restore();
                stub2.restore();
                stub3.restore();

                baseRulesView.customActionKeys = {
                    SAVE: 'save',
                    DISCARD: 'discard',
                    PUBLISH: 'publish',
                    UPDATE: 'update',
                    SHAREDOBJECTS: 'SharedObjects'
                }

                baseRulesView.gridWidgetObject = {
                    updateActionStatus: function () {

                    }
                }

                var div = $('<div id = "saveRules_button"/>');
                baseRulesView.$el.append(div);

                div = $('<div id = "discardRules_button"/>');
                baseRulesView.$el.append(div);
                div = $('<div id = "publishRules_button"/>');
                baseRulesView.$el.append(div);
                div = $('<div id = "updatePublishedRules_button"/>');
                baseRulesView.$el.append(div);


                domainPolicyStub = sinon.stub(baseRulesView.ruleCollection, 'isSameDomainPolicy', function () {
                    return true;
                });
            });
            it('Checks if the notifications are subscribed properly', function () {
                var callback, args = {uri: 'fakeURI'}, stub = sinon.stub(baseRulesView.smSSEEventSubscriber, 'startSubscription');
                baseRulesView.subscribeNotifications();
                stub.called.should.be.equal(true);
                callback = stub.args[0][1];
                stub.restore();
                stub = sinon.stub(baseRulesView.$el, 'trigger');
                callback.call(baseRulesView, args);
                stub.called.should.be.equal(true);
                stub.calledWith('policy-modified').should.be.equal(true);
                stub.restore();

            });


            it('Checks if the unsubscribe notification is called properly', function () {
                var stub = sinon.stub(baseRulesView.smSSEEventSubscriber, 'stopSubscription');
                baseRulesView.unSubscribeNotifications();
                stub.called.should.be.equal(true);
                stub.restore();
            });

            it('Checks if it closes the correct editor overlay by sending the event', function () {
                var stub = sinon.stub(baseRulesView.$el, 'trigger'), colName = 'fakeCol';
                baseRulesView.closeEditorOverlay(colName);
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('closeCellOverlayView');
                stub.args[0][1].should.be.equal(colName);
                stub.restore();
            });

            it('Check if the policy editable is returned properly', function () {

                var isPolicyReadOnly = baseRulesView.ruleCollection.isPolicyReadOnly(), isPolicyEditable;

                isPolicyEditable = baseRulesView.state.isPolicyEditable();
                isPolicyEditable.should.be.equal(!isPolicyReadOnly);
            });

            it('Checks if the base rule grid has top section', function () {
                var check;
                check = baseRulesView.hasRuleGridTopSection();
                check.should.be.equal(true);
            });


            it('Checks if the base rule grid has bottom section', function () {
                var check;
                check = baseRulesView.hasRuleGridBottomSection();
                check.should.be.equal(false);
            });

            it('Checks if the base rule grid has editors', function () {
                var check;
                check = baseRulesView.hasRuleGridEditors();
                check.should.be.equal(true);
            });

            it('Checks if the base rule grid has context menu', function () {
                var check;
                check = baseRulesView.hasRuleGridContextMenu();
                check.should.be.equal(true);
            });

            it('Checks if the base rule grid has grid action buttons', function () {
                var check;
                check = baseRulesView.hasRuleGridActionButtons();
                check.should.be.equal(true);
            });


            it('Checks if the base rule grid has save button', function () {
                var check;
                check = baseRulesView.hasRuleGridSaveButton();
                check.should.be.equal(false);
            });

            it('Checks if the base rule grid has discard button', function () {
                var check;
                check = baseRulesView.hasRuleGridDiscardButton();
                check.should.be.equal(false);
            });

            it('Checks if the base rule grid has publish update button', function () {
                var check;
                check = baseRulesView.hasRuleGridPublishUpdateButtons();
                check.should.be.equal(false);
            });

            it('Checks if the base rule grid has tooltips', function () {
                var check;
                check = baseRulesView.hasToolTips();
                check.should.be.equal(true);
            });
        });

        describe('Check custom buttons and actions: ', function () {
            
            it('Checks if the buttons are created properly : Save button', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridSaveButton', function () {
                    return true;
                }), saveButton;
                
                baseRulesView.addCustomButtons(customButtons);
                (customButtons.length > 0).should.be.equal(true);

                saveButton = customButtons[0];
                saveButton.key.should.be.equal(baseRulesView.customActionKeys.SAVE);

                stub.restore();
            });

            it('Checks if the buttons are created properly : Discard button', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridDiscardButton', function () {
                    return true;
                }), button;
               
                baseRulesView.addCustomButtons(customButtons);
                (customButtons.length > 0).should.be.equal(true);

                button = customButtons[2];
                button.key.should.be.equal(baseRulesView.customActionKeys.DISCARD);

                stub.restore();
            });


            it('Checks if the buttons are created properly : publish button', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridPublishUpdateButtons', function () {
                    return true;
                }), button;
                baseRulesView.addCustomButtons(customButtons);
                (customButtons.length > 0).should.be.equal(true);

                button = customButtons[4];
                button.key.should.be.equal(baseRulesView.customActionKeys.PUBLISH);

                stub.restore();
            });


            it('Checks if the buttons are created properly : Update button', function () {
                var button = customButtons[5];
                button.key.should.be.equal(baseRulesView.customActionKeys.UPDATE);
            });

            it('Checks if the buttons are created properly : Shared Objects', function () {
                var sharedbutton;
                baseRulesView.addCustomButtons(customButtons);
                (customButtons.length > 0).should.be.equal(true);
                button = customButtons[6];
                button.key.should.be.equal(baseRulesView.customActionKeys.SHAREDOBJECTS);

            });

            it('Checks if the save button is returned properly', function () {
                var button = baseRulesView.findSavePolicyBtn();
                button.should.exist;
                button[0].id.should.be.equal('saveRules_button');
            });

            it('Checks if the discard button is returned properly', function () {
                var button = baseRulesView.findDiscardPolicyBtn();
                button.should.exist;
                button[0].id.should.be.equal('discardRules_button');
            });

            it('Checks if the publish button is returned properly', function () {
                var button = baseRulesView.findPublishPolicyBtn();
                button.should.exist;
                button[0].id.should.be.equal('publishRules_button');
            });

            it('Checks if the published update button is returned properly', function () {
                var button = baseRulesView.findUpdatePolicyBtn();
                button.should.exist;
                button[0].id.should.be.equal('updatePublishedRules_button');
            });

            it('Checks if the edit button is enabled or not', function () {
                var state, expected = baseRulesView.state.isPredefinedSelected !== true;
                state = baseRulesView.isEnableEditButton();
                state.should.be.equal(expected);
            });

            it('Checks if the delete button is enabled or not', function () {
                var state, expected = baseRulesView.state.isPredefinedSelected !== true;
                state = baseRulesView.isEnableDeleteButton();
                state.should.be.equal(expected);
            });

            it('Checks if the Save buttons is disabled or not when rule collection is dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.SAVE);
                isDisabled.should.be.equal(false);
                stub.restore();
            });
            it('Checks if the Save buttons is disabled or not when rule collection is not dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.SAVE);
                isDisabled.should.be.equal(true);
                stub.restore();
            });
            it('Checks if the discard buttons is disabled or not when rule collection is dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.DISCARD);
                isDisabled.should.be.equal(false);
                stub.restore();
            });
            it('Checks if the discard buttons is disabled or not when rule collection is not dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.DISCARD);
                isDisabled.should.be.equal(true);
                stub.restore();
            });

            it('Checks if the publish button is disabled or not when rule collection is dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.PUBLISH);
                isDisabled.should.be.equal(true);
                stub.restore();
            });
            it('Checks if the publish button is disabled or not when rule collection is not dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.PUBLISH);
                isDisabled.should.be.equal(false);
                stub.restore();
            });

            it('Checks if the update button is disabled or not when rule collection is dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.UPDATE);
                isDisabled.should.be.equal(true);
                stub.restore();
            });
            it('Checks if the update button is disabled or not when rule collection is not dirty', function () {
                var isDisabled, stub = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                });
                isDisabled = baseRulesView.isCustomButtonDisabled(baseRulesView.customActionKeys.UPDATE);
                isDisabled.should.be.equal(false);
                stub.restore();
            });

            it('Checks if the save policy triggers the event properly', function () {
                var stub = sinon.stub(baseRulesView.$el, 'trigger');
                baseRulesView.handleSavePolicy();
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('savePolicy');
                stub.restore();
            });

            it('Checks if the publish policy triggers the event properly', function () {
                var stub = sinon.stub(baseRulesView.$el, 'trigger');
                baseRulesView.handlePublishPolicy();
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('publishPolicy');
                stub.restore();
            });

        });

        describe('Check action events', function () {
            it('Check if the action events are bind properly or not [expand, collapse, create, update, delete]', function () {
                baseRulesView.buildActionEvents();
                baseRulesView.actionEvents.hasOwnProperty('expandAllRules').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('collapseAllRules').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('createEvent').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('updateEvent').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('deleteEvent').should.be.equal(true);
            });

            it('Check if the action events are bind properly or not [save]', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridSaveButton', function () {
                    return true;
                });
                baseRulesView.buildActionEvents();
                baseRulesView.actionEvents.hasOwnProperty('saveRules').should.be.equal(true);
                stub.restore();
            });


            it('Check if the action events are bind properly or not [discard]', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridDiscardButton', function () {
                    return true;
                });
                baseRulesView.buildActionEvents();
                baseRulesView.actionEvents.hasOwnProperty('discardRules').should.be.equal(true);
                stub.restore();
            });

            it('Check if the action events are bind properly or not [publish, update]', function () {
                var stub = sinon.stub(baseRulesView, 'hasRuleGridPublishUpdateButtons', function () {
                    return true;
                });
                baseRulesView.buildActionEvents();
                baseRulesView.actionEvents.hasOwnProperty('publishRules').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('updatePublishedRules').should.be.equal(true);
                stub.restore();
            });
            it('Check if the action events are bind properly or not [shared objects]', function () {
               
                baseRulesView.buildActionEvents();
                baseRulesView.actionEvents.hasOwnProperty('ADDRESS').should.be.equal(true);
                baseRulesView.actionEvents.hasOwnProperty('SERVICE').should.be.equal(true);
                
            });

        });

        describe('Check spinner', function () {

            it('Checks if the spinner is shown when show loading event is trigger', function () {
                baseRulesView.bindLoadingEvents();
                $(baseRulesView.$el).trigger('showloading');
                (baseRulesView.$el.find(".rulegrid-indicator-background").length > 0).should.be.equal(true);
            });

            it('Checks if the spinner is shown when show loading event is trigger', function () {
                $(baseRulesView.$el).trigger('destroyloading');
                (baseRulesView.$el.find(".rulegrid-indicator-background").length > 0).should.be.equal(true);
            });
        });

        describe('Check tooltips', function () {
            var stub;
            before(function () {
                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function () {
                    return {
                        get: function (column) {
                            if (column && column !== 'custom-column-data') {
                                return column;
                            } else if (column === 'custom-column-data') {
                                var obj = {
                                    fakeId1: 'fakeId1',
                                    fakeId2: ''
                                };
                                return JSON.stringify(obj);
                            } else {
                                return null;
                            }
                        }
                    }
                });
            });
            after(function () {
                stub.restore();
            });
            it('Checks if the tooltip handlers are defined properly', function () {
                var fakeRenderer, ruleGridConfiguration, stub;
                fakeRenderer = function () {
                };
                fakeRenderer.prototype.render = function () {
                };
                ruleGridConfiguration = {columns: [
                    {
                        name: 'fakeCol', cellTooltip: {
                        renderer: fakeRenderer,
                        value: 'hello'
                    }
                    },
                    {
                        name: 'fakeCol2'
                    },
                    {
                        name: 'fakeCol3', cellTooltip: {
                        value: 'hello'
                    }
                    }
                ]};
                baseRulesView.generateCellTooltips(ruleGridConfiguration);

                baseRulesView.tooltipHandlers['fakeCol2'].should.exist;
                baseRulesView.tooltipHandlers['fakeCol'].should.exist;
                baseRulesView.tooltipHandlers['fakeCol3'].should.exist;


                stub = sinon.stub(baseRulesView, 'getColumnTooltip', function () {
                    return 'faketooltip';
                });
                baseRulesView.tooltipHandlers['fakeCol2'].call(baseRulesView, {rowId: 123, columnName: 'fakeCol2'}, function () {
                });
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal(123);
                stub.args[0][1].should.be.equal('fakeCol2');
                stub.restore();
                stub = sinon.stub(fakeRenderer.prototype, 'render');

                baseRulesView.tooltipHandlers['fakeCol'].call(baseRulesView, {rowId: 123, columnName: 'fakeCol'}, function () {
                });

                stub.called.should.be.equal(true);
                stub.restore();

            });

            it('Checks if the proper cell tips are called', function () {
                baseRulesView.cellTooltip({rowId: 123, columnName: 'fakeCol2'}, function (tooltip) {
                    tooltip.should.be.equal('<span>fakeCol2</span>');
                });
            });

            it('Checks if the column tooltip calls the tooltip properly', function () {
                var expected = '', tip = '', stub, stub2;

                tip = baseRulesView.getColumnTooltip();
                tip.should.be.equal(expected);

                tip = baseRulesView.getColumnTooltip(123, 'fakeCol');
                expected = "<span>fakeCol</span>";
                tip.should.be.equal(expected);

            });

            it('Checks if the custom column tooltip calls the tooltip properly', function () {
                var expected = '', tip = '', stub, stub2;
                tip = baseRulesView.getCustomColumnTooltip(123, 'fakeId2');
                tip.should.be.equal(expected);

                tip = baseRulesView.getCustomColumnTooltip(123, 'fakeId1');
                expected = "<span>fakeId1</span>";
                tip.should.be.equal(expected);

            });


        });

        describe('Check collection/view events on the buttons', function () {
            var stub, isDirty;

            before(function () {
                isDirty = baseRulesView.ruleCollection.isCollectionDirty();
                stub = sinon.stub(baseRulesView.gridWidgetObject, 'updateActionStatus');
            });

            after(function () {
                stub.restore();
            });

            it('Checks if the rule collection dirty event update the button status properly', function () {
                baseRulesView.ruleCollection.trigger('rule-collection-dirty');

                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(isDirty);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(isDirty);
            });

            it('Checks if the after discard policy event update the button status properly', function () {
                baseRulesView.$el.trigger('after-discard-policy');

                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(isDirty);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(isDirty);
            });

            it('Checks if the policy read only - false event update the button status properly', function () {
                baseRulesView.$el.trigger('policy-read-only');

                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(isDirty);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(isDirty);
            });

            it('Checks if the policy read only - true event update the button status properly', function () {
                baseRulesView.$el.trigger('policy-read-only', [true]);

                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(false);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(false);
            });

            it('Checks if the policy - validate event update the button status properly', function () {
                baseRulesView.$el.trigger('policy-validate');
                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(isDirty);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(isDirty);
            });

            it('Checks if the policy - validate with error event update the button status properly', function () {
                baseRulesView.$el.trigger('policy-validate', ['error']);
                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(false);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(false);
            });


            it('Checks if the publish - policy event update the button status properly', function () {
                baseRulesView.$el.trigger('publish-policy');
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(false);
            });

            it('Checks if the update - policy event update the button status properly', function () {
                baseRulesView.$el.trigger('update-policy');
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(true);
            });

            it('Checks if the after policy save success event update the button status properly', function () {
                baseRulesView.ruleCollection.trigger('after-policy-save');
                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(!isDirty);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(isDirty);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(isDirty);
            });

            it('Checks if the after policy save success failed update the button status properly', function () {
                baseRulesView.ruleCollection.trigger('after-policy-save', ['failed']);
                baseRulesView.findSavePolicyBtn().hasClass('disabled').should.be.equal(false);
                baseRulesView.findDiscardPolicyBtn().hasClass('disabled').should.be.equal(false);
                baseRulesView.findPublishPolicyBtn().hasClass('disabled').should.be.equal(true);
                baseRulesView.findUpdatePolicyBtn().hasClass('disabled').should.be.equal(true);
            });

            it('Checks if the custom action keys are returned properly', function () {
                var keys = baseRulesView.getCustomActionKeys();
                keys.hasOwnProperty('SAVE').should.be.equal(true);
                keys.hasOwnProperty('DISCARD').should.be.equal(true);
                keys.hasOwnProperty('PUBLISH').should.be.equal(true);
                keys.hasOwnProperty('UPDATE').should.be.equal(true);
                keys.hasOwnProperty('SHAREDOBJECTS').should.be.equal(true);
            });

            it('Checks if the button status is returned properly when the disabled flag is not set', function () {
                baseRulesView.updateButtonsActionStatus();
                stub.called.should.be.equal(true);
                var param = stub.args[stub.args.length - 1][0];
                param.collapseAllRules.should.be.equal(true);
                param.create.should.be.equal(true);
                param.delete.should.be.equal(true);
                param.discard.should.be.equal(false);
                param.edit.should.be.equal(true);
                param.expandAllRules.should.be.equal(true);
                param.publish.should.be.equal(true);
                param.save.should.be.equal(false);
                param.update.should.be.equal(true);
            });

            it('Checks if the button status is returned properly when the disabled flag is set', function () {

                baseRulesView.updateButtonsActionStatus(true, function (param) {

                    param.collapseAllRules.should.be.equal(true);
                    param.create.should.be.equal(true);
                    param.delete.should.be.equal(true);
                    param.discard.should.be.equal(false);
                    param.edit.should.be.equal(true);
                    param.expandAllRules.should.be.equal(true);
                    param.publish.should.be.equal(true);
                    param.save.should.be.equal(false);
                    param.update.should.be.equal(true);

                });
            });

            it('Checks if the action status is called when row is clicked', function () {
                var stub1 = sinon.stub(baseRulesView, 'updateButtonsActionStatus');
                baseRulesView.setCustomActionStatus({selectedRows: []});

                stub1.called.should.be.equal(true);
                stub1.restore();
            });
        });
        
        describe('check for sharedObjectsMenuDropDownActionEvents' ,function() {
            it(' check for the shared objects dropdown values', function () {
               var testkey = {
                    'ADDRESS' : { name:'ADDRESS'},
                    'SERVICE' : { name:'SERVICE'}
               };
               var key = baseRulesView.sharedObjectsMenuDropDownActionEvents();
               key.should.exist;
               assert.deepEqual(key, testkey);     
            });
        });

        describe('Check filters/search', function () {

            it('Checks if the correct object is returned when fetching quick filter', function () {
                var filter = baseRulesView.getQuickFilters();

                filter.should.exist;
                filter[0].key.should.be.equal('showInvalidRules');
            });


            it('Checks if the correct search filter is returned', function () {

                var tokens, searchFilter, stub;
                tokens = ['fake1', 'AND', [
                    {column: "quickFilter", value: 'fakeVal'}
                ], [
                    {}
                ]];

                stub = sinon.stub(baseRulesView, 'formatSearchString', function () {
                    return 'fakeVal2';
                });

                searchFilter = baseRulesView.getSearchFilter(tokens);

                searchFilter.FilterParam["filters"].should.include('fake1');
                searchFilter.FilterParam["filters"].should.not.include('AND');
                searchFilter.FilterParam['fakeVal'].should.be.equal(true);
                searchFilter.FilterParam["filters"].should.include('fakeVal2');

                stub.restore();
            });

            it('Checks if the correct object is returned when fetching rule grid quick filter', function () {
                var stub = sinon.stub(baseRulesView, 'getQuickFilters', function () {
                    return 'fakeFilter';
                });
                var filter = baseRulesView.getRuleGridQuickFilters();

                filter.should.exist;
                filter.quickFilters.should.be.equal('fakeFilter');

                stub.restore();
            });

            it('Check if the search string formatting is done properly', function () {
                var val = baseRulesView.formatSearchString([
                        {column: 'col', value: 'val'},
                        {value: 'val2'}
                    ]),
                    expected = "col: ( val, val2 )";
                val.should.be.equal(expected);
            });
        });

        describe('It checks if the selections are defined properly', function () {

            it('Checks if the selected rules are returned properly', function () {
                var results, stub, selectedItems = [
                    {
                        id: 1234
                    },
                    {
                        id: 12345
                    }
                ], existingSelections = [
                    {
                        id: 1234,
                        name: 'Rule2',
                        get: function () {
                            return 1234;
                        }
                    }
                ];
                baseRulesView.state.selectedRules = existingSelections;
                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    if (id === 1234) {
                        return undefined;
                    }
                    return {
                        id: id,
                        name: 'Rule1'
                    }
                });
                results = baseRulesView.getSelectedRules(selectedItems);
                results.length.should.be.equal(2);
                stub.restore();

            });

            it('Checks if the empty array is returned when selected items are not defined', function () {
                var selection = baseRulesView.getSelectionIds();
                selection.should.be.instanceof(Array);
                selection.length.should.be.equal(0);
            });

            it(' Checks if the predefined selection query returns properly', function () {
                var result, rules = [
                    {
                        isPredefined: function () {
                            return false;
                        }
                    },
                    {
                        isPredefined: function () {
                            return true;
                        }
                    }
                ];
                result = baseRulesView.isPredefinedSelected(rules);
                result.should.be.equal(true);
            });


            it(' Checks if the rule group selection query returns properly', function () {
                var result, rules = [
                    {
                        isRuleGroup: function () {
                            return false;
                        }
                    },
                    {
                        isRuleGroup: function () {
                            return true;
                        }
                    }
                ];
                result = baseRulesView.isRuleGroupSelected(rules);
                result.should.be.equal(true);
            });

            it(' Checks if the last item selection query returns properly', function () {
                var result, rules = [
                    {
                        isLastItemInParentGroup: function () {
                            return false;
                        }
                    },
                    {
                        isLastItemInParentGroup: function () {
                            return true;
                        }
                    }
                ];
                result = baseRulesView.isLastItemSelected(rules);
                result.should.be.equal(true);
            });

            it(' Checks if the first item selection query returns properly', function () {
                var result, rules = [
                    {
                        isFirstItemInParentGroup: function () {
                            return false;
                        }
                    },
                    {
                        isFirstItemInParentGroup: function () {
                            return true;
                        }
                    }
                ];
                result = baseRulesView.isFirstItemSelected(rules);
                result.should.be.equal(true);
            });


            it(' Checks if the selection under same parent query returns properly', function () {
                var result, rules = [
                    {
                        get: function (id) {
                            return 123;
                        }
                    },
                    {
                        get: function (id) {
                            return 123;
                        }
                    },
                    {
                        get: function (id) {
                            return 1234;
                        }
                    }
                ];
                result = baseRulesView.isSelectionUnderSameParent(rules);
                result.should.be.equal(false);
            });

            it(' Checks if the custom parent rule group selection query returns properly', function () {
                var result, rules = [
                    {
                        hasCustomParentRuleGroup: function () {
                            return false;
                        }
                    },
                    {
                        hasCustomParentRuleGroup: function () {
                            return true;
                        }
                    }
                ];
                result = baseRulesView.hasCustomParentRuleGroup(rules);
                result.should.be.equal(true);
            });

            it('Checks if the selected rule by id is returned properly', function () {

                var result, stub, existingSelections = [
                    {
                        id: 1234,
                        name: 'Rule2',
                        get: function () {
                            return 1234;
                        }
                    }
                ];
                baseRulesView.state.selectedRules = existingSelections;
                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    if (id === 1234) {
                        return null;
                    }
                    return {
                        id: id,
                        name: 'Rule1'
                    }
                });

                result = baseRulesView.getSelectedRuleById(123);
                result.should.exist;
                result.name.should.be.equal('Rule1');

                result = baseRulesView.getSelectedRuleById(1234);
                result.should.exist;
                result.name.should.be.equal('Rule2');

                stub.restore();
            });

            it('Checks if the selection state is maintained properly', function () {
                var state, stub1, stub2, stub3, stub4, stub5, stub6, selectedItems = [
                    {
                        id: 1234
                    },
                    {
                        id: 12345
                    }
                ], stub;
                stub = sinon.stub(baseRulesView, 'getSelectedRules', function () {
                    return selectedItems;
                });
                stub1 = sinon.stub(baseRulesView, 'isPredefinedSelected', function () {
                    return false;
                });

                stub2 = sinon.stub(baseRulesView, 'isRuleGroupSelected', function () {
                    return true;
                });

                stub3 = sinon.stub(baseRulesView, 'isLastItemSelected', function () {
                    return false;
                });

                stub4 = sinon.stub(baseRulesView, 'isFirstItemSelected', function () {
                    return false;
                });

                stub5 = sinon.stub(baseRulesView, 'hasCustomParentRuleGroup', function () {
                    return true;
                });

                stub6 = sinon.stub(baseRulesView, 'isSelectionUnderSameParent', function () {
                    return false;
                });
                state = baseRulesView.state;
                baseRulesView.updateSelectionState(selectedItems);
                state.isEmptySelection.should.be.equal(selectedItems.length === 0);
                state.isSingleSelection.should.be.equal(selectedItems.length === 1);
                state.isDirty.should.be.equal(baseRulesView.ruleCollection.isCollectionDirty());
                state.isPredefinedSelected.should.be.equal(baseRulesView.isPredefinedSelected());
                state.isRuleGroupSelected.should.be.equal(baseRulesView.isRuleGroupSelected());
                state.isSelectionUnderSameParent.should.be.equal(baseRulesView.isSelectionUnderSameParent());
                state.isLastItemSelected.should.be.equal(baseRulesView.isLastItemSelected());
                state.isFirstItemSelected.should.be.equal(baseRulesView.isFirstItemSelected());
                state.hasCustomParentRuleGroup.should.be.equal(baseRulesView.hasCustomParentRuleGroup());

                stub.restore();
                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();
            });

        });

        describe('Custom columns: ', function () {

            it('Checks if the custom column editors are created properly', function () {
                var cellViews = {};
                baseRulesView.customColumns = null;
                baseRulesView.createCustomColumnEditors(cellViews);
                $.isEmptyObject(cellViews).should.be.equal(true);

                baseRulesView.customColumns = [
                    {
                        name: 'fakeCol',
                        id: 'fakeId'
                    },
                    {
                        name: 'fakeCol2',
                        id: 'fakeId2'
                    }
                ];

                baseRulesView.createCustomColumnEditors(cellViews);
                $.isEmptyObject(cellViews).should.be.equal(false);
                cellViews.fakeCol.id.should.be.equal('fakeId');
                cellViews.fakeCol2.id.should.be.equal('fakeId2');
            });

            it('Checks if the custom column is added properly', function () {

                var l, config = [], stub, result, keyToCheck;

                stub = sinon.stub(baseRulesView, 'getCustomColumnTooltip', function () {
                    return 'fakeTooltip';
                });
                baseRulesView.customColumns = [
                    {
                        name: 'fakeCol',
                        id: 'fakeId'
                    }
                ];


                baseRulesView.appendCustomColumn(config);


                assert.propertyVal(config[0], 'custom_col_id', 'fakeId');
                assert.propertyVal(config[0], 'name', 'fakeCol');
                config[0].cellTooltip.value({rowId: 1}, function (value) {
                    result = value;
                });


                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal(1);
                stub.args[0][1].should.be.equal('fakeId');
                result.should.be.equal('fakeTooltip');
                stub.restore();

                var cell = config[0].collapseContent.formatCell([
                    {}
                ]);
                cell[0]['data-tooltip'].should.be.equal('collapsed');


                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function () {
                    return {
                        id: '123',
                        name: 'ruleName1',
                        get: function (key) {
                            if (key === 'rule-type') {
                                return 'RULE';
                            }
                            if (key === 'custom-column-data') {
                                return null;
                            }
                        }
                    }
                });

                result = config[0].collapseContent.formatData({}, {rowId: 1});
                result.should.be.equal('-');
                stub.restore();


                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function () {
                    return {
                        id: '123',
                        name: 'ruleName1',
                        get: function (key) {
                            if (key === 'rule-type') {
                                return 'RULE';
                            }
                            if (key === 'custom-column-data') {
                                return '{"fakeColId" : "fakeValue"}';
                            }
                        }
                    }
                });

                result = config[0].collapseContent.formatData({}, {rowId: 1, colModel: {'custom_col_id': 'fakeColId'}});
                result.should.be.equal('fakeValue');
                stub.restore();


            });

            it('Checks if the grid table is available', function () {
                var grid = baseRulesView.getGridTable();
                grid.should.exist;
            });

        });

        describe('Grid Table/Column/Position', function () {
            var stubTable, cm;
            before(function () {
                cm = [
                    {'name': 'serial-number'},
                    {'name': 'icons'},
                    {'name': 'name'}

                ];

                stubTable = sinon.stub(baseRulesView, 'getGridTable', function () {
                    return {
                        jqGrid: function () {
                            return cm;
                        }
                    }
                })
            });

            after(function () {
                stubTable.restore();
            });

            it('Checks if the icon column position is returned properly', function () {
                var stub, cm, position;
                cm = [
                    {'name': 'serial-number'},
                    {'name': 'icons'},
                    {'name': 'name'}
                ];

                stub = sinon.stub($.fn, 'jqGrid', function () {
                });
                position = baseRulesView.getIconsColumnPosition();
                position.should.be.equal(1);

                stub.restore();
            });


            it('Checks if the name column position is returned properly', function () {
                var stub, cm, position;
                cm = [
                    {'name': 'serial-number'},
                    {'name': 'icons'},
                    {'name': 'name'}

                ];

                stub = sinon.stub($.fn, 'jqGrid', function () {
                });
                position = baseRulesView.getNameColumnPosition();
                position.should.be.equal(2);

                stub.restore();
            });

            it('Checks if the tree column position is returned properly', function () {
                var stub, cm, position;
                cm = [
                    {'name': 'serial-number'},
                    {'name': 'icons'},
                    {'name': 'name'}
                ];

                stub = sinon.stub($.fn, 'jqGrid', function () {
                });
                position = baseRulesView.getTreeColumnPosition();
                position.should.be.equal(0);

                stub.restore();
            });


            it('Checks if the grid column count is returned properly', function () {
                var stub, cm, count;
                cm = [
                    {'name': 'serial-number'},
                    {'name': 'icons'},
                    {'name': 'name'}
                ];

                stub = sinon.stub($.fn, 'jqGrid', function () {
                });
                count = baseRulesView.getNumberTableColumns();
                count.should.be.equal(3);

                stub.restore();
            });


        });

        describe('Sections: ', function () {

            it('Check if the top section is added to the rule grid properly', function () {
                baseRulesView.$el.find('#rulegrid-top').length.should.be.equal(0);

                baseRulesView.appendRulesGridTopSection();
                baseRulesView.$el.find('#rulegrid-top').length.should.be.equal(1);
            });

            it('Check if the bottom section is added to the rule grid properly', function () {
                // nothing to check
                baseRulesView.appendRulesGridBottomSection();
            });
        });

        describe('Navigate Away: Actions/Confirmations', function () {

            it('Checks if the navigate aways shows the proper message, and check the functionality', function () {
                var handler, stub1, eventData = {}, stub = sinon.stub(Slipstream.SDK.MessageResolver.prototype, 'subscribe');
                baseRulesView.handleNavigateAway();

                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('topics://navigateAway/');
                stub.args[0][1].should.be.equal('navigateAway');

                handler = stub.args[0][2];

                stub1 = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return false;
                });

                var returnVal = handler.call(baseRulesView, {});
                returnVal.should.be.equal(false);
                stub1.restore();

                stub1 = sinon.stub(baseRulesView.ruleCollection, 'isCollectionDirty', function () {
                    return true;
                });

                var returnVal = handler.call(baseRulesView, eventData);
                $.isEmptyObject(eventData).should.be.equal(false);
                $.isEmptyObject(returnVal).should.be.equal(false);
                returnVal.title.should.exist;
                returnVal.message.should.exist;
                returnVal.navAwayQuestion.should.exist;

                stub1.restore();
                stub.restore();

            });


            it('Check that the store and states are reset properly on nav away', function () {
                var stub1, stub2, stub3, stub4;

                stub1 = sinon.stub(baseRulesView.ruleCollection, 'resetStore');
                stub2 = sinon.stub(baseRulesView.$el, 'trigger');
                stub3 = sinon.stub(baseRulesView.messageResolver, 'unsubscribe');
                stub4 = sinon.stub(baseRulesView, 'unSubscribeNotifications');

                baseRulesView.subscription = {};
                baseRulesView.smSSEEventSubscriber = {};

                baseRulesView.close();


                stub1.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub2.args[0][0].should.be.equal('view-close');
                stub3.called.should.be.equal(true);
                $.isEmptyObject(baseRulesView.subscription).should.be.equal(true);
                $.isEmptyObject(baseRulesView.messageResolver).should.be.equal(true);
                stub4.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();

            });


            it('Checks if on yes action, the navigation is properly defined', function () {
                var stub = sinon.stub(baseRulesView, 'close');
                baseRulesView.navigateAwayYesCallback();

                stub.called.should.be.equal(true);
                stub.restore();
            });


        });

        describe('Formatting and Rendering:', function () {

            before(function () {
                baseRulesView.$el.append('<table id="ruleGrid">' +
                    '<tr id ="fakeId1">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId2">' +
                    '<td id ="treeId">' +
                    '<div class = "rule-group-node"><div class="treeclick"/></div>' +
                    '</td>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId3">' +
                    '<td id ="treeId">' +
                    '<div class = "rule-group-node"><div class="treeclick"/></div>' +
                    '</td>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId4">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId5">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '</table>');
            });


            it('Checks the rule grid formatting', function () {
                var stub1, stub2, stub3, stub, obj;

                stub1 = sinon.stub(baseRulesView, 'getTreeColumnPosition', function () {
                    return 0;
                });

                stub2 = sinon.stub(baseRulesView, 'getIconsColumnPosition', function () {
                    return 1;
                });

                stub3 = sinon.stub(baseRulesView, 'getNameColumnPosition', function () {
                    return 2;
                });


                obj = {

                    'fakeId1': {'name': 'fakeName1',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },

                    'fakeId2': {'name': 'fakeName2',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },
                    'fakeId3': {'name': 'fakeName3',
                        'rule-level': 0,
                        'rule-type': 'RULE'
                    },
                    'fakeId4': {'name': 'fakeName4',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    },
                    'fakeId5': {'name': 'fakeName5',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    }

                };

                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
                            return obj[id][key];
                        }
                    }
                });

                baseRulesView.formatRulesGrid();


                stub1.restore();
                stub.restore();
                stub2.restore();
                stub3.restore();

            });
            it('Checks if the formatting on grid for line seperator is defined properly', function () {

                var stub2, stub3, obj;


                obj = {
                    'fakeId1': {'name': 'fakeName1',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    },

                    'fakeId2': {'name': 'fakeName2',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },

                    'fakeId3': {'name': 'fakeName3',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },

                    'fakeId4': {'name': 'fakeName4',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },
                    'fakeId5': {'name': 'fakeName5',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    }
                };

                stub2 = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
                            return obj[id][key];
                        }
                    }
                });

                stub3 = sinon.stub(baseRulesView, 'getNumberTableColumns', function () {
                    return 2;
                });
                var length = baseRulesView.getGridTable()[0].rows.length;

//                baseRulesView.formatRulesGridForLineSeparator();
//                baseRulesView.getGridTable()[0].rows.length.should.be.equal(length + 1);

                stub2.restore();
                stub3.restore();
            });

            it('Checks the render functionality', function () {

                var stub, stub2, stub3, stub4, stub5, stub6;

                baseRulesView.getContextMenu = function () {
                    return {getContextMenuItems: function () {
                        return [];
                    }}
                };

                baseRulesView.getRuleGridConfiguration = function () {
                    return {
                        actionButtons: {
                            customButtons: []
                        },
                        columns: {}
                    };
                }

                stub = sinon.stub(baseRulesView, 'appendCustomColumn');

                stub2 = sinon.stub(baseRulesView, 'appendRulesGridTopSection');
                stub3 = sinon.stub(baseRulesView, 'generateCellTooltips');
                stub4 = sinon.stub(baseRulesView, 'hasRuleGridBottomSection', function () {
                    return true;
                });
                stub5 = sinon.stub(baseRulesView, 'appendRulesGridBottomSection');
                stub6 = sinon.stub(baseRulesView, 'createGrid');
                baseRulesView.render();
                baseRulesView.gridWidgetObject.search = function () {
                };
                baseRulesView.ruleCollection.trigger('fetchComplete', baseRulesView);

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);
                stub6.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();

            });


            it('Checks if the row is editable', function () {
                var stub, stub2, rule, result;
                rule = {
                    isRuleGroup: function () {
                        return false;
                    }
                };
                stub = sinon.stub(baseRulesView, 'getSelectedRuleById', function () {
                    return rule;
                });
                stub2 = sinon.stub(baseRulesView.state, 'isPolicyEditable', function () {
                    return true;
                });

                result = baseRulesView.context.isRowEditable();
                result.should.be.equal(true);
                stub.restore();
                stub2.restore();
            });

            it('Checks if the row before edit state', function () {

                var returnVal, stub;

                stub = sinon.stub(baseRulesView.$el, 'triggerHandler', function (e, id) {
                    if (e === 'gridRowBeforeEdit') {
                        return false;
                    }
                });
                returnVal = baseRulesView.context.onBeforeEdit('fakeId');
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('gridRowBeforeEdit');
                stub.args[0][1].should.be.equal('fakeId');

                returnVal.should.be.equal(false);

                stub.restore();


                stub = sinon.stub(baseRulesView.$el, 'triggerHandler', function (e, id) {
                    if (e === 'gridRowBeforeEdit') {
                        return 'someFakeValue';
                    }
                });
                returnVal = baseRulesView.context.onBeforeEdit('fakeId');
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('gridRowBeforeEdit');
                stub.args[0][1].should.be.equal('fakeId');

                returnVal.should.be.equal('someFakeValue');

                stub.restore();
            });


            it('Enable the tree view rendering - click events check', function () {
                var stub1, stub2, stub3, obj;

                stub1 = sinon.stub(baseRulesView, 'getTreeColumnPosition', function () {
                    return 0;
                });

                obj = {
                    'fakeId1': {'name': 'fakeName1',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    },

                    'fakeId2': {'name': 'fakeName2',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    }
                };

                stub2 = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
//                        return obj[id][key];
                        }
                    }
                });
                baseRulesView.addTreeViewRendering();

                stub1.restore();
                stub2.restore();

            });


            it('Checks the click event on the tree view', function () {
                var stub, stub2, treeEl, obj, isExpanded = true, collapse = false;
                stub2 = sinon.stub(baseRulesView, 'getDataIds', function() {
                   return [{},{}];
                });
                obj = {
                    'name': 'fakeName1',
                    'rule-level': 2,
                    'rule-type': 'RULE'
                };

                stub = sinon.stub(baseRulesView.ruleCollection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
//                        return obj[id][key];
                        },
                        isExpanded: function () {
                            return isExpanded;
                        },
                        isRuleGroup: function () {
                            return true;
                        }
                    }
                });

                treeEl = baseRulesView.$el.find("div.rule-group-node")[0];

                $(treeEl).on('treegridnodecollapse', function () {
                    collapse = true;
                });

                $(treeEl).on('treegridnodeexpand', function () {
                    collapse = false;
                });

                // check collapse
                $(treeEl).trigger('click');
                collapse.should.be.equal(true);

                // check expand
                isExpanded = false;
                $(treeEl).trigger('click');
                collapse.should.be.equal(false);

                stub.restore();
                stub2.restore();
            });
        });

        describe('Export action', function() {
            it('Checks if the export action is called properly', function() {
                var stub = sinon.stub(ExportView.prototype, 'startExport'),
                    stub2 = sinon.spy(ExportView.prototype, 'initialize');
                baseRulesView.filterApplied = null;
                baseRulesView.exportRulesToPDF();


                stub.called.should.be.equal(true);
                stub2.args[0][0].params.fileType.should.be.equal('PDF_FORMAT');
                stub.restore();
                stub2.restore();

            });
        });

      describe.skip('Rules drag n drop Test cases', function () {
        var spyGetMessage = sinon.spy(function (a) {
          return a;
        }), context = {
          getMessage : spyGetMessage
        };
        it('cellBeforeDrag returns false', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            spyIsPolicyReadOnly = sinon.spy(function () {return true;});
          baseRulesGridConfiguration.ruleCollection = {isPolicyReadOnly : spyIsPolicyReadOnly};
          var isDragAllowed = baseRulesGridConfiguration.cellBeforeDrag();
          assert.equal(false, isDragAllowed);
          assert(spyIsPolicyReadOnly.calledOnce);
        });

        it('cellBeforeDrag returns true', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            spyIsPolicyReadOnly = sinon.spy(function () {return false;});
          baseRulesGridConfiguration.ruleCollection = {isPolicyReadOnly : spyIsPolicyReadOnly};
          var isDragAllowed = baseRulesGridConfiguration.cellBeforeDrag();
          assert.equal(true, isDragAllowed);
          assert(spyIsPolicyReadOnly.calledOnce);
        });

        it('validateEachDropRule drop_across_predefined grps', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testDropRules = [{id : 1, 'global-rule' : false}], testTargetRule = {id : 2, isGlobalRule : function (){return true}},
            testRetVal = {msg: 'rules.dnd.drop_across_predefined', isValid: false};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.isPredefinedRulesPresent = function () {return true};
          baseRulesGridConfiguration.ruleCollection = {
            get : function () {
              return {
                isPredefined : function (){return false},
                isGlobalRule : function (){return false}
              }
            }
          };
          var retVal = baseRulesGridConfiguration.validateEachDropRule(testDropRules, testTargetRule);
          assert.deepEqual(testRetVal, retVal);

        });

        it('validateEachDropRule rules.dnd.drop_on_itself', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testDropRules = [{'global-rule' : false, id : 1}],
            testTargetRule = {'global-rule' : false,
              id: 1,
              isGlobalRule : function(){return false},
              get : function () {return 1}
            },
            testRetVal = {msg: 'rules.dnd.drop_on_itself', isValid: false};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.ruleCollection = {

            get : function () {
              return {
                isPredefined : function (){return false},
                isGlobalRule : function(){return false},
                get : function () {return 1}
              };
            }
          };
          var retVal = baseRulesGridConfiguration.validateEachDropRule(testDropRules, testTargetRule);
          assert.deepEqual(testRetVal, retVal);

        });

        it('validateEachDropRule rules.dnd.drop_rulegrp_inside_another_rulegrp', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testDropRules = [{name : 'name1','global-rule' : false, id : 1, 'rule-type' : 'RULEGROUP'}],
            testTargetRule = {
              'global-rule' : false,
              id: 2,
              isGlobalRule : function(){return false},
              get : function () {return 2}
            },
            testRetVal = {msg: 'rules.dnd.drop_rulegrp_inside_another_rulegrp', isValid: false};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.ruleCollection = {
            get : function () {
              return {
                isPredefined : function (){return false},
                isGlobalRule : function(){return false},
                get : function (key) {return {name : 'name1', id : 1}[key]},
                isRuleGroup : function(){return true}
              };
            }
          };
          var retVal = baseRulesGridConfiguration.validateEachDropRule(testDropRules, testTargetRule, true, true, 'abc');
          assert(spyGetMessage.calledWith(testRetVal.msg, ['name1', 'abc']));
          assert.deepEqual(testRetVal, retVal);

        });

        it('validateEachDropRule rules.dnd.drop_predefined', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testDropRules = [{'global-rule' : false, id : 1, 'is-predefined' : true}],
            testTargetRule = {
              'global-rule' : false,
              id: 2,
              isGlobalRule : function(){return false},
              get : function () {return 2}
            },
            testRetVal = {msg: 'rules.dnd.drop_predefined', isValid: false};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.ruleCollection = {
            get : function () {
              return {
                isGlobalRule : function(){return false},
                get : function (key) {return {name : 'name1', id : 1}[key]},
                isRuleGroup : function(){return false},
                isPredefined : function () {
                  return true;
                }
              };
            }
          };
          var retVal = baseRulesGridConfiguration.validateEachDropRule(testDropRules, testTargetRule, true, true, 'abc');
          assert(spyGetMessage.calledWith(testRetVal.msg));
          assert.deepEqual(testRetVal, retVal);

        });

        it('validateRuleDragNDrop target rule is rule group and drop is valid', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testRetVal = {msg: 'abc msg', isValid : true},
            spyValidateEachDropRule = sinon.spy(function () {
              return testRetVal;
            }),
            testRuleGrpRefRule = {
              'rule-type' : "RULEGROUP",
              'is-predefined' : false,
              isRuleGroup : function () {return true},
              isPredefined : function (){return false},
              get : function (key){return {name:'testName'}[key]}
            };
          baseRulesGridConfiguration.validateEachDropRule = spyValidateEachDropRule;
          var testDropRule = {get:function(){return 'testName'}},
            retVal = baseRulesGridConfiguration.validateRuleDragNDrop(testDropRule, 'efg', true, testRuleGrpRefRule);
          assert(spyValidateEachDropRule.calledWith('efg', testDropRule, true, true, 'testName'));
          assert.equal(true, retVal);
        });

        it('validateRuleDragNDrop target rule is rule group and drop is invalid', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testRetVal = {errorMessage: 'abc msg', isValid : false},
            spyValidateEachDropRule = sinon.spy(function () {
              return {msg: 'abc msg', isValid : false};
            }),
            testRuleGrpRefRule = {
              'rule-type' : "RULEGROUP",
              'is-predefined' : false,
              isRuleGroup : function () {return true},
              isPredefined : function (){return false},
              get : function (key){return {name:'testName'}[key]}
            };
          baseRulesGridConfiguration.validateEachDropRule = spyValidateEachDropRule;
          var testDropRule = {get:function(){return 'testName'}},
            retVal = baseRulesGridConfiguration.validateRuleDragNDrop(testDropRule, 'efg', true, testRuleGrpRefRule);
          assert(spyValidateEachDropRule.calledWith('efg', testDropRule, true, true, 'testName'));
          assert.deepEqual(testRetVal, retVal);
        });

        it('validateRuleDragNDrop target rule is a rule inside a rule group and drop is valid', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testRetVal = {msg: 'abc msg', isValid : true},
            spyValidateEachDropRule = sinon.spy(function () {
              return testRetVal;
            }),
            testRuleCollectionMap = {23 : {'name' : 'testTargetRuleGrpName'}},
            testRuleGrpRefRule = {
              'rule-type' : "RULE",
              'rule-level' : 2,
              'is-predefined' : false,
              'rule-group-id' : 23,
              getRuleLevel : function(){return 2},
              getRuleGroupId : function(){return 23},
              isRuleGroup : function () {return false},
              isPredefined : function (){return false}
            };
          baseRulesGridConfiguration.validateEachDropRule = spyValidateEachDropRule;
          baseRulesGridConfiguration.ruleCollection = {get : function (key1) {
            return {
              get : function (key2) {
                return testRuleCollectionMap[key1][key2];
              }
            }
          }};
          var testDropRule = {get:function(){return 'testName'}},
            retVal = baseRulesGridConfiguration.validateRuleDragNDrop(testDropRule, 'efg', true, testRuleGrpRefRule);
          assert(spyValidateEachDropRule.calledWith('efg', testDropRule, true, true, 'testTargetRuleGrpName'));
          assert.equal(true, retVal);
        });

        it('ruleHoverDrop returns false', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            spyIsPolicyReadOnly = sinon.spy(function () {return true;});
          baseRulesGridConfiguration.ruleCollection = {isPolicyReadOnly : spyIsPolicyReadOnly};
          var isDragAllowed = baseRulesGridConfiguration.ruleHoverDrop();
          assert.equal(false, isDragAllowed);
          assert(spyIsPolicyReadOnly.calledOnce);
        });

        it('ruleHoverDrop returns true', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            spyIsPolicyReadOnly = sinon.spy(function () {return false;});
          baseRulesGridConfiguration.ruleCollection = {isPolicyReadOnly : spyIsPolicyReadOnly};
          var isDragAllowed = baseRulesGridConfiguration.ruleHoverDrop();
          assert.equal(true, isDragAllowed);
          assert(spyIsPolicyReadOnly.calledOnce);
        });

        it('processRuleDrop -- on drop prev row is rule', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULE',
              'myKey': 'tu hi re',
              isRule : function () {return true}
            }, testRetVal = {
              dir: 'Down',
              refRule: testPrevRow,
              validateRuleGrpDrop: true,
              validateRuleGrpDrop_RefRule: undefined
            };
          var retVal = baseRulesGridConfiguration.processRuleDrop(testPrevRow);
          assert.deepEqual(retVal, testRetVal);
        });

        it('processRuleDrop -- on drop prev row is is-predefined', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              isRule : function () {return false},
              isRuleGroup : function () {return true},
              isPredefined : function () {return true},
              'is-predefined' : true,
              'myKey': 'tu hi re'
            },
            testNextRow = {
              'rule-type': 'RULEGROUP',
              isRuleGroup : function () {return true},
              isRule : function () {return false},
              'myNextRowKey': 'mai hi re'
            },
            testRetVal = {
              dir: 'Up',
              refRule: testNextRow,
              validateRuleGrpDrop: false,
              validateRuleGrpDrop_RefRule: undefined
            };
          var retVal = baseRulesGridConfiguration.processRuleDrop(testPrevRow, testNextRow);
          assert.deepEqual(retVal, testRetVal);
        });

        it('processRuleDrop -- on drop prev row is rule group and next row is a child rule of this grp', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              id: 3,
              isRuleGroup : function () {return true},
              isRule : function () {return false},
              isPredefined : function (){return false},
              get : function (key){return {id:3}[key]},
              'myKey': 'tu hi re'
            },
            testNextRow = {
              'rule-type': 'RULE',
              id: 34,
              isRuleGroup : function () {return false},
              isRule : function () {return true},
              getRuleGroupId : function (){return 3},
              get : function (key){return {id:34}[key]},
              'rule-group-id' : 3,
              'myNextRowKey': 'mai hi re'
            },
            testRetVal = {
              dir: 'Up',
              refRule: testNextRow,
              validateRuleGrpDrop: true,
              validateRuleGrpDrop_RefRule: testPrevRow
            };
          var retVal = baseRulesGridConfiguration.processRuleDrop(testPrevRow, testNextRow);
          assert.deepEqual(retVal, testRetVal);
        });

        it('processRuleDrop -- on drop prev row is rule group and next row is a non-child sibling rule of this grp', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              isRuleGroup : function () {return true},
              isRule : function () {return false},
              get : function (key){return {id:3}[key]},
              isPredefined : function (){return false},
              id: 3,
              'myKey': 'tu hi re'
            },
            testNextRow = {
              'rule-type': 'RULE',
              id: 34,
              'myNextRowKey': 'mai hi re',
              getRuleGroupId : function (){return 37},
              isRuleGroup : function () {return false},
              isRule : function () {return true},
              get : function (key){return {id:34}[key]}
            },
            testRetVal = {
              dir: 'Up',
              refRule: testNextRow,
              validateRuleGrpDrop: false,
              validateRuleGrpDrop_RefRule: undefined
            };
          var retVal = baseRulesGridConfiguration.processRuleDrop(testPrevRow, testNextRow);
          assert.deepEqual(retVal, testRetVal);
        });

        it('processRuleDrop -- on drop prev row is rule group and next row is not a rule', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              id: 3,
              'myKey': 'tu hi re',
              isRuleGroup : function () {return true},
              isRule : function () {return false},
              isPredefined : function () {return false}
            },
            testRetVal = {
              dir: 'Down',
              refRule: testPrevRow,
              validateRuleGrpDrop: false,
              validateRuleGrpDrop_RefRule: undefined
            };
          var retVal = baseRulesGridConfiguration.processRuleDrop(testPrevRow);
          assert.deepEqual(retVal, testRetVal);
        });

        it('ruleAfterDrop prevRow is not defined', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testCallbackData = {
              siblingRows : {

              }
            },
            testRetVal = {isValid: false, errorMessage: 'rules.dnd.drop_outside_predefined'};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.isPredefinedRulesPresent = function (){return true};
          var retVal = baseRulesGridConfiguration.ruleAfterDrop(testCallbackData);
          assert.deepEqual(testRetVal, retVal);
        });

        it('ruleAfterDrop both prevRow and nextRow is pre-defined', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testCallbackData = {
              siblingRows : {
                prevRow : {
                  id : 1,
                  'is-predefined' : true
                },
                nextRow : {
                  id: 2,
                  'is-predefined' : true
                }
              }
            },
            testRetVal = {isValid: false, errorMessage: 'rules.dnd.drop_outside_predefined'};
          baseRulesGridConfiguration.context = context;
          baseRulesGridConfiguration.isPredefinedRulesPresent = function (){return true};
          baseRulesGridConfiguration.ruleCollection = {get : function (key){
            return {
              1 : {
                isPredefined : function (){return true}
              },
              2: {
                isPredefined : function (){return true}
              }
            }[key];
          }};
          var retVal = baseRulesGridConfiguration.ruleAfterDrop(testCallbackData);
          assert.deepEqual(testRetVal, retVal);
        });

        it('ruleAfterDrop validation status is false', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              id: 3,
              'myKey': 'tu hi re'
            },
            testNextRow = {
              'rule-type': 'RULEGROUP',
              id: 34,
              'myNextRowKey': 'mai hi re'
            },
            testCallbackData = {
              draggableRows : [{
                id : 1
              }, {
                id : 2
              }],
              siblingRows : {
                prevRow : testPrevRow,
                nextRow : testNextRow
              }
            },
            testRetVal = {isValid: false, errorMessage: 'rules.dnd.drop_outside_predefined'},
            spyValidateRuleDragNDrop = sinon.spy(function() {
              return testRetVal;
            }),
            testRetValProcessRuleDrop = {
              dir: 'Up',
              refRule: {refRule : 'abc'},
              validateRuleGrpDrop: true,
              validateRuleGrpDrop_RefRule: {otherRule : 'desc'}
            },
            spyProcessRuleDrop = sinon.spy(function () {
              return testRetValProcessRuleDrop;
            });
          baseRulesGridConfiguration.context = context;
          var testPrevRowModel = {
            isPredefined : function (){return false}
          }, testNextRowModel = {
            isPredefined : function (){return false}
          };
          baseRulesGridConfiguration.ruleCollection = {get : function (key){
            return {
              3 : testPrevRowModel,
              34: testNextRowModel
            }[key];
          }};
          baseRulesGridConfiguration.processRuleDrop = spyProcessRuleDrop;
          baseRulesGridConfiguration.validateRuleDragNDrop = spyValidateRuleDragNDrop;
          var retVal = baseRulesGridConfiguration.ruleAfterDrop(testCallbackData);
          assert.deepEqual(testRetVal, retVal);
          assert(spyProcessRuleDrop.calledWith(testPrevRowModel, testNextRowModel));
          assert(spyValidateRuleDragNDrop.calledWith(testRetValProcessRuleDrop.refRule, testCallbackData.draggableRows,
            testRetValProcessRuleDrop.validateRuleGrpDrop, testRetValProcessRuleDrop.validateRuleGrpDrop_RefRule));
        });

        it('ruleAfterDrop validation status is true', function () {
          var baseRulesGridConfiguration = new BaseRulesGridConfiguration(),
            testPrevRow = {
              'rule-type': 'RULEGROUP',
              id: 3,
              'myKey': 'tu hi re'
            },
            testNextRow = {
              'rule-type': 'RULEGROUP',
              id: 34,
              'myNextRowKey': 'mai hi re'
            },
            testCallbackData = {
              draggableRows : [{
                id : 1
              }, {
                id : 2
              }],
              siblingRows : {
                prevRow : testPrevRow,
                nextRow : testNextRow
              }
            },
            spyValidateRuleDragNDrop = sinon.spy(function() {
              return true;
            }),
            testRetValProcessRuleDrop = {
              dir: 'Up',
              refRule: {refRule : 'abc', id : 45},
              validateRuleGrpDrop: true,
              validateRuleGrpDrop_RefRule: undefined
            },
            spyProcessRuleDrop = sinon.spy(function () {
              return testRetValProcessRuleDrop;
            }),
            spyRuleCollection_MoveDroppedRule = sinon.spy();
          baseRulesGridConfiguration.context = context;
          var testPrevRowModel = {
            isPredefined : function (){return false}
          }, testNextRowModel = {
            isPredefined : function (){return false}
          };
          baseRulesGridConfiguration.processRuleDrop = spyProcessRuleDrop;
          baseRulesGridConfiguration.validateRuleDragNDrop = spyValidateRuleDragNDrop;
          baseRulesGridConfiguration.ruleCollection = {
            moveDroppedRule : spyRuleCollection_MoveDroppedRule,
            get : function (key){
              return {
                3 : testPrevRowModel,
                34: testNextRowModel
              }[key];
            }
          };
          var retVal = baseRulesGridConfiguration.ruleAfterDrop(testCallbackData);
          assert.equal(false, retVal);
          assert(spyProcessRuleDrop.calledWith(testPrevRowModel, testNextRowModel));
          assert(spyValidateRuleDragNDrop.calledWith(testRetValProcessRuleDrop.refRule, testCallbackData.draggableRows,
            testRetValProcessRuleDrop.validateRuleGrpDrop, testRetValProcessRuleDrop.refRule));
          assert(spyRuleCollection_MoveDroppedRule.calledWith([1,2],
            testRetValProcessRuleDrop.refRule.id, testRetValProcessRuleDrop.dir));
        });

      });


    });

});