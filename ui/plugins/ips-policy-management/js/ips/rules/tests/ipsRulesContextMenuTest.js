/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
/*
 * Test for ips Rule context menu
 *
 * @author sriashish@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../conf/ipsRulesContextMenu.js',
    '../models/ipsRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js'
], function (IpsRuleContextMenu, IpsRuleCollection, BaseContextMenu) {


    describe("IPS rule context menu unit-tests", function () {

        var ipsRuleContextMenu, ipsRuleCollectionObj, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/ips/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });

            ipsRuleCollectionObj = new IpsRuleCollection("cuid", "1234", context);
            ipsRuleContextMenu = new IpsRuleContextMenu(context, ipsRuleCollectionObj, ipsRuleCollectionObj.policyManagementConstants);
            ipsRuleContextMenu.state = {
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

        it("ips context menu initialization", function () {
            ipsRuleContextMenu.should.exist;
        });

        describe('ips Context Menu specific test cases', function () {


            it('Should check if paste rule handler calls rulecollection with proper rule name', function () {
                var eventName ={}, selectedItems ={};
                var stub = sinon.stub(ipsRuleCollectionObj, 'pasteInPlaceRule');
                ipsRuleContextMenu.pasteInPlaceRuleHandler(eventName, selectedItems);
                stub.called.should.be.equal(true);

                stub.restore();

            });

            it('Should check if paste in place is disabled', function () {
                var selectedItems = {selectedRowIds: [1234]}, isDisabled, expected, state;
                state = ipsRuleContextMenu.state;
                ipsRuleCollectionObj.hasCopiedRules = true;
                expected = ipsRuleContextMenu.ruleCollection.hasCopiedRules || !state.isSingleSelection || !state.isPolicyEditable() || ipsRuleContextMenu.ruleCollection.length > 0;


                isDisabled = ipsRuleContextMenu.shouldDisablePasteInPlace(null, selectedItems);
                isDisabled.should.be.equal(expected);
            });          


        });

        describe('Context menu: Add Rule Before ', function () {
            var menuOption, i, contextMenu, state = null, baseMenuStub;
            before(function () {
                baseMenuStub = sinon.stub(BaseContextMenu.prototype, 'getContextMenuItems', function () {
                    return [];
                });

                contextMenu = ipsRuleContextMenu.getContextMenuItems(state);
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
                menuOption.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
            });

            describe('Sub Context menu: Add IPS Before', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_IPS_BEFORE') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(ipsRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add IPS before', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add IPS before context menu is triggered', function () {
                    
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                }); 

                it('Should check if the rule is properly added in the rule collection  when add IPS before context menu is triggered ', function () {
                    
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(ipsRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                    params[2].should.be.equal(ipsRuleContextMenu.policyManagementConstants.IPS_TYPE_DEFAULT);
                    
                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add EXEMPT Before', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_EXEMPT_BEFORE') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(ipsRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add EXEMPT before', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add EXEMPT before context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add EXEMPT before context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(ipsRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                    params[2].should.be.equal(ipsRuleContextMenu.policyManagementConstants.IPS_TYPE_EXEMPT);

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

                contextMenu = ipsRuleContextMenu.getContextMenuItems(state);
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
                menuOption.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
            });

            describe('Sub Context menu: Add IPS after', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_IPS_AFTER') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(ipsRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add IPS after', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add IPS after context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add IPS after context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);
                    
                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(ipsRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                    params[2].should.be.equal(ipsRuleContextMenu.policyManagementConstants.IPS_TYPE_DEFAULT);

                    addRuleStub.restore();
                });
            });


            describe('Sub Context menu: Add EXEMPT After', function () {
                var j, subMenu, addRuleStub;
                before(function () {
                    for (j = 0; j < menuOption.items.length; j = j + 1) {
                        subMenu = menuOption.items[j];
                        if (subMenu.key === 'ADD_EXEMPT_AFTER') {
                            break;
                        }
                    }

                    addRuleStub = sinon.stub(ipsRuleContextMenu.ruleCollection, 'addRule');
                });

                after(function () {
                    addRuleStub.restore();
                });

                it('should test sub context menu returned properly : Add EXEMPT after', function () {
                    subMenu.should.not.be.equal(null);
                    subMenu.capabilities.should.include(ipsRuleContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add EXEMPT after context menu is triggered', function () {
                    subMenu.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });


                it('Should check if the rule is properly added in the rule collection  when add EXEMPT after context menu is triggered ', function () {
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    subMenu.handler('addRule', selectedItems);
                    
                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(ipsRuleContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                    params[2].should.be.equal(ipsRuleContextMenu.policyManagementConstants.IPS_TYPE_EXEMPT);

                    addRuleStub.restore();
                });
            });

        });
    });


});
