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
  var loadContext = createContext(stubs, 'testNatRulesGridTranslatedPacketSourceColumnMixin');
  loadContext(['/installed_plugins/nat-policy-management/js/nat/rules/conf/natRulesGridTranslatedPacketSourceColumnMixin.js'], function (TPSMixin) {
    describe('Translated Packet Source Column Mixin Test cases', function () {
      var testNatType,
        testTranslationType,
        testTranslatedPacket,
        testTranslationAddress,
        testTranslationNatPool,
        testToJson,
        spySet,
        testIsRuleGrp,
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
            set : spySet,
            isRuleGroup : function () {
              return testIsRuleGrp;
            }
          };
        };

      it('test getTranslatedPacketSourceDndConfig', function () {
        var mixin = new TPSMixin (),
          retVal = mixin.getTranslatedPacketSourceDndConfig();
        assert.isObject(retVal);
      });

      it('test hoverDrop with Source nat type', function () {
        var mixin = new TPSMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE', id : 34, 'rule-type' : 'RULE'},
            helper : {h : 'help'}
          },
          testRuleCollection = {isPolicyReadOnly:sinon.spy(function(){
            return false;
          }),
            isGroupPolicy : sinon.spy(function () {
              return false;
            })},
          retVal;
        testNatType = 'SOURCE';
        testIsRuleGrp = false;
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = {ruleCollection : testRuleCollection};
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(true, retVal);
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test hoverDrop with drop not allowed', function () {
        var mixin = new TPSMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE'},
            helper : {h : 'help'}
          },
          testRuleCollection = {isPolicyReadOnly:sinon.spy(function(){
            return true;
          })},
          retVal;
        testNatType = 'SOURCE';
        testIsRuleGrp = true;
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = {ruleCollection : testRuleCollection};
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test hoverDrop with drop not allowed due to Group Policy', function () {
        var mixin = new TPSMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE'},
            helper : {h : 'help'}
          },
          testRuleCollection = {isPolicyReadOnly:sinon.spy(function(){
            return true;
          }),
            isGroupPolicy : sinon.spy(function () {
              return true;
            })},
          retVal;
        testNatType = 'SOURCE';
        testIsRuleGrp = true;
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = {ruleCollection : testRuleCollection};
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test hoverDrop with drop not allowed when rule type is not SOURCE', function () {
        var mixin = new TPSMixin (),
          testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'DESTINATION'},
            helper : {h : 'help'}
          },
          testRuleCollection = {isPolicyReadOnly:sinon.spy(function(){
            return false;
          }),
            isGroupPolicy : sinon.spy(function () {
              return false;
            })},
          retVal;
        testNatType = 'DESTINATION';
        testIsRuleGrp = false;
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = {ruleCollection : testRuleCollection};
        retVal = mixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(mixin.getRuleModel.calledWith(testCallback.hoveredRow.id));
      });

      it('test validateItems nat_tps_cell_only_one_nat_pool_drop_allowed', function () {
        var mixin = new TPSMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'ABC'},
          testDragItems = [1,2,3],
          testDragType = 'ADDRESS_ILA',
          testRetVal = {isValid: false,
            errorMessage: 'nat_tps_cell_only_one_nat_pool_drop_allowed'};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });

      it('test validateItems SOURCE rule with INTERFACE translation', function () {
        var mixin = new TPSMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'SOURCE', 'translated-traffic-match-type' : 'INTERFACE'},
          testDragItems = [],
          testDragType = 'ADDRESS_ILA',
          testRetVal = {isValid: false, errorMessage: 'nat_tps_cell_source_rule_only_one_source_nat_pool_allowed_and_translation_is_not_interface'};
        testNatType = 'SOURCE';
        testTranslationType = 'INTERFACE';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });

      it('test validateItems SOURCE rule without INTERFACE translation, with drag type NATPOOL but destination natpool type ', function () {
        var mixin = new TPSMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'SOURCE', 'translated-traffic-match-type' : 'POOL'},
          testDragItems = [{'pool-type' : 1}],
          testDragType = 'NATPOOL',
          testRetVal = {isValid: false, errorMessage: 'nat_tps_cell_source_rule_only_one_source_nat_pool_allowed_and_translation_is_not_interface'};
        testNatType = 'SOURCE';
        testTranslationType = 'POOL';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.deepEqual(retVal, testRetVal);

      });

      it('test validateItems SOURCE rule without INTERFACE translation, with drag type NATPOOL and source natpool type', function () {
        var mixin = new TPSMixin({
            context : context
          }),

          testHoveredRowData = {'nat-type' : 'SOURCE', 'translated-traffic-match-type' : 'POOL'},
          testDragItems = [{'pool-type' : 0}],
          testDragType = 'NATPOOL';
        testNatType = 'SOURCE';
        testTranslationType = 'POOL';
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var retVal = mixin.validateItems(testHoveredRowData, testDragItems, testDragType);
        assert.equal(retVal, true);

      });

      it('test getDragItems for group policy', function () {
        var mixin = new TPSMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function () {
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
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, false);
      });

      it('test getDragItems for device policy and SOURCE rule but no natPool', function () {
        var mixin = new TPSMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function () {
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'SOURCE',
            'translated-packet' :{
              'translated-address' : [223],
              'pool-addresses' : {}
            }
          }];
        testNatType = 'SOURCE';
        testTranslationNatPool = {};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, false);
      });

      it('test getDragItems for device policy and SOURCE rule and natpool defined', function () {
        var mixin = new TPSMixin();
        var testRuleGridConfigInstance = {
            ruleCollection: {
              isGroupPolicy : function () {
                return false;
              }
            }
          },
          testDragHelper = [{}],
          testDraggedItemsRowData = [{
            'nat-type' : 'SOURCE',
            'translated-packet' :{
              'translated-address' : [5],
              'pool-addresses' : {a:'a', 'pool-type': 0}
            }
          }];
        testNatType = 'SOURCE';
        testTranslationNatPool = {a:'a', 'pool-type': 0};
        mixin.getRuleModel = sinon.spy(testGetRuleModel);
        mixin.ruleGridConfigInstance = testRuleGridConfigInstance;

        var ret = mixin.getDragItems(testDraggedItemsRowData, testDragHelper);
        assert.equal(ret, true);
        assert.deepEqual(testDragHelper[0].draggedItems, [testDraggedItemsRowData[0]['translated-packet']['pool-addresses']]);
        assert.equal(testDragHelper[0].dragObjectType, 'NATPOOL');
      });

      deleteContext('testNatRulesGridTranslatedPacketDestinationColumnMixin');

    });
  });
});