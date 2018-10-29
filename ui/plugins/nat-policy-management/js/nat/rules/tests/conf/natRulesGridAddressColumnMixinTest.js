/**
 * Created by vijayat.
 */
define([], function () {

  var testMergedArray = [], testIsMerged = false,
    spyMergeObjectArrays = sinon.spy(function (a,b,c, retMergeArr) {
      $.each(testMergedArray, function(index, item){
        retMergeArr.push(item);
      });
      return testIsMerged;
    });
    var MockSmUtil = function () {
        this.mergeObjectArrays = spyMergeObjectArrays
    }
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
    hoverDrop : spyParentHoverDrop,
    beforeDrag :spyParentHoverDrop,
    afterDrop :spyParentHoverDrop
  };
  
  var stubs = {
   '/installed_plugins/sd-common/js/common/utils/SmUtil.js': MockSmUtil,
   '/installed_plugins/base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js': MockColumnMixin
  };
  var exceutecontext = createContext(stubs, 'testnatRulesGridAddressColumnMixin');
  exceutecontext(['/installed_plugins/nat-policy-management/js/nat/rules/conf/natRulesGridAddressColumnMixin.js'], function (AddressColumnMixin) {
    describe('NAT Address Column Drag n Drop related mixin tests', function () {
 var addressColumnMixin = new AddressColumnMixin({ context : context});
      var testNatType,
        testgetSourceAddress,
        testgetDestinationAddress,
       
        testgetOriginalPacket,
        testToJson,
        spySet,
        testGetRuleModel = function () {
          return {
            getNatType : function () {
              return testNatType;
            },
            getSourceAddress : function () {
              return testgetSourceAddress;
            },
            getDestinationAddress : function () {
              return testgetDestinationAddress;
            },
            
            getOriginalPacket : function () {
              return testgetOriginalPacket;
            },
            toJSON : function () {
              return testToJson;
            },
            set : spySet
        };
      };
     it('Test getAddressDndConfig', function () {
        var testConfig = addressColumnMixin.getAddressDndConfig();
        assert.isObject(testConfig);
     
      });
      it('test hoverDrop with  allowed', function () {
        var testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE', id: 96},
            helper : [{'dragObjectType' : 'ADDRESS'}]
          },
          retVal;
        testMockedParentHoverDrop = true;
        retVal = addressColumnMixin.hoverDrop(testCallback);
        assert.equal(true, retVal);
        assert(spyParentHoverDrop.calledWith(testCallback));
      });
      it('test hoverDrop with not allowed', function () {
        var testCallback = {
            hoveredRow : {a:2, 'nat-type' : 'SOURCE', id: 96},
            helper : [{'dragObjectType' : 'ADDRESS'}]
          },
          retVal;
        testMockedParentHoverDrop = false;
        retVal = addressColumnMixin.hoverDrop(testCallback);
        assert.equal(false, retVal);
        assert(spyParentHoverDrop.calledWith(testCallback));
      });
       function createDragHtmlItems(draggedAddressObjects, pNode) {
        $.each(draggedAddressObjects, function (index, item) {
          var tmpNode = $('<div/>');
          tmpNode.attr('data-tooltip', String(item.id));
          pNode.append(tmpNode);
        });
      }
      it('test dragItems source address- single cell ',function() {      

        var  draggedAddressObjects = [{ id:12,name:'Any_IPV4'}],
             testDraggedItemsRowData = [{
            'id' :234,
            'nat-type' : 'ABC',
            'original-packet' :{
              'src-address' : {'address-reference':[{ id:12,name:'Any_IPV4'}] }
            }
          }],
         testDragHelper = [{}];
        testgetSourceAddress = draggedAddressObjects;
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
       var pNode = $('<td aria-describedby="a_original-packet.src-address.address-reference"/>');
        createDragHtmlItems(draggedAddressObjects, pNode);
       
        dragvalues = addressColumnMixin.getDragItems(testDraggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedAddressObjects);

      });
      it('test dragItems source address-multiple cell drag',function() {      

        var  draggedAddressObjects = [{ id:12,name:'Any_IPV4'},{ id:12,name:'Aol'}],
             testDraggedItemsRowData = [{
            'id' :234,
            'nat-type' : 'ABC',
            'original-packet' :{
              'src-address' : {'address-reference':[{ id:12,name:'Any_IPV4'},{ id:12,name:'Aol'}] }
            }
          }],
        testDragHelper = [{}];
        testgetSourceAddress = draggedAddressObjects;
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
       var pNode = $('<td aria-describedby="a_original-packet.src-address.address-reference"/>');
        createDragHtmlItems(draggedAddressObjects, pNode);
       
        dragvalues = addressColumnMixin.getDragItems(testDraggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedAddressObjects);

      });
      it('test dragItems destination address- single cell ',function() {      

        var  draggedAddressObjects = [{ id:12,name:'Any_IPV4'}],
             testDraggedItemsRowData = [{
            'id' :234,
            'nat-type' : 'ABC',
            'original-packet' :{
              'dst-address' : {'address-reference':[{ id:12,name:'Any_IPV4'}] }
            }
          }],
         testDragHelper = [{}];
        testgetDestinationAddress = draggedAddressObjects;
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
       var pNode = $('<td aria-describedby="a_original-packet.dst-address.address-reference"/>');
        createDragHtmlItems(draggedAddressObjects, pNode);
       
        dragvalues = addressColumnMixin.getDragItems(testDraggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedAddressObjects);

      });
      it('test dragItems destination address-multiple cell drag',function() {      

        var  draggedAddressObjects = [{ id:12,name:'Any_IPV4'},{ id:12,name:'Aol'}],
             testDraggedItemsRowData = [{
            'id' :234,
            'nat-type' : 'ABC',
            'original-packet' :{
              'dst-address' : {'address-reference':[{ id:12,name:'Any_IPV4'},{ id:12,name:'Aol'}] }
            }
          }],
        testDragHelper = [{}];
        testgetDestinationAddress = draggedAddressObjects;
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.dst-address.address-reference"/>');
        createDragHtmlItems(draggedAddressObjects, pNode);
       
        dragvalues = addressColumnMixin.getDragItems(testDraggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedAddressObjects);

      });
      it('Test validate Address type : Any, Wildcard and DNS Host addresses cannot be configured', function () {
        var otherAddressObjects = [{id:3}, {id:4}],
        addressArr = [{'address-type' : 'ANY','name':'ANY'}],
        dragHelper = [],
        draggedItemsRowData = { 
          id:23,
          'nat-type':'SOURCE',
          'original-packet' : {
            'src-address': { 'address-reference':[{'address-type' : 'ANY','name':'ANY'}]
            }
          },
          services : {}

        },
        error = {isValid: false, errorMessage: 'nat_rules_dragdrop_diff_addresstype'};
        testNatType = 'SOURCE';
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.src-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        $.each(['ANY', 'WILDCARD','DNS'], function (index, item) {

          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          assert.deepEqual(validateErr, error);
        });
      });
      it('Test validate Address type : Only single address is allowed for destination address cell for static and destination rules', function () {
        var otherAddressObjects = [{id:3}, {id:4}],
        addressArr = [{'address-type' : 'ANY','name':'ANY'},{'address-type' : 'ANY_IPV4','name':'ANY_IPV4'}],
        dragHelper = [],
        draggedItemsRowData = { 
          id:23,
          'nat-type':'STATIC',
          'original-packet' : {
            'dst-address': { 'address-reference':[{'address-type' : 'ANY','name':'ANY'},{'address-type' : 'ANY_IPV4','name':'ANY_IPV4'}]
            }
          },
          services : {}

        },
        error = {isValid: false, errorMessage: 'nat_static&dest_rules_dragdrop_single_address'};
        testNatType = 'STATIC';
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.dst-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
        assert.deepEqual(validateErr, error);
       
      });
      it('Test validate Address type : Any, Wildcard, Group, Range and DNS Host addresses cannot be configured for destination rule', function () {
        var otherAddressObjects = [{id:3}, {id:4}],
        addressArr = [{'address-type' : 'ANY','name':'ANY'}],
        dragHelper = [],
        draggedItemsRowData = { 
          id:23,
          'nat-type':'DESTINATION',
          'original-packet' : {
            'dst-address': { 'address-reference':[{'address-type' : 'ANY','name':'ANY'}]
            }
          },
          services : {}

        },
        error = {isValid: false, errorMessage: 'nat_dest_rules_dragdrop_multiple_addresstype'};
        testNatType = 'DESTINATION';
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.dst-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        $.each(['ANY','WILDCARD', 'GROUP', 'RANGE', 'DNS'], function (index, item) {
          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          assert.deepEqual(validateErr, error);
        });
       
      });
      it('Test validate Address type : Any, Any-IPv4, Any-IPv6, Wildcard, Group, Range and DNS Host addresses cannot be configured for static nat Type', function () {
        var otherAddressObjects = [{id:3}, {id:4}],
        addressArr = [{'address-type' : 'ANY','name':'ANY'}],
        dragHelper = [],
        draggedItemsRowData = { 
          id:23,
          'nat-type':'STATIC',
          'original-packet' : {
            'dst-address': { 'address-reference':[{'address-type' : 'ANY','name':'ANY'}]
            }
          },
          services : {}

        },
        error = {isValid: false, errorMessage: 'nat_static_rules_dragdrop_diff_addresstype'};
        testNatType = 'STATIC';
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.dst-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        $.each(['ANY','ANY_IPV4', 'ANY_IPV6','WILDCARD', 'GROUP', 'RANGE', 'DNS'], function (index, item) {
          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          assert.deepEqual(validateErr, error);
        });
       
      });
      it('Test validate Address type : success case', function () {
        var otherAddressObjects = [{id:3}, {id:4}],
        addressArr = [{'address-type' : 'IPADDRESS','name':'aol'}],
        dragHelper = [],
        draggedItemsRowData = { 
          id:23,
          'nat-type':'SOURCE',
          'original-packet' : {
            'src-address': { 'address-reference':[{'address-type' : 'IPADDRESS','name':'aol'}]
            }
          },
          services : {}

        },
        error = null;
        testNatType = 'SOURCE';
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        var pNode = $('<td aria-describedby="a_original-packet.src-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        $.each(['ANY','ANY_IPV4', 'ANY_IPV6','WILDCARD', 'GROUP', 'RANGE', 'DNS'], function (index, item) {
          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          assert.deepEqual(validateErr, error);
        });
       
      });
    it('Test merge dragged address- static nat type', function () {
        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
        draggedAddressObjects = [{id:1, 'address-type' : 'RANGE'}], 
        otherAddressObjects = [{id:1, 'address-type' : 'ANY_IPV4'}], 
        draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          'iamcolumn': {
            'dst-address' : {
              'address-reference' : otherAddressObjects
            }
          }
        };
               
        var pNode = $('<td aria-describedby="a_iamcolumn.dst-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        testNatType = 'STATIC';
         testToJson = 'retVal';
        testgetOriginalPacket = {'dst-address' : {
              'address-reference' : otherAddressObjects
            }};
        testgetDestinationAddress = {id:1, 'address-type' : 'ANY_IPV4'};
        spySet = sinon.spy();
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        addressColumnMixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        addressColumnMixin.mergeItems( draggedAddressObjects,draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['dst-address']['address-reference'], otherAddressObjects);
        assert(spySet.calledOnce);
        assert(spySet.calledWith('original-packet', testgetOriginalPacket));

        assert(spyModifyRule.calledOnce);
        assert(spyModifyRule.calledWithExactly('retVal', {'makeRowEditable': false}));
      });
      it('Test merge dragged address -  with mock mergeObjectsArray  ', function () {
        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
        draggedAddressObjects = [{id:1, 'address-type' : 'RANGE'}], 
        otherAddressObjects = [{id:1, 'address-type' : 'ANY_IPV4'}], 
        draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          'iamcolumn': {
            'src-address' : {
              'address-reference' : otherAddressObjects
            }
          }
        };
               
        var pNode = $('<td aria-describedby="a_iamcolumn.src-address.address-reference"/>');
        createDragHtmlItems(otherAddressObjects, pNode);
        testNatType = 'SOURCE';
         testToJson = 'retVal';
           testMergedArray = draggedAddressObjects;
        testIsMerged = true;
        testgetOriginalPacket = {'src-address' : {
              'address-reference' : otherAddressObjects
            }};
        testgetSourceAddress = {id:1, 'address-type' : 'ANY_IPV4'};
        spySet = sinon.spy();
        addressColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        addressColumnMixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        addressColumnMixin.mergeItems( draggedAddressObjects,draggedItemsRowData, pNode);
        assert(spySet.calledOnce);
        assert(spySet.calledWith('original-packet', testgetOriginalPacket));
        assert(spyModifyRule.calledOnce);
        assert(spyModifyRule.calledWithExactly('retVal', {'makeRowEditable': false}));
        addressColumnMixin.ruleGridConfigInstance = null;
        testIsMerged = false;
        testMergedArray = [];
        });

    });
    deleteContext('testnatRulesGridAddressColumnMixin');

//    mocha.run();
 });
});

