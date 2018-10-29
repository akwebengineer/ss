/**
 * Created by skesarwani on 9/29/16.
 */
define([], function () {
  var MockColumnMixin = function () {

    },
    testMockedParentHoverDrop,
    spyParentHoverDrop = sinon.spy(function() {
      return testMockedParentHoverDrop;
    }),
    context = {
      getMessage : function (msg) {
        return msg;
      }
    };
  MockColumnMixin.prototype = {
    hoverDrop : spyParentHoverDrop
  };
  var stubs = {
    '/installed_plugins/base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js': MockColumnMixin
  };
  var loadContext = createContext(stubs, 'testNatRulesGridTranslatedPacketDestinationColumnMixin');
  loadContext(['/installed_plugins/nat-policy-management/js/nat/rules/conf/natRulesGridTranslatedPacketDestinationColumnMixin.js'], function (TPDMixin) {
    describe('Translated Packet Destination Column Mixin Test cases', function () {
      var testNatType,
        testTranslationType,
        testTranslatedPacket,
        testTranslationAddress,
        testTranslationNatPool,
        testToJson,
        spySet,
        testGetRuleModel = function () {
          return {
            getNatType : function () {
              return testNatType;
            },
            getTranslationType : function () {
              return testTranslationType;
            },
            getTranslatedPacket : function () {
              return testTranslatedPacket;
            },
            getTranslationAddress : function () {
              return testTranslationAddress;
            },
            getTranslationNatPool : function () {
              return testTranslationNatPool;
            },
            toJSON : function () {
              return testToJson;
            },
            set : spySet
          };
        };
      it('test getTranslatedPacketDestinationDndConfig', function () {
        var mixin = new TPDMixin (),
          retVal = mixin.getTranslatedPacketDestinationDndConfig();
        assert.isObject(retVal);
      });

      it('test hoverDrop with Source nat type', function () {
        var mixin = new TPDMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE', id: 96},
            helper : {h : 'help'}
          },
          retVal;
        testMockedParentHoverDrop = true;
        testNatType = 'SOURCE';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(spyParentHoverDrop.calledWith(testCallback));
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test hoverDrop with drop not allowed', function () {
        var mixin = new TPDMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE', id: 96},
            helper : {h : 'help'}
          },
          retVal;
        testMockedParentHoverDrop = false;
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(spyParentHoverDrop.calledWith(testCallback));
      });

      it('test hoverDrop with drop allowed', function () {
        var mixin = new TPDMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'DESTINATION'},
            helper : {h : 'help'}
          },
          retVal;
        testMockedParentHoverDrop = true;
        testNatType = 'DESTINATION';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(true, retVal);
        assert(spyParentHoverDrop.calledWith(testCallback));
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test validateItems nat_tpd_cell_only_one_item_drop_allowed', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'ABC'},
          testDragItems = [1,2,3],
          testDragType = 'ADDRESS_ILA',
          testRetVal = {isValid: false,
            errorMessage: 'nat_tpd_cell_only_one_item_drop_allowed'};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });

      it('test validateItems STATIC rule with INET translation', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'STATIC', 'translated-traffic-match-type' : 'INET'},
          testDragItems = [],
          testDragType = 'ADDRESS_ILA',
          testRetVal = {isValid: false, errorMessage: 'nat_tpd_cell_static_rule_only_host_network_address_allowed_and_translation_is_not_inet'};
        testNatType = 'STATIC';
        testTranslationType = 'INET';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);
      });

      it('test validateItems STATIC rule without INET translation, with drag type ADDRESS but adress type not allowed', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'STATIC', 'translated-traffic-match-type' : 'ADDRESS'},
          testDragItems = [{'address-type' : 'IPADDRESS_CUSTOM'}],
          testDragType = 'ADDRESS',
          testRetVal = {isValid: false, errorMessage: 'nat_tpd_cell_static_rule_only_host_network_address_allowed_and_translation_is_not_inet'};

        testNatType = 'STATIC';
        testTranslationType = 'ADDRESS';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);
      });

      it('test validateItems STATIC rule without INET translation, with drag type ADDRESS and adress type allowed', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'STATIC', 'translated-traffic-match-type' : 'ADDRESS'},
          testDragItems = [{'address-type' : 'IPADDRESS'}],
          testDragType = 'ADDRESS';
        testNatType = 'STATIC';
        testTranslationType = 'ADDRESS';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.equal(retVal, true);

      });

      it('test validateItems DESTINATION rule with drag type ADDRESS', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'DESTINATION'},
          testDragItems = [{'address-type' : 'IPADDRESS_CUSTOM'}],
          testDragType = 'ADDRESS',
          testRetVal = {isValid: false, errorMessage: 'nat_tpd_cell_dest_rule_only_one_dest_natpool_allowed'};
        testNatType = 'DESTINATION';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });

      it('test validateItems DESTINATION rule with drag type SOURCE NAT POOL ', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'DESTINATION'},
          testDragItems = [{'pool-type' : 0}],
          testDragType = 'NATPOOL',
          testRetVal = {isValid: false, errorMessage: 'nat_tpd_cell_dest_rule_only_one_dest_natpool_allowed'};
        testNatType = 'DESTINATION';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });
      it('test validateItems DESTINATION rule with drag type DESTINATION NAT POOL ', function () {
        var mixin = new TPDMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'DESTINATION'},
          testDragItems = [{'pool-type' : 1}],
          testDragType = 'NATPOOL';
        testNatType = 'DESTINATION';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.equal(retVal, true);

      });

      it('test afterDrop validation fail', function () {
        var mixin = new TPDMixin(), spyValidateItems = sinon.spy(function () {
          return {a:2,v:45};
        }), spyMergeItems = sinon.spy();
        mixin.validateItems = spyValidateItems;
        mixin.mergeItems = spyMergeItems;
        var testHelper = [{
            draggedItems : 123,
            dragObjectType : 'asd'
          }],
          testCallbackData = {
            droppableRow : {
              'xg' : 'my name is ola not uber'
            },
            helper : testHelper
          };

        var retVal = mixin.afterDrop(testCallbackData);
        assert.deepEqual(retVal, {a:2,v:45});
        assert(spyValidateItems.calledWith(testCallbackData.droppableRow, testHelper[0].draggedItems, testHelper[0].dragObjectType));
        assert(spyMergeItems.notCalled);
      });

      it('test afterDrop validation pass', function () {
        var mixin = new TPDMixin(), spyValidateItems = sinon.spy(function () {
          return true;
        }), spyMergeItems = sinon.spy();;
        mixin.validateItems = spyValidateItems;
        mixin.mergeItems = spyMergeItems;
        var testHelper = [{
            draggedItems : 123,
            dragObjectType : 'asd'
          }],
          testCallbackData = {
            droppableRow : {
              'xg' : 'my name is ola not uber'
            },
            helper : testHelper
          };

        var retVal = mixin.afterDrop(testCallbackData);
        assert.equal(retVal, false);
        assert(spyValidateItems.calledWith(testCallbackData.droppableRow, testHelper[0].draggedItems, testHelper[0].dragObjectType));
        assert(spyMergeItems.calledWith(testCallbackData.droppableRow, testHelper[0].draggedItems, testHelper[0].dragObjectType));
      });

      it('test beforeDrag if policy read only', function () {
        var mixin = new TPDMixin();
        var spyIsPolicyReadOnly = sinon.spy(function () {
          return true;
        }), testRuleGridConfigInstance = {
          ruleCollection: {
            isPolicyReadOnly: spyIsPolicyReadOnly
          }
        };
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.beforeDrag();
        assert.equal(ret, false);
        assert(spyIsPolicyReadOnly.calledOnce);
      });

      it('test beforeDrag if drag allowed', function () {
        var mixin = new TPDMixin();
        var spyIsPolicyReadOnly = sinon.spy(function () {
            return false;
          }), spyGetDragItems = sinon.spy(function () {
            return {'test' : 'pass'};
          }),
          testCallbackData = {
            draggableRows : 'i am legend',
            helper : 'Yes we need'
          },
          testRuleGridConfigInstance = {
            ruleCollection: {
              isPolicyReadOnly: spyIsPolicyReadOnly
            }
          };
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        mixin.getDragItems = spyGetDragItems;
        var ret = mixin.beforeDrag(testCallbackData);
        assert.deepEqual(ret, {'test' : 'pass'});
        assert(spyIsPolicyReadOnly.calledOnce);
        assert(spyGetDragItems.calledWith(testCallbackData.draggableRows, testCallbackData.helper));
      });

      it('test getDragItems for group policy', function () {
        var mixin = new TPDMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function (){
                return true;
              }
            }
          },
          testDraggedItemsRowData = [{
            'nat-type' : 'ABC',
            'translated-packet' :{
              'translated-address' : 123,
              'pool-addresses' : 223
            }
          }],
          testDragHelper = [{}];
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, false);
      });

      it('test getDragItems for device policy and static rule but no address', function () {
        var mixin = new TPDMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function (){
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'STATIC',
            'translated-packet' :{
              'translated-address' : [],
              'pool-addresses' : 223
            }
          }];
        testNatType = 'STATIC';
        testTranslationAddress = [];
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, false);
      });

      it('test getDragItems for device policy and static rule and address defined', function () {
        var mixin = new TPDMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function (){
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'STATIC',
            'translated-packet' :{
              'translated-address' : [2,44,5],
              'pool-addresses' : 223
            }
          }];
        testNatType = 'STATIC';
        testTranslationAddress = [2,44,5];
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, true);
        assert.deepEqual(testDragHelper[0].draggedItems, [testDraggedItemsRowData[0]['translated-packet']['translated-address']]);
        assert.equal(testDragHelper[0].dragObjectType, 'ADDRESS');
      });


      it('test getDragItems for device policy and DESTINATION rule and nat pool not defined', function () {
        var mixin = new TPDMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function (){
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'DESTINATION',
            'translated-packet' :{
              'translated-address' : [2,44,5],
              'pool-addresses' : {}
            }
          }];
        testNatType = 'DESTINATION';
        testTranslationNatPool = {};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, false);
      });

      it('test getDragItems for device policy and DESTINATION rule and nat pool is defined', function () {
        var mixin = new TPDMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function (){
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'DESTINATION',
            'translated-packet' :{
              'translated-address' : [2,44,5],
              'pool-addresses' : {w:'rrt', 'pool-type': 1}
            }
          }];
        testNatType = 'DESTINATION';
        testTranslationNatPool = {w:'rrt'};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, true);
        assert.deepEqual(testDragHelper[0].draggedItems, [testDraggedItemsRowData[0]['translated-packet']['pool-addresses']]);
        assert.equal(testDragHelper[0].dragObjectType, 'NATPOOL');
      });

      it('test mergeItems drag type is ADDRESS and no merge', function () {
        var mixin = new TPDMixin();
        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
          testDraggedItems = [{id : 87, type: 'address', 'my' : 'maa'}],
          testHoveredRowData = {
            'id' : 54,
            'translated-packet' :{
              'translated-address' : {id: 87, t :'text'},
              'pool-addresses' : {id : 65, w:'rrt'}
            }
          };
        testTranslationAddress = {id: 87, t :'text'};
        spySet = sinon.spy();
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        mixin.mergeItems(testHoveredRowData, testDraggedItems, 'ADDRESS');
        assert(spyModifyRule.notCalled);
        assert(spySet.notCalled);
      });


      it('test mergeItems drag type is ADDRESS and merge happens', function () {
        var mixin = new TPDMixin();
        var spyModifyRule = sinon.spy(),
          testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
          testDraggedItems = [{id : 7, type: 'address', 'my' : 'maa'}],
          testHoveredRowData = {
            'id' : 54,
            'translated-packet' :{
              'translated-address' : {id: 87, t :'text'},
              'pool-addresses' : {id : 65, w:'rrt'}
            }
          };
        testTranslationAddress = {id: 87, t :'text'};
        testTranslatedPacket = {a:'a' , 'b':'bcd'};
        testToJson = 'retVal';
        spySet = sinon.spy();
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        mixin.mergeItems(testHoveredRowData, testDraggedItems, 'ADDRESS');

        var testMerge = $.extend({}, testTranslatedPacket, {
          'translated-address' : testDraggedItems[0]
        });
        assert(spySet.calledWith('translated-packet', testMerge));
        assert(spyModifyRule.calledWith('retVal', {'makeRowEditable': false}));
      });

      it('test mergeItems drag type is NATPOOL and no merge', function () {
        var mixin = new TPDMixin();
        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
          testDraggedItems = [{id : 87, type: 'natpool', 'my' : 'maa'}],
          testHoveredRowData = {
            'id' : 54,
            'translated-packet' :{
              'translated-address' : {id: 87, t :'text'},
              'pool-addresses' : {id : 87, w:'rrt'}
            }
          };
        testTranslationNatPool = {id : 87, w:'rrt'};
        spySet = sinon.spy();
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        mixin.mergeItems(testHoveredRowData, testDraggedItems, 'NATPOOL');
        assert(spyModifyRule.notCalled);
        assert(spySet.notCalled);
      });

      it('test mergeItems drag type is NATPOOL and merge happens', function () {
        var mixin = new TPDMixin();
        var spyModifyRule = sinon.spy(),
          testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
          testDraggedItems = [{id : 7, type: 'natpool', 'my' : 'maa'}],
          testHoveredRowData = {
            'id' : 54,
            'translated-packet' :{
              'translated-address' : {id: 87, t :'text'},
              'pool-addresses' : {id : 65, w:'rrt'}
            }
          };
        testTranslationNatPool = {id : 65, w:'rrt'};
        testTranslatedPacket = {a:'a' , 'b':'bcd'};
        testToJson = 'retVal';
        spySet = sinon.spy();
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        mixin.mergeItems(testHoveredRowData, testDraggedItems, 'NATPOOL');

        var testMerge = $.extend({}, testTranslatedPacket, {
          'pool-addresses' : testDraggedItems[0]
        });
        assert(spySet.calledWith('translated-packet', testMerge));
        assert(spyModifyRule.calledWith('retVal', {'makeRowEditable': false}));
      });

      deleteContext('testNatRulesGridTranslatedPacketDestinationColumnMixin');

    });
  });
});