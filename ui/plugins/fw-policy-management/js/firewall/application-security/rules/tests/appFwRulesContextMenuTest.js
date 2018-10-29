/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
/*
 * Test for app FW Rule context menu
 *
 * @author sriashish@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../conf/appFwRulesContextMenu.js',
    '../model/AppFwRulesCollection.js',
    '../../../../../../base-policy-management/js/policy-management/rules/conf/rulesContextMenu.js'
], function (AppFirewallRulesContextMenu, AppFwRuleCollection, BaseContextMenu) {


    describe("AppFw rule context menu unit-tests", function () {

        var AppFwRulesContextMenu, AppFwRuleCollectionObj, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/AppFw/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });

            AppFwRuleCollectionObj = new AppFwRuleCollection("cuid", "1234", context);
            AppFwRulesContextMenu = new AppFirewallRulesContextMenu(context, AppFwRuleCollectionObj, AppFwRuleCollectionObj.policyManagementConstants);
            AppFwRulesContextMenu.state = {
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

        it("AppFw context menu initialization", function () {
            AppFwRulesContextMenu.should.exist;
        });

        describe('Context menu: Add Rule Before ', function () {
            var menuOption, i, contextMenu, baseMenuStub;
            var state = {selectedRules: Array[0], isEmptySelection: true, isSingleSelection: false, isPredefinedSelected: false, isRuleGroupSelected: false};
            before(function () {              
                
                contextMenu = AppFwRulesContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'addBefore') {
                        break;
                    }
                }

            });
            

            it('should test context menu returned properly : Add rule before', function () {
                
                menuOption.should.not.be.equal(null);                
                menuOption.capabilities.should.include(AppFwRulesContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
            });


                it('Should return gracefully in case the selected item list is empty when add AppFw before context menu is triggered', function () {
                    
                    addRuleStub = sinon.stub(AppFwRulesContextMenu.ruleCollection, 'addRule');
                    menuOption.handler(null, null);
                    addRuleStub.called.should.be.equal(false);
                });

                it('Should check if the rule is properly added in the rule collection  when add AppFw before context menu is triggered ', function () {
                    
                    var selectedItems, params, id = 123;
                    selectedItems = {selectedRows: [{'id': id}]};
                    menuOption.handler('addRule', selectedItems);

                    addRuleStub.calledOnce.should.be.equal(true);
                    params = addRuleStub.args[0];
                    params[0].should.be.equal(id);
                    params[1].should.be.equal(AppFwRulesContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP);
                                      
                    addRuleStub.restore();
                });                       

        });



        describe('Context menu: Add Rule After ', function () {
            
            var menuOption, i, contextMenu, baseMenuStub;
            var state = {selectedRules: Array[0], isEmptySelection: true, isSingleSelection: false, isPredefinedSelected: false, isRuleGroupSelected: false};
            before(function () {                
                contextMenu = AppFwRulesContextMenu.getContextMenuItems(state);
                for (i = 0; i < contextMenu.length; i = i + 1) {
                    menuOption = contextMenu[i];
                    if (menuOption.key === 'addAfter') {
                        break;
                    }
                    menuOption = null;
                }

            });          

                it('should test context menu returned properly : Add rule after', function () {
                   
                    menuOption.should.not.be.equal(null);
                   
                    menuOption.capabilities.should.include(AppFwRulesContextMenu.policyManagementConstants.CAPABILITY_MODIFY);
                });

                it('Should return gracefully in case the selected item list is empty when add AppFw after context menu is triggered', function () {
                        
                        addRuleStub = sinon.stub(AppFwRulesContextMenu.ruleCollection, 'addRule');
                        menuOption.handler(null, null);
                        addRuleStub.called.should.be.equal(false);
                    });

                it('Should check if the rule is properly added in the rule collection  when add AppFw after context menu is triggered ', function () {
                        
                        var selectedItems, params, id = 123;
                        selectedItems = {selectedRows: [{'id': id}]};
                        menuOption.handler('addRule', selectedItems);

                        addRuleStub.calledOnce.should.be.equal(true);
                        params = addRuleStub.args[0];
                        params[0].should.be.equal(id);
                        params[1].should.be.equal(AppFwRulesContextMenu.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN);
                                          
                        addRuleStub.restore();
                });           


        });
    });


});
