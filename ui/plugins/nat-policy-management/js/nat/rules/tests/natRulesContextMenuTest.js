/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
/*
 * Test for NAT Rule context menu
 *
 * @author tgarg@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../conf/natRulesContextMenu.js',
    '../models/natRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js'
], function (NatRuleContextMenu, NatRuleCollection, BaseContextMenu) {


    describe("NAT rule context menu unit-tests", function () {

        var natRuleContextMenu, natRuleCollectionObj, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/nat/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });

            natRuleCollectionObj = new NatRuleCollection("cuid", "1234", context);
            natRuleContextMenu = new NatRuleContextMenu(context, natRuleCollectionObj, natRuleCollectionObj.policyManagementConstants);
            natRuleContextMenu.state = {
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

        it("NAT context menu initialization", function () {
            natRuleContextMenu.should.exist;
        });

        describe('NAT Context Menu specific test cases', function () {


            it('Should check if paste rule handler calls rulecollection with proper rule name', function () {
                var stub = sinon.stub(natRuleCollectionObj, 'pasteInPlaceRule');
                natRuleContextMenu.pasteInPlaceRuleHandler();
                stub.called.should.be.equal(true);

                stub.restore();

            });

            it('Should check if paste in place is disabled', function () {
                var selectedItems = {selectedRowIds: [1234]}, isDisabled, expected, state;
                state = natRuleContextMenu.state;
                natRuleCollectionObj.hasCopiedRules = true;
                expected = natRuleContextMenu.ruleCollection.hasCopiedRules || !state.isSingleSelection || !state.isPolicyEditable() || natRuleContextMenu.ruleCollection.length > 0;


                isDisabled = natRuleContextMenu.shouldDisablePasteInPlace(null, selectedItems);
                isDisabled.should.be.equal(expected);
            });

            it('Should check if add static destination rule be disabled', function () {
                var isDisabled, expected;
                expected = natRuleContextMenu.shouldDisableAddRule() || natRuleContextMenu.ruleCollection.isGroupPolicy();
                isDisabled = natRuleContextMenu.shouldDisableAddDestinationStaticRule();

                isDisabled.should.be.equal(expected);

            });

            it('Should check if the pdf action is properly triggered on the view menu option is available ', function () {
                var menuOption, baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                var contextMenu = natRuleContextMenu.getContextMenuItems();
                for (var i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'exportPDF') {
                        break
                            ;
                    }
                }

                menuOption.should.not.be.equal(null);
                menuOption.capabilities.should.include(natRuleContextMenu.policyManagementConstants.EXPORT_POLICY_CAPABILITY);

                baseMenuStub.restore();
            });
        });

        describe('Context menu: Add Rule Before ', function () {
            var menuOption, i, contextMenu, state = null, baseMenuStub;
            before(function () {
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                contextMenu = natRuleContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'ADD_RULE_BEFORE') {
                        break;
                    }
                }

            });

            after(function () {
                baseMenuStub.restore();
            });

            it('should test context menu returned properly : Add rule before', function () {
                menuOption.should.not.be.equal(null);
                menuOption.hasSubMenu.should.be.equal(true);
                menuOption.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
            });

            describe('Sub Context menu: Add Source Rule Before', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_SOURCE_BEFORE') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add source rule before', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add source rule before context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add source rule before context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_SOURCE);

                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add Static Rule Before', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_STATIC_BEFORE') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add static rule before', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add static rule before context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add static rule before context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_STATIC);

                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add destination Rule Before', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_DESTINATION_BEFORE') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add destination rule before', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add destination rule before context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add destination rule before context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_DESTINATION);

                    addRuleStub.restore();
                });
            });

        });



        describe('Context menu: Add Rule After ', function () {
            var menuOption, i, contextMenu, state = null, baseMenuStub;
            before(function () {
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                contextMenu = natRuleContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'ADD_RULE_AFTER') {
                        break;
                    }
                    menuOption = null;
                }

            });

            after(function () {
                baseMenuStub.restore();
            });

            it('should test context menu returned properly : Add rule after', function () {
                menuOption.should.not.be.equal(null);
                menuOption.hasSubMenu.should.be.equal(true);
                menuOption.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
            });

            describe('Sub Context menu: Add Source Rule after', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_SOURCE_AFTER') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add source rule after', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add source rule after context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add source rule after context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_SOURCE);

                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add Static Rule After', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_STATIC_AFTER') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add static rule after', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add static rule after context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add static rule after context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_STATIC);

                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add destination Rule After', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_DESTINATION_AFTER') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(natRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add destination rule after', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(natRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add destination rule after context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add destination rule after context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(natRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                    params[2].should.be.equal(natRuleContextMenu.policyManagementConstants.NAT_TYPE_DESTINATION);

                    addRuleStub.restore();
                });


            });

        });
    });


});
