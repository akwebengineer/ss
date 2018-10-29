/*
 * Test for Fw Rule context menu
 *
 * @author tgarg@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../conf/fwRulesContextMenu.js',
    '../models/fwRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js'
], function (FwRuleContextMenu, FwRuleCollection, BaseContextMenu) {


    describe("FW rule context menu unit-tests", function () {

        var fwRuleContextMenu, fwRuleCollectionObj, context = new Slipstream.SDK.ActivityContext();
        before(function () {

            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });

            fwRuleCollectionObj = new FwRuleCollection("cuid", "1234", context);
            fwRuleContextMenu = new FwRuleContextMenu(context, fwRuleCollectionObj, fwRuleCollectionObj.policyManagementConstants);
            fwRuleContextMenu.state = {
                selectedRules: {},
                isPolicyEditable: function () {
                },
                isEmptySelection: false,
                isRuleGroupSelected: false
            };
        });
        after(function() {
            $.mockjax.clear();
        });

        it("FW context menu initialization", function () {
            fwRuleContextMenu.should.exist;
        });

        describe('FW Context Menu specific test cases', function () {

            it('Should check if the rules are under same predefined group', function () {
                var ruleModel, rules, check;
                ruleModel = fwRuleCollectionObj.model;
                rules = [new ruleModel({
                    'global-rule': true
                }), new ruleModel({
                    'global-rule': false
                })];

                check = fwRuleContextMenu.areRulesUnderSamePredefinedGroup(rules);
                check.should.be.equal(false);

                ruleModel = fwRuleCollectionObj.model;
                rules = [new ruleModel({
                    'global-rule': true
                }), new ruleModel({
                    'global-rule': true
                })];
                check = fwRuleContextMenu.areRulesUnderSamePredefinedGroup(rules);
                check.should.be.equal(true);

                ruleModel = fwRuleCollectionObj.model;
                rules = [new ruleModel({
                    'global-rule': false
                }), new ruleModel({
                    'global-rule': false
                })];
                check = fwRuleContextMenu.areRulesUnderSamePredefinedGroup(rules);
                check.should.be.equal(true);


            });


            it('Should check if move to rule group is disabled', function () {
                var ruleModel, rules, check1, baseMenuStub, check2 = true, returnedValue;
                ruleModel = fwRuleCollectionObj.model;


                ruleModel = fwRuleCollectionObj.model;
                rules = [new ruleModel({
                    'global-rule': false, id: 123
                }), new ruleModel({
                    'global-rule': false, id: 1234
                })];
                fwRuleContextMenu.state.selectedRules = rules;
                check1 = fwRuleContextMenu.areRulesUnderSamePredefinedGroup(rules);

                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'shouldDisableMoveToRuleGroup', function () {
                    return check2;
                });

                returnedValue = fwRuleContextMenu.shouldDisableMoveToRuleGroup(rules);
                returnedValue.should.be.equal(check2 || !check1);

                baseMenuStub.restore();
                check2 = false;
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'shouldDisableMoveToRuleGroup', function () {
                    return check2;
                });

                returnedValue = fwRuleContextMenu.shouldDisableMoveToRuleGroup(rules);
                returnedValue.should.be.equal(check2 || !check1);

                baseMenuStub.restore();

            });


            it('Should check if create rule group is disabled', function () {
                var ruleModel, rules, check1, baseMenuStub, check2 = true, returnedValue;
                ruleModel = fwRuleCollectionObj.model;


                ruleModel = fwRuleCollectionObj.model;
                rules = [new ruleModel({
                    'global-rule': false, id: 123
                }), new ruleModel({
                    'global-rule': false, id: 1234
                })];
                fwRuleContextMenu.state.selectedRules = rules;
                check1 = fwRuleContextMenu.areRulesUnderSamePredefinedGroup(rules);


                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'shouldDisableCreateRuleGroup', function () {
                    return check2;
                });

                returnedValue = fwRuleContextMenu.shouldDisableCreateRuleGroup(rules);
                returnedValue.should.be.equal(check2 || !check1);

                baseMenuStub.restore();
                check2 = false;
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'shouldDisableCreateRuleGroup', function () {
                    return check2;
                });

                returnedValue = fwRuleContextMenu.shouldDisableCreateRuleGroup(rules);
                returnedValue.should.be.equal(check2 || !check1);

                baseMenuStub.restore();

            });


            it('Should check if paste rule handler calls rulecollection with proper rule name', function () {
                var name1 = 'xyz', stub, selectedItems = { 'selectedRows': [
                    {'name': [name1]}
                ]};
                stub = sinon.stub(fwRuleCollectionObj, 'pasteInPlaceRule');
                fwRuleContextMenu.pasteInPlaceRuleHandler(null, selectedItems);
                stub.calledOnce.should.be.equal(true);
                stub.args[0][0].should.be.equal(name1);

            });

            it('Should check if paste in place is disabled', function () {
                var selectedItems = {selectedRowIds: [1234]}, isDisabled, expected, state;
                state = fwRuleContextMenu.state;
                fwRuleCollectionObj.hasCopiedRules = true;
                expected = fwRuleContextMenu.ruleCollection.hasCopiedRules || !state.isSingleSelection || !state.isPolicyEditable() || state.isEmptySelection
                    || !state.isRuleGroupSelected || selectedItems.length !== 1 || fwRuleContextMenu.ruleCollection.length > 2;


                isDisabled = fwRuleContextMenu.shouldDisablePasteInPlace(null, selectedItems);
                isDisabled.should.be.equal(expected);

                selectedItems = null;
                isDisabled = fwRuleContextMenu.shouldDisablePasteInPlace(null, selectedItems);
                isDisabled.should.be.equal(true);
            });

            it('Should check if the pdf action is properly triggered on the view menu option is available ', function () {
                var menuOption, baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                var contextMenu = fwRuleContextMenu.getContextMenuItems();
                for (var i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'exportPDF') {
                        break;
                    }
                }

                menuOption.should.not.be.equal(null);
                menuOption.capabilities.should.include(fwRuleContextMenu.policyManagementConstants.EXPORT_POLICY_CAPABILITY);

                baseMenuStub.restore();
            });


        });

        describe('Context menu: Add Rule Before ', function () {
            var menuOption, i, contextMenu, state = null, baseMenuStub, addRuleStub;
            beforeEach(function () {
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                contextMenu = fwRuleContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'addBefore') {
                        break;
                    }
                }

                addRuleStub = sinon.stub(fwRuleContextMenu.ruleCollection, 'addRule')

            });

            afterEach(function () {
                baseMenuStub.restore();
                addRuleStub.restore();
            });

            it('should test context menu returned properly : Add rule before', function () {

                menuOption.should.not.be.equal(null);
                menuOption.capabilities.should.include(fwRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);

            });


            it('Should return gracefully in case the selected item list is empty when add rule before context menu is triggered', function () {
                menuOption.handler(null, null);
                addRuleStub.called.should.be.equal(false);
            });


            it('Should check if the rule is properly added in the rule collection  when add rule before context menu is triggered ', function () {
                var selectedItems, params, id = 123;
                selectedItems = {selectedRows: [{'id': id}]};
                menuOption.handler('addRule', selectedItems);

                addRuleStub.called.should.be.equal(true);
                params = addRuleStub.args[0];
                params[0].should.be.equal(id);
                params[1].should.be.equal(fwRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);

            });

        });

        describe('Context menu: Add Rule After ', function () {
            var menuOption, i, contextMenu, state = null, baseMenuStub, addRuleStub;
            beforeEach(function () {
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                contextMenu = fwRuleContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'addAfter') {
                        break;
                    }
                    menuOption = null;
                }
                addRuleStub = sinon.stub(fwRuleContextMenu.ruleCollection, 'addRule');

            });

            afterEach(function () {
                baseMenuStub.restore();
                addRuleStub.restore();
            });

            it('should test context menu returned properly : Add rule after', function () {

                menuOption.should.not.be.equal(null);
                menuOption.capabilities.should.include(fwRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);

            });


            it('Should return gracefully in case the selected item list is empty when add rule after context menu is triggered', function () {
                menuOption.handler(null, null);
                addRuleStub.called.should.be.equal(false);
            });


            it('Should check if the rule is properly added in the rule collection  when add rule after context menu is triggered ', function () {
                var selectedItems, params, id = 123;
                selectedItems = {selectedRows: [{'id': id}]};
                menuOption.handler('addRule', selectedItems);

                addRuleStub.called.should.be.equal(true);
                params = addRuleStub.args[0];
                params[0].should.be.equal(id);
                params[1].should.be.equal(fwRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);

            });

        });


    });


});
