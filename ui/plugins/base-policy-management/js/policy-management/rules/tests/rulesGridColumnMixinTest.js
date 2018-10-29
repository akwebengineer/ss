define(['../conf/rulesGridColumnMixin.js'], function(ColumnMixin) {

    describe(' Drag n Drop related mixin tests', function() {
        var gridColumnMixin = new ColumnMixin({});

        it('before drag', function() {
            var callbackData = {
                    data: [],
                    draggableRows: [],
                    helper: [{
                        'draggedItems': []
                    }]
                },
                spydragItems = sinon.spy();
            var draggedAddressObjects = [{
                    id: 1
                }, {
                    id: 2
                }],
                otherAddressObjects = [{
                    id: 3
                }, {
                    id: 4
                }],
                draggedItemsRowData = [{
                    a: '1',
                    b: 12,
                    c: 'String',
                    iamcolumn: {
                        addresses: {
                            'address-reference': otherAddressObjects.concat(draggedAddressObjects)
                        }
                    }
                }];

            var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
            createDragHtmlItems(draggedAddressObjects, pNode);
            spydragItems = sinon.spy();
            gridColumnMixin.getDraggedItems = spydragItems;
            gridColumnMixin.ruleGridConfigInstance = {ruleCollection : {isPolicyReadOnly : function (){return false;}}};

            gridColumnMixin.beforeDrag(callbackData).should.be.equal(true);
            assert(spydragItems.calledOnce);
            expect(spydragItems.calledWith(draggedItemsRowData, $('div[data-tooltip]', pNode[0])));

        });
        it('before drag test when drag not allowed', function() {
          var callbackData = {
              data: [],
              draggableRows: [],
              helper: [{
                'draggedItems': []
              }]
            },
            spydragItems = sinon.spy();
          var draggedAddressObjects = [{
              id: 1
            }, {
              id: 2
            }],
            otherAddressObjects = [{
              id: 3
            }, {
              id: 4
            }],
            draggedItemsRowData = [{
              a: '1',
              b: 12,
              c: 'String',
              iamcolumn: {
                addresses: {
                  'address-reference': otherAddressObjects.concat(draggedAddressObjects)
                }
              }
            }];

          var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
          createDragHtmlItems(draggedAddressObjects, pNode);
          spydragItems = sinon.spy();
          gridColumnMixin.getDraggedItems = spydragItems;
          var spyIsPolicyReadOnly = sinon.spy(function (){return true;});
          gridColumnMixin.ruleGridConfigInstance = {ruleCollection : {isPolicyReadOnly : spyIsPolicyReadOnly}};

          gridColumnMixin.beforeDrag(callbackData).should.be.equal(false);
          assert(spyIsPolicyReadOnly.calledOnce);
          expect(spydragItems.notCalled);

        });
        it('Test HoverDrop drop not allowed', function() {
          var testCallbackData = {
            hoveredRow : {
              id : 45,
              'rule-type' : 'RULEGROUP'
            }
          };
          var gridMixin = new ColumnMixin({}), spyIsPolicyReadOnly = sinon.spy(function (){return true;}),
            spyIsRuleGroup = sinon.spy(function () {
              return true;
            });

          gridMixin.ruleGridConfigInstance = {ruleCollection : {isPolicyReadOnly : spyIsPolicyReadOnly}};
          gridMixin.getRuleModel = sinon.spy(function () {
            return {
              isRuleGroup : spyIsRuleGroup
            }
          });
          var isAllowed = gridMixin.hoverDrop(testCallbackData);
          assert.equal(isAllowed, false);
          assert(spyIsPolicyReadOnly.notCalled);
          assert(spyIsRuleGroup.calledOnce);
          assert(gridMixin.getRuleModel.calledWith(testCallbackData.hoveredRow.id));
        });
        it('Test HoverDrop drop allowed', function() {
          var testCallbackData = {
            hoveredRow : {
              id : 45,
              'rule-type' : 'RULE'
            }
          };
          var gridMixin = new ColumnMixin({}), spyIsPolicyReadOnly = sinon.spy(function (){return false;}),
            spyIsRuleGroup = sinon.spy(function () {
              return false;
            });

          gridMixin.ruleGridConfigInstance = {ruleCollection : {isPolicyReadOnly : spyIsPolicyReadOnly}};
          gridMixin.getRuleModel = sinon.spy(function () {
            return {
              isRuleGroup : spyIsRuleGroup
            }
          });
          var isAllowed = gridMixin.hoverDrop(testCallbackData);
          assert.equal(isAllowed, true);
          assert(spyIsPolicyReadOnly.calledOnce);
          assert(spyIsRuleGroup.calledOnce);
          assert(gridMixin.getRuleModel.calledWith(testCallbackData.hoveredRow.id));
        });

        function createDragHtmlItems(draggedAddressObjects, pNode) {
            $.each(draggedAddressObjects, function(index, item) {
                var tmpNode = $('<div/>');
                tmpNode.attr('data-tooltip', String(item.id));
                pNode.append(tmpNode);
            });
        }

        it('Test getDraggedAddress dragged items match', function() {
            var spydragItems, draggedAddressObjects = [{
                    id: 1
                }, {
                    id: 2
                }],
                otherAddressObjects = [{
                    id: 3
                }, {
                    id: 4
                }],
                draggedItemsRowData = [{
                    a: '1',
                    b: 12,
                    c: 'String',
                    iamcolumn: {
                        addresses: {
                            'address-reference': otherAddressObjects.concat(draggedAddressObjects)
                        }
                    }
                }];
            var gridColumnMixin = new ColumnMixin({});
            var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
            createDragHtmlItems(draggedAddressObjects, pNode);

            spydragItems = sinon.spy(function() {
                return draggedAddressObjects;
            });

            gridColumnMixin.getDragItems = spydragItems;

            var draggedAddress = gridColumnMixin.getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
            assert(spydragItems.calledOnce);
            assert(spydragItems.calledWith(draggedItemsRowData, $('div[data-tooltip]', pNode[0])));
            assert.deepEqual(draggedAddress, draggedAddressObjects);

            pNode.remove();
        });

        it('Test getDraggedAddresses no items match for drag', function() {
            var gridColumnMixin = new ColumnMixin({});
            var spydragItems, draggedAddressObjects = [{
                    id: 1
                }, {
                    id: 2
                }],
                otherAddressObjects = [{
                    id: 3
                }, {
                    id: 4
                }],
                draggedItemsRowData = [{
                    a: '1',
                    b: 12,
                    c: 'String',
                    iamcolumn: {
                        addresses: {
                            'address-reference': otherAddressObjects
                        }
                    }
                }];
            var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
            createDragHtmlItems(draggedAddressObjects, pNode);

            spydragItems = sinon.spy(function() {
                return otherAddressObjects;
            });

            gridColumnMixin.getDragItems = spydragItems;

            var draggedAddress = gridColumnMixin.getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
            assert(spydragItems.calledOnce);
            assert(spydragItems.calledWith(draggedItemsRowData, $('div[data-tooltip]', pNode[0])));
            assert.deepEqual(draggedAddress, []);
            pNode.remove();
        });

        it('Test AfterDrop with validation error', function() {
            var gridColumnMixin = new ColumnMixin({});
            var callbackData = {},
                pNode = $('<div aria-describedby="a_iamcolumn.test""/>');
            callbackData['dropColumn'] = pNode;
            callbackData['droppableRow'] = 'DropRow';
            callbackData['draggableRows'] = 'Draggeable Rooowoahh';
            callbackData['draggableItems'] = 'Draggable Items';
            callbackData['helper'] = [{
                draggedItems: 'draggedMe'
            }];

            var validateItemStub, mergeItemStub;

            validateItemStub = sinon.spy(function() {
                return 'Error Roar';
            });
            gridColumnMixin.validateItems = validateItemStub;

            mergeItemStub = sinon.spy();
            gridColumnMixin.mergeItems = mergeItemStub;

            var retValue = gridColumnMixin.afterDrop(callbackData);
            assert.equal('Error Roar', retValue);

            assert(validateItemStub.calledOnce);
            assert(validateItemStub.calledWithExactly('draggedMe', callbackData.droppableRow, callbackData.dropColumn));

            assert(mergeItemStub.notCalled);

            pNode.remove();

        });

        it('Test afterDrop with NO error', function() {
            var gridColumnMixin = new ColumnMixin({});
            var callbackData = {},
                pNode = $('<div aria-describedby="a_iamcolumn.test""/>');
            callbackData['dropColumn'] = pNode;
            callbackData['droppableRow'] = 'DropRow';
            callbackData['draggableRows'] = 'Draggeable Rooowoahh';
            callbackData['draggableItems'] = 'Draggable Items';
            callbackData['helper'] = [{
                draggedItems: 'draggedMe'
            }];
            var validateItemStub, mergeItemStub;

            validateItemStub = sinon.spy(function() {
                return '';
            });
            gridColumnMixin.validateItems = validateItemStub;

            mergeItemStub = sinon.spy();
            gridColumnMixin.mergeItems = mergeItemStub;
            var retValue = gridColumnMixin.afterDrop(callbackData);
            assert.equal(false, retValue);

            assert(validateItemStub.calledOnce);
            assert(validateItemStub.calledWithExactly('draggedMe', callbackData.droppableRow, callbackData.dropColumn));

            assert(mergeItemStub.calledWithExactly('draggedMe', callbackData.droppableRow, callbackData.dropColumn));

            pNode.remove();


        });

    });


});