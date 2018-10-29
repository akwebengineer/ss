/**
 * Created by skesarwani on 8/16/16.
 */
define([], function () {

  var testMergedArray = [], testIsMerged = false, spyMergeObjectArrays = sinon.spy(function (a,b,c, retMergeArr) {
    $.each(testMergedArray, function(index, item){
      retMergeArr.push(item);
    });
    return testIsMerged;
  });
  var stubs = {
    '/installed_plugins/ui-common/js/common/utils/SmUtil.js': function () {
      this.mergeObjectArrays = spyMergeObjectArrays
    }
  };
  var context = createContext(stubs, 'testfwRulesGridAddressColumnMixin');
  context(['/installed_plugins/fw-policy-management/js/firewall/rules/conf/fwRulesGridAddressColumnMixin.js'], function (AddressColumnMixin) {
    describe.skip('Address Column Drag n Drop related mixin tests', function () {
      var addressColumnMixin = new AddressColumnMixin({});
      it('Test getAddressDndConfig', function () {
        var testConfig = addressColumnMixin.getAddressDndConfig();
        assert.isObject(testConfig);
      });

      function createDragHtmlItems(draggedAddressObjects, pNode) {
        $.each(draggedAddressObjects, function (index, item) {
          var tmpNode = $('<div/>');
          tmpNode.attr('data-tooltip', String(item.id));
          pNode.append(tmpNode);
        });
      }
      it('test dragItems',function() {
        var draggedAddressObjects = [{id:1}, {id:2}], otherAddressObjects = [{id:1}, {id:2}], draggedItemsRowData = [{
          a: '1',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddressObjects
            }
          }
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);

        
        dragvalues = addressColumnMixin.getDragItems(draggedItemsRowData ,$('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedAddressObjects);
      });
      
      it('Test getDraggedAddresses dragged items match', function () {
        var draggedAddressObjects = [{id:1}, {id:2}], otherAddressObjects = [{id:3}, {id:4}], draggedItemsRowData = [{
          a: '1',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddressObjects.concat(draggedAddressObjects)
            }
          }
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);

        var draggedAddress = addressColumnMixin.getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(draggedAddress, draggedAddressObjects);
        pNode.remove();
      });
      it('Test getDraggedAddresses no items match for drag', function () {
        var draggedAddressObjects = [{id:1}, {id:2}], otherAddressObjects = [{id:3}, {id:4}], draggedItemsRowData = [{
          a: '1',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddressObjects
            }
          }
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);

        var draggedAddress = addressColumnMixin.getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(draggedAddress, []);
        pNode.remove();
      });

      it('Test validateAddress ANY address can not be dropped along with any other address', function () {

        var Any_Address = {'address-type' : 'ANY'},
          draggedItemsRowData = {
            iamcolumn: {
              'exclude-list' : false
            }
          }, otherAddress = {'address-type' : 'ABC'};
        var tmpObj = {
          policy : {
            'policy-type' : 'EXTREMETEST'
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(Any_Address, pNode);

        addressColumnMixin.ruleGridConfigInstance= {ruleCollection : tmpObj,context : {
            getMessage : function () {
                var msg = 'ANY address can not be dropped along with any other address';
              return msg;}
          }};
        var validateErr = addressColumnMixin.validateItems([Any_Address, otherAddress], draggedItemsRowData, pNode);
        var error = {isValid: false, errorMessage: 'ANY address can not be dropped along with any other address'};
        assert.deepEqual(validateErr, error);
        addressColumnMixin.ruleGridConfigInstance = null;
      });

      it('Test validate Address Any, Any Ipv4, Any IPv6, Wildcard, All IPv6 and Dynamic address cannot be configured with Negate Address configuration', function () {

        var draggedAddressObjects = [{id:1}, {id:2}],draggedItemsRowData = {
          iamcolumn: {
            'exclude-list': true
          }
        };
        var tmpObj = {
          policy : {
            'policy-type' : 'EXTREMETEST'
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);

        addressColumnMixin.ruleGridConfigInstance= {ruleCollection : tmpObj,context : {
            getMessage : function () {
                var msg = 'Any, Any Ipv4, Any IPv6, Wildcard, All IPv6 and Dynamic address cannot be configured with Negate Address configuration';
              return msg;}
          }};

        $.each(['ANY', 'ANY_IPV4', 'ANY_IPV6', 'WILDCARD', 'ALL_IPV6','DYNAMIC_ADDRESS_GROUP'], function (index, item) {

          var addressArr = [{'address-type' : item}];
          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          var error = {isValid: false, errorMessage: 'Any, Any Ipv4, Any IPv6, Wildcard, All IPv6 and Dynamic address cannot be configured with Negate Address configuration'};
          assert.deepEqual(validateErr, error);
        });

        addressColumnMixin.ruleGridConfigInstance = null;
      });

      it('Test validate Address Device policy can not have variable address', function () {

        var draggedAddressObjects = [{id:1}, {id:2}],draggedItemsRowData = {
          iamcolumn: {
            'exclude-list': false
          }
        };
        var tmpObj = {
          policy : {
            'policy-type' : 'DEVICE'
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);


        addressColumnMixin.ruleGridConfigInstance= {ruleCollection : tmpObj,context : {
            getMessage : function () {
                var msg = 'Device policy can not have variable address';
              return msg;}
          }};

        $.each(['POLYMORPHIC','DYNAMIC_ADDRESS_GROUP'], function (index, item) {

          var addressArr = [{'address-type' : item}];
          var validateErr = addressColumnMixin.validateItems(addressArr, draggedItemsRowData, pNode);
          var error = {isValid: false, errorMessage: 'Device policy can not have variable address'};
          assert.deepEqual(validateErr, error);
        });

        addressColumnMixin.ruleGridConfigInstance = null;
      });

      it('Test merge if dragged items has ANY', function () {

        var draggedAddressObjects = [{id:1, 'address-type' : 'ANY'}], otherAddressObjects = [{id:3}, {id:4}], draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddressObjects
            }
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        addressColumnMixin.ruleGridConfigInstance= { ruleCollection : {
          get : sinon.spy(function () {return {
            set : setSpy,
            toJSON: toJsonSpy
          }}),
          modifyRule : modifyRuleSpy
        }};
        addressColumnMixin.mergeItems(draggedAddressObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['addresses']['address-reference'], draggedAddressObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn' : draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
        addressColumnMixin.ruleGridConfigInstance = null;
      });

      it('Test merge if dropped row address item is ANY', function () {

        var otherAddress = [{id:1, 'address-type' : 'ANY'}], draggedAddressObjects = [{id:3, 'address-type' : 'HH'}, {id:4, 'address-type' : 'TET'}], draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddress
            }
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        addressColumnMixin.ruleGridConfigInstance = {ruleCollection : {
          get : sinon.spy(function () {return {
            set : setSpy,
            toJSON: toJsonSpy
          }}),
          modifyRule : modifyRuleSpy
        }};
        addressColumnMixin.mergeItems(draggedAddressObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['addresses']['address-reference'], draggedAddressObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn' : draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
        addressColumnMixin.ruleGridConfigInstance = null;
      });

      it('Test merge with mock mergeObjectsArray method call', function () {

        var otherAddress = [{id:1, 'address-type' : 'YAHOO'}], draggedAddressObjects = [{id:3, 'address-type' : 'HH'}, {id:4, 'address-type' : 'TET'}], draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          iamcolumn: {
            addresses : {
              'address-reference' : otherAddress
            }
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedAddressObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        addressColumnMixin.ruleGridConfigInstance = {ruleCollection :{
          get : sinon.spy(function () {return {
            set : setSpy,
            toJSON: toJsonSpy
          }}),
          modifyRule : modifyRuleSpy
        }};
        testMergedArray = draggedAddressObjects;
        testIsMerged = true;
        addressColumnMixin.mergeItems(draggedAddressObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['addresses']['address-reference'], draggedAddressObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn' : draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
        addressColumnMixin.ruleGridConfigInstance = null;
        testIsMerged = false;
        testMergedArray = [];
      });

      it('Test addressCellAfterDrop with validation error', function () {
        var callbackData = {}, pNode = $('<div aria-describedby="a_iamcolumn.test""/>');
        callbackData['dropColumn'] = pNode;
        callbackData['droppableRow'] = 'DropRow';
        callbackData['draggableRows'] = 'Draggeable Rooowoahh';
        callbackData['draggableItems'] = 'Draggable Items';
        callbackData['helper'] = [{draggedItems: 'draggedMe'}];
        var getDraggedAddressesStub = sinon.stub(addressColumnMixin,'getDraggedItems', function () {
            return 'draggedMe';
          }), validateAddressStub = sinon.stub(addressColumnMixin, 'validateItems', function () {
            return 'Error Roar';
          }),
          mergeAddressesStub = sinon.stub(addressColumnMixin, 'mergeItems');

        var retValue = addressColumnMixin.afterDrop(callbackData);
        assert.equal('Error Roar', retValue);

        assert(validateAddressStub.calledOnce);
        assert(validateAddressStub.calledWithExactly('draggedMe', callbackData.droppableRow, callbackData.dropColumn));

        assert(mergeAddressesStub.notCalled);

        pNode.remove();
        getDraggedAddressesStub.restore();
        validateAddressStub.restore();
        mergeAddressesStub.restore();

      });

      it('Test afterDrop with NO error', function () {
        var callbackData = {}, pNode = $('<div aria-describedby="a_iamcolumn.test""/>');
        callbackData['dropColumn'] = pNode;
        callbackData['droppableRow'] = 'DropRow';
        callbackData['draggableRows'] = 'Draggeable Rooowoahh';
        callbackData['draggableItems'] = 'Draggable Items';
        callbackData['helper'] = [{draggedItems: 'draggedMe'}];
        var validateAddressStub = sinon.stub(addressColumnMixin, 'validateItems', function () {
            return '';
          }),
          mergeAddressesStub = sinon.stub(addressColumnMixin, 'mergeItems');

        var retValue = addressColumnMixin.afterDrop(callbackData);
        assert.equal(false, retValue);

        assert(validateAddressStub.calledOnce);
        assert(validateAddressStub.calledWithExactly('draggedMe', callbackData.droppableRow, callbackData.dropColumn));

        assert(mergeAddressesStub.calledWithExactly('draggedMe', callbackData.droppableRow,  callbackData.dropColumn));

        pNode.remove();
        validateAddressStub.restore();
        mergeAddressesStub.restore();

      });
    });
//    mocha.run();
  });
});

