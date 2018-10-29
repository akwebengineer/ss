/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
define([
    '../conf/rulesContextMenu.js',
    '../util/ruleGridConstants.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleCollection.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../../../../../ui-common/js/common/utils/SmUtil.js',
    '../views/ruleGroupView.js',
    '../views/moveToRuleGroupView.js',
    '../views/highlightRuleView.js'
], function (BaseContextMenu, RuleConstants, RuleCollection, RuleModel, SMUtil, RuleGroupView, MoveRuleGroupView, HighlightRuleView) {

    var baseContextMenu, context = new Slipstream.SDK.ActivityContext(),
        ruleCollection, consoleLogSpy, policy = {id: 123}, CUID = '';

    describe("Base policy context menu unit-tests", function () {

    before(function () {
        $.mockjax.clear();


        consoleLogSpy = sinon.spy(console, 'log');
        $.mockjax({
            url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
            type: 'GET',
            responseText: true
        });
        ruleCollection = new RuleCollection(CUID, policy, context);
        baseContextMenu = new BaseContextMenu();
        baseContextMenu.initialize(context, ruleCollection, RuleConstants);

        baseContextMenu.state = {
            selectedRules: [],
            isEmptySelection: true,
            isSingleSelection: false,
            isPredefinedSelected: false,
            isRuleGroupSelected: false,
            isSelectionUnderSameParent: false,
            isLastItemSelected: false,
            isFirstItemSelected: false,
            isDirty: false,
            isPolicyEditable: function () {
            }
        };

    });


    after(function () {
        consoleLogSpy.restore();
    });



        it('RulesContextMenu initialization: Collection, context should exist', function () {
            baseContextMenu.context.should.exist;
            baseContextMenu.policyManagementConstants.should.exist;
            baseContextMenu.ruleCollection.should.exist;
        });

        describe('Check to whether disable rule/rule group', function () {
            var stub;

            beforeEach(function () {

                stub = sinon.stub(baseContextMenu.state, 'isPolicyEditable');

            });

            afterEach(function () {
                stub.restore();
            });
            it('Check to whether disable add rule', function () {
                var state = baseContextMenu.state, expected, disable = baseContextMenu.shouldDisableAddRule();
                expected = state.isPredefinedSelected || !state.isSingleSelection || !state.isPolicyEditable();
                disable.should.be.equal(expected);
            });

            it('Check to whether disable create rule group', function () {
                var disable = baseContextMenu.shouldDisableCreateRuleGroup(), state = baseContextMenu.state, expected;
                expected = state.isPredefinedSelected ||
                    state.isEmptySelection ||
                    state.isRuleGroupSelected || !state.isSelectionUnderSameParent ||
                    state.hasCustomParentRuleGroup || !state.isPolicyEditable();
                disable.should.be.equal(expected);
            });

            it('Check to whether disable move to rule group', function () {
                var disable = baseContextMenu.shouldDisableMoveToRuleGroup(), state = baseContextMenu.state, expected;
                expected = state.isPredefinedSelected ||
                    state.isEmptySelection ||
                    state.isRuleGroupSelected || !state.isPolicyEditable();
                disable.should.be.equal(expected);
            });
        });


        describe('Move Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 1234]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'moveRule');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should return gracefully in case the selected item list is empty', function () {
                baseContextMenu.moveRulesHandler("", null);
                stub.called.should.be.equal(false);

                baseContextMenu.moveRulesHandler("", []);
                stub.called.should.be.equal(false);
            });

            it('Should handle ruleId', function () {
                baseContextMenu.moveRulesHandler('MOVE_RULE_BOTTOM', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                (ruleId > 0).should.be.equal(true);
                ruleId.should.be.equal(selectedItems.selectedRowIds[0]);
            });

            it('Should handle direction : Bottom', function () {
                baseContextMenu.moveRulesHandler('MOVE_RULE_BOTTOM', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);
            });

            it('Should handle direction : Top', function () {
                baseContextMenu.moveRulesHandler('MOVE_RULE_TOP', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_TOP);
            });

            it('Should handle direction : Up', function () {
                baseContextMenu.moveRulesHandler('MOVE_RULE_UP', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
            });

            it('Should handle direction : Down', function () {
                baseContextMenu.moveRulesHandler('MOVE_RULE_DOWN', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
            });

        });

        describe('Paste Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'pasteRules');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should return gracefully in case the selected item list is empty', function () {
                baseContextMenu.pasteRuleHandler("", null);
                stub.called.should.be.equal(false);

                baseContextMenu.pasteRuleHandler("", []);
                stub.called.should.be.equal(false);
            });

            it('Should handle ruleId', function () {
                baseContextMenu.pasteRuleHandler('PASTE_RULE_AFTER', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                (ruleId > 0).should.be.equal(true);
                ruleId.should.be.equal(selectedItems.selectedRowIds[0]);
            });

            it('Should handle direction : Before', function () {
                baseContextMenu.pasteRuleHandler('PASTE_RULE_BEFORE', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.PASTE_RULE_BEFORE);
            });

            it('Should handle direction : Top', function () {
                baseContextMenu.pasteRuleHandler('PASTE_RULE_AFTER', selectedItems);
                var direction = stub.args[0][1];
                direction.should.not.be.equal(null);
                direction.should.not.be.equal(undefined);
                direction.should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.PASTE_RULE_AFTER);
            });

        });

        describe('Copy Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'copyRules');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should return gracefully in case the selected item list is empty', function () {
                baseContextMenu.copyRuleHandler("", null);
                stub.called.should.be.equal(false);

                baseContextMenu.copyRuleHandler("", []);
                stub.called.should.be.equal(false);
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.copyRuleHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds);
            });

        });

        describe('Cut Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'cutRules');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should return gracefully in case the selected item list is empty', function () {
                baseContextMenu.cutRuleHandler("", null);
                stub.called.should.be.equal(false);

                baseContextMenu.cutRuleHandler("", []);
                stub.called.should.be.equal(false);
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.cutRuleHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds);
            });

        });

        describe('Clone Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'cloneRule');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should return gracefully in case the selected item list is empty', function () {
                baseContextMenu.cloneRuleHandler("", null);
                stub.called.should.be.equal(false);

                baseContextMenu.cloneRuleHandler("", []);
                stub.called.should.be.equal(false);
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.cloneRuleHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds[0]);
            });

        });

        describe('Enable Disable Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'enableDisableRules');
            });

            afterEach(function () {
                stub.restore();
            });


            it('Should handle ruleIds', function () {
                baseContextMenu.enableDisableRuleHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds);
            });


            it('Should Enable rule on enable event', function () {
                baseContextMenu.enableDisableRuleHandler('enableRule', selectedItems);
                var disable = stub.args[0][1];
                disable.should.be.equal(false);
            });

            it('Should Disable rule on disable event', function () {
                baseContextMenu.enableDisableRuleHandler('disableRule', selectedItems);
                var disable = stub.args[0][1];
                disable.should.be.equal(true);
            });

        });

        describe('Ungroup Rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'ungroupRules');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.ungroupRuleHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds);
            });

        });


        describe('Show events on rule test cases', function () {
            var stub, selectedItems = {selectedRowIds: [123, 12345]};
            beforeEach(function () {
                stub = sinon.stub(baseContextMenu.ruleCollection, 'showEvents');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.showEventsHandler('', selectedItems);
                var ruleId = stub.args[0][0];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                ruleId.should.be.equal(selectedItems.selectedRowIds);
            });

        });

        describe('Export to PDF test cases', function () {
            var stub, view;
            beforeEach(function () {
                view = {
                    $el: {
                        trigger: function() {}
                    }
                }
                stub = sinon.stub(view.$el, 'trigger');
            });

            afterEach(function () {
                stub.restore();
            });

            it('Should handle ruleIds', function () {
                baseContextMenu.exportRulesHandler('', null, view);
                stub.called.should.be.equal(true);
            });



        });

        describe('Get context menu test cases', function () {
            var state, contextMenu;
            beforeEach(function () {
                state = baseContextMenu.state;
            });
            it('should test if context menu items are returned properly', function () {
                contextMenu = baseContextMenu.getContextMenuItems(state);
                (contextMenu.length > 0).should.be.equal(true);
            });

            it('should test context menu returned properly: copy rule', function () {
                var menuOption, i, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'copyRule') {
                        break;
                    }
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(false);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || state.isEmptySelection;
                isDisabled.should.be.equal(expected);
            });

            it('should test context menu returned properly: cut rule', function () {

                var menuOption, i, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'cutRules') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected ||
                    state.isEmptySelection || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);
            });

            it('should test context menu returned properly: paste rule', function () {

                var menuOption, i;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'PASTE_RULE') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.hasSubMenu.should.be.equal(true);
            });


            it('should test context menu returned properly: paste rule before', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'PASTE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'PASTE_RULE_BEFORE') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = !baseContextMenu.ruleCollection.hasCopiedRules || !state.isSingleSelection || !state.isPolicyEditable() || state.isEmptySelection || state.isPredefinedSelected;
                isDisabled.should.be.equal(expected);

            });


            it('should test context menu returned properly: paste rule after', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'PASTE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'PASTE_RULE_AFTER') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = !baseContextMenu.ruleCollection.hasCopiedRules || !state.isSingleSelection || !state.isPolicyEditable() || state.isEmptySelection || state.isPredefinedSelected;
                isDisabled.should.be.equal(expected);

            });


            it('should test context menu returned properly: paste rule inplace', function () {

                var menuOption, i, j;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'PASTE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'PASTE_RULE_INPLACE') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

            });


            it('should test context menu returned properly: clone rule', function () {

                var menuOption, i, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'cloneRule') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isRuleGroupSelected || !state.isSingleSelection || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);
            });


            it('should test context menu returned properly: enable rule', function () {

                var menuOption, i, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'enableRule') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || state.isEmptySelection || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);
            });


            it('should test context menu returned properly: disable rule', function () {

                var menuOption, i, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'disableRule') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || state.isEmptySelection || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);
            });

            it('should test context menu returned properly: show events', function () {

                var menuOption, stub, key = 'events_generated', i, isDisabled, expected;
                stub = sinon.stub(baseContextMenu.context, 'getMessage', function () {
                    if (key === 'events_generated') {
                        return key;
                    }

                });
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === key) {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_READ);
                menuOption.lockRequired.should.equal(false);

                isDisabled = menuOption.isDisabled();
                expected = !state.isSingleSelection || state.isRuleGroupSelected || state.isDirty;
                isDisabled.should.be.equal(expected);

                stub.restore();
            });


            it('should test context menu returned properly: clear selection', function () {

                var menuOption, stub, selectedItems = {selectedRowIds: [123, 1234]}, i, key, ruleId, isDisabled;

                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'clearSelections') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_READ);
                menuOption.lockRequired.should.equal(false);


                stub = sinon.stub(baseContextMenu.ruleCollection, 'trigger');
                menuOption.handler.apply(baseContextMenu, [null, selectedItems]);
                stub.called.should.be.equal(true);

                key = stub.args[0][0];
                key.should.be.equal('clearSelection');

                ruleId = stub.args[0][1];
                ruleId.should.not.be.equal(null);
                ruleId.should.not.be.equal(undefined);
                (ruleId.length > 0).should.be.equal(true);
                ruleId.should.be.equal(selectedItems.selectedRowIds);


                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);
            });


            it('should test context menu returned properly: move rule', function () {

                var menuOption, i;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'MOVE_RULE') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.hasSubMenu.should.be.equal(true);
            });


            it('should test context menu returned properly: move rule top', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'MOVE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'MOVE_RULE_TOP') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || !state.isSingleSelection ||
                    state.isFirstItemSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

            });


            it('should test context menu returned properly: move rule up', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'MOVE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'MOVE_RULE_UP') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || !state.isSingleSelection ||
                    state.isFirstItemSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

            });


            it('should test context menu returned properly: move rule down', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'MOVE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'MOVE_RULE_DOWN') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || !state.isSingleSelection ||
                    state.isLastItemSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

            });

            it('should test context menu returned properly: move rule bottom', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'MOVE_RULE') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'MOVE_RULE_BOTTOM') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

                isDisabled = menuOption.isDisabled();
                expected = state.isPredefinedSelected || !state.isSingleSelection ||
                    state.isLastItemSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

            });


        });

        describe('Get context menu - Rule Group test cases', function () {
            var state, contextMenu;
            beforeEach(function () {
                state = baseContextMenu.state;
            });

            it('should test context menu returned properly: rule group', function () {

                var menuOption, i;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        break;
                    }
                    menuOption = null;
                }
                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.hasSubMenu.should.be.equal(true);
            });


            it('should test context menu returned properly: create rule group', function () {

                var menuOption, i, j;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'createRuleGroup') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);
            });

            it('should test context menu returned properly: move to rule group', function () {

                var menuOption, i, j;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'moveToRuleGroup') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);

            });


            it('should test context menu returned properly: modify rule group', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'modifyRuleGroup') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                menuOption.lockRequired.should.equal(true);


                isDisabled = menuOption.isDisabled();
                expected = state.isEmptySelection || !state.isSingleSelection || !state.isRuleGroupSelected ||
                    state.isPredefinedSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

            });


            it('should test context menu returned properly: ungroup rule group', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'ungroupRuleGroup') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);

                isDisabled = menuOption.isDisabled();
                expected = state.isEmptySelection || !state.isSingleSelection || !state.isRuleGroupSelected ||
                    state.isPredefinedSelected || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

                (menuOption.lockRequired === true).should.equal(true);
            });


            it('should test context menu returned properly: ungroup rule', function () {

                var menuOption, i, j, isDisabled, expected;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'RULE_GROUP') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'ungroupRule') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                menuOption.capabilities.should.include(baseContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                isDisabled = menuOption.isDisabled();
                expected = state.isEmptySelection ||
                    state.isRuleGroupSelected || !state.isSelectionUnderSameParent || !state.hasCustomParentRuleGroup || !state.isPolicyEditable();
                isDisabled.should.be.equal(expected);

                (menuOption.lockRequired === true).should.equal(true);
            });

        });


        describe('Get context menu - Debug test cases', function () {
            var debugStub, state, contextMenu;
            before(function () {
                state = baseContextMenu.state;
                debugStub = sinon.stub(SMUtil.prototype, 'isDebugMode', function () {
                    return true;
                });
            });

            after(function () {
                debugStub.restore();
            });


            it('should test context menu returned properly (Debug mode): Reload grid', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'reloadRuleGrid') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });

            it('should test context menu returned properly (Debug mode): Log Scroll Position', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'logScrollPosition') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });

            it('should test context menu returned properly (Debug mode): Selected Collection Rule', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'collectionRule') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });


            it('should test context menu returned properly (Debug mode): Selected Grid Rule', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'gridRule') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });


            it('should test context menu returned properly (Debug mode): Rule Collection', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'gridCollection') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });


            it('should test context menu returned properly (Debug mode): Grid Viewport', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'gridViewPort') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(false);
            });


            it('should test context menu returned properly (Debug mode): Highlight row', function () {

                var menuOption, i, j, isDisabled;
                contextMenu = baseContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'debugGrid') {
                        for (j = 0; j < menuOption.items.length; j = j + 1) {
                            if (menuOption.items[j].key === 'highlightRow') {
                                menuOption = menuOption.items[j];
                                break;
                            }
                        }
                        break;
                    }
                    menuOption = null;
                }

                menuOption.should.not.be.equal(null);

                isDisabled = menuOption.isDisabled();
                isDisabled.should.be.equal(false);

                menuOption.lockRequired.should.equal(true);
            });

            it('should test context menu returned properly (Debug mode): Modify rule handler is called', function () {
                var spy, stub, viewConf, selectedItems = {selectedRowIds: [1234]}, name = 'test', desc = 'desc', params, stub2;
                spy = sinon.spy(RuleGroupView.prototype, 'initialize');
                stub2 = sinon.stub(RuleGroupView.prototype, 'render', function() {
                    return this;
                });
                baseContextMenu.modifyRuleGroupHandler(null, selectedItems);
                viewConf = spy.args[0][0];

                stub = sinon.stub(baseContextMenu.ruleCollection, 'modifyRuleGroup');
                viewConf.modifyRuleGroup(name, desc);
                stub.calledOnce.should.be.equal(true);
                params = stub.args[0];
                params[0].should.be.equal(selectedItems.selectedRowIds[0]);
                params[1].should.be.equal(name);
                params[2].should.be.equal(desc);

                viewConf.close();

                spy.restore();
                stub.restore();
                stub2.restore();

            });


            it('should test context menu returned properly (Debug mode): Create rule handler is called', function () {
                var spy, stub, viewConf, selectedItems = {selectedRowIds: [1234], selectedRows: [
                    {}
                ]}, name = 'test', desc = 'desc', params, stub2;
                spy = sinon.spy(RuleGroupView.prototype, 'initialize');
                stub2 = sinon.stub(RuleGroupView.prototype, 'render', function() {
                    return this;
                });
                baseContextMenu.createRuleGroupHandler(null, null);
                spy.calledOnce.should.be.equal(false);

                baseContextMenu.createRuleGroupHandler(null, selectedItems);


                viewConf = spy.args[0][0];
                stub = sinon.stub(baseContextMenu.ruleCollection, 'addRuleGroup');
                viewConf.addRuleGroup(name, desc);
                stub.calledOnce.should.be.equal(true);
                params = stub.args[0];

                params[0].should.be.equal(name);
                params[1].should.be.equal(desc);
                params[2].should.be.equal(selectedItems.selectedRowIds);

                viewConf.close();
                spy.restore();
                stub.restore();
                stub2.restore();

            });


            it('should test context menu returned properly (Debug mode): Move to rule group handler is called', function () {

                var spy, stub, getStub, renderStub, viewConf, selectedItems = {selectedRowIds: [1234], selectedRows: [
                    {}
                ]}, params, ruleGroupId = 123;

                getStub = sinon.stub(baseContextMenu.ruleCollection, 'get', function () {


                    return new baseContextMenu.ruleCollection.model({
                        'global-rule': false
                    });

                });
                spy = sinon.spy(MoveRuleGroupView.prototype, 'initialize');

                renderStub = sinon.stub(MoveRuleGroupView.prototype, 'render', function () {
                    return this;
                });
                baseContextMenu.moveToRuleGroupHandler(null, null);
                spy.calledOnce.should.be.equal(false);

                baseContextMenu.moveToRuleGroupHandler(null, selectedItems);


                viewConf = spy.args[0][0];
                stub = sinon.stub(baseContextMenu.ruleCollection, 'moveRulesOnStore');
                viewConf.moveRulesToGroup(selectedItems, ruleGroupId);
                stub.calledOnce.should.be.equal(true);
                params = stub.args[0];

                params[0].should.be.equal(selectedItems.selectedRowIds);
                params[1].should.be.equal(ruleGroupId);
                params[2].should.be.equal(baseContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);

                viewConf.close();
                renderStub.restore();

                stub.restore();
                getStub.restore();
                spy.restore();
            });


            it('should test context menu returned properly (Debug mode): highlight rule handler is called', function () {
                var spy, stub, viewConf, selectedItems = {selectedRows: [1234]}, params, ruleId = 123;
                spy = sinon.spy(HighlightRuleView.prototype, 'initialize');
                baseContextMenu.highlightRuleHandler(null, null);
                spy.calledOnce.should.be.equal(false);

                baseContextMenu.highlightRuleHandler(null, selectedItems);

                viewConf = spy.args[0][0];

                stub = sinon.stub(baseContextMenu.ruleCollection, 'highlightRule');
                viewConf.highlightRule(ruleId);
                stub.calledOnce.should.be.equal(true);
                params = stub.args[0];
                params[0].should.be.equal('highlightRule');
                params[1].ruleIds.should.include(ruleId);
                params[1].isRowEditable.should.be.equal(false);

                viewConf.close();

                spy.restore();
                stub.restore();

            });


        });

    });

});