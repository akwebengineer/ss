/**
 * Created by skesarwani on 8/16/16.
 */
define([], function () {

  var testMergedArray = [], testIsMerged = false, spyMergeObjectArrays = sinon.spy(function (a, b, c, d, retMergeArr) {
    $.each(testMergedArray, function (index, item) {
      retMergeArr.push(item);
    });
    return testIsMerged;
  });
  var stubs = {
    '/installed_plugins/ui-common/js/common/utils/SmUtil.js': function () {
      this.mergeObjectArrays = spyMergeObjectArrays
    }
  };
  var context = createContext(stubs, 'testfwRulesGridZoneColumnMixin');
  context(['/installed_plugins/fw-policy-management/js/firewall/rules/conf/fwRulesGridZoneColumnMixin.js'], function (ZoneColumnMixin) {
    describe.skip('Zone Column Drag n Drop related mixin tests', function () {
      it('Test ruleGridConfigInstance is set', function () {
        var testRuleGridConfigInstance = 'testRuleGrid', zoneMixin = new ZoneColumnMixin(testRuleGridConfigInstance);
        assert.deepEqual(zoneMixin.ruleGridConfigInstance, testRuleGridConfigInstance);
      });
      it('Test getZoneDndConfig', function () {
        var testConfigObj = {
          'isDraggable': true,
          'isDroppable': true,
          'groupId': 'ZONE'
        }, testConfig = new ZoneColumnMixin().getZoneDndConfig();
        assert.isObject(testConfig);
        expect(testConfig.callbacks).to.include.keys('beforeDrag', 'hoverDrop', 'afterDrop');
        delete testConfig.callbacks;
        assert.deepEqual(testConfig, testConfigObj);
      });

      function createDragHtmlItems(draggedZoneObjects, pNode) {
        $.each(draggedZoneObjects, function (index, item) {
          var tmpNode = $('<div/>');
          tmpNode.attr('zone-type', item['zone-type']);
          if (item['zone-type'] === 'ZONE') {
            tmpNode.attr('data-name', String(item.name));
          } else if (item['zone-type'] === 'ZONESET') {
            tmpNode.attr('data-id', String(item.id));
          }
          pNode.append(tmpNode);
        });
      }

      it('Test getDraggedItems ', function () {
        var draggedZonesObjects = [
            {name: 'a1', 'zone-type': 'ZONE'},
            {id: 23, 'zone-type': 'ZONESET'},
            {name: 'z2', 'zone-type': 'ZONE'},
            {id: 21, 'zone-type': 'ZONESET'}
          ],
          otherZoneObjects = [
            {name: '3', 'zone-type': 'ZONE'},
            {name: '4', 'zone-type': 'ZONESET'}
          ],
          draggedItemsRowData = [
            {
              a: '1',
              b: 12,
              c: 'String',
              iamcolumn: {
                zone: otherZoneObjects.concat(draggedZonesObjects)
              }
            }
          ];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);
        var draggedZones = new ZoneColumnMixin().getDraggedItems(draggedItemsRowData, $('div', pNode[0]));
        assert.deepEqual(draggedZones, draggedZonesObjects);
        pNode.remove();
      });
      it('Test getDraggedItems no items match for drag', function () {
        var draggedZonesObjects = [
            {name: 'a1', 'zone-type': 'ZONE'},
            {id: 23, 'zone-type': 'ZONESET'},
            {name: 'z2', 'zone-type': 'ZONE'},
            {id: 21, 'zone-type': 'ZONESET'}
          ],
          otherZoneObjects = [
            {name: '3', 'zone-type': 'ZONE'},
            {name: '4', 'zone-type': 'ZONESET'}
          ],
          draggedItemsRowData = [
            {
              a: '1',
              b: 12,
              c: 'String',
              iamcolumn: {
                zone: otherZoneObjects
              }
            }
          ];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);

        var draggedZones = new ZoneColumnMixin().getDraggedItems(draggedItemsRowData, $('div', pNode[0]));
        assert.deepEqual(draggedZones, []);
        pNode.remove();
      });

      it('Test validateItems Global rule can not have ANY zone with any other zone', function () {
        
           var validateErr,zoneColumnMixin = new ZoneColumnMixin({
            context : {
            getMessage : function () {
              var msg = 'For a global rule Any zoneset can not be dropped along with any other zone';
              return msg;}
          }
           });
        
        var Any_Zone = {'zone-type': 'ZONESET', 'name': 'Any', id: 9987},
          draggedItemsRowData = {
            'global-rule': true
          }, otherZone = {'zone-type': 'ZONE', 'name': 'z1',id:34};
         validateErr = zoneColumnMixin.validateItems([Any_Zone, otherZone], draggedItemsRowData);
        var error = {isValid: false,
          errorMessage: 'For a global rule Any zoneset can not be dropped along with any other zone'};
        assert.deepEqual(validateErr, error);
      });

      it('Test validateItems For a zone rule only one zone can be dropped', function () {

        var Any_Zone = {'zone-type': 'ZONESET', 'name': 'Any', id: 9987},
          draggedItemsRowData = {
            'global-rule': false
          }, otherZone = {'zone-type': 'ZONE', 'name': 'z1',id:34};

          var zoneColumnMixin = new ZoneColumnMixin({
            context : {
            getMessage : function () {
              var msg = 'For a zone rule only one zone can be dropped';
              return msg;}
          }
           });
        var validateErr = zoneColumnMixin.validateItems([Any_Zone, otherZone], draggedItemsRowData);
        var error = {isValid: false,
        errorMessage: 'For a zone rule only one zone can be dropped'};
        assert.deepEqual(validateErr, error);
      });

      it('Test validateItems For a zone rule zoneset can not be dropped', function () {

        var zoneSet = {'zone-type': 'ZONESET', 'name': 'AnyZoneset', id: 9987},
          draggedItemsRowData = {
            'global-rule': false
          };
        var zoneColumnMixin = new ZoneColumnMixin({
            context : {
            getMessage : function () {
              var msg = 'For a zone rule zoneset can not be dropped';
              return msg;}
          }
        });
        var validateErr = zoneColumnMixin.validateItems([zoneSet], draggedItemsRowData);
        var error = {isValid: false, errorMessage: 'For a zone rule zoneset can not be dropped'};
        assert.deepEqual(validateErr, error);
      });

      it('Test mergeGlobalRuleZonesArrays ', function () {
        var arr1 = [
          {
            k1: 'a',
            'zone-type': 'ZONESET'
          },
          {
            k1: 'z',
            k2: 'b',
            'zone-type': 'ZONESET'
          },
          {
            k2: 'b',
            'zone-type': 'NOZONESET'
          },
          {
            k1: 'a',
            k2: 'f',
            'zone-type': 'NOZONESET'
          }
        ];

        var arr2 = [
          {
            'zone-type': 'NEWZONE',
            k2: 'def'
          },
          {
            'zone-type': 'OLDZONE',
            k2: 'f'
          },
          {
            'zone-type': 'ZONESET',
            k2: 'def',
            k1: 'a'
          },
          {
            'zone-type': 'ZONESET',
            k1: 'newzoneset'
          }
        ];
        var mergeArr = [
          {
            k1: 'a',
            'zone-type': 'ZONESET'
          },
          {
            k1: 'z',
            k2: 'b',
            'zone-type': 'ZONESET'
          },
          {
            k2: 'b',
            'zone-type': 'NOZONESET'
          },
          {
            k1: 'a',
            k2: 'f',
            'zone-type': 'NOZONESET'
          },
          {
            'zone-type': 'NEWZONE',
            k2: 'def'
          },
          {
            'zone-type': 'ZONESET',
            k1: 'newzoneset'
          }
        ];

        var retArr = [], mergedResult = new ZoneColumnMixin().mergeGlobalRuleZonesArrays(arr1, arr2, 'k1', 'k2', retArr);

        assert.equal(true, mergedResult);
        assert.deepEqual(retArr, mergeArr);
      });

      it('Test mergeGlobalRuleZonesArrays when no merge happens', function () {
        var arr1 = [
          {
            k1: 'a',
            'zone-type': 'ZONESET'
          },
          {
            k1: 'z',
            k2: 'b',
            'zone-type': 'ZONESET'
          },
          {
            k2: 'b',
            'zone-type': 'NOZONESET'
          },
          {
            k1: 'a',
            k2: 'f',
            'zone-type': 'NOZONESET'
          }
        ];

        var arr2 = [
          {
            'zone-type': 'OLDZONE',
            k2: 'f'
          },
          {
            'zone-type': 'ZONESET',
            k2: 'def',
            k1: 'a'
          }
        ];


        var retArr = [], mergedResult = new ZoneColumnMixin().mergeGlobalRuleZonesArrays(arr1, arr2, 'k1', 'k2', retArr);

        assert.equal(false, mergedResult);
        assert.deepEqual(retArr, []);
      });

      it('Test mergeItems in global rule if dragged items has ANY', function () {

        var draggedZonesObjects = [
          {'zone-type': 'ZONESET', 'name': 'Any', id: 9987}
        ], otherZonesObjects = [
          {id: 3},
          {id: 4}
        ], draggedItemsRowData = {
          a: '1',
          id: 'ruleId',
          b: 12,
          c: 'String',
          'global-rule': true,
          iamcolumn: {
            zone: otherZonesObjects
          }
        };

        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);

        var setSpy = sinon.spy(), toJsonSpy = sinon.spy(function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        var zoneMixin = new ZoneColumnMixin({
          ruleCollection: {
            get: sinon.spy(function () {
              return {
                set: setSpy,
                toJSON: toJsonSpy
              }
            }),
            modifyRule: modifyRuleSpy
          }
        });
        zoneMixin.mergeItems(draggedZonesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['zone'], draggedZonesObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn': draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
      });

      it('Test mergeItems in global rule if dropped row address item is ANY', function () {

        var otherZones = [
          {'zone-type': 'ZONESET', 'name': 'Any', id: 9987}
        ], draggedZonesObjects = [
          {id: 3, 'zone-type': 'HH'},
          {id: 4, 'zone-type': 'TET'}
        ], draggedItemsRowData = {
          a: '1',
          id: 'ruleId',
          b: 12,
          c: 'String',
          'global-rule':true,
          iamcolumn: {
            zone: otherZones

          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy(function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();
        var zoneMixin = new ZoneColumnMixin({
          ruleCollection: {
            get: sinon.spy(function () {
              return {
                set: setSpy,
                toJSON: toJsonSpy
              }
            }),
            modifyRule: modifyRuleSpy
          }
        });
        zoneMixin.mergeItems(draggedZonesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['zone'], draggedZonesObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn': draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
      });

      it('Test merge with mock mergeGlobalRuleZonesArrays method call with merge true', function () {

        var otherZones = [
          {'zone-type': 'ZONESET', 'name': 'Z1', id: 9987}
        ], draggedZonesObjects = [
          {'zone-type': 'ZONE', 'name': 'zon1'},
          {'zone-type': 'ZONE', 'name': 'zon2'}
        ], draggedItemsRowData = {
          a: '1',
          id: 'ruleId',
          b: 12,
          c: 'String',
          'global-rule': true,
          iamcolumn: {
            zone: otherZones
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy(function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        var zoneMixin = new ZoneColumnMixin({
          ruleCollection: {
            get: sinon.spy(function () {
              return {
                set: setSpy,
                toJSON: toJsonSpy
              }
            }),
            modifyRule: modifyRuleSpy
          }
        });
        zoneMixin.mergeGlobalRuleZonesArrays = spyMergeObjectArrays;
        testMergedArray = draggedZonesObjects;
        testIsMerged = true;
        zoneMixin.mergeItems(draggedZonesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['zone'], draggedZonesObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn': draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));

        assert(zoneMixin.mergeGlobalRuleZonesArrays.calledWith(otherZones, draggedZonesObjects, 'id', 'name', draggedZonesObjects));
        testMergedArray = draggedZonesObjects;
        testIsMerged = false;
      });
      it('Test merge with mock mergeGlobalRuleZonesArrays method call with merge false', function () {

        var otherZones = [
          {'zone-type': 'ZONESET', 'name': 'Z1', id: 9987}
        ], draggedZonesObjects = [
          {'zone-type': 'ZONE', 'name': 'zon1'},
          {'zone-type': 'ZONE', 'name': 'zon2'}
        ], draggedItemsRowData = {
          a: '1',
          id: 'ruleId',
          b: 12,
          c: 'String',
          'global-rule': true,
          iamcolumn: {
            zone: otherZones
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy(function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        var zoneMixin = new ZoneColumnMixin({
          ruleCollection: {
            get: sinon.spy(function () {
              return {
                set: setSpy,
                toJSON: toJsonSpy
              }
            }),
            modifyRule: modifyRuleSpy
          }
        });
        zoneMixin.mergeGlobalRuleZonesArrays = spyMergeObjectArrays;
        zoneMixin.mergeItems(draggedZonesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['zone'], otherZones);
        assert(setSpy.notCalled);

        assert(toJsonSpy.notCalled);
        assert(modifyRuleSpy.notCalled);
      });

      it('Test mergeItems in zone rule', function () {

        var otherZones = [
          {'zone-type': 'ZONESET', 'name': 'Any', id: 9987}
        ], draggedZonesObjects = [
          {id: 3, 'zone-type': 'HH'},
          {id: 4, 'zone-type': 'TET'}
        ], draggedItemsRowData = {
          a: '1',
          id: 'ruleId',
          b: 12,
          c: 'String',
          'global-rule':false,
          iamcolumn: {
            zone: otherZones

          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedZonesObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy(function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();
        var zoneMixin = new ZoneColumnMixin({
          ruleCollection: {
            get: sinon.spy(function () {
              return {
                set: setSpy,
                toJSON: toJsonSpy
              }
            }),
            modifyRule: modifyRuleSpy
          }
        });
        zoneMixin.mergeItems(draggedZonesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['iamcolumn']['zone'], draggedZonesObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'iamcolumn': draggedItemsRowData['iamcolumn']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
      });
    });
//    mocha.run();
  });
});

